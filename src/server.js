const express =require ('express');
const cors= require ('cors');
require('dotenv').config();
const connectDB=require('./config/db');
const userRoutes = require('./routes/user.Route.js');
const helmet = require('helmet');

const app= express();

const PORT= process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

//Middleware 
app.use(cors());
app.use(helmet());
app.use(express.json()) ;


// User Route
app.use('/api/user', userRoutes);

//make the uploads folder "public" so you can actually view the photos in a browser. and 
app.use("/uploads", express.static("uploads"));    

app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});