let cart = [];

// Fonction pour mettre à jour le badge du panier
function updateCartBadge() {
    const badgeElement = document.querySelector('.cart-count');
    if (badgeElement) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        badgeElement.textContent = totalCount;
    }
}

// 2. Écouteurs sur les boutons d'achat principaux (.buy)
const buyButtons = document.querySelectorAll('.buy');

buyButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        const productCard = event.target.closest('.items');

        const stockElement = productCard.querySelector('.stock-status');
        const nameElement = productCard.querySelector('.card-subtitle');
        const priceElement = productCard.querySelector('.amont');

        const stockText = stockElement.textContent;
        const nameText = nameElement.textContent;
        const priceText = priceElement.textContent;

        const priceClean = priceText.replace('$', '').replace(',', '').trim();

        const stock = parseInt(stockText);
        const name = nameText.replace(/\s+/g, ' ').trim();
        const price = parseFloat(priceClean);

        // VÉRIFICATION DU STOCK : Si stock <= 0, on stop
        if (stock <= 0) {
            button.disabled = true;
            button.textContent = "SOLD OUT";
            return;
        }

        const productDetails = {
            piece: name,
            price: price,
            stock: stock,
            card: productCard
        };

        showConfirmationModal(productDetails);
    });
});

// 1. Modale de confirmation
function showConfirmationModal(productData) {
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('confirmation-modal-overlay');

    modalOverlay.innerHTML = `
        <div class="confirmation-modal-card">
            <h2>Confirm Your Purchase</h2>
            <p>Item: <strong>${productData.piece}</strong></p>
            <p>Price: <strong>$${productData.price}</strong></p>
            <p>Available Stock: <strong>${productData.stock}</strong></p>

            <div class="modal-actions">
                <button id="btn-buy-now" class="modal-btn buy-now">Buy Now</button>
                <button id="btn-add-cart" class="modal-btn add-cart">Add to Cart</button>
                <button id="btn-cancel" class="modal-btn cancel">Cancel</button>
            </div>
        </div>
    `;

    document.body.appendChild(modalOverlay);

    const cancelButton = modalOverlay.querySelector('#btn-cancel');
    const confirmBuyButton = modalOverlay.querySelector('#btn-buy-now');
    const addToCartButton = modalOverlay.querySelector('#btn-add-cart');

    cancelButton.addEventListener('click', () => {
        modalOverlay.remove();
    });

    // Achat direct dans la modale
    confirmBuyButton.addEventListener('click', () => {
        if (productData.stock > 0) {
            productData.stock--;
            const stockElement = productData.card.querySelector('.stock-status');
            const buyButton = productData.card.querySelector('.buy');

            if (productData.stock === 0) {
                stockElement.textContent = "No more pieces left";
                buyButton.textContent = "SOLD OUT";
                buyButton.disabled = true;
            } else {
                stockElement.textContent = `${productData.stock} pieces left`;
            }

            const modalCard = modalOverlay.querySelector('.confirmation-modal-card');
            modalCard.innerHTML = `
                <h2>Order Confirmed!</h2>
                <p>Thank you for choosing Mangata & Gallo.</p>
                <p>Your order for <strong>${productData.piece}</strong> has been placed.</p>
                <button id="btn-close-success" class="modal-btn">Close</button>
            `;

            modalCard.querySelector('#btn-close-success').addEventListener('click', () => {
                modalOverlay.remove();
            });
        }
    });

    // Ajouter au panier depuis la modale
    addToCartButton.addEventListener('click', () => {
        const existingItem = cart.find(item => item.piece === productData.piece);

        if (existingItem) {
            const futureQuantity = existingItem.quantity + 1;
            const userAgreed = confirm(`This piece: ${existingItem.piece} exists already in your cart. Do you want to buy it ${futureQuantity} times?`);

            if (userAgreed) {
                existingItem.quantity += 1;
            }
        } else {
            cart.push({ piece: productData.piece, price: productData.price, quantity: 1 });
        }

        updateCartBadge();
        modalOverlay.remove();
    });
}

// 3. Affichage du tiroir / panneau latéral du panier
function renderCartSidebar() {
    const existingCart = document.querySelector('.cart-drawer-overlay');
    if (existingCart) {
        existingCart.remove();
    }

    const cartModal = document.createElement('div');
    cartModal.classList.add('cart-drawer-overlay');

    if (cart.length === 0) {
        cartModal.innerHTML = `
            <div class="cart-content-container">
                <h2>Your Shopping Cart</h2>
                <p>Your cart is empty.</p>
                <button class="close-cart">Close</button>
            </div>
        `;
    } else {
        let itemsHTML = '';

        cart.forEach(item => {
            itemsHTML += `
                <div class="cart-item">
                    <p class="piece-name">Piece: <strong>${item.piece}</strong></p>
                    <p>Price: $${item.price}</p>
                    <div class="quantity-controls">
                        <button class="btn-decrease" data-name="${item.piece}">-</button>
                        <span>Quantity: ${item.quantity}</span>
                        <button class="btn-increase" data-name="${item.piece}">+</button>
                    </div>
                    <p>Subtotal: <strong>$${item.price * item.quantity}</strong></p>
                </div>
            `;
        });

        const grandTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartModal.innerHTML = `
            <div class="cart-content-container">
                <h2>Your Shopping Cart</h2>
                <div class="cart-items-list">
                    ${itemsHTML}
                </div>
                <div class="cart-footer">
                    <h3>Grand Total: $${grandTotal}</h3>
                    <button class="checkout-btn">Checkout</button>
                    <button class="close-cart">Close</button>
                </div>
            </div>
        `;
    }

    document.body.appendChild(cartModal);

    // Écouteur pour fermer
    const closure = cartModal.querySelector('.close-cart');
    closure.addEventListener('click', () => {
        cartModal.remove();
    });

    // Écouteurs pour le bouton (+)
    const increaseButtons = cartModal.querySelectorAll('.btn-increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const pieceName = e.target.getAttribute('data-name');
            const targetItem = cart.find(item => item.piece === pieceName);

            if (targetItem) {
                targetItem.quantity += 1;
                updateCartBadge();
                renderCartSidebar();
            }
        });
    });

    // Écouteurs pour le bouton (-)
    const decreaseButtons = cartModal.querySelectorAll('.btn-decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const pieceName = e.target.getAttribute('data-name');
            const targetItem = cart.find(item => item.piece === pieceName);

            if (targetItem) {
                targetItem.quantity -= 1;

                if (targetItem.quantity <= 0) {
                    cart = cart.filter(item => item.piece !== pieceName);
                }

                updateCartBadge();
                renderCartSidebar();
            }
        });
    });

    // Écouteur pour le Checkout
    const checkoutBtn = cartModal.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Order placed successfully!');
            cart = [];
            updateCartBadge();
            cartModal.remove();
        });
    }
}

// 4. ATTACHEMENT DE L'ÉCOUTEUR SUR L'ICÔNE DU PANIER
const cartContainer = document.querySelector('.cart-icon-wrapper');
if (cartContainer) {
    cartContainer.addEventListener('click', () => {
        renderCartSidebar();
    });
}