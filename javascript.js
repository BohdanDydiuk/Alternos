/* Файл із спільними скриптами для всього сайту (анімації, меню, кошик) */


document.addEventListener('DOMContentLoaded', function() {
    const menuImg = document.querySelector('.menu-img');
    const nav = document.querySelector('.nav');
    
    function toggleMenu() {
        if (nav.style.display === 'block') {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'block';
        }
    }

    if (window.innerWidth < 768) {
        menuImg.addEventListener('click', toggleMenu);
    }

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            nav.style.display = 'none';
            menuImg.removeEventListener('click', toggleMenu);
        } else {
            menuImg.addEventListener('click', toggleMenu);
        }
    });
});

// Функція для отримання значення кукі за ім'ям
function getCookieValue(cookieName) {
    // Розділяємо всі куки на окремі частини
    const cookies = document.cookie.split(';');

    // Шукаємо куки з вказаним ім'ям
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Видаляємо зайві пробіли

        // Перевіряємо, чи починається поточне кукі з шуканого імені
        if (cookie.startsWith(cookieName + '=')) {
            // Якщо так, повертаємо значення кукі
            return cookie.substring(cookieName.length + 1); // +1 для пропуску символу "="
        }
    }
    // Якщо кукі з вказаним іменем не знайдено, повертаємо порожній рядок або можна повернути null
    return '';
}

// Завантаження продуктів з JSON
async function getProducts() {
    let response = await fetch("phones_db.json");
    let products = await response.json();
    return products;
};

// Функція для генерації HTML-коду для продукту
function getCardHTML(product) {
    return `
        <div class="my-card" style="background:url(${product.backgroundimage}); color: ${product.txtcolor};">
            <h5 class="text-my-card">${product.title}</h5>
            <p class="description-card">${product.description}</p>
            <p class="price-card">
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-currency-hryvnia">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M8 7a2.64 2.64 0 0 1 2.562 -2h3.376a2.64 2.64 0 0 1 2.562 2a2.57 2.57 0 0 1 -1.344 2.922l-5.876 2.938a3.338 3.338 0 0 0 -1.78 3.64a3.11 3.11 0 0 0 3.05 2.5h2.888a2.64 2.64 0 0 0 2.562 -2"/>
                    <path d="M6 10h12"/>
                    <path d="M6 14h12"/>
                </svg>
                $${product.price}
            </p>
            <button type="button" class="cart-btn" data-product='${JSON.stringify(product)}'>
                Додати в кошик
            </button>
        </div>
    `;
}

// Додавання товару в кошик
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Функція для оновлення загальної ціни
function updateTotalPrice() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let totalPrice = cart.reduce((total, item) => total + item.price, 0);
    document.getElementById('total-price').innerText = `Total: $${totalPrice.toFixed(2)}`;
}

// Функція для відображення товарів у кошику
function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.getElementById('cart-items');

    if (cartContainer) {
        cartContainer.innerHTML = '';
        cart.forEach((item, index) => {
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.backgroundimage}" alt="${item.title}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h5>${item.title}</h5>
                        <p>${item.description}</p>
                        <p>$${item.price}</p>
                    </div>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
        });
    }

    // Оновлюємо загальну ціну після додавання/видалення товарів
    updateTotalPrice();
}

// Відображення товарів у кошику при завантаженні сторінки
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
});

// Додавання функції для переходу на сторінку оформлення замовлення
function redirectToCheckout() {
    window.location.href = 'checkout.html'; // Замініть на URL сторінки оформлення замовлення
}

// Видалення товару з кошика
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Відображення товарів на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list');
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product);
        });
    }

    // Додавання товару до кошика при натисканні на кнопку
    document.querySelectorAll('.cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productData = JSON.parse(this.getAttribute('data-product'));
            addToCart(productData);
            alert(`${productData.title} додано до кошика!`);
        });
    });
});

// Відображення товарів у кошику при завантаженні сторінки
document.addEventListener('DOMContentLoaded', displayCartItems);
