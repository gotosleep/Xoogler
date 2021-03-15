document.addEventListener("DOMContentLoaded", function () {
    const mapping = document.querySelector("#mappingTable tbody");
    const saved = document.querySelector("#savedContainer");

    const save = {};

    chrome.storage.sync.get(defaultMap,
        function (overrides) {
            buildTable(overrides);
        });

    const buildTable = (overrides) => {
        const showToast = creeateSavedToast(saved);

        var count = 0;
        for (const key in overrides) {
            if (key.includes("-")) {
                continue;
            }

            var keyColumn = document.createElement("td");
            var keyText = document.createTextNode(key + "/");
            keyColumn.appendChild(keyText);

            var overrideCol = document.createElement("td");
            const overrideText = document.createElement("input");
            overrideText.value = overrides[key]
            overrideText.setAttribute("type", "text");
            overrideText.setAttribute("size", "40");
            overrideCol.appendChild(overrideText);
            overrideText.addEventListener('input', createInputListener(key, showToast));

            const queryKey = key + "-q";
            var queryCol = document.createElement("td");
            const queryText = document.createElement("input");
            if (overrides[queryKey]) {
                queryText.value = overrides[queryKey];
            }
            queryText.setAttribute("type", "text");
            queryText.setAttribute("size", "40");
            queryCol.appendChild(queryText);
            queryText.addEventListener('input', createInputListener(queryKey, showToast));

            const resetCol = document.createElement("td");
            const resetButton = document.createElement("button");
            resetButton.appendChild(document.createTextNode("Reset"));
            resetCol.appendChild(resetButton);
            resetButton.onclick = () => {
                overrideText.value = defaultMap[key];
                queryText.value = defaultMap[queryKey];

                // Hacky but easy way to trigger the save.
                overrideText.dispatchEvent(new Event('input'));
                queryText.dispatchEvent(new Event('input'));
            }

            var row = document.createElement("tr");
            row.appendChild(keyColumn);
            row.appendChild(overrideCol);
            row.appendChild(queryCol);
            row.appendChild(resetCol);

            if (count % 2 == 0) {
                row.classList.add("odd");
            }

            mapping.appendChild(row);

            count += 1;
        }
    }
});

