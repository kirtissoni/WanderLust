import React, { useState } from 'react';

const Hero = () => {
    return (
        <div className="relative pt-48 pb-12 bg-black xl:pt-20 sm:pb-16 lg:pb-32 xl:pb-48 2xl:pb-25 xl:px-32 min-h-[10vh]">

            <div className="absolute inset-0">
                <img className="object-cover w-full h-full" src="https://images.unsplash.com/photo-1631507623106-90091527dc06?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1740" alt="Beautiful vacation rental" />
            </div>

            <div className="relative">
                <div className="px-6 mx-auto sm:px-8 lg:px-12 max-w-7xl">
                    <div className="w-full lg:w-2/3 xl:w-1/2">
                        <h1 className="font-sans text-base font-normal tracking-tight text-white text-opacity-70">Discover your next adventure</h1>
                        <p className="mt-6 tracking-tighter text-white">
                            <span className="font-sans font-normal text-7xl">Welcome to</span><br />
                            <span className="font-serif italic font-normal text-8xl text-[#FF385C]">Wanderlust</span>
                        </p>
                        <p className="mt-12 font-sans text-base font-normal leading-7 text-white text-opacity-70">Find unique places to stay and unforgettable experiences around the world. From cozy cabins to luxurious villas, your perfect getaway is just a click away.</p>
                        <p className="mt-8 font-sans text-xl font-normal text-white">Rentals starting at $50/night</p>

                        <div className="flex items-center mt-5 space-x-3 sm:space-x-4">
                            <a
                                href="#"
                                title=""
                                className="
                            inline-flex
                            items-center
                            justify-center
                            px-5
                            py-2
                            font-sans
                            text-base
                            font-semibold
                            transition-all
                            duration-200
                            border-2 border-transparent
                            rounded-full
                            sm:leading-8
                            bg-white
                            sm:text-lg
                            text-black
                            hover:bg-opacity-90
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-secondary
                        "
                                role="button"
                            >
                                Explore stays
                            </a>

                            <a
                                href="#"
                                title=""
                                className="
                            inline-flex
                            items-center
                            justify-center
                            px-5
                            py-2
                            font-sans
                            text-base
                            font-semibold
                            transition-all
                            duration-200
                            bg-transparent
                            border-2
                            rounded-full
                            sm:leading-8
                            text-white
                            border-primary
                            hover:bg-white
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                            hover:text-black
                            sm:text-lg
                            focus:ring-offset-secondary
                        "
                                role="button"
                            >
                                <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.0416 4.9192C7.37507 4.51928 6.5271 4.99939 6.5271 5.77669L6.5271 18.2232C6.5271 19.0005 7.37507 19.4806 8.0416 19.0807L18.4137 12.8574C19.061 12.469 19.061 11.5308 18.4137 11.1424L8.0416 4.9192Z" />
                                </svg>
                                Watch video
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default Hero;