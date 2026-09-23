import { lazy, Suspense, useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowUpRight,
  ArrowRight,
  Check,
  ShieldCheck,
  FlaskConical,
  ScanLine,
  Package,
  Search,
  Plus,
  Minus,
  Star,
  Truck,
  CircleCheck,
  RefreshCw,
  Zap,
} from "lucide-react";
import { API_URL } from "../config";
import "./Home.css";
const ProductScene = lazy(() => import("../components/ProductScene"));
const money = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value,
  );
const previewProducts = [
  {
    id: "preview-creatina",
    name: "Creatina Monohidratada 300g",
    category: "Creatina",
    price: 89.9,
    description: "Creatina monohidratada para acompanhar sua rotina de treino.",
    image_url: "/images/creatina.png",
  },
  {
    id: "preview-whey",
    name: "Whey Protein Concentrado 1KG",
    category: "Whey",
    price: 109.9,
    description: "Suplemento proteico para complementar sua alimentação.",
    image_url: "/images/whey.png",
  },
  {
    id: "preview-pre",
    name: "Pré Treino Insane",
    category: "Pre Treino",
    price: 149.9,
    description: "Conheça o pré-treino da PowerSupps.",
    image_url: "/images/pre_treino.png",
  },
];
const disclosures = [
  {
    title: "O ingrediente em destaque",
    value: "Creatina monohidratada",
    text: "É a forma de creatina que identifica este produto no catálogo. A lista completa de ingredientes e possíveis alergênicos deve ser conferida no rótulo original.",
  },
  {
    title: "O que vem no pote",
    value: "300 g de produto",
    text: "Conteúdo informado no nome do produto. A quantidade de porções depende da recomendação de uso do fabricante, ainda não cadastrada.",
  },
  {
    title: "Transparência, de verdade",
    value: "Informação antes da decisão",
    text: "Laudo, tabela nutricional, porção e certificações ainda não foram disponibilizados. Não atribuímos selos nem promessas de pureza sem essa documentação.",
  },
];
export default function Home({ addToCart }) {
  const [products, setProducts] = useState([]),
    [state, setState] = useState("loading"),
    [retry, setRetry] = useState(0);
  const [search, setSearch] = useState(""),
    [category, setCategory] = useState(""),
    [formula, setFormula] = useState(0),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get(`${API_URL}/api/products`, {
        signal: controller.signal,
        timeout: 7000,
      })
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Catálogo inválido");
        setProducts(data.map((p) => ({ ...p, price: Number(p.price) })));
        setState("ready");
      })
      .catch((error) => {
        if (!axios.isCancel(error)) setState("offline");
      });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 3500);
    return () => clearTimeout(timer);
  }, [notice]);
  const catalog = state === "offline" ? previewProducts : products;
  const featured = catalog.find((p) => p.category === "Creatina");
  const filtered = catalog.filter(
    (p) =>
      (!category || p.category === category) &&
      p.name
        .toLocaleLowerCase("pt-BR")
        .includes(search.toLocaleLowerCase("pt-BR")),
  );
  const goTo = (id) =>
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      });
  const buy = (product, quantity = 1) => {
    if (state !== "ready" || !product) return;
    for (let i = 0; i < quantity; i++) addToCart(product);
    setNotice(
      `${quantity > 1 ? `${quantity} potes adicionados` : "Produto adicionado"} ao carrinho.`,
    );
  };
  return (
    <div className="home-page">
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title">
            Seu próximo
            <br />
            nível começa
            <br />
            <span>aqui.</span>
            <span className="headline-period" aria-hidden="true">
              ↗
            </span>
          </h1>
          <p>
            O treino é seu. A evolução também.
            <br />
            Creatina PowerSupps para fazer parte da sua rotina, uma conquista de
            cada vez.
          </p>
          <div className="hero-product-line">
            <span className="product-dot" /> Creatina monohidratada{" "}
            <span className="vertical-rule" /> 300 g
            <strong className="hero-price">{state === "ready" && featured ? money(featured.price) : state === "loading" ? "Consultando preço…" : "Preço a confirmar"}</strong>
          </div>
          <button className="primary-cta" onClick={() => goTo("kits")}>
            Quero elevar meu treino <ArrowUpRight size={21} />
          </button>
          <div className="hero-bottom">
            <span>
              <ShieldCheck size={15} /> Informação sem atalhos
            </span>
            <span>
              <Package size={15} /> Seu próximo passo
            </span>
          </div>
        </div>
        <Suspense
          fallback={
            <div className="scene-loading">Preparando seu produto em 3D…</div>
          }
        >
          <ProductScene />
        </Suspense>
        <div className="hero-footnote">
          <span>CONSISTÊNCIA CONSTRÓI RESULTADOS.</span>
          <button onClick={() => goTo("formula")}>
            Conheça o que está por dentro <ArrowRight size={14} />
          </button>
        </div>
      </section>
      <div className="principle-strip">
        <span>
          <Zap /> O SEU ESFORÇO.
        </span>
        <span>A SUA CONSTÂNCIA.</span>
        <span className="strip-accent">
          O SEU PRÓXIMO NÍVEL. <ArrowUpRight />
        </span>
      </div>
      <section className="benefits-section section-space" id="beneficios">
        <div className="section-heading">
          <h2>
            O básico bem feito.
            <br />
            <span>É assim que se evolui.</span>
          </h2>
          <p>
            Menos ruído. Mais clareza para escolher
            <br className="desktop-break" /> o que acompanha o seu treino.
          </p>
        </div>
        <div className="benefits-grid">
          <article>
            <FlaskConical />
            <h3>Conheça a fórmula.</h3>
            <p>
              Creatina monohidratada em foco. Ingredientes e informações do
              produto, sem promessas que o rótulo não fez.
            </p>
            <button onClick={() => goTo("formula")}>
              Explorar composição <ArrowUpRight size={16} />
            </button>
          </article>
          <article>
            <ScanLine />
            <h3>Veja cada detalhe.</h3>
            <p>
              Gire, aproxime e explore a embalagem em uma experiência 3D feita
              para colocar o produto nas suas mãos.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Explorar o pote <ArrowUpRight size={16} />
            </button>
          </article>
          <article>
            <ShieldCheck />
            <h3>Escolha com clareza.</h3>
            <p>
              Preço por unidade e total do kit sempre visíveis. Você decide o
              que faz sentido para a sua rotina.
            </p>
            <button onClick={() => goTo("kits")}>
              Encontrar meu kit <ArrowUpRight size={16} />
            </button>
          </article>
        </div>
      </section>
      <section className="formula-section section-space" id="formula">
        <div className="formula-art">
          <span className="formula-word">CREATINA</span>
          <div className="formula-mass">
            300<span>g</span>
          </div>
          <div className="formula-art-bottom">
            <span>MONOHIDRATADA</span>
            <FlaskConical size={30} />
          </div>
        </div>
        <div className="formula-content">
          <h2>
            Por dentro do pote.
            <br />
            <span>Sem caixa-preta.</span>
          </h2>
          <p>Você merece saber o que está escolhendo.</p>
          <div className="formula-accordion">
            {disclosures.map((item, i) => (
              <div
                className={`formula-item ${formula === i ? "expanded" : ""}`}
                key={item.title}
              >
                <button
                  aria-expanded={formula === i}
                  aria-controls={`formula-${i}`}
                  onClick={() => setFormula(formula === i ? -1 : i)}
                >
                  {item.title}
                  {formula === i ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {formula === i && (
                  <div id={`formula-${i}`}>
                    <strong>{item.value}</strong>
                    <p>{item.text}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="catalog-section section-space" id="produtos">
        <div className="section-heading">
          <h2>
            Seu treino.
            <br />
            <span>Seu arsenal.</span>
          </h2>
          <p>
            Encontre o próximo integrante
            <br />
            da sua rotina.
          </p>
        </div>
        <div className="catalog-controls">
          <div className="category-tabs" aria-label="Filtrar produtos">
            {[
              ["", "Todos"],
              ["Creatina", "Creatina"],
              ["Whey", "Whey protein"],
              ["Pre Treino", "Pré-treino"],
            ].map(([value, label]) => (
              <button
                key={value}
                aria-pressed={category === value}
                className={category === value ? "selected" : ""}
                onClick={() => setCategory(value)}
              >
                {label}
              </button>
            ))}
          </div>
          <label className="catalog-search">
            <Search size={17} />
            <input
              aria-label="Buscar suplemento"
              placeholder="Buscar suplemento"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        {state === "offline" && (
          <div className="catalog-status">
            <span>
              Catálogo de demonstração · conexão com a loja indisponível.
              Compras pausadas.
            </span>
            <button
              onClick={() => {
                setState("loading");
                setRetry((r) => r + 1);
              }}
            >
              <RefreshCw size={14} /> Tentar novamente
            </button>
          </div>
        )}
        {state === "loading" ? (
          <div className="loading-products" role="status">
            Carregando o catálogo…
          </div>
        ) : (
          <div className="products-grid">
            {filtered.map((p) => (
              <article className="product-card" key={p.id}>
                <div className="product-image">
                  <span>
                    {p.category === "Pre Treino"
                      ? "PRÉ-TREINO"
                      : p.category.toUpperCase()}
                  </span>
                  <img loading="lazy" src={p.image_url} alt={p.name} />
                  <span className="image-arrow">
                    <ArrowUpRight size={20} />
                  </span>
                </div>
                <div className="product-info">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="product-footer">
                    <div>
                      <small>
                        {state === "offline"
                          ? "Preço de demonstração"
                          : "Por unidade"}
                      </small>
                      <strong>{money(p.price)}</strong>
                    </div>
                    <button
                      aria-label={`Adicionar ${p.name} ao carrinho`}
                      disabled={state !== "ready"}
                      onClick={() => buy(p)}
                    >
                      <Plus size={21} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        {state !== "loading" && !filtered.length && (
          <p className="empty-results">
            Nenhum suplemento encontrado. Tente outro nome ou categoria.
          </p>
        )}
      </section>
      <section className="community-section section-space" id="comunidade">
        <div className="community-heading">
          <h2>
            Resultados são pessoais.
            <br />
            <span>Histórias também.</span>
          </h2>
          <div className="review-stars" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((n) => (
              <Star key={n} size={18} />
            ))}
          </div>
        </div>
        <div className="review-pending">
          <div className="quote-mark" aria-hidden="true">
            “
          </div>
          <p>
            A próxima história
            <br />
            pode ser a sua.
          </p>
          <div>
            <strong>Espaço para experiências reais.</strong>
            <span>
              As avaliações verificadas aparecerão aqui quando estiverem
              disponíveis. Nenhum depoimento publicado ainda.
            </span>
          </div>
        </div>
      </section>
      <section className="kits-section section-space" id="kits">
        <div className="section-heading">
          <h2>
            Constância é a chave.
            <br />
            <span>Escolha seu ritmo.</span>
          </h2>
          <p>
            Creatina PowerSupps 300 g.
            <br />
            Do primeiro pote à sua rotina completa.
          </p>
        </div>
        <div className="kits-grid">
          {[
            {
              count: 1,
              title: "O primeiro passo",
              text: "Um pote para começar sua rotina.",
            },
            {
              count: 2,
              title: "Mantenha o ritmo",
              text: "Dois potes. Um compromisso com você.",
            },
            {
              count: 3,
              title: "Pense no longo prazo",
              text: "Três potes para planejar suas próximas etapas.",
            },
          ].map(({ count, title, text }) => (
            <article
              className={`kit-card ${count === 2 ? "featured-kit" : ""}`}
              key={count}
            >
              {count === 2 && (
                <div className="kit-recommendation">
                  <Zap size={13} /> PARA SUA ROTINA
                </div>
              )}
              <span className="kit-quantity">
                {String(count).padStart(2, "0")}
                <span>
                  {count === 1 ? "POTE" : "POTES"} / {count * 300} G
                </span>
              </span>
              <h3>{title}</h3>
              <p>{text}</p>
              {state === "offline" && <span className="kit-preview-label">Valores de demonstração</span>}
              <div className="kit-price">
                {featured
                  ? money(featured.price * count)
                  : "Consulte o catálogo"}
              </div>
              <span className="kit-unit">
                {featured
                  ? `${money(featured.price)} por pote · ${state === "offline" ? "valor demonstrativo" : "sem desconto aplicado"}`
                  : "Preço disponível ao conectar a loja"}
              </span>
              <button
                className={count === 2 ? "primary-cta" : "secondary-cta"}
                disabled={state !== "ready" || !featured}
                onClick={() => buy(featured, count)}
              >
                {state === "offline"
                  ? "Loja temporariamente offline"
                  : `Escolher ${count === 1 ? "meu pote" : "meu kit"}`}
                <ArrowUpRight size={18} />
              </button>
              <span className="kit-detail">
                <Check size={14} /> {count} × Creatina Monohidratada 300 g
              </span>
            </article>
          ))}
        </div>
        <div className="purchase-details">
          <span>
            <Truck size={17} /> Frete e prazo a confirmar
          </span>
          <span>
            <ShieldCheck size={17} /> Valores transparentes
          </span>
          <span>
            <CircleCheck size={17} /> Sem assinatura recorrente
          </span>
        </div>
      </section>
      <section className="faq-section section-space">
        <h2>
          Sem dúvidas.
          <br />
          <span>Vamos em frente.</span>
        </h2>
        <div>
          {[
            [
              "Como explorar o produto em 3D?",
              "Arraste o pote com o mouse ou com um dedo para girar. Use os botões + e − para aproximar ou afastar. Pelo teclado, use as setas para girar, + e − para zoom e 0 para restaurar. A imagem é uma representação conceitual.",
            ],
            [
              "Onde encontro ingredientes e modo de uso?",
              "Consulte o rótulo original do fabricante. A tabela nutricional, os alergênicos e a recomendação de uso ainda não estão cadastrados nesta loja.",
            ],
            [
              "Os kits têm desconto ou frete grátis?",
              "Os kits somam o valor atual de cada unidade, sem desconto presumido. Frete, prazo de entrega e eventuais promoções precisam ser confirmados pela loja.",
            ],
            [
              "Como funciona a compra?",
              "Adicione produtos ao carrinho para revisar os itens. Esta versão demonstra o fluxo da loja; o checkout existente não processa pagamentos nem confirma expedição.",
            ],
          ].map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <Plus size={18} />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>
      <footer className="store-footer">
        <div>
          <a href="#/" className="footer-brand">
            power<span>supps</span>
            <ArrowUpRight />
          </a>
          <p>Seu esforço merece companhia à altura.</p>
        </div>
        <span>
          © {new Date().getFullYear()} PowerSupps
          <br />
          Consistência. Todos os dias.
        </span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Voltar ao topo <ArrowUpRight size={17} />
        </button>
      </footer>
      <div
        role="status"
        aria-live="polite"
        className={`cart-toast ${notice ? "visible" : ""}`}
      >
        {notice && (
          <>
            <CircleCheck size={19} />
            {notice}
          </>
        )}
      </div>
    </div>
  );
}
