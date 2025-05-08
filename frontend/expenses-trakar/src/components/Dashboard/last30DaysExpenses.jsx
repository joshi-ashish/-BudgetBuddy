import React, { useEffect, useState } from 'react';
import { prepareExpenseBarChartData } from '../../utils/helper';
import CustomBarChart from '../Charts/CustomBarChart';

const Last30DaysExpenses = ({ data = [] }) => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        console.log("📊 Expense Data Received:", JSON.stringify(data, null, 2));

        if (!Array.isArray(data) || data.length === 0) {
            console.warn("⚠️ Expense Data is empty or invalid.");
            setChartData([]);
            return;
        }

        const result = prepareExpenseBarChartData(data);
        console.log("📊 Processed Chart Data:", JSON.stringify(result, null, 2));

        if (Array.isArray(result) && result.length > 0) {
            setChartData(result);
        } else {
            console.warn("⚠️ Processed Chart Data is empty.");
            setChartData([]);
        }
    }, [data]);

    if (!chartData.length) {
        return <div>Loading Expense Chart...</div>;
    }

    return (
        <div className='card col-span-1 p-4 rounded-lg shadow-lg bg-white'>
            <div className='flex items-center justify-between mb-4'>
                <h5 className='text-lg font-semibold'>Last 30 Days Expenses</h5>
            </div>
            <CustomBarChart data={chartData} />
        </div>
    );
};

export default Last30DaysExpenses;
