const state = {
  sessions: [],
  activeSessionId: null,
  activeSession: null,
  mode: "agent",
  pendingAttachmentIds: [],
};

const sessionListEl = document.getElementById("sessionList");
const messagePaneEl = document.getElementById("messagePane");
const approvalListEl = document.getElementById("approvalList");
const uploadListEl = document.getElementById("uploadList");
const messageInputEl = document.getElementById("messageInput");
const fileInputEl = document.getElementById("fileInput");
const attachmentBarEl = document.getElementById("attachmentBar");
const healthBadgeEl = document.getElementById("healthBadge");
const modelInputEl = document.getElementById("modelInput");

const sessionTpl = document.getElementById("sessionItemTpl");
const msgTpl = document.getElementById("messageTpl");
const approvalTpl = document.getElementById("approvalTpl");

const fmt = (d) => new Date(d).toLocaleString("fa-IR");

async function api(path, options = {}) {
  const init = { ...options };
  if (!(init.body instanceof FormData)) {
    init.headers = { "Content-Type": "application/json", ...(init.headers || {}) };
  }

  const res = await fetch(path, init);
  const type = res.headers.get("content-type") || "";
  const body = type.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) {
    throw new Error(typeof body === "string" ? body : body.detail || JSON.stringify(body));
  }
  return body;
}

function renderSessions() {
  sessionListEl.innerHTML = "";
  for (const s of state.sessions) {
    const item = sessionTpl.content.firstElementChild.cloneNode(true);
    item.querySelector("strong").textContent = s.title;
    item.querySelector("small").textContent = `${s.message_count} پیام • ${fmt(s.updated_at)}`;
    if (s.id === state.activeSessionId) item.classList.add("active");
    item.onclick = () => loadSession(s.id);
    sessionListEl.appendChild(item);
  }
}

function renderMessages() {
  messagePaneEl.innerHTML = "";
  const session = state.activeSession;
  if (!session || !session.messages.length) {
    messagePaneEl.innerHTML = '<div class="empty-state">یک پیام بفرست تا گفتگو شروع شود.</div>';
    return;
  }

  for (const m of session.messages) {
    const node = msgTpl.content.firstElementChild.cloneNode(true);
    node.classList.add(m.role);
    node.querySelector(".msg-role").textContent = m.role === "user" ? "شما" : "دستیار";
    node.querySelector(".msg-content").textContent = m.content;

    const metaEl = node.querySelector(".msg-meta");
    if (m.attachments && m.attachments.length) {
      metaEl.textContent = `ضمیمه: ${m.attachments.map((a) => a.filename).join("، ")}`;
    }
    if (m.meta && m.meta.mode === "agent") {
      const status = m.meta.task_status || "-";
      metaEl.textContent = `Agent Mode • وضعیت: ${status}${m.meta.task_id ? ` • Task: ${m.meta.task_id}` : ""}`;
    }

    messagePaneEl.appendChild(node);
  }

  messagePaneEl.scrollTop = messagePaneEl.scrollHeight;
}

function renderAttachmentBar() {
  attachmentBarEl.innerHTML = "";
  if (!state.pendingAttachmentIds.length) return;
  for (const id of state.pendingAttachmentIds) {
    const chip = document.createElement("span");
    chip.className = "attachment-chip";
    chip.textContent = `ضمیمه آماده: ${id.slice(0, 8)}...`;
    attachmentBarEl.appendChild(chip);
  }
}

function renderUploads(files = []) {
  uploadListEl.innerHTML = "";
  if (!files.length) {
    uploadListEl.innerHTML = '<div class="upload-item">هنوز فایلی آپلود نشده است.</div>';
    return;
  }
  for (const f of files) {
    const row = document.createElement("div");
    row.className = "upload-item";
    row.innerHTML = `<div>${f.filename}</div><small>${Math.round((f.size || 0) / 1024)}KB</small> <a href="/uploads/${f.id}/download" target="_blank">دانلود</a>`;
    uploadListEl.appendChild(row);
  }
}

