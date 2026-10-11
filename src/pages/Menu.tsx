import { useEffect } from "react";
import logo from "../assets/logo.jpg";

/* ─── Price helper: aria-label spells out "X euro e Y centesimi" for screen readers ─── */
function Price({ value, label }: { value: string; label?: string }) {
  const aria = label ?? (() => {
    const [euros, cents] = value.replace(",", ".").split(".");
    if (!cents || cents === "00") return `${euros} euro`;
    return `${euros} euro e ${cents} centesimi`;
  })();
  return <span className="price" aria-label={aria}>{value}</span>;
}

/* ─── Dual price (piccola / media) ─── */
function DualPrice({ small, large }: { small: string; large: string }) {
  return (
    <span className="dual-price" aria-label={`piccola ${small} euro, media ${large} euro`}>
      <span className="sz">{small}</span>
      <span className="sz">{large}</span>
    </span>
  );
}

/* ─── Wine price (calice / bottiglia) ─── */
function WinePrice({ glass, bottle }: { glass: string; bottle?: string }) {
  const aria = bottle
    ? `calice ${glass} euro, bottiglia ${bottle} euro`
    : `calice ${glass} euro`;
  return (
    <span className="dual-price" aria-label={aria}>
      <span className="sz-w">{glass}</span>
      <span className="sz-w">{bottle ?? "—"}</span>
    </span>
  );
}

/* ─── Menu item row ─── */
function Item({
  name,
  desc,
  price,
  sig,
  children,
}: {
  name: string;
  desc?: string;
  price?: React.ReactNode;
  sig?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className="item" role="listitem">
      <div className="item-left">
        <span className="item-name">
          {name}
          {sig && <span className="sig" aria-label="cucina sociale"> ★</span>}
        </span>
        {desc && <span className="item-desc">{desc}</span>}
      </div>
      {price ?? children}
    </div>
  );
}

/* ─── Category heading ─── */
function Cat({ id, children }: { id: string; children: React.ReactNode }) {
  return <h3 id={id} className="cat">{children}</h3>;
}

function SubCat({ children }: { children: React.ReactNode }) {
  return <div className="subcat" role="heading" aria-level={4}>{children}</div>;
}

