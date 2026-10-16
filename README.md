# Gelato Rua 9

Site de uma sorveteria artesanal fictícia, feito com HTML, CSS e JavaScript puros.
O visitante vê o cardápio, filtra por categoria, monta um pedido, aplica um cupom
e finaliza a compra. Não há servidor nem bibliotecas: tudo roda no navegador. Endereço, contatos e
depoimentos são fictícios e precisam ser trocados antes de uma publicação real.

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
caractere com `charAt` e se chama de novo com `setTimeout` a cada 55 ms, até
chegar ao fim da frase. Para quem prefere menos movimento, o texto aparece pronto.

### 3.2 Cardápio gerado pelo JavaScript

Os sabores ficam em um array de objetos. A função `desenharSabores()` percorre o
array com `forEach` e, para cada sabor, cria um `<article>` com `createElement`,
preenche título, descrição e botões com `textContent` (mais seguro que `innerHTML`)
e coloca o cartão na página com `append`.

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

### 3.6 Resumo da simulação

- "Gerar resumo da simulação" abre o modal com itens, subtotal, desconto, frete,
  total, modalidade e observações.
- "Copiar resumo" usa a área de transferência; se o navegador negar, o resumo
  aparece no modal para ser copiado manualmente.
- Nenhum pedido é enviado e nenhum pagamento é feito.

### 3.7 Modal de detalhes

O botão "Detalhes" de cada sabor abre um pop-up com a descrição. O mesmo modal
serve para todos os sabores: o JS troca o título e o texto antes de mostrá-lo.
Fecha pelo botão, clicando no fundo escuro ou apertando Esc.

### 3.8 Tema escuro

O botão "Tema" liga e desliga a classe `dark` no `body` com `classList.toggle`.
Sem escolha salva, a página segue o tema do sistema (`prefers-color-scheme`).
O CSS redefine as variáveis de cor nessa classe, então toda a página muda junto.

### 3.9 Voltar ao topo

Um botão fixo aparece depois de 300 px de rolagem (evento `scroll`) e leva ao
início da página com `scrollTo` e rolagem suave.

### 3.10 Busca, ordenação e favoritos

A busca ignora acentos e maiúsculas (`normalize`) e procura no nome e na descrição.
Busca, categoria, "Somente favoritos" e ordenação (menor preço, maior preço, A–Z)
se combinam em `listaFiltrada()`. O botão de coração usa `aria-pressed`.

### 3.11 Entrega, frete e observações

A modalidade "Entrega local" cobra R$ 6,00, grátis quando o subtotal é de R$ 40
ou mais (antes do desconto). O cupom `DOCE10` abate 10% só dos produtos. O campo
de observações tem limite de 300 caracteres e contador.

### 3.12 Persistência

Carrinho, favoritos e tema ficam no `localStorage`, dentro de `try/catch` e com
validação dos dados lidos (ids existentes, quantidades de 1 a 99). Se o
armazenamento estiver bloqueado, a página continua funcionando em memória.

### 3.13 Menu para celular

Em telas até 767 px, o botão "Menu" abre e fecha os links (`hidden` e
`aria-expanded`). Em telas maiores, o menu fica sempre visível.

### 3.14 Seções de conteúdo

Sobre (números calculados pelo JS), destaques, passos do pedido, experiências,
processo, guia de sabores, ocasiões, depoimentos, horários, FAQ e contato.

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
| Template strings         | contagem de resultados e resumo do pedido                            |
| DOM: seleção             | `getElementById`                                                |
| DOM: alteração           | `textContent`, `replaceChildren`, `classList`, `style`, `hidden`                |
| DOM: criação             | `createElement`, `append`, `setAttribute`                  |
| Eventos                  | `click`, `keydown`, `scroll` com `addEventListener`             |
| Métodos de array         | `reduce` (totais), `sort` (ordenação), `some`, `map`            |
| `Set`                    | categorias únicas e favoritos sem repetição                     |
| Tratamento de erros      | `try/catch` ao ler e gravar no `localStorage`                   |
| `matchMedia`             | tela pequena, menos movimento e tema do sistema                 |

---

## 5. Dados e estado da página

Cada sabor é um objeto:

```js
{ id: 4, nome: "Limão siciliano", categoria: "Frutas", preco: 11, desc: "..." }
```

O estado da página fica em quatro variáveis:

- `carrinho`: array de `{ id, qtd }`. Guarda só o id e a quantidade; nome e preço
  são buscados em `sabores`, para que o dado exista em um único lugar.
- `favoritos`: array com os ids dos sabores salvos.
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
- **Largura do conteúdo:** limitada (de 900 a 1500 px, conforme a tela), para manter as linhas de texto
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
- Contraste revisado nos dois temas, inclusive nas cores de sucesso e erro.
- Link "Pular para o conteúdo" para quem navega pelo teclado.
- Com o modal aberto, o resto da página fica inerte e o foco volta ao botão de origem.
- Filtros e favoritos informam o estado com `aria-pressed`.

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
| Buscar "limao" (sem acento)        | Aparece "Limão siciliano"       |
| Ordenar por menor preço            | Lista em ordem crescente        |
| Favoritar e recarregar a página    | Favorito continua salvo         |
| Entrega com subtotal abaixo de R$ 40 | Frete de R$ 6,00             |
| Entrega com subtotal de R$ 40+     | Frete grátis                    |
| Gerar resumo com itens no carrinho | Modal com o resumo              |
| Reduzir a janela abaixo de 768 px  | Aparece o botão "Menu"          |

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

- Campo de observações em cada sabor (sem lactose, sem açúcar).
- Escolha de tamanho (copinho, pote) com preços diferentes.
- Seção de contato com validação de formulário.
- Galeria de fotos dos sabores.
- Formulário de contato com validação.
