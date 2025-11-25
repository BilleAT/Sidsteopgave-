let GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbx5LKoh7fgON1J7IH8su8eouVjJz-ETk__J17M_nWjSwYOVZPjl02SAdKZsjqTT_AJtnQ/exec";  // indsæt din URL her

function sendMailAPI() {
    let recipient = document.getElementById("email").value.trim().toLowerCase();

    // Først: Tjek email i Google Sheets
    fetch(GOOGLE_API_URL, {
        method: "POST",
        body: JSON.stringify({ email: recipient })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "duplicate") {
            alert("Denne email er allerede registreret.");
            return; // Stop her!
        }

        // Email er ny → send velkomstmailen
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
  const dropdown = document.getElementById("dropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

/* Luk dropdown hvis der klikkes udenfor */
window.onclick = function(event) {
  if (!event.target.matches('.dropdown-btn')) {
    document.getElementById("dropdown").style.display = "none";
  }
}
