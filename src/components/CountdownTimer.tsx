'use client';

import { useState, useEffect } from 'react';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // King arrives on October 26th - we'll use current year or next year if date has passed
    const calculateTargetDate = () => {
      const now = new Date();
      const currentYear = now.getFullYear();
      const targetDate = new Date(currentYear, 9, 26); // October is month 9 (0-indexed)
      
      // If the date has passed this year, use next year
      if (targetDate < now) {
        return new Date(currentYear + 1, 9, 26);
      }
      
      return targetDate;
    };

    const targetDate = calculateTargetDate();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center px-4">
      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 drop-shadow-lg">
        King Countdown
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 md:mb-12 drop-shadow-md">
        Countdown until you get your new best friend 🐕
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-8 max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
          <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-1 md:mb-2">
            {timeLeft.days.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-medium">
            Days
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
          <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-1 md:mb-2">
            {timeLeft.hours.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-medium">
            Hours
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
          <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-1 md:mb-2">
            {timeLeft.minutes.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-medium">
            Minutes
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 border border-white/20">
          <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-1 md:mb-2">
            {timeLeft.seconds.toString().padStart(2, '0')}
          </div>
          <div className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 font-medium">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}
