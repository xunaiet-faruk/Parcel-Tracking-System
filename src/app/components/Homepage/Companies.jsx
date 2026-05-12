import React from 'react';
import Marquee from "react-fast-marquee";
const Companies = () => {
    return (
        <div className='py-20  my-20 px-8 '>
            <div>
                <h1 className='text-[#03373d] font-bold text-center text-4xl'>We've helped thousands of sales teams</h1>
            </div>
           
            <div>
                <Marquee className='pt-14' behavior="scroll" autoFill="true" speed="100">
                   <div className='flex justify-center items-center gap-5 object-contain'>
                        <img src="/assets/brands/amazon.png" alt="Company 1" className="mx-4  h-9" />
                        <img src="/assets/brands/casio.png" alt="Company 2" className="mx-4  h-9" />
                        <img src="/assets/brands/moonstar.png" alt="Company 3" className="mx-4  h-9" />
                        <img src="/assets/brands/randstad.png" alt="Company 4" className="mx-4  h-9" />
                        <img src="/assets/brands/star.png" alt="Company 5" className="mx-4  h-9" />

                   </div>
                </Marquee>
            </div>
        </div>
    );
};

export default Companies;