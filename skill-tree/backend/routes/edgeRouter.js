const express = require('express');
const bodyParser = require('body-parser');
const graph = require('../db/graph');

const edgeRouter = express.Router();

edgeRouter.use(bodyParser.json());

edgeRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .post((req, res, next) => {
        console.log(req.body);
        graph.addEdges(req.body.source, Object.values(req.body.targets)).then(edges => {
            const ret = JSON.stringify(edges);
            console.log(ret);
            res.end(ret);
        })
    });

module.exports = edgeRouter;
