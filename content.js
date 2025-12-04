
// I at first wanted to apply blur effect if the code were to detect correct "name" tag, but then I realized there are several emails that various notifications are coming from. And if I were to list them in 'if statement', it would've always be true since "linkedIn' is mentioned in all of them. Hence, it's smarter to have a const array of blocked emails for blur and then i could also add more emails easier if I need to. 

const blurOut = [
    "jobalerts-noreply@linkedin.com",
    "jobs-noreply@linkedin.com",
    "messages-noreply@linkedin.com",
    "editors-noreply@linkedin.com",
    "linkedin@e.linkedin.com",
    "messaging-digest-noreply@linkedin.com",
    "notifications-noreply@linkedin.com",
    "invitations@linkedin.com",
    "groups-noreply@linkedin.com",
    "jobs-listings@linkedin.com"
];

// Apply effect depending on selected mode
function applyEffectToRow(row, mode) {

    if (mode === "soft") {
        // simple blur
        row.style.filter = "blur(3px)";
        row.classList.remove("blur-tinted");
        row.style.pointerEvents = "none";
    }

    if (mode === "haze") {
        // blur + tinted overlay 
        row.style.filter = "blur(3px)";
        row.classList.add("blur-tinted");
        row.style.pointerEvents = "none";
    }

    if (mode === "naughty") {
        row.style.filter = "";
        row.classList.remove("blur-tinted");
    
        // allow hover effects
        row.classList.add("naughty-mode-row");
    
        // enable clicking but override default Gmail behavior
        row.style.pointerEvents = "auto";
    
        // Prevent Gmail from opening email & show popup instead
        row.addEventListener("click", (event) => {
            event.stopImmediatePropagation();
            event.preventDefault();
            showNaughtyPopup();
        }, { passive: false });

    
        // use IMPORTANT bc gmail has aggressive css that overrides stuff 
        // Sender gmail wrapper (.bA4)

        const senderWrapper = row.querySelector("span.bA4");
        if (senderWrapper) {
            senderWrapper.style.setProperty("color", "#bdbdbd", "important");
            senderWrapper.style.setProperty("font-weight", "400", "important");
        }
    
        // Sender inner span(.zF or .yP) 
        const senderInner = row.querySelector("span.bA4 span.zF, span.bA4 span.yP");
        if (senderInner) {
            senderInner.style.setProperty("color", "#bdbdbd", "important");
            senderInner.style.setProperty("font-weight", "400", "important");
        }
    
        // Subject line (.bog)
        const subject = row.querySelector("span.bog");
        if (subject) {
            subject.style.setProperty("color", "#bdbdbd", "important");
            subject.style.setProperty("font-weight", "600", "important");
        }
    
        // Body text (y2 and inner span) 
        const preview = row.querySelector("span.y2");
        if (preview) {
            preview.style.setProperty("color", "#bdbdbd", "important");
            preview.style.setProperty("font-style", "italic", "important");
        }
    
        const previewInner = row.querySelector("span.y2 > span");
        if (previewInner) {
            previewInner.style.setProperty("color", "#bdbdbd", "important");
            previewInner.style.setProperty("font-style", "italic", "important");
        }
    }

    (function injectNaughtyStyles() {
        if (document.getElementById("naughty-style")) return;
    
        const style = document.createElement("style");
        style.id = "naughty-style";
        style.textContent = `
            tr.naughty-mode-row span.zF,
            tr.naughty-mode-row span.yP {
                color: #bdbdbd !important;
                font-weight: 400 !important;
            }
    
            tr.naughty-mode-row span.bog {
                color: #bdbdbd4 !important;
                font-weight: 400 !important;
            }
    
            tr.naughty-mode-row span.y2,
            tr.naughty-mode-row span.y2 > span {
                color: #bdbdbd !important;
                font-style: italic !important;
            }
        `;
        document.head.appendChild(style);
    })();

    function showNaughtyPopup() {

        // Remove old popup if exists
        const existing = document.getElementById("naughty-popup");
        if (existing) existing.remove();
    
        // image path
        const imgSrc = chrome.runtime.getURL("images/gotcha.png");
    
        //  overlay
        const overlay = document.createElement("div");
        overlay.id = "naughty-popup";
        overlay.innerHTML = `
            <div class="naughty-popup-content">
                <span class="naughty-close-btn">&times;</span>
                <img src="${imgSrc}" class="naughty-img">
                <p class="naughty-text">🫵 Gotcha 🫵<br> Go touch some grass.<br>Seriously.</p>
            </div>
        `;
    
        document.body.appendChild(overlay);
    
        // Close btn logic
        overlay.querySelector(".naughty-close-btn").addEventListener("click", () => {
            overlay.remove();
        });
    }        
    
}

// Start a function that blurs emails coming from LinkedIn job alerts IF toggle is on
function blurLinkedInEmails() {

    chrome.storage.sync.get(["blurEnabled", "mode"], ({ blurEnabled, mode }) => {

        // If toggle is OFF, remove blur and stop
        if (!blurEnabled) {
            removeBlur();
            return;
        }

        // If no mode selected yet, do nothing
        if (!mode) return;

        // Select all Gmail rows
        const rows = document.querySelectorAll("tr.zA");

        rows.forEach(row => {
            const sender = row.querySelector("span.yP, span.zF");

            if (sender && blurOut.includes(sender.getAttribute("email"))) {

                // Apply correct effect depending on mode
                applyEffectToRow(row, mode);

                // optional disabling of clicking
                // row.style.pointerEvents = "none";
            }
        });
    });
}

// Function to remove blur effect when toggle is off
function removeBlur() {
    const rows = document.querySelectorAll("tr");

    rows.forEach(row => {
        row.style.filter = "";
        row.classList.remove("blur-tinted");
        row.style.pointerEvents = "";

        // Reset naughty mode colors
        const sender = row.querySelector("span.yP, span.zF");
        if (sender) {
            sender.style.color = "";
            const innerSender = sender.querySelector("span");
            if (innerSender) innerSender.style.color = "";
        }

        const subject = row.querySelector("span.bog");
        if (subject) {
            subject.style.color = "";
            const innerSubject = subject.querySelector("span");
            if (innerSubject) innerSubject.style.color = "";
        }
    });
}

// Observe Gmail DOM changes
const observer = new MutationObserver(() => {
    blurLinkedInEmails();
});

observer.observe(document.body, { childList: true, subtree: true });

// Run on initial load
blurLinkedInEmails();

