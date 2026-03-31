import { useState, useRef, useCallback, useEffect } from "react";

const today = new Date().toISOString().split("T")[0];
const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().split("T")[0]; };

// Using picsum.photos — works in all environments including artifacts
const EP = [
  "https://picsum.photos/seed/estate1/600/400",
  "https://picsum.photos/seed/estate2/600/400",
  "https://picsum.photos/seed/estate3/600/400",
  "https://picsum.photos/seed/estate4/600/400",
];
const GP = [
  "https://picsum.photos/seed/garage1/600/400",
  "https://picsum.photos/seed/garage2/600/400",
  "https://picsum.photos/seed/garage3/600/400",
];
const TP = [
  "https://picsum.photos/seed/thrift1/600/400",
  "https://picsum.photos/seed/thrift2/600/400",
  "https://picsum.photos/seed/thrift3/600/400",
];

const MOCK_SALES = [
  { id:"es-001", title:"Stunning Mid-Century Modern Estate Sale", type:"estate", address:"4521 Lindell Blvd", city:"St. Louis", state:"MO", zip:"63108", distance:0.8, startDate:today, endDate:d(1), description:"Mid-century modern collection: Herman Miller chairs, Eames-era furniture, Danish modern pieces, vintage electronics, and a 50-year art collection. Hosted by a retired professor. Everything priced to sell.", source:"EstateSales.net", url:"https://www.estatesales.net", tags:["mid-century modern","furniture","art","collectibles"], featured:true, photos:[EP[0],EP[1],EP[2],EP[3]] },
  { id:"es-002", title:"Forest Hills Estate — Antiques & Vintage Jewelry", type:"estate", address:"275 Forest Hills Dr", city:"Ladue", state:"MO", zip:"63124", distance:2.4, startDate:today, endDate:d(1), description:"Antique jewelry, sterling silver flatware, Victorian furniture, vintage clothing, china sets, and first-edition books. Estate of a lifelong collector. Jewelry appraised and tagged.", source:"EstateSales.net", url:"https://www.estatesales.net", tags:["jewelry","silver","Victorian","books","china"], featured:true, photos:[EP[1],EP[3],EP[0]] },
  { id:"gs-001", title:"Multi-Family Garage Sale — Tools & Collectibles", type:"garage", address:"1847 Skinker Blvd", city:"St. Louis", state:"MO", zip:"63110", distance:1.2, startDate:today, endDate:today, description:"4 families! Vintage tools, old toys, sports memorabilia, vintage kitchen items, records, and books. Early birds welcome! Cash preferred.", source:"Craigslist", url:"https://stlouis.craigslist.org", tags:["tools","toys","records","sports"], featured:false, photos:[GP[0],GP[1],GP[2]] },
  { id:"gs-002", title:"Moving Sale — Everything Must Go!", type:"garage", address:"5640 Westminster Place", city:"St. Louis", state:"MO", zip:"63112", distance:1.9, startDate:today, endDate:d(1), description:"Relocating overseas. Mid-century furniture, 500+ vinyl records, vintage cameras, antique maps, and household items. Serious offers welcome.", source:"Facebook Marketplace", url:"https://www.facebook.com/marketplace", tags:["records","cameras","maps","furniture"], featured:false, photos:[GP[1],GP[0]] },
  { id:"tt-001", title:"Goodwill — Forest Park Area", type:"thrift", address:"4340 Lindell Blvd", city:"St. Louis", state:"MO", zip:"63108", distance:0.5, startDate:today, endDate:d(7), description:"Large Goodwill near Forest Park. Housewares, clothing, books. New items stocked daily. Senior discount Tuesdays.", source:"Thrift Store", url:"https://www.goodwill.org", tags:["goodwill","clothing","housewares","books"], featured:false, photos:TP },
  { id:"tt-002", title:"St. Vincent de Paul — South City", type:"thrift", address:"3008 Meramec St", city:"St. Louis", state:"MO", zip:"63118", distance:3.1, startDate:today, endDate:d(7), description:"SVdP known for furniture, vintage housewares, and excellent antique finds. Half-price Saturdays on clothing.", source:"Thrift Store", url:"https://www.svdpusa.org", tags:["SVdP","furniture","antiques","half-price"], featured:false, photos:[TP[1],TP[0]] },
  { id:"es-003", title:"Clayton Estate — Fine Art & Silver Collection", type:"estate", address:"7825 Maryland Ave", city:"Clayton", state:"MO", zip:"63105", distance:3.7, startDate:d(1), endDate:d(7), description:"Estate of an art collector. Original oil paintings, bronze sculptures, silver collection, antique instruments, and rare Missouri maps.", source:"EstateSales.net", url:"https://www.estatesales.net", tags:["fine art","oil paintings","bronze","silver","maps"], featured:true, photos:[EP[2],EP[0],EP[1]] },
  { id:"gs-003", title:"Neighborhood Block Sale — Vintage & Retro", type:"garage", address:"2211 Magnolia Ave", city:"St. Louis", state:"MO", zip:"63104", distance:2.8, startDate:d(1), endDate:d(1), description:"8+ homes participating! 70s–80s collectibles, vintage clothing, vinyl records, and vintage video games.", source:"Facebook Marketplace", url:"https://www.facebook.com/marketplace", tags:["retro","70s","80s","records","video games"], featured:false, photos:GP },
  { id:"tt-003", title:"Savers — Manchester Road", type:"thrift", address:"12639 Manchester Rd", city:"Des Peres", state:"MO", zip:"63131", distance:7.2, startDate:today, endDate:d(7), description:"Large Savers with great housewares and kitchenware. Rotating stock and weekend sales.", source:"Thrift Store", url:"https://www.savers.com", tags:["savers","housewares","kitchenware"], featured:false, photos:TP },
  { id:"es-004", title:"Webster Groves Estate — Vintage Kitchen & Garden", type:"estate", address:"555 Elm Ave", city:"Webster Groves", state:"MO", zip:"63119", distance:5.6, startDate:d(1), endDate:d(7), description:"Vintage kitchen collection: cast iron, Pyrex, enamelware, vintage garden tools, pottery, and farmhouse décor.", source:"EstateSales.net", url:"https://www.estatesales.net", tags:["vintage kitchen","cast iron","Pyrex","enamelware","garden"], featured:false, photos:[EP[3],EP[0]] },
];

