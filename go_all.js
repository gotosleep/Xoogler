document.addEventListener("DOMContentLoaded", function () {
    const table = document.querySelector("#allShortcuts tbody");

    chrome.storage.sync.get(null,
        function (result) {
            var count = 0
            for (const key in result) {
                if (key.startsWith('go-')) {
                    count += 1;
                    addRow(table, key, result[key], count % 2 == 0);
                }
            }
            if (count == 0) {
                showEmpty();
            }
        });
});

function showEmpty() {
    const content = document.querySelector("#content");
    const empty = document.querySelector("#empty");

    content.style.display = "none";
    empty.style.display = "block";
}

function addRow(table, key, value, odd) {
    console.log("key: " + key);

    const row = document.createElement("tr");
    if (odd) {
        row.classList.add("odd");
    }

    const cleanedKey = key.replace("go-", "go/");
    const shortcutCol = document.createElement("td");
    const shortcutText = document.createTextNode(cleanedKey);
    shortcutCol.appendChild(shortcutText);

    const destinationCol = document.createElement("td");
    const destinationText = document.createTextNode(value);
    destinationCol.appendChild(destinationText);

    const editCol = document.createElement("td");
    const editButton = document.createElement("button");
    editButton.appendChild(document.createTextNode("Edit"));
    editCol.appendChild(editButton);
    editButton.onclick = () => {
        window.location.href = "go.html?q=" + key.replace("go-", "") + "&edit=true";
    }

    const deleteCol = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.appendChild(document.createTextNode("Delete"));
    deleteCol.appendChild(deleteButton);
    deleteButton.onclick = () => {
        chrome.storage.sync.remove(key,
            function (result) {
                row.remove();
            });
    }

    row.appendChild(shortcutCol);
    row.appendChild(destinationCol);
    row.appendChild(editCol);
    row.appendChild(deleteCol);

    table.appendChild(row);
}