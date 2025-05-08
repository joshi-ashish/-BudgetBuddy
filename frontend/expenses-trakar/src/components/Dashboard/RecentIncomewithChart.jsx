import React, { useEffect, useState } from 'react';
import CustomPieChart from '../Charts/CustomPieChart';

const COLORS = ["#875CF5", "#FA2C37", "#FF6900", "#4f39f6"];

const RecentIncomewithChart = ({ data, totalIncome }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (!data || data.length === 0) return;  

    const formattedData = data
      .filter(item => item?.amount) // Ensure amount exists
      .map((item) => ({
        name: item?.source || "Unknown",
        amount: item?.amount || 0, 
      }));

    setChartData(formattedData);
  }, [data]); 

  // Prevent rendering if data is empty
  if (!chartData.length) {
    return <div>Loading Income Chart...</div>;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Last 60 Days Income</h5>
      </div>

      <CustomPieChart
        data={chartData}
        label="Total Income"
        totalAmount={`$${totalIncome}`}
        showTextAnchor
        colors={COLORS}
      />
    </div>
  );
};

export default RecentIncomewithChart;
