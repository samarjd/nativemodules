class Router {
    constructor(outlet) {
        this.outlet = outlet;
        this.routes = {
            "/": () => import("./src/views/home.js"),
            "/users": () => import("./src/views/users.js"),
            "/newUser": () => import("./src/views/newUser.js"),
        };

        this.notFoundRoute = () =>
            Promise.resolve({
                default: () => {
                    const element = document.createElement("div");
                    element.classList.add("container", "mt-5", "text-center");
                    element.innerHTML = `
                        <h1>404: Page Not Found</h1>
                        <p>Sorry, the page you are looking for does not exist.</p>
                    `;
                    return element;
                },
            });
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
        const loadRoute = this.routes[path] || this.notFoundRoute;

        loadRoute()
            .then((module) => {
                const { default: render } = module;
                this.outlet.innerHTML = "";
                const renderedElement = new render();

                if (renderedElement instanceof HTMLElement) {
                    this.outlet.appendChild(renderedElement);
                } else {
                    console.error("Error: Rendered element is not a valid HTML element.");
                }
            })
            .catch((error) => {
                console.error("Error loading route:", error);
                this.outlet.innerHTML = "Error loading route.";
            });
    }
}

export default Router;
