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
            stockElement.textContent = `${productData.stock} pieces left`;
        }

        // Close modal after buy
        modalOverlay.remove();
    });
}

// 2. Main Buy Buttons Listener
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

        // Object containing all details to pass to the modal function
        const productDetails = {
            piece: name,
            price: price,
            stock: stock,
            card: productCard
        };

        // Open modal
        showConfirmationModal(productDetails);
    });
});