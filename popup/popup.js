console.log("This is a popup!");

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.querySelector("input[type='checkbox']");
    const icon = document.getElementById("characterIcon");

    chrome.storage.sync.get("blurEnabled", ({ blurEnabled }) => {
        const enabled = blurEnabled || false;

        toggle.checked = enabled;
        icon.src = enabled ? "../images/happy.png" : "../images/sleeping.png";
    });

    toggle.addEventListener("change", () => {
        const enabled = toggle.checked;

        icon.src = enabled ? "../images/happy.png" : "../images/sleeping.png";

        chrome.storage.sync.set({ blurEnabled: enabled });
    });
});

