const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');

// TODO Deduplicate
const nodeRouter = express.Router();
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"));

function addNode(name) {
    const session = driver.session();
    const newNode = session.run(
        'CREATE (a:Person {name: $name}) RETURN a, id(a) as source',
        {name: name}
    ).then(res => {
        session.close();
        return res.records.map(r => {
            return {
                source: r.get('source').toNumber().toString(),
                source_name: name,
                size: 3,
                color: "#008cc2"
            }
        })[0]
    });
    return newNode;
}

nodeRouter.use(bodyParser.json());

nodeRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .post((req, res, next) => {
        console.log(req.body);
        addNode(req.body.name).then(n => {
            const ret = JSON.stringify(n);
            console.log(ret);
            res.end(ret);
        })
    });

module.exports = nodeRouter;
