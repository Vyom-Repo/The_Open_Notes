/**
 * Clean Reading Notes Controller
 * Handles Theme Cycling, Font Scaling, Collapsible Left Sidebar, Accordions & Mid PYQ Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeCycle();
  initFontSizeControls();
  initSidebarControls();
  initLightbox();
});

/* Theme Cycling: Paper -> White -> Dark */
function initThemeCycle() {
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['mode-paper', 'mode-white', 'mode-dark'];
  
  // Load saved preference or default to paper
  const savedTheme = localStorage.getItem('notes-theme') || 'mode-paper';
  document.body.className = savedTheme;

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      let currentIndex = themes.findIndex(t => document.body.classList.contains(t));
      if (currentIndex === -1) currentIndex = 0;
      
      const nextIndex = (currentIndex + 1) % themes.length;
      const newTheme = themes[nextIndex];

      document.body.className = newTheme;
      localStorage.setItem('notes-theme', newTheme);
    });
  }
}

/* Font Size Resizing (A- / A+) */
function initFontSizeControls() {
  const incBtn = document.getElementById('fontIncBtn');
  const decBtn = document.getElementById('fontDecBtn');
  let currentSize = parseFloat(localStorage.getItem('notes-fontsize')) || 16.5;

  applyFontSize(currentSize);

  if (incBtn) {
    incBtn.addEventListener('click', () => {
      if (currentSize < 24) {
        currentSize += 1;
        applyFontSize(currentSize);
      }
    });
  }

  if (decBtn) {
    decBtn.addEventListener('click', () => {
      if (currentSize > 13) {
        currentSize -= 1;
        applyFontSize(currentSize);
      }
    });
  }

  function applyFontSize(size) {
    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
    localStorage.setItem('notes-fontsize', size);
  }
}

/* Collapsible Left Sidebar & Accordions */
function initSidebarControls() {
  const sidebar = document.getElementById('notesSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const toggleBtn = document.getElementById('sidebarToggle');
  const floatBtn = document.getElementById('floatingMenuBtn');
  const closeBtn = document.getElementById('sidebarCloseBtn');

  function openSidebar() {
    if (sidebar) sidebar.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = window.innerWidth <= 768 ? 'hidden' : '';
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleSidebar() {
    if (sidebar && sidebar.classList.contains('open')) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
  if (floatBtn) floatBtn.addEventListener('click', openSidebar);
  if (closeBtn) closeBtn.addEventListener('click', closeSidebar);
  if (backdrop) backdrop.addEventListener('click', closeSidebar);

  // Close sidebar on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSidebar();
      closeLightbox();
    }
  });

  // Accordion Expand/Collapse
  const accordionTriggers = document.querySelectorAll('.accordion-trigger:not([disabled])');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const parentAccordion = trigger.closest('.sidebar-accordion');
      const content = parentAccordion.querySelector('.accordion-content');
      
      const isOpen = parentAccordion.classList.contains('active');
      if (isOpen) {
        parentAccordion.classList.remove('active');
        content.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        parentAccordion.classList.add('active');
        content.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Auto-close sidebar on mobile when navigating to an anchor link
  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeSidebar();
      }
    });
  });
}

/* Lightbox Modal for Question Papers */
function initLightbox() {
  const modal = document.getElementById('imageLightbox');
  const body = document.getElementById('lightboxBody');
  const zoomBtn = document.getElementById('lightboxZoomToggle');
  const zoomIcon = document.getElementById('lightboxZoomIcon');
  const zoomText = document.getElementById('lightboxZoomText');
  if (!modal) return;

  function updateZoomUI(isZoomed) {
    if (zoomIcon) {
      zoomIcon.className = isZoomed ? 'fa-solid fa-compress' : 'fa-solid fa-magnifying-glass-plus';
    }
    if (zoomText) {
      zoomText.textContent = isZoomed ? 'Fit Screen' : 'Zoom 100%';
    }
  }

  window.openLightbox = function(imgSrc, title) {
    const imgEl = document.getElementById('lightboxImg');
    const titleEl = document.getElementById('lightboxTitle');
    const newTabBtn = document.getElementById('lightboxNewTabBtn');

    if (imgEl) imgEl.src = imgSrc;
    if (titleEl) titleEl.textContent = title || 'Question Paper Viewer';
    if (newTabBtn) newTabBtn.href = imgSrc;

    // Always reset to fit-screen mode so nothing is cut off
    if (body) {
      body.classList.remove('zoomed');
      body.scrollTop = 0;
    }
    updateZoomUI(false);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  window.toggleLightboxZoom = function() {
    if (!body) return;
    const isNowZoomed = body.classList.toggle('zoomed');
    updateZoomUI(isNowZoomed);
  };
}


/* --------------------------------------------------------------------------
   Chapter 3: Interactive Visual Widgets & Simulations
   -------------------------------------------------------------------------- */

let trinityClickCount = 0;
window.handleTrinityClick = function() {
  trinityClickCount++;
  const heading = document.getElementById("demoTrinityHeading");
  const countBadge = document.getElementById("demoTrinityCount");
  const colors = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];
  const randomColor = colors[trinityClickCount % colors.length];

  if (heading) {
    heading.textContent = `Button Clicked ${trinityClickCount} Time${trinityClickCount > 1 ? 's' : ''}!`;
    heading.style.color = randomColor;
  }
  if (countBadge) {
    countBadge.textContent = `Clicks: ${trinityClickCount}`;
  }
};

