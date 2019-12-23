const express = require('express');
const bodyParser = require('body-parser');
const graph = require('../db/graph');

const nodeRouter = express.Router();


nodeRouter.use(bodyParser.json());

nodeRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .post((req, res, next) => {
        console.log(req.body);
        graph.addNode(req.body.name).then(n => {
            const ret = JSON.stringify(n);
            console.log(ret);
            res.end(ret);
        })
    });

module.exports = nodeRouter;
