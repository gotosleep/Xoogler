var activeMappings;

chrome.storage.sync.get(defaultMap,
    function (overrides) {
        activeMappings = overrides;
    });

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        const url = new URL(details.url)
        var destination = activeMappings[url.hostname]
        
        var path = url.pathname
        if (path && path.length > 1) {
            if (path.startsWith('/')) {
                path = path.substr(1);
            }
            const query = activeMappings[url.hostname + "-q"];
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
        var path = url.pathname
        if (path && path.length > 1) {
            if (path.startsWith('/')) {
                path = path.substr(1);
            }
            // const query = activeMappings[url.hostname + "-q"];
            // if (query) {
            //     destination = destination + query + path
            // }
        }

        const destination = chrome.runtime.getURL("go.html?q=" + path);
        
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