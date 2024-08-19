import * as config from '../../config.js';

async function fetchUsers() {
    const response = await fetch(`${config.SERVER_URL}?route=user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ action: 'list' })
    });
    return response.json();
}

function createUserTable(users) {
    // Create table with Bootstrap classes
    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');
    
    // Table header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = Object.keys(users[0]);
    headerRow.innerHTML = headers.map(header => `<th class="text-capitalize">${header}</th>`).join('');
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Table body
    const tbody = document.createElement('tbody');
    tbody.innerHTML = users
        .filter(user => user) // Filter out any null or undefined values
        .map(user => {
            return `<tr>${Object.values(user).map(value => `<td>${value}</td>`).join('')}</tr>`;
        })
        .join('');
    table.appendChild(tbody);
    
    return table;
}

export default async function renderUsers() {
    const userData = await fetchUsers();
    console.log(userData);

    const usersContainer = document.createElement('section');
    usersContainer.classList.add('container', 'mt-5');

    if (userData.status === 'success') {
        if (userData.data.length === 0) {
            usersContainer.innerHTML += '<p class="text-center">No users found.</p>';
        } else {
            const userTable = createUserTable(userData.data);
            usersContainer.appendChild(userTable);
        }
    } else {
        usersContainer.textContent += ' Error fetching users: ' + userData.message;
    }

    return usersContainer;
}
