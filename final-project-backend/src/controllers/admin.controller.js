const Admin = require('../models/Admin.model');
const Student = require('../models/Student.model');
const Course = require('../models/Course.model');

const sanitizeAdmin = (admin) => {
  return {
    adminId: admin._id,
    fullName: admin.fullName,
    email: admin.email,
    role: admin.role,
    password: admin.password,
    createdAt: admin.createdAt,
    updatedAt: admin.updatedAt
  };
};

const getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build search query
    const searchQuery = search ? {
      $or: [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const admins = await Admin.find(searchQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password');
    
    const totalAdmins = await Admin.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalAdmins / parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: admins.length,
      totalAdmins,
      totalPages,
      currentPage: parseInt(page),
      data: admins.map(admin => sanitizeAdmin(admin))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sanitizeAdmin(admin)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.userId).select('-password');
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sanitizeAdmin(admin)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const createAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    
    // Validation
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, email, password'
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
    
    const admin = await Admin.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password
    });
    
    res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: sanitizeAdmin(admin)
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const updateAdmin = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const adminId = req.params.id;
    
    // Find admin first
    let admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    // Check if email is being updated and if it conflicts
    if (email && email.toLowerCase() !== admin.email) {
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: adminId } 
      });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists'
        });
      }
    }
    
    // Prepare update object
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName.trim();
    if (email) updateFields.email = email.toLowerCase().trim();
    if (password) updateFields.password = password; // Will be hashed by pre-save middleware
    
    // Update admin
    admin = await Admin.findByIdAndUpdate(
      adminId,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Admin updated successfully',
      data: sanitizeAdmin(admin)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    const adminId = req.user.userId;
    
    // Find admin first
    let admin = await Admin.findById(adminId);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    // Check if email is being updated and if it conflicts
    if (email && email.toLowerCase() !== admin.email) {
      const existingAdmin = await Admin.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: adminId } 
      });
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'Admin with this email already exists'
        });
      }
    }
    
    // Prepare update object
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName.trim();
    if (email) updateFields.email = email.toLowerCase().trim();
    if (password) updateFields.password = password;
    
    // Update admin
    admin = await Admin.findByIdAndUpdate(
      adminId,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: sanitizeAdmin(admin)
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (admin._id.toString() === req.user.userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }
    
    await Admin.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const [studentCount, courseCount, adminCount] = await Promise.all([
      Student.countDocuments(),
      Course.countDocuments(),
      Admin.countDocuments()
    ]);
    
    // Get recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const [recentStudents, recentCourses] = await Promise.all([
      Student.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Course.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);
    
    // Get most popular courses
    const popularCourses = await Course.find()
      .sort({ registeredCount: -1 })
      .limit(5)
      .select('title registeredCount');
    
    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalStudents: studentCount,
          totalCourses: courseCount,
          totalAdmins: adminCount,
          recentStudents: recentStudents,
          recentCourses: recentCourses
        },
        popularCourses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  sanitizeAdmin,
  getAllAdmins,
  getAdmin,
  getProfile,
  createAdmin,
  updateAdmin,
  updateProfile,
  deleteAdmin,
  getDashboardStats
};