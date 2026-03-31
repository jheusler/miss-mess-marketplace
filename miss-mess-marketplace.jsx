import { useState, useRef, useCallback } from "react";

// ─── Seed data from your Replit app ───────────────────────────────────────────
const today = new Date().toISOString().split("T")[0];
const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().split("T")[0]; };

const MOCK_SALES = [
  { id: "es-001", title: "Stunning Mid-Century Modern Estate Sale", type: "estate", address: "4521 Lindell Blvd", city: "St. Louis", state: "MO", zip: "63108", distance: 0.8, startDate: today, endDate: d(1), description: "Mid-century modern collection: Herman Miller chairs, Eames-era furniture, Danish modern pieces, vintage electronics, and a 50-year art collection.", source: "EstateSales.net", url: "https://www.estatesales.net", tags: ["mid-century modern", "furniture", "art", "collectibles"], featured: true },
  { id: "es-002", title: "Forest Hills Estate — Antiques & Vintage Jewelry", type: "estate", address: "275 Forest Hills Dr", city: "Ladue", state: "MO", zip: "63124", distance: 2.4, startDate: today, endDate: d(1), description: "Antique jewelry, sterling silver flatware, Victorian furniture, vintage clothing, china sets, and first-edition books.", source: "EstateSales.net", url: "https://www.estatesales.net", tags: ["jewelry", "silver", "Victorian", "books", "china"], featured: true },
  { id: "gs-001", title: "Multi-Family Garage Sale — Tools & Collectibles", type: "garage", address: "1847 Skinker Blvd", city: "St. Louis", state: "MO", zip: "63110", distance: 1.2, startDate: today, endDate: today, description: "4 families! Vintage tools, old toys, sports memorabilia, vintage kitchen items, records, and books. Early birds welcome!", source: "Craigslist", url: "https://stlouis.craigslist.org", tags: ["tools", "toys", "records", "sports"], featured: false },
  { id: "gs-002", title: "Moving Sale — Everything Must Go!", type: "garage", address: "5640 Westminster Place", city: "St. Louis", state: "MO", zip: "63112", distance: 1.9, startDate: today, endDate: d(1), description: "Relocating overseas. Mid-century furniture, 500+ vinyl records, vintage cameras, antique maps, and household items.", source: "Facebook Marketplace", url: "https://www.facebook.com/marketplace", tags: ["records", "cameras", "maps", "furniture"], featured: false },
  { id: "tt-001", title: "Goodwill — Forest Park Area", type: "thrift", address: "4340 Lindell Blvd", city: "St. Louis", state: "MO", zip: "63108", distance: 0.5, startDate: today, endDate: d(7), description: "Large Goodwill near Forest Park. Housewares, clothing, books. New items stocked daily. Senior discount Tuesdays.", source: "Thrift Store", url: "https://www.goodwill.org", tags: ["goodwill", "clothing", "housewares", "books"], featured: false },
  { id: "tt-002", title: "St. Vincent de Paul — South City", type: "thrift", address: "3008 Meramec St", city: "St. Louis", state: "MO", zip: "63118", distance: 3.1, startDate: today, endDate: d(7), description: "SVdP known for furniture, vintage housewares, and excellent antique finds. Half-price Saturdays on clothing.", source: "Thrift Store", url: "https://www.svdpusa.org", tags: ["SVdP", "furniture", "antiques", "half-price"], featured: false },
  { id: "es-003", title: "Clayton Estate — Fine Art & Silver Collection", type: "estate", address: "7825 Maryland Ave", city: "Clayton", state: "MO", zip: "63105", distance: 3.7, startDate: d(1), endDate: d(7), description: "Estate of an art collector. Original oil paintings, bronze sculptures, silver collection, antique instruments, and rare Missouri maps.", source: "EstateSales.net", url: "https://www.estatesales.net", tags: ["fine art", "oil paintings", "bronze", "silver", "maps"], featured: true },
  { id: "gs-003", title: "Neighborhood Block Sale — Vintage & Retro", type: "garage", address: "2211 Magnolia Ave", city: "St. Louis", state: "MO", zip: "63104", distance: 2.8, startDate: d(1), endDate: d(1), description: "8+ homes participating! 70s–80s collectibles, vintage clothing, vinyl records, and vintage video games.", source: "Facebook Marketplace", url: "https://www.facebook.com/marketplace", tags: ["retro", "70s", "80s", "records", "video games"], featured: false },
  { id: "tt-003", title: "Savers — Manchester Road", type: "thrift", address: "12639 Manchester Rd", city: "Des Peres", state: "MO", zip: "63131", distance: 7.2, startDate: today, endDate: d(7), description: "Large Savers with great housewares and kitchenware. Rotating stock and weekend sales.", source: "Thrift Store", url: "https://www.savers.com", tags: ["savers", "housewares", "kitchenware"], featured: false },
  { id: "es-004", title: "Webster Groves Estate — Vintage Kitchen & Garden", type: "estate", address: "555 Elm Ave", city: "Webster Groves", state: "MO", zip: "63119", distance: 5.6, startDate: d(1), endDate: d(7), description: "Vintage kitchen collection: cast iron, Pyrex, enamelware, vintage garden tools, pottery, and farmhouse décor.", source: "EstateSales.net", url: "https://www.estatesales.net", tags: ["vintage kitchen", "cast iron", "Pyrex", "enamelware", "garden"], featured: false },
];

