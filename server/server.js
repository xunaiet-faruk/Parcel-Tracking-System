const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const dns =require('dns');
const port = process.env.PORT || 5000;
const crypto = require('crypto');

const admin = require("firebase-admin");

const serviceAccount = require("./zap-shift-firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


function generateTrackingId() {
    const prefix = 'PRCL';
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = crypto.randomBytes(4).toString('hex').toUpperCase();

    return `${prefix}-${date}-${random}`;
}


const stripe = require('stripe')(process.env.STRIPE);
dns.setServers(['1.1.1.1', '8.8.8.8']);


app.use(cors());
app.use(express.json());


const veryFytoken =async(req,res,next) =>{
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).send({meassge : "unauthorized access"})
    }
    try {
        const idToken =token.split(' ')[1];
        const decoded =await admin.auth().verifyIdToken(idToken)
        req.decoded_email =decoded.email
        next()
        console.log("hello junaiet",decoded);
    } catch (error) {
        return res.status(401).send({ meassge: "unauthorized access" })
    }
  
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { url } = require('inspector');
const { trace } = require('console');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.kwkb8qp.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const ParcelCollection = client.db("ZapshiptDB").collection("parcels");
        const PaymentCollection = client.db("ZapshiptDB").collection("payment");
        const UsersCollection = client.db("ZapshiptDB").collection("Users");
        const RiderCollection = client.db("ZapshiptDB").collection("Rider");

        app.post('/parcels', async (req, res) => {
            const parcel = req.body;
            const result = await ParcelCollection.insertOne(parcel);
            res.send(result);
        });

        app.get('/parcels', async (req, res) => {
            const query = {};
            const {email} =req.query;
            if(email){
                query.senderEmail=email
            }
            const parcels = await ParcelCollection.find(query).toArray();
            res.send(parcels);
        });

        app.get('/parcels/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const parcel = await ParcelCollection.findOne(query);
            res.send(parcel);
        });

        app.delete('/parcels/:id',async(req,res)=>{
            const {id} =req.params;
            const query={_id : new ObjectId(id)};
            const result = await ParcelCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/parcels/:id',async(req,res)=>{
            const {id} =req.params;
            const updatedData = req.body;
            const filter ={_id :new ObjectId(id)};
            delete updatedData.senderName;
            delete updatedData.senderEmail;
            delete updatedData.status;
            const updateDoc = {
                $set: {
                    ...updatedData
                }
            };
            const result = await ParcelCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // PAYMENT 
       app.post('/create-payment-intent', async (req, res) => {
             const payInfo = req.body;
           const session = await stripe.checkout.sessions.create({
               line_items: [
                   {
                       // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                       price_data:{
                            currency:'USD',
                            unit_amount: parseInt(payInfo.totalPrice )* 100, 
                            product_data:{
                                name: payInfo.
                                    parcelName,
                            }
                       } ,
                   
                       quantity: 1,
                   },
               ],
               customer_email: payInfo.email,
               mode: 'payment',
               metadata:{
                parcelId: payInfo.parcelId,
                parcelName: payInfo.parcelName,
               },
               success_url: `${process.env.STRIPE_DOMAIN}/dashboard/paymentSuccess?session_id={CHECKOUT_SESSION_ID}`,
               cancel_url: `${process.env.STRIPE_DOMAIN}/dashboard/paymentCancel`,
           });
        
           res.send({url : session.url});

       })

        app.patch('/paymentSuccess', async (req, res) => {
            try {
                const { sessionId } = req.body;

                console.log('Received sessionId:', sessionId);

                if (!sessionId) {
                    return res.status(400).send({ error: 'Session ID required' });
                }

                // First, retrieve the Stripe session
                const session = await stripe.checkout.sessions.retrieve(sessionId);
                console.log('Session payment status:', session.payment_status);
                console.log('Session metadata:', session.metadata);

                if (session.payment_status !== 'paid') {
                    return res.status(400).send({ error: 'Payment not completed' });
                }

                const transactionId = session.payment_intent; // Now session is defined

                // Check if payment already exists
                const query = { transactionId: transactionId };
                const paymentExist = await PaymentCollection.findOne(query);

                if (paymentExist) {
                    return res.send({
                        transactionId: paymentExist.transactionId,
                        trackingId: paymentExist.trackingId
                    });
                }

                // Generate tracking ID
                const trackingId = generateTrackingId();
                const parcelId = session.metadata.parcelId;

                if (!parcelId) {
                    return res.status(400).send({ error: 'Parcel ID not found in session metadata' });
                }

                // Update parcel status
                const updateQuery = { _id: new ObjectId(parcelId) };
                const updateDoc = {
                    $set: {
                        status: 'paid',
                        paymentStatus: 'completed',
                        paidAt: new Date(),
                        trackingId: trackingId,
                        transactionId: transactionId
                    }
                };

                const result = await ParcelCollection.updateOne(updateQuery, updateDoc);
                console.log('Update result:', result);

                if (result.modifiedCount === 0) {
                    return res.status(404).send({ error: 'Parcel not found or already updated' });
                }

                // Create payment record
                const payment = {
                    amount: session.amount_total / 100,
                    currency: session.currency,
                    paymentMethod: session.payment_method_types?.[0] || 'card',
                    paidAt: new Date(),
                    customer_email: session.customer_details?.email || session.customer_email,
                    parcelId: parcelId,
                    parcelName: session.metadata.parcelName,
                    transactionId: transactionId,
                    paymentStatus: session.payment_status,
                    trackingId: trackingId
                };

                const resultPayment = await PaymentCollection.insertOne(payment);

                // Send success response
                res.send({
                    success: true,
                    trackingId: trackingId,
                    transactionId: transactionId,
                    paymentId: resultPayment.insertedId
                });

            } catch (error) {
                console.error('Error in paymentSuccess:', error);
                res.status(500).send({ error: error.message });
            }
        });

        app.get('/payment',veryFytoken,async(req,res)=>{
            const email =req.query.email;
            console.log("token is here",req.headers);
            const query ={}
            if(email){
                query.customer_email =email
            }
            if(email !== req.decoded_email){
                return res.status(403).send({message : 'forbiden access'})
            }

            const result =await PaymentCollection.find(query).toArray();
            res.send(result)
        })



        // user details

        app.post('/users', async (req, res) => {
            const user = req.body;

            const existingUser = await UsersCollection.findOne({ email: user.email });

            if (existingUser) {
                return res.send({ message: "User already exists" });
            }

            user.role = "user";
            user.createAt = new Date();

            const result = await UsersCollection.insertOne(user);
            res.send(result);
        });

        app.get('/users',veryFytoken, async (req, res) => {
           const result =await UsersCollection.find().toArray();
           res.send(result)
        });

        app.patch('/users/:id',async(req,res)=>{
            const {id} =req.params;
            const role = req.body.role;
            const filter ={_id :new ObjectId(id)};
            const updatedDoc ={
                $set :{
                    role : role
                }

            }
            const result = await UsersCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        // rider data 

        app.post('/rider', async (req, res) => {
            try {
                const rider = req.body;
                const email = rider.email;
                const existingApplication = await RiderCollection.findOne({
                    email: email,
                    status: { $in: ['approved', 'pending'] }
                });

                if (existingApplication) {
                    return res.status(400).json({
                        message: `You already have a ${existingApplication.status} application. ${existingApplication.status === 'approved'
                                ? 'You are already a rider.'
                                : 'Please wait for review.'
                            }`
                    });
                }

                const rejectedApplication = await RiderCollection.findOne({
                    email: email,
                    status: 'rejected'
                });

                if (rejectedApplication) {
                    rider.status = "pending";
                    rider.createAt = new Date();
                    const result = await RiderCollection.updateOne(
                        { _id: rejectedApplication._id },
                        { $set: rider }
                    );
                    return res.send(result);
                }

                rider.status = "pending";
                rider.createAt = new Date();
                const result = await RiderCollection.insertOne(rider);
                res.send(result);

            } catch (error) {
                res.status(500).send({ error: error.message });
            }
        });

        app.get('/rider',async(req,res)=>{
            const query ={}
            if(req.query.status){
                query.status =req.query.status
            }
            const result =await RiderCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/rider/check-application/:email', async (req, res) => {
            try {
                const email = req.params.email;
                const existingApplication = await RiderCollection.findOne({ email: email });

                if (existingApplication) {
                    res.send({
                        hasApplied: true,
                        status: existingApplication.status,
                        application: existingApplication
                    });
                } else {
                    res.send({
                        hasApplied: false,
                        status: null
                    });
                }
            } catch (error) {
                res.status(500).send({ error: error.message });
            }
        });

        app.patch('/rider/:id', veryFytoken, async (req, res) => {
            try {
                const status = req.body.status;
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const rider = await RiderCollection.findOne(query);

                if (!rider) {
                    return res.status(404).send({ message: "Rider not found" });
                }

                const updateStatus = {
                    $set: {
                        status: status
                    }
                };

       
                if (status === "approved") {
                    const userEmail = rider.email;
                    const userQuery = { email: userEmail };
                    const updateUser = {
                        $set: {
                            role: "rider"
                        }
                    };

                    const userResult = await UsersCollection.updateOne(userQuery, updateUser);
                    console.log("User role updated:", userResult);

                    if (userResult.matchedCount === 0) {
                        console.log("User not found in UsersCollection with email:", userEmail);
                     
                    }
                }

                const result = await RiderCollection.updateOne(query, updateStatus);

                res.send({
                    success: true,
                    riderUpdate: result,
                    message: status === "approved" ? "Rider approved and role updated" : "Rider rejected"
                });

            } catch (error) {
                console.error("Error updating rider:", error);
                res.status(500).send({
                    success: false,
                    message: "Failed to update rider status",
                    error: error.message
                });
            }
        });

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
