const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const schema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		minLength: 4,
		unique: true,
	},
	favoriteGenre: {
		type: String,
		required: true,
		minLength: 3,
	},
});

schema.plugin(uniqueValidator);

module.exports = mongoose.model('User', schema);
