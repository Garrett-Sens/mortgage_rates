const express = require('express');
const router = express.Router();
const release_controller = require('../controllers/releaseController');

// GET release home page.
// router.get('/', release_controller.index);

// GET request for creating a Release. NOTE This must come before routes that display Release (uses id).
router.get('/create', release_controller.release_create_get);

// POST request for creating Release.
router.post('/create', release_controller.release_create_post);

// GET request to delete Release.
router.get('/:id/delete', release_controller.release_delete_get);

// POST request to delete Release.
router.post('/:id/delete', release_controller.release_delete_post);

// GET request to update Release.
router.get('/:id/update', release_controller.release_update_get);

// POST request to update Release.
router.post('/:id/update', release_controller.release_update_post);

// GET request for one Release.
router.get('/:id', release_controller.release_detail);

// GET request for list of all Release items.
router.get('/', release_controller.release_list);

module.exports = router;
