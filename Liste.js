const LOCAL_STORAGE_KEY = "registered_users_data";

function getStoredUsers() {
    let jsonString = localStorage.getItem(LOCAL_STORAGE_KEY);
    return jsonString ? JSON.parse(jsonString) : {};
}

function displayEmailList() {
    let usersData = getStoredUsers();
    let listContainer = document.getElementById("email-list-container");
    listContainer.innerHTML = '';

    let ul = document.createElement('ul');
    let emailCount = 0;

    // Gå igennem hver bruger (for...in)
    for (let username in usersData) {
        let userData = usersData[username];

        // Gå igennem hver e-mail for brugeren 
        for (let i = 0; i < userData.emails.length; i++) {
            let email = userData.emails[i];

            let li = document.createElement('li');
            li.innerHTML = `<strong>${email}</strong> (Registreret af: ${username})`;
            ul.appendChild(li);
            emailCount++;
        }
    }

    if (emailCount === 0) {
        listContainer.innerHTML = '<h2>Ingen e-mails registreret endnu.</h2>';
        return;
    }

    let totalHeader = document.createElement('h3');
    totalHeader.textContent = `Total antal registrerede e-mails: ${emailCount}`;
    listContainer.appendChild(totalHeader);
    listContainer.appendChild(ul);
}

document.addEventListener('DOMContentLoaded', displayEmailList);
