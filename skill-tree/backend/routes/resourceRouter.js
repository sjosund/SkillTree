const express = require('express');
const bodyParser = require('body-parser');

const Resources = require('../models/resources');


const resourceRouter = express.Router();
resourceRouter.use(bodyParser.json());


resourceRouter.route('/:nodeId')
    .get((req, res, next) => {
        Resources.find({ node_id: req.params.nodeId })
            .then(resources => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                console.log(resources);
                res.json(resources);
            }, (err) => next(err));
    });

resourceRouter.route('/')
    .post((req, res, next) => {
        // TODO validate input
        Resources.create(req.body)
            .then(resp => {
                console.log('Inserted into DB');
            }, err => { next(err); });
    });


module.exports = resourceRouter;