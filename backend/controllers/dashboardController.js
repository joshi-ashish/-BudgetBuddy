
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { Types } = require("mongoose");
const moment = require("moment");

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user._id;
        const userObjectId = new Types.ObjectId(String(userId));

        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const last60DaysStart = moment().subtract(60, "days").startOf("day").toDate();
        const last30DaysStart = moment().subtract(30, "days").startOf("day").toDate();

       
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: last60DaysStart },
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: last30DaysStart },
        }).sort({ date: -1 });


        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );

        const lastTransaction = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "Income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "Expense",
                })
            ),
        ].sort((a, b) => b.date - a.date);

        
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpenses: totalExpense[0]?.total || 0,
            last30DaysExpense: {
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransaction,
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
};
