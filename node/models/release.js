// Require Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReleaseSchema = new Schema({
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
	name: {
		type: String,
		required: true,
		unique: true
	},
	press_release: {
		type: Boolean,
		required: true
	},
	link: {
		type: String,
		required: true,
		unique: true
	}
});

module.exports = mongoose.model("Release", ReleaseSchema);
