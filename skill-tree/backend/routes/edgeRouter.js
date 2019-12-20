const express = require('express');
const bodyParser = require('body-parser');
const neo4j = require('neo4j-driver');

// TODO Deduplicate
const edgeRouter = express.Router();
const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"));

async function addEdges(source, targets) {
    const edges = await Promise.all(targets.map(target => addEdge(source, target)));
    return edges
}

async function addEdge(source, target) {
    const session = driver.session();
    const query = 'MATCH (a:Person), (b:Person) WHERE id(a) = $source_id and id(b) = $target_id CREATE (a)<-[r:KNOWS]-(b) RETURN id(r) as rel_id';
    const edge = await session.run(query, {source_id: parseInt(source.id), target_id: parseInt(target.id)}).then(
        res => {
            return res.records.map(r => {
                return {
                    id: r.get('rel_id').toString(),
                    source: source.id.toString(),
                    source_name: source.label,
                    target: target.id.toString(),
                    target_name: target.label,
                    type: 'arrow',
                    size: 2,
                    count: 1
                };
            })[0]
        }
    ).finally(() => {
        session.close();
    });
    return edge;
}

edgeRouter.use(bodyParser.json());

edgeRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        next();
    })
    .post((req, res, next) => {
        console.log(req.body);
        addEdges(req.body.source, Object.values(req.body.targets)).then(edges => {
            const ret = JSON.stringify(edges);
            console.log(ret);
            res.end(ret);
        })
    });

module.exports = edgeRouter;
