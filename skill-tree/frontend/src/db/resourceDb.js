const mongoose = require('mongoose');
const Schema =mongoose.Schema;

const resourceSchema = new Schema({
    node_id: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.ObjectId,
        required: true
    }
}, {
    timestamps: true
});

const Resources = mongoose.model('Resource', resourceSchema);

const url = 'mongodb://127.0.0.1:27017/skill-tree';
// const connect = mongoose.connect(url);

function addResource(nodeId, text, url, userId) {
    connect.then()
    const resource = Resources({
        node_id: nodeId,
        text: text,
        url: url,
        creator: userId
    });
    resource.save()
        .then((res) => {
            console.log(res);
        })
        .catch((err) => {
            console.log(err)
        })
}

async function getResources(nodeId) {
    const res = await Resources.find({node_id: nodeId});
    console.log(res);
    return res;
}

export default { addResource, getResources };
