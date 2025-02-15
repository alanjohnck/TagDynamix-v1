"use client"
import React from 'react'
import AnalyticsData from "../../JsonData/HomeData/AnalyticsData.json"
import { useRef } from 'react'
import TextAnimation from '@/app/component/TextAnimation'

function AnalyticsSection() {
    const videoRef = useRef(null);

    return (
        <div className='w-full px-6 pb-10 bg-white'>
            <div className='max-w-full h-fit flex flex-col items-center justify-start  rounded-b-lg bg-[#F6F5F8] text-black px-4 sm:px-6 lg:px-8'>
                {/* Video Container */}
                <div ref={videoRef} className='w-full md:w-4/5 lg:w-fit h-auto lg:h-1/2 flex flex-col justify-end px-4 m-0 p-0 '>
                    <video 
                        className='w-full h-auto lg:h-3/4 object-cover max-w-3xl border-4 border-black' 
                        autoPlay 
                        loop 
                        muted
                        playsInline
                        disablePictureInPicture
                        style={{   border: 'none',  outline: 'none', borderRadius: '8px', }}
                    >
                        <source src="./animations/Animation2.webm" type="video/webm" />
                        Your browser does not support the video tag.
                    </video>
                </div>
    
                {/* Text Animation Container */}
                <div className='w-full h-auto lg:h-1/4 flex flex-col gap-4 items-center justify-center py-8 md:py-12'>
                    <h4 className='font-medium text-base sm:text-lg md:text-xl text-center'>
                    Collect, Store and Analyse
                    </h4>
                    <TextAnimation 
                        text="HISTORIAN | DATA ANALYTICS"
                        colors={["black", "red", "black"]}
                        durations={[0.5, 0.1, 0.5]}
                        staggers={[0.3, 0.3, 0.1]}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-center"
                        scrollTriggerOptions={{
                            trigger: videoRef.current,
                            start: "top top",
                            end: "bottom center",
                            scrub: 3
                        }}
                        separator="."
                    />
                </div>
    
                {/* Framework Technology Section */}
                <div className='w-full h-auto lg:h-1/4 p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row'>
                    <div className='w-full lg:w-1/4 mb-6 lg:mb-0 flex items-start lg:items-center justify-start'>
                        <h3 className='font-bold text-xl sm:text-2xl text-left text-[black]'>
                        Accelerate <br /> Decision Making
                        </h3>
                    </div>
                    <div className='w-full lg:w-3/4 flex flex-col md:flex-row gap-6 md:gap-8'>
                        {AnalyticsData.slice(0, 3).map((data, index) => (
                            <div key={index} className='flex flex-col justify-start items-start gap-4 flex-1'>
                            {data.title==="Meaningful data" ? <h2 className='text-lg sm:text-xl text-[#A905D1] font-bold'>{data.title}</h2> :  <h2 className='text-lg sm:text-xl font-bold'>{data.title}</h2>
                        }
                                <div className='flex flex-col gap-2'>
                                    {data.details.map((detail, i) => (
                                        <p key={i} className='text-gray-600 text-sm sm:text-base'>
                                            {detail}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default AnalyticsSection