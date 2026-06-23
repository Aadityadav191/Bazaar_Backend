const express =require ('express');
const cors= require ('cors');
require('dotenv').config();
const connectDB=require('./config/db');
const userRoutes = require('./routes/user.Route.js');
const helmet = require('helmet');
const requestLogger = require('./middleware/requestLogger');


const app= express();

const PORT= process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

//Middleware 
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://bazaaaaar.netlify.app', 
    // Add any other frontend URLs
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(express.json()) ;
app.use(requestLogger);



// User Route
app.use('/api/user', userRoutes);

//make the uploads folder "public" so you can actually view the photos in a browser. and 
app.use("/uploads", express.static("uploads"));    

app.listen(PORT, () => {
  console.log(`Server is running beautifully on http://localhost:${PORT}`);
});