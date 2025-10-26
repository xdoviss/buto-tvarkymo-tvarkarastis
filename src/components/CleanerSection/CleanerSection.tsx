import { useEffect, useState } from "react";
import { TimeRemaining } from "../../types";
import "./CleanerSection.css";

interface CleanerSectionProps {
  nextDeadline: Date;
  currentCleaner: string;
}

export const CleanerSection: React.FC<CleanerSectionProps> = ({
  nextDeadline,
  currentCleaner,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(
    getTimeRemaining(nextDeadline),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeRemaining(nextDeadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [nextDeadline]);

  function getTimeRemaining(deadline: Date): TimeRemaining {
    const total = deadline.getTime() - new Date().getTime();
    if (total <= 0) {
      return { weeks: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    return { weeks, days: days % 7, hours, minutes, seconds };
  }

  return (
    <section className="cleaner-section">
      <p>
        <strong>Tvarkymo terminas:</strong> {nextDeadline.toLocaleDateString()}
      </p>
      <div className="cleaner-box">
        <p>Sekantis tvarko:</p>
        <h2>{currentCleaner}</h2>
      </div>
      <div className="countdown">
        <p>
          ⏳ Likęs laikas:{" "}
          <span>
            {timeLeft.weeks > 0 && `${timeLeft.weeks} sav `}
            {timeLeft.days > 0 && `${timeLeft.days} d `}
            {timeLeft.hours > 0 && `${timeLeft.hours} h `}
            {timeLeft.minutes > 0 && `${timeLeft.minutes} m `}
            {timeLeft.seconds > 0 && `${timeLeft.seconds} s`}
          </span>
        </p>
      </div>
    </section>
  );
};
