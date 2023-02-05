const Series_Observation = require('../models/series_observation');

// Display Series Observation home page
exports.index = (req, res) => {
	res.send('NOT IMPLEMENTED: Series_Observation index');
};

// Display list of all Series_Observation.
exports.series_observation_list = (req, res) => {
	Series_Observation.find((err, series_observation) => {
		if (err) return handleError(err);
		// console.log( series_observation );
		// console.log( series_observation[0].name );

		series_observation = series_observation.map(series_observation => series_observation.toJSON()); // handlebars works better with JSON instead of Mongoose objects

		// res.send( series_observation );
		res.render(
			'resources',
			{
				data: series_observation,
				title: 'Series Observation',
			}
		);
	});
};

// Display detail page for a specific Series Observation.
exports.series_observation_detail = (req, res) => {
	// res.send(`NOT IMPLEMENTED: Series_Observation detail: ${req.params.id}`);
	Series_Observation.find({ id: req.params.id }, "id name parentId", (err, series_observation) => {
		if (err) return handleError(err);
		// 'series_observation' contains the list of athletes that match the criteria.
		console.log( series_observation );
		res.send( series_observation );
	});
};

// Display Series_Observation create form on GET.
exports.series_observation_create_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Series_Observation create GET');
};

// Handle Series_Observation create on POST.
exports.series_observation_create_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Series_Observation create POST');
};

// Display Series_Observation delete form on GET.
exports.series_observation_delete_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Series_Observation delete GET');
};

// Handle Series_Observation delete on POST.
exports.series_observation_delete_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Series_Observation delete POST');
};

// Display Series_Observation update form on GET.
exports.series_observation_update_get = (req, res) => {
	res.send('NOT IMPLEMENTED: Series_Observation update GET');
};

// Handle Series_Observation update on POST.
exports.series_observation_update_post = (req, res) => {
	res.send('NOT IMPLEMENTED: Series_Observation update POST');
};
