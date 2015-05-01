$(document).ready(function() {
	$("div#add_node_form").append(
// Creating Form Div and Adding <h2> and <p> Paragraph Tag in it.
		$("<p/>").text("Add a node"),
		$("<form/>", {
			action: '/nodes',
			method: 'post'
		}).append(
			$("<input/>", {
				type: 'text',
				id: 'vname',
				name: 'node_name',
				placeholder: 'Node Name'
			}),
			$("<br/>"),
			$("<input/>", {
				type: 'submit',
				id: 'submit',
				value: 'Submit'
			})
		)
	)

	$("div#add_edge_form").append(
// Creating Form Div and Adding <h2> and <p> Paragraph Tag in it.
		$("<p/>").text("Add an edge"),
		$("<form/>", {
			action: '/edges',
			method: 'post'
		}).append(
			$("<input/>", {
				type: 'text',
				id: 'vname',
				name: 'from_node_name',
				placeholder: 'From Node Name'
			}),
			$("<input/>", {
				type: 'text',
				id: 'vname',
				name: 'to_node_name',
				placeholder: 'To Node Name'
			}),
			$("<br/>"),
			$("<input/>", {
				type: 'submit',
				id: 'submit',
				value: 'Submit'
			})
		)
	)
});

$("form").submit(function (e) {
	var $this = $(this);
	$.post(
		$this.attr("action"),
		$this.serialize(),
		function (data) {},
		"json"
	);
});