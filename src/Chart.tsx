import React, { useEffect, useState, useRef, useCallback } from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import { DataPoint } from './types/DataPoint';

interface ChartComponentProps {
  timeframe: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ timeframe }) => {
  const chartRef = useRef<any>(null);
  const [filteredData, setFilteredData] = useState<DataPoint[]>([]);
  const [options, setOptions] = useState<any>({
    chart: {
      type: 'line',
      zoom: { enabled: true },
      events: {
        dataPointSelection: (event: any, chartContext: any, config: any) => {
          const point = filteredData[config.dataPointIndex];
          alert(`Timestamp: ${point.timestamp}\nValue: ${point.value}`);
        }
      }
    },
    xaxis: {
      type: 'datetime',
      categories: []
    }
  });
  const [series, setSeries] = useState<any>([{ name: 'Values', data: [] }]);

  const filterData = useCallback((data: DataPoint[], timeframe: string) => {
    let filtered = data;
    if (timeframe === 'weekly') {
      filtered = data.filter((_, index) => index % 7 === 0);
    } else if (timeframe === 'monthly') {
      filtered = data.filter((_, index) => index % 30 === 0);
    }
    setFilteredData(filtered);
    setupChart(filtered);
  }, []);

  const setupChart = (data: DataPoint[]) => {
    setOptions((prevOptions: any) => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: data.map(d => d.timestamp),
      }
    }));
    setSeries([{ name: 'Values', data: data.map(d => d.value) }]);
  };

  useEffect(() => {
    axios.get<DataPoint[]>('/data.json')
      .then(response => {
        const fetchedData = response.data;
        filterData(fetchedData, timeframe);
      });
  }, [filterData, timeframe]);

  const exportChart = () => {
    if (chartRef.current) {
      chartRef.current.chart.exportChart({ type: 'png', filename: 'chart' });
    }
  };

  return (
    <div>
      <button onClick={exportChart}>Export Chart</button>
      <Chart options={options} series={series} type="line" height={350} ref={chartRef} />
    </div>
  );
};

export default ChartComponent;
