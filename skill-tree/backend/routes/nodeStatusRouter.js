const express = require('express');
const bodyParser = require('body-parser');
const nodeStatus = require('../models/nodeStatus');

const nodeStatusRouter = express.Router();
nodeStatusRouter.use(bodyParser.json());


nodeStatusRouter.route('/:userId')
    .get((req, res, next) => {
        nodeStatus.find({ userId: req.params.userId })
            .then(resources => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                console.log(resources);
                res.json(resources);
            }, (err) => next(err));
    });

nodeStatusRouter.route('/')
    .post((req, res, next) => {
        // TODO validate input
        // TODO Don't allow duplicates?
        const userId = 'tmp';
        const doc = {nodeId: req.body.nodeId, userId: userId, status: req.body.status};
        nodeStatus.updateOne({nodeId: req.body.nodeId, userId: userId}, doc, {upsert: true})
            .then(resp => {
                res.json(resp._doc);
            }, err => { next(err); });
    });


module.exports = nodeStatusRouter;
