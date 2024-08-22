class NotFoundPage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    
    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    margin-top: 5rem;
                    text-align: center;
                }
                h1 {
                    font-size: 2rem;
                }
                p {
                    font-size: 1.25rem;
                }
            </style>
            <div class="container">
                <h1>404: Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
        `;
    }
}

customElements.define('not-found-page', NotFoundPage);

export default NotFoundPage;