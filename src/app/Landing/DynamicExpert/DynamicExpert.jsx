import React from 'react'
import Image from 'next/image'
import DynamicExpertData from "../../JsonData/HomeData/dynamicExpertData.json"

function DynamicExpert() {

  return (
    <div className=''>
    <div className='w-screen h-fit md:h-[150vh] flex flex-col items-center justify-center px-16 bg-white text-black'>
      <header className='w-full h-1/4 flex flex-col items-center justify-center gap-2'>
        <h4 className='font-bold text-center'>Our focus</h4>
        <h1 className='text-[3rem] sm:text-5xl md:text-6xl font-medium text-center'>YOUR DYNAMIC EXPERT</h1>
      </header>
      <main className='w-3/4 h-3/4  flex flex-wrap flex-col justify-between'>
        <div className='w-full h-[90%] flex flex-col justify-between '>
          {DynamicExpertData.services?.map((service, index) => (
            <div key={index} className='flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-8'>
              <div className='w-full sm:w-auto'>
                <p className='invisible md:visible text-center sm:text-left'>{service.id}</p>
              </div>
              <div className='w-full sm:w-[14rem]'>
                <h3 className='text-lg sm:text-xl font-semibold text-center sm:text-left mb-3'>{service.title}</h3>
              </div>
              <div className='w-[7rem] h-[5rem] bg-black rounded-md flex items-center justify-center'>
                <Image src={service.icon} width={25} height={25} alt={service.title} />
              </div>
              <div className='w-full sm:w-1/4 flex justify-center sm:justify-start'>
                <p className='text-gray-600'>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
    </div>
  )
}

export default DynamicExpert;
