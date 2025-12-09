const clpFormat = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
});

const favoriteStorage = localStorage.getItem('favorites');

let products = [];
let favorites = [];

if (favoriteStorage) {
    favorites = JSON.parse(favoriteStorage);
}

function addToFavorites(productId) {
    const product = products.find(product => product.id === productId);
    favorites.push(product);
}

function removeFromFavorites(productId) {
    const product = favorites.find(product => product.id === productId);
    favorites = favorites.filter(product => product.id !== productId);
}

$.getJSON('db/products.json', function(data) {
    products = data;

    const carouselInner = $('#carousel-inner');
    
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    const randomProducts = data.slice(0, 3);

    $.each(randomProducts, function(index, product) {
        const carouselItem = $('<div>').addClass('carousel-item');

        if(index === 0) {
            carouselItem.addClass('active');
        }

        carouselItem.html(`
            <img src="${product.image.banner}" class="d-block w-100" alt="${product.name}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${product.name}</h5>
                <p>${product.description}</p>
            </div>
        `);
        carouselInner.append(carouselItem);
    });

    $.each(data, function(index, product) {
        const productCard = $('<div>').addClass('card-group col-12 col-md-4 col-lg-4 mb-4');
        const isFavorite = favorites.some(favorite => favorite.id === product.id);
        
        productCard.html(`
            <div class="card">
                <img src="${product.image.src}" width="250" height="250" class="card-img-top" alt="${product.name}">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between">
                    <span class="text-dark">${clpFormat.format(product.price)}</span>
                    <button class="btn btn-outline-danger" onclick="${isFavorite ? removeFromFavorites(product.id) : addToFavorites(product.id)}">${isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}</button>
                </div>
            </div>
        `);
        $('#products').append(productCard);
    });
});
