const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const routes = require("./src/routes/index.routes")

require("dotenv").config();

const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

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