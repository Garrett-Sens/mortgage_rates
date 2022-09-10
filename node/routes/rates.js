// home.js - Home route module.

// home page
// router.get( '/', function( req, res )
// 	{
// 		res.render(
// 			'layouts/layout.hbs', // web_server/views/home.hbs
// 			{
// 				fred_key: process.env.FRED_KEY,
// 				title: 'Home',
// 				bodyPartial: 'home'
// 				// name: 'Garrett Sens'
// 			}
// 		); 
// 	}
// );

// router.get('/test', (req, res) => {
// 	res.send('Hello World');
// });

// // static html page. does not use Handlebars view engine from line 36
// router.get( '/static', function( req, res )
// 	{
// 		res.sendFile(pathViews + '/static.html'); 
// 	}
// );

// // Home page route.
// router.get('/', function (req, res) {
//   res.send('Home page');
// })

// // About page route.
// router.get('/about', function (req, res) {
//   res.send('About this site');
// })

const express = require('express');
const router = express.Router();
const rate_controller = require('../controllers/rateController');

// GET catalog home page.
// router.get('/', rate_controller.index);
router.get('/', rate_controller.rate_list);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get('/rate/create', rate_controller.rate_create_get);

// POST request for creating Book.
router.post('/rate/create', rate_controller.rate_create_post);

// GET request to delete Book.
router.get('/rate/:id/delete', rate_controller.rate_delete_get);

// POST request to delete Book.
router.post('/rate/:id/delete', rate_controller.rate_delete_post);

// GET request to update Book.
router.get('/rate/:id/update', rate_controller.rate_update_get);

// POST request to update Book.
router.post('/rate/:id/update', rate_controller.rate_update_post);

// GET request for one Book.
router.get('/rate/:id', rate_controller.rate_detail);

// GET request for list of all Book items.
router.get('/rates', rate_controller.rate_list);

module.exports = router;
