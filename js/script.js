let products = [

    {
        name: "T-shirt Street",
        price: 1200,
        category: "roupa",
        img: "produtos/t-shirt.jpg",
        desc: "T-shirt confortável de algodão."
    },

    {
        name: "Calça Jeans",
        price: 2100,
        category: "roupa",
        img: "produtos/jeans.jpg",
        desc: "Calça jeans moderna."
    },

    {
        name: "Ténis Moderno",
        price: 3000,
        category: "calcado",
        img: "produtos/tenis.jpg",
        desc: "Ténis leve e estiloso."
    },

    {
        name: "Vestido Casual",
        price: 2500,
        category: "roupa",
        img: "produtos/vestido.jpg",
        desc: "Vestido elegante."
    }

];

let cart = [];

let selectedProduct = null;

let metodoSelecionado = "";

/* RENDER PRODUTOS */

function renderProducts(lista = products){

    const container =
    document.getElementById("products");

    let html = "";

    lista.forEach(produto => {

        html += `

        <div class="product"
        onclick="openProduct('${produto.name}')">

            <img src="${produto.img}">

            <h3>${produto.name}</h3>

            <p>${produto.price} MZN</p>

        </div>

        `;

    });

    container.innerHTML = html;

}

/* ABRIR PRODUTO */

function openProduct(nome){

    const produto =
    products.find(p => p.name === nome);

    selectedProduct = produto;

    document.getElementById("modalImg").src =
    produto.img;

    document.getElementById("modalName").innerText =
    produto.name;

    document.getElementById("modalPrice").innerText =
    produto.price + " MZN";

    document.getElementById("modalDesc").innerText =
    produto.desc;

    document.getElementById("productModal")
    .classList.remove("hidden");

}

/* FECHAR MODAL */

function closeModal(){

    document.getElementById("productModal")
    .classList.add("hidden");

}

/* ADICIONAR */

function confirmAdd(){

    const qty =
    parseInt(
        document.getElementById("qty").value
    );

    const existente =
    cart.find(
        item => item.name === selectedProduct.name
    );

    if(existente){

        existente.qty += qty;

    }else{

        cart.push({
            ...selectedProduct,
            qty
        });

    }

    updateCart();

    closeModal();

    showToast("Produto adicionado ao carrinho");

}

/* UPDATE CARRINHO */

function updateCart(){

    const cartItems =
    document.getElementById("cart-items");

    let html = "";

    let total = 0;

    cart.forEach((item,index)=>{

        total += item.price * item.qty;

        html += `

        <li>

            ${item.qty}x ${item.name}

            - ${item.price * item.qty} MZN

            <button onclick="removeItem(${index})">
                ❌
            </button>

        </li>

        `;

    });

    cartItems.innerHTML = html;

    document.getElementById("total")
    .innerText = total;

    document.getElementById("cart-count")
    .innerText = cart.length;

}

/* REMOVER */

function removeItem(index){

    cart.splice(index,1);

    updateCart();

}

/* PESQUISA */

function pesquisarProdutos(){

    const valor =
    document.getElementById("search")
    .value
    .toLowerCase();

    const filtrados =
    products.filter(produto =>

        produto.name
        .toLowerCase()
        .includes(valor)

    );

    renderProducts(filtrados);

}

/* HERO */

function irProdutos(){

    document.getElementById("products")
    .scrollIntoView({
        behavior:"smooth"
    });

}

/* TOAST */

function showToast(msg){

    const toast =
    document.createElement("div");

    toast.className = "toast";

    toast.innerText = msg;

    document.body.appendChild(toast);

    setTimeout(()=>{

        toast.remove();

    },3000);

}

/* FECHAR CARRINHO */

function fecharCarrinho(){

    const cartPanel =
    document.getElementById("cart-panel");

    if(cartPanel){

        cartPanel.classList.add("hidden");

    }

}

/* ABRIR CARRINHO */

function abrirCarrinho(){

    const painel =
    document.getElementById("cart-panel");

    if(painel){

        painel.classList.remove("hidden");

    }

}

/* MOSTRAR PAGAMENTO */

function mostrarPagamento(){

    if(cart.length === 0){

        alert("O carrinho está vazio!");

        return;

    }

    const paymentBox =
    document.getElementById("payment-box");

    if(paymentBox){

        paymentBox.classList.remove("hidden");

    }

}

/* SELECIONAR METODO */

function selecionarMetodo(metodo){

    metodoSelecionado = metodo;

    const form =
    document.getElementById("payment-form");

    const telefoneBox =
    document.getElementById("telefone-box");

    const cartaoBox =
    document.getElementById("cartao-box");

    const titulo =
    document.getElementById("payment-title");

    form.classList.remove("hidden");

    telefoneBox.classList.add("hidden");

    cartaoBox.classList.add("hidden");

    if(metodo === "visa"){

        titulo.innerText =
        "Pagamento com Cartão";

        cartaoBox.classList.remove("hidden");

    }else{

        titulo.innerText =
        "Pagamento via " + metodo;

        telefoneBox.classList.remove("hidden");

    }

}

/* ENVIAR CODIGO */

function enviarCodigo(){

    if(metodoSelecionado === "visa"){

        const numero =
        document.getElementById("numero-cartao").value;

        const validade =
        document.getElementById("validade-cartao").value;

        const cvv =
        document.getElementById("cvv-cartao").value;

        if(
            numero === "" ||
            validade === "" ||
            cvv === ""
        ){

            alert("Preencha os dados do cartão!");

            return;

        }

    }else{

        const telefone =
        document.getElementById("telefone").value;

        if(telefone === ""){

            alert("Introduza o número!");

            return;

        }

    }

    alert("Código enviado com sucesso!");

    document.getElementById("otp-box")
    .classList.remove("hidden");

}

/* CONFIRMAR */

function confirmarPagamento(){

    const otp =
    document.getElementById("otp").value;

    if(otp === ""){

        alert("Introduza o código!");

        return;

    }

    alert("Pagamento confirmado com sucesso!");

    cart = [];

    updateCart();

    document.getElementById("payment-box")
    .classList.add("hidden");

    fecharCarrinho();

}
/* WHATSAPP */

function enviarWhatsApp(){

    if(cart.length === 0){

        alert("Carrinho vazio!");

        return;

    }

    let mensagem =
    "🛍️ *NOVO PEDIDO - MunguaStyle*%0A%0A";

    let total = 0;

    cart.forEach(item => {

        mensagem +=
        "• " +
        item.qty +
        "x " +
        item.name +
        " - " +
        (item.price * item.qty) +
        " MZN%0A";

        total += item.price * item.qty;

    });

    mensagem +=
    "%0A💰 *TOTAL:* " +
    total +
    " MZN";

    const numero =
    "258872351863";

    const url =
    "https://wa.me/" +
    numero +
    "?text=" +
    mensagem;

    window.open(url, "_blank");

}
/* EVENTO */

document.getElementById("cartIcon")
.addEventListener("click", abrirCarrinho);

/* INICIAR */

renderProducts();
