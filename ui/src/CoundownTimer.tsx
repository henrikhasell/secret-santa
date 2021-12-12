import React, {FC, useEffect, useState} from 'react';
import { Badge } from 'react-bootstrap';

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const CountdownClause: FC<{count: number, label: string}> = ({count, label}) => (
  <span className="text-nowrap"><Badge bg="secondary">{count}</Badge> {label}</span>
);

const CountdownTimer: FC<{date: Date}> = ({date}) => {
  const [countdown, setCountdown] = useState<CountdownState>();

  useEffect(() => {
    const updateState = () => {
      const distance = date.getTime() - new Date().getTime();
      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    const interval = setInterval(updateState, 1000);
    updateState();

    return () => clearInterval(interval);
  }, [date]);

  return (
    <div>
      {countdown ? (
        <>
          <CountdownClause count={countdown.days} label="days"/>{' '}
          <CountdownClause count={countdown.hours} label="hours"/>{' '}
          <CountdownClause count={countdown.minutes} label="minutes"/>{' '}
          <CountdownClause count={countdown.seconds} label="seconds"/>
        </>
      ) : null}
    </div>
  );
};

export default CountdownTimer;