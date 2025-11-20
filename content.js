
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

// start a function that blurs emails coming from LinkedIn Job Alert IF toggle is on
function blurLinkedInEmails () {

    // now check if the toggle is on from storage. If it's OFF, remove blur and stop
    chrome.storage.sync.get("blurEnabled", ({blurEnabled}) => {
        if (!blurEnabled) {
            removeBlur();
            return;
        }

    // now select all rows in the gmail, it's a table so "tr"
    const rows = document.querySelectorAll("tr.zA");  

    // now go through each row and specifc span and check whether my specific sender exists. if yes, apply style
    rows.forEach(row => {

        const sender = row.querySelector("span.yP, span.zF"); 

        if (sender && blurOut.includes(sender.getAttribute("email"))) {

            row.style.filter = "blur(5px)";
            row.style.position = "relative"; 
            row.style.overflow = "hidden"; 

            row.style.setProperty (
                "--tint",
                "linear-gradient(135deg, rgba(255, 0, 150, 0.25), rgba(0, 120, 255, 0.25))"
            );

            row.classList.add("blur-tinted");
            
            row.style.pointerEvents = "none"; // this disables clicking but idk if i wanna include it yet 
        }

        });

    });
}

// function to remove blur effect when toggle is off
function removeBlur () {
    const rows = document.querySelectorAll ("tr");

    rows.forEach(row => {
        row.style.filter = ""; 
        row.style.pointerEvents = "";

    });
}

const observer = new MutationObserver (() => {
    blurLinkedInEmails();
});

// Observe changes in Gmail's body subtree
observer.observe(document.body, { childList: true, subtree: true });

blurLinkedInEmails();

