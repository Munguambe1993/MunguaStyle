let products = [
    { name: "T-shirt Street", price: 1200, category: "roupa", img: "produtos/t-shirt.jpg", desc: "T-shirt confortável de algodão, estilo urbano." },
    { name: "Calça Jeans", price: 2100, category: "roupa", img: "produtos/jeans.jpg", desc: "Calça jeans resistente e moderna." },
    { name: "Ténis Moderno", price: 3000, category: "calcado", img: "produtos/tenis.jpg", desc: "Ténis leve e estiloso para o dia-a-dia." },
    { name: "Vestido Casual", price: 2050, category: "roupa", img: "produtos/vestido.jpg", desc: "Vestido casual elegante para ocasiões especiais." }
];

let cart = [];
let selectedProduct = null;
let metodoSelecionado = "";

// Renderizar produtos com verificação de segurança para o GitHub
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
    
    let container = document.getElementById("products");
    if (container) {
        container.innerHTML = html;
    }
}

// Abrir modal corrigido para não quebrar no GitHub
function openProduct(name) {
    let p = products.find(x => x.name === name);
    if (!p) return;
    
    selectedProduct = p;
    
    let img = document.getElementById("modalImg");
    let nameElem = document.getElementById("modalName");
    let priceElem = document.getElementById("modalPrice");
    let descElem = document.getElementById("modalDesc");
    let qtyElem = document.getElementById("qty");
    let modal = document.getElementById("productModal");

    if (img) img.src = p.img;
    if (nameElem) nameElem.innerText = p.name;
    if (priceElem) priceElem.innerText = p.price + " MZN";
    if (descElem) descElem.innerText = p.desc;
    if (qtyElem) qtyElem.value = 1; 
    
    if (modal) modal.classList.remove("hidden");
}

// Fechar modal
function closeModal() {
    let modal = document.getElementById("productModal");
    if (modal) modal.classList.add("hidden");
}

