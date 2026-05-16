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
    
    let container = document.getElementById("products");
    if (container) {
        container.innerHTML = html;
    }
}

// Abrir modal
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
    if (qtyElem) qtyElem.value = 1; // Reseta para 1 de forma segura
    
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

    // Se o carrinho ficar vazio, esconde a área de pagamentos
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
    // Sempre que abrir/fechar, reseta o fluxo para o cliente verificar primeiro
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

    // Reset de campos com proteção contra nulos
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

// Filtro de categoria
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

// Inicialização segura com o DOM carregado
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
});
