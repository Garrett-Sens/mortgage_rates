const Series = require('../models/series');

// Display Series home page
exports.index = (req, res) => {
	res.send('NOT IMPLEMENTED: Series index');
};

// Display list of all Series.
exports.series_list = (req, res) => {
	Series.find((err, series) => {
		if (err) return handleError(err);
		console.log( series );
		// console.log( series[0].name );

		series = series.map(series => series.toJSON()); // handlebars works better with JSON instead of Mongoose objects

		// res.send( series );
		res.render(
			'resources',
			{
				data: series,
				title: 'Series',
			}
		);
	});
};

// Display detail page for a specific Series.
exports.series_detail = (req, res) => {
	// res.send(`NOT IMPLEMENTED: Series detail: ${req.params.id}`);
	Series.find({ id: req.params.id }, "id name parentId", (err, series) => {
		if (err) return handleError(err);
		// 'series' contains the list of athletes that match the criteria.
		console.log( series );
		res.send( series );
	});
};

// Display Series create form on GET.
exports.series_create_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Series create GET');
};

// Handle Series create on POST.
exports.series_create_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Series create POST');
};

// Display Series delete form on GET.
exports.series_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Series delete GET');
};

// Handle Series delete on POST.
exports.series_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Series delete POST');
};

// Display Series update form on GET.
exports.series_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Series update GET');
};

// Handle Series update on POST.
exports.series_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Series update POST');
};
