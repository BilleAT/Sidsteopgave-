let GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbwKWrThL2tX7VcGGK6ofvu0xOTZG7GRb6G5IP8_znvZEVQWBNcAdgRFTGH8V35cqOdp/exec";  // indsæt din URL her

function sendMailAPI() {
    let recipient = document.getElementById("email").value.trim().toLowerCase();
    let username = document.getElementById("username").value.trim();

    fetch(GOOGLE_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },  // <-- MANGLEDE
        body: JSON.stringify({
            email: recipient,
            username: username
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "duplicate") {
            alert("Denne email er allerede registreret.");
            return;
        }

        return fetch("https://api.emailjs.com/api/v1.0/email/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                service_id: "service_mo7rbu5",
                template_id: "template_3h8x6nj",
                user_id: "nB-keowIPftpv463j",
                template_params: {
                    to_email: recipient,
                    message: "Dette er en automatisk mail sendt via API."
                }
            })
        });
    })
    .then(() => {
        alert("Velkomstmail sendt og email gemt!");
    })
    .catch(err => console.error("Fejl:", err));
}
//Drop down med menu der kan linke til leaderboard
function toggleDropdown() {
  let dropdown = document.getElementById("dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

/* Luk dropdown hvis der klikkes udenfor */
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    document.getElementById("dropdown").style.display = "none";
  }
}
