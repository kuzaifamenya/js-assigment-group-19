// JavaScript for Interactive E-Commerce Website
// Demonstrates DOM manipulation (getElementById, querySelector, createElement, appendChild, innerHTML, addEventListener), events, arrays/objects, localStorage, try-catch error handling

// Global products array (6+ products as required, stored as JS objects)
//const means constant
//we arrary to store many values in one place
const products = [
    {id: 1, name: "Laptop", price: 1200000, category: "Electronics", image: "images/laptop.jpg"},
    {id: 2, name: "Phone", price: 4000000, category: "Electronics", image: "images/phone.jpg"},
    {id: 3, name: "Shoes", price: 500000, category: "Fashion", image: "images/shoe.jpg"},
    {id: 4, name: "Clothes", price: 30000, category: "Fashion", image: "images/cloth.jpg"},
    {id: 5, name: "book", price: 600000, category: "Books", image: "images/books.jpg"},
    {id: 6, name: "Tablet", price: 800000, category: "Electronics", image: "images/laptop.jpg"} // Reuse laptop img for demo
];

let cart = []; // Global cart array of objects {id, name, price, image, qty}

// Load cart from localStorage with error handling (try-catch) 
function loadCart() {
    try {
        const saved = localStorage.getItem("cart");
        if (saved) {
            cart = JSON.parse(saved);
            // Validate cart structure
            if (!Array.isArray(cart) || !cart.every(item => item && typeof item.id !== 'undefined' && (item.qty || 0) > 0)) {
                console.warn("Invalid cart data, resetting to empty");
                cart = [];
            }
        }
    } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        cart = []; // Reset on error
    }
    console.log("Cart loaded:", cart.length, "items");
    updateCartCount(); // Update DOM count using getElementById
}

// Save cart to localStorage with error handling
//try which shows a code that might cause an error
//catch(error) ; the code that run if the an error occurs
function saveCart() {
    try {
        localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Error saving cart to localStorage:", error);
        alert("Failed to save cart. Please try again.");
    }
    updateCartCount();
}

// Update cart counter DOM element on all pages (live update)
function updateCartCount() {
    const countEl = document.getElementById("cartCount");
    if (countEl) {
        const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
        countEl.textContent = `Cart (${totalItems})`;
        console.log("Cart count updated to:", totalItems);
    }
}

// Display products dynamically using DOM createElement/appendChild/innerHTML
function displayProducts(items = products) {
    const productList = document.getElementById("productList");
    if (!productList) return;
    productList.innerHTML = ""; // Clear using innerHTML
    items.forEach(product => {
        const div = document.createElement("div"); // createElement
        div.className = "product-card";
        div.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>UGX ${product.price.toLocaleString()}</p>
            <button onclick="addToCart(${product.id})">Add to Cart</button>
        `;
        productList.appendChild(div); // appendChild
    });
}

// Add to cart by id (event handling via onclick), handles duplicates by incrementing qty
function addToCart(id) {
    console.log("Add to cart clicked for id:", id);
    try {
        const product = products.find(p => p.id === id);
        console.log("Found product:", product);
        if (!product) throw new Error("Product not found");
        
        const cartItem = cart.find(item => item.id === id);
        if (cartItem) {
            cartItem.qty += 1;
        } else {
            cart.push({...product, qty: 1});
        }
        saveCart(); // Persist and update count
    } catch (error) {
        console.error("Error adding to cart:", error);
        alert("Failed to add item to cart.");
    }
}

// Search products (DOM event addEventListener, filter array)
function setupSearch() {
    const search = document.getElementById("search");
    if (search) {
        search.addEventListener("input", (e) => { // addEventListener
            const text = e.target.value.toLowerCase();
            const filtered = products.filter(p => p.name.toLowerCase().includes(text));
            displayProducts(filtered);
        });
    }
}

// Filter by category (DOM onclick)
function filterProducts(category) {
    let filtered;
    if (category === "All") {
        filtered = products;
    } else {
        filtered = products.filter(p => p.category === category);
    }
    displayProducts(filtered);
}

// Display cart with quantity controls (DOM manipulation)
function displayCart() {
    const cartItems = document.getElementById("cartItems");
    const totalEl = document.getElementById("totalPrice");
    if (!cartItems || !totalEl) return;

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="80">
            <span>${item.name} - $${item.price.toLocaleString()} x </span>
            <div class="quantity">
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeItem(${item.id})">Remove</button>
            <p>Subtotal: $${(item.price * item.qty).toLocaleString()}</p>
        `;
        cartItems.appendChild(div);
        total += item.price * item.qty;
    });

    totalEl.textContent = `Total: $${total.toLocaleString()}`;
}

// Change quantity with validation (try-catch)
function changeQuantity(id, delta) {
    try {
        const item = cart.find(c => c.id === id);
        if (!item) throw new Error("Item not found in cart");
        item.qty = Math.max(1, item.qty + delta); // Prevent qty < 1
        if (item.qty === 0) removeItem(id);
        else saveCart();
        displayCart(); // Refresh DOM
    } catch (error) {
        console.error("Error changing quantity:", error);
        alert("Invalid quantity change.");
    }
}

// Remove item by id
function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    displayCart();
}

// Checkout validation (comprehensive with try-catch)
function validateCheckout() {
    try {
        const name = document.getElementById("name")?.value.trim();
        const email = document.getElementById("email")?.value.trim();
        const phone = document.getElementById("phone")?.value.trim();
        const address = document.getElementById("address")?.value.trim();

        // Check empty fields
        if (!name || !email || !phone || !address) {
            throw new Error("Please fill all fields.");
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email format.");// message that appears when email is invalid
        }

        // Phone validation (digits, min 10)
        const phoneRegex = /^\d{10,}$/;
        if (!phoneRegex.test(phone)) {
            throw new Error("Invalid phone number (at least 10 digits).");
        }

        // Empty cart check
        loadCart(); // Ensure latest
        if (cart.length === 0) {
            throw new Error("Cart is empty. Add items before checkout.");
        }

        alert("Order placed successfully! Cart cleared.");
        cart = [];
        saveCart();
        return true;
    } catch (error) {
        console.error("Checkout error:", error);
        alert(error.message);
        return false;
    }
}

// Initialize on page load (DOMContentLoaded event)
document.addEventListener("DOMContentLoaded", () => {
    loadCart();
    if (document.getElementById("productList")) {
        displayProducts();
        setupSearch();
    }
    if (document.getElementById("cartItems")) {
        displayCart();
    }
    // Ensure count updated even if no products/cart
    updateCartCount();
});
//

git commit -m "Implement event handling for add to cartfunctionality"

