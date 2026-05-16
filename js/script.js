let products = [
    { name: "T-shirt Street", price: 1200, category: "roupa", img: "produtos/t-shirt.jpg", desc: "T-shirt confortável de algodão, estilo urbano." },
    { name: "Calça Jeans", price: 2100, category: "roupa", img: "produtos/jeans.jpg", desc: "Calça jeans resistente e moderna." },
    { name: "Ténis Moderno", price: 3000, category: "calcado", img: "produtos/tenis.jpg", desc: "Ténis leve e estiloso para o dia-a-dia." },
    { name: "Vestido Casual", price: 2050, category: "roupa", img: "produtos/vestido.jpg", desc: "Vestido casual elegante para ocasiões especiais." }
];

let cart = [];
let selectedProduct = null;

function renderProducts(list = products) {
    let html = "";
    list.forEach(p => {
        html += `
        <div class="product" onclick="openProduct('${p.name}')">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <p>${p.price} MZN</p>
            <div class="stars">⭐⭐⭐⭐⭐</div>
        </div>`;
    });
    document.getElementById("products").innerHTML = html;
}

function openProduct(name) {
    let p = products.find(x => x.name === name);
    selectedProduct = p;
    document.getElementById("modalImg").src = p.img;
    document.getElementById("modalName").innerText = p.name;
    document.getElementById("modalPrice").innerText = p.price + " MZN";
    document.getElementById("modalDesc").innerText = p.desc;
    document.getElementById("productModal").classList.remove("hidden");
}

function closeModal() {
    document.getElementById("productModal").classList.add("hidden");
}

function confirmAdd() {
    let qty = parseInt(document.getElementById("qty").value);
    let existing = cart.find(i => i.name === selectedProduct.name);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ ...selectedProduct, qty });
    }
    updateCart();
    closeModal();
    showToast("✅ Produto adicionado ao carrinho!");
}

function updateCart() {
    let total = 0;
    let html = "";
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
        <li>
            ${item.name} 
            <button onclick="changeQty(${index}, -1)">➖</button>
            ${item.qty}
            <button onclick="changeQty(${index}, 1)">➕</button>
            = ${item.price * item.qty} MZN
            <button onclick="removeItem(${index})">❌</button>
        </li>`;
    });
    document.getElementById("cart-items").innerHTML = html;
    document.getElementById("total").innerText = total;
}

function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

function pay() {
    let number = document.getElementById("mpesa").value;
    if (!/^[0-9]{9}$/.test(number) || cart.length === 0) {
        alert("⚠️ Número M-Pesa inválido ou carrinho vazio!");
        return;
    }
    alert("✅ Pagamento realizado com sucesso!");
    cart = [];
    updateCart();
    document.getElementById("mpesa").value = "";
}

function searchProduct() {
    let val = document.getElementById("search").value.toLowerCase();
    let filtered = products.filter(p => p.name.toLowerCase().includes(val));
    renderProducts(filtered);
}

function filterCategory(cat) {
    if (cat === "all") return renderProducts();
    let filtered = products.filter(p => p.category === cat);
    renderProducts(filtered);
}

function showToast(msg) {
    let toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.remove(); }, 2500);
}

// Inicializar
renderProducts();
