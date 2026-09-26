const buyButtons = document.querySelectorAll('.buy');
buyButtons.forEach((button) =>{
    button.addEventListener('click',(event) => {
        const currentButton = event.target.closest('.items');
        console.log(currentButton);
    })
})