export default function Menu() {
  // Set lang synchronously so screen readers see it on first parse
  if (typeof document !== "undefined") {
    document.documentElement.lang = "it";
    document.title = "Menu — L'Altro Spazio · Via Nazario Sauro";
  }
  useEffect(() => {
    document.documentElement.lang = "it";
    document.title = "Menu — L'Altro Spazio · Via Nazario Sauro";
  }, []);

  return (
    <>
      {/* ── Skip link: first focusable element, visible on focus ── */}
      <a href="#main-content" className="skip-link">
        Vai al contenuto del menu
      </a>

      <div className="menu-page">

        {/* ── Minimal header ── */}
        <header className="menu-header">
          <div className="header-left">
            <h1 className="venue-name">
              <img src={logo} alt="L'Altro Spazio" className="venue-logo" />
            </h1>
            <p className="venue-sub">Via Nazario Sauro 24/F · Bologna</p>
          </div>
          <div className="header-right" aria-label="Orari di apertura">
            <p>Lun–Ven dalle 17:00</p>
            <p>Sab–Dom dalle 12:00</p>
          </div>
        </header>

        {/* ── In-page navigation for screen readers / keyboard users ── */}
        <nav aria-label="Sezioni del menu" className="menu-nav">
          <span className="nav-label" aria-hidden="true">Salta a:</span>
          <ol>
            <li><a href="#spritz">Spritz</a></li>
            <li><a href="#birra">Birra</a></li>
            <li><a href="#vino">Vino</a></li>
            <li><a href="#cocktail">Cocktail</a></li>
            <li><a href="#long-drink">Long Drink</a></li>
            <li><a href="#analcolici">Analcolici</a></li>
            <li><a href="#soft">Soft Drink</a></li>
            <li><a href="#amari">Amari</a></li>
            <li><a href="#caraffe">Caraffe</a></li>
            <li><a href="#cibo">Da Mangiare</a></li>
            <li><a href="#caffe">Caffè</a></li>
          </ol>
        </nav>

        <main id="main-content">

          {/* ═══ TWO-COLUMN DRINK GRID ═══ */}
          <div className="section-tops" aria-hidden="true">
            <span className="sec-h">Aperitivi</span>
            <span className="sec-h sec-h--right">Drink</span>
          </div>

          <div className="main-grid">

            {/* ─── LEFT ─── */}
            <div className="col">

              {/* SPRITZ */}
              <section aria-labelledby="spritz">
                <Cat id="spritz">Spritz</Cat>
                <div role="list">
                  <Item name="Aperitivo" price={<Price value="5,50" />} />
                  <Item name="Bitter" price={<Price value="5,50" />} />
                  <Item name="Hugo" price={<Price value="5,50" />} />
                  <Item name="Vermouth" price={<Price value="5,50" />} />
                  <Item name="Select" price={<Price value="6,50" />} />
                  <Item name="Limoncello" price={<Price value="6,50" />} />
                  <Item name="Cynar" price={<Price value="6,50" />} />
                  <Item name="Sarti Rosa" price={<Price value="6,50" />} />
                </div>
              </section>

              {/* BIRRA */}
              <section aria-labelledby="birra">
                <Cat id="birra">Birra Alla Spina</Cat>
                <div className="size-h" aria-hidden="true">
                  <span className="sz">Pic.</span>
                  <span className="sz">Med.</span>
                </div>
                <div role="list">
                  <Item name="Bionda"><DualPrice small="3,00" large="5,50" /></Item>
                  <Item name="Non Filtrata"><DualPrice small="4,00" large="7,00" /></Item>
                  <Item name="IPA"><DualPrice small="4,00" large="7,00" /></Item>
                  <Item name="Forst 0%" price={<Price value="3,50" label="3 euro e 50 centesimi, analcolica" />} />
                  <Item name="Daura" price={<Price value="4,50" label="4 euro e 50 centesimi, senza glutine" />} />
                  <Item name="Messina Cristalli di Sale" price={<Price value="4,50" />} />
                </div>
              </section>

              {/* VINO */}
              <section aria-labelledby="vino">
                <Cat id="vino">Vino</Cat>
                <div className="size-h" aria-hidden="true">
                  <span className="sz sz-w">Calice</span>
                  <span className="sz sz-w">Bott.</span>
                </div>
                <div role="list">
                  <Item name="Bianco Frizzante"><WinePrice glass="4,50" /></Item>
                  <Item name="Falanghina IGT"><WinePrice glass="5,00" bottle="18,00" /></Item>
                  <Item name="Sangiovese"><WinePrice glass="4,50" bottle="17,00" /></Item>
                  <Item name="Rosato Primitivo"><WinePrice glass="5,00" bottle="19,00" /></Item>
                  <Item name="Lambrusco"><WinePrice glass="4,00" bottle="17,00" /></Item>
                  <Item name="Prosecco DOC"><WinePrice glass="5,00" bottle="24,00" /></Item>
                  <Item name="Pecorino BIO"><WinePrice glass="6,00" bottle="22,00" /></Item>
                </div>
              </section>

            </div>

            {/* ─── RIGHT ─── */}
            <div className="col">

              {/* COCKTAIL */}
              <section aria-labelledby="cocktail">
                <Cat id="cocktail">Cocktail Classici</Cat>
                <div role="list">
                  <Item name="Cocktail Della Casa" sig desc="Chiedere al banco · cambia ogni mese" price={<Price value="9,00" />} />
                  <Item name="Americano" price={<Price value="8,00" />} />
                  <Item name="Milano-Torino" price={<Price value="8,00" />} />
                  <Item name="Sbagliato" price={<Price value="8,00" />} />
                  <Item name="Garibaldi" price={<Price value="8,00" />} />
                  <Item name="Il Cardinale" price={<Price value="9,00" />} />
                  <Item name="Negroni" price={<Price value="9,00" />} />
                </div>
              </section>

              {/* LONG DRINK */}
              <section aria-labelledby="long-drink">
                <Cat id="long-drink">Long Drink</Cat>
                <div role="list">
                  <Item name="Gin & Tonic" price={<Price value="8,00" />} />
                  <Item name="Vodka Lemon" price={<Price value="8,00" />} />
                  <Item name="Mojito" price={<Price value="8,00" />} />
                  <Item name="Cuba Libre" price={<Price value="8,00" />} />
                  <Item name="Moscow Mule" price={<Price value="8,00" />} />
                  <Item name="Dark 'N' Stormy" price={<Price value="8,00" />} />
                  <Item name="Whiskey Highball" price={<Price value="8,00" />} />
                  <Item name="Bloody Mary" price={<Price value="8,00" />} />
                  <Item name="Long Island Iced Tea" price={<Price value="9,00" />} />
                  <Item name="Espresso Martini" price={<Price value="9,00" />} />
                </div>
              </section>

              {/* ANALCOLICI */}
              <section aria-labelledby="analcolici">
                <Cat id="analcolici">Analcolici</Cat>
                <div role="list">
                  <Item name="Seltz & Cordiale" price={<Price value="3,00" />} />
                  <Item name="Crodino Spritz" price={<Price value="5,00" />} />
                  <Item name="San Bitter Rosso" price={<Price value="5,00" />} />
                  <Item name="Virgin Mojito" price={<Price value="4,50" />} />
                  <Item name="Virgin Bloody Mary" price={<Price value="5,00" />} />
                  <Item name="Kombucha" price={<Price value="5,00" />} />
                  <Item name="G&T Analcolico" price={<Price value="6,50" />} />
                </div>
              </section>

              {/* SOFT DRINK */}
              <section aria-labelledby="soft">
                <Cat id="soft">Soft Drink</Cat>
                <div role="list">
                  <Item name="Acqua Naturale · Frizzante 50cl" price={<Price value="1,00" />} />
                  <Item name="Coca Cola · Zero · Fanta · Sprite · Tè" price={<Price value="3,00" />} />
                  <Item name="Ginger Beer · Ginger Ale · Tonic" price={<Price value="3,00" />} />
                  <Item name="Chinotto · Aranciata Amara" price={<Price value="3,50" />} />
                  <Item name="Succhi" price={<Price value="2,50" />} />
                  <Item name="Spremuta d'Arancia" price={<Price value="4,00" />} />
                </div>
              </section>

            </div>

            {/* ═══ FULL-WIDTH: AMARI + CARAFFE ═══ */}
            <div className="full-row">
              <section aria-labelledby="amari">
                <div className="strip" role="listitem">
                  <h3 id="amari" className="strip-label">Amari & Digestivi</h3>
                  <p className="strip-body">Amaro · Fernet · Grappa · Sambuca · Amaretto</p>
                  <Price value="4,00" />
                </div>
              </section>

              <section aria-labelledby="caraffe">
                <div className="strip" role="listitem">
                  <h3 id="caraffe" className="strip-label">Caraffe 1,5L</h3>
                  <p className="strip-body">
                    Birra <strong aria-label="15 euro">15,00</strong>
                    {" · "}
                    Spritz <strong aria-label="25 euro">25,00</strong>
                    {" · "}
                    Americano <strong aria-label="35 euro">35,00</strong>
                    {" · "}
                    Long Drink <strong aria-label="35 euro">35,00</strong>
                  </p>
                </div>
              </section>
            </div>

            {/* ═══ FULL-WIDTH: DA MANGIARE ═══ */}
            <div className="full-row food-section">
              <h2 id="cibo" className="cat cat--food">Da Mangiare</h2>

              <div className="food-grid">

                <div>
                  <SubCat>Stuzzichini</SubCat>
                  <div role="list">
                    <Item name="Chapati Con Trio Di Salse" sig desc="Pane della cucina sociale · fatto in casa ogni giorno" price={<Price value="5,00" />} />
                    <Item name="Bruschette Al Pomodoro" price={<Price value="3,50" />} />
                    <Item name="Focaccia Farcita" price={<Price value="4,00" />} />
                    <Item name="Patatine · Taralli · Olive" price={<Price value="2,00" />} />
                    <Item name="Fetta Di Torta Del Giorno" sig desc="Cucina sociale · chiedere al banco" price={<Price value="3,00" />} />
                  </div>

                  <SubCat>Tasche Di Chapati</SubCat>
                  <div role="list">
                    <Item name="Mezze Tasca" desc="Hummus, cetrioli, pomodorini, sedano, aglio" price={<Price value="7,00" />} />
                    <Item name="Veg Melt" desc="Zucchine, melanzane, crema peperoni, formaggio" price={<Price value="8,00" />} />
                    <Item name="Tonno Mediterraneo" desc="Tonno, limone, maionese, sedano, cetrioli" price={<Price value="8,00" />} />
                    <Item name="Fontina Classico" desc="Fontina, pomodorini, mortadella o salame" price={<Price value="7,00" />} />
                  </div>
                </div>

                <div>
                  <SubCat>Piatti Vegetariani</SubCat>
                  <div role="list">
                    <Item name="Piatto Vegetariana" desc="Verdure grigliate, patate, ceci, mais, cetrioli" price={<Price value="5,00" />} />
                    <Item name="Piatto Hummus" desc="Hummus cremoso, verdure crude, 2 chapati" price={<Price value="6,50" />} />
                    <Item name="Piatto Del Giorno" sig desc="Cucina sociale · chiedere al banco" price={<Price value="da 7,00" label="da 7 euro" />} />
                  </div>
                </div>

              </div>
            </div>

            {/* ═══ FULL-WIDTH: CAFFÈ ═══ */}
            <div className="full-row food-section">
              <section aria-labelledby="caffe">
                <h2 id="caffe" className="cat cat--food">Caffè</h2>
                <div className="caffe-grid">
                  <div role="list">
                    <Item name="Espresso" price={<Price value="1,30" />} />
                    <Item name="Macchiato" price={<Price value="1,50" />} />
                    <Item name="Caffè Freddo" price={<Price value="2,50" />} />
                  </div>
                  <div role="list">
                    <Item name="Cappuccino" price={<Price value="2,50" />} />
                    <Item name="Latte Macchiato" price={<Price value="3,00" />} />
                    <Item name="Marocchino" price={<Price value="2,50" />} />
                  </div>
                  <div role="list">
                    <Item name="Corretto" price={<Price value="2,00" />} />
                    <Item name="Shakerato" price={<Price value="3,50" />} />
                    <Item name="Cornetto" price={<Price value="1,80" />} />
                  </div>
                </div>
                <p className="note">+ Latte vegetale 0,50 · + Orzo / Ginseng / Decaf 0,20</p>
                <div role="list" style={{ marginTop: "10px" }}>
                  <Item name="Tè Nero · Tè Verde · Tisana" price={<Price value="3,00" />} />
                </div>
              </section>
            </div>

          </div>
          {/* end main-grid */}

        </main>

        {/* ── Footer ── */}
        <footer className="menu-footer">
          <p className="footer-venue">
            Via Nazario Sauro 24/F · Bologna
            {" · "}Cooperativa L'Altro Spazio SCS
            {" · "}Ambiente accessibile · LIS
          </p>

          <div className="footer-links" role="list">
            <span role="listitem">
              WhatsApp{" "}
              <a
                href="https://wa.me/393517048064"
                aria-label="Scrivici su WhatsApp al numero 351 704 8064"
              >
                (+39) 351 704 8064
              </a>
            </span>
            <span role="listitem" aria-hidden="true">·</span>
            <span role="listitem">
              <a
                href="https://www.instagram.com/laltrospazio/"
                aria-label="L'Altro Spazio su Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </span>
            <span role="listitem" aria-hidden="true">·</span>
            <span role="listitem">
              <a
                href="https://www.facebook.com/laltrospazio.bologna/"
                aria-label="L'Altro Spazio su Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
            </span>
          </div>

          <p className="footer-wifi" aria-label="WiFi: rete LALTROSPAZIO_CLIENTI, password lasforever">
            <span aria-hidden="true">WiFi</span>
            {" "}
            <span className="wifi-ssid" aria-hidden="true">LALTROSPAZIO_CLIENTI</span>
            {" · "}
            <span aria-hidden="true">psw</span>
            {" "}
            <span className="wifi-pass" aria-hidden="true">lasforever</span>
          </p>

          <p className="footer-note">
            <span aria-label="stella = cucina sociale">★</span>
            {" "}= Cucina sociale · Ordina al banco · Prezzi IVA inclusa
          </p>
        </footer>

      </div>

      {/* ── Scoped styles: De Tulp aesthetic, Space Mono, WCAG AA contrast ── */}
      <style>{`
        .skip-link {
          position: absolute;
          top: -100%;
          left: 0;
          z-index: 9999;
          padding: 8px 16px;
          background: #111;
          color: #fff;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 13px;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom-right-radius: 4px;
        }
        .skip-link:focus {
          top: 0;
          outline: 3px solid #B83A2A;
          outline-offset: 2px;
        }

        .menu-page {
          background: #fff;
          color: #111111;
          font-family: 'IBM Plex Mono', 'Courier New', Courier, monospace;
          font-size: 12px;
          line-height: 1.72;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          min-height: 100vh;
        }

        /* Header */
        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          max-width: 740px;
          margin: 0 auto;
          padding: 36px 44px 24px;
          border-bottom: 1px solid rgba(17,17,17,0.12);
          flex-wrap: wrap;
          gap: 12px;
        }
        .venue-name {
          font-size: 16px;
          font-weight: 700;
          letter-spacing: -0.01em;
          line-height: 1.1;
          margin: 0;
          padding: 0;
          line-height: 0;
        }
        .venue-logo {
          height: 72px;
          width: auto;
          display: block;
          mix-blend-mode: multiply;
          margin: -10px 0 -6px -10px;
        }
        .venue-sub {
          font-size: 11px;
          color: #595959;
          margin: 3px 0 0;
          letter-spacing: 0.04em;
          text-transform: none;
        }
        .header-right {
          text-align: right;
          font-size: 11px;
          color: #595959;
          letter-spacing: 0.04em;
          line-height: 1.7;
          text-transform: none;
        }
        .header-right p { margin: 0; }

        /* In-page nav — visible on keyboard focus, sr-only by default */
        .menu-nav {
          max-width: 740px;
          margin: 0 auto;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.2s;
        }
        .menu-nav:focus-within {
          max-height: 200px;
          padding: 12px 44px;
          border-bottom: 1px solid rgba(17,17,17,0.12);
        }
        .menu-nav ol {
          display: flex;
          flex-wrap: wrap;
          gap: 4px 16px;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .menu-nav a {
          font-size: 11px;
          color: #111;
          text-decoration: underline;
          letter-spacing: 0.05em;
        }
        .menu-nav a:focus {
          outline: 3px solid #B83A2A;
          outline-offset: 2px;
        }

        /* Page layout */
        .section-tops {
          display: flex;
          justify-content: space-between;
          max-width: 740px;
          margin: 0 auto;
          padding: 32px 44px 0;
        }
        .sec-h {
          font-size: 18px;
          font-weight: 700;
          line-height: 1.1;
          letter-spacing: -0.01em;
        }

        .main-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 52px;
          max-width: 740px;
          margin: 0 auto;
          padding: 20px 44px 56px;
        }
        .col { min-width: 0; }

        /* Category headings */
        .cat {
          font-weight: 700;
          font-size: 11px;
          letter-spacing: 0.07em;
          margin-top: 26px;
          margin-bottom: 8px;
          padding-bottom: 6px;
          border-bottom: 1px solid rgba(17,17,17,0.11);
        }
        .col > section:first-child .cat { margin-top: 0; }
        .cat--food { margin-top: 0; }

        .subcat {
          font-weight: 700;
          font-size: 10px;
          letter-spacing: 0.07em;
          color: #595959;
          margin-top: 18px;
          margin-bottom: 6px;
          padding-bottom: 4px;
          border-bottom: 1px solid rgba(17,17,17,0.15);
        }

        /* Item rows */
        .item {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          padding: 3px 0;
          font-variant-numeric: tabular-nums;
        }
        .item-left { flex: 1; min-width: 0; }
        .item-name { display: block; }
        .item-desc {
          display: block;
          font-size: 12px;
          color: #595959;
          margin-top: 1px;
          text-transform: none;
          letter-spacing: 0.01em;
        }
        .price { white-space: nowrap; flex-shrink: 0; }
        .sig { color: #B83A2A; }

        /* Dual price (25cl / 50cl) */
        .size-h {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          font-size: 11px;
          color: #595959;
          margin-bottom: 2px;
          letter-spacing: 0.05em;
        }
        .sz { width: 36px; text-align: right; }
        .sz-w { width: 44px; text-align: right; }
        .dual-price {
          display: flex;
          gap: 10px;
          font-variant-numeric: tabular-nums;
          flex-shrink: 0;
        }

        /* Strip rows */
        .full-row { grid-column: 1 / -1; }
        .strip {
          display: flex;
          align-items: baseline;
          gap: 8px;
          padding: 5px 0;
          border-bottom: 1px solid rgba(17,17,17,0.11);
          font-variant-numeric: tabular-nums;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .strip:first-of-type { border-top: 1px solid rgba(17,17,17,0.11); margin-top: 20px; }
        .strip-label {
          font-weight: 700;
          min-width: 160px;
          flex-shrink: 0;
          font-size: 11px;
          margin: 0;
        }
        .strip-body {
          flex: 1;
          margin: 0;
          font-size: 12px;
          font-family: 'IBM Plex Mono', 'Courier New', Courier, monospace;
          font-weight: 400;
          letter-spacing: 0.03em;
          text-transform: uppercase;
        }
        .strip-body strong { font-weight: 400; }

        /* Food section */
        .food-section {
          margin-top: 24px;
          border-top: 1px solid rgba(17,17,17,0.11);
          padding-top: 6px;
        }
        .food-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0 52px;
          margin-top: 4px;
        }

        /* Caffè grid */
        .caffe-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 0 40px;
        }
        .note {
          font-size: 11px;
          color: #595959;
          margin-top: 5px;
          line-height: 1.7;
          text-transform: none;
          letter-spacing: 0.01em;
        }

        /* Footer */
        .menu-footer {
          max-width: 740px;
          margin: 0 auto;
          padding: 14px 44px 32px;
          border-top: 1px solid rgba(17,17,17,0.15);
          font-size: 11px;
          color: #595959;
          letter-spacing: 0.04em;
          text-transform: none;
        }
        .menu-footer p { margin: 3px 0; }
        .menu-footer a {
          color: #111;
          text-decoration-color: rgba(17,17,17,0.4);
        }
        .menu-footer a:focus {
          outline: 3px solid #B83A2A;
          outline-offset: 2px;
          border-radius: 2px;
        }
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 0 8px;
          margin: 5px 0;
          align-items: baseline;
        }
        .footer-wifi {
          margin-top: 6px !important;
          color: #111;
        }
        .wifi-ssid { font-weight: 700; }
        .wifi-pass { font-weight: 700; letter-spacing: 0.06em; }
        .footer-note { margin-top: 8px !important; }

        /* Focus styles for all interactive elements */
        a:focus-visible,
        button:focus-visible {
          outline: 3px solid #B83A2A;
          outline-offset: 2px;
          border-radius: 2px;
        }

        /* nav-label: hidden on desktop, visible on mobile */
        .nav-label { display: none; }

        /* Responsive */
        @media (max-width: 580px) {
          .menu-header { padding: 24px 18px 18px; }
          .header-right { text-align: left; }
          .section-tops { display: none; }

          /* Nav: always visible + horizontal scroll */
          .menu-nav,
          .menu-nav:focus-within {
            max-height: none;
            overflow-y: hidden;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
            padding: 8px 18px 10px;
            border-bottom: 1px solid rgba(17,17,17,0.12);
            transition: none;
            scrollbar-width: none;
            -webkit-mask-image: linear-gradient(to right, black 0%, black 78%, transparent 100%);
            mask-image: linear-gradient(to right, black 0%, black 78%, transparent 100%);
          }
          .menu-nav::-webkit-scrollbar { display: none; }
          .menu-nav ol { flex-wrap: nowrap; }
          .menu-nav a {
            display: inline-block;
            padding: 10px 6px;
            min-height: 44px;
            line-height: 24px;
            box-sizing: border-box;
          }
          .nav-label {
            display: block;
            font-size: 10px;
            color: #595959;
            letter-spacing: 0.06em;
            margin-bottom: 4px;
          }
          .nav-label::after {
            content: ' ›';
            opacity: 0.5;
          }

          /* Cocktail Classici: restore top margin when stacked below Vino */
          .col + .col > section:first-child .cat { margin-top: 26px; }

          .main-grid { grid-template-columns: 1fr; padding: 16px 18px 44px; }
          .full-row { grid-column: 1; }
          .food-grid { grid-template-columns: 1fr; }
          .caffe-grid { grid-template-columns: 1fr 1fr; }

          /* Strip rows: stack on mobile to avoid price wrapping */
          .strip { flex-direction: column; align-items: flex-start; gap: 2px; }
          .strip-label { min-width: auto; }
          .strip-body { flex: none; }

          .menu-footer { padding: 14px 18px 28px; }

          /* Footer links: column layout + 44px tap targets */
          .footer-links { flex-direction: column; gap: 0; }
          .footer-links span[aria-hidden="true"] { display: none; }
          .footer-links span[role="listitem"]:not([aria-hidden]) {
            display: flex;
            align-items: center;
            min-height: 44px;
          }
          .footer-links a {
            display: inline-flex;
            align-items: center;
            min-height: 44px;
            padding: 0 4px;
            box-sizing: border-box;
          }

          .sec-h { font-size: 15px; }
        }

        @media (max-width: 400px) {
          .caffe-grid { grid-template-columns: 1fr; }
        }

        @media print {
          .skip-link, .menu-nav { display: none; }
          .menu-page { font-size: 8.5px; line-height: 1.6; }
          .main-grid, .menu-header, .section-tops { max-width: none; padding: 8px 14px; }
          .cat { margin-top: 12px; }
          @page { margin: 10mm 12mm; size: A4 portrait; }
        }

        @media (prefers-reduced-motion: reduce) {
          .menu-nav { transition: none; }
        }
      `}</style>
    </>
  );
}
