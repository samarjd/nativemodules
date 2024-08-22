import SingleSitemap from '../components/single-sitemap.js';

class SitemapGenerator extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.render();
    }

    // Generate the XML sitemap
    generateSitemap() {
        const baseUrl = 'http://localhost/modules';

        // Define your routes here
        const routes = [
            { path: '/', priority: 1.0, type: 'folder' },
            { path: '/modules/index.html', priority: 0.8, type: 'file' },
            { path: '/users', priority: 0.7, type: 'file' },
            { path: '/newUser', priority: 0.7, type: 'file' },
        ];

        return routes.map(route => ({
            name: route.path,
            type: route.type,
        }));
    }

    // Download the sitemap as a file
    downloadSitemap() {
        const xml = this.generateSitemapXml();
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Convert routes to XML format
    generateSitemapXml() {
        const baseUrl = 'http://localhost/modules';
        const routes = this.generateSitemap();
        
        let xml = '<?xml version="1.0" encoding="UTF-8"?>';
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        routes.forEach(route => {
            xml += '<url>';
            xml += `<loc>${baseUrl}${route.name}</loc>`;
            xml += '<priority>0.5</priority>';
            xml += '</url>';
        });

        xml += '</urlset>';
        return xml;
    }

    // Render the component
    render() {

        this.shadowRoot.innerHTML = `
            <style>
                .container {
                    padding: 1rem 2rem;
                }
                button {
                    padding: 0.5rem 1rem;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 0.25rem;
                    cursor: pointer;
                }
                button:hover {
                    background-color: #0056b3;
                }
                .sitemap-list {
                    margin-top: 1rem;
                }
            </style>
            <div class="container">
                <h2>Sitemap</h2>
                <p>Click the button below to generate and download the sitemap for your site.</p>
                <button id="downloadButton">Download Sitemap</button>
                <div class="sitemap-list"></div>
            </div>
        `;

        const routes = this.generateSitemap();

        routes.forEach(route => {
            const sitemap = new SingleSitemap(route.name, route.type);
            this.shadowRoot.querySelector('.sitemap-list').appendChild(sitemap);
        });

        this.shadowRoot.querySelector('#downloadButton').addEventListener('click', () => this.downloadSitemap());
    }
}

// Define the custom element
customElements.define('sitemap-generator', SitemapGenerator);

export default SitemapGenerator;