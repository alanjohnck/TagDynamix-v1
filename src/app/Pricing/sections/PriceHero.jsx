"use client";

import React from "react";

function PricingSection() {
  const plans = [
    {
      title: "Lite",
      screens: "15",
      features: ["Unlimited Tags", "Alarms", "Audit Trial"],
      price: "€3800",
      bgColor: "bg-gray-100",
    },
    {
      title: "Core",
      screens: "30",
      features: ["Unlimited Tags", "Alarms", "Audit Trial"],
      price: "€5600",
      bgColor: "bg-gray-200",
    },
    {
      title: "Plus",
      screens: "70",
      features: ["Unlimited Tags", "Alarms", "Audit Trial"],
      price: "€9300",
      bgColor: "bg-gray-300",
    },
    {
      title: "Pro",
      screens: "100",
      features: ["Unlimited Tags", "Alarms", "Audit Trial"],
      price: "€14500",
      bgColor: "bg-gray-400",
    },
  ];

  return (
    <section className="w-screen h-auto bg-white py-25 px-4 md:px-20 flex flex-col gap-12 ">
      {/* Heading */}
      <div className="h-[1vh] " />
      <div className="mt-20">
      <p className=" font-bold  text-gray-900 text-left ">
        Unlimited Craft
      </p>
        <h2 className="text-4xl md:text-6xl font-bold text-gray-900 text-left ">
          Offerings
        </h2>
      </div>
      {/* <div className="text-center mb-12">
         
        <h2 className="text-4xl font-bold text-gray-900">Our Pricing Plans</h2>
        <p className="text-lg text-gray-600 mt-2">
          Choose the plan that suits your needs.
        </p>
      </div> */}

      {/* Pricing Cards */}
      <div className="flex flex-col gap-12">
        {/* Row Plans */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8  flex flex-col justify-around rounded-lg shadow-lg ${plan.bgColor} hover:scale-105 transition-transform`}
            >
              <div className=" flex justify-start items-start">
                <img src="./pricing/Component 4 (5).svg" className="w-32 h-32">

                </img>
              </div>{" "}
              {/* Image Placeholder */}
              <h3 className="text-4xl font-semibold text-gray-800">{plan.title}</h3>
              <p className="text-black text-2xl mt-2"> <strong> {plan.screens}</strong> Screens</p>
              <ul className="text-gray-600 text-sm mt-4 space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center">
                    <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
              {plan.price =="€5600"? <p className="text-xl font-bold text-green-500 mt-4">{plan.price}</p>: <p className="text-xl font-bold text-gray-800 mt-4">{plan.price}</p>}
             
            </div>
          ))}
        </div>

        {/* Max Plan */}
        <div className="w-full p-8 rounded-lg shadow-2xl bg-black text-white flex flex-col lg:flex-row items-center gap-8">
          <div className="h-48 w-48 bg-gray-500 rounded-lg"></div> {/* Image Placeholder */}
          <div>
            <h3 className="text-4xl font-bold">Max</h3>
            <p className="text-2xl mt-2">100+ Screens</p>
            <p className="text-lg mt-4">
              Get a tailored solution for your specific needs. Let’s talk!
            </p>
            <button className="mt-6 px-8 py-4 bg-white text-black rounded-lg hover:bg-gray-300 transition">
              Let’s Talk
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PricingSection;
