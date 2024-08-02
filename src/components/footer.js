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
            if (path === null) return;

            navItemsHTML += `
                <li class="col-3">
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
                <div class="container">
                    <ul class="row m-auto list-inline">
                        ${footerNav}
                    </ul>
                    <p class="text-center mt-3">© All rights reserved</p>
                </div>
            </div>
        `;

        footerElement.innerHTML = footerHTML;
        return footerElement;
    }
}

export default Footer;
