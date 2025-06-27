const Grade = require('../models/Grade');
const Student = require('../models/Student');
const Course = require('../models/Course');

const sanitizeGrade = (grade) => {
  return {
    gradeId: grade._id,
    student: grade.student,
    course: grade.course,
    grade: grade.grade,
    createdAt: grade.createdAt,
    updatedAt: grade.updatedAt
  };
};

const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'];

const getAllGrades = async (req, res) => {
  try {
    const { page = 1, limit = 10, student, course, grade, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter query
    const filterQuery = {};
    if (student) filterQuery.student = student;
    if (course) filterQuery.course = course;
    if (grade) filterQuery.grade = grade;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const grades = await Grade.find(filterQuery)
      .populate('student', 'fullName email')
      .populate('course', 'title credits lecturer')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalGrades = await Grade.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalGrades / parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: grades.length,
      totalGrades,
      totalPages,
      currentPage: parseInt(page),
      data: grades.map(grade => sanitizeGrade(grade))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id)
      .populate('student', 'fullName email')
      .populate('course', 'title credits lecturer');
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    // If user is a student, check if it's their grade
    if (req.user.role === 'student' && grade.student._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own grades.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sanitizeGrade(grade)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const createGrade = async (req, res) => {
  try {
    const { studentId, courseId, grade } = req.body;
    
    // Validation
    if (!studentId || !courseId || !grade) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: studentId, courseId, grade'
      });
    }
    
    // Validate grade value
    if (!validGrades.includes(grade)) {
      return res.status(400).json({
        success: false,
        message: `Invalid grade. Valid grades are: ${validGrades.join(', ')}`
      });
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if student is enrolled in the course
    if (!student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'Student is not enrolled in this course'
      });
    }
    
    // Check if grade already exists for this student-course combination
    const existingGrade = await Grade.findOne({
      student: studentId,
      course: courseId
    });
    
    if (existingGrade) {
      return res.status(400).json({
        success: false,
        message: 'Grade already exists for this student-course combination. Use update instead.'
      });
    }
    
    // Create grade
    const newGrade = await Grade.create({
      student: studentId,
      course: courseId,
      grade
    });
    
    // Populate the created grade
    const populatedGrade = await Grade.findById(newGrade._id)
      .populate('student', 'fullName email')
      .populate('course', 'title credits lecturer');
    
    res.status(201).json({
      success: true,
      message: 'Grade created successfully',
      data: sanitizeGrade(populatedGrade)
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

const updateGrade = async (req, res) => {
  try {
    const { grade } = req.body;
    
    if (!grade) {
      return res.status(400).json({
        success: false,
        message: 'Grade value is required'
      });
    }
    
    // Validate grade value
    if (!validGrades.includes(grade)) {
      return res.status(400).json({
        success: false,
        message: `Invalid grade. Valid grades are: ${validGrades.join(', ')}`
      });
    }
    
    // Find and update grade
    const updatedGrade = await Grade.findByIdAndUpdate(
      req.params.id,
      { grade },
      {
        new: true,
        runValidators: true
      }
    ).populate('student', 'fullName email')
     .populate('course', 'title credits lecturer');
    
    if (!updatedGrade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Grade updated successfully',
      data: sanitizeGrade(updatedGrade)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
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

const deleteGrade = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    
    if (!grade) {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    await Grade.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Grade deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Grade not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getGradesByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // If user is a student, ensure they can only access their own grades
    if (req.user.role === 'student' && req.user.userId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own grades.'
      });
    }
    
    // Check if student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    const grades = await Grade.find({ student: studentId })
      .populate('course', 'title credits lecturer')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: grades.length,
      data: {
        student: {
          studentId: student._id,
          fullName: student.fullName,
          email: student.email
        },
        grades: grades.map(grade => sanitizeGrade(grade))
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

const getMyGrades = async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const grades = await Grade.find({ student: studentId })
      .populate('course', 'title credits lecturer')
      .sort({ createdAt: -1 });
    
    // Calculate GPA (assuming A=4.0, B=3.0, etc.)
    const gradePoints = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D+': 1.3, 'D': 1.0, 'F': 0.0
    };
    
    let totalPoints = 0;
    let totalCredits = 0;
    
    grades.forEach(grade => {
      const points = gradePoints[grade.grade] || 0;
      const credits = grade.course.credits || 3; // Default to 3 credits if not specified
      totalPoints += points * credits;
      totalCredits += credits;
    });
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    
    res.status(200).json({
      success: true,
      count: grades.length,
      data: {
        grades: grades.map(grade => sanitizeGrade(grade)),
        gpa: parseFloat(gpa),
        totalCredits
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

const getGradesByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const grades = await Grade.find({ course: courseId })
      .populate('student', 'fullName email')
      .sort({ 'student.fullName': 1 });
    
    // Calculate grade distribution
    const gradeDistribution = {};
    validGrades.forEach(grade => gradeDistribution[grade] = 0);
    grades.forEach(grade => {
      gradeDistribution[grade.grade]++;
    });
    
    res.status(200).json({
      success: true,
      count: grades.length,
      data: {
        course: {
          courseId: course._id,
          title: course.title,
          credits: course.credits,
          lecturer: course.lecturer
        },
        grades: grades.map(grade => sanitizeGrade(grade)),
        gradeDistribution
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const bulkCreateGrades = async (req, res) => {
  try {
    const { courseId, grades } = req.body;
    
    if (!courseId || !grades || !Array.isArray(grades)) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and grades array are required'
      });
    }
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const results = [];
    const errors = [];
    
    for (let i = 0; i < grades.length; i++) {
      const { studentId, grade } = grades[i];
      
      try {
        // Validate grade
        if (!validGrades.includes(grade)) {
          errors.push({
            index: i,
            studentId,
            message: `Invalid grade: ${grade}`
          });
          continue;
        }
        
        // Check if student exists and is enrolled
        const student = await Student.findById(studentId);
        if (!student) {
          errors.push({
            index: i,
            studentId,
            message: 'Student not found'
          });
          continue;
        }
        
        if (!student.enrolledCourses.includes(courseId)) {
          errors.push({
            index: i,
            studentId,
            message: 'Student not enrolled in course'
          });
          continue;
        }
        
        // Upsert grade (update if exists, create if not)
        const upsertedGrade = await Grade.findOneAndUpdate(
          { student: studentId, course: courseId },
          { grade },
          { 
            new: true, 
            upsert: true,
            runValidators: true
          }
        ).populate('student', 'fullName email');
        
        results.push(sanitizeGrade(upsertedGrade));
      } catch (error) {
        errors.push({
          index: i,
          studentId,
          message: error.message
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: `Processed ${grades.length} grades. ${results.length} successful, ${errors.length} errors.`,
      data: {
        successful: results,
        errors: errors
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
  sanitizeGrade,
  validGrades,
  getAllGrades,
  getGrade,
  createGrade,
  updateGrade,
  deleteGrade,
  getGradesByStudent,
  getMyGrades,
  getGradesByCourse,
  bulkCreateGrades
};