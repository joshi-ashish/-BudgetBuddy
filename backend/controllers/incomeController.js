const xlsx = require("xlsx"); // Ensure xlsx is imported

const Income = require("../models/Income");


exports.addIncome = async(req,res) =>{
    const userId = req.user.id

    try{
        const {icon,source,amount,date} = req.body;
        if(!source || !amount || !date){
            return res.status(400).json({message: "Please fill all fields."})
        }

        const newIncome = new Income({
            userId,
            icon,
            source,
            amount,
            date: new Date(date)
        });
        await newIncome.save();
        res.status(200).json(newIncome);

    }catch(error){
        res.status(500).json({message :"Server Error"});
    }
}

exports.getAllIncome = async(req,res) =>{
    const userId = req.user.id;
    try{
        const income = await Income.find({userId}).sort({date: -1});
        res.status(200).json(income);
    }catch (error) {
        res.status(500).json({message :"Server Error"});
    }
}

// exports.deleteIncome = async(req,res) =>{
//     try {
//         const income = await Income.findByIdAndDelete(req.params.id);
        
//         if (!income) {
//             return res.status(404).json({ message: "Income not found" });
//         }

//         res.json({ message: "Income deleted successfully" });
//     } catch (error) {
//         console.error("Error deleting income:", error);
//         res.status(500).json({ message: "Server Error" });
//     }
// }

exports.deleteIncome = async (req, res) => {
    try {
        console.log("🔥 Full Request Received:", req.method, req.url, req.body, req.params); // Debugging Step
        
        if (!req.params.id) { 
            return res.status(400).json({ message: "Invalid or Missing Income ID" });
        }

        console.log("✅ Received ID:", req.params.id); // Check if ID is received

        const income = await Income.findByIdAndDelete(req.params.id);
        
        if (!income) {
            return res.status(404).json({ message: "Income not found" });
        }

        res.json({ message: "Income deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting income:", error);
        res.status(500).json({ message: "Server Error" });
    }
};


exports.downloadIncomeExcel = async(req,res) =>{
    const userId = req.user.id;
    try{
        const income = await Income.find({userId}).sort({date: -1});
        const data = income.map((item) => ({
            Source: item.source,
            Amount: item.amount,
            Date :item.date,

        }));
        
        

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, 'Income');
        xlsx.writeFile(wb,'income_details.xlsx');
        res.download('income_details.xlsx');

    } catch(error){
        res.status(500).json({message :"Server Error"});
    }
}






