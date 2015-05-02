$(document).ready(function() {
    $("div#add_node_form").append(
        $("<form/>", {
            action: '/nodes',
            method: 'post'
        }).append(
            $("<input/>", {
                type: 'text',
                id: 'vname',
                name: 'node_name',
                placeholder: 'Node name'
            }),
            $("<br/>"),
            $("<input/>", {
                type: 'submit',
                id: 'submit',
                value: 'Add node to graph'
            })
        )
    )

    $("div#add_edge_form").append(
        $("<form/>", {
            action: '/edges',
            method: 'post'
        }).append(
            $("<input/>", {
                type: 'text',
                id: 'vname',
                name: 'from_node_name',
                placeholder: 'From node name'
            }),
            $("<input/>", {
                type: 'text',
                id: 'vname',
                name: 'to_node_name',
                placeholder: 'To node name'
            }),
            $("<br/>"),
            $("<input/>", {
                type: 'submit',
                id: 'submit',
                value: 'Add edge to graph'
            })
        )
    )

    $("div#add_resource_form").append(
        $("<form/>", {
            action: '/resources',
            method: 'post'
        }).append(
            $("<input/>", {
                type: 'text',
                id: 'vname',
                name: 'node_name',
                placeholder: 'Node name'
            }),
            $("<input/>", {
                type: 'text',
                id: 'vname',
                name: 'link',
                placeholder: 'Link'
            }),
            $("<input/>", {
                type: 'text',
                id: 'vname',
                name: 'name',
                placeholder: 'Link name'
            }),
            $("<br/>"),
            $("<input/>", {
                type: 'submit',
                id: 'submit',
                value: 'Add resource to node'
            })
        )
    )

    $("form").submit(function (e) {
        //e.preventDefault();
        var $this = $(this);
        $.post(
            $this.attr("action"),
            $this.serialize(),
            function (data) {},
            "json"
        );
    });
});