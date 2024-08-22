import * as config from '../../config.js';

function fetchUsers() {
    return fetch(`${config.SERVER_URL}?route=user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ action: 'list' })
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error fetching users:', error);
        throw error;
    });
}

class UserTable extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        fetchUsers().then(userData => {
            const linkElement = document.createElement('link');
            linkElement.setAttribute('rel', 'stylesheet');
            linkElement.setAttribute('href', `${config.CLIENT_URL}/src/css/user-table.css`);

            const container = document.createElement('section');
            container.classList.add('container');

            if (userData.status === 'success') {
                if (userData.data.length === 0) {
                    container.innerHTML += '<p class="text-center">No users found.</p>';
                } else {
                    const userTable = this.createUserTable(userData.data);
                    const heading = document.createElement('h2');
                    heading.textContent = 'Users List: ' + userData.data.length + ' users found';
                    container.appendChild(heading);
                    container.appendChild(userTable);
                }
            } else {
                container.textContent += ' Error fetching users: ' + userData.message;
            }

            this.shadowRoot.innerHTML = ''; // Clear any existing content
            this.shadowRoot.appendChild(linkElement);
            this.shadowRoot.appendChild(container);
        }).catch(error => {
            const linkElement = document.createElement('link');
            linkElement.setAttribute('rel', 'stylesheet');
            linkElement.setAttribute('href', `${config.CLIENT_URL}/src/css/user-table.css`);

            const errorContainer = document.createElement('section');
            errorContainer.classList.add('container', 'mt-5');
            errorContainer.textContent = 'An error occurred while fetching users.';
            console.error('RenderUsers Error:', error);

            this.shadowRoot.innerHTML = ''; // Clear any existing content
            this.shadowRoot.appendChild(linkElement);
            this.shadowRoot.appendChild(errorContainer);
        });
    }

    createUserTable(users) {
        // Create table with Bootstrap classes
        const table = document.createElement('table');
        table.classList.add('table', 'table-striped', 'table-bordered', 'table-hover');

        // Table header
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        const headers = Object.keys(users[0]).filter(header => header !== 'password');
        headerRow.innerHTML = headers.map(header => `<th class="text-capitalize">${header}</th>`).join('');
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Table body
        const tbody = document.createElement('tbody');
        tbody.innerHTML = users
            .filter(user => user) // Filter out any null or undefined values
            .map(user => {
                const { password, ...userData } = user; // Destructure the user object and exclude the password property
                return `<tr>${Object.values(userData).map(value => `<td>${value}</td>`).join('')}</tr>`;
            })
            .join('');
        table.appendChild(tbody);

        return table;
    }
}

customElements.define('user-table', UserTable);

export default UserTable;