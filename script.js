// ============================================================
// script.js — Gelato Rua 9
// ============================================================

// ---------- DADOS: array de objetos ----------
const sabores = [
  {
    id: 1,
    nome: "Pistache salgado",
    categoria: "Cremosos",
    preco: 14,
    desc: "Pistache torrado com uma pitada de sal marinho.",
  },
  {
    id: 2,
    nome: "Doce de leite",
    categoria: "Cremosos",
    preco: 12,
    desc: "Doce de leite de panela com ribbon caramelizado.",
  },
  {
    id: 3,
    nome: "Chocolate 70%",
    categoria: "Cremosos",
    preco: 13,
    desc: "Cacau intenso, pouco açúcar, textura de trufa.",
  },
  {
    id: 4,
    nome: "Limão siciliano",
    categoria: "Frutas",
    preco: 11,
    desc: "Cítrico e leve, feito sem leite.",
  },
  {
    id: 5,
    nome: "Manga com gengibre",
    categoria: "Frutas",
    preco: 11,
    desc: "Manga madura com um toque picante de gengibre.",
  },
  {
    id: 6,
    nome: "Morango do campo",
    categoria: "Frutas",
    preco: 12,
    desc: "Pedaços de morango fresco na massa.",
  },
  {
    id: 7,
    nome: "Cookies e creme",
    categoria: "Especiais",
    preco: 15,
    desc: "Base de baunilha com cookies crocantes.",
  },
  {
    id: 8,
    nome: "Café com canela",
    categoria: "Especiais",
    preco: 14,
    desc: "Café coado frio, canela e um fio de mel.",
  },
];

// Estado da página: carrinho (array) e desconto atual (número)
let carrinho = []; // cada item: { id, qtd }
let desconto = 0; // 0 a 1 (ex.: 0.1 = 10%)
let filtroAtual = "Todos";

// ---------- FUNÇÃO AUXILIAR: formata números como moeda ----------
function moeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ---------- 1. EFEITO DE DIGITAÇÃO ----------
const frase = "Sorvete bom é sorvete de verdade.";
const titulo = document.getElementById("typewriter");
let pos = 0;
function digitar() {
  if (pos < frase.length) {
    titulo.textContent += frase.charAt(pos); // acrescenta uma letra
    pos++;
    setTimeout(digitar, 70);
  }
}
digitar();

// ---------- 2. FILTRO POR CATEGORIA ----------
const caixaFiltros = document.getElementById("filtros");
// Cria a lista de categorias únicas: "Todos" + categorias dos objetos
const categorias = ["Todos"];
sabores.forEach((s) => {
  if (!categorias.includes(s.categoria)) categorias.push(s.categoria);
});

function desenharFiltros() {
  caixaFiltros.innerHTML = "";
  categorias.forEach((cat) => {
    const b = document.createElement("button");
    b.textContent = cat;
    if (cat === filtroAtual) b.classList.add("ativo");
    b.addEventListener("click", () => {
      filtroAtual = cat;
      desenharFiltros();
      desenharSabores();
    });
    caixaFiltros.appendChild(b);
  });
}

// ---------- 3. CARDÁPIO (criado pelo DOM) ----------
const grade = document.getElementById("lista-sabores");

function desenharSabores() {
  grade.innerHTML = "";
  // Operador ternário: sem filtro mostra tudo, senão filtra
  const lista =
    filtroAtual === "Todos"
      ? sabores
      : sabores.filter((s) => s.categoria === filtroAtual);

  lista.forEach((s) => {
    const card = document.createElement("article");
    card.className = "sabor";
    // Template string monta o HTML interno do cartão
    card.innerHTML = `
      <h3>${s.nome}</h3>
      <span>${s.categoria}</span>
      <span class="preco">${moeda(s.preco)}</span>
      <div class="acoes">
        <button data-acao="add">Adicionar</button>
        <button data-acao="info">Detalhes</button>
      </div>`;
    // Um único listener por cartão, decide pelo data-acao
    card.addEventListener("click", (e) => {
      const acao = e.target.dataset.acao;
      if (acao === "add") adicionar(s.id);
      if (acao === "info") abrirModal(s);
    });
    grade.appendChild(card);
  });
}

