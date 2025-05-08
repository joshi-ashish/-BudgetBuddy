import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import { useUserAuth } from '../../hooks/useUserAuth';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPath';
import InfoCard from '../../components/Cards/InfoCard';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';

import { LuHandCoins, LuWalletMinimal } from "react-icons/lu";
import { IoMdCard } from "react-icons/io";
import { addThousandsSeparator } from '../../utils/helper';
import FianaceOverview from '../../components/Dashboard/FianaceOverview';
import ExpenseTransactions from '../../components/Dashboard/ExpenseTransactions';
import Last30DaysExpenses from '../../components/Dashboard/last30DaysExpenses';
import RecentIncomewithChart from '../../components/Dashboard/RecentIncomewithChart';
import RecentIncome from '../../components/Dashboard/RecentIncome';

const Home = () => {
  useUserAuth();
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardData = async () => {
    if (loading) return;
    setLoading(true);

    try {

      const response = await axiosInstance.get(API_PATHS.DASHBOARD.GET_DATA);
      console.log("API Response:", response); // API ka pura response dekhein

      if (response?.data) {
        setDashboardData(response.data);
        console.log("Data received:", response.data); // Data successfully set hua ya nahi

      }
    } catch (error) {
      console.error("API Error: Something went wrong.", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchDashboardData();
    
  }, []);

  return (
    <DashboardLayout activMenu="Dashboard">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoCard
            icon={<IoMdCard />}
            label="Total Balance"
            value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
            color="bg-primary"
          />
          <InfoCard
            icon={<LuWalletMinimal />}
            label="Total Income"
            value={addThousandsSeparator(dashboardData?.totalIncome || 0)}
            color="bg-orange-500"
          />
         <InfoCard
          icon={<LuHandCoins />}
           label="Total Expense"
          value={addThousandsSeparator(dashboardData?.totalExpenses || 0)} // Change to "totalExpenses"
          color="bg-red-500"
/>

        </div>
        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <RecentTransactions
          transactions={dashboardData?.recentTransactions || []}
         onSeeMore={() => navigate("/expense")}
/>


      <FianaceOverview
       totalBalance={dashboardData?.totalBalance || 0}
        totalIncome={dashboardData?.totalIncome || 0}
        totalExpenses={dashboardData?.totalExpenses || 0}  
/>

      <ExpenseTransactions
       transactions={dashboardData?.last30DaysExpense?.transactions || []}  // ✅ Fixed key name
       onSeeMore={() => navigate("/expense")}
/>

    <Last30DaysExpenses
     data={dashboardData?.last30DaysExpense?.transactions || []} 
/>


<RecentIncomewithChart
  data={dashboardData?.last60DaysIncome?.transactions?.slice(0, 4) || []} 
  totalIncome={dashboardData?.totalIncome || 0}
/>


          <RecentIncome
            transaction={dashboardData?.last60DaysIncome?.transactions || []} 
            onSeeMore={() => navigate("/income")}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Home;  