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

// Отримуємо дані про товари з JSON файлу
async function getProducts() {
    let response = await fetch("phones_db.json");
    let products = await response.json();
    return products;
};

// Генеруємо HTML-код для карточки товару
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
            <button type="button" class="cart-btn" data-product='{"title":"${product.title}", "price":${product.price}, "description":"${product.description}", "quantity":1}'>
                <svg class="bell" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-shopping-cart-plus">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M4 19a2 2 0 1 0 4 0a2 2 0 1 0 4 0a2 2 0 1 0 4 0h-14z"/>
                    <path d="M16 11v-6a4 4 0 0 0 -8 0v6"/>
                    <path d="M10 17h4"/>
                </svg>
                Додати в кошик
            </button>
        </div>
    `;
}


// Відображаємо товари на сторінці
getProducts().then(function (products) {
    let productsList = document.querySelector('.products-list')
    if (productsList) {
        products.forEach(function (product) {
            productsList.innerHTML += getCardHTML(product)
        })
    }

    // Отримуємо всі кнопки "Купити" на сторінці
    let buyButtons = document.querySelectorAll('.products-list .cart-btn');
    // Навішуємо обробник подій на кожну кнопку "Купити"
    if (buyButtons) {
        buyButtons.forEach(function (button) {
            button.addEventListener('click', addToCart);
        });
    }
})


// Отримуємо кнопку "Кошик"
const cartBtn = document.getElementById('cart-btn');

// Навішуємо обробник подій на клік кнопки "Кошик"
cartBtn.addEventListener("click", function () {
    // Переходимо на сторінку кошика
    window.location.assign('cart.html');
});

// Створення класу кошика
class ShoppingCart {
    constructor() {
        this.items = {};
        this.loadCartFromCookies(); // завантажуємо з кукі-файлів раніше додані в кошик товари
    }

    // Додавання товару до кошика
    addItem(product) {
        const existingProduct = this.items.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            this.items.push(product);
        }
    }

    saveCartToCookies() {
        document.cookie = "cart=" + JSON.stringify(this.items) + ";path=/";
    }

    loadCartFromCookies() {
        const cookies = document.cookie.split('; ').find(row => row.startsWith('cart='));
        if (cookies) {
            this.items = JSON.parse(cookies.split('=')[1]);
        }
    }
    // Обчислення загальної вартості товарів у кошику
    calculateTotal() {
        let total = 0;
        for (let key in this.items) { // проходимося по всіх ключах об'єкта this.items
            total += this.items[key].price * this.items[key].quantity; // рахуємо вартість усіх товарів
        }
        return total;
    }
}

// Створення об'єкта кошика 
// Завантажити кошик із куків
const cart = new ShoppingCart();
cart.loadCartFromCookies();

// Додавання товару до кошика при натисканні на кнопку
document.querySelectorAll('.cart-btn').forEach(button => {
    button.addEventListener('click', function() {
        const productData = JSON.parse(this.getAttribute('data-product'));
        cart.addItem(productData);
        cart.saveCartToCookies();
        alert(`${productData.name} додано до кошика!`);
    });
});

// Додавання товару в кошик
function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Відображення товарів у кошику
function displayCartItems() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartContainer = document.getElementById('cart-items');

    if (cartContainer) {
        cartContainer.innerHTML = '';
        cart.forEach((item, index) => {
            cartContainer.innerHTML += `
                <div class="cart-item">
                    <p>${item.name}</p>
                    <p>${item.price} USD</p>
                    <button onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
        });
    }
}

// Видалення товару з кошика
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
}

// Виклик функції для відображення товарів у кошику при завантаженні сторінки
document.addEventListener('DOMContentLoaded', displayCartItems);