let currentDynamicStep = 0;
window.inspectDynamicType = function() {
  currentDynamicStep++;
  const out = document.getElementById("dynamicTypeOutput");
  if (!out) return;

  if (currentDynamicStep % 2 === 1) {
    out.innerHTML = `data = 100 &rarr; <span style="color:#38bdf8;">typeof = "number"</span>`;
  } else {
    out.innerHTML = `data = "JavaScript" &rarr; <span style="color:#4ade80;">typeof = "string"</span>`;
  }
};

window.execConsolePreset = function(type) {
  const screen = document.getElementById("simulatedConsoleScreen");
  if (!screen) return;

  let promptText = "";
  let outHtml = "";

  switch (type) {
    case 'str':
      promptText = 'console.log("Hello JS");';
      outHtml = '<span class="term-output val-str">"Hello JS"</span>';
      break;
    case 'math':
      promptText = 'console.log(10 + 20);';
      outHtml = '<span class="term-output val-num">30</span>';
      break;
    case 'typeNum':
      promptText = 'typeof 100;';
      outHtml = '<span class="term-output val-str">"number"</span>';
      break;
    case 'typeStr':
      promptText = 'typeof "JavaScript";';
      outHtml = '<span class="term-output val-str">"string"</span>';
      break;
    case 'warn':
      promptText = 'console.warn("Memory consumption elevated.");';
      outHtml = '<span class="term-output val-warn">&#9888; Warning: Memory consumption elevated.</span>';
      break;
    case 'err':
      promptText = 'console.error("404: Resource endpoint missing");';
      outHtml = '<span class="term-output val-err">&#10006; Uncaught Error: 404: Resource endpoint missing</span>';
      break;
    case 'obj':
      promptText = 'console.table([{ id: 1, role: "Admin" }, { id: 2, role: "Student" }]);';
      outHtml = `<div style="overflow-x:auto; margin-top:4px;">
        <table style="border-collapse:collapse; font-size:0.75rem; color:#e4e4e7; width:100%;">
          <tr style="border-bottom:1px solid #3f3f46;"><th style="padding:2px 8px; text-align:left;">(index)</th><th style="padding:2px 8px; text-align:left;">id</th><th style="padding:2px 8px; text-align:left;">role</th></tr>
          <tr style="border-bottom:1px solid #27272a;"><td style="padding:2px 8px; color:#a1a1aa;">0</td><td style="padding:2px 8px; color:#38bdf8;">1</td><td style="padding:2px 8px; color:#4ade80;">"Admin"</td></tr>
          <tr><td style="padding:2px 8px; color:#a1a1aa;">1</td><td style="padding:2px 8px; color:#38bdf8;">2</td><td style="padding:2px 8px; color:#4ade80;">"Student"</td></tr>
        </table>
      </div>`;
      break;
  }

  const line = document.createElement("div");
  line.className = "term-line";
  line.style.flexDirection = "column";
  line.style.gap = "2px";
  line.innerHTML = `<div style="display:flex; gap:0.5rem;"><span class="term-prompt">&gt;</span> <span style="color:#e4e4e7;">${promptText}</span></div>
                    <div style="padding-left:1.15rem;">${outHtml}</div>`;
  screen.appendChild(line);
  screen.scrollTop = screen.scrollHeight;
};

window.clearSimulatedConsole = function() {
  const screen = document.getElementById("simulatedConsoleScreen");
  if (screen) {
    screen.innerHTML = `<div class="term-line"><span class="term-prompt">&gt;</span> <span class="term-output val-str">"Console cleared."</span></div>`;
  }
};

