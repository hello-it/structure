let App = (function() {
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
        return {};
    }

    function initSigma(json) {
        let s = new sigma({
            graph: json,
            container: container_id,
            settings: {
                defaultLabelColor: blue,
                defaultEdgeColor: white,
                defaultNodeColor: white
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
        initialize: function() {
            loadHierarchy(initSigma);
        }
    }
}());

$(document).ready(function () {
    App.initialize();
});