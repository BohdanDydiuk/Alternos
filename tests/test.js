// Анімація при завантаженні сторінки
window.addEventListener('load', () => {
    const header = document.querySelector('.header');
    const products = document.querySelectorAll('.product');
  
    header.classList.add('animate');
    products.forEach((product) => {
      product.classList.add('animate');
    });
  });