// Course index: single source of truth for navigation.
// Each item is [file slug, title]. Lesson and project numbers are computed from this order by course.js.
window.COURSE = [
  { part: "Part 0 — Start here", items: [
    ["00-setup", "Start here: how the web works"],
    ["ide-tools", "Recommended IDEs, extensions & tools"]
  ]},
  { part: "Part 1 — HTML", items: [
    ["01-html-text", "Document structure & text"],
    ["02-html-media-semantics", "Links, images, media & semantic layout"],
    ["03-html-forms-a11y", "Forms, tables & accessibility"]
  ]},
  { part: "Part 2 — CSS", items: [
    ["04-css-selectors", "Selectors, cascade & specificity"],
    ["05-css-box-typography", "Box model, units, color & typography"],
    ["06-css-flexbox", "Flexbox"],
    ["07-css-grid", "Grid"],
    ["08-css-responsive", "Positioning, responsive design & variables"],
    ["09-css-motion", "Transforms, transitions, animations & modern CSS"],
    ["p1-portfolio", "Responsive portfolio"]
  ]},
  { part: "Part 3 — JavaScript & TypeScript: the basics", items: [
    ["js-first-program", "Your first program"],
    ["10-js-values", "Variables: giving values a name"],
    ["ts-meet", "Meet TypeScript"],
    ["js-numbers", "Numbers & math"],
    ["js-strings", "Strings: working with text"],
    ["js-booleans", "Booleans & comparisons"],
    ["11-js-control-flow", "Making decisions: if, else & switch"],
    ["js-loops", "Loops: repeating code"],
    ["12-js-functions", "Functions: reusable code"],
    ["js-functions-2", "Arrow functions, scope & callbacks"],
    ["13-js-arrays-objects", "Arrays: lists of values"],
    ["js-objects", "Objects: grouping related data"],
    ["js-array-methods", "Array methods: map, filter, find & reduce"],
    ["ts-unions", "Union types, null & narrowing"]
  ]},
  { part: "Part 4 — JavaScript & TypeScript in the browser", items: [
    ["14-js-dom", "The DOM: changing the page with code"],
    ["15-js-events", "Events: reacting to the user"],
    ["16-js-modern", "Destructuring, spread & modules"],
    ["18-js-classes", "Classes & this"],
    ["17-js-async", "Async code: promises, fetch & await"],
    ["19-js-tooling", "Errors, debugging & saving data"],
    ["20-js-iterators", "Map, Set, iterators & generators"],
    ["ts-generics", "Generics & utility types"],
    ["21-js-testing-ts", "Real TypeScript projects & testing"],
    ["p2-vanilla-app", "Weather & to-do app (TypeScript)"]
  ]},
  { part: "Part 5 — React", items: [
    ["22-react-intro", "Why React, Vite & JSX"],
    ["23-react-props", "Components & props"],
    ["24-react-state", "State & events"],
    ["25-react-lists-forms", "Lists, conditionals & forms"],
    ["26-react-effects", "Effects & data fetching"],
    ["27-react-hooks", "Refs, reducers, memoization & custom hooks"],
    ["28-react-context", "Context & global state"],
    ["29-react-routing", "Routing & app architecture"],
    ["30-react-performance", "Performance, patterns & testing"],
    ["p3-react-app", "Full React app"]
  ]},
  { part: "Part 6 — Three.js", items: [
    ["31-three-basics", "Scene, camera, renderer"],
    ["32-three-materials", "Geometry, materials & lights"],
    ["33-three-animation", "Animation loop, transforms & controls"],
    ["34-three-models", "Textures, glTF models & environment"],
    ["35-three-raycasting", "Interaction: raycasting"],
    ["36-three-shaders", "Shaders (GLSL)"],
    ["37-three-r3f", "React Three Fiber & drei"],
    ["38-three-physics-post", "Physics, particles & post-processing"],
    ["39-three-deploy", "Performance, deployment & production"],
    ["p4-three-scene", "Interactive 3D scene"],
    ["40-capstone", "Milestone: mini-capstone"]
  ]},
  { part: "Part 7 — Professional CSS & the Platform", items: [
    ["41-css-architecture", "CSS architecture: BEM, layers, modules"],
    ["42-tailwind", "Tailwind CSS & utility-first design"],
    ["43-css-advanced", "Container queries, anchor positioning, view transitions"],
    ["44-a11y-deep", "Accessibility deep dive"],
    ["45-web-vitals", "SEO, performance & Core Web Vitals"],
    ["46-svg-canvas", "SVG & Canvas 2D graphics"]
  ]},
  { part: "Part 8 — Advanced TypeScript & JavaScript", items: [
    ["47-ts-fundamentals", "TypeScript in depth: modeling real data"],
    ["48-ts-advanced", "Advanced types: generics, mapped & conditional"],
    ["49-js-runtime", "Runtime internals: memory, GC, event loop, profiling"],
    ["50-js-patterns", "Design patterns in JavaScript"],
    ["51-algorithms", "Data structures & algorithms for web devs"],
    ["52-web-apis", "Workers, service workers, IndexedDB & PWAs"],
    ["53-security", "Web security: XSS, CSRF, CSP, auth"]
  ]},
  { part: "Part 9 — Backend & Full-Stack", items: [
    ["54-node-apis", "Node.js & building HTTP APIs"],
    ["55-databases-sql", "Databases & SQL"],
    ["56-api-design-auth", "API design, validation & authentication"],
    ["57-nextjs", "Next.js: SSR, SSG & Server Components"],
    ["58-fullstack-data", "Full-stack data: ORMs, Server Actions, caching"],
    ["59-realtime", "Real-time: WebSockets & multiplayer state"],
    ["p5-fullstack", "Production full-stack app"]
  ]},
  { part: "Part 10 — Advanced React", items: [
    ["60-react19", "React 19: Server Components, actions, Suspense"],
    ["61-react-architecture", "Advanced state & architecture"],
    ["62-design-systems", "Design systems & component libraries"],
    ["63-react-delivery", "Testing pyramid, E2E & quality gates"]
  ]},
  { part: "Part 11 — Advanced 3D & Graphics", items: [
    ["64-r3f-architecture", "Advanced R3F architecture"],
    ["65-procedural", "Procedural generation, noise & terrain"],
    ["66-shaders-advanced", "Advanced shaders: SDFs, raymarching, GPGPU"],
    ["67-webgpu-tsl", "WebGPU & TSL"],
    ["68-3d-pipeline", "The 3D asset pipeline: Blender to web"],
    ["69-game-architecture", "Game architecture: loops, ECS, character control"],
    ["70-webxr-audio", "WebXR, spatial audio & 3D UX"],
    ["p6-production-3d", "Production 3D experience"]
  ]},
  { part: "Part 12 — Professional Practice", items: [
    ["71-git-teams", "Git workflows, code review & monorepos"],
    ["72-cicd-deploy", "CI/CD, Docker, cloud & edge deployment"],
    ["73-observability", "Observability, monitoring & analytics"],
    ["74-ai-apps", "Building AI features into web apps"],
    ["75-clean-code", "Clean code, refactoring & documentation"],
    ["76-frontend-system-design", "Frontend system design"],
    ["77-career", "Career: portfolio, interviews, freelancing"],
    ["78-source-reading", "Reading source code & open source"],
    ["79-mastery-review", "Mastery review & self-assessment"],
    ["80-final-capstone", "Final capstone"]
  ]}
];
