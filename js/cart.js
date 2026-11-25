// Shared shopping cart for Shop Paradise

const CART_KEY = "shopParadiseCart";

// Load cart from localStorage
function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

// Save cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Add product to cart
function addToCart(productName, productPrice) {
    let cart = getCart();

    let name = String(productName);
    let price = Number(productPrice);

    let existingProduct = cart.find(item =>
        item.name === name && Number(item.price) === price
    );

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            quantity: 1
        });
    }

    saveCart(cart);

    alert(name + " added to cart!");

    updateCartDisplay();
}

// Remove product from cart
function removeFromCart(index) {
    let cart = getCart();

    cart.splice(index, 1);

    saveCart(cart);
    updateCartDisplay();
}

// Change product quantity
function changeQuantity(index, amount) {
    let cart = getCart();

    if (!cart[index]) return;

    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart(cart);
    updateCartDisplay();
}

// Display cart products
function updateCartDisplay() {
    let cart = getCart();

    let cartItems = document.getElementById("cartItem");
    let totalElement = document.getElementById("total");

    if (!cartItems || !totalElement) return;

    let total = 0;
    let cartHTML = "";

    cart.forEach(function(item, index) {
        let subtotal = Number(item.price) * Number(item.quantity);
        total += subtotal;

        cartHTML += `
            <div class="cart-product">
                <p><strong>${escapeHTML(item.name)}</strong></p>
                <p>${Number(item.price).toLocaleString()} Kyats each</p>

                <button onclick="changeQuantity(${index}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">+</button>

                <p>Subtotal: ${subtotal.toLocaleString()} Kyats</p>

                <button onclick="removeFromCart(${index})">Remove</button>
                <hr>
            </div>
        `;
    });

    cartItems.innerHTML = cartHTML || "Your cart is empty";
    totalElement.textContent = total.toLocaleString() + " Kyats";
}

// Safely display product names
function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function(character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];
    });
}

// Calculate total for checkout
function getCartTotal() {
    return getCart().reduce(function(total, item) {
        return total + Number(item.price) * Number(item.quantity);
    }, 0);
}

// Update cart when the page opens
document.addEventListener("DOMContentLoaded", function() {
    updateCartDisplay();
});