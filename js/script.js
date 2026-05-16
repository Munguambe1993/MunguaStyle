// Lista de produtos (ajusta os nomes e imagens conforme os ficheiros que tens na pasta "produtos")
const produtos = [
  {
    nome: "Camiseta MunguaStyle",
    preco: 500,
    imagem: "produtos/camiseta.jpg",
    descricao: "Camiseta jovem e estilosa"
  },
  {
    nome: "Tênis MunguaStyle",
    preco: 1500,
    imagem: "produtos/tenis.jpg",
    descricao: "Tênis confortável para o dia a dia"
  },
  {
    nome: "Calça MunguaStyle",
    preco: 1200,
    imagem: "produtos/calca.jpg",
    descricao: "Calça moderna e versátil"
  }
];

// Renderizar produtos na página
function renderProducts() {
  const container = document.getElementById("products");
  container.innerHTML = "";

  produtos.forEach((p, index) => {
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

// Modal de produto
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

// Carrinho
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

// Pesquisa e filtro
function searchProduct() {
  const termo = document.getElementById("search").value.toLowerCase();
  const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(termo));
  mostrarFiltrados(filtrados);
}

function filterCategory(categoria) {
  if (categoria === "all") {
    renderProducts();
  } else {
    const filtrados = produtos.filter(p => p.nome.toLowerCase().includes(categoria));
    mostrarFiltrados(filtrados);
  }
}

function mostrarFiltrados(lista) {
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

// Inicializar
document.addEventListener("DOMContentLoaded", renderProducts);
