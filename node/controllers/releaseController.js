const Release = require('../models/release');

// Display list of all Releases.
exports.release_list = (req, res) => {
	// let releases = Release::getAll();
	// res.send('NOT IMPLEMENTED: Release list');
	res.render(
		'layouts/layout',
		{
			title: 'Releases',
			bodyPartial: 'home',
		}
	);
};

// Display detail page for a specific Release.
exports.release_detail = (req, res) => {
	res.send(`NOT IMPLEMENTED: Release detail: ${req.params.id}`);
};

// Display Release create form on GET.
exports.release_create_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Release create GET');
};

// Handle Release create on POST.
exports.release_create_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Release create POST');
};

// Display Release delete form on GET.
exports.release_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Release delete GET');
};

// Handle Release delete on POST.
exports.release_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Release delete POST');
};

// Display Release update form on GET.
exports.release_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Release update GET');
};

// Handle Release update on POST.
exports.release_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Release update POST');
};
