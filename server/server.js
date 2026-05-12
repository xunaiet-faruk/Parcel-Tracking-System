const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const dns = require('dns');
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

const veryFytoken = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
    }
    try {
        const idToken = token.split(' ')[1];
        const decoded = await admin.auth().verifyIdToken(idToken);
        req.decoded_email = decoded.email;
        next();
        console.log("hello junaiet", decoded);
    } catch (error) {
        return res.status(401).send({ message: "unauthorized access" });
    }
}

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASSWORD}@cluster0.kwkb8qp.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        await client.connect();

        const ParcelCollection = client.db("ZapshiptDB").collection("parcels");
        const PaymentCollection = client.db("ZapshiptDB").collection("payment");
        const UsersCollection = client.db("ZapshiptDB").collection("Users");
        const RiderCollection = client.db("ZapshiptDB").collection("Rider");

        // Parcels API
        app.post('/parcels', async (req, res) => {
            const parcel = req.body;
            const result = await ParcelCollection.insertOne(parcel);
            res.send(result);
        });

        app.get('/parcels', async (req, res) => {
            const query = {};
            const { email, deliverystatus, riderEmail } = req.query;

            if (email) {
                query.senderEmail = email;
            }
            if (riderEmail) {
                query.riderEmail = riderEmail;
            }

            // ডেলিভারি স্ট্যাটাস ফিল্টার
            if (deliverystatus === 'pending-pickup') {
                query.deliverystatus = {
                    $in: ['pending-pickup', 'assigned', 'rejected']
                };
            } else if (deliverystatus === 'assigned') {
                query.deliverystatus = {
                    $in: ['assigned', 'assigned-assigned']
                };
            } else if (deliverystatus) {
                query.deliverystatus = deliverystatus;
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

        app.delete('/parcels/:id', async (req, res) => {
            const { id } = req.params;
            const query = { _id: new ObjectId(id) };
            const result = await ParcelCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/parcels/:id', async (req, res) => {
            const { id } = req.params;
            const updatedData = req.body;
            const filter = { _id: new ObjectId(id) };
            delete updatedData.senderName;
            delete updatedData.senderEmail;
            delete updatedData.status;
            const updateDoc = {
                $set: { ...updatedData }
            };
            const result = await ParcelCollection.updateOne(filter, updateDoc);
            res.send(result);
        });

        // রাইডার অ্যাসাইন করার API
        app.patch('/parcels/:id', async (req, res) => {
            const { riderId, riderName, riderEmail, riderPhone, parentId, deliverystatus, assignedAt } = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const updateDoc = {
                $set: {
                    deliverystatus: deliverystatus || 'assigned',
                    riderId,
                    riderName,
                    riderEmail,
                    riderPhone,
                    parentId,
                    assignedAt: assignedAt || new Date()
                }
            };
            const result = await ParcelCollection.updateOne(filter, updateDoc);

            // রাইডারের স্ট্যাটাস আপডেট
            if (riderId) {
                await RiderCollection.updateOne(
                    { _id: new ObjectId(riderId) },
                    { $set: { workstatus: 'in-delivery' } }
                );
            }
            res.send(result);
        });

        // ডেলিভারি স্ট্যাটাস আপডেট (Accept/Reject)
        app.patch('/parcels/deliverystatus/:id', async (req, res) => {
            try {
                const { deliverystatus, acceptedBy, rejectedBy, rejectionReason } = req.body;
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };

                const currentParcel = await ParcelCollection.findOne(filter);
                const updateDoc = {
                    $set: {
                        deliverystatus: deliverystatus,
                        updatedAt: new Date()
                    }
                };

                if (deliverystatus === 'accepted') {
                    updateDoc.$set.acceptedAt = new Date();
                    updateDoc.$set.acceptedBy = acceptedBy;
                    // accepted হলে পার্সেল আর assigned লিস্টে থাকবে না
                }

                if (deliverystatus === 'pending-pickup') {
                    updateDoc.$set.rejectedAt = new Date();
                    updateDoc.$set.rejectedBy = rejectedBy;
                    updateDoc.$set.rejectionReason = rejectionReason || 'No reason provided';

                    // রাইডারকে available করে দিন
                    if (currentParcel?.riderId) {
                        await RiderCollection.updateOne(
                            { _id: new ObjectId(currentParcel.riderId) },
                            { $set: { workstatus: 'available' } }
                        );
                    }

                    // রাইডারের তথ্য null করে দিন
                    updateDoc.$set.riderId = null;
                    updateDoc.$set.riderName = null;
                    updateDoc.$set.riderEmail = null;
                    updateDoc.$set.riderPhone = null;
                }

                const result = await ParcelCollection.updateOne(filter, updateDoc);
                res.send(result);
            } catch (error) {
                console.error('Error updating parcel status:', error);
                res.status(500).send({ error: error.message });
            }
        });

        // Remainder: Payment, Users, Rider APIs (আপনার আগের মতোই থাকবে)
        // ... (আপনার বাকি API গুলো এখানে থাকবে)

        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});