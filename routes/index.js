var express = require('express');
var router = express.Router();

// var mongoose = require('mongoose');

router.get('/users/:id', function(req, res) {
    req.db.model('users').find({}, function (err, user) {
        res.send(user);
    })
})

router.get('/', function(req, res) {
    res.render('index', {title: 'Skill Tree'});
});

router.get('/graph', function(req, res) {

    var db = req.db;
    //db.traverse().from('nodes').all().then(function (res) {
    //    console.log(res);
    //});
    db.select().from('nodes').all().then(function (nodes) {
        db.select().from('edges').all().then(function (edges) {
            res.json({nodes: nodes, edges: edges})
        });
    });
});


router.post('/nodes', function (req, res) {
    var db = req.db;
    var name = req.body['name'];
    console.log("NAME: " + name);
    db.select().from('nodes')
        .where({'name': name})
        .all()
        .then(function (nodes) {
            console.log(nodes);
            if (nodes.length == 0) {
                db.class.get('nodes').then(function (nodes_) {
                    nodes_.create({name: name}).then(
                        function (res) {
                            console.log(res);
                        }
                    )
                });
            }
        })

    res.redirect(req.header('Referer'));

});

router.get('/resources', function (req, res) {
    var db = req.db;
    db.query(
        'select expand(in("resource_to")) from ' + req.query.id, // TODO fix this damn it.
        {
            //params: {
            //    idd: req.query.id
            //}
        }
    ).then(function (resources){
            res.json(resources);
        });
    //var nodes = db.model('nodes');
    //var users = db.model('users');
    //
    //console.log("Finding : " + req.body['node_name']);
    //nodes.findOne(
    //
    //    {name: req.body['node_name']},
    //    function (err, node) {
    //
    //        users.findOne({name: 'sjosund'}, function (err, user) {
    //
    //            nodes.update(
    //                {_id: node._id},
    //                {$push: {
    //                    resources: {
    //                        url: req.body['url'],
    //                        votes: [
    //                            {
    //                                value: 1,
    //                                created_by: user._id
    //                            }
    //                        ],
    //                        name: req.body['name']
    //                    },
    //                }},
    //                function (err) {
    //                    res.end();
    //                }
    //            );
    //        });
    //    }
    //)
    //res.redirect(req.header('Referer'));
})

router.post('/edges', function (req, res) {
    var db = req.db;
    console.log(req.body)
    // TODO fix unique edges
    db.select().from('nodes').where({name: req.body['from_node_name']}).one().then(
        function (from_node) {
            db.select().from('nodes').where({name: req.body['to_node_name']}).one().then(
                function (to_node) {
                    db.create('edge', 'edges')
                        .from(from_node['@rid'])
                        .to(to_node['@rid'])
                        .one()
                        .then(function (e) {
                            console.log("created edge " + e);
                        });
                });
        });

    res.redirect(req.header('Referer'));

});

router.post('/vote', function (req, res) {
    console.log(req.body);
});

module.exports = router;