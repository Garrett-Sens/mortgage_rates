const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SeriesSchema = new Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	realtime_start: {
		type: Date,
		required: true
	},
	realtime_end: {
		type: Date,
		required: true
	},
	title: {
		type: String,
		required: true,
		unique: true
	},
	observation_start: {
		type: Date,
		required: true
	},
	observation_end: {
		type: Date,
		required: true
	},
	frequency: {
		type: String,
		required: true
	},
	frequency_short: {
		type: String,
		required: true
	},
	units: {
		type: String,
		required: true
	},
	units_short: {
		type: String,
		required: true
	},
	seasonal_adjustment: {
		type: String,
		required: true
	},
	seasonal_adjustment_short: {
		type: String,
		required: true
	},
	last_updated: {
		type: Date,
		required: true
	},
	popularity: {
		type: Number,
		required: true
	},
	notes: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model("Series", SeriesSchema);
