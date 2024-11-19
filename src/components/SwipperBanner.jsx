import React, { useEffect, useState } from 'react';

const SwipperBanner = () => {
    const [currentSlide, setCurrentSlide] = useState(1);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide === 2 ? 1 : prevSlide + 1));
        }, 3000); // Change slide every 3 seconds

        return () => clearInterval(interval);
    }, []);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide === 2 ? 1 : prevSlide + 1));
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide === 1 ? 2 : prevSlide - 1));
    };

    return (
        <div className="">
            <div className="carousel w-[60%] h-[45vh] rounded-3xl relative">
                <div id="slide1" className={`carousel-item absolute w-full ${currentSlide === 1 ? 'block' : 'hidden'}`}>
                    <img
                        src="https://media.licdn.com/dms/image/v2/D4D3DAQERGoQosU2G8Q/image-scale_191_1128/image-scale_191_1128/0/1696917168054/newuu_student_council_cover?e=2147483647&v=beta&t=rTbEalwrzW17SCab1dq6Quy2HRBSlIHkgjo1gGlnIKk"
                        className="w-full rounded-3xl h-[350px]"
                        alt="Slide 1"
                    />
                </div>
                <div id="slide2" className={`carousel-item absolute w-full ${currentSlide === 2 ? 'block' : 'hidden'}`}>
                    <img
                        src="https://www.afisha.uz/uploads/media/2024/02/37e38278a9f4c85ec681b6dc15af8a42.jpg"
                        className="w-full rounded-3xl h-[350px]"
                        alt="Slide 2"
                    />
                </div>

                {/* Button Container Positioned at Bottom Center */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 mb-3 gap-8">
                    <button
                        onClick={prevSlide}
                        className="bg-white p-2 rounded-full shadow-md w-10 h-10 text-center font-bold"
                    >
                        &lt;
                    </button>

                    {/* Navigation Dots */}
                    <div className="flex space-x-2">
                        <span
                            className={`w-2 h-2 rounded-full ${currentSlide === 1 ? 'bg-gray-400' : 'bg-white'}`}
                        ></span>
                        <span
                            className={`w-2 h-2 rounded-full ${currentSlide === 2 ? 'bg-gray-400' : 'bg-white'}`}
                        ></span>
                    </div>

                    <button
                        onClick={nextSlide}
                        className="bg-white p-2 rounded-full shadow-md w-10 h-10 text-center font-bold"
                    >
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwipperBanner;
