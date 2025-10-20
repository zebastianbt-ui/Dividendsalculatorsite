<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta http-equiv="Content-Style-Type" content="text/css">
  <title></title>
  <meta name="Description" content="Dividend calculator in English (with DRIP). Estimate income, yield on cost, and 10-year projections, with or without dividend reinvestment.">
  <meta name="Generator" content="Cocoa HTML Writer">
  <meta name="CocoaVersion" content="2575.7">
  <style type="text/css">
    body {background-color: #f7f2f9}
    p.p1 {margin: 0.0px 0.0px 0.0px 0.0px; font: 13.0px Courier; -webkit-text-stroke: #000000}
    p.p2 {margin: 0.0px 0.0px 0.0px 0.0px; font: 13.0px Courier; -webkit-text-stroke: #000000; min-height: 16.0px}
    span.s1 {font-kerning: none}
    span.s2 {font: 13.0px 'Apple Color Emoji'; font-kerning: none}
  </style>
</head>
<body>
<p class="p1"><span class="s1">/* =========================</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">   </span>assets/script.js</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">   </span>Logique commune, UI multilingue (FR/EN/SV) sans dépendances.</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">   </span>========================= */</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">const $ = (id) =&gt; document.getElementById(id);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Détection de langue &amp; i18n --- */</span></p>
<p class="p1"><span class="s1">const LANG = (document.documentElement.lang || 'fr').toLowerCase();</span></p>
<p class="p1"><span class="s1">const LOCALE = LANG === 'en' ? 'en-US' : LANG === 'sv' ? 'sv-SE' : 'fr-FR';</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">const T = {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>fr: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yocRef_defined: (v) =&gt; `Calcul basé sur PRU = ${v}`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yocRef_undefined: 'PRU non défini.',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>summary: (amt, pct) =&gt; `Après 10 ans, vos dividendes cumulés atteignent ${amt} €, soit une croissance totale de ${pct}.`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>diffSummary: (amt, pct) =&gt; `Différence : ${amt} € (${pct}) grâce au réinvestissement des dividendes.`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yearPrefix: 'Année ',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>chartDividends: 'Total dividendes',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>chartValue: 'Valeur du portefeuille',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>copied: 'Lien copié </span><span class="s2">✅</span><span class="s1">',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>copyLink: 'Copier le lien',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>emailSubject: 'Mon calcul de dividendes',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>emailBodyLead: 'Voici mon lien:',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>igAlert: 'Lien copié. Ouvre Instagram et colle-le dans ta bio ou un message.',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>tweetText: 'Mon calcul de dividendes',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>csvHeaders: ['Année','Dividendes','Rendement (%)','Nombre d’actions','Valeur du portefeuille'],</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>csvFilename: 'dividendes_projections.csv',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>},</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>en: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yocRef_defined: (v) =&gt; `Based on cost basis = ${v}`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yocRef_undefined: 'No cost basis set.',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>summary: (amt, pct) =&gt; `After 10 years, your cumulative dividends reach ${amt} €, a total growth of ${pct}.`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>diffSummary: (amt, pct) =&gt; `Difference: ${amt} € (${pct}) thanks to dividend reinvestment.`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yearPrefix: 'Year ',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>chartDividends: 'Total dividends',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>chartValue: 'Portfolio value',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>copied: 'Link copied </span><span class="s2">✅</span><span class="s1">',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>copyLink: 'Copy link',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>emailSubject: 'My dividend calculation',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>emailBodyLead: 'Here is my link:',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>igAlert: 'Link copied. Open Instagram and paste it in your bio or a DM.',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>tweetText: 'My dividend calculation',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>csvHeaders: ['Year','Dividends','Yield (%)','Number of shares','Portfolio value'],</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>csvFilename: 'dividends_projections.csv',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>},</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>sv: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yocRef_defined: (v) =&gt; `Baserat på GAV = ${v}`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yocRef_undefined: 'GAV ej angivet.',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>summary: (amt, pct) =&gt; `Efter 10 år uppgår dina ackumulerade utdelningar till ${amt} €, vilket motsvarar en total tillväxt på ${pct}.`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>diffSummary: (amt, pct) =&gt; `Skillnad: ${amt} € (${pct}) tack vare återinvestering av utdelningar.`,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>yearPrefix: 'År ',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>chartDividends: 'Totala utdelningar',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>chartValue: 'Portföljvärde',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>copied: 'Länk kopierad </span><span class="s2">✅</span><span class="s1">',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>copyLink: 'Kopiera länk',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>emailSubject: 'Min utdelningsberäkning',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>emailBodyLead: 'Här är min länk:',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>igAlert: 'Länken är kopierad. Öppna Instagram och klistra in den i din bio eller i ett DM.',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>tweetText: 'Min utdelningsberäkning',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>csvHeaders: ['År','Utdelningar','Avkastning (%)','Antal aktier','Portföljvärde'],</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>csvFilename: 'utdelningar_prognoser.csv',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p1"><span class="s1">}[LANG];</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Format --- */</span></p>
<p class="p1"><span class="s1">const fmtNum = (x) =&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>isNaN(x) ? '—' : new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 2 }).format(x);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">const fmtPct = (x) =&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>(isNaN(x) || !isFinite(x)) ? '—' : x.toFixed(2) + ' %';</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* Accepter virgules et points */</span></p>
<p class="p1"><span class="s1">const parseNum = (v) =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (v === null || v === undefined) return NaN;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const s = String(v).trim().replace(',', '.');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>return parseFloat(s);</span></p>
<p class="p1"><span class="s1">};</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Utilitaires calcul --- */</span></p>
<p class="p1"><span class="s1">function resolvePRU(pru) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (!isNaN(pru) &amp;&amp; pru &gt; 0) return pru;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>return NaN;</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p1"><span class="s1">function resolveDPS(mode, val, refPrice) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (mode === 'amount') return val;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (mode === 'percent') return (refPrice &gt; 0) ? (val / 100) * refPrice : NaN;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>return NaN;</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Calculs instantanés --- */</span></p>
<p class="p1"><span class="s1">function compute() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const s = parseNum($('shares').value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const pruInput = parseNum($('pru').value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const cur = parseNum($('currentPrice').value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const dMode = $('dMode').value;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const dVal = parseNum($('dVal').value);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const pru = resolvePRU(pruInput);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const refForPercent = (!isNaN(cur) &amp;&amp; cur &gt; 0) ? cur : pru;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const dps = resolveDPS(dMode, dVal, refForPercent);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('yocRef').textContent = isNaN(pru)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>? T.yocRef_undefined</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>: T.yocRef_defined(fmtNum(pru));</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let cost = NaN, annual = NaN, yoc = NaN;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (s &gt; 0 &amp;&amp; !isNaN(pru)) cost = s * pru;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (s &gt; 0 &amp;&amp; !isNaN(dps)) annual = s * dps;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (!isNaN(pru) &amp;&amp; !isNaN(dps)) yoc = (dps / pru) * 100;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('yieldOnCost').textContent = fmtPct(yoc);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('cost').textContent = fmtNum(cost);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('annual').textContent = fmtNum(annual);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('monthly').textContent = fmtNum(annual / 12);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('quarterly').textContent = fmtNum(annual / 4);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (!isNaN(cur) &amp;&amp; cur &gt; 0) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const mkt = s * cur;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const plAmt = (!isNaN(cost) ? mkt - cost : NaN);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const plPct = (!isNaN(pru) ? ((cur - pru) / pru) * 100 : NaN);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const curYield = (!isNaN(dps) ? (dps / cur) * 100 : NaN);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>$('currentBlock').style.display = '';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>$('currentYield').textContent = fmtPct(curYield);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>$('plAmount').textContent = fmtNum(plAmt);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>$('plPct').textContent = fmtPct(plPct);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>$('mktValue').textContent = fmtNum(mkt);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>} else {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>$('currentBlock').style.display = 'none';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>computeProjections(false);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>saveToHash();</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* ===== Projections (version avec apports périodiques + DRIP) ===== */</span></p>
<p class="p1"><span class="s1">let projChart;</span></p>
<p class="p1"><span class="s1">let lastRows = []; // export CSV (structure normalisée)</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">function computeProjections(useDRIP = false) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let shares = parseNum($('shares').value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const initShares = isNaN(shares) ? 0 : shares;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const dMode = $('dMode').value;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const dVal = parseNum($('dVal').value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const cur = parseNum($('currentPrice').value);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const pru = resolvePRU(parseNum($('pru').value));</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const refForPercent = (!isNaN(cur) &amp;&amp; cur &gt; 0) ? cur : pru;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const dps0 = resolveDPS(dMode, dVal, refForPercent);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const initDps = isNaN(dps0) ? 0 : dps0;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const price0Raw = (!isNaN(cur) &amp;&amp; cur &gt; 0) ? cur : pru;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let price = isNaN(price0Raw) ? 0 : price0Raw;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const gDiv = parseNum($('divGrowth').value || 0) / 100; <span class="Apple-converted-space">  </span>// croissance annuelle du DPS</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const gPrc = parseNum($('priceGrowth').value || 0) / 100; // croissance annuelle du prix</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// &gt;&gt;&gt; NOUVEAU : lecture des apports</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const extra = Math.max(0, parseNum($('extraInvestment').value) || 0);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const freq = $('extraInvestFreq').value || 'monthly';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const steps = (freq === 'monthly') ? 12</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">             </span>: (freq === 'quarterly') ? 4</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">             </span>: (freq === 'yearly') ? 1</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">             </span>: (freq === 'once') ? 1</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">             </span>: 0;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// croissance par sous-période (si 0, reste 0)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const rg = (gPrc &gt; 0 &amp;&amp; steps &gt; 0) ? Math.pow(1 + gPrc, 1 / steps) - 1 : 0;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const Y = 10;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const labels = [];</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const divSeries = [];</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const valSeries = [];</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const tbody = $('resultBody');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>tbody.innerHTML = '';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>lastRows = [];</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let dps = initDps;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let totalDiv = 0;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>for (let y = 1; y &lt;= Y; y++) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// 1) Dividendes de l'année basés sur les actions détenues au début de l'année</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const sharesStart = isNaN(shares) ? 0 : shares;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const dividends = sharesStart * dps;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// 2) Apports périodiques de l'année (achat progressif)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let priceInYear = price; // prix au début de l'année</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (extra &gt; 0 &amp;&amp; steps &gt; 0 &amp;&amp; !(freq === 'once' &amp;&amp; y &gt; 1)) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>for (let k = 0; k &lt; steps; k++) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>if (priceInYear &gt; 0) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>shares += (extra / priceInYear);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>if (rg !== 0) priceInYear *= (1 + rg);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>price = priceInYear; // fin d'année après steps sous-périodes</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>} else {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>price *= (1 + gPrc);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// 3) Valeur en fin d'année (après apports, avant DRIP sur dividendes)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const valueEnd = (isNaN(shares) ? 0 : shares) * price;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const yieldPct = (price &gt; 0 &amp;&amp; dps &gt; 0) ? (dps / price) * 100 : NaN;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// 4) DRIP en fin d'année</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (useDRIP &amp;&amp; price &gt; 0) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>shares += (dividends / price);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// 5) Agrégats &amp; cumul</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>labels.push(T.yearPrefix + y);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>divSeries.push(dividends);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>valSeries.push(valueEnd);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>totalDiv += dividends;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// Stockage pour CSV (structure normalisée)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>lastRows.push({</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>year: y,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>dividends,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>yield_pct: yieldPct,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>shares,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>value: valueEnd</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const tr = document.createElement('tr');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>tr.innerHTML = `</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>&lt;td style="text-align:left"&gt;${y}&lt;/td&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>&lt;td&gt;${fmtNum(dividends)}&lt;/td&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>&lt;td&gt;${fmtPct(yieldPct)}&lt;/td&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>&lt;td&gt;${fmtNum(shares)}&lt;/td&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>&lt;td&gt;${fmtNum(valueEnd)}&lt;/td&gt;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>`;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>tbody.appendChild(tr);</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// 6) croissance du DPS pour l'année suivante</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>dps *= (1 + gDiv);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// Résumé synthétique</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const baseline = initShares * initDps * Y;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const growthPct = (baseline &gt; 0) ? ((totalDiv - baseline) / baseline) * 100 : NaN;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('summary').textContent = T.summary(fmtNum(totalDiv), fmtPct(growthPct));</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// Différence DRIP vs sans DRIP (recalcul avec mêmes apports, sans DRIP)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let sharesNo = initShares;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let dpsNo = initDps;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let priceNo = isNaN(price0Raw) ? 0 : price0Raw;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>let totalDivNo = 0;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>for (let y = 1; y &lt;= Y; y++) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const divNo = (isNaN(sharesNo) ? 0 : sharesNo) * dpsNo;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>totalDivNo += divNo;</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>// apports sans DRIP</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>let pIn = priceNo;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (extra &gt; 0 &amp;&amp; steps &gt; 0 &amp;&amp; !(freq === 'once' &amp;&amp; y &gt; 1)) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const rgNo = (gPrc &gt; 0 &amp;&amp; steps &gt; 0) ? Math.pow(1 + gPrc, 1 / steps) - 1 : 0;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>for (let k = 0; k &lt; steps; k++) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>if (pIn &gt; 0) sharesNo += (extra / pIn);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>if (rgNo !== 0) pIn *= (1 + rgNo);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>priceNo = pIn;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>} else {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>priceNo *= (1 + gPrc);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>dpsNo *= (1 + gDiv);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const diffEl = $('diffSummary');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (useDRIP) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const diffAmt = totalDiv - totalDivNo;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const diffPct = (totalDivNo &gt; 0) ? (diffAmt / totalDivNo) * 100 : NaN;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const amtStr = `${diffAmt &gt;= 0 ? '+' : ''}${fmtNum(diffAmt)}`;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>diffEl.textContent = T.diffSummary(amtStr, fmtPct(diffPct));</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>} else {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>diffEl.textContent = '';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>// Graphique</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const ctx = document.getElementById('projChart').getContext('2d');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (projChart) projChart.destroy();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>projChart = new Chart(ctx, {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>type: 'bar',</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>data: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>labels,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>datasets: [</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>{</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>label: T.chartDividends,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>data: divSeries,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--violet').trim(),</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>borderWidth: 0,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>barPercentage: 0.45,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>categoryPercentage: 0.7</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>},</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>{</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>label: T.chartValue,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>data: valSeries,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--rose').trim(),</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>borderWidth: 0,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>barPercentage: 0.45,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>categoryPercentage: 0.7</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>]</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>},</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>options: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>responsive: true,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>interaction: { mode: 'index', intersect: false },</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>scales: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>y: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>beginAtZero: true,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>ticks: {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">            </span>callback: (v) =&gt; new Intl.NumberFormat(LOCALE, { maximumFractionDigits: 0 }).format(v)</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">          </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">        </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>},</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>plugins: { legend: { position: 'bottom' } }</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Thème (jour/nuit) --- */</span></p>
<p class="p1"><span class="s1">const root = document.documentElement;</span></p>
<p class="p1"><span class="s1">const savedTheme = localStorage.getItem('theme');</span></p>
<p class="p1"><span class="s1">if (savedTheme) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>root.setAttribute('data-theme', savedTheme);</span></p>
<p class="p1"><span class="s1">} else {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>root.setAttribute('data-theme', 'light'); // affichage initial jour</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p1"><span class="s1">const themeBtn = $('themeToggle');</span></p>
<p class="p1"><span class="s1">if (themeBtn) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>themeBtn.onclick = () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const isDark = root.getAttribute('data-theme') === 'dark';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const next = isDark ? 'light' : 'dark';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>root.setAttribute('data-theme', next);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>localStorage.setItem('theme', next);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>};</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Partage + Export CSV --- */</span></p>
<p class="p1"><span class="s1">function saveToHash() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>const params = new URLSearchParams({</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>shares: $('shares').value, pru: $('pru').value,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>current: $('currentPrice').value, dMode: $('dMode').value, dVal: $('dVal').value,</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>gDiv: $('divGrowth').value, gPrc: $('priceGrowth').value</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>history.replaceState(null, '', '#' + params.toString());</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p1"><span class="s1">function loadFromHash() {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if (location.hash.length &gt; 1) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const p = new URLSearchParams(location.hash.slice(1));</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (p.get('shares')) $('shares').value = p.get('shares');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (p.get('pru')) $('pru').value = p.get('pru');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (p.get('current')) $('currentPrice').value = p.get('current');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (p.get('dMode')) $('dMode').value = p.get('dMode');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (p.get('dVal')) $('dVal').value = p.get('dVal');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (p.get('gDiv')) $('divGrowth').value = p.get('gDiv');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (p.get('gPrc')) $('priceGrowth').value = p.get('gPrc');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>}</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* Menu partager */</span></p>
<p class="p1"><span class="s1">const shareBtn = $('shareBtn');</span></p>
<p class="p1"><span class="s1">const shareMenu = $('shareMenu');</span></p>
<p class="p1"><span class="s1">if (shareBtn &amp;&amp; shareMenu) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>shareBtn.addEventListener('click', () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>saveToHash();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>shareMenu.style.display = (shareMenu.style.display === 'block' ? 'none' : 'block');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>document.addEventListener('click', (e) =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>if (!shareMenu.contains(e.target) &amp;&amp; e.target !== shareBtn) {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>shareMenu.style.display = 'none';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>}</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('copyLink')?.addEventListener('click', () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>saveToHash();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>navigator.clipboard.writeText(location.href).then(() =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>const btn = $('copyLink');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>btn.textContent = T.copied;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>setTimeout(() =&gt; { btn.textContent = T.copyLink; }, 1200);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>});</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('shareEmail')?.addEventListener('click', (e) =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>e.preventDefault(); saveToHash();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const subject = encodeURIComponent(T.emailSubject);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const body = encodeURIComponent(`${T.emailBodyLead}\n${location.href}`);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>location.href = `mailto:?subject=${subject}&amp;body=${body}`;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('shareFB')?.addEventListener('click', (e) =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>e.preventDefault(); saveToHash();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const u = encodeURIComponent(location.href);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>window.open(`https://www.facebook.com/sharer/sharer.php?u=${u}`, '_blank', 'noopener');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('shareIG')?.addEventListener('click', () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>saveToHash();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>navigator.clipboard.writeText(location.href).then(() =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>alert(T.igAlert);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>});</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('shareX')?.addEventListener('click', (e) =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>e.preventDefault(); saveToHash();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const text = encodeURIComponent(T.tweetText);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const url = encodeURIComponent(location.href);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>window.open(`https://twitter.com/intent/tweet?text=${text}&amp;url=${url}`, '_blank', 'noopener');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>/* Export CSV du tableau (utilise lastRows) */</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>$('exportCSV')?.addEventListener('click', () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const header = T.csvHeaders;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const csv = [</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>header.join(';'),</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">      </span>...lastRows.map(r =&gt; [r.year, r.dividends, r.yield_pct, r.shares, r.value].join(';'))</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>].join('\n');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const url = URL.createObjectURL(blob);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>const a = document.createElement('a');</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>a.href = url;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>a.download = T.csvFilename;</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.body.appendChild(a);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>a.click();</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>document.body.removeChild(a);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>URL.revokeObjectURL(url);</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>});</span></p>
<p class="p1"><span class="s1">}</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Réinitialiser --- */</span></p>
<p class="p1"><span class="s1">$('clear')?.addEventListener('click', () =&gt; {</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>['shares', 'pru', 'currentPrice', 'dVal', 'divGrowth', 'priceGrowth', 'extraInvestment']</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">    </span>.forEach(id =&gt; { if ($(id)) $(id).value = ''; });</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if ($('extraInvestFreq')) $('extraInvestFreq').value = 'monthly';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>if ($('dMode')) $('dMode').value = 'amount';</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>compute();</span></p>
<p class="p1"><span class="s1">});</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Events --- */</span></p>
<p class="p1"><span class="s1">$('calc')?.addEventListener('click', compute);</span></p>
<p class="p1"><span class="s1">$('calcProj')?.addEventListener('click', () =&gt; computeProjections(false)); <span class="Apple-converted-space">  </span>// SANS / WITHOUT / UTAN DRIP</span></p>
<p class="p1"><span class="s1">$('calcProjDrip')?.addEventListener('click', () =&gt; computeProjections(true)); // AVEC / WITH / MED DRIP</span></p>
<p class="p1"><span class="s1">['shares','pru','currentPrice','dVal','dMode','divGrowth','priceGrowth','extraInvestment','extraInvestFreq']</span></p>
<p class="p1"><span class="s1"><span class="Apple-converted-space">  </span>.forEach(id =&gt; $(id)?.addEventListener('change', () =&gt; {}));</span></p>
<p class="p2"><span class="s1"></span><br></p>
<p class="p1"><span class="s1">/* --- Initialisation --- */</span></p>
<p class="p1"><span class="s1">loadFromHash();</span></p>
<p class="p1"><span class="s1">compute();</span></p>
</body>
</html>
