import React from 'react'
import HowWeDoData from "../../JsonData/HomeData/howWeDo.json"
function HowWeDo() {
  return (
    <div className='w-max-7xl h-[140vh] md:h-screen flex flex-col flex-wrap items-start justify-start md:justify-center bg-black text-white p-3 md:p-0  '>
       <div className='w-full h-1/4 flex flex-col justify-center items-center '>
          <h1 className='text-4xl md:text-6xl  font-medium text-center '>OUR APPROACH</h1>
       </div>
       <div className='w-full h-1/2 flex flex-wrap items-center justify-around gap-10 '>
           {
            HowWeDoData.map((item, index) => {
                return (
                    <div key={index} className=' flex flex-col  justify-center items-center '>
                        <div className='w-[10rem] h-[8rem] m-2 bg-grey rounded-md flex items-center shadow-lg bg-white '>
                            <img src={item.icon} alt={item.title} className='w-12 h-12 mx-auto' />
                        </div>
                        <h1 className='text-2xl font-bold text-center m-2'>{item.title}</h1>
                    </div>
                )
            })
           }
       </div>
    </div>
  )
}

export default HowWeDo