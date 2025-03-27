import { useRef, useState } from "react";

export const CountUp = () => {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const startCounting = (change) => {
    setCount((prev) => Math.max(prev + change, 0));
    intervalRef.current = setInterval(() => {
      setCount((prev) => Math.max(prev + change, 0));
    }, 200);
  };

  const stopCounting = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <>
      <div className="CountUp">
        <p className="countNumber">{count}</p>
        <button
          className="countUpButton"
          onMouseDown={() => startCounting(1)}
          onMouseUp={stopCounting}
          onMouseLeave={stopCounting}
        >
          +1
        </button>
        <button
          className="countResetButton"
          onMouseDown={() => startCounting(-1)}
          onMouseUp={stopCounting}
          onMouseLeave={stopCounting}
        >
          -1
        </button>
        <button className="countDownButton" onClick={() => setCount(0)}>
          リセット
        </button>
      </div>
    </>
  );
};
