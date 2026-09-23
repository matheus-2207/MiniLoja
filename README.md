# PowerSupps

Loja de suplementos em React + Vite, com destaque para Creatina Monohidratada 300 g e uma embalagem 3D interativa feita em Three.js.

## Executar localmente

Em um terminal:

```sh
cd backend
npm install
npm start
```

Em outro terminal:

```sh
cd frontend
npm install
npm run dev
```

Abra http://localhost:5173. A API usa http://localhost:3000 por padrão. Configure `VITE_API_URL` no frontend para apontar para outro backend.

## Experiência 3D

- Arraste para girar 360°; dois dedos aproximam/afastam em telas touch.
- Use os botões +/− ou, com o palco focado, as setas, +/− e 0 para restaurar.
- Modelo geométrico e textura gerados localmente, sem download de GLB.
- Carregamento separado do restante da página, densidade de pixels limitada, renderização somente quando há alterações e suspensão quando fora da tela.
- Imagem alternativa quando WebGL não está disponível. A embalagem é conceitual, identificada na interface.

## Conteúdo e comércio

Catálogo, busca, filtros, conta, administração e carrinho existentes foram preservados. Os kits somam unidades do produto retornado pela API. Se a API estiver indisponível, a interface exibe um catálogo de demonstração identificado e desativa compras.

Não há avaliações verificadas, laudos, tabela nutricional, política de frete grátis ou inventário de escassez fornecidos. A página deixa essas informações pendentes e não inventa prova social. O carrinho gera um resumo de demonstração; não processa pagamentos, emite nota fiscal ou confirma entrega.

## Verificar

```sh
cd frontend
npm run build
npx eslint src/App.jsx src/components/Navbar.jsx src/components/ProductScene.jsx src/pages/Home.jsx
```

O lint global ainda aponta um problema preexistente com `fetchData` em `AdminDashboard.jsx`. A fluidez em celulares físicos precisa ser medida antes de assumir 60fps em todos os aparelhos.

## Arquivos principais

- `frontend/src/pages/Home.jsx`: seções, dados, filtros e kits.
- `frontend/src/pages/Home.css`: direção visual e responsividade.
- `frontend/src/components/ProductScene.jsx`: cena Three.js, textura e controles.
- `frontend/src/components/Navbar.jsx`: navegação e carrinho.
- `PRODUCT.md`: fatos e limites do produto.
- `DESIGN.md`: sistema visual.