const FOLDERS = ["My Finds","Furniture","Jewelry","Art & Decor","Vintage","Electronics"];
const MAX_PHOTOS = 4;
const FILTERS = ["all","estate","garage","thrift"];
const RADIUS_OPTIONS = [5,10,25,50];
const NEGOTIATION_TIPS = {
  estate:["Arrive 30 min before opening for best selection","Ask about discounts on the last day (often 50% off)","Bundle multiple items for a better deal","Bring cash — many estate sales prefer it","Inspect items carefully; all sales are usually final"],
  garage:["Early birds get best picks, late birds get best prices","Make a reasonable first offer (20–30% below asking)","Ask if prices are firm or negotiable upfront","Buy in bundles — offer one price for a group","Be friendly and conversational — it helps get deals"],
  thrift:["Check color tag rotation for 50% off days","Visit on restock days (often Mon/Tue) for best selection","Look for hidden gems in electronics and housewares","Check inside pots/containers for items hiding inside","Senior discount days can be combined with sale days"],
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');
  * { box-sizing:border-box; margin:0; padding:0; -webkit-tap-highlight-color:transparent; }
  body { background:#f0ebe2; font-family:'DM Sans',sans-serif; }
  :root {
    --cream:#f0ebe2; --cream-dark:#e4ddd1; --terracotta:#a0522d; --terra-light:#c8714a;
    --forest:#2d4a3e; --forest-light:#3d6b5a; --brown:#5c3d2e;
    --text:#2a1f14; --text-secondary:#6b5a4a; --text-muted:#9b8878;
    --surface:#faf7f2; --border:rgba(92,61,46,0.12); --border-strong:rgba(92,61,46,0.22);
    --shadow:0 2px 16px rgba(44,31,20,0.08); --shadow-lg:0 8px 32px rgba(44,31,20,0.14);
  }
  .app { max-width:430px; margin:0 auto; min-height:100vh; background:var(--cream); position:relative; overflow-x:hidden; }

  /* HEADER */
  .header { padding:52px 20px 0; background:var(--forest); position:relative; overflow:hidden; }
  .header::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at 80% 0%,rgba(160,82,45,0.35) 0%,transparent 60%); pointer-events:none; }
  .header-inner { position:relative; z-index:1; }
  .logo { font-family:'Playfair Display',serif; font-size:24px; color:var(--cream); letter-spacing:0.02em; line-height:1; }
  .logo em { font-style:italic; color:#d4b896; }
  .tagline { font-size:10px; color:rgba(240,235,226,0.5); letter-spacing:0.2em; text-transform:uppercase; margin-top:3px; margin-bottom:16px; }

  /* TABS */
  .tabs { display:flex; background:var(--forest); position:sticky; top:0; z-index:20; }
  .tab { flex:1; padding:13px 6px 11px; text-align:center; font-size:11px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; color:rgba(240,235,226,0.45); cursor:pointer; border:none; background:none; border-bottom:2px solid transparent; transition:all 0.2s; }
  .tab.active { color:#d4b896; border-bottom-color:#d4b896; }

  /* FEED */
  .feed-header { padding:14px 14px 10px; background:var(--cream); border-bottom:1px solid var(--border); }
  .location-bar { display:flex; align-items:center; gap:8px; background:var(--surface); border:1px solid var(--border-strong); border-radius:12px; padding:10px 14px; margin-bottom:10px; cursor:pointer; transition:all 0.2s; }
  .location-bar:hover { border-color:var(--forest); }
  .location-bar-text { flex:1; font-size:13px; color:var(--text); font-weight:500; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .location-status { font-size:11px; font-weight:600; padding:3px 8px; border-radius:100px; white-space:nowrap; }
  .location-status.locating { background:rgba(45,74,62,0.1); color:var(--forest); }
  .location-status.located { background:rgba(45,74,62,0.15); color:var(--forest); }
  .location-status.error { background:rgba(160,82,45,0.1); color:var(--terracotta); }
  .radius-row { display:flex; gap:6px; margin-bottom:10px; align-items:center; }
  .radius-label { font-size:11px; color:var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:0.08em; white-space:nowrap; }
  .radius-chip { padding:6px 12px; border-radius:100px; font-size:12px; font-weight:600; white-space:nowrap; cursor:pointer; border:1.5px solid var(--border-strong); background:transparent; color:var(--text-secondary); transition:all 0.2s; font-family:'DM Sans',sans-serif; }
  .radius-chip.active { background:var(--forest); color:var(--cream); border-color:var(--forest); }
  .search-bar { display:flex; align-items:center; background:var(--surface); border:1px solid var(--border-strong); border-radius:12px; padding:10px 14px; gap:8px; margin-bottom:10px; }
  .search-input { flex:1; border:none; background:none; font-size:14px; color:var(--text); outline:none; font-family:'DM Sans',sans-serif; }
  .search-input::placeholder { color:var(--text-muted); }
  .filter-row { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; padding-bottom:2px; }
  .filter-row::-webkit-scrollbar { display:none; }
  .filter-chip { padding:7px 16px; border-radius:100px; font-size:12px; font-weight:600; white-space:nowrap; cursor:pointer; border:1.5px solid var(--border-strong); background:transparent; color:var(--text-secondary); transition:all 0.2s; }
  .filter-chip.active-all { background:var(--forest); color:var(--cream); border-color:var(--forest); }
  .filter-chip.active-estate { background:#a0522d; color:white; border-color:#a0522d; }
  .filter-chip.active-garage { background:var(--forest); color:white; border-color:var(--forest); }
  .filter-chip.active-thrift { background:#6b4c8a; color:white; border-color:#6b4c8a; }
  .sales-list { padding:12px 0 100px; }

  /* SALE CARD */
  .sale-card { background:var(--surface); margin:0 14px 12px; border-radius:18px; overflow:hidden; border:1px solid var(--border); box-shadow:var(--shadow); cursor:pointer; transition:all 0.2s; position:relative; }
  .sale-card:hover { transform:translateY(-2px); box-shadow:var(--shadow-lg); }
  .sale-card:active { transform:scale(0.985); }
  .sale-hero { width:100%; height:160px; object-fit:cover; display:block; }
  .featured-badge { position:absolute; top:12px; left:12px; background:var(--terracotta); color:white; font-size:9px; font-weight:700; letter-spacing:0.08em; padding:4px 10px; border-radius:100px; }
  .photo-count-badge { position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.5); color:white; font-size:10px; font-weight:600; padding:3px 8px; border-radius:100px; }
  .sale-card-body { padding:14px; }
  .card-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; }
  .type-badge { display:flex; align-items:center; gap:5px; padding:4px 10px; border-radius:100px; font-size:11px; font-weight:600; }
  .type-badge.estate { background:rgba(160,82,45,0.1); color:#a0522d; }
  .type-badge.garage { background:rgba(45,74,62,0.1); color:var(--forest); }
  .type-badge.thrift { background:rgba(107,76,138,0.1); color:#6b4c8a; }
  .card-right { display:flex; align-items:center; gap:8px; }
  .date-badge { padding:3px 8px; border-radius:6px; background:var(--cream-dark); font-size:10px; font-weight:600; color:var(--text-muted); }
  .date-badge.today { background:rgba(45,74,62,0.12); color:var(--forest); }
  .heart-btn { background:none; border:none; cursor:pointer; font-size:20px; padding:2px; line-height:1; }
  .card-title { font-family:'Playfair Display',serif; font-size:16px; color:var(--text); margin-bottom:8px; line-height:1.3; }
  .card-loc { display:flex; align-items:center; gap:5px; margin-bottom:8px; }
  .card-loc-text { font-size:13px; color:var(--text-secondary); flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .dist-pill { background:rgba(45,74,62,0.1); color:var(--forest); font-size:11px; font-weight:700; padding:3px 9px; border-radius:100px; white-space:nowrap; }
  .card-desc { font-size:13px; color:var(--text-secondary); line-height:1.5; margin-bottom:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
  .card-tags { display:flex; flex-wrap:wrap; gap:6px; margin-bottom:12px; }
  .card-tag { background:var(--cream-dark); color:var(--text-secondary); font-size:11px; font-weight:500; padding:3px 10px; border-radius:100px; }
  .card-footer { display:flex; align-items:center; justify-content:space-between; padding-top:10px; border-top:1px solid var(--border); }
  .card-source { font-size:12px; color:var(--text-muted); }
  .see-details { font-size:13px; color:var(--terracotta); font-weight:600; }

  /* DETAIL PAGE */
  .detail-page { position:fixed; inset:0; background:var(--cream); z-index:50; overflow-y:auto; max-width:430px; margin:0 auto; animation:slideUp 0.28s ease; }
  @keyframes slideUp { from { transform:translateY(28px); opacity:0; } to { transform:translateY(0); opacity:1; } }
  .detail-nav { display:flex; align-items:center; gap:12px; padding:52px 16px 12px; background:var(--forest); position:sticky; top:0; z-index:10; }
  .back-btn { width:36px; height:36px; border-radius:50%; background:rgba(240,235,226,0.15); border:none; color:var(--cream); font-size:20px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .detail-nav-title { flex:1; font-size:15px; font-weight:600; color:var(--cream); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .detail-heart { background:none; border:none; font-size:24px; cursor:pointer; flex-shrink:0; }

  /* PHOTO GALLERY */
  .gallery { position:relative; background:#1a1209; overflow:hidden; }
  .gallery-img { width:100%; height:260px; object-fit:cover; display:block; transition:opacity 0.3s; }
  .gallery-counter { position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.55); color:white; font-size:11px; font-weight:600; padding:4px 10px; border-radius:100px; }
  .gallery-prev,.gallery-next { position:absolute; top:50%; transform:translateY(-50%); background:rgba(0,0,0,0.4); border:none; color:white; width:36px; height:36px; border-radius:50%; font-size:18px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background 0.2s; }
  .gallery-prev:hover,.gallery-next:hover { background:rgba(0,0,0,0.65); }
  .gallery-prev { left:10px; }
  .gallery-next { right:10px; }
  .gallery-dots { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:5px; }
  .gallery-dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.45); cursor:pointer; transition:all 0.2s; border:none; padding:0; }
  .gallery-dot.active { background:white; transform:scale(1.3); }
  .gallery-thumbs { display:flex; gap:6px; padding:10px 14px; background:var(--forest); overflow-x:auto; scrollbar-width:none; }
  .gallery-thumbs::-webkit-scrollbar { display:none; }
  .gallery-thumb { width:52px; height:52px; border-radius:8px; object-fit:cover; cursor:pointer; border:2px solid transparent; flex-shrink:0; transition:all 0.2s; opacity:0.65; }
  .gallery-thumb.active { border-color:#d4b896; opacity:1; }

  /* DETAIL CONTENT */
  .detail-content { padding:18px 16px 60px; }
  .detail-type-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
  .detail-title { font-family:'Playfair Display',serif; font-size:24px; color:var(--text); line-height:1.25; margin-bottom:18px; }
  .info-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:4px 16px; margin-bottom:18px; }
  .info-row { display:flex; align-items:flex-start; gap:12px; padding:12px 0; border-bottom:1px solid var(--border); }
  .info-row:last-child { border-bottom:none; }
  .info-icon { width:30px; height:30px; border-radius:50%; background:rgba(45,74,62,0.1); display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; margin-top:2px; }
  .info-label { font-size:10px; font-weight:600; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.08em; margin-bottom:3px; }
  .info-value { font-size:14px; color:var(--text); font-weight:500; line-height:1.4; }
  .detail-section { margin-bottom:22px; }
  .detail-section-title { font-size:16px; font-weight:700; color:var(--text); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
  .detail-desc { font-size:14px; color:var(--text-secondary); line-height:1.65; }
  .detail-tags { display:flex; flex-wrap:wrap; gap:8px; }
  .detail-tag { background:rgba(45,74,62,0.08); color:var(--forest); font-size:13px; font-weight:500; padding:5px 12px; border-radius:100px; }
  .tip-row { display:flex; align-items:flex-start; gap:12px; margin-bottom:10px; }
  .tip-bullet { width:24px; height:24px; border-radius:50%; background:var(--terracotta); color:white; font-size:11px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .tip-text { font-size:14px; color:var(--text-secondary); line-height:1.5; }
  .detail-actions { display:flex; flex-direction:column; gap:10px; margin-bottom:22px; }
  .primary-btn { background:var(--terracotta); color:white; border:none; border-radius:14px; padding:15px; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .primary-btn:hover { background:var(--terra-light); }
  .save-sale-btn { color:white; border:none; border-radius:14px; padding:15px; font-size:15px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .save-sale-btn.unsaved { background:var(--forest); }
  .save-sale-btn.saved { background:var(--brown); }
  .maps-row { display:flex; gap:10px; }
  .map-btn { flex:1; background:rgba(45,74,62,0.08); color:var(--forest); border:1.5px solid rgba(45,74,62,0.2); border-radius:14px; padding:13px; font-size:13px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:7px; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .map-btn:hover { background:rgba(45,74,62,0.14); }
  .ai-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; }
  .ai-card-top { display:flex; align-items:flex-start; gap:12px; padding:16px; border-bottom:1px solid var(--border); }
  .ai-avatar { width:42px; height:42px; border-radius:50%; background:rgba(160,82,45,0.12); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
  .ai-card-title { font-size:15px; font-weight:600; color:var(--text); margin-bottom:4px; }
  .ai-card-sub { font-size:13px; color:var(--text-secondary); line-height:1.5; }
  .ai-card-btn { display:flex; align-items:center; justify-content:space-between; padding:14px 16px; cursor:pointer; background:none; border:none; width:100%; font-family:'DM Sans',sans-serif; }
  .ai-card-btn-text { font-size:14px; font-weight:600; color:var(--terracotta); }

  /* SCAN */
  .scan-page { padding:20px; }
  .upload-zone { border:2px dashed rgba(92,61,46,0.25); border-radius:20px; padding:44px 24px; text-align:center; background:var(--surface); position:relative; overflow:hidden; transition:all 0.3s; }
  .upload-zone.drag-over { border-color:var(--terracotta); background:rgba(160,82,45,0.04); }
  .camera-icon { font-size:48px; margin-bottom:14px; }
  .upload-title { font-family:'Playfair Display',serif; font-size:20px; color:var(--text); margin-bottom:8px; }
  .upload-sub { font-size:13px; color:var(--text-muted); line-height:1.6; }
  .btn-row { display:flex; gap:12px; margin-top:20px; justify-content:center; }
  .upload-btn { padding:12px 24px; background:var(--terracotta); color:white; border-radius:100px; font-size:13px; font-weight:600; cursor:pointer; border:none; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .upload-btn:hover { background:var(--terra-light); transform:translateY(-1px); }
  .upload-btn-outline { padding:12px 24px; background:transparent; color:var(--forest); border-radius:100px; font-size:13px; font-weight:600; cursor:pointer; border:1.5px solid var(--forest); font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .upload-btn-outline:hover { background:rgba(45,74,62,0.06); transform:translateY(-1px); }
  .photo-count { font-size:11px; color:var(--text-muted); text-align:center; margin-bottom:12px; }
  .photo-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px; }
  .photo-cell { position:relative; border-radius:14px; overflow:hidden; aspect-ratio:1; border:1px solid var(--border); background:var(--cream-dark); }
  .photo-cell img { width:100%; height:100%; object-fit:cover; display:block; }
  .photo-remove { position:absolute; top:6px; right:6px; background:rgba(42,31,20,0.65); border:none; color:white; width:26px; height:26px; border-radius:50%; font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center; }
  .add-photo-cell { aspect-ratio:1; border-radius:14px; border:2px dashed rgba(92,61,46,0.25); background:var(--surface); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; cursor:pointer; transition:all 0.2s; }
  .add-photo-cell:hover { border-color:var(--terracotta); }
  .add-photo-icon { font-size:26px; color:var(--text-muted); }
  .add-photo-label { font-size:11px; color:var(--text-muted); }
  .add-options-row { display:flex; gap:8px; margin-bottom:14px; }
  .add-opt-btn { flex:1; padding:10px; border-radius:12px; border:1px solid var(--border-strong); background:var(--surface); color:var(--text-secondary); font-size:12px; font-weight:500; cursor:pointer; text-align:center; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .add-opt-btn:hover { border-color:var(--terracotta); color:var(--terracotta); }
  .analyze-btn { width:100%; padding:17px; background:var(--forest); color:var(--cream); border:none; border-radius:16px; font-size:16px; font-weight:700; font-family:'Playfair Display',serif; cursor:pointer; letter-spacing:0.02em; transition:all 0.3s; }
  .analyze-btn:hover { background:var(--forest-light); transform:translateY(-2px); box-shadow:0 8px 28px rgba(45,74,62,0.3); }
  .analyze-btn:disabled { opacity:0.5; cursor:not-allowed; transform:none; box-shadow:none; }
  .loading-spinner { display:inline-block; width:17px; height:17px; border:2px solid rgba(240,235,226,0.3); border-top-color:var(--cream); border-radius:50%; animation:spin 0.8s linear infinite; vertical-align:middle; margin-right:8px; }
  @keyframes spin { to { transform:rotate(360deg); } }
  .result-card { background:var(--surface); border:1px solid var(--border); border-radius:20px; padding:22px; margin-top:20px; animation:fadeUp 0.4s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
  .result-name { font-family:'Playfair Display',serif; font-size:22px; color:var(--text); margin-bottom:4px; }
  .result-era { font-size:11px; color:var(--terracotta); letter-spacing:0.12em; text-transform:uppercase; margin-bottom:18px; font-weight:600; }
  .price-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin-bottom:18px; }
  .price-box { background:var(--cream-dark); border-radius:12px; padding:13px 8px; text-align:center; }
  .price-label { font-size:9px; letter-spacing:0.12em; text-transform:uppercase; color:var(--text-muted); margin-bottom:5px; font-weight:600; }
  .price-value { font-family:'Playfair Display',serif; font-size:15px; font-weight:700; }
  .price-original { color:var(--text-secondary); }
  .price-buy { color:var(--forest); }
  .price-resell { color:var(--terracotta); }
  .result-facts { font-size:13px; color:var(--text-secondary); line-height:1.7; border-top:1px solid var(--border); padding-top:16px; margin-bottom:18px; }
  .save-section { display:flex; gap:10px; align-items:center; }
  .folder-select { flex:1; background:var(--cream-dark); border:1px solid var(--border-strong); color:var(--text); padding:11px 12px; border-radius:12px; font-size:13px; min-width:0; font-family:'DM Sans',sans-serif; outline:none; }
  .save-btn { padding:11px 18px; background:var(--brown); color:white; border:none; border-radius:12px; font-size:13px; font-weight:600; cursor:pointer; white-space:nowrap; font-family:'DM Sans',sans-serif; transition:all 0.2s; }
  .save-btn:hover { background:var(--terracotta); }
  .save-btn.saved { background:var(--forest); }

  /* FINDS */
  .finds-page { padding:16px 16px 100px; }
  .finds-section-title { font-family:'Playfair Display',serif; font-size:18px; color:var(--text); margin-bottom:12px; display:flex; align-items:center; gap:8px; }
  .finds-divider { height:1px; background:var(--border); margin:20px 0; }
  .folder-tabs { display:flex; gap:8px; overflow-x:auto; padding-bottom:12px; margin-bottom:16px; scrollbar-width:none; }
  .folder-tabs::-webkit-scrollbar { display:none; }
  .folder-chip { padding:7px 15px; border-radius:100px; font-size:12px; font-weight:600; white-space:nowrap; cursor:pointer; border:1.5px solid var(--border-strong); background:transparent; color:var(--text-secondary); transition:all 0.2s; }
  .folder-chip.active { background:var(--forest); color:var(--cream); border-color:var(--forest); }
  .finds-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .find-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; box-shadow:var(--shadow); cursor:pointer; transition:all 0.2s; }
  .find-card:hover { transform:translateY(-2px); }
  .find-img { width:100%; height:110px; object-fit:cover; }
  .find-info { padding:10px; }
  .find-name { font-family:'Playfair Display',serif; font-size:13px; color:var(--text); margin-bottom:3px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .find-price { font-size:11px; color:var(--terracotta); font-weight:600; }
  .find-meta { font-size:10px; color:var(--text-muted); margin-top:2px; }

  /* SAVED SALES CARDS */
  .saved-sale-card { background:var(--surface); border:1px solid var(--border); border-radius:16px; overflow:hidden; box-shadow:var(--shadow); cursor:pointer; display:flex; gap:0; margin-bottom:10px; transition:all 0.2s; }
  .saved-sale-card:hover { transform:translateY(-1px); box-shadow:var(--shadow-lg); }
  .saved-sale-img { width:90px; height:90px; object-fit:cover; flex-shrink:0; }
  .saved-sale-info { padding:12px; flex:1; min-width:0; }
  .saved-sale-title { font-family:'Playfair Display',serif; font-size:14px; color:var(--text); margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .saved-sale-city { font-size:12px; color:var(--text-secondary); margin-bottom:4px; }
  .saved-sale-date { font-size:11px; color:var(--text-muted); }
  .unsave-btn { background:none; border:none; font-size:18px; cursor:pointer; padding:12px 12px 12px 0; align-self:center; flex-shrink:0; }

  .empty-state { text-align:center; padding:48px 24px; }
  .empty-icon { font-size:44px; margin-bottom:12px; }
  .empty-title { font-family:'Playfair Display',serif; font-size:18px; color:var(--text-secondary); margin-bottom:8px; }
  .empty-sub { font-size:13px; color:var(--text-muted); line-height:1.6; }

  .toast { position:fixed; bottom:30px; left:50%; transform:translateX(-50%); background:var(--forest); color:var(--cream); padding:12px 24px; border-radius:100px; font-size:13px; font-weight:600; z-index:100; animation:toastIn 0.3s ease,toastOut 0.3s ease 2.2s forwards; white-space:nowrap; box-shadow:var(--shadow-lg); }
  @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(10px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }
  @keyframes toastOut { to { opacity:0; transform:translateX(-50%) translateY(10px); } }
  input[type="file"] { display:none; }
`;

const fileToBase64 = (file) => new Promise((res,rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = rej;
  r.readAsDataURL(file);
});

function PhotoGallery({ photos }) {
  const [idx, setIdx] = useState(0);
  if (!photos?.length) return null;
  const prev = () => setIdx(i => (i - 1 + photos.length) % photos.length);
  const next = () => setIdx(i => (i + 1) % photos.length);
  return (
    <div className="gallery">
      <img className="gallery-img" src={photos[idx]} alt={`Photo ${idx+1}`} />
      <div className="gallery-counter">{idx+1} / {photos.length}</div>
      {photos.length > 1 && <>
        <button className="gallery-prev" onClick={prev}>‹</button>
        <button className="gallery-next" onClick={next}>›</button>
        <div className="gallery-dots">
          {photos.map((_,i) => <button key={i} className={`gallery-dot ${i===idx?"active":""}`} onClick={() => setIdx(i)} />)}
        </div>
      </>}
      {photos.length > 1 && (
        <div className="gallery-thumbs">
          {photos.map((p,i) => <img key={i} className={`gallery-thumb ${i===idx?"active":""}`} src={p} alt="" onClick={() => setIdx(i)} />)}
        </div>
      )}
    </div>
  );
}

// ── localStorage helpers ─────────────────────────────────────────────────────
function loadFromStorage(key, fallback) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
}
function saveToStorage(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function App() {
  const [tab, setTab] = useState("sales");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [radius, setRadius] = useState(10);
  const [locationLabel, setLocationLabel] = useState("Forest Park, St. Louis, MO");
  const [locationStatus, setLocationStatus] = useState("located");
  const [selectedSale, setSelectedSale] = useState(null);
  const [savedSales, setSavedSales] = useState(() => loadFromStorage('mmm_saved_sales', []));
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("My Finds");
  const [savedFinds, setSavedFinds] = useState(() => loadFromStorage('mmm_saved_finds', []));
  const [savedThisItem, setSavedThisItem] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeFolder, setActiveFolder] = useState("All");
  const [dragOver, setDragOver] = useState(false);
  const [findsTab, setFindsTab] = useState("items"); // "items" | "sales"

  const fileRef = useRef();
  const cameraRef = useRef();

  // Save to localStorage whenever saved data changes
  useEffect(() => { saveToStorage('mmm_saved_sales', savedSales); }, [savedSales]);
  useEffect(() => { saveToStorage('mmm_saved_finds', savedFinds); }, [savedFinds]);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  const getLocation = () => {
    if (!navigator.geolocation) { setLocationStatus("error"); setLocationLabel("Geolocation not supported"); return; }
    setLocationStatus("locating"); setLocationLabel("Finding your location...");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const city = data.address?.city || data.address?.town || data.address?.village || "Your area";
          const state = data.address?.state_code || "";
          setLocationLabel(`${city}${state ? ", " + state : ""}`);
        } catch { setLocationLabel(`${latitude.toFixed(3)}, ${longitude.toFixed(3)}`); }
        setLocationStatus("located");
      },
      () => { setLocationStatus("error"); setLocationLabel("Couldn't get location — tap to retry"); },
      { timeout: 10000 }
    );
  };

  const typeLabel = (t) => t==="estate"?"Estate Sale":t==="garage"?"Garage Sale":"Thrift Store";
  const typeIcon = (t) => t==="estate"?"🏠":t==="garage"?"🏷️":"🛍️";
  const isToday = (s) => s.startDate===today||(s.endDate>=today&&s.startDate<=today);

  const filteredSales = MOCK_SALES.filter(s => {
    const matchFilter = filter==="all"||s.type===filter;
    const matchRadius = s.distance<=radius;
    const matchSearch = !search||s.title.toLowerCase().includes(search.toLowerCase())||s.city.toLowerCase().includes(search.toLowerCase())||s.tags?.some(t=>t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter&&matchRadius&&matchSearch;
  });

  const isSaleSaved = (id) => savedSales.some(s => s.id===id);

  const toggleSaveSale = (sale) => {
    if (isSaleSaved(sale.id)) {
      setSavedSales(prev => prev.filter(s => s.id!==sale.id));
      showToast("Removed from saved sales");
    } else {
      setSavedSales(prev => [sale, ...prev]);
      showToast("Sale saved! ❤️");
    }
  };

  const addFiles = async (files) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    const converted = await Promise.all(arr.map(async f => ({ dataUrl: await fileToBase64(f), mimeType: f.type })));
    setPhotos(prev => { const slots = MAX_PHOTOS-prev.length; return [...prev,...converted.slice(0,slots)]; });
    setResult(null); setSavedThisItem(false);
  };

  const handleDrop = useCallback((e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }, []);

  const analyze = async () => {
    if (!photos.length) return;
    setLoading(true); setResult(null);
    try {
      const imageBlocks = photos.map(p => ({ type:"image", source:{ type:"base64", media_type:p.mimeType, data:p.dataUrl.split(",")[1] } }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          messages:[{ role:"user", content:[...imageBlocks,{ type:"text", text:`You are an expert antiques appraiser and resale specialist. Analyze this item using eBay sold listings as your primary pricing reference. Respond ONLY with valid JSON, no markdown:\n{"name":"specific item name","era":"decade or Modern","originalPrice":"$XX–$XX","buyPrice":"$XX–$XX","resellPrice":"$XX–$XX (eBay comps)","facts":"2-3 sentences on history, value, and what to look for."}` }] }]
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.find(b=>b.type==="text")?.text||"";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    } catch { setResult({ error:"Couldn't analyze this image. Try again with a clearer photo." }); }
    setLoading(false);
  };

  const saveFind = () => {
    if (!result||savedThisItem) return;
    setSavedFinds(prev => [{ id:Date.now(), name:result.name, era:result.era, resellPrice:result.resellPrice, folder:selectedFolder, imageUrl:photos[0]?.dataUrl }, ...prev]);
    setSavedThisItem(true);
    showToast(`Saved to "${selectedFolder}" ✓`);
  };

  const canAddMore = photos.length < MAX_PHOTOS;
  const folderOptions = ["All",...FOLDERS];
  const filteredFinds = activeFolder==="All" ? savedFinds : savedFinds.filter(f=>f.folder===activeFolder);

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <div className="header">
          <div className="header-inner">
            <div className="logo">Miss <em>Mess</em> Marketplace</div>
            <div className="tagline">Treasure hunting, reimagined</div>
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${tab==="sales"?"active":""}`} onClick={() => { setTab("sales"); setSelectedSale(null); }}>🏷 Sales</button>
          <button className={`tab ${tab==="scan"?"active":""}`} onClick={() => setTab("scan")}>📷 Identify</button>
          <button className={`tab ${tab==="finds"?"active":""}`} onClick={() => setTab("finds")}>
            🗂 Saved {(savedFinds.length+savedSales.length)>0?`(${savedFinds.length+savedSales.length})`:""}
          </button>
        </div>

        <input type="file" ref={fileRef} accept="image/*" multiple onChange={e=>addFiles(e.target.files)} />
        <input type="file" ref={cameraRef} accept="image/*" capture="environment" onChange={e=>addFiles(e.target.files)} />

        {/* ── SALES FEED ── */}
        {tab==="sales" && !selectedSale && (
          <div className="feed-page">
            <div className="feed-header">
              <div className="location-bar" onClick={getLocation}>
                <span style={{fontSize:16}}>📍</span>
                <span className="location-bar-text">{locationLabel}</span>
                <span className={`location-status ${locationStatus}`}>
                  {locationStatus==="locating"?"⏳ Locating...":locationStatus==="located"?"✓ Located":"Tap to locate"}
                </span>
              </div>
              <div className="radius-row">
                <span className="radius-label">Within</span>
                {RADIUS_OPTIONS.map(r => <button key={r} className={`radius-chip ${radius===r?"active":""}`} onClick={() => setRadius(r)}>{r} mi</button>)}
              </div>
              <div className="search-bar">
                <span style={{fontSize:15,color:"var(--text-muted)"}}>🔍</span>
                <input className="search-input" placeholder="City, zip, or keyword..." value={search} onChange={e=>setSearch(e.target.value)} />
                {search && <button style={{background:"none",border:"none",cursor:"pointer",color:"var(--text-muted)",fontSize:16}} onClick={() => setSearch("")}>✕</button>}
              </div>
              <div className="filter-row">
                {FILTERS.map(f => (
                  <button key={f} className={`filter-chip ${filter===f?`active-${f}`:""}`} onClick={() => setFilter(f)}>
                    {f==="all"?"All Sales":f==="estate"?"🏠 Estate":f==="garage"?"🏷 Garage":"🛍 Thrift"}
                  </button>
                ))}
              </div>
            </div>

            <div className="sales-list">
              {filteredSales.length===0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📍</div>
                  <div className="empty-title">No sales within {radius} miles</div>
                  <div className="empty-sub">Try expanding your radius or a different filter</div>
                </div>
              ) : filteredSales.map(sale => (
                <div key={sale.id} className="sale-card" onClick={() => setSelectedSale(sale)}>
                  {sale.photos?.[0] && <img className="sale-hero" src={sale.photos[0]} alt={sale.title} />}
                  {sale.featured && <div className="featured-badge">⭐ FEATURED</div>}
                  {sale.photos?.length>1 && <div className="photo-count-badge">📷 {sale.photos.length}</div>}
                  <div className="sale-card-body">
                    <div className="card-header">
                      <div className={`type-badge ${sale.type}`}>{typeIcon(sale.type)} {typeLabel(sale.type)}</div>
                      <div className="card-right">
                        <div className={`date-badge ${isToday(sale)?"today":""}`}>{isToday(sale)?"TODAY":sale.startDate}</div>
                        <button className="heart-btn" onClick={e=>{e.stopPropagation();toggleSaveSale(sale);}}>
                          {isSaleSaved(sale.id)?"❤️":"🤍"}
                        </button>
                      </div>
                    </div>
                    <div className="card-title">{sale.title}</div>
                    <div className="card-loc">
                      <span style={{fontSize:13}}>📍</span>
                      <span className="card-loc-text">{sale.address}, {sale.city}</span>
                      <span className="dist-pill">{sale.distance.toFixed(1)} mi</span>
                    </div>
                    {sale.description && <div className="card-desc">{sale.description}</div>}
                    {sale.tags?.length>0 && (
                      <div className="card-tags">
                        {sale.tags.slice(0,4).map(t=><span key={t} className="card-tag">{t}</span>)}
                        {sale.tags.length>4&&<span style={{fontSize:11,color:"var(--text-muted)",alignSelf:"center"}}>+{sale.tags.length-4}</span>}
                      </div>
                    )}
                    <div className="card-footer">
                      <span className="card-source">🌐 {sale.source}</span>
                      <span className="see-details">See details ›</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SALE DETAIL ── */}
        {tab==="sales" && selectedSale && (
          <div className="detail-page">
            <div className="detail-nav">
              <button className="back-btn" onClick={() => setSelectedSale(null)}>‹</button>
              <span className="detail-nav-title">{selectedSale.title}</span>
              <button className="detail-heart" onClick={() => toggleSaveSale(selectedSale)}>
                {isSaleSaved(selectedSale.id)?"❤️":"🤍"}
              </button>
            </div>

            <PhotoGallery photos={selectedSale.photos} />

            <div className="detail-content">
              <div className="detail-type-row">
                <div className={`type-badge ${selectedSale.type}`}>{typeIcon(selectedSale.type)} {typeLabel(selectedSale.type)}</div>
                <span className="dist-pill">📍 {selectedSale.distance.toFixed(1)} miles away</span>
              </div>
              <div className="detail-title">{selectedSale.title}</div>

              <div className="info-card">
                <div className="info-row">
                  <div className="info-icon">📍</div>
                  <div><div className="info-label">Address</div><div className="info-value">{selectedSale.address}, {selectedSale.city}, {selectedSale.state} {selectedSale.zip}</div></div>
                </div>
                <div className="info-row">
                  <div className="info-icon">📅</div>
                  <div><div className="info-label">Dates</div><div className="info-value">{selectedSale.startDate} → {selectedSale.endDate}</div></div>
                </div>
                <div className="info-row">
                  <div className="info-icon">🌐</div>
                  <div><div className="info-label">Source</div><div className="info-value">{selectedSale.source}</div></div>
                </div>
              </div>

              {selectedSale.description && (
                <div className="detail-section">
                  <div className="detail-section-title">About This Sale</div>
                  <div className="detail-desc">{selectedSale.description}</div>
                </div>
              )}

              {selectedSale.tags?.length>0 && (
                <div className="detail-section">
                  <div className="detail-section-title">Featured Items</div>
                  <div className="detail-tags">
                    {selectedSale.tags.map(t=><span key={t} className="detail-tag">📦 {t}</span>)}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <div className="detail-section-title">⚡ Negotiation Tips</div>
                {NEGOTIATION_TIPS[selectedSale.type].map((tip,i) => (
                  <div key={i} className="tip-row">
                    <div className="tip-bullet">{i+1}</div>
                    <div className="tip-text">{tip}</div>
                  </div>
                ))}
              </div>

              <div className="detail-actions">
                <button className={`save-sale-btn ${isSaleSaved(selectedSale.id)?"saved":"unsaved"}`} onClick={() => toggleSaveSale(selectedSale)}>
                  {isSaleSaved(selectedSale.id)?"❤️ Saved to My Sales":"🤍 Save This Sale"}
                </button>
                <button className="primary-btn" onClick={() => window.open(selectedSale.url,"_blank")}>
                  🔗 View on {selectedSale.source}
                </button>
                <div className="maps-row">
                  <button className="map-btn" onClick={() => window.open(`https://maps.apple.com/?daddr=${encodeURIComponent(selectedSale.address+", "+selectedSale.city+", "+selectedSale.state)}`)}>
                    🗺 Apple Maps
                  </button>
                  <button className="map-btn" onClick={() => window.open(`https://waze.com/ul?q=${encodeURIComponent(selectedSale.address+", "+selectedSale.city+", "+selectedSale.state)}`)}>
                    🧭 Waze
                  </button>
                </div>
              </div>

              <div className="ai-card">
                <div className="ai-card-top">
                  <div className="ai-avatar">🤖</div>
                  <div>
                    <div className="ai-card-title">Research with AI</div>
                    <div className="ai-card-sub">Snap a photo of an item at this sale — get values, eBay comps, and negotiation advice</div>
                  </div>
                </div>
                <button className="ai-card-btn" onClick={() => { setSelectedSale(null); setTab("scan"); }}>
                  <span className="ai-card-btn-text">Open AI Identifier</span>
                  <span>›</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SCAN TAB ── */}
        {tab==="scan" && (
          <div className="scan-page">
            {photos.length===0 ? (
              <div className={`upload-zone ${dragOver?"drag-over":""}`} onDragOver={e=>{e.preventDefault();setDragOver(true);}} onDragLeave={()=>setDragOver(false)} onDrop={handleDrop}>
                <div className="camera-icon">📸</div>
                <div className="upload-title">Find something interesting?</div>
                <div className="upload-sub">Add up to 4 photos — different angles help AI identify it better</div>
                <div className="btn-row">
                  <button className="upload-btn" onClick={()=>cameraRef.current.click()}>📷 Camera</button>
                  <button className="upload-btn-outline" onClick={()=>fileRef.current.click()}>🖼 Library</button>
                </div>
              </div>
            ) : (
              <>
                <div className="photo-count">{photos.length} of {MAX_PHOTOS} photos</div>
                <div className="photo-grid">
                  {photos.map((p,i) => (
                    <div key={i} className="photo-cell">
                      <img src={p.dataUrl} alt={`Photo ${i+1}`} />
                      <button className="photo-remove" onClick={()=>{setPhotos(prev=>prev.filter((_,j)=>j!==i));setResult(null);}}>✕</button>
                    </div>
                  ))}
                  {canAddMore && <div className="add-photo-cell" onClick={()=>fileRef.current.click()}><div className="add-photo-icon">+</div><div className="add-photo-label">Add photo</div></div>}
                </div>
                <div className="add-options-row">
                  {canAddMore && <><button className="add-opt-btn" onClick={()=>cameraRef.current.click()}>📷 Camera</button><button className="add-opt-btn" onClick={()=>fileRef.current.click()}>🖼 Library</button></>}
                  <button className="add-opt-btn" onClick={()=>{setPhotos([]);setResult(null);}}>🗑 Clear</button>
                </div>
                <button className="analyze-btn" onClick={analyze} disabled={loading}>
                  {loading?<><span className="loading-spinner"/>Analyzing {photos.length} photo{photos.length>1?"s":""}...</>:"✦ Identify This Item"}
                </button>
              </>
            )}

            {result&&!result.error&&(
              <div className="result-card">
                <div className="result-name">{result.name}</div>
                <div className="result-era">{result.era}</div>
                <div className="price-row">
                  <div className="price-box"><div className="price-label">Original</div><div className="price-value price-original">{result.originalPrice}</div></div>
                  <div className="price-box"><div className="price-label">Buy For</div><div className="price-value price-buy">{result.buyPrice}</div></div>
                  <div className="price-box"><div className="price-label">Resell</div><div className="price-value price-resell">{result.resellPrice}</div></div>
                </div>
                <div className="result-facts">{result.facts}</div>
                <div className="save-section">
                  <select className="folder-select" value={selectedFolder} onChange={e=>setSelectedFolder(e.target.value)}>
                    {FOLDERS.map(f=><option key={f}>{f}</option>)}
                  </select>
                  <button className={`save-btn ${savedThisItem?"saved":""}`} onClick={saveFind}>{savedThisItem?"✓ Saved!":"Save Find"}</button>
                </div>
              </div>
            )}
            {result?.error&&<div className="result-card" style={{textAlign:"center",color:"var(--text-muted)"}}>{result.error}</div>}
          </div>
        )}

        {/* ── SAVED TAB ── */}
        {tab==="finds" && (
          <div className="finds-page">

            {/* Sub-tabs: Items vs Sales */}
            <div className="filter-row" style={{marginBottom:16}}>
              <button className={`filter-chip ${findsTab==="items"?"active-all":""}`} onClick={()=>setFindsTab("items")}>
                🏺 My Finds {savedFinds.length>0?`(${savedFinds.length})`:""}
              </button>
              <button className={`filter-chip ${findsTab==="sales"?"active-all":""}`} onClick={()=>setFindsTab("sales")}>
                ❤️ Saved Sales {savedSales.length>0?`(${savedSales.length})`:""}
              </button>
            </div>

            {/* IDENTIFIED ITEMS */}
            {findsTab==="items" && (
              <>
                <div className="folder-tabs">
                  {folderOptions.map(f=><button key={f} className={`folder-chip ${activeFolder===f?"active":""}`} onClick={()=>setActiveFolder(f)}>{f}</button>)}
                </div>
                {filteredFinds.length===0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📸</div>
                    <div className="empty-title">No finds yet</div>
                    <div className="empty-sub">{activeFolder==="All"?"Use the Identify tab to snap and save items.": `Nothing saved to "${activeFolder}" yet.`}</div>
                  </div>
                ) : (
                  <div className="finds-grid">
                    {filteredFinds.map(find=>(
                      <div key={find.id} className="find-card">
                        <img src={find.imageUrl} alt={find.name} className="find-img" />
                        <div className="find-info">
                          <div className="find-name">{find.name}</div>
                          <div className="find-price">Resell: {find.resellPrice}</div>
                          <div className="find-meta">{find.folder}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* SAVED SALES */}
            {findsTab==="sales" && (
              <>
                {savedSales.length===0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">❤️</div>
                    <div className="empty-title">No saved sales yet</div>
                    <div className="empty-sub">Tap the heart on any sale to save it here for later.</div>
                  </div>
                ) : savedSales.map(sale=>(
                  <div key={sale.id} className="saved-sale-card" onClick={()=>{setSelectedSale(sale);setTab("sales");}}>
                    {sale.photos?.[0]&&<img className="saved-sale-img" src={sale.photos[0]} alt={sale.title}/>}
                    <div className="saved-sale-info">
                      <div className="saved-sale-title">{sale.title}</div>
                      <div className="saved-sale-city">📍 {sale.city}, {sale.state}</div>
                      <div className="saved-sale-date">{sale.startDate} → {sale.endDate}</div>
                    </div>
                    <button className="unsave-btn" onClick={e=>{e.stopPropagation();toggleSaveSale(sale);}}>🗑</button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}

        {toast&&<div className="toast">{toast}</div>}
      </div>
    </>
  );
}
