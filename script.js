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


// Produtos adicionais seguem o mesmo modelo dos sabores originais.
sabores.push(
  { id: 9, nome: "Baunilha", categoria: "Cremosos", preco: 12, desc: "Base cremosa com notas de baunilha." },
  { id: 10, nome: "Coco", categoria: "Cremosos", preco: 13, desc: "Base láctea com coco ralado." },
  { id: 11, nome: "Maracujá", categoria: "Frutas", preco: 11, desc: "Sorbet de maracujá, receita ilustrativa sem leite." },
  { id: 12, nome: "Brownie", categoria: "Especiais", preco: 16, desc: "Chocolate com pedaços de brownie. Receita ilustrativa com leite, ovos e glúten." }
);

const $ = (id) => document.getElementById(id);
const chave = "gelato-rua9-v2";
const moeda = (valor) => valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const normalizar = (texto) => texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
let carrinho = [];
let favoritos = [];
let desconto = 0;
let filtroAtual = "Todos";
let temporizadorAviso;
let focoAnterior;
const reduzirMovimento = window.matchMedia("(prefers-reduced-motion: reduce)");
const telaPequena = window.matchMedia("(max-width: 767px)");

// Armazenamento indisponível não impede a utilização da página.
function carregarEstado() {
  try {
    const salvo = JSON.parse(localStorage.getItem(chave) || "{}");
    if (!salvo || typeof salvo !== "object") return;
    if (Array.isArray(salvo.carrinho)) {
      const ids = new Set();
      carrinho = salvo.carrinho.filter((item) => {
        if (!item || !sabores.some((s) => s.id === item.id)) return false;
        if (!Number.isInteger(item.qtd) || item.qtd < 1 || item.qtd > 99) return false;
        if (ids.has(item.id)) return false;
        ids.add(item.id);
        return true;
      }).map(({ id, qtd }) => ({ id, qtd }));
    }
    if (Array.isArray(salvo.favoritos)) {
      favoritos = [...new Set(salvo.favoritos)].filter((id) => sabores.some((s) => s.id === id));
    }
    document.body.classList.toggle("dark", salvo.escuro === true);
  } catch {
    carrinho = [];
    favoritos = [];
  }
}

function salvarEstado() {
  try {
    localStorage.setItem(chave, JSON.stringify({
      carrinho,
      favoritos,
      escuro: document.body.classList.contains("dark")
    }));
  } catch {
    // A aplicação continua em memória no modo privado/restrito.
  }
}

function avisar(mensagem) {
  clearTimeout(temporizadorAviso);
  $("notificacao").textContent = mensagem;
  temporizadorAviso = setTimeout(() => {
    $("notificacao").textContent = "";
  }, 3500);
}

function criarBotao(texto, acao, rotulo) {
  const botao = document.createElement("button");
  botao.type = "button";
  botao.textContent = texto;
  if (rotulo) botao.setAttribute("aria-label", rotulo);
  botao.addEventListener("click", acao);
  return botao;
}

// Busca, categoria, favoritos e ordenação são combinados.
function listaFiltrada() {
  const busca = normalizar($("busca").value.trim());
  const lista = sabores.filter((sabor) => {
    const categoriaOk = filtroAtual === "Todos" || sabor.categoria === filtroAtual;
    const buscaOk = normalizar(sabor.nome + " " + sabor.desc).includes(busca);
    const favoritoOk = !$("so-favoritos").checked || favoritos.includes(sabor.id);
    return categoriaOk && buscaOk && favoritoOk;
  });
  const ordem = $("ordenacao").value;
  if (ordem === "menor") lista.sort((a, b) => a.preco - b.preco);
  if (ordem === "maior") lista.sort((a, b) => b.preco - a.preco);
  if (ordem === "nome") lista.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
  return lista;
}

