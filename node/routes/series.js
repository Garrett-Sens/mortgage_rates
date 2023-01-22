const express = require('express');
const router = express.Router();
const series_controller = require('../controllers/seriesController');

// GET series home page.
// router.get('/', series_controller.index);

// GET request for creating a Release. NOTE This must come before routes that display Release (uses id).
router.get('/create', series_controller.series_create_get);

// POST request for creating Release.
router.post('/create', series_controller.series_create_post);

// GET request to delete Release.
router.get('/:id/delete', series_controller.series_delete_get);

// POST request to delete Release.
router.post('/:id/delete', series_controller.series_delete_post);

// GET request to update Release.
router.get('/:id/update', series_controller.series_update_get);

// POST request to update Release.
router.post('/:id/update', series_controller.series_update_post);

// GET request for one Release.
router.get('/:id', series_controller.series_detail);

// GET request for list of all Release items.
router.get('/', series_controller.series_list);

module.exports = router;
