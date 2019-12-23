const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nodeStatusSchema = new Schema({
    nodeId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        default: 'tmp'
    },
    status: {
        type: String,
        enum: ['goal', 'known', 'unknown'],
        required: true
    }
}, {
    timestamps: true
});

const NodeStatus = mongoose.model('NodeStatus', nodeStatusSchema);

module.exports = NodeStatus;
