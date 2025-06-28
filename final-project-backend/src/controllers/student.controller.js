const Student = require('../models/Student.model');
const Course = require('../models/Course.model');

const sanitizeStudent = (student) => {
  return {
    studentId: student._id,
    fullName: student.fullName,
    email: student.email,
    role: student.role,
    age: student.age,
    enrolledCourses: student.enrolledCourses,
    createdAt: student.createdAt,
    updatedAt: student.updatedAt
  };
};

const getAllStudents = async (req, res) => {
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
    
    const students = await Student.find(searchQuery)
      .populate('enrolledCourses', 'title description credits lecturer')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-password'); // Exclude password field
    
    const totalStudents = await Student.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalStudents / parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: students.length,
      totalStudents,
      totalPages,
      currentPage: parseInt(page),
      data: students.map(student => sanitizeStudent(student))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('enrolledCourses', 'title description credits lecturer registeredCount')
      .select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sanitizeStudent(student)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
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
    const student = await Student.findById(req.user.userId)
      .populate('enrolledCourses', 'title description credits lecturer registeredCount')
      .select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sanitizeStudent(student)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { fullName, email, age, password } = req.body;

    const studentId = req.user.userId;
    
    // Find student first
    let student = await Student.findById(studentId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if email is being updated and if it conflicts
    if (email && email.toLowerCase() !== student.email) {
      const existingStudent = await Student.findOne({ 
        email: email.toLowerCase(), 
        _id: { $ne: studentId } 
      });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'Student with this email already exists'
        });
      }
    }
    
    // Prepare update object
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName.trim();
    if (email) updateFields.email = email.toLowerCase().trim();
    if (age) updateFields.age = age;
    if (password) updateFields.password = password; // Will be hashed by pre-save middleware
    
    // Update student
    student = await Student.findByIdAndUpdate(
      studentId,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).populate('enrolledCourses', 'title description credits lecturer').select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: sanitizeStudent(student)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
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

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.user.userId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Remove student from all enrolled courses
    if (student.enrolledCourses.length > 0) {
      await Course.updateMany(
        { _id: { $in: student.enrolledCourses } },
        { 
          $pull: { studentsEnrolled: student._id },
          $inc: { registeredCount: -1 }
        }
      );
    }
    
    await Student.findByIdAndDelete(req.user.userId);
    
    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.userId;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Find student and course
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if already enrolled
    if (student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is already enrolled in this course'
      });
    }
    
    // Add course to student's enrolled courses
    student.enrolledCourses.push(courseId);
    await student.save();
    
    // Add student to course's enrolled students
    course.studentsEnrolled.push(studentId);
    course.registeredCount = course.studentsEnrolled.length;
    await course.save();
    
    // Get updated student with populated courses
    const updatedStudent = await Student.findById(studentId)
      .populate('enrolledCourses', 'title description credits lecturer')
      .select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course',
      data: sanitizeStudent(updatedStudent)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Student or Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const unenrollFromCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.userId;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Course ID is required'
      });
    }
    
    // Find student and course
    const student = await Student.findById(studentId);
    const course = await Course.findById(courseId);
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if enrolled
    if (!student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is not enrolled in this course'
      });
    }
    
    // Remove course from student's enrolled courses
    student.enrolledCourses = student.enrolledCourses.filter(
      id => id.toString() !== courseId
    );
    await student.save();
    
    // Remove student from course's enrolled students
    course.studentsEnrolled = course.studentsEnrolled.filter(
      id => id.toString() !== studentId
    );
    course.registeredCount = course.studentsEnrolled.length;
    await course.save();
    
    // Get updated student with populated courses
    const updatedStudent = await Student.findById(studentId)
      .populate('enrolledCourses', 'title description credits lecturer')
      .select('-password');
    
    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course',
      data: sanitizeStudent(updatedStudent)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Student or Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getStudentCourses = async (req, res) => {
  try {
    const student = await Student.findById(req.user.userId)
      .populate({
        path: 'enrolledCourses',
        select: 'title description credits lecturer registeredCount createdAt',
        populate: {
          path: 'studentsEnrolled',
          select: 'fullName email'
        }
      })
      .select('-password');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(200).json({
      success: true,
      count: student.enrolledCourses.length,
      data: {
        student: {
          studentId: student._id,
          fullName: student.fullName,
          email: student.email
        },
        courses: student.enrolledCourses
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  sanitizeStudent,
  getAllStudents,
  getStudent,
  getProfile,
  updateStudent,
  deleteStudent,
  enrollInCourse,
  unenrollFromCourse,
  getStudentCourses
};