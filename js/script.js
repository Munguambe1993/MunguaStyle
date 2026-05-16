// =====================
// Lista de Produtos
// =====================
const produtos = [
  {
    nome: "t-shirt",
    preco: 500,
    imagem: "produtos/t-shirt.jpg",
    descricao: "Camiseta jovem e estilosa"
  },
  {
    nome: "Tênis",
    preco: 1500,
    imagem: "produtos/tenis.jpg",
    descricao: "Tênis confortável para o dia a dia"
  },
  {
    nome: "Calça MunguaStyle",
    preco: 1200,
    imagem: "produtos/jeans.jpg",
    descricao: "Calça moderna e versátil"
  }
   {
    nome: "vestido",
    preco: 1200,
    imagem: "produtos/vestido.jpg",
    descricao: "Vestido casual e versátil"
  }
];

// =====================
// Renderização de Produtos
// =====================
function renderProducts(lista = produtos) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  lista.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${p.imagem}" alt="${p.nome}" onclick="abrirModal(${index})">
      <h3>${p.nome}</h3>
      <p>${p.preco} MZN</p>
      <button onclick="addToCart(${index})">Adicionar ao carrinho</button>
    `;

    container.appendChild(card);
  });
}

// =====================
// Modal de Produto
// =====================
function abrirModal(index) {
  const produto = produtos[index];
  document.getElementById("modalImg").src = produto.imagem;
  document.getElementById("modalName").textContent = produto.nome;
  document.getElementById("modalPrice").textContent = produto.preco + " MZN";
  document.getElementById("modalDesc").textContent = produto.descricao;
  document.getElementById("productModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("productModal").classList.add("hidden");
}

// =====================
// Carrinho
// =====================
let carrinho = [];

function addToCart(index) {
  const produto = produtos[index];
  carrinho.push(produto);
  atualizarCarrinho();
}

function confirmAdd() {
  const nome = document.getElementById("modalName").textContent;
  const produto = produtos.find(p => p.nome === nome);
  carrinho.push(produto);
  atualizarCarrinho();
  closeModal();
}

function atualizarCarrinho() {
  document.getElementById("cart-count").textContent = carrinho.length;
  const lista = document.getElementById("cart-items");
  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach((p) => {
    const li = document.createElement("li");
    li.textContent = `${p.nome} - ${p.preco} MZN`;
    lista.appendChild(li);
    total += p.preco;
  });

  document.getElementById("total").textContent = total;
}

// =====================
// Pesquisa e Filtro
// =====================
function searchProduct() {
  const termo = document.getElementById("search").value.toLowerCase();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  renderProducts(filtrados);
}

function filterCategory(categoria) {
  if (categoria === "all") {
    renderProducts();
  } else {
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(categoria));
    renderProducts(filtrados);
  }
}

// =====================
// Pagamento
// =====================
function mostrarOpcoesPagamento() {
  document.getElementById("payment-flow").classList.remove("hidden");
}

function selecionarMetodo(metodo) {
  document.getElementById("payment-inputs").classList.remove("hidden");
  document.getElementById("payment-title").textContent = "Pagamento via " + metodo.toUpperCase();

  document.getElementById("mobile-wallet-fields").classList.add("hidden");
  document.getElementById("visa-fields").classList.add("hidden");

  if (metodo === "mpesa" || metodo === "emola" || metodo === "mcash") {
    document.getElementById("mobile-wallet-fields").classList.remove("hidden");
  } else if (metodo === "visa") {
    document.getElementById("visa-fields").classList.remove("hidden");
  }
}

function processarPagamentoFinal() {
  const numeroPedido = "MS-" + Math.floor(Math.random() * 100000);
  document.getElementById("orderNumber").textContent = numeroPedido;
  alert("Pagamento confirmado! Encomenda Nº " + numeroPedido);
}

// =====================
// Inicialização
// =====================
document.addEventListener("DOMContentLoaded", renderProducts);
