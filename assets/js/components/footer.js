class Footer {
    constructor() {
        this.element = document.createElement('footer');
        this.element.textContent = '© 2024 My Website';
    }

    render() {
        return this.element;
    }
}

export default Footer;