const API = "http://localhost:3000";

// حط user/pass متاع admin (مبدئيا)
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin123";

function authHeader() {
  const token = btoa(`${ADMIN_USER}:${ADMIN_PASS}`);
  return { Authorization: `Basic ${token}` };
}

window.generateKeys = async function () {
  const qty = Number(document.getElementById("keyQty")?.value || 10);
  const reusable = document.querySelector("input[name='reusable']:checked")?.value === "yes";

  const preview = document.getElementById("generatedKeysPreview");
  preview.innerHTML = "Generating...";

  const r = await fetch(`${API}/api/admin/keys/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeader()
    },
    body: JSON.stringify({ qty, reusable })
  });

  const data = await r.json();
  if (!data.ok) {
    preview.innerHTML = `❌ ${data.msg}`;
    return;
  }

  preview.innerHTML = data.keys.slice(0, 20).map(k => `${k}<br>`).join("") + (data.keys.length > 20 ? "..." : "");
  alert(`✅ Generated ${data.keys.length} keys (saved in DB)`);
};

window.loadAllKeysFromDB = async function () {
  const r = await fetch(`${API}/api/admin/keys`, { headers: { ...authHeader() } });
  const data = await r.json();
  if (!data.ok) return alert("Failed to load keys");

  // اعمل table rows ديناميكي
  return data.rows.map(row => `
    <tr>
      <td>${row.key_code}</td>
      <td>${row.status}</td>
      <td>${row.bound_email || "-"}</td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
      <td>${row.redeemed_at ? new Date(row.redeemed_at).toLocaleString() : "-"}</td>
      <td><i class="fas fa-lock lock-icon"></i></td>
    </tr>
  `).join("");
};
function getAllKeysHTML() {
  return `
    <div class="page-header"><h1>All Keys</h1></div>
    <div style="background:#111d33; border-radius:2rem; padding:1.8rem;">
      <table>
        <tr><th>Key</th><th>Status</th><th>Bound Email</th><th>Created</th><th>Redeemed</th><th>Actions</th></tr>
        <tbody id="keysBody"><tr><td colspan="6">Loading...</td></tr></tbody>
      </table>
    </div>
  `;
}

// بعد showSection('allkeys') نعمل load:
async function showSection(section) {
  const content = document.getElementById('mainContent');
  if (section === 'allkeys') {
    content.innerHTML = getAllKeysHTML();
    const rows = await loadAllKeysFromDB();
    document.getElementById("keysBody").innerHTML = rows || `<tr><td colspan="6">No keys</td></tr>`;
    return;
  }
}