function desenharFiltros() {
  const categorias = ["Todos", ...new Set(sabores.map((s) => s.categoria))];
  $("filtros").replaceChildren();
  categorias.forEach((categoria) => {
    const botao = criarBotao(categoria, () => {
      filtroAtual = categoria;
      for (const outro of $("filtros").children) {
        const ativo = outro.textContent === categoria;
        outro.classList.toggle("ativo", ativo);
        outro.setAttribute("aria-pressed", String(ativo));
      }
      desenharSabores();
    });
    botao.classList.toggle("ativo", categoria === filtroAtual);
    botao.setAttribute("aria-pressed", String(categoria === filtroAtual));
    $("filtros").append(botao);
  });
}

function desenharSabores() {
  const grade = $("lista-sabores");
  grade.replaceChildren();
  const lista = listaFiltrada();
  $("resultado-busca").textContent = `${lista.length} sabor(es) encontrado(s).`;
  if (lista.length === 0) {
    const vazio = document.createElement("p");
    vazio.textContent = "Nenhum sabor encontrado. Revise a busca, categoria ou favoritos.";
    grade.append(vazio);
  }
  lista.forEach((sabor) => {
    const card = document.createElement("article");
    card.className = "sabor";
    const titulo = document.createElement("h3");
    titulo.textContent = sabor.nome;
    const categoria = document.createElement("span");
    categoria.textContent = sabor.categoria;
    const descricao = document.createElement("p");
    descricao.textContent = sabor.desc;
    const preco = document.createElement("span");
    preco.className = "preco";
    preco.textContent = moeda(sabor.preco);
    const favorito = criarBotao("♡ Favorito", () => {
      alternarFavorito(sabor.id);
      const novo = grade.querySelector(`[data-favorito="${sabor.id}"]`);
      (novo || $("so-favoritos")).focus();
    }, "Favoritar " + sabor.nome);
    favorito.className = "favorito";
    favorito.dataset.favorito = sabor.id;
    favorito.setAttribute("aria-pressed", String(favoritos.includes(sabor.id)));
    favorito.textContent = favoritos.includes(sabor.id) ? "♥ Salvo" : "♡ Favorito";
    const acoes = document.createElement("div");
    acoes.className = "acoes";
    acoes.append(
      criarBotao("Adicionar", () => adicionar(sabor.id), "Adicionar " + sabor.nome),
      criarBotao("Detalhes", () => abrirModal(sabor.nome, sabor.desc + "\n\nReceitas ilustrativas. Confirme ingredientes e alergênicos com a loja antes de consumir."), "Ver detalhes de " + sabor.nome)
    );
    card.append(titulo, categoria, descricao, preco, favorito, acoes);
    grade.append(card);
  });
}

function alternarFavorito(id) {
  favoritos = favoritos.includes(id) ? favoritos.filter((item) => item !== id) : [...favoritos, id];
  salvarEstado();
  desenharSabores();
  avisar(favoritos.includes(id) ? "Sabor salvo nos favoritos." : "Sabor removido dos favoritos.");
}

function adicionar(id) {
  const item = carrinho.find((atual) => atual.id === id);
  if (item && item.qtd >= 99) {
    avisar("Limite de 99 unidades por sabor.");
    return;
  }
  if (item) item.qtd += 1;
  else carrinho.push({ id, qtd: 1 });
  atualizarPedido();
  avisar("Sabor adicionado ao pedido.");
}

function alterarQuantidade(id, diferenca) {
  const item = carrinho.find((atual) => atual.id === id);
  if (!item) return;
  item.qtd = Math.min(99, item.qtd + diferenca);
  carrinho = carrinho.filter((atual) => atual.qtd > 0);
  atualizarPedido();
  const controle = $("itens-pedido").querySelector(`[data-controle="${id}"]`);
  (controle || $("limpar-carrinho")).focus();
}

function calcularTotais() {
  const subtotal = carrinho.reduce((soma, item) => {
    return soma + sabores.find((s) => s.id === item.id).preco * item.qtd;
  }, 0);
  const abatimento = Math.round(subtotal * desconto * 100) / 100;
  const frete = subtotal > 0 && subtotal < 40 && $("recebimento").value === "entrega" ? 6 : 0;
  return { subtotal, abatimento, frete, total: subtotal - abatimento + frete };
}

