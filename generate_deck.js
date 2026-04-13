const pptxgen = require("pptxgenjs");

// ─── Brand colors (NO # prefix) ───────────────────────────────────────────────
const C = {
  navy:      "0F1A2E",
  navyMid:   "162236",
  navyLight: "1E3A5F",
  cream:     "F7F5F0",
  creamDark: "EDE9E0",
  gold:      "C5A572",
  goldLight: "E8D5B0",
  white:     "FFFFFF",
  muted:     "64748B",
  mutedLight:"94A3B8",
  green:     "2D6A4F",
  red:       "C4544A",
  text:      "1E293B",
};

let pres = new pptxgen();
pres.layout  = "LAYOUT_16x9"; // 10" × 5.625"
pres.title   = "Legal Foundry — Pitch Deck";
pres.author  = "Legal Foundry";

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — MAYA NARRATIVE
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  // Top gold rule
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.05,
    fill:{ color: C.gold }, line:{ color: C.gold } });

  // ── LEFT COLUMN ──────────────────────────────────────────────────────
  s.addText("You want to change the world.", {
    x:0.55, y:0.4, w:5.7, h:0.65,
    fontSize:24, fontFace:"Palatino",
    color:C.white, italic:true, align:"left", margin:0,
  });
  s.addText("You have the idea, the team, the drive.", {
    x:0.55, y:1.06, w:5.7, h:0.4,
    fontSize:14, fontFace:"Calibri",
    color:C.gold, align:"left", margin:0,
  });
  s.addText(
    "But the world hands you a stack of red tape —\n" +
    "and a $1,000/hr bill for every question you ask.",
    {
      x:0.55, y:1.52, w:5.7, h:0.72,
      fontSize:12.5, fontFace:"Calibri",
      color:C.mutedLight, align:"left", margin:0,
    }
  );

  // Divider
  s.addShape(pres.shapes.RECTANGLE, { x:0.55, y:2.42, w:4.2, h:0.02,
    fill:{ color: C.navyLight }, line:{ color: C.navyLight } });

  s.addText("Meet Maya.", {
    x:0.55, y:2.58, w:5.7, h:0.5,
    fontSize:21, fontFace:"Palatino",
    color:C.white, bold:true, align:"left", margin:0,
  });

  // Issue 1
  s.addShape(pres.shapes.RECTANGLE, { x:0.55, y:3.25, w:0.2, h:0.2,
    fill:{ color: C.red }, line:{ color: C.red } });
  s.addText("Her contractor never signed an IP assignment.", {
    x:0.82, y:3.23, w:5.4, h:0.26,
    fontSize:11.5, fontFace:"Calibri",
    color:"E09090", align:"left", margin:0,
  });

  // Issue 2
  s.addShape(pres.shapes.RECTANGLE, { x:0.55, y:3.61, w:0.2, h:0.2,
    fill:{ color: C.red }, line:{ color: C.red } });
  s.addText("Her co-founder agreement will kill her Series A.", {
    x:0.82, y:3.59, w:5.4, h:0.26,
    fontSize:11.5, fontFace:"Calibri",
    color:"E09090", align:"left", margin:0,
  });

  s.addText("12 months later — $200,000 in preventable mistakes.", {
    x:0.55, y:4.05, w:5.7, h:0.35,
    fontSize:12.5, fontFace:"Calibri",
    color:C.gold, bold:true, align:"left", margin:0,
  });

  // ── RIGHT PANEL ───────────────────────────────────────────────────────
  s.addShape(pres.shapes.RECTANGLE, { x:6.75, y:0.72, w:2.85, h:4.32,
    fill:{ color:"0A1520" }, line:{ color: C.navyLight, width:1 } });
  s.addShape(pres.shapes.RECTANGLE, { x:6.75, y:0.72, w:0.05, h:4.32,
    fill:{ color: C.gold }, line:{ color: C.gold } });

  s.addText("Legal Foundry", {
    x:6.9, y:1.12, w:2.5, h:0.48,
    fontSize:17, fontFace:"Palatino",
    color:C.gold, bold:true, align:"center", margin:0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x:7.55, y:1.7, w:1.4, h:0.02,
    fill:{ color: C.navyLight }, line:{ color: C.navyLight } });

  s.addText("A legal team in every\nfounder's pocket\nfrom day one.", {
    x:6.9, y:1.82, w:2.5, h:1.25,
    fontSize:15, fontFace:"Palatino",
    color:C.white, italic:true, align:"center", margin:0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x:7.55, y:3.2, w:1.4, h:0.02,
    fill:{ color: C.navyLight }, line:{ color: C.navyLight } });

  s.addText(
    "Maya should be building\nher company — not losing\nsleep over a legal system\nnever built for her.",
    {
      x:6.9, y:3.32, w:2.5, h:1.28,
      fontSize:10, fontFace:"Calibri",
      color:"7A90A8", align:"center", margin:0,
    }
  );

  // Bottom tagline
  s.addText("THE LEGAL STACK YOU DESERVE", {
    x:0, y:5.23, w:10, h:0.3,
    fontSize:8, fontFace:"Calibri",
    color:"2A4A6A", align:"center", charSpacing:5, margin:0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — DEMO
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.navy };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.05,
    fill:{ color: C.gold }, line:{ color: C.gold } });

  s.addText("DEMO", {
    x:0, y:1.5, w:10, h:1.9,
    fontSize:84, fontFace:"Palatino",
    color:C.white, bold:false, align:"center",
    charSpacing:22, margin:0,
  });

  s.addShape(pres.shapes.RECTANGLE, { x:3.8, y:3.62, w:2.4, h:0.04,
    fill:{ color: C.gold }, line:{ color: C.gold } });

  s.addText("legalfoundry.co", {
    x:0, y:3.8, w:10, h:0.5,
    fontSize:16, fontFace:"Calibri",
    color:C.gold, align:"center", margin:0,
  });

  s.addText("THE LEGAL STACK YOU DESERVE", {
    x:0, y:5.23, w:10, h:0.3,
    fontSize:8, fontFace:"Calibri",
    color:"2A4A6A", align:"center", charSpacing:5, margin:0,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — PRICING
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08,
    fill:{ color: C.navy }, line:{ color: C.navy } });

  s.addText("PRICING", {
    x:0.55, y:0.2, w:3, h:0.35,
    fontSize:9, fontFace:"Calibri",
    color:C.muted, charSpacing:4, align:"left", margin:0,
  });
  s.addText("Per-Company. Per-Token. Simple.", {
    x:0.55, y:0.56, w:7, h:0.55,
    fontSize:26, fontFace:"Palatino",
    color:C.navy, align:"left", margin:0,
  });

  const tiers = [
    {
      name:"Base", price:"$99", sub:"/ month per company",
      tokens:"500K tokens / mo",
      features:[
        "All 6 modules",
        "Unlimited AI chat",
        "Document vault",
        "No lawyer reviews",
      ],
      highlight:false,
    },
    {
      name:"Base+", price:"$199", sub:"/ month per company",
      tokens:"2M tokens / mo",
      features:[
        "Everything in Base",
        "4× token capacity",
        "Priority email support",
        "No lawyer reviews",
      ],
      highlight:false,
    },
    {
      name:"Pro", price:"$699", sub:"/ month per company",
      tokens:"500K tokens / mo",
      features:[
        "Everything in Base+",
        "5 lawyer reviews / mo",
        "1 legal opinion / mo",
        "Bespoke services access",
      ],
      highlight:false,
    },
    {
      name:"Platinum", price:"$999", sub:"/ month per company",
      tokens:"Unlimited tokens",
      features:[
        "Everything in Pro",
        "25 lawyer reviews / mo",
        "5 legal opinions / mo",
        "Dedicated legal team",
      ],
      highlight:true,
    },
  ];

  const colW  = 2.15;
  const gap   = 0.1;
  const startX = 0.45;
  const cardY  = 1.32;
  const cardH  = 3.88;

  tiers.forEach((tier, i) => {
    const x = startX + i * (colW + gap);
    const isHL = tier.highlight;
    const bg        = isHL ? C.navy    : C.white;
    const textColor = isHL ? C.white   : C.text;
    const subColor  = isHL ? "7A9ABC"  : C.muted;
    const goldColor = isHL ? C.goldLight : C.gold;

    // Card
    s.addShape(pres.shapes.RECTANGLE, { x, y:cardY, w:colW, h:cardH,
      fill:{ color: bg }, line:{ color: isHL ? C.navy : "E2E8F0", width:1 } });

    // Gold top bar
    s.addShape(pres.shapes.RECTANGLE, { x, y:cardY, w:colW, h:0.05,
      fill:{ color: C.gold }, line:{ color: C.gold } });

    // Tier name
    s.addText(tier.name.toUpperCase(), {
      x:x+0.15, y:cardY+0.18, w:colW-0.3, h:0.3,
      fontSize:9, fontFace:"Calibri",
      color:goldColor, bold:true, charSpacing:2, margin:0,
    });

    // Price
    s.addText(tier.price, {
      x:x+0.15, y:cardY+0.52, w:colW-0.3, h:0.68,
      fontSize:tier.price === "Free" ? 32 : 28, fontFace:"Palatino",
      color:textColor, bold:true, margin:0,
    });

    // Sub
    s.addText(tier.sub, {
      x:x+0.15, y:cardY+1.18, w:colW-0.3, h:0.3,
      fontSize:8, fontFace:"Calibri",
      color:subColor, margin:0,
    });

    // Token badge
    s.addShape(pres.shapes.RECTANGLE, {
      x:x+0.15, y:cardY+1.55, w:colW-0.3, h:0.28,
      fill:{ color: isHL ? C.navyLight : "EDE9E0" },
      line:{ color: isHL ? C.navyLight : "D4D0C8", width:1 },
    });
    s.addText(tier.tokens, {
      x:x+0.15, y:cardY+1.57, w:colW-0.3, h:0.26,
      fontSize:8.5, fontFace:"Calibri",
      color: isHL ? C.goldLight : C.navy, bold:true,
      align:"center", margin:0,
    });

    // Features
    tier.features.forEach((feat, fi) => {
      const fy = cardY + 1.98 + fi * 0.34;
      s.addShape(pres.shapes.RECTANGLE, { x:x+0.18, y:fy+0.07, w:0.1, h:0.1,
        fill:{ color: C.gold }, line:{ color: C.gold } });
      s.addText(feat, {
        x:x+0.34, y:fy, w:colW-0.48, h:0.3,
        fontSize:9, fontFace:"Calibri",
        color:textColor, align:"left", margin:0,
      });
    });
  });

  // "MOST POPULAR" badge above Platinum column (i=3)
  const proX = startX + 3 * (colW + gap);
  const badgeW = colW * 0.7;
  const badgeX = proX + (colW - badgeW) / 2;
  s.addShape(pres.shapes.RECTANGLE, { x:badgeX, y:cardY-0.33, w:badgeW, h:0.27,
    fill:{ color: C.gold }, line:{ color: C.gold } });
  s.addText("MOST POPULAR", {
    x:badgeX, y:cardY-0.33, w:badgeW, h:0.27,
    fontSize:7.5, fontFace:"Calibri",
    color:C.navy, bold:true, align:"center", charSpacing:1, margin:0,
  });

  // Footer note
  s.addText(
    "All plans billed monthly per company · No per-seat fees · Cancel anytime · Token rollover not included",
    {
      x:0.55, y:5.32, w:8.9, h:0.22,
      fontSize:7.5, fontFace:"Calibri",
      color:C.muted, align:"center", margin:0,
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — COMPETITIVE COMPARISON
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08,
    fill:{ color: C.navy }, line:{ color: C.navy } });

  s.addText("COMPETITIVE LANDSCAPE", {
    x:0.55, y:0.2, w:5, h:0.35,
    fontSize:9, fontFace:"Calibri",
    color:C.muted, charSpacing:4, align:"left", margin:0,
  });
  s.addText("Why Legal Foundry Wins", {
    x:0.55, y:0.56, w:7, h:0.52,
    fontSize:24, fontFace:"Palatino",
    color:C.navy, align:"left", margin:0,
  });

  // Column widths (total = 8.75, starting at x=0.45 → right edge 9.2)
  const colW  = [1.6, 1.4, 1.35, 1.1, 1.1, 1.1, 1.1];
  const tableX = 0.45;
  const tableY = 1.22;
  const rowH   = 0.385;

  const headers = ["", "Legal Foundry", "LegalZoom", "Clerky", "Stripe Atlas", "Rocket Lawyer", "Harvey AI"];
  const rows = [
    ["AI-Powered Workflow", "✓", "✗", "✗", "✗", "✗", "✓"],
    ["Lawyer in the Loop",  "✓", "✗", "✗", "✗", "✗", "✓"],
    ["All Entity Types",    "✓", "✓", "✗", "✗", "✓", "✗"],
    ["Token-Based Pricing", "✓", "✗", "✗", "✗", "✗", "✗"],
    ["Full Legal Platform", "✓", "Partial","✗","✗","Partial","Partial"],
    ["Startup-Focused",     "✓", "✗", "✓", "✓", "✗", "✗"],
    ["College Market",      "✓", "✗", "✗", "✗", "✗", "✗"],
    ["Price",               "$99–999/mo", "$79–299+", "$799+", "$500", "$39/mo", "Enterprise"],
  ];

  // Header row
  let hx = tableX;
  headers.forEach((h, i) => {
    const bg = i === 1 ? C.navy : (i === 0 ? C.cream : "EDE9E0");
    const tc = i === 1 ? C.white : (i === 0 ? C.navy : C.text);
    s.addShape(pres.shapes.RECTANGLE, { x:hx, y:tableY, w:colW[i], h:rowH,
      fill:{ color: bg }, line:{ color:"D4D0C8", width:0.5 } });
    if (h) {
      s.addText(h, {
        x:hx+0.05, y:tableY, w:colW[i]-0.1, h:rowH,
        fontSize: i === 1 ? 9.5 : 8.5, fontFace:"Calibri",
        color:tc, bold:true, align:"center", valign:"middle", margin:0,
      });
    }
    hx += colW[i];
  });

  // Data rows
  rows.forEach((row, ri) => {
    const rowY = tableY + rowH + ri * rowH;
    const isEven = ri % 2 === 0;
    let rx = tableX;

    row.forEach((cell, ci) => {
      const isLF    = ci === 1;
      const isLabel = ci === 0;
      const bg = isLF    ? "E8F0F8" :
                 isLabel ? C.cream  :
                 isEven  ? C.white  : "F5F3EE";

      s.addShape(pres.shapes.RECTANGLE, { x:rx, y:rowY, w:colW[ci], h:rowH,
        fill:{ color: bg }, line:{ color:"D4D0C8", width:0.5 } });

      const isCheck = cell === "✓";
      const isCross = cell === "✗";
      const tc = isCheck ? C.green :
                 isCross ? C.red   :
                 isLabel ? C.navy  : C.text;

      s.addText(cell, {
        x:rx+0.05, y:rowY, w:colW[ci]-0.1, h:rowH,
        fontSize: isLabel ? 9 : (isCheck || isCross ? 12 : 8.5),
        fontFace:"Calibri",
        color:tc,
        bold: isLabel || isCheck || isCross,
        align: isLabel ? "left" : "center",
        valign:"middle", margin:0,
      });

      rx += colW[ci];
    });
  });

  // Gold border around Legal Foundry column
  const lfColX = tableX + colW[0];
  const lfTotalH = rowH * (1 + rows.length);
  // Top bar (gold)
  s.addShape(pres.shapes.RECTANGLE, { x:lfColX, y:tableY, w:colW[1], h:0.05,
    fill:{ color: C.gold }, line:{ color: C.gold } });
  // Left edge
  s.addShape(pres.shapes.RECTANGLE, { x:lfColX, y:tableY, w:0.04, h:lfTotalH,
    fill:{ color: C.gold }, line:{ color: C.gold } });
  // Right edge
  s.addShape(pres.shapes.RECTANGLE, { x:lfColX+colW[1]-0.04, y:tableY, w:0.04, h:lfTotalH,
    fill:{ color: C.gold }, line:{ color: C.gold } });
  // Bottom edge
  s.addShape(pres.shapes.RECTANGLE, { x:lfColX, y:tableY+lfTotalH-0.04, w:colW[1], h:0.04,
    fill:{ color: C.gold }, line:{ color: C.gold } });

  s.addText(
    "Sources: Company websites, public pricing pages, product reviews (2025). Harvey AI = enterprise only.",
    {
      x:0.55, y:5.35, w:8.9, h:0.22,
      fontSize:7, fontFace:"Calibri",
      color:C.muted, align:"left", margin:0,
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — HOW WE'RE DIFFERENT
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08,
    fill:{ color: C.navy }, line:{ color: C.navy } });

  s.addText("OUR EDGE", {
    x:0.55, y:0.2, w:3, h:0.35,
    fontSize:9, fontFace:"Calibri",
    color:C.muted, charSpacing:4, align:"left", margin:0,
  });
  s.addText("How Legal Foundry is Different", {
    x:0.55, y:0.56, w:8, h:0.52,
    fontSize:24, fontFace:"Palatino",
    color:C.navy, align:"left", margin:0,
  });

  const diffs = [
    {
      num:"01",
      title:"Full Legal Platform",
      sub:"Not Just Incorporation",
      desc:"6 modules covering the entire startup legal journey: incorporation, agreements, IP, fundraising, compliance, and bespoke services — expanding to contracts and international.",
    },
    {
      num:"02",
      title:"Human in the Loop",
      sub:"Lawyer Review on Pro+",
      desc:"Pro and Enterprise plans include attorney review on critical documents. AI drafts at speed, lawyers sign off with authority. The perfect blend of cost and confidence.",
    },
    {
      num:"03",
      title:"Token-Based Pricing",
      sub:"Per-Company, Not Per-User",
      desc:"No per-seat fees. No per-doc charges. One flat company price with token caps that scale with your growth. Transparent, predictable, founder-friendly.",
    },
    {
      num:"04",
      title:"The Campus Advantage",
      sub:"Ground-Zero Distribution",
      desc:"We enter at day zero — college campuses and accelerators — before competitors know a founder exists. Low CAC ($200), high LTV ($2,400), organic word-of-mouth flywheel.",
    },
  ];

  const cardW = 4.42;
  const cardH = 1.95;
  const positions = [
    { x:0.45, y:1.28 },
    { x:5.08, y:1.28 },
    { x:0.45, y:3.35 },
    { x:5.08, y:3.35 },
  ];

  diffs.forEach((d, i) => {
    const { x, y } = positions[i];

    // Card bg
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:cardW, h:cardH,
      fill:{ color: C.white }, line:{ color:"E2E8F0", width:1 } });
    // Gold left accent
    s.addShape(pres.shapes.RECTANGLE, { x, y, w:0.05, h:cardH,
      fill:{ color: C.gold }, line:{ color: C.gold } });

    // Number
    s.addText(d.num, {
      x:x+0.18, y:y+0.13, w:0.55, h:0.5,
      fontSize:22, fontFace:"Palatino",
      color:C.goldLight, bold:true, margin:0,
    });

    // Title
    s.addText(d.title, {
      x:x+0.78, y:y+0.1, w:cardW-0.92, h:0.42,
      fontSize:14, fontFace:"Palatino",
      color:C.navy, bold:false, align:"left", margin:0,
    });

    // Sub
    s.addText(d.sub.toUpperCase(), {
      x:x+0.78, y:y+0.52, w:cardW-0.92, h:0.25,
      fontSize:7.5, fontFace:"Calibri",
      color:C.gold, bold:true, charSpacing:1, align:"left", margin:0,
    });

    // Description
    s.addText(d.desc, {
      x:x+0.18, y:y+0.85, w:cardW-0.32, h:1.0,
      fontSize:9.5, fontFace:"Calibri",
      color:C.muted, align:"left", margin:0,
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — FINANCIALS  (data from LegalFoundry_Pricing_Model.xlsx, Tab 2)
// ─────────────────────────────────────────────────────────────────────────────
{
  const s = pres.addSlide();
  s.background = { color: C.cream };

  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08,
    fill:{ color: C.navy }, line:{ color: C.navy } });

  s.addText("FINANCIALS", {
    x:0.55, y:0.2, w:3, h:0.32,
    fontSize:9, fontFace:"Calibri",
    color:C.muted, charSpacing:4, align:"left", margin:0,
  });
  s.addText("18-Month Financial Trajectory", {
    x:0.55, y:0.54, w:7.5, h:0.5,
    fontSize:22, fontFace:"Palatino",
    color:C.navy, align:"left", margin:0,
  });

  // ── Data from Monthly Finances tab (updated model) ───────────────────────
  const months = [
    "M1","M2","M3","M4","M5","M6",
    "M7","M8","M9","M10","M11","M12",
    "M13","M14","M15","M16","M17","M18",
  ];
  const coreRev = [
    5340, 6408, 7476, 8544, 9612, 11214,
    13884, 17622, 21894, 27234, 34176, 42720,
    49128, 56604, 65148, 74760, 85974, 98790,
  ];
  const bespokeRev = [
    0, 0, 0, 427, 481, 1290,
    1597, 2027, 2518, 3132, 3930, 10680,
    12282, 14151, 16287, 18690, 21494, 24698,
  ];
  const opProfit = [
    -5043, -4852, -4660, -4255, -4037, -3346,
    -5914, -5029, -4018, -2754, -1111, 3795,
    -2256, 19, 2618, 5541, 8953, 12851,
  ];
  // Gross margin % per month (from model)
  const gmPct = [
    17.9, 17.9, 17.9, 19.4, 19.4, 21.2,
    21.2, 21.2, 21.2, 21.2, 21.2, 24.3,
    24.3, 24.3, 24.3, 24.3, 24.3, 24.3,
  ];

  // ── CHART 1: Revenue stacked bar ─────────────────────────────────────────
  s.addText("REVENUE ($)", {
    x:0.42, y:1.08, w:2, h:0.22,
    fontSize:7, fontFace:"Calibri",
    color:C.muted, bold:true, charSpacing:1, margin:0,
  });
  s.addChart(pres.charts.BAR, [
    { name:"Core Product",     labels: months, values: coreRev },
    { name:"Bespoke Services", labels: months, values: bespokeRev },
  ], {
    x:0.42, y:1.12, w:6.0, h:1.92,
    barDir:"col", barGrouping:"stacked",
    chartColors:[C.navy, C.gold],
    chartArea:{ fill:{ color: C.white } },
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted,
    catAxisLabelFontFace:"Calibri", valAxisLabelFontFace:"Calibri",
    catAxisLabelFontSize:6.5, valAxisLabelFontSize:7,
    valGridLine:{ color:"E2E8F0", size:0.5 },
    catGridLine:{ style:"none" },
    showValue:false, showLegend:true,
    legendPos:"b", legendFontSize:7, legendFontFace:"Calibri", legendColor:C.muted,
    showTitle:false,
  });

  // ── CHART 2: Operating Profit line (J-curve) ─────────────────────────────
  s.addText("OPERATING PROFIT ($)", {
    x:0.42, y:3.13, w:3, h:0.22,
    fontSize:7, fontFace:"Calibri",
    color:C.muted, bold:true, charSpacing:1, margin:0,
  });
  s.addChart(pres.charts.LINE, [
    { name:"Operating Profit", labels: months, values: opProfit },
  ], {
    x:0.42, y:3.18, w:3.88, h:1.86,
    chartColors:["C4544A"],   // red/negative feel, turns positive at M12
    chartArea:{ fill:{ color: C.white } },
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted,
    catAxisLabelFontFace:"Calibri", valAxisLabelFontFace:"Calibri",
    catAxisLabelFontSize:6.5, valAxisLabelFontSize:7,
    valGridLine:{ color:"E2E8F0", size:0.5 },
    catGridLine:{ style:"none" },
    lineSize:2, lineSmooth:true,
    showValue:false, showLegend:false, showTitle:false,
  });

  // ── CHART 3: Gross Margin % line ─────────────────────────────────────────
  s.addText("GROSS MARGIN (%)", {
    x:4.54, y:3.13, w:2.5, h:0.22,
    fontSize:7, fontFace:"Calibri",
    color:C.muted, bold:true, charSpacing:1, margin:0,
  });
  s.addChart(pres.charts.LINE, [
    { name:"Gross Margin %", labels: months, values: gmPct },
  ], {
    x:4.54, y:3.18, w:1.88, h:1.86,
    chartColors:[C.gold],
    chartArea:{ fill:{ color: C.white } },
    catAxisLabelColor: C.muted, valAxisLabelColor: C.muted,
    catAxisLabelFontFace:"Calibri", valAxisLabelFontFace:"Calibri",
    catAxisLabelFontSize:6.5, valAxisLabelFontSize:7,
    valAxisMinVal: 20, valAxisMaxVal: 36,
    valGridLine:{ color:"E2E8F0", size:0.5 },
    catGridLine:{ style:"none" },
    lineSize:2.5, lineSmooth:true,
    showValue:false, showLegend:false, showTitle:false,
  });

  // ── "Profitable ✓ M12" marker (between the two bottom charts) ────────────
  s.addShape(pres.shapes.RECTANGLE, { x:4.12, y:3.13, w:0.35, h:1.91,
    fill:{ color:"E8F5EE" }, line:{ color:"C5E0CE", width:0.5 } });
  s.addText("M12 ✓", {
    x:4.1, y:3.75, w:0.39, h:0.6,
    fontSize:6.5, fontFace:"Calibri",
    color:C.green, bold:true, align:"center",
    rotate:270, margin:0,
  });

  // ── Right: KPI cards ──────────────────────────────────────────────────────
  const kpis = [
    { label:"ARR AT M12",     value:"$641K",   sub:"End of Year 1 · 80 companies",           accent: C.gold },
    { label:"ARR AT M18",     value:"$1.48M",  sub:"Run-rate · 185 companies",               accent: C.gold },
    { label:"GROSS MARGIN",   value:"24.3%",   sub:"Stable from M12 · up from 17.9%",        accent: C.gold },
    { label:"OP PROFIT M18",  value:"+$12.9K", sub:"Per month · growing MoM",                accent: C.green },
    { label:"BREAK-EVEN",     value:"Month 14",sub:"Sustained profit after M13 OpEx step-up",accent: C.green },
  ];

  kpis.forEach((k, i) => {
    const kx = 6.68;
    const ky = 1.08 + i * 0.88;

    s.addShape(pres.shapes.RECTANGLE, { x:kx, y:ky, w:3.0, h:0.76,
      fill:{ color: C.white }, line:{ color:"E2E8F0", width:1 } });
    s.addShape(pres.shapes.RECTANGLE, { x:kx, y:ky, w:0.05, h:0.76,
      fill:{ color: k.accent }, line:{ color: k.accent } });

    s.addText(k.value, {
      x:kx+0.18, y:ky+0.04, w:1.55, h:0.42,
      fontSize: k.value.length > 6 ? 15 : 20,
      fontFace:"Palatino",
      color:C.navy, bold:true, margin:0,
    });
    s.addText(k.label, {
      x:kx+1.78, y:ky+0.05, w:1.1, h:0.28,
      fontSize:6.5, fontFace:"Calibri",
      color: k.accent === C.green ? C.green : C.gold,
      bold:true, charSpacing:0.5, align:"left", margin:0,
    });
    s.addText(k.sub, {
      x:kx+0.18, y:ky+0.46, w:2.72, h:0.26,
      fontSize:7.5, fontFace:"Calibri",
      color:C.muted, align:"left", margin:0,
    });
  });

  s.addText(
    "Source: LegalFoundry_Pricing_Model.xlsx — Monthly Finances tab. " +
    "Blended ARPU $534/mo. Growth: 15% MoM (M1–6), 30% MoM (M7–18), 15% MoM (M19+). " +
    "OpEx step-up at M7 (team) and M13 (scale) drives temporary dip; sustained profit from M14.",
    {
      x:0.42, y:5.3, w:9.1, h:0.27,
      fontSize:6.5, fontFace:"Calibri",
      color:C.muted, align:"left", margin:0,
    }
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WRITE FILE
// ─────────────────────────────────────────────────────────────────────────────
const outputPath =
  "/Users/swethasrinivasan/Library/CloudStorage/OneDrive-Personal/" +
  "AI Projects/AI in Law Bootcamp/AI Incorporator/Legal-AI-Hackathon/" +
  "Legal_Foundry_Pitch_Deck.pptx";

pres.writeFile({ fileName: outputPath })
  .then(() => console.log("✅  Deck saved:", outputPath))
  .catch(err => { console.error("❌  Error:", err); process.exit(1); });
