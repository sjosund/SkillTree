var express = require('express');
var router = express.Router();

// var mongoose = require('mongoose');

router.get('/users/:id', function(req, res) {
    req.db.model('users').find({}, function (err, user) {
        res.send(user);
    })
})

router.get('/', function(req, res) {
    var db = req.db;
    var nodes = db.model('nodes');
    var subject = req.query['subject'];

    nodes.find(
        {subject: subject},
        function (err, nodes_)
    {
        var edges = db.model('edges');
        ids = [];
        for (var i = nodes_.length - 1; i >= 0; i--) {
            ids.push(nodes_[i]['_id']);

            for (var r = 0; r < nodes_[i]['resources'].length; r++) {

                var score = 0;
                for (var v = 0; v < nodes_[i]['resources'][r]['votes'].length; v++) {

                    score += nodes_[i]['resources'][r]['votes'][v]['value'];
                    console.log('Score : ' + score);
                }

                nodes_[i]['resources'][r].score = score;
                console.log("Resource: " + nodes_[i]['resources'][r]['score']);
            }
        };
        edges.find({from_node: {$in : ids}}, function(err, edges_) {
            res.render(
                'index',
                {
                    nodes : nodes_,
                    edges : edges_,
                    title : 'Skill Tree',
                }
            )
        })
    })
});


router.post('/nodes', function (req, res) {
    var db = req.db;
    var nodes = db.model('nodes');
    var users = db.model('users');


    users.findOne({name: 'sjosund'}, function (err, user) {
        var node = new nodes({
            name: req.body['node_name'],
            subject: 'programming',//req.body['subject'],
            created_by: user._id,
            resources: []
        });
        node.save();

    });
    res.redirect(req.header('Referer'));
});

router.post('/resources', function (req, res) {
    var db = req.db;
    var nodes = db.model('nodes');
    var users = db.model('users');

    console.log("Finding : " + req.body['node_name']);
    nodes.findOne(

        {name: req.body['node_name']},
        function (err, node) {
            
            users.findOne({name: 'sjosund'}, function (err, user) {

                nodes.update(
                    {_id: node._id},
                    {$push: {
                        resources: {
                            url: req.body['url'],
                            votes: [
                                {
                                    value: 1,
                                    created_by: user._id
                                }
                            ],
                            name: req.body['name']
                        },
                    }},
                    function (err) {
                        res.end();
                    }
                );
            });
        }
    )
    res.redirect(req.header('Referer'));
})

router.post('/edges', function (req, res) {
    var db = req.db;
    var nodes = db.model('nodes');

    nodes.find(
        {name: req.body['from_node_name']},
        function (err, from_node) {
            
            var from_id = from_node[0]['_id'];
            nodes.find(
                {name: req.body['to_node_name']},
                function (err, to_node) {           

                    var users = db.model('users');
                    users.find({name: 'sjosund'}, function (err, user) {
                        var to_id = to_node[0]['_id'];
                        var edges = db.model('edges');
                        edge = new edges(
                            {
                                from_node: from_id,
                                to_node: to_id,
                                created_by: user._id,
                                votes: []
                            }
                        )
                        edge.save();
                        res.redirect(req.header('Referer'));
                    });
                }
            )
        }
    )
});

router.post('/vote', function (req, res) {
    console.log(req.body);
});

module.exports = router;