function atualizarPedido() {
  const lista = $("itens-pedido");
  lista.replaceChildren();
  if (carrinho.length === 0) {
    const vazio = document.createElement("li");
    vazio.className = "vazio";
    vazio.textContent = "Nada por aqui. Adicione um sabor no cardápio.";
    lista.append(vazio);
  }
  carrinho.forEach((item) => {
    const sabor = sabores.find((s) => s.id === item.id);
    const linha = document.createElement("li");
    const texto = document.createElement("span");
    texto.textContent = `${item.qtd}× ${sabor.nome} — ${moeda(sabor.preco * item.qtd)}`;
    const controles = document.createElement("div");
    controles.className = "quantidade";
    const menos = criarBotao("−", () => alterarQuantidade(item.id, -1), "Remover uma unidade de " + sabor.nome);
    menos.dataset.controle = item.id;
    const mais = criarBotao("+", () => alterarQuantidade(item.id, 1), "Adicionar uma unidade de " + sabor.nome);
    mais.disabled = item.qtd >= 99;
    controles.append(menos, mais);
    linha.append(texto, controles);
    lista.append(linha);
  });
  const valores = calcularTotais();
  $("qtd-carrinho").textContent = carrinho.reduce((soma, item) => soma + item.qtd, 0);
  $("subtotal").textContent = moeda(valores.subtotal);
  $("valor-desconto").textContent = moeda(valores.abatimento);
  $("valor-frete").textContent = moeda(valores.frete);
  $("total").textContent = moeda(valores.total);
  $("finalizar").disabled = carrinho.length === 0;
  $("copiar-pedido").disabled = carrinho.length === 0;
  $("limpar-carrinho").disabled = carrinho.length === 0;
  salvarEstado();
}

function aplicarCupom() {
  const codigo = $("cupom").value.trim().toUpperCase();
  desconto = codigo === "DOCE10" ? 0.1 : 0;
  $("msg-cupom").textContent = desconto ? "Cupom aplicado: 10% nos produtos." : codigo ? "Cupom inválido. Desconto removido." : "Digite um cupom. Nenhum desconto ativo.";
  $("msg-cupom").className = desconto ? "ok" : "erro";
  atualizarPedido();
}

function resumoPedido() {
  const valores = calcularTotais();
  const linhas = ["GELATO RUA 9 — SIMULAÇÃO", ""];
  carrinho.forEach((item) => {
    const sabor = sabores.find((s) => s.id === item.id);
    linhas.push(`${item.qtd}× ${sabor.nome}: ${moeda(sabor.preco * item.qtd)}`);
  });
  linhas.push(
    "",
    "Subtotal: " + moeda(valores.subtotal),
    "Desconto: " + moeda(valores.abatimento),
    "Frete: " + moeda(valores.frete),
    "Total: " + moeda(valores.total),
    "Modalidade: " + ($("recebimento").value === "entrega" ? "Entrega local" : "Retirada")
  );
  const observacao = $("observacoes").value.trim();
  if (observacao) linhas.push("Observações: " + observacao);
  linhas.push("", "Nenhum pedido foi enviado e nenhum pagamento foi realizado.");
  return linhas.join("\n");
}

// O modal mantém o foco no diálogo e o devolve ao controle anterior.
function abrirModal(titulo, texto) {
  focoAnterior = document.activeElement;
  $("modal-titulo").textContent = titulo;
  $("modal-texto").textContent = texto;
  $("modal").hidden = false;
  $("modal").style.display = "flex";
  document.body.classList.add("modal-aberto");
  $("conteudo").inert = true;
  document.querySelector(".topo").inert = true;
  $("fechar-modal").focus();
}

function fecharModal() {
  if ($("modal").hidden) return;
  $("modal").hidden = true;
  $("modal").style.display = "none";
  document.body.classList.remove("modal-aberto");
  $("conteudo").inert = false;
  document.querySelector(".topo").inert = false;
  focoAnterior?.focus();
}

