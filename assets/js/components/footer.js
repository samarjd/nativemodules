class Footer {
    constructor() {
        this.navItems = {
            'Privacy Policy': 'privacy-policy',
            'Terms of Service': 'terms-of-service',
            'Contact Us': 'contact',
            'About Us': 'about',
            'FAQ': 'faq',
            'Careers': 'careers',
            'Blog': 'blog',
            'Press': 'press',
            'Investors': 'investors',
            'Affiliates': 'affiliates',
            'Partners': 'partners',
            'Developers': 'developers',
            'Support': 'support',
            'Sitemap': 'sitemap',
            'Cookies': 'cookies',
            'Advertise': 'advertise',
            'Legal': 'legal',
        };
    }

    generateNavItem() {
        let navItemsHTML = '';

        Object.entries(this.navItems).forEach(([item, path]) => {
            if (path === null) return; // Skip null values

            navItemsHTML += `
                <li class="col-4">
                    <a class="text-decoration-none" href="/${path}">
                        ${item}
                    </a>
                </li>
            `;
        });

        return navItemsHTML;
    }

    render() {
        const footerElement = document.createElement('footer');
        const footerNav = this.generateNavItem();

        const footerHTML = `
            <div class="mt-5 p-2">
                <div class="container-fluid">
                    <ul class="row m-auto list-inline">
                        ${footerNav}
                    </ul>
                </div>
            </div>
        `;

        footerElement.innerHTML = footerHTML;
        return footerElement;
    }
}

export default Footer;
