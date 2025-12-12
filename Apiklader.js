// Nøgle i LocalStorage: Nu gemmer vi data om ALLE registrerede brugere
const LOCAL_STORAGE_KEY = "registered_users_data";

/**
 * Henter det komplette brugerregister fra LocalStorage.
 * @returns {Object} Et objekt, hvor nøglerne er brugernavne.
 */
function getStoredUsers() {
    const jsonString = localStorage.getItem(LOCAL_STORAGE_KEY);
    // Returnerer det parset objekt eller et tomt objekt ({}) hvis intet er gemt
    return jsonString ? JSON.parse(jsonString) : {};
}

/**
 * Gemmer det opdaterede brugerregister i LocalStorage.
 * @param {Object} usersData - Det komplette brugerregister, der skal gemmes.
 */
function saveUsersLocally(usersData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usersData));
}

/**
 * Hovedfunktionalitet: Tjekker lokalt, sender mail via EmailJS, gemmer registrering og opdaterer point.
 */
function sendMailAPI() {
    let username = document.getElementById("username").value.trim();
    let recipient = document.getElementById("email").value.trim().toLowerCase();

    if (!username || !recipient) {
        alert("Indtast venligst både et brugernavn og en e-mailadresse.");
        return;
    }

    const usersData = getStoredUsers();

    // 1. LOKALT DUBLIKAT-TJEK: Tjekker om e-mailen allerede er registreret af NOGEN bruger.
    // flatMap samler alle e-mail lister fra alle brugere til én stor liste.
    const allEmails = Object.values(usersData).flatMap(user => user.emails);

    if (allEmails.includes(recipient)) {
        alert("Denne e-mail er allerede registreret af en anden bruger (eller dig selv).");
        return;
    }
    
    // 2. E-mail er ny → send EmailJS velkomstmail
    fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: "service_mo7rbu5", 
            template_id: "template_3h8x6nj", 
            user_id: "nB-keowIPftpv463j", 
            template_params: {
                to_email: recipient,
                message: `Dette er en automatisk mail sendt af brugeren: ${username}`
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`EmailJS sendte fejlstatus: ${response.status}`);
        }
        
        // 3. E-mail sendt succesfuldt → OPDATER BRUGERDATA OG POINT
        
        // Initialiser brugeren, hvis den ikke findes
        if (!usersData[username]) {
            usersData[username] = { emails: [], points: 0 };
        }
        
        // Registrer e-mail og giv point
        usersData[username].emails.push(recipient);
        usersData[username].points += 1; // 1 point pr. registreret e-mail

        saveUsersLocally(usersData); // Gem opdaterede data
        
        alert(`Velkomstmail sendt til ${recipient} fra ${username}.`);
        
        // Opdater leaderboardet på skærmen
        displayLeaderboard();

    })
    .catch(err => {
        console.error("Fejl i EmailJS eller processen:", err);
        alert("Der opstod en fejl under afsendelse af mailen.");
    });
}

/**
 * Henter alle brugere, sorterer dem efter point, og viser et leaderboard.
 */
function displayLeaderboard() {
    const usersData = getStoredUsers();
    const leaderboardContainer = document.getElementById("leaderboard-container");
    if (!leaderboardContainer) return;
    leaderboardContainer.innerHTML = ''; 

    // Konverter bruger-objektet til et array af objekter for nem sortering
    const sortedUsers = Object.entries(usersData)
        .map(([username, data]) => ({ username, points: data.points }))
        .sort((a, b) => b.points - a.points); // Sorter faldende efter point

    if (sortedUsers.length === 0) {
        leaderboardContainer.innerHTML = '<p>Intet leaderboard at vise endnu. Registrer en e-mail!</p>';
        return;
    }

    // Generer HTML-listen
    const ol = document.createElement('ol');
    
    sortedUsers.forEach((user, index) => {
        const li = document.createElement('li');
        // Viser f.eks.: 1. User1 (5 point)
        li.textContent = `${user.username} (${user.points} point)`; 
        ol.appendChild(li);
    });

    leaderboardContainer.appendChild(ol);
}

// --------------------------------------------------------------------------
// DROPDOWN-FUNKTIONALITET (Uændret)
// --------------------------------------------------------------------------

function toggleDropdown() {
    let dropdown = document.getElementById("dropdown");
    if (dropdown) {
      dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
    }
}
  
window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
      let dropdown = document.getElementById("dropdown");
      if (dropdown && dropdown.style.display === "block") {
          dropdown.style.display = "none";
      }
    }
}

// Kald displayLeaderboard, når siden indlæses, for at vise den aktuelle status
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById("leaderboard-container")) {
        displayLeaderboard();
    }
});
