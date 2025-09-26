const express = require('express');
const router = express.Router();
const { createService, getServices, getServiceById, updateService, deleteService } = require('../controllers/serviceController');

router.route('/').post(createService).get(getServices);
router.route('/:id').get(getServiceById).put(updateService).delete(deleteService);

module.exports = router;
