const mainContent = document.getElementById("mainContent");

function setActive(linkEl) {
  document.querySelectorAll(".nav .nav-link").forEach((a) => a.classList.remove("active"));
  linkEl.classList.add("active");
}

function showSection(section) {
  if (!mainContent) return;

  switch (section) {
    case "dashboard":
      mainContent.innerHTML = getDashboardHTML();
      break;
    case "generate":
      mainContent.innerHTML = getGenerateHTML();
      wireGenerateEvents();
      wireToggleButtons();
      break;
    case "stock":
      mainContent.innerHTML = getStockHTML();
      wireStockEvents();
      break;
    case "unbind":
      mainContent.innerHTML = getUnbindHTML();
      break;
    case "allkeys":
      mainContent.innerHTML = getAllKeysHTML();
      break;
    default:
      mainContent.innerHTML = getDashboardHTML();
  }
}

function wireNav() {
  document.querySelectorAll(".nav .nav-link").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      setActive(link);
      showSection(link.dataset.section);
    });
  });
}

/* ---------------- Templates ---------------- */

function getDashboardHTML() {
  return `
    <section class="page-section">
      <div class="page-head-row">
        <h1 class="page-title">Dashboard</h1>
        <button class="btn btn-ghost btn-sm">
          <i class="fas fa-calendar-alt"></i> 3/2/2026
        </button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div>
            <p class="stat-label">Total Keys</p>
            <h2 class="stat-value">11</h2>
          </div>
          <div class="stat-icon blue"><i class="fas fa-lock"></i></div>
        </div>

        <div class="stat-card">
          <div>
            <p class="stat-label">Active Keys</p>
            <h2 class="stat-value">0</h2>
          </div>
          <div class="stat-icon green"><i class="fas fa-check-circle"></i></div>
        </div>

        <div class="stat-card">
          <div>
            <p class="stat-label">Stock Available</p>
            <h2 class="stat-value">11</h2>
          </div>
          <div class="stat-icon purple"><i class="fas fa-box"></i></div>
        </div>

        <div class="stat-card">
          <div>
            <p class="stat-label">Unused Keys</p>
            <h2 class="stat-value">11</h2>
          </div>
          <div class="stat-icon orange"><i class="fas fa-key"></i></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Recent Activity</h3>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Key</th>
                <th>Email</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Keys Generated</td>
                <td>1 keys generated</td>
                <td>-</td>
                <td>3/2/2026 12:45:04 AM</td>
              </tr>
              <tr>
                <td>Keys Generated</td>
                <td>10 keys generated</td>
                <td>-</td>
                <td>3/2/2026 12:36:47 AM</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function getGenerateHTML() {
  return `
    <section class="page-section">
      <h1 class="page-title">Generate Keys</h1>

      <div class="two-col-grid">
        <div class="panel">
          <div class="panel-header">
            <h3>New Key Batch</h3>
          </div>

          <div class="form-group">
            <label>Quantity</label>
            <input type="number" value="10" id="keyQty" class="input" min="1" />
          </div>

          <div class="form-group">
            <label>Reusable</label>
            <div class="toggle-group" id="reusableGroup">
              <button type="button" class="toggle-btn active" data-value="no">No</button>
              <button type="button" class="toggle-btn" data-value="yes">Yes</button>
            </div>
          </div>

          <div class="form-group">
            <label>Expiry Date (Optional)</label>
            <input type="datetime-local" class="input" />
          </div>

          <button class="btn btn-primary btn-full" id="btnGenerate">
            Generate 10 Keys
          </button>
        </div>

        <div class="panel">
          <div class="panel-header">
            <h3>Generated Keys</h3>
          </div>

          <div id="generatedKeysPreview" class="empty-preview">
            Generated keys will appear here
          </div>
        </div>
      </div>
    </section>
  `;
}

function getStockHTML() {
  return `
    <section class="page-section">
      <div class="page-head-row">
        <h1 class="page-title">Manage Stock</h1>
        <button class="btn btn-ghost"><i class="fas fa-sync-alt"></i> Refresh</button>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div>
            <p class="stat-label">Total Keys</p>
            <h2 class="stat-value">11</h2>
          </div>
          <div class="stat-icon blue"><i class="fas fa-lock"></i></div>
        </div>

        <div class="stat-card">
          <div>
            <p class="stat-label">Available Keys</p>
            <h2 class="stat-value">11</h2>
          </div>
          <div class="stat-icon green"><i class="fas fa-key"></i></div>
        </div>

        <div class="stat-card">
          <div>
            <p class="stat-label">Available Invite Links</p>
            <h2 class="stat-value">0</h2>
          </div>
          <div class="stat-icon purple"><i class="fas fa-link"></i></div>
        </div>

        <div class="stat-card">
          <div>
            <p class="stat-label">Assigned Links</p>
            <h2 class="stat-value">0</h2>
          </div>
          <div class="stat-icon orange"><i class="fas fa-circle"></i></div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Stock Usage</h3>
        </div>

        <div class="usage-bar">
          <div class="usage-fill" style="width:0%;"></div>
        </div>

        <p class="muted">0% of keys are in use.</p>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Add Spotify Invite Links</h3>
        </div>

        <p class="muted">
          Paste your Spotify Family invite links below (one per line). When a client redeems a key, they will automatically receive an invite link.
        </p>

        <textarea class="input textarea" rows="5" id="inviteLinks" placeholder="https://www.spotify.com/family/join/invite/xxxx"></textarea>

        <button class="btn btn-primary" id="btnAddLinks">
          <i class="fas fa-plus"></i> Add Invite Links
        </button>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>Invite Links (5)</h3>
          <button class="btn btn-ghost btn-sm">Hide</button>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Link</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th>Key</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${inviteRows()}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function getUnbindHTML() {
  return `
    <section class="page-section">
      <h1 class="page-title">Unbind Requests</h1>

      <div class="panel">
        <div class="panel-header">
          <button class="btn btn-ghost btn-sm">All Requests</button>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="6" class="centered-cell">No unbind requests</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function getAllKeysHTML() {
  return `
    <section class="page-section">
      <div class="page-head-row">
        <h1 class="page-title">All Keys</h1>
        <button class="btn btn-primary btn-sm"><i class="fas fa-download"></i> Export CSV</button>
      </div>

      <div class="panel">
        <div class="table-toolbar">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search by key or email" />
          </div>

          <select class="input filter-select">
            <option>All Status</option>
            <option>Unused</option>
            <option>Binding</option>
            <option>Reusable</option>
          </select>
        </div>

        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>Status</th>
                <th>Bound Email</th>
                <th>Invite Link</th>
                <th>Created</th>
                <th>Redeemed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${keyRows()}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}

function inviteRows() {
  const links = new Array(5).fill("https://www.spotify.com/tn-fr/family/join/invite/Zxbz924720B00C/");
  return links.map((link) => `
    <tr>
      <td class="link-cell">${link}</td>
      <td><span class="badge badge-available">AVAILABLE</span></td>
      <td>-</td>
      <td>-</td>
      <td><i class="fas fa-trash action-icon danger"></i></td>
    </tr>
  `).join("");
}

function keyRows() {
  const keys = [
    "SpotifyHub-69GX-A16X",
    "SpotifyHub-DLH1-D75E",
    "SpotifyHub-9QCV-92JE",
    "SpotifyHub-IB3A-I03B",
    "SpotifyHub-7W2R-IR3V",
    "SpotifyHub-T3YE-QY25",
    "SpotifyHub-U8JB-YAK8",
    "SpotifyHub-WXHU-BF47",
    "SpotifyHub-V8VR-T08E",
    "SpotifyHub-HSXW-9KV1",
    "SpotifyHub-AB2A-4BQA"
  ];

  return keys.map((k) => `
    <tr>
      <td class="key-text">${k}</td>
      <td><span class="badge badge-unused">UNUSED</span></td>
      <td>-</td>
      <td>-</td>
      <td>3/2/2026</td>
      <td>-</td>
      <td><i class="fas fa-trash action-icon danger"></i></td>
    </tr>
  `).join("");
}

/* ---------------- Events ---------------- */

function wireGenerateEvents() {
  const btn = document.getElementById("btnGenerate");
  const qtyInput = document.getElementById("keyQty");

  if (qtyInput && btn) {
    const syncBtnText = () => {
      const qty = Number(qtyInput.value || 10);
      btn.textContent = `Generate ${qty} Keys`;
    };

    qtyInput.addEventListener("input", syncBtnText);
    syncBtnText();
  }

  if (!btn) return;

  btn.addEventListener("click", () => {
    const qty = Number(document.getElementById("keyQty")?.value || 10);
    const preview = document.getElementById("generatedKeysPreview");

    if (preview) {
      let html = "";
      for (let i = 1; i <= Math.min(qty, 10); i++) {
        html += `<div class="generated-key-item">SpotifyHub-${randomPart()}-${randomPart()}</div>`;
      }
      preview.innerHTML = html || "No keys generated";
    }

    alert(`Simulated generation of ${qty} keys. Later this should connect to DB.`);
  });
}

function wireToggleButtons() {
  const group = document.getElementById("reusableGroup");
  if (!group) return;

  group.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      group.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function wireStockEvents() {
  const btnAdd = document.getElementById("btnAddLinks");
  if (!btnAdd) return;

  btnAdd.addEventListener("click", () => {
    alert("Links would be added to DB");
  });
}

function randomPart() {
  return Math.random().toString(36).substring(2, 6).toUpperCase();
}

/* ---------------- Boot ---------------- */

window.addEventListener("DOMContentLoaded", () => {
  wireNav();
  showSection("dashboard");
});