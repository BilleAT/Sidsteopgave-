// Nøgle til LocalStorage, nu kan vi gemmer data om registrerede brugere i browseren
let LOCAL_STORAGE_KEY = "registered_users_data";

/*
 Henter det komplette brugerregister fra LocalStorage.
 Et objekt, hvor nøglerne er brugernavne.
 */
function getStoredUsers() {
    let jsonString = localStorage.getItem(LOCAL_STORAGE_KEY);
    // Returnerer det parset objekt eller et tomt objekt ({}) hvis intet er gemt
    // Tjekker om jsonString har en værdi (altså ikke er null)
    if (jsonString) {
        // Hvis data findes: Konverter tekststrengen til et JavaScript-objekt og returner det.
        return JSON.parse(jsonString);
    } else {
        // Hvis data er den er null returner et tomt objekt.
        return {};
    }
}

/*
 Gemmer det opdaterede brugerregister i LocalStorage.
 UsersData det komplette brugerregister, der skal gemmes.
 */
function saveUsersLocally(usersData) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(usersData));
}


// Tjekker lokalt, sender mail via EmailJS, gemmer registrering og opdaterer point.
 
function sendMailAPI() {
    let username = document.getElementById("username").value.trim();
    let recipient = document.getElementById("email").value.trim().toLowerCase();

    //checker om der er skrevet, brugernavn og email 
    if (!username || !recipient) {
        alert("Indtast venligst både et brugernavn og en e-mailadresse.");
        return;
    }

    let usersData = getStoredUsers();

    //  dublikat tjek: Tjekker om e-mailen allerede er registreret af brugeren.
    // flatMap samler alle e-mail lister fra alle brugere til en stor liste.
    let allEmails = Object.values(usersData).flatMap(user => user.emails);

    if (allEmails.includes(recipient)) {
        alert("Denne e-mail er allerede registreret af en anden bruger (eller dig selv).");
        return;
    }
    
    // email er ny, derefter send EmailJS velkomstmail
    fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: "service_mo7rbu5", 
            template_id: "template_3h8x6nj", 
            user_id: "nB-keowIPftpv463j", 
            template_params: {                             //tempalte parameters, som er det data man sender tilbage EmailJS API'en
                to_email: recipient,
                message: `Dette er en automatisk mail sendt af brugeren: ${username}`
            }
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`EmailJS sendte fejlstatus:`);
        }
        
        // Email sendt succesfuldt, derefter opdater brugernavn og points tildelt 
        
        // Opret brugeren, hvis den ikke findes
        if (!usersData[username]) {
            usersData[username] = { emails: [], points: 0 };
        }
        
        // Registrer e-mail og giv point
        usersData[username].emails.push(recipient);
        usersData[username].points += 1; // 1 point pr. registreret e-mail
        
        saveUsersLocally(usersData); // Gem opdaterede data
        
        alert(`Velkomstmail sendt og 1 point tildelt ${username}!`);
        
        // Opdater leaderboardet på skærmen
        displayLeaderboard();

    })
    .catch(err => {
        console.error("Fejl i EmailJS eller processen:", err);
        alert("Der opstod en fejl under afsendelse af mailen.");
    });
}


//Henter alle brugere, sorterer dem efter point, og viser et leaderboard.
 
function displayLeaderboard() {
    let usersData = getStoredUsers();
    let leaderboardContainer = document.getElementById("leaderboard-container");
    leaderboardContainer.innerHTML = ''; 

    // Konverter bruger-objektet til et array af objekter for nem sortering
    let sortedUsers = Object.entries(usersData)
        .map(([username, data]) => ({ username, points: data.points }))
        .sort((a, b) => b.points - a.points); // Sorter faldende efter point

    if (sortedUsers.length === 0) {
        leaderboardContainer.innerHTML = '<p>Intet leaderboard at vise endnu. Registrer en e-mail!</p>';
        return;
    }

    // Generer HTML-listen
    let ol = document.createElement('ol');
    
    sortedUsers.forEach((user, index) => {
        let li = document.createElement('li');
        // Viser f.eks.: 1. User1 (5 point)
        li.textContent = `${user.username} (${user.points} point)`; 
        ol.appendChild(li);
    });

    leaderboardContainer.appendChild(ol);
}

//dropdown funktion til sideskirft 
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
document.addEventListener('DOMContentLoaded', displayLeaderboard);
