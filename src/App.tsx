import React, { useState } from 'react';
import ChartComponent from './Chart';

const App: React.FC = () => {
  const [timeframe, setTimeframe] = useState('daily');

  const handleTimeframeChange = (frame: string) => {
    setTimeframe(frame);
  };

  return (
    <div>
      <div>
        <button onClick={() => handleTimeframeChange('daily')}>Daily</button>
        <button onClick={() => handleTimeframeChange('weekly')}>Weekly</button>
        <button onClick={() => handleTimeframeChange('monthly')}>Monthly</button>
      </div>
      <ChartComponent timeframe={timeframe} />
    </div>
  );
};

export default App;
