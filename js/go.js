const urlParams = new URLSearchParams(window.location.search);
const query = urlParams.get('q');
const key = "go-" + query;

chrome.storage.sync.get(
    {
        [key]: null
    },
    function (result) {
        const destination = result[key];
        showPage(destination);
    });

function showPage(destination) {
    const saved = document.querySelector("#savedContainer");
    const showToast = creeateSavedToast(saved);

    const shortcutText = document.querySelector("#shortcutText");
    const link = document.createElement("a");
    link.href = "http://go/" + query;
    link.appendChild(document.createTextNode("go/" + query));
    shortcutText.append(link);

    const destinationInput = document.querySelector("#destinationInput");
    if (destination) {
        destinationInput.value = destination;
    }
    destinationInput.addEventListener('input', createInputListener(key, showToast));

    if (destination) {
        const nothing = document.querySelector("#nothing");
        const found = document.querySelector("#found");

        nothing.style.display = "none";
        found.style.display = "block";

        const queryNode = document.querySelector("#found span");
        queryNode.appendChild(document.createTextNode("go/" + query));

        const add = document.querySelector("#add");
        const edit = document.querySelector("#edit");

        add.style.display = "none";
        edit.style.display = "block";
    } else {
        const queryNode = document.querySelector("#nothing span");
        queryNode.appendChild(document.createTextNode("go/" + query));
    }

    const body = document.querySelector("body");
    body.style.visibility = "visible";
}