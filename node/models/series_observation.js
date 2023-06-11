const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeriesObservationSchema = new Schema({
	realtime_start: {
		type: Date,
		required: true
	},
	realtime_end: {
		type: Date,
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	value: {
		type: Number,
		required: true
	},
	series_id: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("SeriesObservation", SeriesObservationSchema);
