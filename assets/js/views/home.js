import * as config from '../../../config.js';

export default async function renderHome() {
    const homeSection = document.createElement('section');
    homeSection.classList.add('container');
    homeSection.innerHTML = `
        <input type="search" id="searchInput" class="form-control mb-3" placeholder="Search for movies...">
        <div id="cardDeck" class="card-deck row m-auto"></div>
        <p id="loadingMessage">Loading...</p>
    `;

    const searchInput = homeSection.querySelector('#searchInput');
    const cardDeck = homeSection.querySelector('#cardDeck');
    const loadingMessage = homeSection.querySelector('#loadingMessage');
    
    async function fetchAndRenderCards(query) {
        loadingMessage.textContent = 'Loading...';
        
        try {
            const response = await fetch(`${config.API_URL}&s=${query}`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            
            const result = await response.json();
            const data = result.Search;
            
            if (!data) {
                throw new Error('No data found');
            }

            // Clear loading message
            loadingMessage.textContent = '';
            
            // Clear existing cards
            cardDeck.innerHTML = '';

            // Render cards
            data.forEach(item => {
                const col = document.createElement('div');
                col.classList.add('col-3', 'mb-3');
                const card = document.createElement('div');
                card.classList.add('card');
                
                const cardImage = document.createElement('img');
                cardImage.src = item.Poster;
                cardImage.alt = item.Title;
                cardImage.classList.add('card-img-top');
                
                const cardBody = document.createElement('div');
                cardBody.classList.add('card-body');
                
                const cardTitle = document.createElement('h5');
                cardTitle.classList.add('card-title');
                cardTitle.textContent = item.Title;
                
                cardBody.appendChild(cardTitle);
                card.appendChild(cardImage);
                card.appendChild(cardBody);
                col.appendChild(card);
                cardDeck.appendChild(col);
            });

            console.log('Card data:', cardDeck);
            
        } catch (error) {
            console.error('Error fetching card data:', error);
            cardDeck.innerHTML = '';
            loadingMessage.textContent = 'Aucun résultat trouvé.';
        }
    }

    // Initial fetch with default value
    await fetchAndRenderCards('2022');

    searchInput.addEventListener('input', (event) => {
        const query = event.target.value.trim();
        if (query) {
            fetchAndRenderCards(query);
        } else {
            cardDeck.innerHTML = '';
            loadingMessage.textContent = 'Please enter a search term.';
        }
    });

    return homeSection;
}
