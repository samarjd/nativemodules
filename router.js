class Router {
    constructor(outlet) {
        this.outlet = outlet;
        this.routes = {
            '/': () => import('./src/views/home.js'),
            '/about': () => import('./src/views/about.js'),
            '/contact': () => import('./src/views/contact.js'),
        };

        this.notFoundRoute = () => Promise.resolve({
            default: () => {
                const element = document.createElement('div');
                element.innerHTML = `
            <h1>404: Page Not Found</h1>
            <p>Sorry, the page you are looking for does not exist.</p>
          `;
                return element;
            }
        });
    }

    init() {
        window.addEventListener('popstate', () => this.route());
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

    route() {
        const path = window.location.pathname;
        const loadRoute = this.routes[path] || this.notFoundRoute;

        loadRoute()
            .then(module => {
                const { default: render } = module;
                this.outlet.innerHTML = '';
                return render();
            })
            .then(renderedElement => {
                this.outlet.appendChild(renderedElement);
            })
            .catch(error => {
                console.error('Error loading route:', error);
                this.outlet.innerHTML = 'Error loading route.';
            });
    }
}

export default Router;