window.runValidationDemo = function() {
  const userInp = document.getElementById("demoUser");
  const msgBox = document.getElementById("demoMsg");
  if (!userInp || !msgBox) return;

  if (userInp.value.trim() === "") {
    msgBox.textContent = "✖ Validation Error: Username cannot be blank!";
    msgBox.style.color = "#ef4444";
  } else {
    msgBox.textContent = `✔ Success: Welcome, ${userInp.value.trim()}! Input valid.`;
    msgBox.style.color = "#10b981";
  }
};

let labMsgToggled = false;
window.toggleLiveLab = function() {
  const heading = document.getElementById("liveLabHeading");
  const btn = document.getElementById("liveLabBtn");
  if (!heading || !btn) return;

  labMsgToggled = !labMsgToggled;
  if (labMsgToggled) {
    heading.textContent = "JavaScript Is Running Successfully!";
    heading.style.color = "#10b981";
    btn.textContent = "Reset Message";
    btn.style.background = "#475569";
  } else {
    heading.textContent = "Welcome to Web Development";
    heading.style.color = "var(--text-primary)";
    btn.textContent = "Change Message";
    btn.style.background = "#0284c7";
  }
};

let isElRunning = false;
window.playEventLoopSimulation = function() {
  if (isElRunning) return;
  isElRunning = true;

  const stack = document.getElementById("stackItems");
  const webApis = document.getElementById("webApiItems");
  const queue = document.getElementById("queueItems");
  const output = document.getElementById("elOutputItems");

  if (!stack || !webApis || !queue || !output) return;

  stack.innerHTML = "";
  webApis.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Idle</div>';
  queue.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Queue Empty</div>';
  output.innerHTML = "";

  // Step 1: Push console.log("A")
  setTimeout(() => {
    stack.innerHTML = '<div class="el-item-box" style="border-color:#3b82f6;">log("A")</div>';
  }, 400);

  // Step 2: Exec log("A") -> Output "A"
  setTimeout(() => {
    stack.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Stack Empty</div>';
    output.innerHTML += '<div style="color:#10b981;">&gt; A</div>';
  }, 1100);

  // Step 3: Push setTimeout
  setTimeout(() => {
    stack.innerHTML = '<div class="el-item-box" style="border-color:#8b5cf6;">setTimeout(cb, 0)</div>';
  }, 1800);

  // Step 4: Move to Web APIs & pop from stack
  setTimeout(() => {
    stack.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Stack Empty</div>';
    webApis.innerHTML = '<div class="el-item-box" style="border-color:#8b5cf6;">Timer 0ms (cb)</div>';
  }, 2500);

  // Step 5: Push console.log("C")
  setTimeout(() => {
    stack.innerHTML = '<div class="el-item-box" style="border-color:#3b82f6;">log("C")</div>';
    webApis.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Timer Expired</div>';
    queue.innerHTML = '<div class="el-item-box" style="border-color:#10b981;">cb: log("B")</div>';
  }, 3200);

  // Step 6: Exec log("C") -> Output "C"
  setTimeout(() => {
    stack.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Stack Empty</div>';
    output.innerHTML += '<div style="color:#10b981;">&gt; C</div>';
  }, 4000);

  // Step 7: Event Loop moves cb to Stack
  setTimeout(() => {
    queue.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Queue Empty</div>';
    stack.innerHTML = '<div class="el-item-box" style="border-color:#f59e0b;">log("B")</div>';
  }, 4800);

  // Step 8: Exec log("B") -> Output "B"
  setTimeout(() => {
    stack.innerHTML = '<div style="font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 1.5rem;">Stack Empty</div>';
    output.innerHTML += '<div style="color:#10b981;">&gt; B</div>';
    output.innerHTML += '<div style="color:#38bdf8; font-size:0.75rem; margin-top:4px;">&#10003; Done! Order: A &rarr; C &rarr; B</div>';
    isElRunning = false;
  }, 5600);
};


/* --------------------------------------------------------------------------
   Chapter 3 Topic 2: Variables & Data Types Interactive Widgets
   -------------------------------------------------------------------------- */

