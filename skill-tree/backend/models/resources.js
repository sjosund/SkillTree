const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceSchema = new Schema({
    nodeId: {
        type: String,
        required: true
    },
    text: {
        type: String,
        default: ''
    },
    url: {
        type: String,
        required: true
    },
    createdBy: {
        type: String,
        default: 'tmp'
    }
}, {
    timestamps: true
});

const Resources = mongoose.model('Resource', resourceSchema);

module.exports = Resources;
