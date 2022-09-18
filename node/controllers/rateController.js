const Rate = require('../models/rate');

// Display list of all Rates.
exports.rate_list = (req, res) => {
	// let rates = Rate::getAll();
	res.send('NOT IMPLEMENTED: Rate list');
};

// Display detail page for a specific Rate.
exports.rate_detail = (req, res) => {
	res.send(`NOT IMPLEMENTED: Rate detail: ${req.params.id}`);
};

// Display Rate create form on GET.
exports.rate_create_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Rate create GET');
};

// Handle Rate create on POST.
exports.rate_create_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Rate create POST');
};

// Display Rate delete form on GET.
exports.rate_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Rate delete GET');
};

// Handle Rate delete on POST.
exports.rate_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Rate delete POST');
};

// Display Rate update form on GET.
exports.rate_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Rate update GET');
};

// Handle Rate update on POST.
exports.rate_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Rate update POST');
};
