const express = require('express');
const {
  getAllAdmins,
  getAdmin,
  getProfile,
  createAdmin,
  updateAdmin,
  updateProfile,
  deleteAdmin,
  getDashboardStats
} = require('../controllers/admin.controller');

const router = express.Router();

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/dashboard/stats', getDashboardStats);
router.get('/', getAllAdmins);
router.get('/:id', getAdmin);
router.post('/', createAdmin);
router.put('/:id', updateAdmin);
router.delete('/:id', deleteAdmin);

module.exports = router;