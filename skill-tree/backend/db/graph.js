const uuidv4 = require('uuid/v4');
const neo4j = require('neo4j-driver');

const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"));

function fullGraph() {
    const session = driver.session();
    const query = 'MATCH (source:Subject) OPTIONAL MATCH (source)-[r:DEPENDENT_ON]->(target:Subject) RETURN source, target, r';
    const graph = session.run(query).then(
        result => {
            let links = result.records.map(r => {
                if (r.get('target') === null) {
                    return {
                        id: r.get('source').properties['nodeId'],
                        source: r.get('source').properties['nodeId'],
                        source_name: r.get('source').properties.name,
                    }
                }
                return {
                    id: r.get('r').properties['edgeId'],
                    source: r.get('source').properties['nodeId'],
                    source_name: r.get('source').properties.name,
                    target: r.get('target').properties['nodeId'],
                    target_name: r.get('target').properties.name,
                    type: 'arrow',
                    size: 2,
                    count: 1,
                    color:'#008cc2'
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


async function addEdges(source, targets) {
    const edges = await Promise.all(targets.map(target => addEdge(source, target)));
    return edges
}

async function addEdge(source, target) {
    const session = driver.session();
    const query = 'MATCH (a:Subject { nodeId: $sourceId }), (b:Subject {nodeId: $targetId}) CREATE (a)<-[r:DEPENDENT_ON {edgeId: $edgeId}]-(b) RETURN r';
    const edgeId = uuidv4();
    const edge = await session.run(query, {
        sourceId: source.id,
        targetId: target.id,
        edgeId: edgeId}).then(
        res => {
            return res.records.map(r => {
                return {
                    id: edgeId,
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
    ).catch(err => {
        console.log(err);
    }).finally(() => {
        session.close();
    });
    return edge;
}

function addNode(name) {
    const session = driver.session();
    const nodeId = uuidv4();
    const newNode = session.run(
        'CREATE (a:Subject {name: $name, nodeId: $nodeId}) RETURN a',
        {name: name, nodeId: nodeId}
    ).then(res => {
        session.close();
        return res.records.map(r => {
            return {
                source: nodeId,
                source_name: name,
                size: 3,
                color: "#008cc2"
            }
        })[0]
    });
    return newNode;
}

module.exports = {
    addEdges: addEdges,
    fullGraph: fullGraph,
    addNode: addNode
};