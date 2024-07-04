document.addEventListener('DOMContentLoaded', () => {
    const products = [
        { id: 1, name: 'Chocolate', price: 5 },
        { id: 2, name: 'Wine', price: 20 },
        { id: 3, name: 'Cheese', price: 10 },
    ];

    const productCatalog = document.getElementById('product-catalog');

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';
        productDiv.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <form action="/add-to-cart" method="post">
                <input type="hidden" name="id" value="${product.id}">
                <input type="hidden" name="name" value="${product.name}">
                <input type="hidden" name="price" value="${product.price}">
                <button type="submit">Add to Hamper</button>
            </form>
        `;
        productCatalog.appendChild(productDiv);
    });
});
