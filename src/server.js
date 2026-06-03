const express =require ('express');
const cors= require ('cors');
require('dotenv').config();
const connectDB=require('./config/db');
const userRoutes = require('./routes/userRoute');

const app= express();


const PORT= process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

//Middleware 
app.use(cors());
app.use(express.json()) ;

// Test Route
app.use('/api/user', userRoutes);
app.use("/uploads", express.static("uploads"));

app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});