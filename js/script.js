let products = [
    { name: "T-shirt Street", price: 1200, category: "roupa", img: "produtos/t-shirt.jpg", desc: "T-shirt confortável de algodão, estilo urbano." },
    { name: "Calça Jeans", price: 2100, category: "roupa", img: "produtos/jeans.jpg", desc: "Calça jeans resistente e moderna." },
    { name: "Ténis Moderno", price: 3000, category: "calcado", img: "produtos/tenis.jpg", desc: "Ténis leve e estiloso para o dia-a-dia." },
    { name: "Vestido Casual", price: 2050, category: "roupa", img: "produtos/vestido.jpg", desc: "Vestido casual elegante para ocasiões especiais." }
];

let cart = [];
let selectedProduct = null;
let metodoSelecionado = "";

// Renderizar produtos
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

// Abrir modal
function openProduct(name) {
    let p = products.find(x => x.name === name);
    selectedProduct = p;
    document.getElementById("modalImg").src = p.img;
    document.getElementById("modalName").innerText = p.name;
    document.getElementById("modalPrice").innerText = p.price + " MZN";
    document.getElementById("modalDesc").innerText = p.desc;
    document.getElementById("qty").value = 1; // Reseta para 1
    document.getElementById("productModal").classList.remove("hidden");
}

// Fechar modal
function closeModal() {
    document.getElementById("productModal").classList.add("hidden");
}

// Adicionar ao carrinho
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
    showToast("✅ Produto adicionado à carrinha!");
}

// Atualizar carrinho
function updateCart() {
    let total = 0;
    let html = "";
    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
        <li>
            <b>${item.qty}x</b> ${item.name} 
            = ${item.price * item.qty} MZN
            <button onclick="removeItem(${index})">❌</button>
        </li>`;
    });
    document.getElementById("cart-items").innerHTML = html;
    document.getElementById("total").innerText = total;
    document.getElementById("cart-count").innerText = cart.length;

    // Se o carrinho ficar vazio, esconde a área de pagamentos
    if(cart.length === 0) {
        resetFluxoPagamento();
    }
}

// Remover item
function removeItem(index) {
    cart.splice(index, 1);
    updateCart();
}

// Mostrar/ocultar painel da carrinha
function toggleCart() {
    document.getElementById("cart-panel").classList.toggle("hidden");
    // Sempre que abrir/fechar, reseta o fluxo para o cliente verificar primeiro
    resetFluxoPagamento();
}

// --- FLUXO DE PAGAMENTO COMPLETO ---

function resetFluxoPagamento() {
    document.getElementById("payment-flow").classList.add("hidden");
    document.getElementById("payment-inputs").classList.add("hidden");
    document.getElementById("btn-ir-pagamento").classList.remove("hidden");
    metodoSelecionado = "";
}

function mostrarOpcoesPagamento() {
    if (cart.length === 0) {
        alert("⚠️ A sua carrinha está vazia!");
        return;
    }
    // Mostra as opções após o cliente confirmar o que está na carrinha
    document.getElementById("payment-flow").classList.remove("hidden");
    document.getElementById("btn-ir-pagamento").classList.add("hidden");
}

function selecionarMetodo(metodo) {
    metodoSelecionado = metodo;
    document.getElementById("payment-inputs").classList.remove("hidden");
    
    let title = document.getElementById("payment-title");
    let mobileFields = document.getElementById("mobile-wallet-fields");
    let visaFields = document.getElementById("visa-fields");

    // Reset de campos
    mobileFields.classList.add("hidden");
    visaFields.classList.add("hidden");
    document.getElementById("phone-number").value = "";
    document.getElementById("card-number").value = "";
    document.getElementById("card-cvv").value = "";
    document.getElementById("card-pin").value = "";

    if (metodo === 'mpesa') {
        title.innerText = "Pagamento via M-Pesa (Vodacom)";
        mobileFields.classList.remove("hidden");
    } else if (metodo === 'emola') {
        title.innerText = "Pagamento via e-Mola (Movitel)";
        mobileFields.classList.remove("hidden");
    } else if (metodo === 'mcash') {
        title.innerText = "Pagamento via mKesh (Tmcel)";
        mobileFields.classList.remove("hidden");
    } else if (metodo === 'visa') {
        title.innerText = "Pagamento via Cartão Visa";
        visaFields.classList.remove("hidden");
    }
}

function processarPagamentoFinal() {
    if (metodoSelecionado === "") return;

    if (metodoSelecionado === 'visa') {
        let numCartao = document.getElementById("card-number").value.trim();
        let cvv = document.getElementById("card-cvv").value.trim();
        let pin = document.getElementById("card-pin").value.trim();

        if (numCartao.length < 16 || cvv.length < 3 || pin.length < 4) {
            alert("❌ Por favor, preencha todos os dados do cartão corretamente (Número, CVV e PIN).");
            return;
        }
        alert("🔗 Processando pagamento via Cartão Visa... PIN validado.");
        
    } else {
        // Validação de Carteiras Móveis (M-Pesa, e-Mola, mKesh)
        let telefone = document.getElementById("phone-number").value.trim();
        
        if (telefone.length !== 9) {
            alert("❌ O número de telefone deve ter 9 dígitos.");
            return;
        }

        let prefixo2 = telefone.substring(0, 2); // Pega os 2 primeiros números

        if (metodoSelecionado === 'mpesa') {
            if (prefixo2 !== '84' && prefixo2 !== '85') {
                alert("❌ Número inválido para M-Pesa. Deve começar com 84 ou 85.");
                return;
            }
            alert("🔗 Pedido M-Pesa enviado para o número " + telefone + ". Introduza o seu PIN no telemóvel.");
        } 
        else if (metodoSelecionado === 'emola') {
            if (prefixo2 !== '86' && prefixo2 !== '87' && prefixo2 !== '88') {
                alert("❌ Número inválido para e-Mola. Deve começar com 86, 87 ou 88.");
                return;
            }
            alert("🔗 Pedido e-Mola enviado para o número " + telefone + ". Introduza o seu PIN no telemóvel.");
        } 
        else if (metodoSelecionado === 'mcash') {
            if (prefixo2 !== '82' && prefixo2 !== '83') {
                alert("❌ Número inválido para mKesh. Deve começar com 82 ou 83.");
                return;
            }
            alert("🔗 Pedido mKesh enviado para o número " + telefone + ". Introduza o seu PIN no telemóvel.");
        }
    }

    // Sucesso na compra, limpa tudo
    alert("🎉 Compra efetuada com sucesso!");
    cart = [];
    updateCart();
    toggleCart();
}

// --- FUNÇÕES DE GESTORES ---
function loginGestor() {
    let user = document.getElementById("loginUser").value;
    let pass = document.getElementById("loginPass").value;
    
    if(user === "" || pass === "") {
        alert("Por favor, preencha o usuário e a palavra-passe.");
        return;
    }
    alert("Tentativa de login para o gestor: " + user);
}

function abrirCadastroGestor() {
    alert("Redirecionando para a página/formulário de inscrição de novos Gestores...");
}

// Pesquisa e Filtros
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

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("orderNumber").innerText = "ORD-" + Date.now();
    renderProducts();
    document.getElementById("cartIcon").addEventListener("click", toggleCart);
});let products = [
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
