const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true},
    imagePath: { type: String, required: true},
    userId: {type: mongoose.Schema.Types.ObjectId, required: true}
});

module.exports = mongoose.model('Blogs', blogSchema);