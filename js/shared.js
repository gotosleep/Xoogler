const saveDelayMs = 600;

function creeateSavedToast(saved) {
    var hideTimer = null;

    return () => {
        saved.style.visibility = "visible";

        if (hideTimer) {
            clearTimeout(hideTimer);
        }

        hideTimer = setTimeout(() => {
            saved.style.visibility = "hidden";
            hideTimer = null;
        }, 1000);
    }
}

function createInputListener(key, showToast) {
    var delayedSave = null;

    return (e) => {
        const override = e.target.value

        var saveAction = () => {
            delayedSave = null
            chrome.storage.sync.set({
                [key]: override,
            }, function () {
                showToast();
            });
        }

        if (delayedSave) {
            clearTimeout(delayedSave);
        }

        delayedSave = setTimeout(saveAction, saveDelayMs);
    };
}