let GOOGLE_API_URL = "https://script.google.com/macros/s/AKfycbxuN1Bo4VLsdWHRXNuKR18Mi17wglekdWE0mG0nB-D2FeIhLKIyvQaQR4kHIFjSBGyx2Q/exec";  // <-- indsæt URL

function sendMailAPI() {  
    let recipient = document.getElementById("email").value.trim().toLowerCase();

    // Første API-kald → Google Sheets (duplikat-tjek)
    fetch(GOOGLE_API_URL, {
        method: "POST",
        body: JSON.stringify({ email: recipient })
    })
    .then(res => res.json())
    .then(data => {
        if (data.status === "duplicate") {
            alert("Denne email er allerede registreret.");
            return;
        }

        // Email er ny → send EmailJS velkomstmail
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

/**
 * Dropdown-funktionalitet (Uden HTML, kun JS-logik)
 */
function toggleDropdown() {
    let dropdown = document.getElementById("dropdown");
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }
  }
  
  /* Luk dropdown hvis der klikkes udenfor */
  window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
      let dropdown = document.getElementById("dropdown");
      if (dropdown) {
          dropdown.style.display = "none";
      }
    }
  }
