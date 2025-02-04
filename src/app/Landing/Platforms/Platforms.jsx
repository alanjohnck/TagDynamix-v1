import React from "react";
import Image from "next/image";

function Platform() {
  return (
    <div className="w-full bg-gray-100 py-8 sm:py-12 md:py-16">
      <header className="text-center mb-8 sm:mb-12 px-4">
        <p className="text-sm font-medium text-red-600  tracking-wide">
          Software We Use
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mt-2">
          PLATFORMS
        </h1>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Rockwell - Large tile */}
          <div className="col-span-2 bg-white rounded-3xl shadow-sm p-8 flex items-center justify-center">
            <Image
              src="./platform/factorytalk.svg"
              alt="Rockwell Automation"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          {/* HiveMQ - Large tile with black background */}
         

          {/* Ignition */}
          <div className="bg-white col-span-2 rounded-3xl shadow-sm p-6 flex items-center justify-center">
            <Image
              src="/platform/igntion.svg"
              alt="Ignition"
              width={150}
              height={80}
              className="object-contain "
            />
          </div>
          <div className="col-span-1 bg-black rounded-3xl shadow-sm p-8 flex items-center justify-center">
            <Image
              src="/platform/hivemq.svg"
              alt="HiveMQ"
              width={180}
              height={90}
              className="object-contain"
            />
          </div>

          {/* SEPASOFT */}
          <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center justify-center">
            <Image
              src="./platform/seasport.svg"
              alt="SEPASOFT"
              width={140}
              height={70}
              className="object-contain"
            />
          </div>

          {/* PTC - Black background */}
          <div className="bg-black rounded-3xl shadow-sm p-6 flex items-center justify-center">
            <Image
              src="/platform/ptc.svg"
              alt="PTC"
              width={140}
              height={70}
              className="object-contain"
            />
          </div>

          {/* Siemens */}
          <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center justify-center">
            <Image
              src="./platform/siemens.svg"
              alt="Siemens"
              width={140}
              height={70}
              className="object-contain"
            />
          </div>

          {/* AVEVA - Large tile */}
          <div className="col-span-2 bg-white rounded-3xl shadow-sm p-8 flex items-center justify-center">
            <Image
              src="./platform/aveva.svg"
              alt="AVEVA"
              width={200}
              height={100}
              className="object-contain"
            />
          </div>

          {/* Canary */}
          <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center justify-center">
            <Image
              src="/platform/Canary.svg"
              alt="Canary"
              width={140}
              height={70}
              className="object-contain"
            />
          </div>

          {/* Falkonry */}
          <div className="bg-white rounded-3xl shadow-sm p-6 flex items-center justify-center">
            <Image
              src="./platform/falkonry.svg"
              alt="Falkonry"
              width={140}
              height={70}
              className="object-contain"
            />
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12 px-4">
          <p className="text-sm text-gray-600">
            Looking for more platform options? Yes, we also support additional
            platforms to meet your specific needs.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Platform;