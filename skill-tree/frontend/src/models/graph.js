const cytoscape = require('cytoscape');

class GraphModel {
    constructor() {
        this.cy = null;
    }

    async load() {
        const graph = await this.loadGraph().then(g => {return this.flatten(g)});
        console.log(graph);
        this.cy = cytoscape({
            elements: graph,
            headless: true
        });

        return this;
    }

    async loadGraph() {
        const ret = await fetch('/graph');
        const graph = await ret.json();
        return graph;
    }

    updateStatus(status) {
        let colors = {
            goal: '#ff8ba7',
            known: '#c3f0ca'
        };
        status.map(s => {
            this.cy.$(`#${s.nodeId}`).data('status', s.status);
            this.cy.$(`#${s.nodeId}`).data('color', colors[s.status]);
            console.log('In update');
            console.log(this.cy.$(`#${s.nodeId}`).data());
        });
        console.log(this.cy.edges());

        return this;
    }

    addNode(node) {
        this.cy.add({
            group: 'nodes',
            data: node,
        });
        return this;
    }

    addEdges(edges) {
        edges.map(edge => {
            this.cy.add({
                group: 'edges',
                data: edge
            })
        })
        return this;
    }

    flatten(graph) {
        console.log('In flatten');
        let ret = [];
        graph.nodes.forEach(n => {
            ret.push({data: n});
        });
        graph.edges.forEach(e => {
            ret.push({data: e});
        });
        return ret;
    }

    toSigma() {
        let ret = {};
        ret['nodes'] = this.cy.nodes().map(n => n.data());
        ret['edges'] = this.cy.edges().map(e => e.data());
        return ret;
    }
}


const graph2 = {
    nodes: [
        { id: "n0", label: "Counting", x: 0, y: 0, size: 100, color: '#008cc2' },
        { id: "n1", label: "Addition", x: 3, y: 1, size: 100, color: '#008cc2' },
        { id: "n2", label: "Multiplication", x: 1, y: 3, size: 100, color: '#E57821' },
        { id: "n3", label: "Subtraction", x: 1, y: 3, size: 100, color: '#E57821' },
        { id: "n4", label: "Division", x: 1, y: 3, size: 100, color: '#E57821' },
        { id: "n5", label: "Length", x: 1, y: 3, size: 100, color: '#E57821' },
        { id: "n6", label: "Area", x: 1, y: 3, size: 100, color: '#E57821' },
        { id: "n7", label: "Volume", x: 1, y: 3, size: 100, color: '#E57821' }
    ],
    edges: [
        { id: "e0", source: "n0", target: "n1", color: '#282c34', type:'arrow', count:1, size:2 },
        { id: "e1", source: "n1", target: "n2", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e2", source: "n1", target: "n3", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e3", source: "n3", target: "n4", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e4", source: "n5", target: "n6", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e5", source: "n6", target: "n7", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e6", source: "n0", target: "n5", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e7", source: "n2", target: "n6", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e8", source: "n1", target: "n3", color: '#282c34', type:'arrow', count:1, size:2},
        { id: "e9", source: "n2", target: "n4", color: '#282c34', type:'arrow', count:1, size:2},
    ]
};

module.exports = GraphModel;
