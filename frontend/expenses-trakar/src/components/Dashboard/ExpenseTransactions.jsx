import React from 'react';
import { LuArrowRight } from 'react-icons/lu';
import TransactionInfoCard from '../Cards/TransactionInfoCard';
import moment from 'moment';

const ExpenseTransactions = ({ transactions, onSeeMore }) => {
  console.log("ExpenseTransactions received:", transactions, onSeeMore);

  const safeTransactions = Array.isArray(transactions) ? transactions : [];

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h5 className="text-lg">Expenses</h5>
        <button className="card-btn flex items-center gap-1" onClick={onSeeMore}>
          See All <LuArrowRight className="text-base" />
        </button>
      </div>

      {/* Transactions List */}
      <div className='mt-6'>
        {safeTransactions.slice(0, 5).map((expense, index) => (
          <TransactionInfoCard
            key={expense._id || index}  // Fallback to index if _id is missing
            title={expense.category || "Unknown Category"}  // Default category
            icon={expense.icon || null}  // Set null if no icon (TransactionInfoCard should handle it)
            date={moment(expense.date).isValid() ? moment(expense.date).format("DD MMM YYYY") : "Invalid Date"} 
            amount={expense.amount ?? 0}  // Default amount
            type={expense.type}  // ✅ Use API-provided type ("Expense" or "Income")
            hideDeletBtn
          />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTransactions;