function atualizarMenu() {
  const pequeno = telaPequena.matches;
  $("menu-toggle").hidden = !pequeno;
  $("menu-toggle").setAttribute("aria-expanded", "false");
  $("menu-principal").hidden = pequeno;
}

function atualizarRotuloTema() {
  const escuro = document.body.classList.contains("dark");
  $("toggle-dark").textContent = escuro ? "Tema claro" : "Tema escuro";
  $("toggle-dark").setAttribute("aria-pressed", String(escuro));
}

function iniciarDigitacao() {
  const frase = "Sorvete bom é sorvete de verdade.";
  if (reduzirMovimento.matches) return;
  let posicao = 0;
  $("typewriter").setAttribute("aria-label", frase);
  $("typewriter").textContent = "";
  function passo() {
    if (reduzirMovimento.matches) {
      $("typewriter").textContent = frase;
      return;
    }
    posicao += 1;
    $("typewriter").textContent = frase.slice(0, posicao);
    if (posicao < frase.length) setTimeout(passo, 55);
  }
  passo();
}

// Eventos de interface.
$("busca").addEventListener("input", desenharSabores);
$("ordenacao").addEventListener("change", desenharSabores);
$("so-favoritos").addEventListener("change", desenharSabores);
$("recebimento").addEventListener("change", atualizarPedido);
$("aplicar-cupom").addEventListener("click", aplicarCupom);
$("cupom").addEventListener("keydown", (evento) => {
  if (evento.key === "Enter") aplicarCupom();
});
$("observacoes").addEventListener("input", () => {
  $("contador-observacoes").textContent = `${$("observacoes").value.length}/300 caracteres`;
});
$("limpar-carrinho").addEventListener("click", () => {
  if (!window.confirm("Esvaziar o carrinho desta simulação?")) return;
  carrinho = [];
  desconto = 0;
  $("cupom").value = "";
  $("msg-cupom").textContent = "";
  atualizarPedido();
  avisar("Carrinho esvaziado.");
});
$("finalizar").addEventListener("click", () => {
  if (carrinho.length) abrirModal("Resumo da simulação", resumoPedido());
});
$("copiar-pedido").addEventListener("click", async () => {
  if (!carrinho.length) return;
  try {
    await navigator.clipboard.writeText(resumoPedido());
    avisar("Resumo copiado.");
  } catch {
    abrirModal("Copie o resumo manualmente", resumoPedido());
  }
});
$("fechar-modal").addEventListener("click", fecharModal);
$("modal").addEventListener("click", (evento) => {
  if (evento.target === $("modal")) fecharModal();
});
document.addEventListener("keydown", (evento) => {
  if ($("modal").hidden) return;
  if (evento.key === "Escape") fecharModal();
  if (evento.key === "Tab") {
    evento.preventDefault();
    $("fechar-modal").focus();
  }
});
$("toggle-dark").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  atualizarRotuloTema();
  salvarEstado();
});
$("menu-toggle").addEventListener("click", () => {
  const aberto = $("menu-toggle").getAttribute("aria-expanded") === "true";
  $("menu-toggle").setAttribute("aria-expanded", String(!aberto));
  $("menu-principal").hidden = aberto;
});
$("menu-principal").addEventListener("click", (evento) => {
  if (telaPequena.matches && evento.target.closest("a")) atualizarMenu();
});
telaPequena.addEventListener("change", atualizarMenu);
function atualizarTopo() {
  $("topo-btn").style.display = window.scrollY > 300 ? "block" : "none";
}
window.addEventListener("scroll", atualizarTopo, { passive: true });
$("topo-btn").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reduzirMovimento.matches ? "instant" : "smooth" });
});

// Inicialização após a leitura do HTML (script no fim do body).
carregarEstado();
atualizarRotuloTema();
atualizarMenu();
desenharFiltros();
desenharSabores();
atualizarPedido();
atualizarTopo();
iniciarDigitacao();
