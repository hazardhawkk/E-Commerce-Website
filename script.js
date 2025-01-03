// Dark mode functionality
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

const enableDarkmode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkmode', 'active');
};

const disableDarkmode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
};

if (darkmode === "active") enableDarkmode();

// Event listener for theme toggle button
themeSwitch.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default button behavior
    darkmode = localStorage.getItem('darkmode');
    darkmode !== "active" ? enableDarkmode() : disableDarkmode();
});

// Size button functionality
document.querySelectorAll('.size-buttons').forEach(buttonGroup => {
    buttonGroup.addEventListener('click', event => {
        if (event.target.classList.contains('size')) {
            // Remove 'selected' class from all buttons in the group
            buttonGroup.querySelectorAll('.size').forEach(button => {
                button.classList.remove('selected');
            });
            // Add 'selected' class to the clicked button
            event.target.classList.add('selected');
        }
    });
});

// Basket functionality and product page interaction
let listProducts = [
    {
        "name": "Canada Goose Bomber",
        "price": 1375,
        "image": "img/product1grey.png"
    },
    {
        "name": "Moncler Jacket",
        "price": 765,
        "image": "img/product2black.png"
    },
    {
        "name": "The North Face Puffer",
        "price": 315,
        "image": "img/product3cream.png"
    }
];

// Get items from local storage to retain basket on page refresh
let basketItems = JSON.parse(localStorage.getItem("basketItems")) || [];

const addToCart = (productName, size) => {
    let positionThisProductInBasket = basketItems.findIndex((value) => value.productName == productName && value.size == size);
    if (basketItems.length <= 0) { // Basket is empty
        basketItems = [{
            productName: productName,
            quantity: 1,
            size: size
        }];
    } else if (positionThisProductInBasket < 0) { // Basket is not empty but product doesn't exist
        basketItems.push({
            productName: productName,
            quantity: 1,
            size: size
        });
    } else { // Basket is not empty and product exists
        basketItems[positionThisProductInBasket].quantity = basketItems[positionThisProductInBasket].quantity + 1;
    }
    addCartToMemory();
    console.log(basketItems);
};

const addCartToHTML = () => {
    const listBasketHTML = document.querySelector('.basket-container');
    listBasketHTML.innerHTML = '';
    if (basketItems.length > 0) {
        basketItems.forEach(basketItem => {
            let newBasket = document.createElement('div');
            newBasket.classList.add('item');
            newBasket.dataset.productName = basketItem.productName;
            newBasket.dataset.size = basketItem.size;
            let positionProduct = listProducts.findIndex((value) => value.name == basketItem.productName);
            let info = listProducts[positionProduct];
            newBasket.innerHTML = `
                <img src="${info.image}" alt="">
                <div class="name">${info.name}</div>
                <div class="price">£${info.price * basketItem.quantity}</div>
                <div>${basketItem.size}</div>
                <div class="quantity">
                    <span class="minus"> < </span>
                    <span>${basketItem.quantity}</span>
                    <span class="plus"> > </span>
                </div>  
            `;
            listBasketHTML.appendChild(newBasket);
        });
    } else if (basketItems.length == 0) {
        document.querySelector('.section-p1').innerHTML += `
        <h8 class = "empty-basket-message">Your basket is empty!</h8>
        `;
    }
};

const changeQuantity = (productName, size, type) => {
    let positionItemInBasket = basketItems.findIndex((value) => value.productName == productName && value.size == size);
    if (positionItemInBasket >= 0) {
        switch (type) {
            case 'plus':
                basketItems[positionItemInBasket].quantity = basketItems[positionItemInBasket].quantity + 1;
                break;
            default:
                let valueChange = basketItems[positionItemInBasket].quantity - 1;
                if (valueChange > 0) {
                    basketItems[positionItemInBasket].quantity = valueChange;
                } else {
                    basketItems.splice(positionItemInBasket, 1);
                }
                break;
        }
    }
    addCartToMemory();
    addCartToHTML(); // Refresh data on screen
};

// Save to local storage
const addCartToMemory = () => {
    localStorage.setItem('basketItems', JSON.stringify(basketItems));
};

if (window.location.pathname.includes("/product")) {
    let listProductHTML = document.querySelector('.product-container');
    //event listener for add to basket buttons
    listProductHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('add-to-basket')) {
            let productCard = positionClick.closest('.product-card');
            let productName = productCard.querySelector('h3').textContent.trim();
            let sizeButton = productCard.querySelector('.size.selected');
            if (!sizeButton) {
                alert('Please select a size before adding to the basket.');
                return;
            }
            let size = sizeButton.dataset.size;
            alert(`Product added: ${productName}`);
            addToCart(productName, size);
        }
    });
}

if (window.location.pathname.includes("/basket")) {
    let listBasketHTML = document.querySelector('.basket-container');
    addCartToHTML(); // Call after data is fetched
    //event listener for changing quantity
    listBasketHTML.addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
            let productName = positionClick.parentElement.parentElement.dataset.productName;
            let size = positionClick.parentElement.parentElement.dataset.size;
            let type = 'minus';
            if (positionClick.classList.contains('plus')) {
                type = 'plus';
            }
            changeQuantity(productName, size, type);
        }
    });

    document.querySelector('.check-out-button').addEventListener('click', (event) => {
        let positionClick = event.target;
        if (positionClick.classList.contains('check-out-button')) {
            if (basketItems.length == 0) {
                alert('Your Basket is Empty, Navigate Back to the Products Page');
            } else {
                window.location.href = "/checkout";
            }
        }
    });
}

// Checkout submit order functionality
document.getElementById("submit-btn").addEventListener("click", function () {
    const confirmationMessage = document.getElementById("confirmation-message");

    const fullName = document.getElementById("fullName").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const zip = document.getElementById("zip").value.trim();

    if (fullName && address && city && zip) {
        confirmationMessage.textContent = "Order Confirmed.";
    } else {
        confirmationMessage.textContent = "Please fill in all fields.";
        confirmationMessage.style.color = "red";
    }
});

// Open the products page when the "Shop Now" button is clicked
document.querySelector("#herobanner button").addEventListener("click", function () {
    window.open("{{ route('products') }}", '_blank');
});
