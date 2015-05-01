var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
	var db = req.db;
	var nodes = db.get('nodes');
	var subject = req.query['subject'];

	nodes.find(
		{class: subject},
		function (err, nodes)
	{
		var edges = db.get('edges');
		ids = [];
		for (var i = nodes.length - 1; i >= 0; i--) {
			ids.push(nodes[i]['id']);
		};
		edges.find({from: {$in : ids}}, function(err, edges_) {
			res.render(
				'index',
				{
					nodes : nodes,
					edges : edges_,
					title : 'Skill Tree',
				}
			)
		})
	})
});

router.post('/nodes', function (req, res) {
	console.log(req.body['node_name']);
	var db = req.db;
	var nodes = db.get('nodes');

	nodes.find(
		{},
		{sort: {id : -1}, limit: 1},
		function (err, max_id_obj) {
			max_id = max_id_obj[0]['id'];
			console.log(max_id_obj);
			nodes.insert({
				label: req.body['node_name'],
				class: 'programming',
				id: max_id + 1
			})
		}
	)
});

router.post('/edges', function (req, res) {
	console.log(req.body['from_node_name']);
	var db = req.db;
	var nodes = db.get('nodes');

	nodes.find(
		{label: req.body['from_node_name']},
		{},
		function (err, from_node) {
			var from_id = from_node[0]['id'];
			nodes.find(
				{label: req.body['to_node_name']},
				{},
				function (err, to_node) {
			
					var to_id = to_node[0]['id'] 
					var edges = db.get('edges');
					console.log(from_id);
					console.log(to_id);
					edges.insert({
						from: from_id,
						to: to_id
					})
				}
			)
		}
	)
});

module.exports = router;
