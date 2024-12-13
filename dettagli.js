document.addEventListener('DOMContentLoaded', function() {
    // Ottieni l'ID del libro dall'URL
    const params = new URLSearchParams(window.location.search);
    
    
    const bookId = params.get('asin');

    if (!bookId) {
        document.getElementById('bookDetails').innerHTML = `
            <div class="col-12 text-center">
                <h2>Errore: ASIN non inserito</h2>
                <p>Torna alla <a href="index.html">home page</a></p>
            </div>
        `;
        return;
    }

    // Fetch dei dati del libro
    fetch('https://striveschool-api.herokuapp.com/books')
        .then(response => response.json())
        .then(books => {
            const book = books.find(b => b.asin === bookId);
            
            if (!book) {
                throw new Error('Libro non trovato');
            }

            document.getElementById('bookDetails').innerHTML = `
                <div class="col-md-4">
                    <img src="${book.img}" alt="${book.title}" class="img-fluid rounded shadow">
                </div>
                <div class="col-md-8">
                    <h2>${book.title}</h2>
                    <p class="lead">
                        <strong class="text-danger">€${book.price.toFixed(2)}</strong>
                    </p>
                    <p>
                        <span class="badge bg-danger text-uppercase">${book.category}</span>
                    </p>
                    <p><strong>ASIN:</strong> ${book.asin}</p>
                    <button class="btn btn-primary" onclick="addToCart('${book.title}', '${book.price}', '${book.asin}')">
                        <i class="fas fa-cart-plus"></i> Aggiungi al carrello
                    </button>
                </div>
            `;
        })
        .catch(error => {
            document.getElementById('bookDetails').innerHTML = `
                <div class="col-12 text-center">
                    <h2>Errore: ${error.message}</h2>
                    <p>Torna alla <a href="index.html">home page</a></p>
                </div>
            `;
        });
});

// Funzione addToCart per la pagina dettagli
function addToCart(title, price, asin) {
    // Recupera i dati esistenti dal localStorage
    const savedCart = localStorage.getItem('cartItems') || '';
    const savedTotal = Number(localStorage.getItem('cartTotal')) || 0;

    // Crea il nuovo elemento del carrello
    const newCartItem = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h6>${title}</h6>
                <small>€${price}</small>
            </div>
            <div>
                <span class="me-3">€${price}</span>
                <button class="btn btn-sm btn-danger" onclick="removeFromCart('${asin}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `;

    // Aggiorna il localStorage
    localStorage.setItem('cartItems', savedCart + newCartItem);
    localStorage.setItem('cartTotal', (savedTotal + Number(price)).toFixed(2));

    // Reindirizza alla home page
    window.location.href = 'index.html';
}