// Adicionar ao carrinho
function confirmAdd() {
    if (!selectedProduct) return;
    
    let qtyElem = document.getElementById("qty");
    let qty = qtyElem ? parseInt(qtyElem.value) : 1;
    
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
    
    let cartItems = document.getElementById("cart-items");
    let totalElem = document.getElementById("total");
    let cartCount = document.getElementById("cart-count");

    if (cartItems) cartItems.innerHTML = html;
    if (totalElem) totalElem.innerText = total;
    if (cartCount) cartCount.innerText = cart.length;

    if (cart.length === 0) {
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
    let panel = document.getElementById("cart-panel");
    if (panel) {
        panel.classList.toggle("hidden");
    }
    resetFluxoPagamento();
}

// --- FLUXO DE PAGAMENTO COMPLETO ---
function resetFluxoPagamento() {
    let flow = document.getElementById("payment-flow");
    let inputs = document.getElementById("payment-inputs");
    let btnPay = document.getElementById("btn-ir-pagamento");

    if (flow) flow.classList.add("hidden");
    if (inputs) inputs.classList.add("hidden");
    if (btnPay) btnPay.classList.remove("hidden");
    metodoSelecionado = "";
}

function mostrarOpcoesPagamento() {
    if (cart.length === 0) {
        alert("⚠️ A sua carrinha está vazia!");
        return;
    }
    let flow = document.getElementById("payment-flow");
    let btnPay = document.getElementById("btn-ir-pagamento");

    if (flow) flow.classList.remove("hidden");
    if (btnPay) btnPay.classList.add("hidden");
}

function selecionarMetodo(metodo) {
    metodoSelecionado = metodo;
    
    let inputsBox = document.getElementById("payment-inputs");
    if (inputsBox) inputsBox.classList.remove("hidden");
    
    let title = document.getElementById("payment-title");
    let mobileFields = document.getElementById("mobile-wallet-fields");
    let visaFields = document.getElementById("visa-fields");

    if (mobileFields) mobileFields.classList.add("hidden");
    if (visaFields) visaFields.classList.add("hidden");
    
    let phoneInput = document.getElementById("phone-number");
    let cardInput = document.getElementById("card-number");
    let cvvInput = document.getElementById("card-cvv");
    let pinInput = document.getElementById("card-pin");

    if (phoneInput) phoneInput.value = "";
    if (cardInput) cardInput.value = "";
    if (cvvInput) cvvInput.value = "";
    if (pinInput) pinInput.value = "";

    if (metodo === 'mpesa' && title && mobileFields) {
        title.innerText = "Pagamento via M-Pesa (Vodacom)";
        mobileFields.classList.remove("hidden");
    } else if (metodo === 'emola' && title && mobileFields) {
        title.innerText = "Pagamento via e-Mola (Movitel)";
        mobileFields.classList.remove("hidden");
    } else if (metodo === 'mcash' && title && mobileFields) {
        title.innerText = "Pagamento via mKesh (Tmcel)";
        mobileFields.classList.remove("hidden");
    } else if (metodo === 'visa' && title && visaFields) {
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
        let telefone = document.getElementById("phone-number").value.trim();
        
        if (telefone.length !== 9) {
            alert("❌ O número de telefone deve ter 9 dígitos.");
            return;
        }

        let prefixo2 = telefone.substring(0, 2);

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

    alert("🎉 Compra efetuada com sucesso!");
    cart = [];
    updateCart();
    toggleCart();
}

// --- FUNÇÕES DE GESTORES ---
function loginGestor() {
    let userElem = document.getElementById("loginUser");
    let passElem = document.getElementById("loginPass");
    
    let user = userElem ? userElem.value : "";
    let pass = passElem ? passElem.value : "";
    
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
    let searchInput = document.getElementById("search");
    if (!searchInput) return;
    
    let val = searchInput.value.toLowerCase();
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

// Inicialização segura ativada ao carregar a página por completo
document.addEventListener("DOMContentLoaded", () => {
    let orderNumElem = document.getElementById("orderNumber");
    if (orderNumElem) {
        orderNumElem.innerText = "ORD-" + Date.now();
    }
    
    renderProducts();
    
    let cartIcon = document.getElementById("cartIcon");
    if (cartIcon) {
        cartIcon.addEventListener("click", toggleCart);
    }
});<!DOCTYPE html>
<html lang="pt">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MunguaStyle</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>

<header class="hero">
    <div class="overlay">
        <h1>MunguaStyle</h1>
        <p>Moda Jovem em Moçambique</p>
    </div>
</header>

<nav class="nav">
    <div class="nav-left">
        <input type="text" id="search" placeholder="Pesquisar..." onkeyup="searchProduct()">
        <select onchange="filterCategory(this.value)">
            <option value="all">Todas</option>
            <option value="roupa">Roupas</option>
            <option value="calcado">Calçados</option>
        </select>
    </div>

    <div class="nav-right">
        <div class="cart-icon" id="cartIcon">
            🛒 <span id="cart-count">0</span>
        </div>

        <div class="gestor-login-box">
            <input type="text" id="loginUser" placeholder="Gestor (Usuário)">
            <input type="password" id="loginPass" placeholder="Senha">
            <button onclick="loginGestor()">Entrar</button>
            <span class="register-text" onclick="abrirCadastroGestor()">Inscrição</span>
        </div>
    </div>
</nav>

<section id="products" class="products"></section>

<div id="productModal" class="modal hidden">
    <div class="modal-content">
        <span class="close" onclick="closeModal()">✖</span>
        <img id="modalImg" alt="Produto">
        <h3 id="modalName"></h3>
        <p id="modalPrice"></p>
        <p id="modalDesc"></p>
        <label for="qty">Quantidade</label>
        <input type="number" id="qty" value="1" min="1">
        <button onclick="confirmAdd()">Adicionar ao carrinho</button>
    </div>
</div>

<section id="cart-panel" class="cart hidden">
    <h2>🛒 Carrinho</h2>
    <p><b>Encomenda Nº:</b> <span id="orderNumber"></span></p>
    
    <ul id="cart-items"></ul>
    <p>Total: <b id="total">0</b> MZN</p>

    <div id="checkout-section">
        <button id="btn-ir-pagamento" onclick="mostrarOpcoesPagamento()">Ir para o Pagamento</button>
        
        <div id="payment-flow" class="hidden">
            <h3>Formas de Pagamento</h3>
            <div class="payment-options">
                <button onclick="selecionarMetodo('mpesa')">M-Pesa</button>
                <button onclick="selecionarMetodo('emola')">e-Mola</button>
                <button onclick="selecionarMetodo('mcash')">mKesh</button>
                <button onclick="selecionarMetodo('visa')">Cartão Visa</button>
            </div>

            <div id="payment-inputs" class="hidden">
                <h4 id="payment-title"></h4>
                
                <div id="mobile-wallet-fields" class="hidden">
                    <label for="phone-number">Número de Telefone:</label>
                    <input type="text" id="phone-number" placeholder="Ex: 84XXXXXXX" maxlength="9">
                </div>

                <div id="visa-fields" class="hidden">
                    <label for="card-number">Número do Cartão:</label>
                    <input type="text" id="card-number" placeholder="0000 0000 0000 0000" maxlength="16">
                    
                    <div style="display: flex; gap: 10px; margin-top: 5px;">
                        <div>
                            <label for="card-cvv">CVV:</label>
                            <input type="text" id="card-cvv" placeholder="123" maxlength="3" style="width: 65px;">
                        </div>
                        <div>
                            <label for="card-pin">PIN do Cartão:</label>
                            <input type="password" id="card-pin" placeholder="****" maxlength="4" style="width: 85px;">
                        </div>
                    </div>
                </div>

                <button id="btn-finalizar" onclick="processarPagamentoFinal()">Confirmar e Pagar</button>
            </div>
        </div>
    </div>
</section>

<footer class="footer">
    <p>&copy; 2026 MunguaStyle. Todos os direitos reservados. Moda Jovem em Moçambique.</p>
</footer>

<script src="js/script.js"></script>
</body>
</html>
