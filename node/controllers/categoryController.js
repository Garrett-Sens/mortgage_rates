const Category = require('../models/category');

// Display Category home page
exports.index = (req, res) => {
	res.send('NOT IMPLEMENTED: Category index');
};

// Display list of all Categories.
exports.category_list = (req, res) => {
	// let categories = Category::getAll();

	// res.send('NOT IMPLEMENTED: Category list');

	// Category.find({ name: "Categories" }, "id name parentId", (err, categories) => {
	// 	if (err) return handleError(err);
	// 	// 'categories' contains the list of athletes that match the criteria.
	// 	console.log( categories );
	// 	res.send( categories );
	// });

	// res.render(
	// 	'layouts/layout',
	// 	{
	// 		title: 'Categories',
	// 		bodyPartial: 'home',
	// 	}
	// );

	// Category.deleteMany({}).then(function()
	// {
	// 	console.log('Data deleted');
	// }).catch(function(error)
	// {
	// 	console.log(error);
	// });

	Category.find((err, categories) => {
		if (err) return handleError(err);
		// 'categories' contains the list of athletes that match the criteria.
		console.log( categories );
		// console.log( categories[0].name );

		categories = categories.map(category => category.toJSON()); // handlebars works better with JSON instead of Mongoose objects

		// res.send( categories );
		res.render(
			'layouts/layout.hbs',
			{
				bodyPartial: 'resources',
				data: categories,
				title: 'Categories',
			}
		);
	});
};

// Display detail page for a specific Category.
exports.category_detail = (req, res) => {
	// res.send(`NOT IMPLEMENTED: Category detail: ${req.params.id}`);
	Category.find({ id: req.params.id }, "id name parentId", (err, categories) => {
		if (err) return handleError(err);
		// 'categories' contains the list of athletes that match the criteria.
		console.log( categories );
		res.send( categories );
	});
};

// Display Category create form on GET.
exports.category_create_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Category create GET');
};

// Handle Category create on POST.
exports.category_create_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Category create POST');
};

// Display Category delete form on GET.
exports.category_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Category delete GET');
};

// Handle Category delete on POST.
exports.category_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Category delete POST');
};

// Display Category update form on GET.
exports.category_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Category update GET');
};

// Handle Category update on POST.
exports.category_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Category update POST');
};
