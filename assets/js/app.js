import Header from './components/header.js';
import Footer from './components/footer.js';
import Router from './router.js';

const app = {
    render() {
        // Create and append the header
        const header = new Header();
        const renderedHeader = header.render();
        const appDiv = document.getElementById('app');
        appDiv.appendChild(renderedHeader);

        // Create and append the outlet
        const outlet = document.createElement('main');
        outlet.id = 'main';
        appDiv.appendChild(outlet);

        // Initialize the router
        const router = new Router(outlet);
        router.init();

        // Create and append the footer
        const footer = new Footer();
        const renderedFooter = footer.render();
        appDiv.appendChild(renderedFooter);
    }
};

// Export the app module, with rendering executed during import
export default app.render();