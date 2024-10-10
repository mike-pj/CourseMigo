import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRoutes from "./routes/userRoute.js";
import userAuth from "./routes/authRoute.js";

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to the MongoDB Database");
  })
  .catch((err) => {
    console.log(err.message);
  });

const app = express();

app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

app.use("/api/user", userRoutes);
app.use("/api/auth", userAuth);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
    // success: false,
    // error: message,
    // statusCode: statusCode,
  }); 
});
