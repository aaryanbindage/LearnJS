(function () {
  const COURSE = window.COURSE || [];
  // Lesson/project numbers are computed from the order in lessons.js, so lessons can be inserted freely.
  let nLesson = 0, nProject = 0;
  const tagFor = s => /^p\d/.test(s) ? "Project " + (++nProject) : s === "ide-tools" ? "Guide" : "Lesson " + (nLesson++);
  COURSE.forEach(p => p.items.forEach(i => { i.tag = tagFor(i[0]); }));
  const flat = COURSE.flatMap(p => p.items.map(i => ({ slug: i[0], tag: i.tag, title: i[1], part: p.part })));
  const store = {
    get() { try { return JSON.parse(localStorage.getItem("wmc-done") || "[]"); } catch { return []; } },
    set(v) { try { localStorage.setItem("wmc-done", JSON.stringify(v)); } catch {} },
  };
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
      `<a href="${i[0]}.html"><span class="num">${i.tag}</span><span>${esc(i[1])}${done.includes(i[0]) ? " ✓" : ""}</span></a>`).join("")}</section>`).join("");
    const count = document.getElementById("count");
    if (count) count.textContent = `${nLesson} lessons · ${nProject} projects · TypeScript throughout`;
  }

  function renderLesson() {
    const done = store.get();
    const idx = flat.findIndex(l => l.slug === slug);
    const shell = document.createElement("div");
    shell.className = "shell";
    const side = document.createElement("nav");
    side.className = "sidebar"; side.setAttribute("aria-label", "Course lessons");
    side.innerHTML = COURSE.map(p => `<h4>${esc(p.part)}</h4>` + p.items.map(i =>
      `<a href="${i[0]}.html" ${i[0] === slug ? 'aria-current="page"' : ""}><span class="tick">${done.includes(i[0]) ? "✓" : ""}</span><span class="num">${i.tag.replace("Lesson ", "").replace("Project ", "P")}</span><span>${esc(i[1])}</span></a>`).join("")).join("");
    const main = document.querySelector("main");
    main.parentNode.insertBefore(shell, main);
    shell.append(side, main);
    const cur = side.querySelector('[aria-current]'); if (cur) side.scrollTop = Math.max(0, cur.offsetTop - side.clientHeight / 2 + cur.offsetHeight / 2);
    document.getElementById("menuBtn").onclick = () => document.body.classList.toggle("nav-open");
    side.addEventListener("click", e => { if (e.target.closest("a")) document.body.classList.remove("nav-open"); });

    const art = main.querySelector("article");
    const h1 = art.querySelector("h1");
    if (h1 && idx >= 0) {
      // Strip any hard-coded "Lesson 12 — " prefix; the number lives in the chip row instead.
      const t = h1.firstChild;
      if (t && t.nodeType === 3) t.textContent = t.textContent.replace(/^\s*(Lesson|Project)\s+\d+\s*[—–-]\s*/, "");
      document.title = `${flat[idx].tag} — ${h1.textContent} · Web Mastery`;
    }
    const meta = document.createElement("div"); meta.className = "meta";
    if (idx >= 0) meta.innerHTML = `<span class="chip">${esc(flat[idx].tag)}</span><span class="chip quiet">${esc(flat[idx].part)}</span>`;
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

  // ---- quizzes: <div class="quiz"><p>Question</p><button data-correct>A</button><button>B</button><p class="why">…</p></div>
  function upgradeQuizzes() {
    document.querySelectorAll(".quiz").forEach(q => {
      const opts = q.querySelectorAll(":scope > button");
      const why = q.querySelector(".why");
      opts.forEach(b => b.addEventListener("click", () => {
        const ok = b.hasAttribute("data-correct");
        b.classList.add(ok ? "right" : "wrong");
        if (ok) { opts.forEach(o => o.disabled = true); q.classList.add("solved"); if (why) why.hidden = false; }
        else b.disabled = true;
      }));
      if (why) why.hidden = true;
    });
  }

  // ---- static code highlighting ----
  const KW = "const|let|var|function|return|if|else|for|while|do|of|in|new|class|extends|implements|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|this|null|undefined|true|false|switch|case|break|continue|yield|static|super|interface|type|enum|as|satisfies|keyof|readonly|public|private|protected|declare|namespace|abstract|void|never|unknown|any|number|string|boolean";
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
  const LANG_NAME = { js: "JavaScript", ts: "TypeScript", jsx: "React (JSX)", tsx: "React (TSX)", html: "HTML", css: "CSS", bash: "Terminal", sh: "Terminal", json: "JSON", glsl: "GLSL", sql: "SQL" };

  // ---- Monaco (the editor that powers VS Code), loaded on demand from a CDN ----
  const MONACO = "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min";
  let monacoP;
  function loadMonaco() {
    if (monacoP) return monacoP;
    monacoP = new Promise((resolve, reject) => {
      window.MonacoEnvironment = { getWorkerUrl: () => URL.createObjectURL(new Blob(
        [`self.MonacoEnvironment={baseUrl:"${MONACO}/"};importScripts("${MONACO}/vs/base/worker/workerMain.js");`], { type: "text/javascript" })) };
      const s = document.createElement("script");
      s.src = MONACO + "/vs/loader.js";
      s.onload = () => {
        window.require.config({ paths: { vs: MONACO + "/vs" } });
        window.require(["vs/editor/editor.main"], () => { try { setupMonaco(window.monaco); resolve(window.monaco); } catch (e) { reject(e); } }, reject);
      };
      s.onerror = reject;
      document.head.append(s);
      setTimeout(() => reject(new Error("Editor took too long to load")), 20000);
    });
    return monacoP;
  }
  function setupMonaco(m) {
    m.editor.defineTheme("course", {
      base: "vs-dark", inherit: true,
      rules: [
        { token: "comment", foreground: "8d8aa6", fontStyle: "italic" },
        { token: "keyword", foreground: "c7a6ff" }, { token: "string", foreground: "9ddf9a" },
        { token: "number", foreground: "ffcf87" }, { token: "type", foreground: "7cc7ff" },
        { token: "type.identifier", foreground: "7cc7ff" }, { token: "tag", foreground: "ff9bb5" },
        { token: "attribute.name", foreground: "ffcf87" }, { token: "attribute.value", foreground: "9ddf9a" },
      ],
      colors: {
        "editor.background": "#16151d", "editorGutter.background": "#16151d",
        "editor.lineHighlightBackground": "#211f2c", "editor.lineHighlightBorder": "#00000000",
        "editorLineNumber.foreground": "#4d4a63", "editorLineNumber.activeForeground": "#a9a6c2",
        "editor.selectionBackground": "#4a3f8a", "editorCursor.foreground": "#b9a8ff",
        "editorIndentGuide.background1": "#2a2838", "editorWidget.background": "#1e1c28", "editorHoverWidget.background": "#1e1c28",
        "editorHoverWidget.border": "#3a3750", "editorSuggestWidget.background": "#1e1c28", "editorSuggestWidget.border": "#3a3750",
      },
    });
    const ts = m.languages.typescript;
    const base = {
      target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.NodeJs,
      allowNonTsExtensions: true, strict: true, jsx: ts.JsxEmit.Preserve, esModuleInterop: true,
      moduleDetection: 3, // "force": every example is its own module, so names in different editors never clash
    };
    ts.typescriptDefaults.setCompilerOptions(base);
    ts.typescriptDefaults.setDiagnosticsOptions({ noSemanticValidation: false, noSyntaxValidation: false, diagnosticCodesToIgnore: [1375, 1378, 6133, 6196] });
    ts.typescriptDefaults.setEagerModelSync(true);
    ts.javascriptDefaults.setCompilerOptions({ ...base, allowJs: true, checkJs: false });
    // Plain JS editors only flag syntax mistakes; type checking is TypeScript's job.
    ts.javascriptDefaults.setDiagnosticsOptions({ noSemanticValidation: true, noSyntaxValidation: false });
  }

  // ---- friendly explanations for the errors beginners hit most ----
  const RUNTIME_HINTS = [
    [/(\w+) is not defined/, m => `JavaScript doesn't know anything called “${m[1]}”. Check the spelling (capitals matter), and make sure you created it with let or const before using it.`],
    [/Assignment to constant variable/, () => "You tried to change a variable made with const. Use let if the value needs to change."],
    [/Cannot access '(\w+)' before initialization/, m => `You used “${m[1]}” on a line above the one that creates it. Move the let/const line higher.`],
    [/(\S+) is not a function/, m => `You put () after “${m[1]}”, but it isn't a function. Check the spelling, or log it to see what it really is.`],
    [/Cannot read propert(?:y|ies) of (undefined|null)/, m => `You used a dot (.) on something that is ${m[1]}. The thing before the dot doesn't exist yet. Log it to check.`],
    [/Cannot set propert(?:y|ies) of (undefined|null)/, m => `You tried to set a property on something that is ${m[1]}.`],
    [/Unexpected token|Unexpected end of input|missing \) after|Invalid or unexpected token/, () => "This is a typing (syntax) mistake: a missing or extra bracket, quote or comma. The red squiggle in the editor shows where."],
    [/Identifier '(\w+)' has already been declared/, m => `“${m[1]}” was created twice. Create each name once with let/const, then just reuse it.`],
    [/Maximum call stack/, () => "A function kept calling itself forever. Recursive functions need a stopping condition."],
    [/Loop ran for over/, () => "Look at your loop's condition: it probably never becomes false. Make sure the counter moves toward the end."],
  ];
  const TS_HINTS = {
    2322: "You said this would hold one type, but gave it a value of a different type.",
    2345: "The value you passed into the function isn't the type the function asked for.",
    2339: "TypeScript doesn't see that property on this type. Check the spelling, or add it to the type.",
    2304: "TypeScript can't find that name. Check spelling, or create it first.",
    2552: "TypeScript can't find that name. It suggests a similar one: check spelling.",
    2554: "You called the function with the wrong number of arguments.",
    2588: "This variable was made with const, so it can't be reassigned.",
    7006: "This parameter has no type. Add one, like (name: string).",
    18047: "This value might be null. Check it first, e.g. if (x !== null) { … } or use x?.something.",
    18048: "This value might be undefined. Check it first, or give it a default with ??.",
    2531: "This value might be null. Check it first.",
    2532: "This value might be undefined. Check it first.",
    2741: "This object is missing a property its type requires.",
    2353: "This object has a property its type doesn't allow. Check the spelling or update the type.",
    2367: "These two values can never be equal, because their types don't overlap.",
    2362: "Math only works on numbers. One side of this operation isn't a number.",
    2363: "Math only works on numbers. One side of this operation isn't a number.",
    2365: "This operator can't be used with these types.",
    2366: "The function says it returns a value, but some paths reach the end without returning.",
    2349: "You're calling something as a function, but its type isn't a function.",
    2769: "None of the ways this function can be called match the arguments you gave.",
    1005: "Syntax mistake: a symbol (often a bracket, comma or semicolon) is missing here.",
  };
  const hintFor = msg => { for (const [re, f] of RUNTIME_HINTS) { const m = msg.match(re); if (m) return f(m); } return ""; };

  // ---- infinite-loop guard: inserts a cheap check at the top of every braced loop body ----
  function guardLoops(src) {
    let out = "", i = 0, id = 0, prevSig = "";
    const n = src.length, isId = c => /[\w$]/.test(c);
    const skipStr = (q) => { // i at opening quote; returns index after closing quote
      let j = i + 1;
      while (j < n) {
        const c = src[j];
        if (c === "\\") { j += 2; continue; }
        if (q === "`" && c === "$" && src[j + 1] === "{") { // nested template expression
          let depth = 1; j += 2;
          while (j < n && depth) { if (src[j] === "{") depth++; else if (src[j] === "}") depth--; else if (src[j] === "`" || src[j] === "'" || src[j] === '"') { const save = i; i = j; j = skipStr(src[j]) - 1; i = save; } j++; }
          continue;
        }
        if (c === q) return j + 1;
        if (c === "\n" && q !== "`") return j;
        j++;
      }
      return j;
    };
    const skipParens = (j) => { // j at "("
      let depth = 0;
      while (j < n) {
        const c = src[j];
        if (c === "'" || c === '"' || c === "`") { const save = i; i = j; j = skipStr(c); i = save; continue; }
        if (c === "(") depth++;
        else if (c === ")") { depth--; if (!depth) return j + 1; }
        j++;
      }
      return j;
    };
    while (i < n) {
      const c = src[i];
      if (c === "/" && src[i + 1] === "/") { const e = src.indexOf("\n", i); const j = e < 0 ? n : e; out += src.slice(i, j); i = j; continue; }
      if (c === "/" && src[i + 1] === "*") { const e = src.indexOf("*/", i + 2); const j = e < 0 ? n : e + 2; out += src.slice(i, j); i = j; continue; }
      if (c === "'" || c === '"' || c === "`") { const j = skipStr(c); out += src.slice(i, j); i = j; prevSig = "a"; continue; }
      if (c === "/" && (prevSig === "" || /[(,=:[!&|?{};+\-*%<>~^]/.test(prevSig))) { // regex literal
        let j = i + 1, cls = false;
        while (j < n && src[j] !== "\n") { if (src[j] === "\\") { j += 2; continue; } if (src[j] === "[") cls = true; else if (src[j] === "]") cls = false; else if (src[j] === "/" && !cls) break; j++; }
        j++; while (j < n && /[a-z]/.test(src[j])) j++;
        out += src.slice(i, j); i = j; prevSig = "a"; continue;
      }
      if (isId(c)) {
        let j = i; while (j < n && isId(src[j])) j++;
        const word = src.slice(i, j);
        const before = i > 0 ? src[i - 1] : "";
        if (before !== "." && (word === "for" || word === "while" || word === "do")) {
          let k = j; while (k < n && /\s/.test(src[k])) k++;
          if (word === "do" && src[k] === "{") { out += src.slice(i, k + 1) + `__loop(${id++});`; i = k + 1; prevSig = "{"; continue; }
          if (word !== "do" && src[k] === "(") {
            const end = skipParens(k);
            let b = end; while (b < n && /\s/.test(src[b])) b++;
            if (src[b] === "{") { out += src.slice(i, b + 1) + `__loop(${id++});`; i = b + 1; prevSig = "{"; continue; }
          }
        }
        out += word; i = j; prevSig = "a"; continue;
      }
      if (!/\s/.test(c)) prevSig = c;
      out += c; i++;
    }
    return out;
  }

  // ---- the sandbox page that example code runs inside ----
  const BRIDGE = (key) => `<script>(()=>{const K=${JSON.stringify(key)};const send=(t,d)=>parent.postMessage({__lc:K,t,d},"*");
const fmt=(v,d=0,seen=new WeakSet())=>{if(v===null)return"null";const t=typeof v;
if(t==="string")return d?JSON.stringify(v):v;if(t==="number")return Object.is(v,-0)?"-0":String(v);
if(t==="boolean"||t==="undefined")return String(v);if(t==="bigint")return v+"n";if(t==="symbol")return v.toString();
if(t==="function")return/^class\\b/.test(Function.prototype.toString.call(v))?"class "+(v.name||"(anonymous)"):"ƒ "+(v.name||"(anonymous)")+"()";
if(seen.has(v))return"[Circular]";
if(v instanceof Error)return v.name+": "+v.message;if(v instanceof Date)return isNaN(v)?"Invalid Date":v.toString();
if(v instanceof RegExp)return String(v);if(v instanceof Promise)return"Promise { … }";
if(typeof Element!=="undefined"&&v instanceof Element)return"<"+v.tagName.toLowerCase()+(v.id?' id="'+v.id+'"':"")+(typeof v.className==="string"&&v.className?' class="'+v.className+'"':"")+">";
if(d>5)return Array.isArray(v)?"[Array]":"[Object]";seen.add(v);
const w=(o,items,c)=>{if(!items.length)return o+c;const one=o+" "+items.join(", ")+" "+c;if(one.length<=76&&!one.includes("\\n"))return o===\"[\"?"["+items.join(", ")+"]":one;const p="  ".repeat(d+1);return o+"\\n"+items.map(x=>p+x).join(",\\n")+"\\n"+"  ".repeat(d)+c;};
let r;if(Array.isArray(v))r=w("[",Array.from(v,x=>fmt(x,d+1,seen)),"]");
else if(v instanceof Map)r="Map("+v.size+") "+w("{",[...v].map(([k,x])=>fmt(k,d+1,seen)+" => "+fmt(x,d+1,seen)),"}");
else if(v instanceof Set)r="Set("+v.size+") "+w("{",[...v].map(x=>fmt(x,d+1,seen)),"}");
else{const c=v.constructor,nm=c&&c!==Object&&c.name?c.name+" ":"";r=nm+w("{",Object.keys(v).map(k=>(/^[A-Za-z_$][\\w$]*$/.test(k)?k:JSON.stringify(k))+": "+fmt(v[k],d+1,seen)),"}");}
seen.delete(v);return r;};
const line=a=>a.map(x=>fmt(x)).join(" ");
console.log=console.info=console.debug=(...a)=>send("log",line(a));console.warn=(...a)=>send("warn",line(a));console.error=(...a)=>send("error",{msg:line(a)});
console.table=(x)=>send("log",fmt(x));console.clear=()=>send("clear");
const st={};window.__loop=id=>{const s=st[id]||(st[id]={n:0,first:0,last:0});if(++s.n&63)return;const now=performance.now();if(now-s.last>50)s.first=now;s.last=now;if(now-s.first>3000){s.first=now;throw new RangeError("Loop ran for over 3 seconds, so it was stopped. Is it an infinite loop?")}};
addEventListener("error",e=>{send("error",{msg:(e.error&&e.error.name?e.error.name+": ":"")+e.message.replace(/^(Uncaught )?(\\w*Error: )?/,""),line:e.lineno})});
addEventListener("unhandledrejection",e=>{const r=e.reason;send("error",{msg:"Uncaught (in promise) "+(r&&r.message?(r.name?r.name+": ":"")+r.message:fmt(r))})});
})()<\/script>`;

  function sandboxDoc(code, lang, key) {
    const bridge = BRIDGE(key);
    if (lang === "js" || lang === "ts") {
      const head = `<!doctype html><meta charset="utf-8"><style>body{font:15px/1.5 system-ui,sans-serif;margin:12px;color:#1d1d1f}button{font:inherit;padding:.3em .8em}</style>${bridge}\n<script type="module">\n`;
      return { doc: head + code + "\n<\/script>", offset: head.split("\n").length - 1 };
    }
    if (lang === "jsx") {
      return { doc: `<!doctype html><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:12px;line-height:1.5}button{font:inherit;padding:.3em .8em;cursor:pointer}input,select,textarea{font:inherit;padding:.3em}</style>${bridge}<div id="root"></div>
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"><\/script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"><\/script>
<script src="https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"><\/script>
<script type="text/babel" data-presets="react">
const {useState,useEffect,useRef,useReducer,useMemo,useCallback,useContext,createContext,memo,Fragment,useId,useTransition,useDeferredValue,useLayoutEffect,Suspense,lazy,StrictMode,useSyncExternalStore}=React;
${code}
ReactDOM.createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
<\/script>`, offset: 0 };
    }
    // html (and anything else): inject the console bridge right after the doctype so standards mode is kept
    const m = code.match(/^\s*<!doctype[^>]*>/i);
    return { doc: m ? m[0] + bridge + code.slice(m[0].length) : bridge + code, offset: 0 };
  }

  // Routes console messages from sandboxes back to their code block.
  const blocks = new Map();
  addEventListener("message", e => {
    const d = e.data; if (!d || typeof d.__lc !== "string") return;
    const [id, run] = d.__lc.split(":");
    const b = blocks.get(id);
    if (b && String(b.runId) === run && e.source === b.frame.contentWindow) b.onMessage(d.t, d.d);
  });

  let uid = 0;
  function makeLive(ta, wrap, bar, code, lang) {
    const id = String(++uid);
    const isScript = lang === "js" || lang === "ts";
    const showPage = !isScript || ta.hasAttribute("data-page") || /\bdocument\b/.test(code);
    wrap.classList.add("is-live");

    const runBtn = document.createElement("button"); runBtn.className = "run"; runBtn.innerHTML = "▶ Run";
    runBtn.title = "Run this code (Ctrl + Enter)";
    const reset = document.createElement("button"); reset.textContent = "Reset"; reset.title = "Put the original code back";
    const copy = bar.querySelector(".copy");
    bar.insertBefore(reset, copy); bar.insertBefore(runBtn, reset);

    const host = document.createElement("div"); host.className = "editor-host";
    const lines = code.split("\n").length;
    host.style.height = Math.min(560, lines * 22 + 26) + "px";
    const pre = document.createElement("pre"); pre.className = "editor-placeholder";
    pre.innerHTML = `<code>${highlight(code, lang === "ts" ? "js" : lang)}</code>`;
    host.append(pre);

    const out = document.createElement("div"); out.className = "output";
    const frame = document.createElement("iframe");
    frame.title = "Result of running the code"; frame.sandbox = "allow-scripts allow-forms allow-modals allow-popups";
    if (ta.dataset.height) frame.style.height = ta.dataset.height;
    const pagePane = document.createElement("div"); pagePane.className = "pane page";
    pagePane.innerHTML = `<div class="pane-head"><span>${isScript ? "Page" : "Result"}</span></div>`;
    pagePane.append(frame);
    const conPane = document.createElement("div"); conPane.className = "pane console-pane";
    conPane.innerHTML = `<div class="pane-head"><span>Console</span><span class="status"></span><span class="spacer"></span><button class="clear" type="button">Clear</button></div><div class="console" role="log" aria-live="polite"></div>`;
    const con = conPane.querySelector(".console"), status = conPane.querySelector(".status");
    if (showPage) out.append(pagePane); else { frame.className = "hidden-frame"; out.append(frame); }
    out.append(conPane);
    if (!isScript) conPane.hidden = true;
    wrap.append(host, out);

    const empty = () => { con.innerHTML = `<div class="empty">${isScript ? "Press <b>▶ Run</b> (or <kbd>Ctrl</kbd> + <kbd>Enter</kbd>) to run this code. Anything you <code>console.log()</code> appears here." : ""}</div>`; };
    empty();
    conPane.querySelector(".clear").onclick = () => { con.innerHTML = ""; };
    const add = (cls, text, hint, tag) => {
      if (!isScript) conPane.hidden = false;
      const e = con.querySelector(".empty"); if (e) e.remove();
      const ln = document.createElement("div"); ln.className = "ln " + cls;
      if (tag) { const t = document.createElement("span"); t.className = "tag"; t.textContent = tag; ln.append(t); }
      const body = document.createElement("span"); body.className = "txt"; body.textContent = text; ln.append(body);
      if (hint) { const h = document.createElement("span"); h.className = "hint"; h.textContent = "💡 " + hint; ln.append(h); }
      con.append(ln); con.scrollTop = con.scrollHeight;
    };

    const state = { editor: null, model: null, monaco: null, runId: 0, offset: 0, printed: false };
    const getValue = () => state.editor ? state.editor.getValue() : state.fallback ? state.fallback.value : code;
    const setValue = v => { if (state.editor) state.editor.setValue(v); else if (state.fallback) state.fallback.value = v; };

    const b = {
      frame,
      get runId() { return state.runId; },
      onMessage(t, d) {
        state.printed = true;
        if (t === "clear") { con.innerHTML = ""; return; }
        if (t === "log") add("log", d);
        else if (t === "warn") add("warn", d, "", "warning");
        else if (t === "error") {
          const line = d.line && lang === "js" && d.line > state.offset ? d.line - state.offset : 0;
          add("error", d.msg + (line ? `  (line ${line})` : ""), hintFor(d.msg), "error");
          if (line && state.editor) markLine(line);
        }
      },
    };
    blocks.set(id, b);

    let decos = [];
    function markLine(line) {
      const m = state.monaco; if (!m) return;
      decos = state.editor.deltaDecorations(decos, [{ range: new m.Range(line, 1, line, 1), options: { isWholeLine: true, className: "err-line" } }]);
    }

    async function typeCheck() {
      const m = state.monaco;
      const getWorker = await m.languages.typescript.getTypeScriptWorker();
      const worker = await getWorker(state.model.uri);
      const uri = state.model.uri.toString();
      const diags = [...await worker.getSyntacticDiagnostics(uri), ...await worker.getSemanticDiagnostics(uri)];
      const flatMsg = mt => typeof mt === "string" ? mt : mt.messageText + (mt.next ? " " + mt.next.map(flatMsg).join(" ") : "");
      const problems = diags.map(dg => ({ line: state.model.getPositionAt(dg.start || 0).lineNumber, msg: flatMsg(dg.messageText), code: dg.code }));
      const js = (await worker.getEmitOutput(uri)).outputFiles.find(f => /\.js$/.test(f.name));
      return { problems, js: js ? js.text : "" };
    }

    async function run() {
      state.runId++;
      runBtn.classList.remove("pulse");
      decos = state.editor ? state.editor.deltaDecorations(decos, []) : [];
      let src = getValue();
      if (isScript) { con.innerHTML = ""; state.printed = false; }
      if (lang === "ts") {
        if (!state.monaco) { add("error", "The TypeScript editor needs an internet connection to load. Reconnect and refresh the page."); return; }
        runBtn.disabled = true;
        try {
          const { problems, js } = await typeCheck();
          if (problems.length) {
            problems.forEach(p => add("type", `Line ${p.line}: ${p.msg}`, TS_HINTS[p.code] || "", "type error"));
            add("note", "TypeScript found " + (problems.length === 1 ? "1 problem" : problems.length + " problems") + " (above). Types are removed before code runs, so the JavaScript still ran. Its output is below.");
            status.textContent = "✖ " + problems.length + " type error" + (problems.length > 1 ? "s" : ""); status.className = "status bad";
          } else { status.textContent = "✓ no type errors"; status.className = "status good"; }
          src = js;
        } finally { runBtn.disabled = false; }
      } else status.textContent = "";
      if (isScript) src = guardLoops(src);
      const { doc, offset } = sandboxDoc(src, lang, id + ":" + state.runId);
      state.offset = offset;
      frame.srcdoc = doc;
      runBtn.innerHTML = isScript ? "↻ Run again" : "↻ Re-run";
      const myRun = state.runId;
      if (isScript && !showPage) setTimeout(() => {
        if (myRun === state.runId && !state.printed && !con.querySelector(".ln")) add("note", "The code ran, but nothing was printed. Use console.log(something) to see a value.");
      }, 1500);
    }
    runBtn.onclick = run;

    let t;
    const changed = () => { if (!isScript) { clearTimeout(t); t = setTimeout(run, 400); } else { runBtn.classList.add("pulse"); } };
    reset.onclick = () => { setValue(code); if (!isScript) run(); else { con.innerHTML = ""; empty(); status.textContent = ""; runBtn.innerHTML = "▶ Run"; } };
    copy.onclick = () => navigator.clipboard && navigator.clipboard.writeText(getValue()).then(() => { copy.textContent = "Copied"; setTimeout(() => copy.textContent = "Copy", 1200); });

    function fallbackEditor() {
      const ed = document.createElement("textarea"); ed.className = "fallback"; ed.value = code; ed.spellcheck = false;
      ed.setAttribute("aria-label", "Editable code");
      ed.addEventListener("input", changed);
      ed.addEventListener("keydown", e => {
        if (e.key === "Tab" && !e.shiftKey) { e.preventDefault(); ed.setRangeText("  ", ed.selectionStart, ed.selectionEnd, "end"); }
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); run(); }
      });
      host.replaceChildren(ed); host.style.height = ""; ed.style.height = Math.min(560, lines * 22 + 30) + "px";
      state.fallback = ed;
    }

    function mount() {
      loadMonaco().then(m => {
        state.monaco = m;
        const ext = { js: "js", ts: "ts", jsx: "jsx", tsx: "tsx", html: "html", css: "css" }[lang] || "txt";
        const language = { js: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript", html: "html", css: "css" }[lang] || "plaintext";
        state.model = m.editor.createModel(code, language, m.Uri.parse(`file:///example-${id}.${ext}`));
        host.replaceChildren();
        const ed = m.editor.create(host, {
          model: state.model, theme: "course", fontSize: 14, lineHeight: 22,
          fontFamily: 'ui-monospace, "SF Mono", "Cascadia Code", Menlo, Consolas, monospace', fontLigatures: false,
          minimap: { enabled: false }, scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, wordWrap: "on",
          padding: { top: 12, bottom: 12 }, lineNumbersMinChars: 3, folding: false, glyphMargin: false, lineDecorationsWidth: 8,
          overviewRulerLanes: 0, overviewRulerBorder: false, hideCursorInOverviewRuler: true, renderLineHighlightOnlyWhenFocus: true,
          scrollbar: { alwaysConsumeMouseWheel: false, verticalScrollbarSize: 10, horizontalScrollbarSize: 10, useShadows: false },
          fixedOverflowWidgets: true, contextmenu: false, stickyScroll: { enabled: false }, bracketPairColorization: { enabled: true },
          guides: { indentation: true, bracketPairs: false }, occurrencesHighlight: "off", selectionHighlight: false,
          quickSuggestionsDelay: 300, suggest: { preview: false }, ariaLabel: (LANG_NAME[lang] || lang) + " code editor",
        });
        state.editor = ed;
        ed.addCommand(m.KeyMod.CtrlCmd | m.KeyCode.Enter, run);
        const fit = () => { host.style.height = Math.min(560, ed.getContentHeight()) + "px"; };
        ed.onDidContentSizeChange(fit); fit();
        ed.onDidChangeModelContent(changed);
      }).catch(fallbackEditor).finally(() => { if (!isScript) run(); });
    }
    // Only build editors as they approach the screen, so long lessons stay fast.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { io.disconnect(); mount(); } }, { rootMargin: "800px 0px" });
      io.observe(wrap);
    } else mount();
  }

  function upgradeCode() {
    document.querySelectorAll("textarea.code").forEach(ta => {
      const file = ta.dataset.file || "";
      let lang = ta.dataset.lang || "html";
      if (/\.tsx$/.test(file)) lang = lang === "jsx" ? "tsx" : lang === "js" ? "ts" : lang;
      else if (/\.ts$/.test(file) && lang === "js") lang = "ts";
      const code = ta.value.replace(/^\n/, "").replace(/\s+$/, "");
      const wrap = document.createElement("div");
      wrap.className = "codeblock lang-" + lang;
      const bar = document.createElement("div"); bar.className = "codebar";
      bar.innerHTML = `<span class="lang">${esc(LANG_NAME[lang] || lang)}</span>${file ? `<span class="file">${esc(file)}</span>` : ""}<span class="spacer"></span>`;
      const copy = document.createElement("button"); copy.textContent = "Copy"; copy.className = "copy";
      bar.append(copy); wrap.append(bar);
      ta.replaceWith(wrap);
      if (ta.hasAttribute("data-run")) makeLive(ta, wrap, bar, code, lang);
      else {
        const pre = document.createElement("pre"); const c = document.createElement("code");
        c.innerHTML = highlight(code, lang === "ts" || lang === "tsx" ? "js" : lang); pre.append(c); wrap.append(pre);
        copy.onclick = () => navigator.clipboard && navigator.clipboard.writeText(code).then(() => { copy.textContent = "Copied"; setTimeout(() => copy.textContent = "Copy", 1200); });
      }
    });
  }

  if (isHome) renderHome(); else { renderLesson(); }
  upgradeCode();
  upgradeQuizzes();
})();
