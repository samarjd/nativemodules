import Header from './src/components/header.js';
import Footer from './src/components/footer.js';
import Router from './router.js';

const app = {
    render() {

        const outlet = document.createElement('main');
        outlet.id = 'main';
        outlet.classList.add('p-2', 'my-2');

        // Initialize the router
        const router = new Router(outlet);
        router.init();

        // Create and append the header
        const header = new Header(router);
        const renderedHeader = header.render();
        const appDiv = document.getElementById('app');
        appDiv.appendChild(renderedHeader);

        // Append the main element to the app div
        appDiv.appendChild(outlet);

        // Create and append the footer
        const footer = new Footer();
        const renderedFooter = footer.render();
        appDiv.appendChild(renderedFooter);
    }
};

export default app;