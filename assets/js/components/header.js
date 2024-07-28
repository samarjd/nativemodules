class Header {
    constructor() {
        this.title = 'My Website';
        this.navItems = {
            'Home': '',
            'About': 'about',
            'Contact': 'contact'
        };
    }

    render() {
        const headerElement = document.createElement('header');
        
        const titleElement = document.createElement('h1');
        titleElement.textContent = this.title;
        headerElement.appendChild(titleElement);

        const navElement = document.createElement('nav');
        Object.entries(this.navItems).forEach(([item, path]) => {
            const navItemElement = document.createElement('a');
            navItemElement.href = `/${path}`;
            navItemElement.textContent = item;
            navElement.appendChild(navItemElement);
        });
        headerElement.appendChild(navElement);

        return headerElement;
    }
}

export default Header;