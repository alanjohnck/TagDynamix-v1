"use client";
import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email } = formData;
    const encodedName = encodeURIComponent(name);
    const encodedEmail = encodeURIComponent(email);
    
    const calLink = `https://cal.com/tagdynamix-qaoozn/30min?name=${encodedName}&email=${encodedEmail}`;
    window.open(calLink, "_blank"); // Opens in a new tab

  };

  return (
    <div className="w-screen h-auto flex flex-col items-center bg-white">
      {/* Navbar Section */}
      

      {/* Spacer */}
      <div className="h-[5rem] w-screen md:h-[10rem]" />

      {/* Main Content */}
      <div className="w-full h-auto flex flex-col items-center justify-around px-4 md:px-0">
        {/* Heading Section */}
        <div className="w-full max-w-[50%] font-bold flex flex-col md:flex-row items-center justify-center md:justify-around text-center md:text-left m-4">
          <h1 className="font-bold text-4xl md:text-6xl">Talk with</h1>
          <h1 className="rotate-90 text-5xl font-bold hidden md:block">↑</h1>
          <h1 className="font-bold text-4xl md:text-6xl">an expert</h1>
        </div>

        {/* Form & Info Section */}
        <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-10 mt-10">
          {/* Form */}
          <div className="w-full max-w-lg p-4">
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="rounded-md p-3 border border-gray-300 w-full"
                placeholder="Your name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="rounded-md p-3 border border-gray-300 w-full"
                placeholder="Your email"
                required
              />
              
              <input
                type="submit"
                value="Schedule Call"
                className="rounded-md p-3 bg-black text-white w-full cursor-pointer hover:bg-gray-800"
              />
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full max-w-lg flex flex-col items-center text-center lg:items-start lg:text-left gap-5 p-4">
            <p className="text-lg">
              We are ready to connect and collaborate, bringing our expertise to
              drive your success. Let&#39;s work together to achieve your goals
              and push the boundaries of what&#39;s possible.
            </p>
            <hr className="w-full border border-black" />
            <p className="font-bold ">tagdynamix@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
