/* =========================================================================
   Between Brussels and Moscow / main.js
   Renders the data-driven parts of the page from data.js and runs the
   scroll behaviour. No build step. Depends on D3 v7 and topojson-client
   (both in /vendor) for the three maps only.
   ========================================================================= */
(function () {
  "use strict";

  var D = window.SITE_DATA || {};
  /* Optional translations: a page can set D.ui = { "English text": "translation" }. {0}, {1} are filled in. */
  function T(s) { var a = arguments, t = (D.ui && D.ui[s]) || s; return t.replace(/\{(\d)\}/g, function (m, i) { return a[+i + 1]; }); }
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isDesktop = function () { return window.matchMedia("(min-width: 980px)").matches; };

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ------------------------------------------------------------------ theme */
  (function theme() {
    var btn = $("#themeToggle"), label = $("#themeLabel");
    if (!btn) return;
    function current() {
      return root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    function paint() {
      var dark = current() === "dark";
      label.textContent = dark ? "Light" : "Dark";
      btn.setAttribute("aria-pressed", String(dark));
    }
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      paint();
    });
    paint();
  })();

  /* ------------------------------------------------------------------ menu */
  (function menu() {
    var m = $("#menu");
    if (!m) return;
    m.addEventListener("click", function (e) { if (e.target.closest("a")) m.removeAttribute("open"); });
    document.addEventListener("click", function (e) { if (m.open && !m.contains(e.target)) m.removeAttribute("open"); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.open) { m.removeAttribute("open"); $("summary", m).focus(); } });
  })();

  /* ------------------------------------------------------------------ pole helpers */
  function setPole(node, disc, formal) {
    if (!node) return;
    node.style.setProperty("--p", disc);
    if (formal == null) node.classList.add("is-noformal");
    else { node.classList.remove("is-noformal"); node.style.setProperty("--f", formal); }
  }
  function poleMarkup(cls) {
    var p = el("div", "pole " + (cls || "pole--fig"));
    p.innerHTML =
      '<span class="pole__end pole__end--w">Brussels</span>' +
      '<span class="pole__track">' +
      '<span class="pole__formal"><i></i><b>' + T("official line") + '</b></span>' +
      '<span class="pole__mark"><i></i><b>' + T("actual course") + '</b></span>' +
      "</span>" +
      '<span class="pole__end pole__end--e">Moscow</span>';
    return p;
  }
  function poleLabel(disc, formal) {
    var pct = Math.round(disc * 100);
    var s = T("Illustrative needle. Actual course sits about {0} percent of the way from Brussels to Moscow.", pct);
    s += " " + (formal == null ? T("The official pro-EU line has been dropped.") : T("The official line stays close to Brussels."));
    return s;
  }

  var barPole = $("#barPole");
  var cpNeedle = null; // set by the checkpoint scroller while that chapter is active
  var activeSection = "hero";
  function paintBarNeedle() {
    var v = (D.needleBySection || {})[activeSection];
    if (activeSection === "checkpoints" && cpNeedle != null) v = cpNeedle;
    if (v != null && barPole) barPole.style.setProperty("--p", v);
  }

  /* ------------------------------------------------------------------ progress, sections, dots */
  (function nav() {
    var bar = $("#progress");
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.transform = "scaleX(" + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ")";
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var dots = $$(".dots a");
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        activeSection = en.target.getAttribute("data-section");
        dots.forEach(function (d) {
          var on = d.getAttribute("data-dot") === activeSection;
          d.classList.toggle("is-active", on);
          if (on) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        });
        paintBarNeedle();
      });
    }, { rootMargin: "-45% 0px -54% 0px" });
    $$("[data-section]").forEach(function (s) { io.observe(s); });
  })();

  /* ------------------------------------------------------------------ reveal (line drawing only) */
  $$(".draw").forEach(function (p) { p.setAttribute("pathLength", "1"); });
  var revealIO = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-in");
            en.target.dispatchEvent(new CustomEvent("reveal"));
            revealIO.unobserve(en.target);
          }
        });
      }, { rootMargin: "0px 0px -18% 0px" })
    : null;
  function reveal(node) {
    if (!node) return;
    if (revealIO) revealIO.observe(node);
    else { node.classList.add("is-in"); node.dispatchEvent(new CustomEvent("reveal")); }
  }
  $$(".fig, .finding__fig, #figMap").forEach(reveal);

  /* ------------------------------------------------------------------ hero */
  (function hero() {
    var p = $("#heroPole");
    if (!p) return;
    requestAnimationFrame(function () { p.classList.add("is-in"); });
    if (reduce) return;
    // the needle searches, then settles between the poles
    [[2300, 0.43], [3900, 0.58], [5500, 0.5]].forEach(function (s) {
      setTimeout(function () { p.style.setProperty("--p", s[1]); }, s[0]);
    });
  })();

  /* ------------------------------------------------------------------ 01 timeline */
  (function timeline() {
    var host = $("#timeline"), pole = $("#tlPole"), fig = $("#figTimeline");
    if (!host || !D.timeline) return;
    var items = D.timeline, btns = [], timer = null, userTook = false;

    function activate(i) {
      btns.forEach(function (b, j) {
        b.classList.toggle("is-active", j === i);
        b.setAttribute("aria-pressed", String(j === i));
      });
      setPole(pole, items[i].disc, items[i].formal);
    }
    function stopAuto() { userTook = true; clearInterval(timer); }

    items.forEach(function (ev, i) {
      var b = el("button", "tl__ev");
      b.type = "button";
      b.appendChild(el("span", "tl__year", ev.year));
      b.appendChild(el("span", "tl__title", ev.title));
      b.appendChild(el("span", "tl__text", ev.text));
      b.addEventListener("click", function () { stopAuto(); activate(i); });
      b.addEventListener("focus", function () { stopAuto(); activate(i); });
      b.addEventListener("mouseenter", function () { if (isDesktop()) { stopAuto(); activate(i); } });
      host.appendChild(b);
      btns.push(b);
    });
    activate(0);

    // small screens: the event nearest the middle of the screen drives the needle
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        if (isDesktop()) return;
        entries.forEach(function (en) { if (en.isIntersecting) { stopAuto(); activate(btns.indexOf(en.target)); } });
      }, { rootMargin: "-40% 0px -50% 0px" });
      btns.forEach(function (b) { io.observe(b); });
    }

    // large screens: play through once when the figure first comes into view
    fig.addEventListener("reveal", function () {
      if (reduce || !isDesktop()) { if (reduce) activate(items.length - 1); return; }
      var i = 0;
      timer = setInterval(function () {
        if (userTook) return;
        i += 1;
        if (i >= items.length) { clearInterval(timer); return; }
        activate(i);
      }, 1400);
    });
  })();

  /* ------------------------------------------------------------------ 02 bank run */
  (function bank() {
    var stage = $("#bankStage"), status = $("#bankStatus"), count = $("#bankCount");
    if (!stage) return;
    var N = 30, SPARK = 5, LOYAL = [2, 7, 11, 15, 19, 23, 26, 29];
    var timers = [], people = [];
    var NS = "http://www.w3.org/2000/svg";
    function svgEl(tag, attrs) { var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); return n; }

    function draw() {
      var W = stage.clientWidth || 700;
      var cols = W >= 700 ? 30 : W >= 430 ? 15 : 10;
      var rows = Math.ceil(N / cols);
      var cell = W / cols, s = Math.min(cell * 0.6, 20), rowH = s * 3.3;
      var H = rows * rowH + 14;
      stage.innerHTML = "";
      var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, "aria-hidden": "true" });
      people = [];
      for (var i = 0; i < N; i++) {
        var cx = (i % cols) * cell + cell / 2, cy = Math.floor(i / cols) * rowH + s * 1.7 + 12;
        var outer = svgEl("g", { transform: "translate(" + cx + "," + cy + ")" });
        var g = svgEl("g", { "class": "pp" });
        g.appendChild(svgEl("circle", { "class": "pp__ring", cx: 0, cy: 0, r: s }));
        g.appendChild(svgEl("circle", { "class": "pp__body", cx: 0, cy: -s * 0.62, r: s * 0.3 }));
        g.appendChild(svgEl("rect", { "class": "pp__body", x: -s * 0.4, y: -s * 0.22, width: s * 0.8, height: s * 0.95, rx: s * 0.28 }));
        outer.appendChild(g);
        if (LOYAL.indexOf(i) < 0) outer.appendChild(svgEl("circle", { "class": "pp__priv", cx: 0, cy: s * 1.12, r: Math.max(1.8, s * 0.11) }));
        svg.appendChild(outer);
        people.push(g);
      }
      stage.appendChild(svg);
    }

    function setCount(out, gone) {
      var total = N - (gone ? 1 : 0);
      count.textContent = T("Backing the regime in public: {0} of {1}", total - out, total);
    }
    function reset() {
      timers.forEach(clearTimeout); timers = [];
      people.forEach(function (g) { g.setAttribute("class", "pp"); });
      status.textContent = T("Everyone backs the regime in public. Most do not mean it.");
      setCount(0, false);
    }
    function order() {
      var idx = [];
      for (var i = 0; i < N; i++) if (LOYAL.indexOf(i) < 0 && i !== SPARK) idx.push(i);
      idx.sort(function (a, b) { return Math.abs(a - SPARK) - Math.abs(b - SPARK) || a - b; });
      return idx;
    }
    function cascade() {
      reset();
      var seq = order(), out = 0;
      status.textContent = T("One person says it out loud.");
      people[SPARK].classList.add("is-spark", "is-out"); out = 1; setCount(out, false);
      if (reduce) {
        seq.forEach(function (i) { people[i].classList.add("is-out"); });
        setCount(seq.length + 1, false); done(); return;
      }
      var t = 1100, gap = 760;
      seq.forEach(function (i, k) {
        timers.push(setTimeout(function () {
          people[i].classList.add("is-out"); out += 1; setCount(out, false);
          if (k === 2) status.textContent = T("Each act of defiance makes the next one easier.");
          if (k === seq.length - 1) done();
        }, t));
        gap = Math.max(70, gap * 0.8); t += gap;
      });
      function done() {
        status.textContent = T("The appearance of support is gone. {0} loyalists remain out of {1}.", LOYAL.length, N);
      }
    }
    function learn() {
      reset();
      people[SPARK].classList.add("is-gone");
      setCount(0, true);
      status.textContent = T("The first person is removed before anyone sees. Nothing spreads, and {0} people go on hiding what they think.", N - 1 - LOYAL.length);
    }

    $("#bankPlay").addEventListener("click", cascade);
    $("#bankLearn").addEventListener("click", learn);
    $("#bankReset").addEventListener("click", reset);
    draw(); reset();
    var lastW = stage.clientWidth;
    window.addEventListener("resize", debounce(function () {
      if (stage.clientWidth !== lastW) { lastW = stage.clientWidth; draw(); reset(); }
    }, 200));
  })();

  /* ------------------------------------------------------------------ 03 counters + lenses */
  (function counters() {
    var fig = $("#figTri");
    if (!fig || reduce) return;
    fig.addEventListener("reveal", function () {
      $$("[data-count]", fig).forEach(function (n) {
        var to = +n.getAttribute("data-count"), t0 = null, dur = 1400;
        function step(t) {
          if (t0 == null) t0 = t;
          var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
          n.textContent = Math.round(to * e);
          if (k < 1) requestAnimationFrame(step);
        }
        n.textContent = "0";
        requestAnimationFrame(step);
      });
    });
  })();

  (function lenses() {
    var host = $("#lenses");
    if (!host || !D.lenses) return;
    D.lenses.forEach(function (l) {
      var li = el("li", "lens");
      li.appendChild(el("h3", null, l.name));
      li.appendChild(el("p", "lens__q", l.q));
      li.appendChild(el("p", "lens__ex", l.ex));
      host.appendChild(li);
    });
  })();

  /* ------------------------------------------------------------------ maps (D3) */
  var hasD3 = !!(window.d3 && window.topojson && window.GEO_EUROPE);
  var EU = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden"];
  var KEY = { Russia: "russia", Belarus: "belarus", Hungary: "hungary", Georgia: "georgia" };
  var CITY = { Brussels: [4.35, 50.85], Moscow: [37.62, 55.75], Tbilisi: [44.79, 41.72], Minsk: [27.56, 53.9], Budapest: [19.04, 47.5] };
  var europe = null, uid = 0;
  function europeFeatures() {
    if (!europe) europe = topojson.feature(window.GEO_EUROPE, window.GEO_EUROPE.objects.countries).features;
    return europe;
  }
  function boxGeo(b) {
    var x0 = b[0][0], y0 = b[0][1], x1 = b[1][0], y1 = b[1][1], xm = (x0 + x1) / 2, ym = (y0 + y1) / 2;
    return { type: "MultiPoint", coordinates: [[x0, y0], [x1, y0], [x0, y1], [x1, y1], [xm, y0], [xm, y1], [x0, ym], [x1, ym]] };
  }

  /* Draws a map of Europe into `node`. Returns { focus(id, box, animate) }.
     opt: { box, ratio, plain, mini, onPick } */
  function drawEurope(node, opt) {
    var W = node.clientWidth || 600, H = Math.round(W * (opt.ratio || 0.8));
    var id = "hz" + (++uid);
    var svg = d3.select(node).html("").append("svg").attr("viewBox", "0 0 " + W + " " + H);
    if (opt.mini) svg.attr("aria-hidden", "true");
    var pat = svg.append("defs").append("pattern").attr("id", id).attr("width", 6).attr("height", 6)
      .attr("patternUnits", "userSpaceOnUse").attr("patternTransform", "rotate(45)");
    pat.append("rect").attr("class", "hatch-bg").attr("width", 6).attr("height", 6);
    pat.append("line").attr("class", "hatch-line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 6);

    var proj = d3.geoConicConformal().parallels([40, 58]).rotate([-25, 0]);
    proj.fitExtent([[0, 0], [W, H]], boxGeo(opt.base));
    var path = d3.geoPath(proj);
    var g = svg.append("g"), over = svg.append("g");
    var state = { k: 1, x: 0, y: 0 };

    var countries = g.selectAll("path").data(europeFeatures()).join("path")
      .attr("d", path)
      .attr("class", function (d) {
        var n = d.properties.name, c = "c";
        if (opt.plain) return n === "Georgia" ? c + " c--home" : c;
        if (n === "Russia") c += " c--ru c--key";
        else if (n === "Belarus") c += " c--by c--key";
        else if (n === "Hungary") c += " c--hu c--key";
        else if (n === "Georgia") c += " c--ge c--key";
        else if (EU.indexOf(n) >= 0) c += " c--eu";
        return c;
      })
      .attr("style", function (d) { return !opt.plain && d.properties.name === "Hungary" ? "fill:url(#" + id + ")" : null; });

    if (opt.onPick) {
      countries.filter(function (d) { return KEY[d.properties.name]; })
        .attr("tabindex", 0).attr("role", "button")
        .attr("aria-label", function (d) { return d.properties.name + ": show what the thesis found"; })
        .on("click", function (e, d) { opt.onPick(KEY[d.properties.name]); })
        .on("keydown", function (e, d) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); opt.onPick(KEY[d.properties.name]); } });
    }

    // arcs
    var arcs = g.append("g");
    if (!opt.plain && D.arcs) {
      arcs.selectAll("path").data(D.arcs).join("path")
        .attr("class", function (d) { return "arc arc--" + d.kind + (d.kind === "documented" ? " draw" : ""); })
        .attr("pathLength", function (d) { return d.kind === "documented" ? 1 : null; })
        .attr("d", function (d) { return arcPath(proj(CITY[d.from]), proj(CITY[d.to]), 0.2); })
        .append("title").text(function (d) { return d.from + " to " + d.to + ": " + d.note; });
    }

    // overlay: cities and labels keep their size while the map zooms
    var marks = [];
    function addLabel(text, lonlat, cls, dx, dy, anchor, only) {
      var t = over.append("text").attr("class", "mlabel " + (cls || "")).attr("text-anchor", anchor || "middle").text(T(text));
      marks.push({ n: t, p: proj(lonlat), dx: dx || 0, dy: dy || 0, only: only, text: true });
    }
    function addCity(lonlat, cls, shape, only) {
      var n = shape === "sq"
        ? over.append("rect").attr("class", "city " + cls).attr("width", 9).attr("height", 9).attr("x", -4.5).attr("y", -4.5)
        : over.append("circle").attr("class", "city " + cls).attr("r", shape === "sm" ? 3.2 : 4.6);
      marks.push({ n: n, p: proj(lonlat), dx: 0, dy: 0, only: only });
    }
    if (!opt.plain) {
      addLabel("Russia", [49, 59.2]);
      addLabel("Belarus", [28, 52.75]);
      addLabel("Hungary", [19.6, 46.4], "", 0, 14);
      addLabel("Georgia", [43.6, 41.2], "mlabel--ge", 0, 22);
      addCity(CITY.Minsk, "city--ref", "sm"); addCity(CITY.Budapest, "city--ref", "sm");
      addCity(CITY.Brussels, "city--eu", "sq"); addCity(CITY.Moscow, "city--ru"); addCity(CITY.Tbilisi, "city--ge", "sm");
      addLabel("Brussels", CITY.Brussels, "mlabel--city mlabel--eu", 0, -12);
      addLabel("Moscow", CITY.Moscow, "mlabel--city", 0, -12);
    }

    function place() {
      g.attr("transform", "translate(" + state.x + "," + state.y + ") scale(" + state.k + ")");
      marks.forEach(function (m) {
        var x = state.x + state.k * m.p[0] + m.dx, y = state.y + state.k * m.p[1] + m.dy;
        var off = x < 34 || x > W - 34 || y < 14 || y > H - 8;
        m.n.attr("display", off ? "none" : null);
        if (m.text) m.n.attr("x", x).attr("y", y); else m.n.attr("transform", "translate(" + x + "," + y + ")");
      });
    }
    function target(box) {
      var b = path.bounds(boxGeo(box));
      var k = Math.min(W / (b[1][0] - b[0][0]), H / (b[1][1] - b[0][1]));
      return { k: k, x: W / 2 - k * (b[0][0] + b[1][0]) / 2, y: H / 2 - k * (b[0][1] + b[1][1]) / 2 };
    }
    function focus(fid, box, animate) {
      node.classList.toggle("has-focus", fid !== "overview");
      countries.classed("is-active", function (d) { return KEY[d.properties.name] === fid; });
      arcs.selectAll("path").classed("is-dim", function (d) {
        if (fid === "overview") return false;
        var city = { russia: "Moscow", belarus: "Minsk", hungary: "Budapest", georgia: "Tbilisi" }[fid];
        return d.from !== city && d.to !== city;
      });
      var to = target(box);
      if (!animate || reduce) { state = to; place(); return; }
      var from = { k: state.k, x: state.x, y: state.y }, i = d3.interpolate(from, to);
      svg.interrupt().transition().duration(1100).ease(d3.easeCubicInOut).tween("zoom", function () {
        return function (t) { state = i(t); place(); };
      });
    }
    place();
    return { focus: focus, proj: proj, svg: svg, over: over, W: W, H: H, state: function () { return state; } };
  }
  function arcPath(a, b, bend) {
    var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1];
    var sign = dx >= 0 ? 1 : -1;
    var cx = mx + dy * bend * sign, cy = my - dx * bend * sign;
    return "M" + a[0] + "," + a[1] + "Q" + cx + "," + cy + " " + b[0] + "," + b[1];
  }

  /* ---- 04.1 reference regimes: steps + sticky map ---- */
  (function regimes() {
    var host = $("#mapSteps"), mapNode = $("#map");
    if (!host || !D.regimes) return;
    var base = D.regimes[0].focus, map = null, active = "overview", steps = [];

    D.regimes.forEach(function (r) {
      var step = el("div", "step");
      step.setAttribute("data-id", r.id);
      var card = el("article", "step__card");
      if (r.id !== "overview") { var mini = el("div", "step__mini map"); mini.setAttribute("data-mini", r.id); card.appendChild(mini); }
      card.appendChild(el("p", "step__tag", r.tag));
      card.appendChild(el("h3", null, r.name));
      var ul = el("ul", "plain");
      r.points.forEach(function (p) { ul.appendChild(el("li", null, p)); });
      card.appendChild(ul);
      step.appendChild(card);
      host.appendChild(step);
      steps.push(step);
    });
    steps[0].classList.add("is-active");

    function byId(id) { return D.regimes.filter(function (r) { return r.id === id; })[0]; }
    function setActive(id, animate) {
      active = id;
      steps.forEach(function (s) { s.classList.toggle("is-active", s.getAttribute("data-id") === id); });
      if (map && isDesktop()) map.focus(id, byId(id).focus, animate);
    }
    function pick(id) {
      var s = steps.filter(function (x) { return x.getAttribute("data-id") === id; })[0];
      if (s) s.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: isDesktop() ? "center" : "start" });
    }
    function render() {
      if (!hasD3) { mapNode.textContent = T("The map could not be loaded. The country notes below contain the same information."); return; }
      map = drawEurope(mapNode, { base: base, ratio: isDesktop() ? 0.86 : 0.8, onPick: pick });
      map.focus(isDesktop() ? active : "overview", isDesktop() ? byId(active).focus : base, false);
      $$("[data-mini]", host).forEach(function (n) {
        if (isDesktop()) { n.innerHTML = ""; return; }
        var r = byId(n.getAttribute("data-mini"));
        drawEurope(n, { base: base, ratio: 0.56, mini: true }).focus(r.id, r.focus, false);
      });
    }
    render();
    var lastW = window.innerWidth;
    window.addEventListener("resize", debounce(function () { if (window.innerWidth !== lastW) { lastW = window.innerWidth; render(); } }, 250));

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.getAttribute("data-id"), true); });
      }, { rootMargin: "-48% 0px -48% 0px" });
      steps.forEach(function (s) { io.observe(s); });
    }
  })();

  /* ---- narrative matrix ---- */
  (function matrix() {
    var host = $("#matrix"), note = $("#matrixNote"), textHost = $("#matrixText");
    if (!host || !D.matrix) return;
    var M = D.matrix, WORD = [T("not documented in the thesis"), T("foundations only"), T("documented")];
    var table = el("table", "mx"), thead = el("thead"), tr = el("tr");
    var corner = el("th"); corner.innerHTML = '<span class="sr">Narrative</span>'; tr.appendChild(corner);
    M.cols.forEach(function (c) {
      var th = el("th"); th.scope = "col";
      th.innerHTML = '<span class="mx__long"></span><abbr class="mx__short"></abbr>';
      th.firstChild.textContent = c.name; th.lastChild.textContent = c.short; th.lastChild.title = c.name;
      tr.appendChild(th);
    });
    thead.appendChild(tr); table.appendChild(thead);
    var tbody = el("tbody"), all = [];
    var ul = el("ul");
    M.rows.forEach(function (r) {
      var row = el("tr"), th = el("th", null, r.name); th.scope = "row"; row.appendChild(th);
      r.cells.forEach(function (cell, j) {
        var td = el("td"), b = el("button", "mx__cell"); b.type = "button";
        b.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-label", r.name + ", " + M.cols[j].name + ": " + WORD[cell[0]] + ". " + cell[1]);
        b.appendChild(el("span", "dot dot--" + cell[0]));
        b.addEventListener("click", function () {
          all.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
          b.setAttribute("aria-pressed", "true");
          note.innerHTML = "";
          note.appendChild(el("b", null, r.name + " / " + M.cols[j].name));
          note.appendChild(document.createTextNode(cell[1]));
        });
        all.push(b); td.appendChild(b); row.appendChild(td);
        ul.appendChild(el("li", null, r.name + ", " + M.cols[j].name + " (" + WORD[cell[0]] + "): " + cell[1]));
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody); host.appendChild(table);
    if (textHost) textHost.appendChild(ul);
  })();

  /* ------------------------------------------------------------------ 04.2 checkpoints */
  (function checkpoints() {
    var panel = $("#cpPanel"), host = $("#cpSteps");
    if (!host || !D.checkpoints) return;
    var C = D.checkpoints, steps = [];

    function meter(n, label) {
      var m = el("div", "meter");
      m.setAttribute("role", "img");
      m.setAttribute("aria-label", "Intensity of the language: level " + n + " of 4. " + label);
      var bars = el("div", "meter__bars");
      for (var i = 1; i <= 4; i++) bars.appendChild(el("i", i <= n ? "on" : ""));
      var lab = el("div", "meter__lab");
      lab.appendChild(el("span", null, T("Intensity of the language")));
      lab.appendChild(el("b", null, label));
      m.appendChild(bars); m.appendChild(lab);
      return m;
    }
    function facts(cp) {
      var dl = el("dl", "cp-facts");
      [[T("Dominant frame"), cp.frame], [T("Cast as the enemy"), cp.enemy]].forEach(function (f) {
        var d = el("div"); d.appendChild(el("dt", null, f[0])); d.appendChild(el("dd", null, f[1])); dl.appendChild(d);
      });
      return dl;
    }

    // sticky panel (large screens)
    var pCount = el("p", "cp-count"), pDate = el("p", "cp-date"), pTitle = el("p", "cp-title");
    var pPoleWrap = el("div", "cp-pole"), pPole = poleMarkup("pole--fig");
    var pMeter = el("div"), pFacts = el("div");
    pPoleWrap.appendChild(pPole);
    [pCount, pDate, pTitle, pPoleWrap, pMeter, pFacts].forEach(function (n) { panel.appendChild(n); });

    function show(i) {
      var cp = C[i];
      pCount.textContent = T("Checkpoint {0} of {1}", i + 1, C.length);
      pDate.textContent = cp.date; pTitle.textContent = cp.title;
      setPole(pPole, cp.disc, cp.formal);
      if (!pMeter.firstChild) pMeter.appendChild(meter(cp.intensity, cp.intensityLabel));
      else {
        $$(".meter__bars i", pMeter).forEach(function (b, k) { b.className = k < cp.intensity ? "on" : ""; });
        $(".meter__lab b", pMeter).textContent = cp.intensityLabel;
      }
      pFacts.innerHTML = ""; pFacts.appendChild(facts(cp));
      steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); });
      cpNeedle = cp.disc; paintBarNeedle();
    }

    C.forEach(function (cp, i) {
      var step = el("div", "step"), card = el("article", "step__card cp-step__card");
      card.appendChild(el("p", "cp-step__date", cp.date));
      card.appendChild(el("h3", null, cp.title));
      // inline gauge (small screens)
      var gauge = el("div", "cp-gauge"), pole = poleMarkup("pole--fig");
      pole.setAttribute("role", "img"); pole.setAttribute("aria-label", poleLabel(cp.disc, cp.formal));
      setPole(pole, cp.disc, cp.formal);
      gauge.appendChild(pole); gauge.appendChild(meter(cp.intensity, cp.intensityLabel)); gauge.appendChild(facts(cp));
      card.appendChild(gauge);
      cp.body.forEach(function (t) { card.appendChild(el("p", null, t)); });
      var q = el("blockquote", "quote");
      q.appendChild(el("p", null, "“" + cp.quote.text + "”"));
      q.appendChild(el("footer", null, cp.quote.who + ", " + cp.quote.when + ". " + cp.quote.context + "."));
      card.appendChild(q);
      step.appendChild(card); host.appendChild(step); steps.push(step);
    });
    show(0);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) show(steps.indexOf(en.target)); });
      }, { rootMargin: "-48% 0px -48% 0px" });
      steps.forEach(function (s) { io.observe(s); });
    }
  })();

  /* ------------------------------------------------------------------ law comparison + flow */
  (function law() {
    var host = $("#lawTable"), L = D.lawCompare;
    if (host && L) {
      var t = el("table", "law"), thead = el("thead"), hr = el("tr");
      var c0 = el("th"); c0.innerHTML = '<span class="sr">Dimension</span>'; hr.appendChild(c0);
      L.cols.forEach(function (c) { var th = el("th", null, c); th.scope = "col"; hr.appendChild(th); });
      thead.appendChild(hr); t.appendChild(thead);
      var tb = el("tbody");
      L.rows.forEach(function (r) {
        var tr = el("tr"), th = el("th", null, r.dim); th.scope = "row"; tr.appendChild(th);
        r.cells.forEach(function (c, j) {
          var td = el("td", null, c.t); td.setAttribute("data-col", L.cols[j]);
          if (c.interp) { td.appendChild(document.createTextNode(" ")); td.appendChild(el("span", "reading", T("reading"))); }
          tr.appendChild(td);
        });
        tb.appendChild(tr);
      });
      t.appendChild(tb); host.appendChild(t);
    }
    var flow = $("#lawFlow");
    if (flow && D.lawFlow) {
      D.lawFlow.forEach(function (f) {
        var li = el("li"); li.appendChild(el("h4", null, f.step)); li.appendChild(el("p", null, f.text)); flow.appendChild(li);
      });
    }
  })();

  /* ------------------------------------------------------------------ experts */
  (function experts() {
    var host = $("#expertCards");
    if (!host || !D.experts) return;
    D.experts.forEach(function (x) {
      var d = el("details", "card"), s = el("summary");
      s.appendChild(el("p", "card__date", T("Interview, {0}", x.date)));
      s.appendChild(el("h3", "card__name", x.name));
      s.appendChild(el("p", "card__aff", x.aff));
      s.appendChild(el("p", "card__exp", x.exp));
      d.appendChild(s);
      d.appendChild(el("p", "card__take", x.take));
      host.appendChild(d);
    });
  })();

  /* ------------------------------------------------------------------ playbook */
  (function playbook() {
    var host = $("#playbook");
    if (!host || !D.playbook) return;
    var rows = el("div", "pb__rows");
    D.playbook.forEach(function (p) {
      var r = el("div", "pb__row");
      r.appendChild(el("p", "pb__word", p.word));
      var wrap = document.createElement("div");
      wrap.innerHTML = '<svg class="pb__arrow" viewBox="0 0 70 12" preserveAspectRatio="none" aria-hidden="true"><path class="draw" pathLength="1" d="M0 6H68"/><path d="M62 1l6 5-6 5"/></svg>';
      r.appendChild(wrap.firstChild);
      r.appendChild(el("p", "pb__did", p.did));
      rows.appendChild(r);
    });
    host.appendChild(rows);
    var seal = el("div", "pb__seal");
    seal.appendChild(el("p", "pb__word", D.playbookSeal.word));
    seal.appendChild(el("p", null, D.playbookSeal.did));
    host.appendChild(seal);
  })();

  /* ------------------------------------------------------------------ Georgia map */
  (function georgia() {
    var node = $("#mapGeorgia");
    if (!node) return;
    function render() {
      if (!hasD3 || !window.GEO_GEORGIA) { node.textContent = T("The map could not be loaded."); return; }
      var W = node.clientWidth || 700, small = W < 560, H = Math.round(W * (small ? 0.74 : 0.5));
      var ge = topojson.feature(window.GEO_GEORGIA, window.GEO_GEORGIA.objects.georgia);
      var occ = topojson.feature(window.GEO_GEORGIA, window.GEO_GEORGIA.objects.occupied).features;
      var svg = d3.select(node).html("").append("svg").attr("viewBox", "0 0 " + W + " " + H).attr("aria-hidden", "true");
      var pat = svg.append("defs").append("pattern").attr("id", "occHatch").attr("width", 6).attr("height", 6)
        .attr("patternUnits", "userSpaceOnUse").attr("patternTransform", "rotate(45)");
      pat.append("line").attr("class", "occ-line").attr("x1", 0).attr("y1", 0).attr("x2", 0).attr("y2", 6);
      var proj = d3.geoMercator().fitExtent([[W * 0.07, H * (small ? 0.26 : 0.2)], [W * 0.93, H * (small ? 0.8 : 0.84)]], ge);
      var path = d3.geoPath(proj);
      svg.append("g").selectAll("path").data(europeFeatures().filter(function (f) { return f.properties.name !== "Georgia"; }))
        .join("path").attr("class", "nb").attr("d", path);
      svg.append("path").datum(ge).attr("class", "ge-under").attr("d", path);
      svg.append("path").datum(ge).attr("class", "ge-land").attr("d", path);
      svg.append("g").selectAll("path").data(occ).join("path").attr("class", "occ").attr("style", "fill:url(#occHatch)").attr("d", path);

      function label(lines, at, cls, anchor) {
        var t = svg.append("text").attr("class", "mlabel " + (cls || "")).attr("text-anchor", anchor || "middle").attr("x", at[0]).attr("y", at[1]);
        lines.forEach(function (l, i) { t.append("tspan").attr("x", at[0]).attr("dy", i ? "1.25em" : 0).text(T(l)); });
      }
      // neighbours and sea
      label(["Russia"], proj(small ? [46.5, 42.95] : [42.3, 43.72]));
      label(["Turkey"], proj([42.2, 40.78]));
      if (!small) { label(["Armenia"], proj([44.75, 40.72])); label(["Azerbaijan"], proj([46.55, 40.95])); }
      label(["Black Sea"], proj([40.55, small ? 41.55 : 41.75]), "mlabel--sea");

      // occupied territories, with leaders
      var ab = path.centroid(occ.filter(function (f) { return f.properties.name === "Abkhazia"; })[0]);
      var so = path.centroid(occ.filter(function (f) { return f.properties.name !== "Abkhazia"; })[0]);
      var abL = [Math.max(46, ab[0] - W * 0.1), ab[1] + H * (small ? 0.2 : 0.2)];
      svg.append("path").attr("class", "leader").attr("d", "M" + ab[0] + "," + ab[1] + "L" + abL[0] + "," + (abL[1] - 13));
      label(["Abkhazia"], abL, "mlabel--plain mlabel--ru");
      var soL = [so[0] + W * 0.03, so[1] - H * (small ? 0.3 : 0.27)];
      svg.append("path").attr("class", "leader").attr("d", "M" + so[0] + "," + so[1] + "L" + soL[0] + "," + (soL[1] + 22));
      label(["Tskhinvali region /", "South Ossetia"], soL, "mlabel--plain mlabel--ru");

      // Tbilisi
      var tb = proj(CITY.Tbilisi);
      svg.append("rect").attr("class", "city city--ge").attr("width", 9).attr("height", 9).attr("x", -4.5).attr("y", -4.5)
        .attr("transform", "translate(" + tb[0] + "," + tb[1] + ") rotate(45)");
      label(["Tbilisi"], [tb[0] + 11, tb[1] + 4], "mlabel--plain mlabel--ge", "start");
    }
    render();
    var lastW = node.clientWidth;
    window.addEventListener("resize", debounce(function () { if (node.clientWidth !== lastW) { lastW = node.clientWidth; render(); } }, 250));
  })();

  /* ------------------------------------------------------------------ about: career map, CV, skills, contact */
  (function career() {
    var node = $("#mapCareer"), tip = $("#careerTip"), list = $("#placesList"), fig = $("#figCareer");
    if (!node || !D.places) return;
    var P = D.places, items = [];

    P.forEach(function (p) {
      var li = el("li"); li.appendChild(el("b", null, p.city));
      li.appendChild(document.createTextNode(p.roles.join("; ")));
      list.appendChild(li); items.push(li);
    });

    function render() {
      if (!hasD3) { node.textContent = ""; return; }
      var small = node.clientWidth < 620;
      var box = small ? [[0, 38], [59, 61]] : [[2, 38], [56, 61.5]];
      var m = drawEurope(node, { base: box, ratio: small ? 0.92 : 0.5, plain: true });
      var svg = m.svg, proj = m.proj, hub = P.filter(function (p) { return p.hub; })[0], h = proj([hub.lon, hub.lat]);
      var routes = svg.append("g");
      P.forEach(function (p) {
        if (p.hub) return;
        routes.append("path").attr("class", "route draw").attr("pathLength", 1).attr("d", arcPath(h, proj([p.lon, p.lat]), 0.16));
      });
      P.forEach(function (p, i) {
        var xy = proj([p.lon, p.lat]);
        var g = svg.append("g").attr("class", "pin" + (p.hub ? " pin--hub" : "")).attr("transform", "translate(" + xy[0] + "," + xy[1] + ")")
          .attr("tabindex", 0).attr("role", "button").attr("aria-label", p.city + ": " + p.roles.join("; "));
        g.append("circle").attr("r", 16).attr("style", "fill:transparent;stroke:none");
        if (p.hub) g.append("rect").attr("width", 11).attr("height", 11).attr("x", -5.5).attr("y", -5.5).attr("transform", "rotate(45)");
        else g.append("circle").attr("r", 5);
        var right = p.side !== "left";
        g.append("text").attr("class", "mlabel mlabel--city" + (p.hub ? " mlabel--ge" : "")).attr("text-anchor", p.hub ? "middle" : right ? "start" : "end")
          .attr("x", p.hub ? 0 : right ? 10 : -10).attr("y", p.hub ? 24 : 4).text(p.city);
        function on() {
          tip.innerHTML = ""; tip.appendChild(el("b", null, p.city));
          p.roles.forEach(function (r) { tip.appendChild(el("div", null, r)); });
          var left = Math.max(145, Math.min(node.clientWidth - 145, xy[0]));
          tip.style.left = left + "px"; tip.style.top = node.offsetTop + xy[1] + "px";
          tip.classList.add("is-on"); g.classed("is-on", true); items[i].classList.add("is-on");
        }
        function off() { tip.classList.remove("is-on"); g.classed("is-on", false); items[i].classList.remove("is-on"); }
        g.on("mouseenter", on).on("mouseleave", off).on("focus", on).on("blur", off).on("click", on);
      });
    }
    render();
    var lastW = node.clientWidth;
    window.addEventListener("resize", debounce(function () { if (node.clientWidth !== lastW) { lastW = node.clientWidth; render(); } }, 250));
  })();

  (function about() {
    var cv = $("#cvList");
    if (cv && D.cv) D.cv.forEach(function (c) {
      var li = el("li"); li.appendChild(el("span", "cv__when", c.when));
      var d = el("div"); d.appendChild(el("p", "cv__what", c.what)); d.appendChild(el("p", "cv__where", c.where));
      li.appendChild(d); cv.appendChild(li);
    });
    var sk = $("#skillsList");
    if (sk && D.skills) D.skills.forEach(function (s) { sk.appendChild(el("li", null, s)); });
    var c = D.contact || {};
    if (c.emailParts) { var rv = function (x) { return x.split("").reverse().join(""); }; c.email = rv(c.emailParts[1]) + String.fromCharCode(64) + rv(c.emailParts[0]); }
    ["#emailLink", "#emailLink2"].forEach(function (s) { var a = $(s); if (a && c.email) { a.href = "mailto:" + c.email; a.textContent = c.email; } });
    ["#linkedinLink", "#linkedinLink2"].forEach(function (s) { var a = $(s); if (a && c.linkedin) { a.href = c.linkedin; a.target = "_blank"; } });
  })();

  /* ------------------------------------------------------------------ copy citation */
  (function cite() {
    var btn = $("#copyCite"), src = $("#citation"), msg = $("#copied");
    if (!btn || !src) return;
    btn.addEventListener("click", function () {
      var text = src.textContent.trim();
      function ok() { msg.textContent = "Copied"; setTimeout(function () { msg.textContent = ""; }, 2500); }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(src);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        try { document.execCommand("copy"); ok(); } catch (e) { msg.textContent = "Select the text and copy it"; }
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    });
  })();
})();
