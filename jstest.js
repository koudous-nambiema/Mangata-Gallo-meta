const allBuyButtons = document.querySelectorAll('.buy');

allBuyButtons.forEach((button) => {
    button.addEventListener('click', (event) => {
        /* Targeting a button clicked on by the user and extracting a data container (a card) */
        const buttonCards = event.target.closest('.items');

        /* Seeking specific data from the data container */
        const itemNameElement = buttonCards.querySelector('.card-subtitle');
        const itemStockElement = buttonCards.querySelector('.stock-status');
        const itemPriceElement = buttonCards.querySelector('.amont');

        /* Working on the data to make it usable */
        const itemName = itemNameElement.textContent.replace(/\s+/g, ' ').trim();
        const itemStockText = itemStockElement.textContent;
        const itemStock = parseInt(itemStockText);
        
        // Fix: read .textContent from itemPriceElement
        const itemPriceText = itemPriceElement.textContent.replace('$','').replace(' ','').replace(',','').trim();
        const itemPrice = parseFloat(itemPriceText);

        /* Create an object container of the item details */
        const itemDetails = {
            piece: itemName,
            stock: itemStock,
            price: itemPrice,
            itemSource: buttonCards
        };

        console.log(itemDetails);
    });
});


function showConfirmationModal (productCard) {
    /* create the overlay first*/
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('confirmation-modal-overlay');

    /*add html code*/
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

    /*add the overlay to the body*/
    document.body.appendChild(modalOverlay)

    const cancelButton = modalOverlay.querySelector("#btn-cancel")
    const confirmBuyButton = modalOverlay.querySelector('#btn-buy-now')

    cancelButton.addEventListener('click', () => {
        modalOverlay.remove();
    })

    confirmBuyButton.addEventListener('click', () => {
        console.log('Thanks')

        if (productData.stock > 0) {
            productData.stock -=1

            const stockElement = productData.card.querySelector('.stock-status')
            stockElement.textContent= `${productData.card} pieces left`
        }

        modalOverlay.remove()
    })

}