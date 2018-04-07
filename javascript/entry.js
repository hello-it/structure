let App = (function () {
    let hierarchy_path = "data/hierarchy.json",
        container_id = 'graph-container',
        chats = {},
        white = '#ffffff',
        blue = '#0d3349';

    function loadHierarchy(callback) {
        $.getJSON(hierarchy_path, function (json) {
            chats = retrieveAllChats(json);
            callback(convertToSigmaConfiguration(json));
        })
    }

    function convertToSigmaConfiguration(hierarchy) {
        let configuration = {
            'nodes': [],
            'edges': []
        };

        let points = [];

        let parseNodes = function (chat, level) {
            let generatePoint = function () {
                let hasAnotherOnePointNearly = function (points, newPoint) {
                    for (let index in points) {
                        let point = points[index];

                        if (Math.sqrt(Math.pow(point.x - newPoint.x, 2) + Math.pow(point.y - newPoint.y, 2)) < 10) {
                            return true;
                        }
                    }
                    return false;
                };

                let point = {};

                do {
                    point = {
                        x: 50 + (Math.floor(Math.random() * 21) - 10) * level,
                        y: 50 + (Math.floor(Math.random() * 21) - 10) * level
                    };
                } while (hasAnotherOnePointNearly(points, point));

                points.push(point);
                return point;
            };

            let point = generatePoint(level);

            configuration['nodes'].push({
                'id': chat.id,
                'label': chat.id,
                'x': point.x,
                'y': point.y,
                "size": 10 - level * 2
            });

            if (chat.hasOwnProperty('nodes')) {
                let nodes = chat['nodes'];
                for (let index in nodes) {
                    let node = nodes[index];

                    configuration['edges'].push({
                        'id': 'edge-' + level + '-' + (level + 1) + '-' + (index + 1),
                        'source': chat.id,
                        'target': node.id
                    });

                    parseNodes(node, level + 1);
                }
            }
        };

        for (let index in hierarchy) {
            let community = hierarchy[index];
            parseNodes(community, 1);
        }

        return configuration;
    }

    function retrieveAllChats(hierarchy) {
        let chats = [];

        let retrieveAllChatsRecursively = function (chat) {
            chats.push(chat);
            if (chat.hasOwnProperty('nodes')) {
                let nodes = chat['nodes'];
                for (let node in nodes) {
                    retrieveAllChatsRecursively(nodes[node]);
                }
            }
        };

        for (let community in hierarchy) {
            let tree = hierarchy[community];
            retrieveAllChatsRecursively(tree);
        }

        let report = {};

        for (let chat in chats) {
            let object = chats[chat];

            report[object.id] = object.link;
        }

        return report;
    }

    function initSigma(configuration) {
        let settings = {
            labelThreshold: 0,
            defaultLabelColor: blue,
            defaultEdgeColor: white,
            defaultNodeColor: white,
            sideMargin: 2
        };

        let s = new sigma({
            graph: configuration,
            container: container_id,
            settings: settings
        });

        s.bind('clickNode', function (event) {
            let chat_id = event.data.node.id;

            if (chats.hasOwnProperty(chat_id)) {
                window.location.replace(chats[chat_id]);
            }
        });
    }

    return {
        initialize: function () {
            loadHierarchy(initSigma);
        }
    }
}());

$(document).ready(function () {
    App.initialize();
});