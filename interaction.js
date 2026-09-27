let cart = [];

// 2. Main Buy Buttons Listener
const buyButtons = document.querySelectorAll('.buy');

buyButtons.forEach((button) => {
    /*before processing to anything, we need to verify the stock before.
    If stock>0, we proceed. if not, .buy button should be desactivated*/

    
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

        // Object containing all details to pass to the modal function
        var productDetails = {
            piece: name,
            price: price,
            stock: stock,
            card: productCard
        };
        
        showConfirmationModal(productDetails);
    });
});

// 1. Function defined OUTSIDE the event listener
function showConfirmationModal(productData) {
    // Create the overlay container
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('confirmation-modal-overlay'); /* Add a CSS class dynamically*/

    // Inject dynamic HTML using productData properties
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

    // Append to body so it displays on screen
    document.body.appendChild(modalOverlay);

    // Select buttons directly from inside modalOverlay
    const cancelButton = modalOverlay.querySelector('#btn-cancel');
    const confirmBuyButton = modalOverlay.querySelector('#btn-buy-now');
    const addToCartButton = modalOverlay.querySelector('#btn-add-cart');

    // Event listener to close modal
    cancelButton.addEventListener('click', () => {
        modalOverlay.remove();
    });

    // Event listener for direct buy
    confirmBuyButton.addEventListener('click', () => {
        console.log(`Thank you for purchasing ${productData.piece}. Your order has been placed!`);

        // Decrement stock in DOM
        if (productData.stock > 0) {
            productData.stock--;
            const stockElement = productData.card.querySelector('.stock-status');
            const buyButton = productData.card.querySelector('.buy');

            /*Verify immediately after decrementation*/
            if (productData.stock === 0) {
                stockElement.textContent = "No more pieces left";
                buyButton.textContent = "SOLD OUT";
                buyButton.disabled = true;
            } else {
                /*update the content on the card stock*/
                stockElement.textContent = `${productData.stock} pieces left`;
            }
        }

        // Close modal after buy
        modalOverlay.remove();
    });

    addToCartButton.addEventListener('click', (event) => {
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

        // calculate the total of the badge 

        const badgeElement = document.querySelector('.cart-count');
        let totalCount = 0;
        cart.forEach(item => { totalCount += item.quantity; });
        badgeElement.textContent = totalCount;

        // close the modale
        modalOverlay.remove();
    });
}

const cartContainer = document.querySelector('.cart-icon-wrapper');
function renderCartSidebar() {
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
                    <p>Piece: <strong>${item.piece}</strong></p>
                    <p>Price: $${item.price}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Subtotal: <strong>$${item.price * item.quantity}</strong></p>
                </div>
            `;
        });

        // Calcul du prix total global
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

    const closure = cartModal.querySelector('.close-cart');
    closure.addEventListener('click', () => {
        cartModal.remove();
    });

    // Écouteur sur le bouton de commande s'il existe dans le DOM
    const checkoutBtn = cartModal.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            alert('Order placed successfully!');
            cart = []; // On vide le panier
            document.querySelector('.cart-count').textContent = 0; // Reset du badge
            cartModal.remove();
        });
    }
}
cartContainer.addEventListener('click',() => {
    renderCartSidebar();
})



