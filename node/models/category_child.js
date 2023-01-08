const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryChildSchema = new Schema({
	id: {
		type: Number,
		required: true,
		unique: true
	},
	name: {
		type: String,
		required: true,
		unique: true
	},
	parent_id: {
		type: Number,
		required: true
	}
});

module.exports = mongoose.model("CategoryChild", CategoryChildSchema);