async function refreshApprovals() {
  const data = await api("/approvals/pending");
  approvalListEl.innerHTML = "";

  if (!data.approvals.length) {
    approvalListEl.innerHTML = '<div class="upload-item">تایید در انتظار نداریم.</div>';
    return;
  }

  for (const a of data.approvals) {
    const node = approvalTpl.content.firstElementChild.cloneNode(true);
    node.querySelector(".approval-title").textContent = `${a.tool_name} • ${a.id}`;
    node.querySelector(".approval-args").textContent = JSON.stringify(a.args, null, 2);

    node.querySelector(".btn-ok").onclick = async () => {
      await api(`/approvals/${a.id}`, { method: "POST", body: JSON.stringify({ decision: "approve" }) });
      await Promise.all([refreshApprovals(), refreshSessions()]);
      if (state.activeSessionId) await loadSession(state.activeSessionId);
    };

    node.querySelector(".btn-no").onclick = async () => {
      await api(`/approvals/${a.id}`, { method: "POST", body: JSON.stringify({ decision: "deny" }) });
      await Promise.all([refreshApprovals(), refreshSessions()]);
      if (state.activeSessionId) await loadSession(state.activeSessionId);
    };

    approvalListEl.appendChild(node);
  }
}

async function refreshHealth() {
  try {
    await api("/health");
    healthBadgeEl.className = "badge ok";
    healthBadgeEl.textContent = "آنلاین";
  } catch {
    healthBadgeEl.className = "badge off";
    healthBadgeEl.textContent = "آفلاین";
  }
}

async function refreshUploads() {
  const data = await api("/uploads");
  renderUploads(data.files || []);
}

async function refreshSessions() {
  const data = await api("/chat/sessions");
  state.sessions = data.sessions || [];
  renderSessions();
  if (!state.activeSessionId && state.sessions.length) {
    await loadSession(state.sessions[0].id);
  }
}

async function loadSession(sessionId) {
  const session = await api(`/chat/sessions/${sessionId}`);
  state.activeSessionId = session.id;
  state.activeSession = session;
  renderSessions();
  renderMessages();
}

async function ensureSession() {
  if (state.activeSessionId) return state.activeSessionId;
  const created = await api("/chat/sessions", { method: "POST", body: JSON.stringify({}) });
  await refreshSessions();
  await loadSession(created.id);
  return created.id;
}

async function sendMessage() {
  const content = messageInputEl.value.trim();
  if (!content) return;
  const sessionId = await ensureSession();

  const payload = {
    content,
    mode: state.mode,
    model: modelInputEl.value.trim() || "gpt-4.1",
    max_turns: 12,
    attachment_ids: state.pendingAttachmentIds,
  };

  document.getElementById("sendBtn").disabled = true;
  try {
    const res = await api(`/chat/sessions/${sessionId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    state.activeSession = res.session;
    messageInputEl.value = "";
    state.pendingAttachmentIds = [];
    renderAttachmentBar();
    renderMessages();
    await Promise.all([refreshSessions(), refreshApprovals()]);
  } catch (err) {
    alert(`خطا در ارسال پیام: ${err.message}`);
  } finally {
    document.getElementById("sendBtn").disabled = false;
  }
}

async function uploadSelectedFiles() {
  const files = Array.from(fileInputEl.files || []);
  if (!files.length) return;

  const form = new FormData();
  for (const f of files) form.append("files", f);

  try {
    const res = await api("/uploads", { method: "POST", body: form });
    for (const f of res.files || []) {
      state.pendingAttachmentIds.push(f.id);
    }
    renderAttachmentBar();
    await refreshUploads();
  } catch (err) {
    alert(`خطا در آپلود: ${err.message}`);
  }
}

document.getElementById("newChatBtn").onclick = async () => {
  const created = await api("/chat/sessions", { method: "POST", body: JSON.stringify({}) });
  await refreshSessions();
  await loadSession(created.id);
};

fileInputEl.onchange = uploadSelectedFiles;
document.getElementById("sendBtn").onclick = sendMessage;
messageInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});

for (const btn of document.querySelectorAll(".mode-btn")) {
  btn.onclick = () => {
    state.mode = btn.dataset.mode;
    for (const b of document.querySelectorAll(".mode-btn")) b.classList.remove("active");
    btn.classList.add("active");
  };
}

(async () => {
  await refreshHealth();
  await Promise.all([refreshSessions(), refreshApprovals(), refreshUploads()]);
  setInterval(async () => {
    await Promise.all([refreshHealth(), refreshApprovals(), refreshSessions()]);
    if (state.activeSessionId) {
      const active = state.sessions.find((x) => x.id === state.activeSessionId);
      if (active) await loadSession(state.activeSessionId);
    }
  }, 8000);
})();
