import React, { useEffect } from 'react'
import { useState } from 'react';
import { LuPlus } from 'react-icons/lu';
import { prepareExpenseLineChartData } from '../../utils/helper';
import CustomLinrChart from '../Charts/CustomLinrChart';

const ExpenseOverview = ({transactions,onExpenseIncome}) => {
    const [charData,setCharData] = useState([]);

    useEffect(() => {
        const result = prepareExpenseLineChartData(transactions);
        setCharData(result);

         return () => {};
    },[transactions]);
  return  <div className='card'>
    <div className='flex items-center justify-between'>
        <div className=''>
            <h5 className='text-lg'>Expense Overview </h5>
            <p className='text-xs text-gray-400 mt-0.5'>
                Track your Spending trends over time and  gain insights
                 your money goes.
            </p>

        </div>

        <button className='add-btn' onClick={onExpenseIncome}>
            <LuPlus  className='text-lg'/>
            Add Expense

        </button>
        
    </div>
    
     <div className='mt-10'>
        <CustomLinrChart data={charData}/>

     </div>


  </div>
  
}

export default ExpenseOverview;