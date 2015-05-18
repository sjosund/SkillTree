function graph(data) {
    var raw_nodes = data.responseJSON['nodes'];
    var edges = data.responseJSON['edges'];

    var g = new dagreD3.graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function() { return {}; });
    // Here we"re setting nodeclass, which is used by our custom drawNodes function
    // below.

    nodes = {};
    for (var i = 0; i < raw_nodes.length; i++) {
        node = new Node(raw_nodes[i]);
        nodes[raw_nodes[i]['@rid']] = node;
        g.setNode(
            node.id,
            {
                label: node.name,
                class: "programming"
            }
        );
    }
    g.nodes().forEach(function(v) {
      var node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 10;
    });
    for (var i = 0; i < edges.length; i++) {
        g.setEdge(
            edges[i]['out'],
            edges[i]['in']
        );
    }

    // Create the renderer
    var render = new dagreD3.render();
    // Set up an SVG group so that we can translate the final graph.
    var svg = d3.select("svg"),
        svgGroup = svg.append("g");
    $(".edgePath").css({"stroke-width": '5px'});
    // Run the renderer. This is what draws the final graph.
    render(d3.select("svg g"), g);

    svgGroup.selectAll("g.node")
        .each(function(v) {
            nodes[v].qtip($(this));
        })

    // Center the graph
    var xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
    svg.attr("height", g.graph().height + 40);
};


var Node = function (node) {
    this.name = node.name;
    this.id = node['@rid'];
    this.resources = [];
};
Node.prototype.qtip = function (graph_node) {
    var _this = this;
    $.ajax({
        datatype: 'json',
        url: '/resources',
        data: {id: _this.id},
        complete: function (resources) {
            _this.resources = _this.parse_resources(resources);
            graph_node.qtip({
                content: _this.resources_view(),
                show: 'click',
                hide: 'unfocus',
                position: {
                    mouse: false
                },
                style: 'qtip-light'
            });
            console.log(_this);
        }
    });
};
Node.prototype.parse_resources = function (resources) {
    res = resources.responseJSON.map(function (resource) {
        return new Resource(resource);
    });
    return res;
};
Node.prototype.resources_view = function() {
    content = "<h4>Resources</h4>" + this.resources.reduce(
        function (prev_value, resource, i, a) {
            return resource.display();
        },
        ""
    );
    return content;
};

var Resource = function(resource) {
    this.id = resource['@rid'];
    this.url = resource['link'];
    this.name = resource['name'];
};
Resource.prototype.display = function () {
    console.log(this.id);
    console.log(typeof(this.id));
    var s_ = this.id.substring(1);
    var s__ = s_.split(':');
    return "<a target='_blank' href=" + this.url + ">" + this.name + "</a> " +
        "<img src='/images/plus.png' class=voteButton onclick='vote(1, " + s__[0] + "," + s__[1] + ")'>" +
        "<img src='/images/minus.png' class=voteButton onclick='vote(-1, " + s__[0] + "," + s__[1] + ")'> <br>";
};
var vote = function(score, type_id, id) {
    $.ajax({
        type: "POST",
        url: '/vote',
        data: {id: '#' + type_id + ":" + id},
        success: function(){console.log('Voted');}
    });
};