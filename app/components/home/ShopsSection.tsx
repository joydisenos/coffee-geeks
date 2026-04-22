import Link from "next/link";

const SHOPS = [
  {
    id: "kotowa",
    type: "coffee",
    name: "Kotowa",
    cat: "Coffee House",
    loc: "La Chorrera | Costa Verde",
    votes: 175,
    img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75",
  },
  {
    id: "tosto",
    type: "coffee",
    name: "Tosto",
    cat: "Coffee Co.",
    loc: "San Francisco | Panamá",
    votes: 162,
    img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=75",
  },
  {
    id: "tonos",
    type: "rest",
    name: "Toño's",
    cat: "Café Bakery",
    loc: "Colón | Margarita",
    votes: 148,
    img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=75",
  },
  {
    id: "unido",
    type: "coffee",
    name: "Unido",
    cat: "Panama Coffee Roasters",
    loc: "Casco Viejo | Panamá",
    votes: 134,
    img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=75",
  },
  {
    id: "radisson",
    type: "hotel",
    name: "Radisson",
    cat: "Café & Lobby Bar",
    loc: "Paitilla | Panamá",
    votes: 118,
    img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=75",
  },
  {
    id: "origin",
    type: "coffee",
    name: "Origin",
    cat: "Specialty Coffee",
    loc: "Boquete | Chiriquí",
    votes: 96,
    img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=75",
  },
];

export default function ShopsSection() {
  return (
    <>
      <style>{`
        .shops-sec { background: #FFFFFF; padding: 80px 0; }
        .shops-wrap { width: 100%; max-width: 1160px; margin: 0 auto; padding: 0 clamp(20px,5vw,60px); }
        .sec-row { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 40px; flex-wrap: wrap; }
        .eyebrow-row { display: flex; align-items: center; gap: 9px; margin-bottom: 6px; }
        .eyebrow-line-p { width: 24px; height: 2px; background: #9E3A52; flex-shrink: 0; }
        .eyebrow-text-p { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: .16em; text-transform: uppercase; color: #9E3A52; }
        .sec-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(28px,4vw,42px); font-weight: 900; text-transform: uppercase; color: #22191A; line-height: .92; margin-top: 6px; }
        .sec-sub { font-family: 'Barlow', sans-serif; font-size: 16px; color: #524345; margin-top: 7px; max-width: 400px; line-height: 1.7; }
        .btn-out {
          display: inline-flex; align-items: center; height: 40px; padding: 0 24px;
          border-radius: 50px; border: 1px solid #857375; background: transparent;
          color: #9E3A52; font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all .2s; text-decoration: none;
        }
        .btn-out:hover { background: #9E3A52; color: #fff; border-color: #9E3A52; }
        .shops-ctrl { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
        .shops-badge { font-family: 'Barlow Condensed', sans-serif; font-size: .78rem; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #9E3A52; background: #FFD9E2; padding: 5px 13px; border-radius: 50px; border: 1px solid rgba(158,58,82,.12); flex-shrink: 0; }
        .shops-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
        .sc { background: #FEF0F1; border-radius: 16px; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 1px 3px 1px rgba(0,0,0,.08); transition: box-shadow .25s, transform .25s; cursor: pointer; border: 1px solid rgba(92,14,32,.05); }
        .sc:hover { box-shadow: 0 4px 8px 3px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.12); transform: translateY(-5px); }
        .sc-img { width: 100%; aspect-ratio: 1/1; background-size: cover; background-position: center; display: flex; align-items: flex-start; justify-content: flex-end; padding: 9px; }
        .sc-badge { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .04em; background: #9E3A52; color: #fff; padding: 4px 9px; border-radius: 50px; }
        .sc-body { padding: 13px 14px 11px; }
        .sc-cat { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #9E3A52; margin-bottom: 1px; }
        .sc-name { font-family: 'Barlow Condensed', sans-serif; font-size: 1.45rem; font-weight: 900; text-transform: uppercase; color: #22191A; line-height: 1.05; margin-bottom: 4px; }
        .sc-loc { display: flex; align-items: center; gap: 5px; font-family: 'Barlow', sans-serif; font-size: 13px; color: #524345; margin-bottom: 11px; }
        .sc-acts { display: flex; gap: 7px; padding-top: 9px; border-top: 1px solid #D6C2C4; }
        .scb { flex: 1; height: 33px; border-radius: 50px; border: none; font-family: 'Barlow', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: box-shadow .15s; }
        .scb-v { background: #9E3A52; color: #fff; }
        .scb-v:hover { box-shadow: 0 1px 2px rgba(0,0,0,.12), 0 2px 6px 2px rgba(0,0,0,.08); }
        .scb-p { background: #F2E2E4; color: #9E3A52; }
        .spons-row { margin-top: 36px; padding-top: 28px; border-top: 1px solid #D6C2C4; display: flex; align-items: center; justify-content: center; gap: 14px; flex-wrap: wrap; }
        .chip-static { display: inline-flex; align-items: center; height: 32px; padding: 0 12px; border-radius: 8px; border: 1px solid #D6C2C4; font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 500; color: #524345; }
        @media (max-width: 960px) { .shops-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .shops-grid { grid-template-columns: 1fr; } }
      `}</style>

      <section className="shops-sec">
        <div className="shops-wrap">
          <div className="sec-row">
            <div>
              <div className="eyebrow-row">
                <div className="eyebrow-line-p" />
                <span className="eyebrow-text-p">Los protagonistas</span>
              </div>
              <h2 className="sec-title">De la ruta<br />del café</h2>
              <p className="sec-sub">Conoce las cafeterías que están redefiniendo el estándar del café en Panamá</p>
            </div>
            <Link href="/participantes" className="btn-out">Ver todas →</Link>
          </div>

          <div className="shops-ctrl">
            <span className="shops-badge">24 cafeterías registradas</span>
          </div>

          <div className="shops-grid">
            {SHOPS.map((shop) => (
              <div className="sc" key={shop.id}>
                <div className="sc-img" style={{ backgroundImage: `url('${shop.img}')` }}>
                  <span className="sc-badge">{shop.votes} votos</span>
                </div>
                <div className="sc-body">
                  <div className="sc-cat">{shop.cat}</div>
                  <div className="sc-name">{shop.name}</div>
                  <div className="sc-loc">
                    <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: "#9E3A52", fill: "none", strokeWidth: 1.5, flexShrink: 0 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {shop.loc}
                  </div>
                  <div className="sc-acts">
                    <button className="scb scb-v">Votar</button>
                    <button className="scb scb-p">Ver perfil</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center", padding: "24px 0 0" }}>
            <Link href="/participantes" className="btn-out">Ver todos los participantes →</Link>
          </div>

          <div className="spons-row">
            {["Kotowa", "Tosto Co.", "Unido", "Toño's", "Origin"].map((n) => (
              <div className="chip-static" key={n}>{n}</div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
