import React, { useEffect, useState } from "react";

const ReverseTimer = () => {
  const targetDateTime = new Date("2023-06-10T05:00:00Z");
  const [remainingTime, setRemainingTime] = useState(calculateRemainingTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(calculateRemainingTime());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  function calculateRemainingTime() {
    const currentTime = new Date();
    const timeDifference = targetDateTime - currentTime;

    return timeDifference > 0 ? timeDifference : 0;
  }

  const formatTime = (time) => {
    const days = Math.floor(time / (1000 * 60 * 60 * 24));
    const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((time % (1000 * 60)) / 1000);

    return `${days}:${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-[700px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
      <h2 className="text-3xl font-bold mb-4">Remaining Time to Mint</h2>
      <div className="relative w-100 h-250 mt-2">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-50 rounded-full"></div>
        <div className="relative">
          <div className="absolute top-0 left-0 w-full h-2/3 bg-gradient-to-b from-indigo-900 via-transparent to-transparent transform "></div>
          <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-red-900 via-transparent to-transparent transform "></div>
          <div className="flex items-center justify-center bg-gray-800 rounded-lg p-8">
            <div className="text-center">
              <div className="flex justify-center">
                <div className="flex flex-col items-center justify-center mx-2">
                  <div className="bg-white rounded-lg p-4">
                    <span className="text-5xl font-bold custom-color-time font-mono italic">
                      {formatTime(remainingTime).split(":")[0]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Days</p>
                </div>
                <div className="flex flex-col items-center justify-center mx-2">
                  <div className="bg-white rounded-lg p-4">
                    <span className="text-5xl font-bold custom-color-time font-mono italic">
                      {formatTime(remainingTime).split(":")[1]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Hours</p>
                </div>
                <div className="flex flex-col items-center justify-center mx-2">
                  <div className="bg-white rounded-lg p-4">
                    <span className="text-5xl font-bold custom-color-time font-mono italic">
                      {formatTime(remainingTime).split(":")[2]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Minutes</p>
                </div>
                <div className="flex flex-col items-center justify-center mx-2">
                  <div className="bg-white rounded-lg p-4">
                    <span className="text-5xl font-bold custom-color-time font-mono italic">
                      {formatTime(remainingTime).split(":")[3]}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Seconds</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReverseTimer;
