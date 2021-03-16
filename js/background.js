var activeMappings = {};

chrome.storage.sync.get(null,
    function (result) {
        activeMappings = result;

        // Load defaults
        for (var key in defaultMap) {
            if (!activeMappings[key]) {
                activeMappings[key] = defaultMap[key];
            }
        }
    });

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = new URL(details.url)
        var destination = activeMappings[url.hostname];

        var path = url.pathname
        if (path && path.length > 1) {
            if (path.startsWith('/')) {
                path = path.substr(1);
            }
            var query = activeMappings[url.hostname + "-q"];
            if (query) {
                destination = destination + query + path
            }
        }

        return { redirectUrl: destination };
    },
    {
        urls: [
            "*://b/*",
            "*://c/*",
            "*://cl/*",
            "*://cs/*",
            "*://docs/*",
            "*://drive/*",
            "*://memegen/*",
            "*://moma/*",
            "*://sheets/*",
            "*://slides/*",
            "*://who/*",
        ]
    },
    ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = new URL(details.url)

        var path = null;
        if (url.pathname && url.pathname.length > 1) {
            if (url.pathname.startsWith('/')) {
                path = url.pathname.substr(1);
            } else {
                path = url.pathname;
            }
        }

        var destination;
        if (path) {
            destination = activeMappings["go-" + path];
            if (!destination) {
                destination = chrome.runtime.getURL("go.html?q=" + path);
            } else if (!destination.match(/^.+:\/\//)) {
                destination = "http://" + destination;
            }
        } else {
            destination = chrome.runtime.getURL("go_all.html");
        }

        return { redirectUrl: destination };
    },
    {
        urls: ["*://go/*",]
    },
    ["blocking"]
);

chrome.storage.onChanged.addListener(function (changes, namespace) {
    if (namespace != 'sync') {
        return;
    }

    for (var key in changes) {
        var storageChange = changes[key];
        activeMappings[key] = storageChange.newValue;
    }
});