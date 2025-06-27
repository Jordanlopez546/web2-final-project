const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", (req, res) => {
  res.send("Welcome to the Student Portal app")
})

const startServer = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URL}`,);

    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting the server:", error);
  }
}

startServer();