(function () {
  const COURSE = window.COURSE || [];
  const flat = COURSE.flatMap(p => p.items.map(i => ({ slug: i[0], tag: i[1], title: i[2], part: p.part })));
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("wmc-done") || "[]"); } catch { return []; } },
    set(v) { try { localStorage.setItem("wmc-done", JSON.stringify(v)); } catch {} },
  };
  const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const slug = (document.body.dataset.slug || "");
  const isHome = document.body.dataset.page === "home";

  // theme
  try { const t = localStorage.getItem("wmc-theme"); if (t) document.documentElement.dataset.theme = t; } catch {}
  function toggleTheme() {
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    const cur = document.documentElement.dataset.theme || (dark ? "dark" : "light");
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("wmc-theme", next); } catch {}
  }

  // top bar
  const bar = document.createElement("header");
  bar.className = "topbar";
  bar.innerHTML = `<button class="btn" id="menuBtn" aria-label="Toggle lesson list">☰ Lessons</button>
    <a class="brand" href="${isHome ? "" : "index.html"}">Web Mastery</a><span class="spacer"></span>
    <button class="btn" id="themeBtn">Theme</button>`;
  document.body.prepend(bar);
  bar.querySelector("#themeBtn").onclick = toggleTheme;

  function renderHome() {
    const done = store.get();
    const pct = Math.round(100 * done.length / flat.length);
    const next = flat.find(l => !done.includes(l.slug)) || flat[0];
    const hero = document.getElementById("hero-progress");
    if (hero) hero.innerHTML = `<div class="progress" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
      <div>${done.length} of ${flat.length} complete</div><p><a class="btn primary" href="${next.slug}.html">${done.length ? "Continue: " : "Start: "}${esc(next.tag)} — ${esc(next.title)}</a></p>`;
    const parts = document.getElementById("parts");
    if (parts) parts.innerHTML = COURSE.map(p => `<section class="part"><h2>${esc(p.part)}</h2>${p.items.map(i =>
      `<a href="${i[0]}.html"><span class="num">${i[1]}</span><span>${esc(i[2])}${done.includes(i[0]) ? " ✓" : ""}</span></a>`).join("")}</section>`).join("");
  }

  function renderLesson() {
    const done = store.get();
    const idx = flat.findIndex(l => l.slug === slug);
    const shell = document.createElement("div");
    shell.className = "shell";
    const side = document.createElement("nav");
    side.className = "sidebar"; side.setAttribute("aria-label", "Course lessons");
    side.innerHTML = COURSE.map(p => `<h4>${esc(p.part)}</h4>` + p.items.map(i =>
      `<a href="${i[0]}.html" ${i[0] === slug ? 'aria-current="page"' : ""}><span class="tick">${done.includes(i[0]) ? "✓" : ""}</span><span class="num">${i[1].replace("Lesson ", "")}</span><span>${esc(i[2])}</span></a>`).join("")).join("");
    const main = document.querySelector("main");
    main.parentNode.insertBefore(shell, main);
    shell.append(side, main);
    const cur = side.querySelector('[aria-current]'); if (cur) side.scrollTop = Math.max(0, cur.offsetTop - side.clientHeight / 2 + cur.offsetHeight / 2);
    document.getElementById("menuBtn").onclick = () => document.body.classList.toggle("nav-open");
    side.addEventListener("click", e => { if (e.target.closest("a")) document.body.classList.remove("nav-open"); });

    const art = main.querySelector("article");
    const meta = document.createElement("div"); meta.className = "meta";
    if (idx >= 0) meta.innerHTML = `<span class="chip">${esc(flat[idx].part)}</span>`;
    art.prepend(meta);
    const isDone = () => store.get().includes(slug);
    const row = document.createElement("div"); row.className = "done-row";
    const btn = document.createElement("button"); btn.className = "btn primary";
    const paint = () => { btn.textContent = isDone() ? "✓ Completed — undo" : "Mark lesson complete"; };
    btn.onclick = () => { let d = store.get(); d = isDone() ? d.filter(x => x !== slug) : [...d, slug]; store.set(d); paint();
      const t = side.querySelector('[aria-current] .tick'); if (t) t.textContent = isDone() ? "✓" : ""; };
    paint(); row.append(btn); art.append(row);
    const pager = document.createElement("div"); pager.className = "pager";
    const prev = flat[idx - 1], nxt = flat[idx + 1];
    pager.innerHTML = (prev ? `<a class="prev" href="${prev.slug}.html"><small>← Previous</small>${esc(prev.title)}</a>` : "<span></span>") +
      (nxt ? `<a class="next" href="${nxt.slug}.html"><small>Next →</small>${esc(nxt.title)}</a>` : "");
    art.append(pager);
  }

  // ---- code blocks ----
  const KW = "const|let|var|function|return|if|else|for|while|of|in|new|class|extends|import|export|from|default|async|await|try|catch|throw|typeof|this|null|undefined|true|false|switch|case|break|continue|yield|static|super|interface|type";
  function highlight(code, lang) {
    const e = esc(code);
    if (lang === "bash" || lang === "sh") return e.replace(/(^|\n)(\s*#[^\n]*)/g, '$1<span class="tk-c">$2</span>');
    const markup = ["html", "xml", "svg"].includes(lang), css = lang === "css";
    const parts = [
      "(\\/\\*[\\s\\S]*?\\*\\/|&lt;!--[\\s\\S]*?--&gt;" + (markup || css ? "" : "|(?<![:\\\\])\\/\\/[^\\n]*") + ")",
      "(\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'" + (markup ? "" : "|`(?:\\\\.|[^`\\\\])*`") + ")",
      markup ? "(&lt;\\/?[A-Za-z][\\w.-]*)" : "((?!x)x)",
      markup ? "((?!x)x)" : "(\\b\\d+(?:\\.\\d+)?(?:px|rem|em|vh|vw|dvh|fr|ms|s|deg|%)?(?![\\w]))",
      markup || css ? "((?!x)x)" : "\\b(" + KW + ")\\b",
    ];
    const re = new RegExp(parts.join("|"), "g");
    const cls = ["tk-c", "tk-s", "tk-t", "tk-n", "tk-k"];
    return e.replace(re, (m, ...g) => { const i = g.slice(0, 5).findIndex(x => x !== undefined); return i < 0 ? m : `<span class="${cls[i]}">${m}</span>`; });
  }

  function runDoc(code, lang) {
    if (lang === "js") {
      return `<!doctype html><meta charset="utf-8"><body style="font:14px/1.5 ui-monospace,Menlo,monospace;margin:12px"><pre id="__o" style="margin:0;white-space:pre-wrap"></pre><script>
(()=>{const o=document.getElementById('__o');const f=a=>typeof a==='string'?a:(()=>{try{return JSON.stringify(a,null,2)}catch{return String(a)}})();
console.log=console.info=(...a)=>{o.append(a.map(f).join(' ')+'\\n')};console.error=console.warn=(...a)=>{o.append('✖ '+a.map(f).join(' ')+'\\n')};
addEventListener('error',e=>{o.append('✖ '+e.message+'\\n')});addEventListener('unhandledrejection',e=>{o.append('✖ Unhandled: '+(e.reason&&e.reason.message||e.reason)+'\\n')});})();<\/script><script type="module">${code}<\/script>`;
    }
    if (lang === "jsx") {
      return `<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:12px;line-height:1.5}button{font:inherit;padding:.3em .8em;cursor:pointer}input,select,textarea{font:inherit;padding:.3em}</style><div id="root"></div>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"><\/script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"><\/script>
<script src="https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"><\/script>
<script>addEventListener('error',e=>{const r=document.getElementById('root');r.innerHTML='';const p=document.createElement('pre');p.style.cssText='color:#b00;white-space:pre-wrap';p.textContent=e.message;r.append(p)})<\/script>
<script type="text/babel" data-presets="react">
const {useState,useEffect,useRef,useReducer,useMemo,useCallback,useContext,createContext,memo,Fragment,useId,useTransition,useDeferredValue,useLayoutEffect,Suspense,lazy,StrictMode,useSyncExternalStore}=React;
${code}
ReactDOM.createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
<\/script>`;
    }
    return code;
  }

  function upgradeCode() {
    document.querySelectorAll("textarea.code").forEach(ta => {
      const lang = ta.dataset.lang || "html";
      const code = ta.value.replace(/^\n/, "").replace(/\s+$/, "");
      const wrap = document.createElement("div");
      wrap.className = "codeblock";
      const bar = document.createElement("div"); bar.className = "codebar";
      bar.innerHTML = `<span>${ta.dataset.file ? esc(ta.dataset.file) : lang}</span><span class="spacer"></span>`;
      const copy = document.createElement("button"); copy.textContent = "Copy";
      bar.append(copy); wrap.append(bar);
      if (ta.hasAttribute("data-run")) {
        const live = document.createElement("div"); live.className = "live";
        const ed = document.createElement("textarea"); ed.value = code; ed.spellcheck = false;
        ed.setAttribute("aria-label", "Editable code"); ed.rows = Math.min(18, Math.max(8, code.split("\n").length + 1));
        const fr = document.createElement("iframe"); fr.title = "Live result"; fr.sandbox = "allow-scripts allow-forms allow-modals";
        if (ta.dataset.height) { ed.style.minHeight = fr.style.minHeight = ta.dataset.height; }
        let t; const upd = () => { fr.srcdoc = runDoc(ed.value, lang); };
        ed.addEventListener("input", () => { clearTimeout(t); t = setTimeout(upd, 350); });
        ed.addEventListener("keydown", e => { if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); const s = ed.selectionStart; ed.setRangeText("  ", s, ed.selectionEnd, "end"); } });
        const reset = document.createElement("button"); reset.textContent = "Reset";
        reset.onclick = () => { ed.value = code; upd(); };
        bar.insertBefore(reset, copy);
        const tag = document.createElement("span"); tag.textContent = "▶ live — edit me"; bar.children[0].after(tag); tag.style.color = "#b9a8ff";
        copy.onclick = () => navigator.clipboard && navigator.clipboard.writeText(ed.value).then(() => { copy.textContent = "Copied"; setTimeout(() => copy.textContent = "Copy", 1200); });
        live.append(ed, fr); wrap.append(live); upd();
      } else {
        const pre = document.createElement("pre"); const c = document.createElement("code");
        c.innerHTML = highlight(code, lang); pre.append(c); wrap.append(pre);
        copy.onclick = () => navigator.clipboard && navigator.clipboard.writeText(code).then(() => { copy.textContent = "Copied"; setTimeout(() => copy.textContent = "Copy", 1200); });
      }
      ta.replaceWith(wrap);
    });
  }

  if (isHome) renderHome(); else { renderLesson(); }
  upgradeCode();
})();
