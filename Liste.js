const LOCAL_STORAGE_KEY = "registered_users_data";

        function getStoredUsers() {
            const jsonString = localStorage.getItem(LOCAL_STORAGE_KEY);
            return jsonString ? JSON.parse(jsonString) : {};
        }

        /**
         * Henter alle e-mails og viser dem i en simpel liste.
         */
        function displayEmailList() {
            const usersData = getStoredUsers();
            const listContainer = document.getElementById("email-list-container");
            listContainer.innerHTML = ''; 

            const ul = document.createElement('ul');
            let emailCount = 0;

            // Gå igennem hver bruger i registeret
            Object.keys(usersData).forEach(username => {
                const userData = usersData[username];
                
                // Gå igennem hver e-mail registreret af denne bruger
                userData.emails.forEach(email => {
                    const li = document.createElement('li');
                    // Vis e-mail og hvilken bruger, der registrerede den
                    li.innerHTML = `<strong>${email}</strong> (Registreret af: ${username})`;
                    ul.appendChild(li);
                    emailCount++;
                });
            });

            if (emailCount === 0) {
                listContainer.innerHTML = '<h2>Ingen e-mails registreret endnu.</h2>';
                return;
            }

            const totalHeader = document.createElement('h3');
            totalHeader.textContent = `Total antal registrerede e-mails: ${emailCount}`;
            listContainer.appendChild(totalHeader);
            listContainer.appendChild(ul);
        }

        // Kører funktionen, når siden er fuldt indlæst
        document.addEventListener('DOMContentLoaded', displayEmailList);
