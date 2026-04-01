"use client";

import {
    FaCarSide,
    FaMoneyBillWave,
    FaWarehouse,
    FaBuilding,
} from "react-icons/fa";

const HowZapwork = () => {
    const items = [
        {
            icon: <FaCarSide size={30}/>,
            title: "Booking Pick & Drop",
            text: "Easily book your parcel for pickup and drop-off at your preferred location.",
        },
        {
            icon: <FaMoneyBillWave size={30} />,
            title: "Cash on Delivery",
            text: "Secure cash on delivery service for smooth and trusted transactions.",
        },
        {
            icon: <FaWarehouse size={30} />,
            title: "Delivery Hub",
            text: "Fast and reliable delivery through our nationwide hub network.",
        },
        {
            icon: <FaBuilding size={30} />,
            title: "Booking SME & Corporate",
            text: "Special booking solutions for SME and corporate clients.",
        },
    ];

    return (
        <section className="py-16 my-20 px-6 ">
            {/* Heading */}
            <div className="text-start mb-12 mx-7">
                <h2 className="text-4xl font-bold">How It Works</h2>
                
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mx-7">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#171717] hover:bg-[#caeb66] cursor-pointer text-white p-6 rounded-xl shadow hover:shadow-lg transition text-center"
                    >
                        {/* Icon (Emoji style) */}
                        <div className="flex justify-center text-white mb-3">
                            {item.icon}
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-lg mb-2">
                            {item.title}
                        </h3>

                        {/* Text */}
                        <p className="text-gray-300 text-sm">
                            {item.text}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default HowZapwork;