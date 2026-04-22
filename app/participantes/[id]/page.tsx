"use client";

import { useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import VoteModal from "@/app/components/VoteModal";

const SHOPS: Record<string, {
  id: string; name: string; cat: string; sub: string;
  loc: string; addr: string; votes: number;
  img: string; img2: string;
  desc: string; hours: string; phone: string; web: string;
  score: number; scorePub: number; scoreJurado: number;
  barista: string; barista_role: string;
}> = {
  kotowa: {
    id: "kotowa", name: "Kotowa", cat: "Coffee House", sub: "Specialty Coffee · Costa Rica",
    loc: "La Chorrera | Costa Verde", addr: "Blvd Costa Verde, La Chorrera",
    votes: 175, img: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=75",
    desc: "Kotowa es una marca de café panameño de origen que nació en las montañas de Boquete. Con más de 25 años de tradición, cada taza es el resultado de un proceso cuidadoso desde el cultivo hasta la extracción, con cafés de especialidad que han ganado reconocimiento internacional.",
    hours: "Lun–Vie 7am–9pm · Sáb–Dom 8am–10pm",
    phone: "+507 6234-5678", web: "www.kotowacoffee.com",
    score: 89, scorePub: 88, scoreJurado: 91,
    barista: "Andrés Morales", barista_role: "Head Barista · Q Grader certificado",
  },
  tosto: {
    id: "tosto", name: "Tosto", cat: "Coffee Co.", sub: "Espresso Bar · Panamá",
    loc: "San Francisco | Panamá", addr: "Av. 2B Sur, San Francisco, Panamá",
    votes: 162, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1502462094501-5b9cb3c85fb7?w=800&q=75",
    desc: "Tosto nació en el corazón de San Francisco para democratizar el café de especialidad en Panamá. Un espacio moderno con extracciones de precisión, catas educativas y los mejores orígenes latinoamericanos.",
    hours: "Lun–Vie 6:30am–8pm · Sáb 7am–9pm · Dom Cerrado",
    phone: "+507 6123-9900", web: "www.tostocoffee.com",
    score: 85, scorePub: 84, scoreJurado: 88,
    barista: "Valeria Sánchez", barista_role: "Barista Campeona Nacional 2024",
  },
  tonos: {
    id: "tonos", name: "Toño's", cat: "Café Bakery", sub: "Café & Panadería",
    loc: "Colón | Margarita", addr: "Calle 5ta, Barrio Margarita, Colón",
    votes: 148, img: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&q=75",
    desc: "Toño's es un ícono colonense que combina la tradición del café panameño con la mejor repostería artesanal. Tres generaciones de familia han perfeccionado la receta de un espresso cremoso y una atmósfera cálida que te hace sentir en casa.",
    hours: "Lun–Dom 6am–8pm",
    phone: "+507 6811-2233", web: "www.tonosbakery.com",
    score: 82, scorePub: 81, scoreJurado: 85,
    barista: "Antonio Rodríguez Jr.", barista_role: "Maestro cafetero · 3ra generación",
  },
  unido: {
    id: "unido", name: "Unido", cat: "Panama Coffee Roasters", sub: "Tostador & Bar",
    loc: "Casco Viejo | Panamá", addr: "Calle 3ra, Casco Viejo, Panamá",
    votes: 134, img: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&q=75",
    desc: "Unido es el resultado de unir a productores de café chiriquí con los mejores baristas de Panamá. En el corazón del Casco Viejo, tuestan sus propios lotes de microlot y comparten la historia de cada grano con quienes los visitan.",
    hours: "Mar–Dom 8am–8pm · Lun Cerrado",
    phone: "+507 6550-7788", web: "www.unidocoffee.pa",
    score: 80, scorePub: 79, scoreJurado: 84,
    barista: "Laura Díaz", barista_role: "Roaster & Barista",
  },
  radisson: {
    id: "radisson", name: "Radisson", cat: "Café & Lobby Bar", sub: "Hotel Specialty Bar",
    loc: "Paitilla | Panamá", addr: "Av. Balboa, Paitilla, Panamá",
    votes: 118, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=75",
    desc: "El café bar del Radisson Decapolis transformó la experiencia de lobby en una propuesta de especialidad. Con vistas a la bahía de Panamá y una selección de orígenes únicos, eleva el estándar del café en la industria hotelera.",
    hours: "Todos los días 6am–11pm",
    phone: "+507 215-5000", web: "www.radissondecapolis.com/coffee",
    score: 77, scorePub: 76, scoreJurado: 80,
    barista: "Carlos Mendoza", barista_role: "F&B Barista Especialista",
  },
  origin: {
    id: "origin", name: "Origin", cat: "Specialty Coffee", sub: "Farm to Cup · Boquete",
    loc: "Boquete | Chiriquí", addr: "Ave Central, Boquete, Chiriquí",
    votes: 96, img: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&q=75",
    desc: "Origin nació en Boquete con una misión simple: conectar directamente a los productores de la región con el consumidor final. Sus planes de suscripción y experiencias de finca han posicionado a Boquete en el mapa del café mundial.",
    hours: "Lun–Sáb 7am–7pm · Dom 8am–5pm",
    phone: "+507 6990-1234", web: "www.origincoffeeboquete.com",
    score: 86, scorePub: 85, scoreJurado: 90,
    barista: "María González", barista_role: "Q Grader · Productora-Barista",
  },
  pergamino: {
    id: "pergamino", name: "Pergamino", cat: "Brew Bar", sub: "Filter Coffee • Métodos",
    loc: "Casco Viejo | Panamá", addr: "Plaza Herrera, Casco Viejo",
    votes: 82, img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80",
    img2: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=75",
    desc: "Pergamino es el templo del café filtrado en Panamá. Especializados en métodos de extracción manual como V60, Chemex y AeroPress, cada taza es preparada con precisión científica y servida con la historia del lote que estás bebiendo.",
    hours: "Lun–Vie 8am–6pm · Sáb 9am–7pm · Dom Cerrado",
    phone: "+507 6444-8899", web: "www.pergaminocafe.pa",
    score: 83, scorePub: 82, scoreJurado: 87,
    barista: "Roberto Castillo", barista_role: "Filter Coffee Specialist",
  },
};

export default function PerfilPage({ params }: { params: { id: string } }) {
  const shop = SHOPS[params.id];
  if (!shop) notFound();

  const [voteModal, setVoteModal] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&family=Barlow:wght@300;400;500&display=swap');

        .perf-hero{position:relative;height:340px;background-size:cover;background-position:center}
        .perf-hero-sc{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(61,8,20,.5) 0%,rgba(61,8,20,.88) 100%)}
        .perf-hero-cnt{position:relative;z-index:2;height:100%;display:flex;flex-direction:column;justify-content:flex-end;padding:0 0 32px}
        .perf-cat{font-family:'Barlow',sans-serif;font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:rgba(196,212,232,.6);margin-bottom:4px}
        .perf-name{font-family:'Barlow Condensed',sans-serif;font-size:clamp(38px,5vw,56px);font-weight:900;text-transform:uppercase;color:#fff;line-height:.92}
        .perf-sub{font-family:'Barlow',sans-serif;font-size:14px;color:rgba(255,255,255,.42);margin-top:6px}
        .bread{background:#5C0E20;border-bottom:1px solid rgba(255,255,255,.06)}
        .bread-i{display:flex;align-items:center;gap:7px;padding:9px 0;font-family:'Barlow',sans-serif;font-size:12px}
        .bread-i a{color:rgba(255,255,255,.45);transition:color .2s;text-decoration:none}
        .bread-i a:hover{color:#fff}
        .bread-i span{color:rgba(255,255,255,.25)}
        .wrap{width:100%;max-width:1160px;margin:0 auto;padding:0 clamp(20px,5vw,60px)}
        .perf-wrap{display:grid;grid-template-columns:1fr 320px;gap:0;align-items:start;padding:40px 0 80px;background:#FFF8F7}
        .perf-main{padding:0 32px 0 0}
        .perf-photo{aspect-ratio:4/3;background-size:cover;background-position:center;border-radius:16px;margin-bottom:24px}
        .perf-loc-h{font-family:'Barlow Condensed',sans-serif;font-size:clamp(18px,2.5vw,26px);font-weight:900;text-transform:uppercase;color:#9E3A52;margin-bottom:1px}
        .perf-loc-s{font-family:'Barlow Condensed',sans-serif;font-size:.95rem;font-weight:700;text-transform:uppercase;color:#22191A;margin-bottom:12px}

        /* Map placeholder */
        .map-box{width:100%;height:200px;border-radius:16px;overflow:hidden;position:relative;background:linear-gradient(135deg,#C8D8F0,#B4C8E0);border:1px solid #D6C2C4;margin-top:12px}
        .map-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(158,58,82,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(158,58,82,.1) 1px,transparent 1px);background-size:26px 26px}
        .map-pin{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
        .map-pin svg{width:34px;height:34px;fill:#9E3A52;filter:drop-shadow(0 2px 5px rgba(158,58,82,.5))}

        /* Tabs */
        .tabs{display:flex;gap:0;border-bottom:2px solid #D6C2C4;margin-bottom:24px}
        .tab{font-family:'Barlow',sans-serif;font-size:14px;font-weight:500;color:#857375;padding:10px 18px;cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-2px;transition:all .2s}
        .tab.on{color:#9E3A52;border-bottom-color:#9E3A52;font-weight:700}

        /* Score bars */
        .score-row{margin-bottom:14px}
        .score-label{font-family:'Barlow',sans-serif;font-size:12px;font-weight:500;color:#524345;margin-bottom:5px;display:flex;justify-content:space-between}
        .score-label span{font-weight:700;color:#9E3A52}
        .score-bar{height:7px;border-radius:50px;background:#F2E2E4;overflow:hidden}
        .score-fill{height:100%;border-radius:50px;background:linear-gradient(90deg,#9E3A52,#C46A28);transition:width .8s ease}

        /* Info items */
        .info-item{display:flex;align-items:flex-start;gap:10px;padding:11px 0;border-bottom:1px solid #F2E2E4;font-family:'Barlow',sans-serif;font-size:14px;color:#22191A}
        .info-item:last-child{border-bottom:none}
        .info-item a{color:#9E3A52;text-decoration:none}
        .info-item a:hover{text-decoration:underline}

        /* Sticky sidebar card */
        .perf-sidebar{padding:0 0 40px;position:sticky;top:76px;align-self:flex-start;max-height:calc(100vh - 90px);overflow:auto;scrollbar-width:none}
        .perf-sidebar::-webkit-scrollbar{display:none}
        .stk-card{background:#3D0814;border-radius:28px;overflow:hidden;box-shadow:0 4px 8px 3px rgba(0,0,0,.1)}
        .stk-img{width:100%;aspect-ratio:16/9;background-size:cover;background-position:center}
        .stk-body{padding:16px 16px 20px}
        .stk-name{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:900;text-transform:uppercase;color:#fff;margin-bottom:1px}
        .stk-sub{font-family:'Barlow Condensed',sans-serif;font-size:.72rem;font-weight:700;text-transform:uppercase;color:#C4D4E8;margin-bottom:7px}
        .stk-loc{display:flex;align-items:center;gap:5px;font-size:13px;color:rgba(255,255,255,.42);font-family:'Barlow',sans-serif;margin-bottom:14px}
        .stk-vote-btn{width:100%;height:38px;border-radius:50px;border:none;background:#C4D4E8;color:#3D0814;font-family:'Barlow Condensed',sans-serif;font-size:.82rem;font-weight:900;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;transition:all .2s}
        .stk-vote-btn:hover{background:#fff;color:#3D0814}
        .stk-div{height:1px;background:rgba(255,255,255,.1);margin:12px 0}
        .stk-stat{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}
        .stk-sl{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:rgba(255,255,255,.38);font-family:'Barlow',sans-serif}
        .stk-sv{font-family:'Barlow Condensed',sans-serif;font-size:.85rem;font-weight:700;color:rgba(255,255,255,.8)}
        .stk-score{font-family:'Barlow Condensed',sans-serif;font-size:2.8rem;font-weight:900;color:#C4D4E8;line-height:1;text-align:center;padding:12px 0 6px}
        .stk-score small{display:block;font-size:11px;color:rgba(255,255,255,.35);letter-spacing:.08em;font-family:'Barlow',sans-serif;text-transform:uppercase;font-weight:400}

        /* Barista card */
        .barista-card{background:#F2E2E4;border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px;margin-bottom:16px}
        .barista-av{width:50px;height:50px;border-radius:50%;background:#9E3A52;display:flex;align-items:center;justify-content:center;color:#fff;font-family:'Barlow Condensed',sans-serif;font-size:1.3rem;font-weight:900;flex-shrink:0}
        .barista-name{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:900;text-transform:uppercase;color:#22191A}
        .barista-role{font-family:'Barlow',sans-serif;font-size:12px;color:#524345}

        @media(max-width:960px){.perf-wrap{grid-template-columns:1fr;gap:0}.perf-main{padding:0}.perf-sidebar{position:static;max-height:none;padding-bottom:0}}
      `}</style>

      <Navbar />

      {/* Hero */}
      <div className="perf-hero" style={{ backgroundImage: `url('${shop.img}')` }}>
        <div className="perf-hero-sc" />
        <div className="perf-hero-cnt">
          <div className="wrap">
            <div className="perf-cat">{shop.cat}</div>
            <div className="perf-name">{shop.name}</div>
            <div className="perf-sub">{shop.sub} · {shop.loc}</div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bread">
        <div className="wrap">
          <div className="bread-i">
            <Link href="/home">Inicio</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "rgba(255,255,255,.3)", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <Link href="/participantes">Participantes</Link>
            <svg viewBox="0 0 24 24" style={{ width: 12, height: 12, stroke: "rgba(255,255,255,.3)", fill: "none", strokeWidth: 2 }}><polyline points="9 18 15 12 9 6" /></svg>
            <span>{shop.name}</span>
          </div>
        </div>
      </div>

      {/* Profile body */}
      <div style={{ background: "#FFF8F7" }}>
        <div className="wrap">
          <div className="perf-wrap">
            {/* Main content */}
            <div className="perf-main">
              {/* Photo */}
              <div className="perf-photo" style={{ backgroundImage: `url('${shop.img2}')` }} />

              {/* Location */}
              <div className="perf-loc-h">{shop.name}</div>
              <div className="perf-loc-s">{shop.sub}</div>

              {/* Barista */}
              <div className="barista-card">
                <div className="barista-av">{shop.barista.charAt(0)}</div>
                <div>
                  <div className="barista-name">{shop.barista}</div>
                  <div className="barista-role">{shop.barista_role}</div>
                </div>
              </div>

              {/* About */}
              <p style={{ fontFamily: "'Barlow',sans-serif", fontSize: 15, lineHeight: 1.7, color: "#22191A", marginBottom: 24 }}>
                {shop.desc}
              </p>

              {/* Score bars */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase", color: "#3D0814", marginBottom: 14 }}>Puntaje del concurso</div>
                {[
                  { label: "Puntaje global", val: shop.score },
                  { label: "Votos del público (30%)", val: shop.scorePub },
                  { label: "Evaluación del jurado (70%)", val: shop.scoreJurado },
                ].map(({ label, val }) => (
                  <div key={label} className="score-row">
                    <div className="score-label">{label}<span>{val}/100</span></div>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Info */}
              <div style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: "1.1rem", fontWeight: 900, textTransform: "uppercase", color: "#3D0814", marginBottom: 8 }}>Información</div>
              {[
                { icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 10 m-3 0a3 3 0 0 0 6 0 3 3 0 0 0-6 0", label: shop.addr },
                { icon: "M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z M12 13A3 3 0 1 0 12 7a3 3 0 0 0 0 6z", label: shop.hours, alt: true },
                { icon: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z", label: shop.phone },
              ].map((item, i) => (
                <div key={i} className="info-item">
                  <svg viewBox="0 0 24 24" style={{ width: 16, height: 16, stroke: "#9E3A52", fill: "none", strokeWidth: 1.5, flexShrink: 0, marginTop: 1 }}>
                    <path d={item.icon} />
                  </svg>
                  {item.label}
                </div>
              ))}

              {/* Map placeholder */}
              <div className="map-box">
                <div className="map-grid" />
                <div className="map-pin">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#9E3A52" />
                  </svg>
                </div>
                <div style={{ position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)", fontFamily: "'Barlow',sans-serif", fontSize: 12, color: "#524345", background: "#fff", padding: "3px 10px", borderRadius: 50 }}>
                  {shop.addr}
                </div>
              </div>
            </div>

            {/* Sticky sidebar */}
            <div className="perf-sidebar">
              <div className="stk-card">
                <div className="stk-img" style={{ backgroundImage: `url('${shop.img}')` }} />
                <div className="stk-body">
                  <div className="stk-name">{shop.name}</div>
                  <div className="stk-sub">{shop.sub}</div>
                  <div className="stk-loc">
                    <svg viewBox="0 0 24 24" style={{ width: 11, height: 11, stroke: "rgba(255,255,255,.4)", fill: "none", strokeWidth: 1.5 }}>
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                    </svg>
                    {shop.loc}
                  </div>
                  <div className="stk-score">
                    {shop.score}
                    <small>Puntaje global</small>
                  </div>
                  <button className="stk-vote-btn" onClick={() => setVoteModal(true)}>
                    ⭐ Votar por {shop.name}
                  </button>
                  <div className="stk-div" />
                  <div className="stk-stat">
                    <span className="stk-sl">Votos del público</span>
                    <span className="stk-sv">{shop.votes.toLocaleString()}</span>
                  </div>
                  <div className="stk-stat">
                    <span className="stk-sl">Puntaje jurado</span>
                    <span className="stk-sv">{shop.scoreJurado}/100</span>
                  </div>
                  <div className="stk-stat">
                    <span className="stk-sl">Posición actual</span>
                    <span className="stk-sv">#3 en ranking</span>
                  </div>
                </div>
              </div>

              {/* Back links */}
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 8 }}>
                <Link
                  href="/participantes"
                  style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#9E3A52", textDecoration: "none" }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><polyline points="15 18 9 12 15 6" /></svg>
                  Ver todos los participantes
                </Link>
                <Link
                  href="/votaciones"
                  style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "'Barlow',sans-serif", fontSize: 13, color: "#9E3A52", textDecoration: "none" }}
                >
                  <svg viewBox="0 0 24 24" style={{ width: 14, height: 14, stroke: "currentColor", fill: "none", strokeWidth: 2 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                  Ver ranking de votaciones
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <VoteModal
        open={voteModal}
        preselected={shop.id}
        onClose={() => setVoteModal(false)}
      />
    </>
  );
}
