import * as config from "../../config.js";

function createUserForm() {
    // Create the form HTML with Bootstrap classes
    const formHtml = `
        <div class="container p-4">
            <h2 class="mb-4">Add New User</h2>
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

    // Create a container element and set its innerHTML to the form HTML
    const container = document.createElement("div");
    container.innerHTML = formHtml;

    return container;
}

async function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById("newUserForm");
    const formData = new FormData(form);
    formData.append("action", "create");

    const response = await fetch(`${config.SERVER_URL}?route=user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
    });

    const result = await response.json();
    console.log(result);

    const resultDiv = document.createElement("div");
    if (result.status === "success") {
        resultDiv.textContent = "User added successfully!";
    } else {
        resultDiv.textContent = "Error adding user: " + result.message;
    }

    form.prepend(resultDiv);
}

export default function renderNewUserForm() {
    const formContainer = createUserForm();
    const form = formContainer.querySelector("#newUserForm");
    form.addEventListener("submit", handleFormSubmit);
    return formContainer;
}
