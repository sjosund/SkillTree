const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');

const graphRouter = express.Router();
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"));

function fullGraph() {
    const session = driver.session();
    const query = 'MATCH (person) OPTIONAL MATCH (person)-[r]->(friend) RETURN person, friend, id(person) as source, id(friend) as target, id(r) as rel_id';
    const graph = session.run(query).then(
        result => {
            let links = result.records.map(r => {
                if (r.get('target') === null) {
                    return {
                        id: ''.concat(r.get('source').toString() + r.get('person').properties.name),
                        source: r.get('source').toNumber().toString(),
                        source_name: r.get('person').properties.name,
                    }
                }
                return {
                    id: r.get('rel_id').toString(),
                    source: r.get('source').toNumber().toString(),
                    source_name: r.get('person').properties.name,
                    target: r.get('target').toNumber().toString(),
                    target_name: r.get('friend').properties.name,
                    type: 'arrow',
                    size: 2,
                    count: 1
                }
            });

            let nodes = {};
            links.forEach(l => {
                if (l.target === undefined) {
                    nodes[l.source] = {id: l.source, label: l.source_name, size: 3, color:'#008cc2'};
                } else {
                    nodes[l.source] = {id: l.source, label: l.source_name, size: 3, color:'#008cc2'};
                    nodes[l.target] = {id: l.target, label: l.target_name, size: 3, color: '#008cc2'};
                }
            });
            links = links.filter(l => l.target !== undefined);
            session.close();

            return {nodes: Object.values(nodes), edges: links};
        }
    );
    return graph
}

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

graphRouter.use(bodyParser.json());

graphRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .get((req, res, next) => {
        console.log('Getting graph');
        fullGraph().then(graph => {
            const ret = JSON.stringify(graph);
            console.log(ret);
            res.end(ret)
        })
    })
    .post((req, res, next) => {
        console.log(req.body);
        addNode(req.body.name).then(n => {
            const ret = JSON.stringify(n);
            console.log(ret);
            res.end(ret);
        })
    });

module.exports = graphRouter;
