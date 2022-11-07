const express = require('express');
const router = express.Router();
const category_controller = require('../controllers/categoryController');

// // GET catalog home page.
// router.get('/', category_controller.index);

// GET request for creating a Category. NOTE This must come before routes that display Category (uses id).
router.get('/create', category_controller.category_create_get);

// POST request for creating Category.
router.post('/create', category_controller.category_create_post);

// GET request to delete Category.
router.get('/:id/delete', category_controller.category_delete_get);

// POST request to delete Category.
router.post('/:id/delete', category_controller.category_delete_post);

// GET request to update Category.
router.get('/:id/update', category_controller.category_update_get);

// POST request to update Category.
router.post('/:id/update', category_controller.category_update_post);

// GET request for one Category.
router.get('/:id', category_controller.category_detail);

// GET request for list of all Category items.
router.get('/', category_controller.category_list);

module.exports = router;
