# Gelato Rua 9

Site de uma sorveteria artesanal fictícia, feito com HTML, CSS e JavaScript puros.
O visitante vê o cardápio, filtra por categoria, monta um pedido, aplica um cupom
e finaliza a compra. Não há servidor nem bibliotecas: tudo roda no navegador.

Projeto desenvolvido para a disciplina de Web Design (Facens), usando os conceitos
da aula de JavaScript: sintaxe, variáveis, operadores, condicionais, repetições,
funções, arrays, objetos e manipulação do DOM.

---

## Sumário

1. Estrutura do projeto
2. Como executar
3. Funcionalidades
4. Conceitos de JavaScript aplicados
5. Dados e estado da página
6. Fluxo de uso
7. Decisões de design
8. Acessibilidade
9. Como testar
10. Publicação no GitHub
11. Melhorias futuras

---

## 1. Estrutura do projeto

```
sorveteria/
├── index.html   estrutura da página
├── style.css    aparência, tema claro e escuro, responsividade
├── script.js    comportamento e lógica do pedido
└── README.md    esta documentação
```

- O JavaScript é carregado de forma **externa**, com `<script src="script.js">`,
  no fim do `body`. Assim o HTML já existe quando o script procura os elementos.
- O CSS também é externo, ligado com `<link rel="stylesheet" href="style.css">`.

---

## 2. Como executar

1. Baixe os arquivos para a mesma pasta.
2. Abra o `index.html` no navegador (duplo clique).
3. Não é preciso instalar nada nem usar servidor local.

---

## 3. Funcionalidades

### 3.1 Efeito de digitação

O título da página é escrito letra por letra. A função `digitar()` acrescenta um
caractere com `charAt` e se chama de novo com `setTimeout` a cada 70 ms, até
chegar ao fim da frase.

### 3.2 Cardápio gerado pelo JavaScript

Os sabores ficam em um array de objetos. A função `desenharSabores()` percorre o
array com `forEach` e, para cada sabor, cria um `<article>` com `createElement`,
preenche o conteúdo com template string e o coloca na página com `appendChild`.

### 3.3 Filtro por categoria

Os botões de filtro também são criados pelo JS. As categorias são extraídas dos
próprios sabores, sem repetição, e o botão "Todos" é adicionado no início. Ao
clicar, a variável `filtroAtual` muda e o cardápio é desenhado de novo usando
`filter`.

### 3.4 Pedido

- **Adicionar:** se o sabor já está no carrinho, aumenta a quantidade; se não,
  entra como novo item.
- **Remover:** diminui a quantidade; ao chegar a zero, o item sai do array.
- **Total:** soma `preço × quantidade` de todos os itens e mostra em reais.
- **Contador** no cabeçalho com o número total de itens.
- **Estado vazio:** quando não há itens, aparece uma mensagem orientando o
  visitante a adicionar um sabor.

### 3.5 Cupom de desconto

O campo aceita o código `DOCE10`, que dá 10% de desconto. O texto é limpo com
`trim()` e convertido para maiúsculas com `toUpperCase()`, então `doce10` também
funciona. Há três respostas possíveis: cupom válido, campo vazio e cupom inválido,
cada uma com uma mensagem e uma cor diferentes.

### 3.6 Finalizar pedido

- Com o carrinho vazio, mostra um aviso (`alert`).
- Com itens, pede confirmação com o total (`confirm`).
- Se o visitante confirmar, o carrinho, o desconto e o campo de cupom são
  zerados.

### 3.7 Modal de detalhes

O botão "Detalhes" de cada sabor abre um pop-up com a descrição. O mesmo modal
serve para todos os sabores: o JS troca o título e o texto antes de mostrá-lo.
Fecha pelo botão, clicando no fundo escuro ou apertando Esc.

### 3.8 Tema escuro

O botão "Tema" liga e desliga a classe `dark` no `body` com `classList.toggle`.
O CSS redefine as variáveis de cor nessa classe, então toda a página muda junto.

### 3.9 Voltar ao topo

Um botão fixo aparece depois de 300 px de rolagem (evento `scroll`) e leva ao
início da página com `scrollTo` e rolagem suave.

---

## 4. Conceitos de JavaScript aplicados

| Conceito da aula         | Onde aparece                                                    |
| ------------------------ | --------------------------------------------------------------- |
| `const` e `let`          | `const sabores`, `let carrinho`, `let desconto`                 |
| Tipos de dados           | string (nome), number (preço), array (carrinho), objeto (sabor) |
| Operadores aritméticos   | `preco * qtd`, `1 - desconto`, `++`, `--`                       |
| Operadores de atribuição | `subtotal += ...`                                               |
| Comparação               | `===` em filtros, cupom e busca de itens                        |
| Operadores lógicos       | `!` no cupom vazio e no fechamento do modal                     |
| Condicionais             | `if / else if / else` no cupom e na finalização                 |
| Operador ternário        | filtro "Todos" e exibição do botão de topo                      |
| Repetição                | `forEach` sobre sabores, categorias e carrinho                  |
| Funções                  | `moeda`, `digitar`, `adicionar`, `remover`, `desenharPedido`    |
| Arrow functions          | listeners de eventos e callbacks de `filter`/`find`             |
| Arrays                   | `push`, `includes`, `find`, `filter`, `forEach`                 |
| Objetos                  | cada sabor tem `id`, `nome`, `categoria`, `preco`, `desc`       |
| Template strings         | cartões, itens do pedido e mensagens                            |
| DOM: seleção             | `getElementById`                                                |
| DOM: alteração           | `textContent`, `innerHTML`, `classList`, `style`                |
| DOM: criação             | `createElement`, `appendChild`, `setAttribute`                  |
| Eventos                  | `click`, `keydown`, `scroll` com `addEventListener`             |

