const express = require('express');
const router = express.Router();
const seriesObservationController = require('../controllers/seriesObservationController');

// GET series_observation home page.
// router.get('/', seriesObservationController.index);

// GET request for running sync between FRED api and database
router.get('/synchronize', seriesObservationController.synchronize);

// GET request for creating a Release. NOTE This must come before routes that display Release (uses id).
router.get('/create', seriesObservationController.series_observation_create_get);

// POST request for creating Release.
router.post('/create', seriesObservationController.series_observation_create_post);

// GET request to delete Release.
router.get('/:id/delete', seriesObservationController.series_observation_delete_get);

// POST request to delete Release.
router.post('/:id/delete', seriesObservationController.series_observation_delete_post);

// GET request to update Release.
router.get('/:id/update', seriesObservationController.series_observation_update_get);

// POST request to update Release.
router.post('/:id/update', seriesObservationController.series_observation_update_post);

// GET request for one Release.
router.get('/:id', seriesObservationController.series_observation_detail);

// GET request for list of all Release items.
router.get('/', seriesObservationController.series_observation_list);



module.exports = router;
