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
				class: nodes[i]['class']
			}
		);
	}
	g.nodes().forEach(function(v) {
	  var node = g.node(v);
	  // Round the corners of the nodes
	  node.rx = node.ry = 5;
	});
	//Set up edges, no special attributes.
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

	// var zoom = d3.behavior.zoom().on("zoom", function() {
 //    inner.attr("transform", "translate(" + d3.event.translate + ")" +
 //        "scale(" + d3.event.scale + ")");
	// });
	//svg.call(zoom);
	// Run the renderer. This is what draws the final graph.
	render(d3.select("svg g"), g);
	// Center the graph
	var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
	svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
	svg.attr("height", g.graph().height + 40);
};