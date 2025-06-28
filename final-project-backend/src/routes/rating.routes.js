const express = require('express');
const {
  getAllRatings,
  getRating,
  createRating,
  updateRating,
  deleteRating,
  getMyRatings,
  getRatingsByCourse,
  getRatingsByStudent,
  checkRatingExists
} = require('../controllers/rating.controller');

const { adminMiddleware, studentMiddleware } = require('../middleware/auth.middleware');

const router = express.Router();

router.get('/course/:courseId', getRatingsByCourse);

// Student-only routes
router.get('/my-ratings', studentMiddleware, getMyRatings);
router.post('/', studentMiddleware, createRating);
router.get('/check/:courseId', studentMiddleware, checkRatingExists);
router.put('/:id', studentMiddleware, updateRating); 
router.delete('/:id', studentMiddleware, deleteRating);

// Mixed access routes - need custom middleware
router.get('/student/:studentId', authorizeRatingAccess, getRatingsByStudent);
router.get('/:id', authorizeRatingAccess, getRating);

// Admin-only routes
router.get('/', adminMiddleware, getAllRatings);

// Custom middleware to authorize rating access
// Admins can access all ratings, students can only access their own
function authorizeRatingAccess(req, res, next) {
  // First check if user is authenticated
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  const { role, userId } = req.user;
  
  // Admin can access all ratings
  if (role === 'admin') {
    return next();
  }
  
  // Student can only access their own ratings
  if (role === 'student') {
    // For routes with studentId parameter, check if it matches the authenticated user
    if (req.params.studentId && req.params.studentId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only view your own ratings.'
      });
    }
    return next();
  }
  
  return res.status(403).json({
    success: false,
    message: 'Access denied. Insufficient permissions.'
  });
}

module.exports = router;