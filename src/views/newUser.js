import * as config from "../../config.js";

function submitUserForm(formData) {
    return fetch(`${config.SERVER_URL}?route=user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
    })
    .then(response => response.json())
    .catch(error => {
        console.error('Error submitting form:', error);
        throw error;
    });
}

class UserForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Apply external stylesheet for the component
        const linkElement = document.createElement('link');
        linkElement.setAttribute('rel', 'stylesheet');
        linkElement.setAttribute('href', `https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css`);

        // Create the form HTML
        const formHtml = `
            <div class="container p-4">
                <h2 class="">Add New User</h2>
                <form class="row g-3" id="newUserForm">
                    <div class="col-md-6">
                        <label for="inputEmail4" class="form-label">Email</label>
                        <input type="email" class="form-control" name="email" autocomplete="new-email">
                    </div>
                    <div class="col-md-6">
                        <label for="inputPassword4" class="form-label">Password</label>
                        <input type="password" class="form-control" name="password" autocomplete="new-password">
                    </div>
                    <div class="col-md-6">
                        <label for="inputName" class="form-label">Name</label>
                        <input type="text" class="form-control" name="name" autocomplete="new-name">
                    </div>
                    <div class="col-12">
                        <label for="inputAddress" class="form-label">Address</label>
                        <input type="text" class="form-control" name="address" placeholder="1234 Main St">
                    </div>
                    <div class="col-md-4">
                        <label for="inputCountry" class="form-label">Country</label>
                        <input type="text" class="form-control" name="country">
                    </div>
                    <div class="col-md-4">
                        <label for="inputCity" class="form-label">City</label>
                        <select name="city" class="form-select">
                        <option value="" selected>Choose...</option>
                        <option value="">...</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <label for="inputZip" class="form-label">Zip</label>
                        <input type="text" class="form-control" name="zip">
                    </div>
                    <div class="col-12">
                        <button type="submit" class="btn btn-primary">Sign in</button>
                    </div>
                </form>
            </div>
        `;

        // Set the inner HTML of the shadow root
        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(linkElement);
        this.shadowRoot.innerHTML += formHtml;

        // Attach event listener for form submission
        const form = this.shadowRoot.querySelector("#newUserForm");
        form.addEventListener("submit", this.handleFormSubmit.bind(this));
    }

    handleFormSubmit(event) {
        event.preventDefault();
    
        const form = this.shadowRoot.querySelector("#newUserForm");
        const formData = new FormData(form);
        formData.append("action", "create");
    
        submitUserForm(formData)
        .then(result => {
            if (result.status === "success") {
                alert("User added successfully!");
            } else {
                alert("Error adding user: " + result.message);
            }
        })
        .catch(error => {
            const resultDiv = document.createElement("div");
            resultDiv.textContent = "An error occurred while submitting the form.";
            form.prepend(resultDiv);
            console.error('Error submitting form:', error);
        });
    }
    
}

customElements.define('user-form', UserForm);

export default UserForm;