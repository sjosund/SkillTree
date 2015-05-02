function graph(nodes, edges) {
    var g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function() { return {}; });
    // Here we"re setting nodeclass, which is used by our custom drawNodes function
    // below.

    for (i = 0; i < nodes.length; i++) {
        g.setNode(
            nodes[i]['id'],
            {
                label: nodes[i]['label'],
                class: nodes[i]['class'],
                resources: nodes[i]['resources'].sort(
                    function(a, b){return b['score'] - a['score'];}
                )
            }
        );
    }
    g.nodes().forEach(function(v) {
      var node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 10;
    });
    for (i = 0; i < edges.length; i++) {
        g.setEdge(
            edges[i]['from'],
            edges[i]['to']
        );
    }

    // Create the renderer
    var render = new dagreD3.render();
    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg"),
        svgGroup = svg.append("g");

    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    svgGroup.selectAll("g.node")
        .each(function(v) {
            $(this).qtip({
                content: "<h4>Resources</h4>" + g.node(v).resources.reduce(
                    function (prev_value, resource, i, a) {
                        return prev_value + "<a target='_blank' href=" + resource['link'].toString() + ">" + resource['name'] + "</a> " + resource['score'] + " <br>";
                    },
                    ""
                ),
                show: 'click',
                hide: 'unfocus',  
                position: {
                    target: 'mouse',
                    adjust: {
                        mouse: false
                    }
                } 
            });
        });

    // Center the graph
    var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
};