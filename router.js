class Router {
    constructor(outlet) {
        this.outlet = outlet;
        
        // Define the route mapping
        this.routes = {
            "/": "home",
            "/modules/index.html": "home",
            "/users": "users",
            "/newUser": "newUser",
            "/sitemap": "sitemap",
        };
        
        // Define the route handlers
        this.routeHandlers = {
            "home": () => import("./src/views/home.js"),
            "users": () => import("./src/views/users.js"),
            "newUser": () => import("./src/views/newUser.js"),
            "sitemap": () => import("./src/views/sitemap.js"),
        };

        // Define the 404 handler
        this.notFoundRoute = () => import("./src/views/404-page.js");

    }

    init() {
        window.addEventListener("popstate", () => this.route());
        document.body.addEventListener("click", (event) => {
            const anchor = event.target.closest("a");
            if (anchor && anchor.href.startsWith(window.location.origin)) {
                event.preventDefault();
                history.pushState(null, "", new URL(anchor.href).pathname);
                this.route();
            }
        });
        this.route();
    }

    route() {
        const path = window.location.pathname;
        const routeKey = this.routes[path] || "notFound";
        const loadRoute = this.routeHandlers[routeKey] || this.notFoundRoute;

        loadRoute()
            .then((module) => {
                const { default: render } = module;
                const renderedElement = new render();

                this.outlet.innerHTML = "";
                this.outlet.appendChild(renderedElement);
                
                window.scrollTo({ top: 0, behavior: "smooth" });
            })
            .catch((error) => {
                console.error("Error loading route:", error);
                this.outlet.innerHTML = "Error loading route.";
            });
    }
}

export default Router;