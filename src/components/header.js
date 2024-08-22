class Header {
    constructor(router) {
        this.title = 'Native modules';
        this.logo = 'src/images/logo.png';
        this.navItems = {
            'Home': '',
            'Users List': 'users',
            'New User': 'newUser',
            'Dropdown': {
                'Action': 'action',
                'Another action': 'another-action',
                'Something else here': 'something-else'
            },
            'Disabled': null
        };
        this.router = router;
    }

    generateNavItem() {
        let navItemsHTML = '';
        Object.entries(this.navItems).forEach(([item, path]) => {
            if (path === null) return;

            if (typeof path === 'string') {
                navItemsHTML += `
                    <li class="nav-item">
                        <a class="nav-link${item === 'Home' ? ' active' : ''}${item === 'Disabled' ? ' disabled" aria-disabled="true' : ''}" href="/${path}">
                            ${item}
                        </a>
                    </li>
                `;
            } else if (typeof path === 'object') {
                navItemsHTML += `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            ${item}
                        </a>
                        <ul class="dropdown-menu">
                `;

                Object.entries(path).forEach(([subItem, subPath]) => {
                    navItemsHTML += `
                        <li><a class="dropdown-item" href="/${subPath}">${subItem}</a></li>
                    `;
                });

                navItemsHTML += `
                        </ul>
                    </li>
                `;
            }
        });

        return navItemsHTML;
    }

    handleFormSubmit(event) {
        event.preventDefault();
        const searchInput = event.target.querySelector('input[type="search"]');
        const query = searchInput.value.trim();

        if (query) {
            const url = new URL(window.location.href);
            history.pushState(null, '', query);
            this.router.route();
        } else {
            history.pushState(null, '', '/');
            this.router.route();
        }
    }

    render() {
        const headerElement = document.createElement('header');
        const headerNav = this.generateNavItem();

        const headerHTML = `
            <nav class="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">
                        <img src="${this.logo}" alt="Logo" width="24" height="24" class="d-inline-block align-text-top rounded-5">
                        ${this.title}
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                            ${headerNav}
                        </ul>
                        <form class="d-flex" role="search">
                            <input class="form-control-sm me-2" type="search" placeholder="Search" aria-label="Search">
                            <button class="btn btn-sm btn-primary" type="submit">Search</button>
                        </form>
                    </div>
                </div>
            </nav>
        `;

        headerElement.innerHTML = headerHTML;
        const form = headerElement.querySelector('form');
        form.addEventListener('submit', this.handleFormSubmit.bind(this));

        return headerElement;
    }
}

export default Header;
