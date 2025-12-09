const clpFormat = new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
});

let products = [];
let favorites = [];

const favoriteStorage = localStorage.getItem('favorites');
if (favoriteStorage) {
    favorites = JSON.parse(favoriteStorage);
}

function saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function renderFavorites() {
    const container = $('#favorites-list');
    
    container.empty();

    if (favorites.length === 0) {
        container.html('<p class="text-center my-4 text-muted">No hay favoritos 😔</p>');
        return;
    }

    $.each(favorites, function(index, product) {
        const favoriteCard = $('<li>').addClass('list-group-item d-flex justify-content-start align-items-center gap-2');
        
        favoriteCard.html(`
            <button class="btn btn-danger btn-delete-favorite" data-id="${product.id}">
                X
            </button>
            <span>${product.name}</span>
        `);
        container.append(favoriteCard);
    });
}

function renderProducts() {
    const container = $('#products');
    
    container.empty();

    $.each(products, function(index, product) {
        const isFavorite = favorites.some(fav => fav.id === product.id);
        
        const btnClass = isFavorite ? 'btn-danger' : 'btn-outline-danger';
        const btnText = isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos';

        const productCard = $('<div>').addClass('card-group col-12 col-md-4 col-lg-3 mb-4');
        
        productCard.html(`
            <div class="card h-100">
                <img src="${product.image.src}" class="card-img-top" alt="${product.name}" style="object-fit: contain; height: 250px;">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text">${product.description}</p>
                </div>
                <div class="card-footer bg-white d-flex justify-content-between align-items-center">
                    <span class="text-dark fw-bold">${clpFormat.format(product.price)}</span>
                    
                    <button class="btn ${btnClass} btn-favorite" data-id="${product.id}">
                        ${btnText}
                    </button>
                </div>
            </div>
        `);
        container.append(productCard);
    });
}

$.getJSON('db/products.json', function(data) {
    products = data;
    const carouselInner = $('#carousel-inner');
    let carouselData = [...data]; 
    
    for (let i = carouselData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [carouselData[i], carouselData[j]] = [carouselData[j], carouselData[i]];
    }

    const randomProducts = carouselData.slice(0, 3);
    $.each(randomProducts, function(index, product) {
        const carouselItem = $('<div>').addClass('carousel-item');
        if(index === 0) carouselItem.addClass('active');

        carouselItem.html(`
            <img src="${product.image.banner}" class="d-block w-100" alt="${product.name}">
            <div class="carousel-caption d-none d-md-block">
                <h5>${product.name}</h5>
                <p>${product.description}</p>
            </div>
        `);
        carouselInner.append(carouselItem);
    });

    renderProducts();
});

$(document).on('click', '.btn-favorite', function() {
    const button = $(this);
    const productId = button.data('id');
    
    const existingIndex = favorites.findIndex(fav => fav.id === productId);

    if (existingIndex !== -1) {
        favorites.splice(existingIndex, 1);
    } else {
        const productToAdd = products.find(p => p.id === productId);
        if (productToAdd) {
            favorites.push(productToAdd);
        }
    }

    saveFavorites();
    renderProducts();
});

$(document).on('click', '.btn-delete-favorite', function() {
    const button = $(this);
    const productId = button.data('id');
    
    const existingIndex = favorites.findIndex(fav => fav.id === productId);

    if (existingIndex !== -1) {
        favorites.splice(existingIndex, 1);
    }

    saveFavorites();
    renderFavorites();
    renderProducts();
});

$('#btn-favorites').on('click', function() {
    $('#favoritesModal').modal('show');
    renderFavorites();
});
