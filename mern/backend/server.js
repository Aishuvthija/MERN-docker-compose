const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors()); // ✅ Allow CORS from frontend
app.use(bodyParser.json());

// MongoDB connection URI (from environment variable or fallback)
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ Connected to MongoDB");
})
.catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// Define Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  position: String,
  department: String
});

const Employee = mongoose.model("Employee", employeeSchema);

// Routes
app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

app.post("/employees", async (req, res) => {
  const newEmployee = new Employee(req.body);
  await newEmployee.save();
  res.status(201).json(newEmployee);
});

// ✅ Listen on all interfaces for Docker
const PORT = process.env.PORT || 5050;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
