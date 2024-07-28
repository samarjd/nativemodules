class Router {
    constructor(outlet) {
        this.outlet = outlet;
        this.routes = {
            '/': () => import('./views/home.js'),
            '/about': () => import('./views/about.js'),
            '/contact': () => import('./views/contact.js')
        };
    }

    init() {
        window.addEventListener('popstate', () => this.route());
        document.querySelectorAll('a').forEach(anchor => {
            anchor.addEventListener('click', (event) => {
                event.preventDefault();
                history.pushState(null, '', event.target.href);
                this.route();
            });
        });
        this.route();
    }

    async route() {
        const path = window.location.pathname;
        const loadRoute = this.routes[path] || this.routes['/'];

        try {
            const { default: render } = await loadRoute();
            this.outlet.innerHTML = ''; // Clear the outlet
            this.outlet.appendChild(render());
        } catch (error) {
            console.error('Error loading route:', error);
        }
    }
}

export default Router;