const express = require('express');
const bodyParser = require('body-parser');
const graph = require('../db/graph');

const graphRouter = express.Router();

graphRouter.use(bodyParser.json());

graphRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        console.log('Getting graph');
        graph.fullGraph().then(graph => {
            const ret = JSON.stringify(graph);
            console.log(ret);
            res.end(ret)
        })
    });

module.exports = graphRouter;
