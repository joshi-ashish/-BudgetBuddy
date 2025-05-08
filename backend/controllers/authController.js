
       
   const User = require("../models/User");
   const jwt = require("jsonwebtoken");
   
   const generateToken = (id) => {
       return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "1h" }); // 1-hour token expiration
   };
   
   
   exports.registerUser = async (req, res) => {
       try {
           const { fullName, email, password, profileImageUrl } = req.body;
   
           if (!fullName || !email || !password) {
               return res.status(400).json({ message: "All fields are required" });
           }
   
           // Check if user already exists
           const userExists = await User.findOne({ email });
           if (userExists) {
               return res.status(400).json({ message: "User already exists" });
           }
   
        
           const user = await User.create({
               fullName,
               email,
               password,
               profileImageUrl,
           });
   
           
   
           res.status(201).json({
               id: user._id,
               user,
               token: generateToken(user._id),
           });
       } catch (err) {
           res.status(500).json({ message: "Error registering user", error: err.message });
       }
   };
   

   exports.loginUser = async (req, res) => {
       const { email, password } = req.body;
   
       if (!email || !password) {
           return res.status(400).json({ message: "All fields are required" });
       }
   
       try {
           const user = await User.findOne({ email });
   
           
           if (!user || !(await user.comparePassword(password))) {
               return res.status(401).json({ message: "Invalid email or password" });
           }
   
           
           const { password: _, ...userWithoutPassword } = user._doc;
   
           res.status(200).json({
               id: user._id,
               user: userWithoutPassword,
               token: generateToken(user._id),
           });
   
       } catch (err) {
           res.status(500).json({ message: "Error logging in user", error: err.message });
       }
   };


   exports.getUserInfo = async (req, res) => {
    try {
        
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized, no user data" });
        }

        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error("Error fetching user info:", err);
        res.status(500).json({ message: "Error fetching user info" });
    }
};
