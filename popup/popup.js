console.log("This is a popup!");

document.addEventListener("DOMContentLoaded", () => {
    const toggle = document.getElementById("mainToggle");
    const icon = document.getElementById("characterIcon");
    const modeSelect = document.getElementById("modeSelect");

    // Load saved states
    chrome.storage.sync.get(["blurEnabled", "mode"], ({ blurEnabled, mode }) => {
        const enabled = blurEnabled || false;
        toggle.checked = enabled;

        // Set icon correctly on load
        if (enabled) {
            updateCharacterIcon(mode);
        } else {
            icon.src = "../images/sleeping.png";
        }

        // Only show saved mode if toggle is ON
        if (enabled && mode) {
            modeSelect.value = mode;
        } else {
            modeSelect.value = "";
        }
    });

    // Toggle ON/OFF logic
    toggle.addEventListener("change", () => {
        const enabled = toggle.checked;

        if (!enabled) {
            icon.src = "../images/sleeping.png";
            chrome.storage.sync.set({ blurEnabled: false });
            return;
        }

        chrome.storage.sync.set({ blurEnabled: true });

        // When turning ON, update icon based on selected mode
        const currentMode = modeSelect.value;
        updateCharacterIcon(currentMode);
    });

    // Mode selection logic
    modeSelect.addEventListener("change", () => {
        const selectedMode = modeSelect.value;

        chrome.storage.sync.set({ mode: selectedMode });

        // Only update icon if toggle is ON
        if (toggle.checked) {
            updateCharacterIcon(selectedMode);
        }
    });

    // Function that updates the icon depending on mode
    function updateCharacterIcon(mode) {
        if (!mode) {
            icon.src = "../images/happy.png"; // default happy if no specific mode icon yet
            return;
        }

        // Your two functioning modes:
        if (mode === "soft") {
            icon.src = "../images/happy-blur.png";
        } else if (mode === "haze") {
            icon.src = "../images/happy-haze.png";
        } 
        // Third mode (not implemented yet) — stays default happy for now
        else if (mode === "naughty") {
            icon.src = "../images/naughty.png";
        }
    }
});



