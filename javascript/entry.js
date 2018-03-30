let App = (function () {
    let hierarchy_path = "data/graph.json", // TODO: Will be fixed to hierarchy.json
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

    function convertToSigmaConfiguration(json) {
        // TODO: Convert hierarchy configuration to Sigma configuration
        return json;
    }

    function retrieveAllChats(json) {
        // TODO: Flat map chats' configuration
        return {
            "hello-it": "https://t.me/hello_it_community",
            "hello-it-dev": "https://t.me/hello_it_dev",
            "hello-it-qa": "https://t.me/hello_it_qa",
            "hello-it-devops": "https://t.me/hello_it_devops",
            "hello-it-web": "https://t.me/hello_it_web",
            "hello-it-chat": "https://t.me/hello_it_chat",
            "hello-it-start": "https://t.me/hello_it_start"
        };
    }

    function initSigma(json) {
        let s = new sigma({
            graph: json,
            container: container_id,
            settings: {
                labelThreshold: 0,
                defaultLabelColor: blue,
                defaultEdgeColor: white,
                defaultNodeColor: white,
                sideMargin: 2
            }
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