const FOLDERS = ["My Finds", "Furniture", "Jewelry", "Art & Decor", "Vintage", "Electronics"];
const MAX_PHOTOS = 4;
const FILTERS = ["all", "estate", "garage", "thrift"];

const NEGOTIATION_TIPS = {
  estate: ["Arrive 30 min before opening for best selection", "Ask about discounts on the last day (often 50% off)", "Bundle multiple items for a better deal", "Bring cash — many estate sales prefer it", "Inspect items carefully; all sales are usually final"],
  garage: ["Early birds get best picks, late birds get best prices", "Make a reasonable first offer (20–30% below asking)", "Ask if prices are firm or negotiable upfront", "Buy in bundles — offer one price for a group", "Be friendly and conversational — it helps get deals"],
  thrift: ["Check color tag rotation for 50% off days", "Visit on restock days (often Mon/Tue) for best selection", "Look for hidden gems in electronics and housewares", "Check inside pots/containers for items hiding inside", "Senior discount days can be combined with sale days"],
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: #f0ebe2; font-family: 'DM Sans', sans-serif; }

  :root {
    --cream: #f0ebe2;
    --cream-dark: #e4ddd1;
    --sand: #c9b99a;
    --terracotta: #a0522d;
    --terra-light: #c8714a;
    --forest: #2d4a3e;
    --forest-light: #3d6b5a;
    --brown: #5c3d2e;
    --text: #2a1f14;
    --text-secondary: #6b5a4a;
    --text-muted: #9b8878;
    --surface: #faf7f2;
    --border: rgba(92,61,46,0.12);
    --border-strong: rgba(92,61,46,0.22);
    --gold: #b8860b;
    --estate: #a0522d;
    --garage: #2d4a3e;
    --thrift: #6b4c8a;
    --shadow: 0 2px 16px rgba(44,31,20,0.08);
    --shadow-lg: 0 8px 32px rgba(44,31,20,0.14);
  }

  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; background: var(--cream); position: relative; overflow-x: hidden; }

  /* HEADER */
  .header { padding: 52px 20px 0; background: var(--forest); position: relative; overflow: hidden; }
  .header::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 80% 0%, rgba(160,82,45,0.35) 0%, transparent 60%); pointer-events: none; }
  .header-inner { position: relative; z-index: 1; }
  .logo { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--cream); letter-spacing: 0.02em; line-height: 1; }
  .logo em { font-style: italic; color: #d4b896; }
  .tagline { font-size: 10px; color: rgba(240,235,226,0.5); letter-spacing: 0.2em; text-transform: uppercase; margin-top: 3px; margin-bottom: 16px; }

  /* TABS */
  .tabs { display: flex; background: var(--forest); border-bottom: none; position: sticky; top: 0; z-index: 20; }
  .tab { flex: 1; padding: 13px 6px 11px; text-align: center; font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(240,235,226,0.45); cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; transition: all 0.2s; }
  .tab.active { color: #d4b896; border-bottom-color: #d4b896; }

  /* FEED PAGE */
  .feed-page { padding: 0; }

  .feed-header { padding: 16px 16px 12px; background: var(--cream); border-bottom: 1px solid var(--border); }
  .location-row { display: flex; align-items: center; gap: 6px; margin-bottom: 12px; }
  .location-pin { font-size: 14px; }
  .location-text { font-size: 13px; color: var(--text-secondary); font-weight: 500; }
  .sale-count { font-size: 12px; color: var(--text-muted); margin-left: auto; }

  .search-bar { display: flex; align-items: center; background: var(--surface); border: 1px solid var(--border-strong); border-radius: 12px; padding: 10px 14px; gap: 8px; margin-bottom: 12px; }
  .search-icon { font-size: 15px; color: var(--text-muted); }
  .search-input { flex: 1; border: none; background: none; font-size: 14px; color: var(--text); outline: none; font-family: 'DM Sans', sans-serif; }
  .search-input::placeholder { color: var(--text-muted); }

  .filter-row { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding-bottom: 2px; }
  .filter-row::-webkit-scrollbar { display: none; }
  .filter-chip { padding: 7px 16px; border-radius: 100px; font-size: 12px; font-weight: 600; white-space: nowrap; cursor: pointer; border: 1.5px solid var(--border-strong); background: transparent; color: var(--text-secondary); transition: all 0.2s; letter-spacing: 0.03em; }
  .filter-chip.active-all { background: var(--forest); color: var(--cream); border-color: var(--forest); }
  .filter-chip.active-estate { background: var(--estate); color: white; border-color: var(--estate); }
  .filter-chip.active-garage { background: var(--garage); color: white; border-color: var(--garage); }
  .filter-chip.active-thrift { background: var(--thrift); color: white; border-color: var(--thrift); }

  .sales-list { padding: 12px 0 100px; }

  /* SALE CARD */
  .sale-card { background: var(--surface); margin: 0 14px 12px; border-radius: 18px; padding: 16px; border: 1px solid var(--border); box-shadow: var(--shadow); cursor: pointer; transition: all 0.2s; position: relative; overflow: hidden; }
  .sale-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }
  .sale-card:active { transform: scale(0.985); }

  .featured-badge { position: absolute; top: 0; right: 16px; background: var(--terracotta); color: white; font-size: 9px; font-weight: 700; letter-spacing: 0.08em; padding: 4px 10px; border-radius: 0 0 8px 8px; display: flex; align-items: center; gap: 4px; }

  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
  .type-badge { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; }
  .type-badge.estate { background: rgba(160,82,45,0.1); color: var(--estate); }
  .type-badge.garage { background: rgba(45,74,62,0.1); color: var(--garage); }
  .type-badge.thrift { background: rgba(107,76,138,0.1); color: var(--thrift); }

  .card-header-right { display: flex; align-items: center; gap: 8px; }
  .date-badge { padding: 3px 8px; border-radius: 6px; background: var(--cream-dark); font-size: 10px; font-weight: 600; color: var(--text-muted); }
  .date-badge.today { background: rgba(45,74,62,0.12); color: var(--forest); }
  .heart-btn { background: none; border: none; cursor: pointer; font-size: 18px; padding: 2px; line-height: 1; }

  .card-title { font-family: 'Playfair Display', serif; font-size: 16px; color: var(--text); margin-bottom: 8px; line-height: 1.3; }
  .card-location { display: flex; align-items: center; gap: 5px; margin-bottom: 8px; }
  .card-location-text { font-size: 13px; color: var(--text-secondary); flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .distance-pill { background: rgba(45,74,62,0.1); color: var(--forest); font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 100px; white-space: nowrap; }

  .card-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.5; margin-bottom: 10px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

  .card-tags { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
  .card-tag { background: var(--cream-dark); color: var(--text-secondary); font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 100px; }
  .card-tag-more { font-size: 11px; color: var(--text-muted); align-self: center; }

  .card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid var(--border); }
  .card-source { display: flex; align-items: center; gap: 5px; font-size: 12px; color: var(--text-muted); }
  .see-details { font-size: 13px; color: var(--terracotta); font-weight: 600; display: flex; align-items: center; gap: 2px; }

  /* SALE DETAIL */
  .detail-page { position: fixed; inset: 0; background: var(--cream); z-index: 50; overflow-y: auto; max-width: 430px; margin: 0 auto; animation: slideUp 0.3s ease; }
  @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .detail-nav { display: flex; align-items: center; gap: 12px; padding: 52px 16px 12px; background: var(--forest); position: sticky; top: 0; z-index: 10; }
  .back-btn { width: 36px; height: 36px; border-radius: 50%; background: rgba(240,235,226,0.15); border: none; color: var(--cream); font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .detail-nav-title { flex: 1; font-size: 15px; font-weight: 600; color: var(--cream); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .detail-heart { background: none; border: none; font-size: 22px; cursor: pointer; }

  .detail-content { padding: 20px 16px 60px; }

  .detail-type-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
  .detail-title { font-family: 'Playfair Display', serif; font-size: 24px; color: var(--text); line-height: 1.25; margin-bottom: 20px; }

  .info-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; padding: 4px 16px; margin-bottom: 20px; }
  .info-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); }
  .info-row:last-child { border-bottom: none; }
  .info-icon { width: 30px; height: 30px; border-radius: 50%; background: rgba(45,74,62,0.1); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; margin-top: 2px; }
  .info-label { font-size: 10px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 3px; }
  .info-value { font-size: 14px; color: var(--text); font-weight: 500; line-height: 1.4; }

  .detail-section { margin-bottom: 24px; }
  .detail-section-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .detail-desc { font-size: 14px; color: var(--text-secondary); line-height: 1.65; }

  .detail-tags { display: flex; flex-wrap: wrap; gap: 8px; }
  .detail-tag { background: rgba(45,74,62,0.08); color: var(--forest); font-size: 13px; font-weight: 500; padding: 5px 12px; border-radius: 100px; display: flex; align-items: center; gap: 5px; }

  .tip-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 10px; }
  .tip-bullet { width: 24px; height: 24px; border-radius: 50%; background: var(--terracotta); color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
  .tip-text { font-size: 14px; color: var(--text-secondary); line-height: 1.5; }

  .detail-actions { display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px; }
  .primary-btn { background: var(--terracotta); color: white; border: none; border-radius: 14px; padding: 15px; font-size: 15px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .primary-btn:hover { background: var(--terra-light); }
  .maps-row { display: flex; gap: 10px; }
  .map-btn { flex: 1; background: rgba(45,74,62,0.08); color: var(--forest); border: 1.5px solid rgba(45,74,62,0.2); border-radius: 14px; padding: 13px; font-size: 13px; font-weight: 600; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 7px; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .map-btn:hover { background: rgba(45,74,62,0.14); }

  .ai-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
  .ai-card-top { display: flex; align-items: flex-start; gap: 12px; padding: 16px; border-bottom: 1px solid var(--border); }
  .ai-avatar { width: 42px; height: 42px; border-radius: 50%; background: rgba(160,82,45,0.12); display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .ai-card-title { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
  .ai-card-sub { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
  .ai-card-btn { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; cursor: pointer; background: none; border: none; width: 100%; font-family: 'DM Sans', sans-serif; }
  .ai-card-btn-text { font-size: 14px; font-weight: 600; color: var(--terracotta); }

  /* SCAN PAGE */
  .scan-page { padding: 20px; }
  .upload-zone { border: 2px dashed rgba(92,61,46,0.25); border-radius: 20px; padding: 44px 24px; text-align: center; background: var(--surface); position: relative; overflow: hidden; transition: all 0.3s; }
  .upload-zone.drag-over { border-color: var(--terracotta); background: rgba(160,82,45,0.04); }
  .upload-zone::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at center, rgba(160,82,45,0.04) 0%, transparent 70%); pointer-events: none; }
  .camera-icon { font-size: 48px; margin-bottom: 14px; }
  .upload-title { font-family: 'Playfair Display', serif; font-size: 20px; color: var(--text); margin-bottom: 8px; }
  .upload-sub { font-size: 13px; color: var(--text-muted); line-height: 1.6; }
  .btn-row { display: flex; gap: 12px; margin-top: 20px; justify-content: center; }
  .upload-btn { padding: 12px 24px; background: var(--terracotta); color: white; border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .upload-btn:hover { background: var(--terra-light); transform: translateY(-1px); }
  .upload-btn-outline { padding: 12px 24px; background: transparent; color: var(--forest); border-radius: 100px; font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--forest); font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .upload-btn-outline:hover { background: rgba(45,74,62,0.06); transform: translateY(-1px); }

  .photo-count { font-size: 11px; color: var(--text-muted); text-align: center; margin-bottom: 12px; letter-spacing: 0.05em; }
  .photo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .photo-cell { position: relative; border-radius: 14px; overflow: hidden; aspect-ratio: 1; border: 1px solid var(--border); background: var(--cream-dark); }
  .photo-cell img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .photo-remove { position: absolute; top: 6px; right: 6px; background: rgba(42,31,20,0.65); border: none; color: white; width: 26px; height: 26px; border-radius: 50%; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .add-photo-cell { aspect-ratio: 1; border-radius: 14px; border: 2px dashed rgba(92,61,46,0.25); background: var(--surface); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; cursor: pointer; transition: all 0.2s; }
  .add-photo-cell:hover { border-color: var(--terracotta); }
  .add-photo-icon { font-size: 26px; color: var(--text-muted); }
  .add-photo-label { font-size: 11px; color: var(--text-muted); }
  .add-options-row { display: flex; gap: 8px; margin-bottom: 14px; }
  .add-opt-btn { flex: 1; padding: 10px; border-radius: 12px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-secondary); font-size: 12px; font-weight: 500; cursor: pointer; text-align: center; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
  .add-opt-btn:hover { border-color: var(--terracotta); color: var(--terracotta); }

  .analyze-btn { width: 100%; padding: 17px; background: var(--forest); color: var(--cream); border: none; border-radius: 16px; font-size: 16px; font-weight: 700; font-family: 'Playfair Display', serif; cursor: pointer; letter-spacing: 0.02em; transition: all 0.3s; }
  .analyze-btn:hover { background: var(--forest-light); transform: translateY(-2px); box-shadow: 0 8px 28px rgba(45,74,62,0.3); }
  .analyze-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

  .loading-spinner { display: inline-block; width: 17px; height: 17px; border: 2px solid rgba(240,235,226,0.3); border-top-color: var(--cream); border-radius: 50%; animation: spin 0.8s linear infinite; vertical-align: middle; margin-right: 8px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .result-card { background: var(--surface); border: 1px solid var(--border); border-radius: 20px; padding: 22px; margin-top: 20px; animation: fadeUp 0.4s ease; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .result-name { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 4px; }
  .result-era { font-size: 11px; color: var(--terracotta); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 18px; font-weight: 600; }
  .price-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 18px; }
  .price-box { background: var(--cream-dark); border-radius: 12px; padding: 13px 8px; text-align: center; }
  .price-label { font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px; font-weight: 600; }
  .price-value { font-family: 'Playfair Display', serif; font-size: 15px; font-weight: 700; }
  .price-original { color: var(--text-secondary); }
  .price-buy { color: var(--forest); }
  .price-resell { color: var(--terracotta); }
  .result-facts { font-size: 13px; color: var(--text-secondary); line-height: 1.7; border-top: 1px solid var(--border); padding-top: 16px; margin-bottom: 18px; }
  .save-section { display: flex; gap: 10px; align-items: center; }
  .folder-select { flex: 1; background: var(--cream-dark); border: 1px solid var(--border-strong); color: var(--text); padding: 11px 12px; border-radius: 12px; font-size: 13px; min-width: 0; font-family: 'DM Sans', sans-serif; outline: none; }
  .save-btn { padding: 11px 18px; background: var(--brown); color: white; border: none; border-radius: 12px; font-size: 13px; font-weight: 600; cursor: pointer; white-space: nowrap; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
  .save-btn:hover { background: var(--terracotta); }
  .save-btn.saved { background: var(--forest); }

  /* FINDS PAGE */
  .finds-page { padding: 16px; padding-bottom: 100px; }
  .folder-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: none; }
  .folder-tabs::-webkit-scrollbar { display: none; }
  .folder-chip { padding: 7px 15px; border-radius: 100px; font-size: 12px; font-weight: 600; white-space: nowrap; cursor: pointer; border: 1.5px solid var(--border-strong); background: transparent; color: var(--text-secondary); transition: all 0.2s; }
  .folder-chip.active { background: var(--forest); color: var(--cream); border-color: var(--forest); }
  .finds-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .find-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; animation: fadeUp 0.3s ease; box-shadow: var(--shadow); }
  .find-img { width: 100%; height: 130px; object-fit: cover; }
  .find-info { padding: 12px; }
  .find-name { font-family: 'Playfair Display', serif; font-size: 13px; color: var(--text); margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .find-price { font-size: 11px; color: var(--terracotta); font-weight: 600; }
  .find-folder { font-size: 10px; color: var(--text-muted); margin-top: 2px; }

  .empty-state { text-align: center; padding: 60px 24px; }
  .empty-icon { font-size: 48px; margin-bottom: 12px; }
  .empty-title { font-family: 'Playfair Display', serif; font-size: 18px; color: var(--text-secondary); margin-bottom: 8px; }
  .empty-sub { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  .toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%); background: var(--forest); color: var(--cream); padding: 12px 24px; border-radius: 100px; font-size: 13px; font-weight: 600; z-index: 100; animation: toastIn 0.3s ease, toastOut 0.3s ease 2.2s forwards; white-space: nowrap; box-shadow: var(--shadow-lg); }
  @keyframes toastIn { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }
  @keyframes toastOut { to { opacity:0; transform: translateX(-50%) translateY(10px); } }

  input[type="file"] { display: none; }
`;

const fileToBase64 = (file) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(r.result);
  r.onerror = rej;
  r.readAsDataURL(file);
});

export default function App() {
  const [tab, setTab] = useState("sales");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedSale, setSelectedSale] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState("My Finds");
  const [savedFinds, setSavedFinds] = useState([]);
  const [savedThisItem, setSavedThisItem] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeFolder, setActiveFolder] = useState("All");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();
  const cameraRef = useRef();

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2600); };

  // ── Sales feed ──────────────────────────────────────────────────────────────
  const filteredSales = MOCK_SALES.filter(s => {
    const matchFilter = filter === "all" || s.type === filter;
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()) || s.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchFilter && matchSearch;
  });

  const toggleFavorite = (id, e) => {
    e?.stopPropagation();
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  const typeLabel = (t) => t === "estate" ? "Estate Sale" : t === "garage" ? "Garage Sale" : "Thrift Store";
  const typeIcon = (t) => t === "estate" ? "🏠" : t === "garage" ? "🏷️" : "🛍️";
  const isToday = (s) => s.startDate === today || (s.endDate >= today && s.startDate <= today);

  // ── Photos / AI ─────────────────────────────────────────────────────────────
  const addFiles = async (files) => {
    const arr = Array.from(files).filter(f => f.type.startsWith("image/"));
    const converted = await Promise.all(arr.map(async f => ({ dataUrl: await fileToBase64(f), mimeType: f.type })));
    setPhotos(prev => { const slots = MAX_PHOTOS - prev.length; return [...prev, ...converted.slice(0, slots)]; });
    setResult(null); setSavedThisItem(false);
  };

  const handleDrop = useCallback((e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }, []);

  const analyze = async () => {
    if (!photos.length) return;
    setLoading(true); setResult(null);
    try {
      const imageBlocks = photos.map(p => ({ type: "image", source: { type: "base64", media_type: p.mimeType, data: p.dataUrl.split(",")[1] } }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: [...imageBlocks, { type: "text", text: `You are an expert antiques appraiser and resale specialist. Analyze this item using eBay sold listings and other online marketplaces as your primary pricing reference. Respond ONLY with a valid JSON object — no markdown, no backticks, no preamble:\n{\n  "name": "Specific item name",\n  "era": "Decade/era or 'Modern'",\n  "originalPrice": "$XX – $XX",\n  "buyPrice": "$XX – $XX (what to pay at a sale)",\n  "resellPrice": "$XX – $XX (eBay sold comp range)",\n  "facts": "2-3 sentences: item history, what makes it valuable, and what to look for when buying similar pieces."\n}` }] }],
        })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.content?.find(b => b.type === "text")?.text || "";
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (err) {
      setResult({ error: "Couldn't analyze this image. Try again with a clearer photo." });
    }
    setLoading(false);
  };

  const saveFind = () => {
    if (!result || savedThisItem) return;
    setSavedFinds(prev => [{ id: Date.now(), name: result.name, era: result.era, resellPrice: result.resellPrice, folder: selectedFolder, imageUrl: photos[0]?.dataUrl }, ...prev]);
    setSavedThisItem(true);
    showToast(`Saved to "${selectedFolder}" ✓`);
  };

  const canAddMore = photos.length < MAX_PHOTOS;
  const folderOptions = ["All", ...FOLDERS];
  const filteredFinds = activeFolder === "All" ? savedFinds : savedFinds.filter(f => f.folder === activeFolder);

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* HEADER */}
        <div className="header">
          <div className="header-inner">
            <div className="logo">Miss <em>Mess</em> Marketplace</div>
            <div className="tagline">Treasure hunting, reimagined</div>
          </div>
        </div>

        {/* TABS */}
        <div className="tabs">
          <button className={`tab ${tab === "sales" ? "active" : ""}`} onClick={() => setTab("sales")}>🏷 Sales</button>
          <button className={`tab ${tab === "scan" ? "active" : ""}`} onClick={() => setTab("scan")}>📷 Identify</button>
          <button className={`tab ${tab === "finds" ? "active" : ""}`} onClick={() => setTab("finds")}>🗂 My Finds {savedFinds.length > 0 && `(${savedFinds.length})`}</button>
        </div>

        {/* Hidden file inputs */}
        <input type="file" ref={fileRef} accept="image/*" multiple onChange={e => addFiles(e.target.files)} />
        <input type="file" ref={cameraRef} accept="image/*" capture="environment" onChange={e => addFiles(e.target.files)} />

        {/* ── SALES TAB ── */}
        {tab === "sales" && !selectedSale && (
          <div className="feed-page">
            <div className="feed-header">
              <div className="location-row">
                <span className="location-pin">📍</span>
                <span className="location-text">Forest Park, St. Louis, MO</span>
                <span className="sale-count">{filteredSales.length} sales</span>
              </div>
              <div className="search-bar">
                <span className="search-icon">🔍</span>
                <input className="search-input" placeholder="City, zip, or keyword..." value={search} onChange={e => setSearch(e.target.value)} />
                {search && <button style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 16 }} onClick={() => setSearch("")}>✕</button>}
              </div>
              <div className="filter-row">
                {FILTERS.map(f => (
                  <button key={f} className={`filter-chip ${filter === f ? `active-${f}` : ""}`} onClick={() => setFilter(f)}>
                    {f === "all" ? "All Sales" : f === "estate" ? "🏠 Estate" : f === "garage" ? "🏷 Garage" : "🛍 Thrift"}
                  </button>
                ))}
              </div>
            </div>

            <div className="sales-list">
              {filteredSales.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📍</div>
                  <div className="empty-title">No sales found</div>
                  <div className="empty-sub">Try a different filter or search term</div>
                </div>
              ) : filteredSales.map(sale => (
                <div key={sale.id} className="sale-card" onClick={() => setSelectedSale(sale)}>
                  {sale.featured && <div className="featured-badge">⭐ FEATURED</div>}
                  <div className="card-header">
                    <div className={`type-badge ${sale.type}`}>{typeIcon(sale.type)} {typeLabel(sale.type)}</div>
                    <div className="card-header-right">
                      <div className={`date-badge ${isToday(sale) ? "today" : ""}`}>{isToday(sale) ? "TODAY" : sale.startDate}</div>
                      <button className="heart-btn" onClick={e => toggleFavorite(sale.id, e)}>
                        {favorites.includes(sale.id) ? "❤️" : "🤍"}
                      </button>
                    </div>
                  </div>
                  <div className="card-title">{sale.title}</div>
                  <div className="card-location">
                    <span style={{ fontSize: 13 }}>📍</span>
                    <span className="card-location-text">{sale.address}, {sale.city}</span>
                    <span className="distance-pill">{sale.distance.toFixed(1)} mi</span>
                  </div>
                  {sale.description && <div className="card-desc">{sale.description}</div>}
                  {sale.tags?.length > 0 && (
                    <div className="card-tags">
                      {sale.tags.slice(0, 4).map(t => <span key={t} className="card-tag">{t}</span>)}
                      {sale.tags.length > 4 && <span className="card-tag-more">+{sale.tags.length - 4}</span>}
                    </div>
                  )}
                  <div className="card-footer">
                    <div className="card-source">🌐 {sale.source}</div>
                    <div className="see-details">See details ›</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SALE DETAIL ── */}
        {tab === "sales" && selectedSale && (
          <div className="detail-page">
            <div className="detail-nav">
              <button className="back-btn" onClick={() => setSelectedSale(null)}>‹</button>
              <span className="detail-nav-title">{selectedSale.title}</span>
              <button className="detail-heart" onClick={() => toggleFavorite(selectedSale.id)}>
                {favorites.includes(selectedSale.id) ? "❤️" : "🤍"}
              </button>
            </div>
            <div className="detail-content">
              <div className="detail-type-row">
                <div className={`type-badge ${selectedSale.type}`}>{typeIcon(selectedSale.type)} {typeLabel(selectedSale.type)}</div>
                <span className="distance-pill">📍 {selectedSale.distance.toFixed(1)} miles away</span>
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

              {selectedSale.tags?.length > 0 && (
                <div className="detail-section">
                  <div className="detail-section-title">Featured Items</div>
                  <div className="detail-tags">
                    {selectedSale.tags.map(t => <span key={t} className="detail-tag">📦 {t}</span>)}
                  </div>
                </div>
              )}

              <div className="detail-section">
                <div className="detail-section-title">⚡ Negotiation Tips</div>
                {NEGOTIATION_TIPS[selectedSale.type].map((tip, i) => (
                  <div key={i} className="tip-row">
                    <div className="tip-bullet">{i + 1}</div>
                    <div className="tip-text">{tip}</div>
                  </div>
                ))}
              </div>

              <div className="detail-actions">
                <button className="primary-btn" onClick={() => window.open(selectedSale.url, "_blank")}>
                  🔗 View on {selectedSale.source}
                </button>
                <div className="maps-row">
                  <button className="map-btn" onClick={() => window.open(`https://maps.apple.com/?daddr=${encodeURIComponent(selectedSale.address + ", " + selectedSale.city + ", " + selectedSale.state)}`, "_blank")}>
                    🗺 Apple Maps
                  </button>
                  <button className="map-btn" onClick={() => window.open(`https://waze.com/ul?q=${encodeURIComponent(selectedSale.address + ", " + selectedSale.city + ", " + selectedSale.state)}`, "_blank")}>
                    🧭 Waze
                  </button>
                </div>
              </div>

              <div className="ai-card">
                <div className="ai-card-top">
                  <div className="ai-avatar">🤖</div>
                  <div>
                    <div className="ai-card-title">Research with AI</div>
                    <div className="ai-card-sub">Ask our AI expert about items at this sale — get values, ID tips, and negotiation advice</div>
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
        {tab === "scan" && (
          <div className="scan-page">
            {photos.length === 0 ? (
              <div className={`upload-zone ${dragOver ? "drag-over" : ""}`} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
                <div className="camera-icon">📸</div>
                <div className="upload-title">Find something interesting?</div>
                <div className="upload-sub">Add up to 4 photos — different angles help AI identify it better</div>
                <div className="btn-row">
                  <button className="upload-btn" onClick={() => cameraRef.current.click()}>📷 Camera</button>
                  <button className="upload-btn-outline" onClick={() => fileRef.current.click()}>🖼 Library</button>
                </div>
              </div>
            ) : (
              <>
                <div className="photo-count">{photos.length} of {MAX_PHOTOS} photos</div>
                <div className="photo-grid">
                  {photos.map((p, i) => (
                    <div key={i} className="photo-cell">
                      <img src={p.dataUrl} alt={`Photo ${i + 1}`} />
                      <button className="photo-remove" onClick={() => { setPhotos(prev => prev.filter((_, j) => j !== i)); setResult(null); }}>✕</button>
                    </div>
                  ))}
                  {canAddMore && <div className="add-photo-cell" onClick={() => fileRef.current.click()}><div className="add-photo-icon">+</div><div className="add-photo-label">Add photo</div></div>}
                </div>
                <div className="add-options-row">
                  {canAddMore && <><button className="add-opt-btn" onClick={() => cameraRef.current.click()}>📷 Camera</button><button className="add-opt-btn" onClick={() => fileRef.current.click()}>🖼 Library</button></>}
                  <button className="add-opt-btn" onClick={() => { setPhotos([]); setResult(null); }}>🗑 Clear</button>
                </div>
                <button className="analyze-btn" onClick={analyze} disabled={loading}>
                  {loading ? <><span className="loading-spinner" />Analyzing {photos.length} photo{photos.length > 1 ? "s" : ""}...</> : "✦ Identify This Item"}
                </button>
              </>
            )}

            {result && !result.error && (
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
                  <select className="folder-select" value={selectedFolder} onChange={e => setSelectedFolder(e.target.value)}>
                    {FOLDERS.map(f => <option key={f}>{f}</option>)}
                  </select>
                  <button className={`save-btn ${savedThisItem ? "saved" : ""}`} onClick={saveFind}>{savedThisItem ? "✓ Saved!" : "Save Find"}</button>
                </div>
              </div>
            )}
            {result?.error && <div className="result-card" style={{ textAlign: "center", color: "var(--text-muted)" }}>{result.error}</div>}
          </div>
        )}

        {/* ── FINDS TAB ── */}
        {tab === "finds" && (
          <div className="finds-page">
            <div className="folder-tabs">
              {folderOptions.map(f => <button key={f} className={`folder-chip ${activeFolder === f ? "active" : ""}`} onClick={() => setActiveFolder(f)}>{f}</button>)}
            </div>
            {filteredFinds.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏺</div>
                <div className="empty-title">No finds yet</div>
                <div className="empty-sub">{activeFolder === "All" ? "Identify an item and save it here." : `Nothing saved to "${activeFolder}" yet.`}</div>
              </div>
            ) : (
              <div className="finds-grid">
                {filteredFinds.map(find => (
                  <div key={find.id} className="find-card">
                    <img src={find.imageUrl} alt={find.name} className="find-img" />
                    <div className="find-info">
                      <div className="find-name">{find.name}</div>
                      <div className="find-price">Resell: {find.resellPrice}</div>
                      <div className="find-folder">{find.folder}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </>
  );
}
