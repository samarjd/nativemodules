class SingleSitemap extends HTMLElement {
    constructor(name, type) {
        super();
        this.attachShadow({ mode: 'open' });
        
        this.name = name;
        this.type = type;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const type = this.type;
        const name = this.name;

        this.shadowRoot.innerHTML = `
            <style>
                .sitemap-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 5px;
                    font-family: Arial, sans-serif;
                }
                .icon {
                    margin-right: 10px;
                    width: 20px;
                    height: 20px;
                }
                .folder-icon::before {
                    content: "📁";
                }
                .file-icon::before {
                    content: "📄";
                }
            </style>
            <div class="sitemap-item">
                <span class="icon ${type}-icon"></span>
                <span>${name}</span>
            </div>
        `;
    }
}

customElements.define('single-sitemap', SingleSitemap);

export default SingleSitemap;