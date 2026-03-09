const taskListEl = document.getElementById("taskList");
const approvalListEl = document.getElementById("approvalList");
const createResultEl = document.getElementById("createResult");
const healthBadgeEl = document.getElementById("healthBadge");
const refreshBtn = document.getElementById("refreshBtn");
const mTotal = document.getElementById("mTotal");
const mPending = document.getElementById("mPending");
const mBlocked = document.getElementById("mBlocked");
const taskTpl = document.getElementById("taskItemTemplate");
const approvalTpl = document.getElementById("approvalItemTemplate");

const STATUS_LABELS = { completed:"تکمیل‌شده", awaiting_approval:"در انتظار تایید", blocked:"بلوکه", failed:"خطا", running:"در حال اجرا", max_turns_reached:"پایان سقف نوبت" };

const jsonDump = (v) => JSON.stringify(v, null, 2);
async function api(path, opts = {}) {
  const res = await fetch(path, { headers: { "Content-Type": "application/json" }, ...opts });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json") ? await res.json() : await res.text();
  if (!res.ok) throw new Error(typeof body === "string" ? body : body.detail || jsonDump(body));
  return body;
}
function statusBadge(el, status) { el.textContent = STATUS_LABELS[status] || status; el.className = `badge ${status}`; }

async function checkHealth(){ try{ await api("/health"); healthBadgeEl.textContent="آنلاین"; healthBadgeEl.className="badge online";}catch{healthBadgeEl.textContent="آفلاین"; healthBadgeEl.className="badge failed";}}

async function fetchAll(){
  const [tasksRes, approvalsRes] = await Promise.all([api("/tasks"), api("/approvals/pending")]);
  renderTasks(tasksRes.tasks || []); renderApprovals(approvalsRes.approvals || []);
  mTotal.textContent = String(tasksRes.count || 0); mPending.textContent = String(approvalsRes.count || 0);
  mBlocked.textContent = String((tasksRes.tasks || []).filter((t)=>t.status==="blocked").length);
}

function renderTasks(tasks){
  taskListEl.innerHTML="";
  if(!tasks.length){ taskListEl.innerHTML='<p class="prompt">هنوز تسکی ثبت نشده است.</p>'; return; }
  for(const task of tasks){
    const node = taskTpl.content.firstElementChild.cloneNode(true);
    node.querySelector("h3").textContent = task.id;
    statusBadge(node.querySelector(".badge"), task.status);
    node.querySelector(".prompt").textContent = task.prompt;
    node.querySelector(".output").textContent = task.output_text || "(هنوز خروجی ثبت نشده است)";
    const actions = node.querySelector(".actions");

    if(task.status === "awaiting_approval"){
      const info = document.createElement("button");
      info.className = "btn-ghost"; info.textContent = "نمایش تاییدها"; info.onclick = ()=>window.location.hash = "approvals";
      actions.appendChild(info);
    }
    if(!["completed","failed","blocked"].includes(task.status)){
      const resumeBtn = document.createElement("button");
      resumeBtn.className = "btn-primary"; resumeBtn.textContent = "ادامه اجرا";
      resumeBtn.onclick = async ()=>{ resumeBtn.disabled=true; try{ await api(`/tasks/${task.id}/resume`, {method:"POST"}); await fetchAll(); }catch(err){ alert(`ادامه اجرا ناموفق بود: ${err.message}`);} finally{ resumeBtn.disabled=false; } };
      actions.appendChild(resumeBtn);
    }
    taskListEl.appendChild(node);
  }
}

function renderApprovals(items){
  approvalListEl.innerHTML="";
  if(!items.length){ approvalListEl.innerHTML='<p class="prompt">در حال حاضر تایید حساسی نداریم.</p>'; return; }
  for(const approval of items){
    const node = approvalTpl.content.firstElementChild.cloneNode(true);
    node.querySelector("h3").textContent = `${approval.tool_name} • ${approval.id}`;
    node.querySelector("pre").textContent = jsonDump(approval.args);
    const approveBtn = node.querySelector(".btn-approve");
    const denyBtn = node.querySelector(".btn-deny");

    approveBtn.onclick = async ()=>{ approveBtn.disabled=true; try{ await api(`/approvals/${approval.id}`, { method:"POST", body: JSON.stringify({decision:"approve"}) }); await fetchAll(); }catch(err){ alert(`تایید ناموفق بود: ${err.message}`);} finally{ approveBtn.disabled=false; } };
    denyBtn.onclick = async ()=>{ denyBtn.disabled=true; try{ await api(`/approvals/${approval.id}`, { method:"POST", body: JSON.stringify({decision:"deny"}) }); await fetchAll(); }catch(err){ alert(`رد ناموفق بود: ${err.message}`);} finally{ denyBtn.disabled=false; } };

    approvalListEl.appendChild(node);
  }
}

document.getElementById("taskForm").addEventListener("submit", async (e)=>{
  e.preventDefault();
  const prompt = document.getElementById("prompt").value.trim();
  const model = document.getElementById("model").value.trim() || "gpt-4.1";
  const maxTurns = Number(document.getElementById("maxTurns").value || 12);
  if(!prompt){ alert("لطفاً متن درخواست را وارد کن."); return; }
  try{
    const created = await api("/tasks", { method:"POST", body: JSON.stringify({prompt, model, max_turns:maxTurns}) });
    createResultEl.textContent = jsonDump(created);
    await fetchAll();
  }catch(err){ createResultEl.textContent = `خطا: ${err.message}`; }
});

refreshBtn.addEventListener("click", fetchAll);
(async ()=>{ await checkHealth(); await fetchAll(); setInterval(fetchAll, 8000); })();
