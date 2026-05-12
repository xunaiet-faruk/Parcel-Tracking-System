import React from 'react';

const Ourservices = () => {
    const services = [
        {
            icon: "📦",
            title: "Parcel Delivery",
            text: "Fast and secure parcel delivery across the country. We ensure your packages reach safely and on time.\nReliable service for personal and business needs.",
        },
        {
            icon: "🚚",
            title: "Express Shipping",
            text: "Get your parcels delivered within the shortest possible time. Same-day and next-day delivery options available.\nPerfect for urgent shipments.",
        },
        {
            icon: "💰",
            title: "Cash on Delivery",
            text: "Safe and trusted COD service for all deliveries. We collect payments securely from customers.\nHelps you grow your online business easily.",
        },
        {
            icon: "🏢",
            title: "Corporate Service",
            text: "Special logistics support for SME and corporate clients. Bulk parcel handling with priority delivery.\nCustomized business solutions available.",
        },
        {
            icon: "📍",
            title: "Live Tracking",
            text: "Track your parcel in real-time with accurate updates. Stay informed from pickup to delivery.\nEasy and transparent tracking system.",
        },
        {
            icon: "🔒",
            title: "Secure Handling",
            text: "We ensure maximum safety for every parcel. Proper packaging and careful handling guaranteed.\nYour items are always in safe hands.",
        },
    ];
    return (
        <div className='bg-[#03373d] py-20 rounded-2xl my-20 px-8 '>
           <div className='py-2 mb-12 mx-7'>
                <h1 className='text-4xl font-bold text-center py-3 text-white'>Our Services</h1>
                <p className='text-center text-gray-300 '>
                    Enjoy fast, reliable parcel delivery with seamless tracking and on-time service.
                    <br /> We ensure safe handling and smooth logistics for all your delivery needs.
                </p>
           </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white hover:bg-[#caeb66] hover:text-white   transition duration-300 rounded-xl p-6 flex flex-col items-center text-center shadow-lg"
                    >
                        {/* Emoji center */}
                        <div className="text-5xl mb-6">{item.icon}</div>

                        {/* Title bottom */}
                        <h3 className="text-lg text-[#03373d]  font-semibold mt-auto">
                            {item.title}
                        </h3>

                        {/* Text */}
                        <p className="text-sm mt-2 opacity-80  ">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Ourservices;