let products = [

    {
        name: "T-shirt Street",
        price: 1200,
        category: "roupa",
        img: "./produtos/t-shirt.jpg",
        desc: "T-shirt confortável de algodão."
    },

    {
        name: "Calça Jeans",
        price: 2100,
        category: "roupa",
        img: "./produtos/jeans.jpg",
        desc: "Calça jeans moderna."
    },

    {
        name: "Ténis Moderno",
        price: 3000,
        category: "calcado",
        img: "./produtos/tenis.jpg",
        desc: "Ténis leve e estiloso."
    },

    {
        name: "Vestido Casual",
        price: 2500,
        category: "roupa",
        img: "./produtos/vestido.jpg",
        desc: "Vestido elegante."
    }

];

let cart = [];
let selectedProduct = null;

/* RENDERIZAR PRODUTOS */

function renderProducts(lista = products){

    const container = document.getElementById("products");

    let html = "";

    lista.forEach(produto => {

        html += `

        <div class="product"
        onclick="openProduct('${produto.name}')">

            <img src="${produto.img}" alt="${produto.name}">

            <h3>${produto.name}</h3>

            <p>${produto.price} MZN</p>

        </div>

        `;

    });

    container.innerHTML = html;

}

/* ABRIR MODAL */

function openProduct(nome){

    const produto = products.find(p => p.name === nome);

    selectedProduct = produto;

    document.getElementById("modalImg").src = produto.img;

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

/* ADICIONAR AO CARRINHO */

function confirmAdd(){

    const qty =
    parseInt(document.getElementById("qty").value);

    const existente =
    cart.find(item => item.name === selectedProduct.name);

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

/* ATUALIZAR CARRINHO */

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

/* REMOVER ITEM */

function removeItem(index){

    cart.splice(index,1);

    updateCart();

}

/* TOGGLE CARRINHO */

document.getElementById("cartIcon")
.addEventListener("click",()=>{

    document.getElementById("cart-panel")
    .classList.toggle("hidden");

});

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

/* BOTAO HERO */

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
function fecharCarrinho() {
    const cartPanel = document.getElementById("cart-panel");

    if(cartPanel){
        cartPanel.classList.add("hidden");
    }
}

/* INICIAR */

renderProducts();
