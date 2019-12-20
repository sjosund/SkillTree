const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    node_id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    link: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Resources = mongoose.model('Resource', resourceSchema);

module.exports = Resources;