window.evaluateTypeValue = function(sampleKey) {
  const resultBox = document.getElementById("typeEvaluatorResult");
  if (!resultBox) return;

  let val, valStr, typeStr, isTruthy, numVal;

  switch (sampleKey) {
    case 'emptyStr':
      val = ""; valStr = '"" (Empty String)'; typeStr = "string"; isTruthy = false; numVal = 0;
      break;
    case 'strZero':
      val = "0"; valStr = '"0" (String with zero)'; typeStr = "string"; isTruthy = true; numVal = 0;
      break;
    case 'zero':
      val = 0; valStr = '0 (Number Zero)'; typeStr = "number"; isTruthy = false; numVal = 0;
      break;
    case 'emptyArr':
      val = []; valStr = '[] (Empty Array)'; typeStr = "object"; isTruthy = true; numVal = 0;
      break;
    case 'emptyObj':
      val = {}; valStr = '{} (Empty Object)'; typeStr = "object"; isTruthy = true; numVal = NaN;
      break;
    case 'nullVal':
      val = null; valStr = 'null'; typeStr = "object (historical quirk)"; isTruthy = false; numVal = 0;
      break;
    case 'undefVal':
      val = undefined; valStr = 'undefined'; typeStr = "undefined"; isTruthy = false; numVal = NaN;
      break;
    case 'nanVal':
      val = NaN; valStr = 'NaN (Not-a-Number)'; typeStr = "number"; isTruthy = false; numVal = NaN;
      break;
    case 'floatAdd':
      val = 0.1 + 0.2; valStr = '0.1 + 0.2'; typeStr = "number"; isTruthy = true; numVal = 0.1 + 0.2;
      break;
  }

  const truthBadge = isTruthy 
    ? '<span style="background:rgba(16,185,129,0.15); color:#10b981; border:1px solid #10b981; padding:2px 8px; border-radius:4px; font-weight:700;">TRUTHY (true)</span>'
    : '<span style="background:rgba(239,68,68,0.15); color:#ef4444; border:1px solid #ef4444; padding:2px 8px; border-radius:4px; font-weight:700;">FALSY (false)</span>';

  resultBox.innerHTML = `
    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; font-family:'Courier New', Courier, monospace; font-size:0.85rem;">
      <div style="background:var(--sheet-bg); padding:0.5rem 0.75rem; border:1px solid var(--box-note-border); border-radius:6px;">
        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Tested Expression:</span>
        <strong style="color:#d97706;">${valStr}</strong>
      </div>
      <div style="background:var(--sheet-bg); padding:0.5rem 0.75rem; border:1px solid var(--box-note-border); border-radius:6px;">
        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">typeof result:</span>
        <strong style="color:#38bdf8;">"${typeStr}"</strong>
      </div>
      <div style="background:var(--sheet-bg); padding:0.5rem 0.75rem; border:1px solid var(--box-note-border); border-radius:6px;">
        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Boolean Context:</span>
        ${truthBadge}
      </div>
      <div style="background:var(--sheet-bg); padding:0.5rem 0.75rem; border:1px solid var(--box-note-border); border-radius:6px;">
        <span style="color:var(--text-muted); font-size:0.75rem; display:block;">Number() Coercion:</span>
        <strong style="color:#8b5cf6;">${numVal}</strong>
      </div>
    </div>
  `;
};

window.testScopeBehavior = function(keyword) {
  const out = document.getElementById("scopeBehaviorOutput");
  if (!out) return;

  if (keyword === 'var') {
    out.innerHTML = `
      <div style="color:#10b981; font-weight:700; margin-bottom:4px;">&gt; Output: undefined</div>
      <div style="color:var(--text-secondary); font-size:0.8rem;">Explanation: <code>var</code> is hoisted to the top of its enclosing function scope and initialized to <code>undefined</code>. No error is thrown.</div>
    `;
  } else if (keyword === 'let') {
    out.innerHTML = `
      <div style="color:#ef4444; font-weight:700; margin-bottom:4px;">&gt; Uncaught ReferenceError: Cannot access 'x' before initialization</div>
      <div style="color:var(--text-secondary); font-size:0.8rem;">Explanation: <code>let</code> is hoisted but resides in the <strong>Temporal Dead Zone (TDZ)</strong> until its declaration statement is evaluated. Accessing it prior to declaration throws a ReferenceError.</div>
    `;
  } else if (keyword === 'const') {
    out.innerHTML = `
      <div style="color:#ef4444; font-weight:700; margin-bottom:4px;">&gt; Uncaught ReferenceError: Cannot access 'PI' before initialization</div>
      <div style="color:var(--text-secondary); font-size:0.8rem;">Explanation: <code>const</code> also resides in the <strong>Temporal Dead Zone (TDZ)</strong> and must be initialized on the line of declaration.</div>
    `;
  }
};