---

## 5. Dados e estado da página

Cada sabor é um objeto:

```js
{ id: 4, nome: "Limão siciliano", categoria: "Frutas", preco: 11, desc: "..." }
```

O estado da página fica em três variáveis:

- `carrinho`: array de `{ id, qtd }`. Guarda só o id e a quantidade; nome e preço
  são buscados em `sabores`, para que o dado exista em um único lugar.
- `desconto`: número entre 0 e 1 (0.1 equivale a 10%).
- `filtroAtual`: categoria selecionada.

Sempre que o estado muda, a função de desenho correspondente refaz a parte da
tela afetada. Isso evita ter que atualizar elementos um a um.

---

## 6. Fluxo de uso

1. O visitante abre a página e vê o título sendo digitado.
2. Escolhe uma categoria ou deixa em "Todos".
3. Clica em "Adicionar" nos sabores que quer; o contador do cabeçalho sobe.
4. Em "Detalhes", lê a descrição de um sabor no modal.
5. Na seção "Meu pedido", remove itens se quiser e confere o total.
6. Digita o cupom e clica em "Aplicar".
7. Clica em "Finalizar pedido" e confirma.

---

## 7. Decisões de design

- **Paleta:** menta bem clara de fundo, ameixa escura no texto, rosa e limão como
  acentos. No tema escuro, o fundo vira roxo profundo e o texto fica claro.
- **Tipografia:** uma única família sem serifa, com o título muito grande como
  elemento de destaque da página.
- **Bordas:** contornos escuros de 2 px e cantos bem arredondados em cartões e
  botões, para dar um ar de rótulo de sorveteria.
- **Cores por variável:** todas as cores estão em variáveis CSS no `:root`, e o
  tema escuro só redefine esses valores.
- **Layout:** `grid` com `auto-fill` faz o cardápio se ajustar à largura da tela
  sem depender de muitas regras de media query.
- **Largura do conteúdo:** limitada a 900 px, para manter as linhas de texto
  curtas e fáceis de ler.

---

## 7.1 Responsividade

O site se adapta a celulares, tablets, notebooks e telas grandes.

| Faixa           | Comportamento                                              |
| --------------- | ---------------------------------------------------------- |
| Até 360 px      | Espaçamentos reduzidos, títulos menores                    |
| Até 480 px      | Cabeçalho em coluna, cardápio em 1 coluna, cupom empilhado |
| 481 a 767 px    | Cardápio em 2 colunas                                      |
| 768 px ou mais  | Mais espaço no topo e no pedido                            |
| 1024 px ou mais | Conteúdo até 1100 px, colunas automáticas                  |
| 1440 px ou mais | Conteúdo até 1280 px, cardápio em 4 colunas                |
| 1920 px ou mais | Texto levemente maior e conteúdo até 1500 px               |

Recursos adicionais:

- Tamanho de texto fluido com `clamp()`.
- Grade com `minmax(min(100%, X), 1fr)`, que nunca estoura em telas estreitas.
- Alvos de toque de pelo menos 44 px em telas touch (`pointer: coarse`).
- Áreas seguras de celulares com notch (`env(safe-area-inset-*)`).
- Celular deitado: cabeçalho deixa de ser fixo para sobrar espaço.
- Modal com rolagem interna em telas baixas.
- Estilos de impressão sem menu nem botões.
- Respeita `prefers-reduced-motion`.

---

## 8. Acessibilidade

- Foco visível nos botões e campos, para quem navega pelo teclado.
- `aria-label` nos botões que só têm símbolo (voltar ao topo, remover item).
- `aria-live` no título digitado, para leitores de tela perceberem o texto.
- O modal usa `role="dialog"` e fecha com Esc.
- Contraste alto entre texto e fundo nos dois temas.

---

## 9. Como testar

| Ação                               | Resultado esperado              |
| ---------------------------------- | ------------------------------- |
| Abrir a página                     | Título digitado letra por letra |
| Clicar em "Frutas"                 | Só 3 sabores aparecem           |
| Adicionar o mesmo sabor 2 vezes    | Item aparece como "2× nome"     |
| Clicar em "−" em um item com qtd 1 | O item some do pedido           |
| Aplicar `DOCE10` com itens         | Total cai 10%                   |
| Aplicar `abc`                      | Mensagem "Cupom inválido."      |
| Aplicar com o campo vazio          | Mensagem "Digite um cupom."     |
| Finalizar com pedido vazio         | Alerta de pedido vazio          |
| Abrir "Detalhes" e apertar Esc     | Modal fecha                     |
| Rolar a página mais de 300 px      | Botão de topo aparece           |
| Clicar em "Tema"                   | Cores da página invertem        |

---

## 10. Publicação no GitHub

No terminal do VS Code, dentro da pasta do projeto:

```bash
git init
git add .
git commit -m "Primeira versão do site da sorveteria"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Troque a URL pelo endereço do repositório criado no GitHub.

---

## 11. Melhorias futuras

- Guardar o carrinho no `localStorage` para não perder o pedido ao recarregar.
- Campo de observações em cada sabor (sem lactose, sem açúcar).
- Escolha de tamanho (copinho, pote) com preços diferentes.
- Seção de contato com validação de formulário.
- Galeria de fotos dos sabores.
- Lembrar o tema escolhido entre visitas.
