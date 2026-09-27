let cart = [];

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

    addToCartButton.addEventListener('click',(event) => {
        /*seak the current element added in the cart*/
        const existingItem = cart.find(item => item.piece === productData.piece);
        
        /*apply some rules before update*/
        if (existingItem) {
            existingItem.quantity +=1;
        } else {
            cart.push({piece: productData.piece, price: productData.price, quantity:1})
        }

        /*select the count on the cart to get some information*/
        const badgeElement = document.querySelector('.cart-count');

        /*calculate the total quantity of all articles in the count*/
        let totalCount =0;
        cart.forEach(item => {totalCount += item.quantity;})

        /*update the count by rewriting the new number calculated*/
        badgeElement.textContent = totalCount;

        /*close the modal overlay after the oparation*/
        modalOverlay.remove();
    })
}

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
        const productDetails = {
            piece: name,
            price: price,
            stock: stock,
            card: productCard
        };
        
        showConfirmationModal(productDetails);
    });
});
