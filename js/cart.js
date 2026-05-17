let cart = [];

function confirmAdd(){

    let qty = parseInt(document.getElementById("qty").value);

    let existing = cart.find(i => i.name === selectedProduct.name);

    if(existing){
        existing.qty += qty;
    }else{
        cart.push({ ...selectedProduct, qty });
    }

    updateCart();

    closeModal();
}

function updateCart(){

    let html = "";
    let total = 0;

    cart.forEach((item,index) => {

        total += item.price * item.qty;

        html += `
        <li>
            ${item.name} - ${item.qty}x
            <button onclick="removeItem(${index})">❌</button>
        </li>
        `;
    });

    document.getElementById("cart-items").innerHTML = html;
    document.getElementById("total").innerText = total;
    document.getElementById("cart-count").innerText = cart.length;
}

function removeItem(index){
    cart.splice(index,1);
    updateCart();
}

document.getElementById("cartIcon").addEventListener("click", () => {
    document.getElementById("cart-panel").classList.toggle("hidden");
});