// ---------- 4. PEDIDO ----------
const listaPedido = document.getElementById("itens-pedido");
const spanTotal = document.getElementById("total");
const spanQtd = document.getElementById("qtd-carrinho");

function adicionar(id) {
  // find devolve o item do carrinho ou undefined
  const item = carrinho.find((i) => i.id === id);
  if (item) item.qtd++;
  else carrinho.push({ id: id, qtd: 1 });
  desenharPedido();
}

function remover(id) {
  const item = carrinho.find((i) => i.id === id);
  item.qtd--;
  // Quando chega a zero, tira o item do array
  if (item.qtd === 0) carrinho = carrinho.filter((i) => i.id !== id);
  desenharPedido();
}

function desenharPedido() {
  listaPedido.innerHTML = "";
  let subtotal = 0;
  let totalItens = 0;

  if (carrinho.length === 0) {
    listaPedido.innerHTML =
      '<li class="vazio">Nada por aqui. Adicione um sabor no cardápio.</li>';
  }

  carrinho.forEach((item) => {
    const s = sabores.find((x) => x.id === item.id);
    subtotal += s.preco * item.qtd; // += soma e atribui
    totalItens += item.qtd;

    const li = document.createElement("li");
    li.innerHTML = `<span>${item.qtd}× ${s.nome}</span><span>${moeda(s.preco * item.qtd)}</span>`;
    const bt = document.createElement("button");
    bt.textContent = "−";
    bt.setAttribute("aria-label", "Remover um " + s.nome);
    bt.addEventListener("click", () => remover(item.id));
    li.appendChild(bt);
    listaPedido.appendChild(li);
  });

  spanQtd.textContent = totalItens;
  spanTotal.textContent = moeda(subtotal * (1 - desconto));
}

// ---------- 5. CUPOM DE DESCONTO ----------
const campoCupom = document.getElementById("cupom");
const msgCupom = document.getElementById("msg-cupom");

document.getElementById("aplicar-cupom").addEventListener("click", () => {
  const codigo = campoCupom.value.trim().toUpperCase();
  if (codigo === "DOCE10") {
    desconto = 0.1;
    msgCupom.textContent = "Cupom aplicado: 10% de desconto.";
    msgCupom.className = "ok";
  } else if (codigo === "") {
    msgCupom.textContent = "Digite um cupom.";
    msgCupom.className = "erro";
  } else {
    desconto = 0;
    msgCupom.textContent = "Cupom inválido.";
    msgCupom.className = "erro";
  }
  desenharPedido();
});

// Finalizar: confirma só se houver itens
document.getElementById("finalizar").addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu pedido está vazio.");
  } else if (
    confirm("Total " + spanTotal.textContent + ". Confirmar pedido?")
  ) {
    carrinho = [];
    desconto = 0;
    campoCupom.value = "";
    msgCupom.textContent = "";
    desenharPedido();
    alert("Pedido enviado!");
  }
});

// ---------- 6. MODAL DE DETALHES ----------
const modal = document.getElementById("modal");
function abrirModal(s) {
  document.getElementById("modal-titulo").textContent = s.nome;
  document.getElementById("modal-texto").textContent = s.desc;
  modal.style.display = "flex";
}
function fecharModal() {
  modal.style.display = "none";
}
document.getElementById("fechar-modal").addEventListener("click", fecharModal);
// Clicar no fundo escuro fecha
modal.addEventListener("click", (e) => {
  if (e.target === modal) fecharModal();
});
// Esc fecha
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") fecharModal();
});

// ---------- 7. TEMA ESCURO ----------
document.getElementById("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// ---------- 8. VOLTAR AO TOPO ----------
const topoBtn = document.getElementById("topo-btn");
window.addEventListener("scroll", () => {
  topoBtn.style.display = window.scrollY > 300 ? "block" : "none";
});
topoBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// ---------- INÍCIO: desenha o estado inicial ----------
desenharFiltros();
desenharSabores();
desenharPedido();
