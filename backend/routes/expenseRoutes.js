const express = require("express");

const {
    addExpense,
    getAllExpense,
    deleteExpenses ,
    downloadExpenseExcel
}= require("../controllers/expenseController");

const {protect} = require("../middleware/authMiddleware");

const router = express.Router();


router.post("/add",protect,addExpense);
router.get("/get",protect,getAllExpense);
router.get("/downloadexcel",protect,downloadExpenseExcel);
router.delete("/:id",protect,deleteExpenses);


module.exports = router; 