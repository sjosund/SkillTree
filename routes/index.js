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
    var db = req.db;
    var nodes = db.get('nodes');

    nodes.find(
        {},
        {sort: {id : -1}, limit: 1},
        function (err, max_id_obj) {
            max_id = max_id_obj[0]['id'];
            nodes.insert({
                label: req.body['node_name'],
                class: 'programming',
                id: max_id + 1,
                resources: []
            })
            res.redirect(req.header('Referer'));
        }
    )
});

router.post('/resources', function (req, res) {
    var db = req.db;
    var nodes = db.get('nodes');

    nodes.update(
        {label: req.body['node_name']},
        {$push: {
            resources: {
                link: req.body['link'],
                score: 1,
                name: req.body['name']
            }
        }}
    );
    res.redirect(req.header('Referer'));
})

router.post('/edges', function (req, res) {
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
                    edges.insert({
                        from: from_id,
                        to: to_id
                    })
                    res.redirect(req.header('Referer'));
                }
            )
        }
    )
});

module.exports = router;
