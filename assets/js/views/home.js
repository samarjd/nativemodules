export default function renderHome() {
    const homeDiv = document.createElement('div');
    
    // Using a template literal for XML-like HTML
    homeDiv.innerHTML = `
        <section>
            <h1>Welcome to the Home page!</h1>
            <div>
                <p>This is the content of the home page. Enjoy browsing through our website!</p>
            </div>
        </section>
    `;
    
    return homeDiv;
}
