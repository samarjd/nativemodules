import Header from './components/header.js';
import Footer from './components/footer.js';
import Router from './router.js';

const app = {
    render() {

        // Create the main element to hold the app content
        const outlet = document.createElement('main');
        outlet.id = 'main';
        outlet.classList.add('p-2', 'mt-5', 'text-center');

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

// Export the app module, with rendering executed during import
export default app.render();