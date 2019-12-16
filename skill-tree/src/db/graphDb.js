const neo4j = require('neo4j-driver');

const driver = neo4j.driver("bolt://localhost", neo4j.auth.basic("neo4j", "test"));

function registerNode(node, nodes) {
    nodes[node.source] = {
        id: node.source,
        label: node.source_name,
        size: 3,
        color:'#008cc2'
    };
}

export async function fullGraph() {
    const session = driver.session();
    const query = 'MATCH (person) OPTIONAL MATCH (person)-[r]->(friend) RETURN person, friend, id(person) as source, id(friend) as target, id(r) as rel_id';
    const graph = await session.run(query).then(
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

export async function addNode(name) {
    const session = driver.session();
    const newNode =  await session.run(
        'CREATE (a:Person {name: $name}) RETURN a, id(a) as source',
        {name: name}
    ).then(res => {
        session.close();
        return res.records.map(r => {
            return {
                source: r.get('source').toNumber().toString(),
                source_name: name
            }
        })[0]
    });
    return newNode;
}

export async function addEdges(source, targets) {
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
    );
    session.close();
    return edge;
}


// export default { fullGraph, addNode };