class Router {
    constructor(outlet) {
        this.outlet = outlet;
        this.routes = {
            '/': () => import('./views/home.js'),
            '/about': () => import('./views/about.js'),
            '/contact': () => import('./views/contact.js'),
        };

        // Define a default route for unknown paths
        this.notFoundRoute = () => Promise.resolve({ default: () => {
            const element = document.createElement('div');
            element.innerHTML = `
                <h1>404: Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            `;
            return element;
        }});
    }

    init() {
        window.addEventListener('popstate', () => this.route());
        window.addEventListener('load', () => this.route()); // Handle page load
        document.body.addEventListener('click', (event) => {
            const anchor = event.target.closest('a');
            if (anchor && anchor.href.startsWith(window.location.origin)) {
                event.preventDefault();
                history.pushState(null, '', new URL(anchor.href).pathname);
                this.route();
            }
        });
        this.route();
    }

    async route() {
        const path = window.location.pathname;
        const loadRoute = this.routes[path] || this.notFoundRoute;

        try {
            const { default: render } = await loadRoute();
            this.outlet.innerHTML = ''; // Clear the outlet
            this.outlet.appendChild(render());
        } catch (error) {
            console.error('Error loading route:', error);
            this.outlet.innerHTML = 'Error loading route.';
        }
    }
}

export default Router;