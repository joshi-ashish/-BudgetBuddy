import moment from "moment";

export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false; // Handle null, undefined, and non-string values
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "";

  return name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map(word => word[0] || "") // Handle empty strings
    .join("")
    .toUpperCase();
};

export const addThousandsSeparator = (num) => {
  if (num == null || isNaN(num)) return ""; // Handle null, undefined, and non-numeric inputs

  const [integerPart, fractionalPart] = num.toString().split(".");
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return fractionalPart ? `${formattedInteger}.${fractionalPart}` : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
  if (!Array.isArray(data)) return []; // Ensure data is an array

  return data.map((item) => ({
    category: item?.category || "Unknown",
    amount: Number(item?.amount) || 0, // Ensure amount is always a valid number
  }));
};



export const prepareIncomeBarChartData = (data = []) => {
  if (!Array.isArray(data)) return [];

  const sortedData = [...data]
    .filter(item => item?.date)  // Ensure date exists
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item.date).format("MMM YYYY"), // Example: "Mar 2024"
    amount: item?.amount || 0, // Default to 0 if undefined
    source: item?.source || "Unknown", // Default source
  }));

  return chartData;
};



export const prepareExpenseLineChartData = (data = []) => {
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    month: moment(item.date).format("Do MMM"),
    amount: item.amount,
    category: item.category,
  }));

  return chartData;
};


