// Course index: single source of truth for navigation.
window.COURSE = [
  { part: "Part 0 — Setup", items: [
    ["00-setup", "Lesson 0", "Setup & how the web works"],
    ["ide-tools", "Guide", "Recommended IDEs, extensions & tools"]
  ]},
  { part: "Part 1 — HTML", items: [
    ["01-html-text", "Lesson 1", "Document structure & text"],
    ["02-html-media-semantics", "Lesson 2", "Links, images, media & semantic layout"],
    ["03-html-forms-a11y", "Lesson 3", "Forms, tables & accessibility"]
  ]},
  { part: "Part 2 — CSS", items: [
    ["04-css-selectors", "Lesson 4", "Selectors, cascade & specificity"],
    ["05-css-box-typography", "Lesson 5", "Box model, units, color & typography"],
    ["06-css-flexbox", "Lesson 6", "Flexbox"],
    ["07-css-grid", "Lesson 7", "Grid"],
    ["08-css-responsive", "Lesson 8", "Positioning, responsive design & variables"],
    ["09-css-motion", "Lesson 9", "Transforms, transitions, animations & modern CSS"],
    ["p1-portfolio", "Project 1", "Responsive portfolio"]
  ]},
  { part: "Part 3 — JavaScript", items: [
    ["10-js-values", "Lesson 10", "Values, variables & types"],
    ["11-js-control-flow", "Lesson 11", "Operators & control flow"],
    ["12-js-functions", "Lesson 12", "Functions, scope & closures"],
    ["13-js-arrays-objects", "Lesson 13", "Arrays & objects"],
    ["14-js-dom", "Lesson 14", "The DOM"],
    ["15-js-events", "Lesson 15", "Events"],
    ["16-js-modern", "Lesson 16", "Modern JS: destructuring, spread, modules"],
    ["17-js-async", "Lesson 17", "Async: promises, fetch, async/await"],
    ["18-js-classes", "Lesson 18", "Classes, this & prototypes"],
    ["19-js-tooling", "Lesson 19", "Errors, debugging, storage & tooling"],
    ["20-js-iterators", "Lesson 20", "Iterators, generators, Map/Set, functional patterns"],
    ["21-js-testing-ts", "Lesson 21", "Testing & TypeScript primer"],
    ["p2-vanilla-app", "Project 2", "Weather & todo app (vanilla JS)"]
  ]},
  { part: "Part 4 — React", items: [
    ["22-react-intro", "Lesson 22", "Why React, Vite & JSX"],
    ["23-react-props", "Lesson 23", "Components & props"],
    ["24-react-state", "Lesson 24", "State & events"],
    ["25-react-lists-forms", "Lesson 25", "Lists, conditionals & forms"],
    ["26-react-effects", "Lesson 26", "Effects & data fetching"],
    ["27-react-hooks", "Lesson 27", "Refs, reducers, memoization & custom hooks"],
    ["28-react-context", "Lesson 28", "Context & global state"],
    ["29-react-routing", "Lesson 29", "Routing & app architecture"],
    ["30-react-performance", "Lesson 30", "Performance, patterns & testing"],
    ["p3-react-app", "Project 3", "Full React app"]
  ]},
  { part: "Part 5 — Three.js", items: [
    ["31-three-basics", "Lesson 31", "Scene, camera, renderer"],
    ["32-three-materials", "Lesson 32", "Geometry, materials & lights"],
    ["33-three-animation", "Lesson 33", "Animation loop, transforms & controls"],
    ["34-three-models", "Lesson 34", "Textures, glTF models & environment"],
    ["35-three-raycasting", "Lesson 35", "Interaction: raycasting"],
    ["36-three-shaders", "Lesson 36", "Shaders (GLSL)"],
    ["37-three-r3f", "Lesson 37", "React Three Fiber & drei"],
    ["38-three-physics-post", "Lesson 38", "Physics, particles & post-processing"],
    ["39-three-deploy", "Lesson 39", "Performance, deployment & production"],
    ["p4-three-scene", "Project 4", "Interactive 3D scene"],
    ["40-capstone", "Lesson 40", "Milestone: mini-capstone"]
  ]}  ,
  { part: "Part 6 — Professional CSS & the Platform", items: [
    ["41-css-architecture", "Lesson 41", "CSS architecture: BEM, layers, modules"],
    ["42-tailwind", "Lesson 42", "Tailwind CSS & utility-first design"],
    ["43-css-advanced", "Lesson 43", "Container queries, anchor positioning, view transitions"],
    ["44-a11y-deep", "Lesson 44", "Accessibility deep dive"],
    ["45-web-vitals", "Lesson 45", "SEO, performance & Core Web Vitals"],
    ["46-svg-canvas", "Lesson 46", "SVG & Canvas 2D graphics"]
  ]},
  { part: "Part 7 — Advanced JavaScript & TypeScript", items: [
    ["47-ts-fundamentals", "Lesson 47", "TypeScript in depth"],
    ["48-ts-advanced", "Lesson 48", "Advanced types: generics, mapped, conditional"],
    ["49-js-runtime", "Lesson 49", "Runtime internals: memory, GC, event loop, profiling"],
    ["50-js-patterns", "Lesson 50", "Design patterns in JavaScript"],
    ["51-algorithms", "Lesson 51", "Data structures & algorithms for web devs"],
    ["52-web-apis", "Lesson 52", "Workers, service workers, IndexedDB & PWAs"],
    ["53-security", "Lesson 53", "Web security: XSS, CSRF, CSP, auth"]
  ]},
  { part: "Part 8 — Backend & Full-Stack", items: [
    ["54-node-apis", "Lesson 54", "Node.js & building HTTP APIs"],
    ["55-databases-sql", "Lesson 55", "Databases & SQL"],
    ["56-api-design-auth", "Lesson 56", "API design, validation & authentication"],
    ["57-nextjs", "Lesson 57", "Next.js: SSR, SSG & Server Components"],
    ["58-fullstack-data", "Lesson 58", "Full-stack data: ORMs, Server Actions, caching"],
    ["59-realtime", "Lesson 59", "Real-time: WebSockets & multiplayer state"],
    ["p5-fullstack", "Project 5", "Production full-stack app"]
  ]},
  { part: "Part 9 — Advanced React", items: [
    ["60-react19", "Lesson 60", "React 19: Server Components, actions, Suspense"],
    ["61-react-architecture", "Lesson 61", "Advanced state & architecture"],
    ["62-design-systems", "Lesson 62", "Design systems & component libraries"],
    ["63-react-delivery", "Lesson 63", "Testing pyramid, E2E & quality gates"]
  ]},
  { part: "Part 10 — Advanced 3D & Graphics", items: [
    ["64-r3f-architecture", "Lesson 64", "Advanced R3F architecture"],
    ["65-procedural", "Lesson 65", "Procedural generation, noise & terrain"],
    ["66-shaders-advanced", "Lesson 66", "Advanced shaders: SDFs, raymarching, GPGPU"],
    ["67-webgpu-tsl", "Lesson 67", "WebGPU & TSL"],
    ["68-3d-pipeline", "Lesson 68", "The 3D asset pipeline: Blender to web"],
    ["69-game-architecture", "Lesson 69", "Game architecture: loops, ECS, character control"],
    ["70-webxr-audio", "Lesson 70", "WebXR, spatial audio & 3D UX"],
    ["p6-production-3d", "Project 6", "Production 3D experience"]
  ]},
  { part: "Part 11 — Professional Practice", items: [
    ["71-git-teams", "Lesson 71", "Git workflows, code review & monorepos"],
    ["72-cicd-deploy", "Lesson 72", "CI/CD, Docker, cloud & edge deployment"],
    ["73-observability", "Lesson 73", "Observability, monitoring & analytics"],
    ["74-ai-apps", "Lesson 74", "Building AI features into web apps"],
    ["75-clean-code", "Lesson 75", "Clean code, refactoring & documentation"],
    ["76-frontend-system-design", "Lesson 76", "Frontend system design"],
    ["77-career", "Lesson 77", "Career: portfolio, interviews, freelancing"],
    ["78-source-reading", "Lesson 78", "Reading source code & open source"],
    ["79-mastery-review", "Lesson 79", "Mastery review & self-assessment"],
    ["80-final-capstone", "Lesson 80", "Final capstone"]
  ]}
];
