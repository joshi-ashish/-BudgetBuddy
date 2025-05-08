

import React, { useEffect, useState } from 'react';
import DashboardLayout from "../../components/layouts/DashboardLayout";
import IncomeOverview from '../../components/Income/IncomeOverview';
import axiosInstance from "../../utils/axiosInstance"; 
import { API_PATHS } from "../../utils/apiPath";  
import Modal from '../../components/Modal';
import AddIncomeForm from '../../components/Income/AddIncomeForm';
import toast from 'react-hot-toast';
import IncomeList from '../../components/Income/IncomeList';
import DeleteAlert from '../../components/DeleteAlert';
import { useUserAuth } from "../../hooks/useUserAuth";

const Income = () => {
  useUserAuth();

  const [incomeData, setIncomeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  const fetchIncomeDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOME);
      setIncomeData(response.data || []);
    } catch (error) {
      console.error("Error fetching income details:", error);
      toast.error("Failed to load income details.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (income) => {
    const { source, amount, date, icon } = income;

    if (!source.trim()) return toast.error("Source is required.");
    if (!amount || isNaN(amount) || Number(amount) <= 0) return toast.error("Invalid amount.");
    if (!date) return toast.error("Date is required.");

    try {
      setLoading(true);
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, { source, amount, date, icon });
      toast.success("Income added successfully");
      setOpenAddIncomeModal(false);
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error adding income:", error);
      toast.error("Failed to add income. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    if (!id) return console.error("Invalid ID for deletion.");

    try {
      setLoading(true);
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id));
      toast.success("Income deleted successfully");
      setOpenDeleteAlert({ show: false, data: null });
      fetchIncomeDetails();
    } catch (error) {
      console.error("Error deleting income:", error);
      toast.error("Failed to delete income.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadIncomeDetails = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME(), { responseType: "blob" });
      const contentDisposition = response.headers['content-disposition'];
      const fileName = contentDisposition?.match(/filename="(.+)"/)?.[1] || "income_details.xlsx";

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading income details:", error);
      toast.error("Failed to download income details.");
    }
  };

  useEffect(() => {
    fetchIncomeDetails();
  }, []);

  return (
    <DashboardLayout activMenu="Income">
      <div className="my-5 mx-auto">
        <div className="grid grid-cols-1 gap-6">
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />

          <IncomeList
            transactions={incomeData}
            onDelete={(id) => setOpenDeleteAlert({ show: true, data: id })}
            onDownload={handleDownloadIncomeDetails}
          />
        </div>

        {/* Add Income Modal */}
        <Modal
          isOpen={openAddIncomeModal}
          onClose={() => setOpenAddIncomeModal(false)}
          title="Add Income"
        >
          <AddIncomeForm onAddIncome={handleAddIncome} />
        </Modal>

        {/* Delete Alert Modal */}
        <Modal
          isOpen={openDeleteAlert.show}
          onClose={() => setOpenDeleteAlert({ show: false, data: null })}
          title="Delete Income"
        >
          <DeleteAlert
            content="Are you sure you want to delete this income detail?"
            onDelete={() => deleteIncome(openDeleteAlert.data)}
          />
        </Modal>
      </div>
    </DashboardLayout>
  );
};

export default Income;
