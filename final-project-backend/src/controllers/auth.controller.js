const Student = require("../models/Student");
const Admin = require("../models/Admin");
const jwt = require('jsonwebtoken');
const { sanitizeStudent } = require("./student.controller");
const { sanitizeAdmin } = require("./admin.controller");

require('dotenv').config();

const generateToken = (userId, role) => {
  return jwt.sign(
    { userId, role }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

const registerStudent = async (req, res) => {
  try {
    const { fullName, email, password, age } = req.body;

    // Validation
    if (!fullName || !email || !password || !age) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: fullName, email, password, age'
      });
    }

    // Check if student already exists
    const existingStudent = await Student.findOne({ email: email.toLowerCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this email already exists'
      });
    }

    // Create new student
    const newStudent = new Student({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      age
    });

    await newStudent.save();

    // Generate token
    const token = generateToken(newStudent._id, newStudent.role);

    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: {
        student: sanitizeStudent(newStudent),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: fullName, email, password'
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists'
      });
    }

    // Create new admin
    const newAdmin = new Admin({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password
    });

    await newAdmin.save();

    // Generate token
    const token = generateToken(newAdmin._id, newAdmin.role);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: {
        admin: sanitizeAdmin(newAdmin),
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};


const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const student = await Student.findOne({ email: email.toLowerCase() })
      .populate('enrolledCourses')

    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await student.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(student._id, student.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        student: sanitizeStudent(student),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() })

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(admin._id, admin.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        student: sanitizeAdmin(admin),
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

module.exports = {
  registerStudent,
  registerAdmin,
  loginStudent,
  loginAdmin
};