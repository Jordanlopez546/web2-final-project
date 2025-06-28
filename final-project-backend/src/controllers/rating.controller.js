const CourseRating = require('../models/CourseRating.model');
const Course = require('../models/Course.model');
const Student = require('../models/Student.model');

const sanitizeRating = (rating) => {
  return {
    ratingId: rating._id,
    course: rating.course,
    student: rating.student,
    rating: rating.rating,
    comment: rating.comment,
    createdAt: rating.createdAt,
    updatedAt: rating.updatedAt
  };
};

const getAllRatings = async (req, res) => {
  try {
    const { page = 1, limit = 10, course, student, rating, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build filter query
    const filterQuery = {};
    if (course) filterQuery.course = course;
    if (student) filterQuery.student = student;
    if (rating) filterQuery.rating = parseInt(rating);
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    const ratings = await CourseRating.find(filterQuery)
      .populate('course', 'title lecturer credits')
      .populate('student', 'fullName email')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    const totalRatings = await CourseRating.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalRatings / parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: ratings.length,
      totalRatings,
      totalPages,
      currentPage: parseInt(page),
      data: ratings.map(rating => sanitizeRating(rating))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getRating = async (req, res) => {
  try {
    const rating = await CourseRating.findById(req.params.id)
      .populate('course', 'title lecturer credits')
      .populate('student', 'fullName email');
    
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }
    
    // Check if student can access this rating
    if (req.user.role === 'student' && rating.student._id.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own ratings.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: sanitizeRating(rating)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const createRating = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const studentId = req.user.userId;
    
    // Validation
    if (!courseId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Course ID and rating are required'
      });
    }
    
    // Validate rating value
    if (rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
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
    
    // Check if student exists and is enrolled in the course
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }
    
    if (!student.enrolledCourses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: 'You can only rate courses you are enrolled in'
      });
    }
    
    // Check if student has already rated this course
    const existingRating = await CourseRating.findOne({
      course: courseId,
      student: studentId
    });
    
    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: 'You have already rated this course. Use update instead.'
      });
    }
    
    // Create rating
    const newRating = await CourseRating.create({
      course: courseId,
      student: studentId,
      rating,
      comment: comment?.trim()
    });
    
    // Update course average rating
    await updateCourseAverageRating(courseId);
    
    // Populate the created rating
    const populatedRating = await CourseRating.findById(newRating._id)
      .populate('course', 'title lecturer credits')
      .populate('student', 'fullName email');
    
    res.status(201).json({
      success: true,
      message: 'Rating created successfully',
      data: sanitizeRating(populatedRating)
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

const updateRating = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const studentId = req.user.userId;
    
    // Find existing rating
    const existingRating = await CourseRating.findById(req.params.id);
    
    if (!existingRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }
    
    // Check if student owns this rating
    if (existingRating.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own ratings.'
      });
    }
    
    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5'
      });
    }
    
    // Prepare update object
    const updateFields = {};
    if (rating) updateFields.rating = rating;
    if (comment !== undefined) updateFields.comment = comment?.trim();
    
    // Update rating
    const updatedRating = await CourseRating.findByIdAndUpdate(
      req.params.id,
      updateFields,
      {
        new: true,
        runValidators: true
      }
    ).populate('course', 'title lecturer credits')
     .populate('student', 'fullName email');
    
    // Update course average rating if rating value changed
    if (rating) {
      await updateCourseAverageRating(existingRating.course);
    }
    
    res.status(200).json({
      success: true,
      message: 'Rating updated successfully',
      data: sanitizeRating(updatedRating)
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
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

const deleteRating = async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const rating = await CourseRating.findById(req.params.id);
    
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }
    
    // Check if student owns this rating
    if (rating.student.toString() !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own ratings.'
      });
    }
    
    const courseId = rating.course;
    
    await CourseRating.findByIdAndDelete(req.params.id);
    
    // Update course average rating
    await updateCourseAverageRating(courseId);
    
    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getMyRatings = async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const ratings = await CourseRating.find({ student: studentId })
      .populate('course', 'title lecturer credits')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: ratings.length,
      data: ratings.map(rating => sanitizeRating(rating))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

const getRatingsByCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Get ratings with pagination
    const ratings = await CourseRating.find({ course: courseId })
      .populate('student', 'fullName')
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get aggregated statistics
    const stats = await CourseRating.aggregate([
      { $match: { course: courseId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 },
          ratingDistribution: {
            $push: '$rating'
          }
        }
      }
    ]);
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    if (stats.length > 0) {
      stats[0].ratingDistribution.forEach(rating => {
        distribution[rating]++;
      });
    }
    
    const totalRatings = await CourseRating.countDocuments({ course: courseId });
    const totalPages = Math.ceil(totalRatings / parseInt(limit));
    
    res.status(200).json({
      success: true,
      count: ratings.length,
      totalRatings,
      totalPages,
      currentPage: parseInt(page),
      data: {
        course: {
          courseId: course._id,
          title: course.title,
          lecturer: course.lecturer,
          credits: course.credits
        },
        statistics: {
          averageRating: stats.length > 0 ? Number(stats[0].averageRating.toFixed(2)) : 0,
          totalRatings: stats.length > 0 ? stats[0].totalRatings : 0,
          ratingDistribution: distribution
        },
        ratings: ratings.map(rating => sanitizeRating(rating))
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

const getRatingsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    // Check authorization
    if (req.user.role === 'student' && req.user.userId !== studentId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own ratings.'
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
    
    const ratings = await CourseRating.find({ student: studentId })
      .populate('course', 'title lecturer credits')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: ratings.length,
      data: {
        student: {
          studentId: student._id,
          fullName: student.fullName,
          email: student.email
        },
        ratings: ratings.map(rating => sanitizeRating(rating))
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

const checkRatingExists = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user.userId;
    
    const existingRating = await CourseRating.findOne({
      course: courseId,
      student: studentId
    }).populate('course', 'title');
    
    res.status(200).json({
      success: true,
      data: {
        hasRated: !!existingRating,
        rating: existingRating ? sanitizeRating(existingRating) : null
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

// Helper function to update course average rating
const updateCourseAverageRating = async (courseId) => {
  try {
    const stats = await CourseRating.aggregate([
      { $match: { course: courseId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalRatings: { $sum: 1 }
        }
      }
    ]);
    
    const averageRating = stats.length > 0 ? Number(stats[0].averageRating.toFixed(2)) : 0;
    const totalRatings = stats.length > 0 ? stats[0].totalRatings : 0;
    
    await Course.findByIdAndUpdate(courseId, {
      averageRating,
      totalRatings
    });
  } catch (error) {
    console.error('Error updating course average rating:', error);
  }
};

module.exports = {
  sanitizeRating,
  getAllRatings,
  getRating,
  createRating,
  updateRating,
  deleteRating,
  getMyRatings,
  getRatingsByCourse,
  getRatingsByStudent,
  checkRatingExists
};