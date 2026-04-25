// gemini-chat.js — Drop this file into your Cardly project
// Then add <script src="gemini-chat.js"></script> before </body> in index.html

(function () {
  const API_KEY = "AIzaSyA4SU13VlNrG6HM3IeYa-LiFpSe7kIKVEE";
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

  // ── Inject styles ──────────────────────────────────────────────────────────
  const style = document.createElement("style");
  style.textContent = `
    #gc-toggle {
      position: fixed;
      top: 16px;
      left: 16px;
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: var(--card, #132b4a);
      border: 1px solid var(--border, #27466e);
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      box-shadow: 0 4px 14px rgba(0,0,0,0.35);
      transition: transform 0.18s ease, background 0.18s ease;
      overflow: hidden;
    }
    #gc-toggle:hover {
      background: var(--card-hover, #18365b);
      transform: scale(1.08);
    }
    #gc-toggle img {
      width: 38px;
      height: 38px;
      object-fit: contain;
      display: block;
      border-radius: 8px;
      pointer-events: none;
    }
    #gc-toggle.is-open img { display: none; }
    #gc-toggle.is-open::after {
      content: "✕";
      font-size: 20px;
      color: var(--accent, #6bb3ff);
    }

    #gc-window {
      position: fixed;
      top: 68px;
      left: 16px;
      width: 320px;
      max-height: 480px;
      display: flex;
      flex-direction: column;
      background: var(--bg, #0b1c32);
      border: 1px solid var(--border, #27466e);
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
      z-index: 9998;
      opacity: 0;
      transform: translateY(-8px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.2s ease, transform 0.2s ease;
    }
    #gc-window.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    #gc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: var(--card, #132b4a);
      border-bottom: 1px solid var(--border, #27466e);
      flex-shrink: 0;
    }
    #gc-header-label {
      font-size: 13px;
      font-weight: 700;
      color: var(--accent, #6bb3ff);
      letter-spacing: 0.4px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    #gc-header-label span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #4ade80;
      display: inline-block;
      box-shadow: 0 0 6px #4ade80;
    }
    #gc-clear {
      font-size: 11px;
      color: var(--muted, #9cb4d6);
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 8px;
      transition: background 0.15s;
    }
    #gc-clear:hover {
      background: var(--card-hover, #18365b);
      color: var(--text, #fff);
    }

    #gc-messages {
      flex: 1;
      overflow-y: auto;
      padding: 14px 14px 8px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      scroll-behavior: smooth;
    }
    #gc-messages::-webkit-scrollbar { width: 4px; }
    #gc-messages::-webkit-scrollbar-track { background: transparent; }
    #gc-messages::-webkit-scrollbar-thumb { background: var(--border, #27466e); border-radius: 4px; }

    .gc-msg {
      max-width: 85%;
      padding: 9px 13px;
      border-radius: 14px;
      font-size: 13.5px;
      line-height: 1.5;
      word-break: break-word;
    }
    .gc-msg.user {
      align-self: flex-end;
      background: var(--accent, #6bb3ff);
      color: #0b1c32;
      font-weight: 600;
      border-bottom-right-radius: 4px;
    }
    .gc-msg.ai {
      align-self: flex-start;
      background: var(--card, #132b4a);
      color: var(--text, #fff);
      border: 1px solid var(--border, #27466e);
      border-bottom-left-radius: 4px;
    }
    .gc-msg.typing {
      display: flex;
      gap: 5px;
      align-items: center;
      padding: 12px 16px;
    }
    .gc-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--muted, #9cb4d6);
      animation: gc-bounce 1.2s ease infinite;
    }
    .gc-dot:nth-child(2) { animation-delay: 0.2s; }
    .gc-dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes gc-bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-5px); }
    }

    #gc-footer {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 12px;
      border-top: 1px solid var(--border, #27466e);
      background: var(--card, #132b4a);
      flex-shrink: 0;
    }
    #gc-input {
      flex: 1;
      background: var(--bg, #0b1c32);
      border: 1px solid var(--border, #27466e);
      border-radius: 10px;
      padding: 8px 12px;
      color: var(--text, #fff);
      font-size: 13px;
      outline: none;
      font-family: inherit;
      transition: border-color 0.15s;
      resize: none;
      height: 36px;
      line-height: 20px;
    }
    #gc-input:focus {
      border-color: var(--accent, #6bb3ff);
    }
    #gc-input::placeholder {
      color: var(--muted, #9cb4d6);
    }
    #gc-send {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--accent, #6bb3ff);
      border: none;
      color: #0b1c32;
      font-size: 15px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: opacity 0.15s, transform 0.15s;
    }
    #gc-send:hover { opacity: 0.88; transform: scale(1.05); }
    #gc-send:disabled { opacity: 0.4; cursor: default; transform: none; }
  `;
  document.head.appendChild(style);

  // ── Build DOM ──────────────────────────────────────────────────────────────
  const toggle = document.createElement("button");
  toggle.id = "gc-toggle";
  toggle.setAttribute("aria-label", "Open AI Chat");
  toggle.innerHTML = `<img src="assets/cardlyai.png" alt="Cardly AI" />`;

  const win = document.createElement("div");
  win.id = "gc-window";
  win.setAttribute("aria-label", "Gemini Chat");
  win.innerHTML = `
    <div id="gc-header">
      <div id="gc-header-label"><span></span>Gemini AI</div>
      <button id="gc-clear" title="Clear chat">Clear</button>
    </div>
    <div id="gc-messages"></div>
    <div id="gc-footer">
      <input id="gc-input" placeholder="Ask anything…" autocomplete="off" />
      <button id="gc-send" aria-label="Send">➤</button>
    </div>
  `;

  document.body.appendChild(toggle);
  document.body.appendChild(win);

  // ── State ──────────────────────────────────────────────────────────────────
  let open = false;
  let loading = false;
  let history = []; // { role, parts: [{ text }] }

  const messagesEl = win.querySelector("#gc-messages");
  const inputEl = win.querySelector("#gc-input");
  const sendBtn = win.querySelector("#gc-send");
  const clearBtn = win.querySelector("#gc-clear");

  // ── Toggle ─────────────────────────────────────────────────────────────────
  toggle.addEventListener("click", () => {
    open = !open;
    win.classList.toggle("open", open);
    toggle.classList.toggle("is-open", open);
    if (open) setTimeout(() => inputEl.focus(), 200);
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (open && !win.contains(e.target) && e.target !== toggle) {
      open = false;
      win.classList.remove("open");
      toggle.classList.remove("is-open");
    }
  });

  // ── Render message ─────────────────────────────────────────────────────────
  function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `gc-msg ${role}`;
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function showTyping() {
    const div = document.createElement("div");
    div.className = "gc-msg ai typing";
    div.id = "gc-typing";
    div.innerHTML = `<div class="gc-dot"></div><div class="gc-dot"></div><div class="gc-dot"></div>`;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    const t = document.getElementById("gc-typing");
    if (t) t.remove();
  }

  // ── Send ───────────────────────────────────────────────────────────────────
  async function send() {
    const text = inputEl.value.trim();
    if (!text || loading) return;

    inputEl.value = "";
    loading = true;
    sendBtn.disabled = true;

    addMessage("user", text);
    history.push({ role: "user", parts: [{ text }] });
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: history }),
      });

      const data = await res.json();
      removeTyping();

      if (data.error) throw new Error(data.error.message);

      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "No response.";
      history.push({ role: "model", parts: [{ text: reply }] });
      addMessage("ai", reply);
    } catch (err) {
      removeTyping();
      addMessage("ai", `Error: ${err.message}`);
    } finally {
      loading = false;
      sendBtn.disabled = false;
      inputEl.focus();
    }
  }

  sendBtn.addEventListener("click", send);
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });

  // ── Clear ──────────────────────────────────────────────────────────────────
  clearBtn.addEventListener("click", () => {
    history = [];
    messagesEl.innerHTML = "";
  });
})();
