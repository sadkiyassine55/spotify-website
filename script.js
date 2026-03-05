// Helpers
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

// Nav wiring
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
    <div class="page-header">
      <h1>Dashboard</h1>
      <div class="header-actions"><i class="fas fa-calendar-alt"></i> 3/2/2026</div>
    </div>

    <div class="metric-grid">
      <div class="metric-card">
        <div class="metric-title"><i class="fas fa-key"></i> Total Keys</div>
        <div class="metric-number">11</div>
      </div>
      <div class="metric-card">
        <div class="metric-title"><i class="fas fa-check-circle" style="color:#1db954;"></i> Active Keys</div>
        <div class="metric-number">0</div>
      </div>
      <div class="metric-card">
        <div class="metric-title"><i class="fas fa-box"></i> Stock Available</div>
        <div class="metric-number">11</div>
      </div>
      <div class="metric-card">
        <div class="metric-title"><i class="fas fa-layer-group"></i> Unused Keys</div>
        <div class="metric-number">11</div>
      </div>
    </div>

    <div class="recent-activity">
      <h3><i class="fas fa-history"></i> Recent Activity</h3>
      <table>
        <tr><th>Action</th><th>Key</th><th>Email</th><th>Time</th></tr>
        <tr><td>Keys Generated</td><td>1 keys generated</td><td>-</td><td>3/2/2026, 12:45:04 AM</td></tr>
        <tr><td>Keys Generated</td><td>10 keys generated</td><td>-</td><td>3/2/2026, 12:36:47 AM</td></tr>
      </table>
    </div>

    <div style="display:flex; justify-content:space-between; color:#99b2e6; margin-top:2rem;">
      <span><i class="fas fa-cog"></i> Settings</span>
      <span><i class="fas fa-sign-out-alt"></i> Logout</span>
    </div>
  `;
}

function getGenerateHTML() {
  return `
    <div class="page-header"><h1>Generate Keys</h1></div>

    <div class="gen-panel">
      <h3 style="color:white; margin-bottom:1.8rem;">
        <i class="fas fa-plus-circle" style="color:#1db954;"></i> New Key Batch
      </h3>

      <div class="gen-options">
        <div class="gen-left">
          <div class="field">
            <label>Quantity</label>
            <input type="number" value="10" id="keyQty" />
          </div>

          <div class="field">
            <label>Reusable</label>
            <div class="radio-group">
              <label><input type="radio" name="reusable" value="no" checked /> No</label>
              <label><input type="radio" name="reusable" value="yes" /> Yes</label>
            </div>
          </div>

          <div class="field">
            <label>Expiry Date (Optional)</label>
            <input type="text" placeholder="mm/dd/yyyy --:-- --" />
          </div>

          <button class="btn-primary" id="btnGenerate">
            <i class="fas fa-cog"></i> Generate
          </button>
        </div>

        <div class="gen-right">
          <h4 style="color:white; margin-bottom:1rem;">Generated Keys</h4>
          <p style="color:#a0bcf0;">Generated keys will appear here</p>
          <div id="generatedKeysPreview" style="background:#0d1a2a; border-radius:1rem; padding:1rem; margin-top:1rem; color:#b0d0ff;"></div>
        </div>
      </div>
    </div>

    <div style="color:#99b2e6;">
      <i class="fas fa-cog"></i> Settings
      <i class="fas fa-sign-out-alt" style="margin-left:2rem;"></i> Logout
    </div>
  `;
}

function getStockHTML() {
  return `
    <div class="page-header"><h1>Manage Stock</h1></div>

    <div class="stock-stats">
      <div class="stat-item"><h4>Total Keys</h4><span class="stat-number">11</span></div>
      <div class="stat-item"><h4>Available Keys</h4><span class="stat-number">11</span></div>
      <div class="stat-item"><h4>Available Invite Links</h4><span class="stat-number">0</span></div>
      <div class="stat-item"><h4>Assigned Links</h4><span class="stat-number">0</span></div>
    </div>

    <div style="background:#111d33; border-radius:2rem; padding:2rem; margin-bottom:2rem;">
      <h4 style="color:white;">Stock Usage</h4>
      <div class="usage-bar"><div class="usage-fill" style="width:0%;"></div></div>
      <p style="color:#a7c2ff;">0% of keys are in use.</p>
    </div>

    <div class="invite-section">
      <h4 style="color:white;"><i class="fas fa-link"></i> Add Spotify Invite Links</h4>
      <p style="color:#b0c6f0;">
        Paste your Spotify Family invite links below (one per line). When a client redeems a key, they will automatically receive an invite link.
      </p>

      <textarea class="invite-textarea" rows="4" id="inviteLinks">
https://www.spotify.com/family/join/invite/xxxxx
https://www.spotify.com/family/join/invite/yyyyy
https://www.spotify.com/family/join/invite/zzzz
      </textarea>

      <button class="btn-primary" style="margin:1rem 0;" id="btnAddLinks">
        <i class="fas fa-plus"></i> Add Invite Links
      </button>

      <h4 style="color:white; margin-top:2rem;">Invite Links (5) — from screenshot 85</h4>
      <table class="link-table">
        <tr><th>Link</th><th>Status</th><th>Assigned To</th><th>Key</th><th>Actions</th></tr>
        <tr><td>https://www.spotify.com/tn-fr/family/join/invite/Zxbz9247...</td><td><span class="badge" style="background:#1d4e2d;">AVAILABLE</span></td><td>-</td><td>-</td><td>-</td></tr>
        <tr><td>https://www.spotify.com/tn-fr/family/join/invite/Zxbz9247...</td><td><span class="badge" style="background:#1d4e2d;">AVAILABLE</span></td><td>-</td><td>-</td><td>-</td></tr>
        <tr><td>https://www.spotify.com/tn-fr/family/join/invite/Zxbz9247...</td><td><span class="badge" style="background:#1d4e2d;">AVAILABLE</span></td><td>-</td><td>-</td><td>-</td></tr>
      </table>
    </div>

    <div style="margin-top:2rem; color:#99b2e6;">Settings · Logout · SWDY 2.12.1</div>
  `;
}

function getUnbindHTML() {
  return `
    <div class="page-header"><h1>Unbind Requests</h1></div>

    <div class="empty-state">
      <i class="fas fa-inbox fa-3x" style="margin-bottom:1rem;"></i>
      <h3>All Requests</h3>
      <table style="margin-top:1rem;">
        <tr><th>Key</th><th>Email</th><th>Reason</th><th>Status</th><th>Date</th><th>Actions</th></tr>
        <tr><td colspan="6" style="text-align:center;">No unbind requests</td></tr>
      </table>
    </div>

    <div style="margin-top:2rem; color:#99b2e6;">Settings · Logout</div>
  `;
}

function getAllKeysHTML() {
  return `
    <div class="page-header"><h1>All Keys</h1></div>

    <div style="background:#111d33; border-radius:2rem; padding:1.8rem;">
      <table>
        <tr>
          <th>Key</th><th>Status</th><th>Bound Email</th><th>Invite Link</th>
          <th>Created</th><th>Redeemed</th><th>Actions</th>
        </tr>
        ${keyRows()}
      </table>

      <div style="margin-top:2rem; display:flex; justify-content:space-between;">
        <span><i class="fas fa-download"></i> Export CSV</span>
        <span><i class="fas fa-cog"></i> Settings <i class="fas fa-sign-out-alt" style="margin-left:1.5rem;"></i> Logout</span>
      </div>
    </div>
  `;
}

function keyRows() {
  const keys = [
    "SpotifyHub-9E9XA16X","SpotifyHub-DLH1D75E","SpotifyHub-9QCV-92JE","SpotifyHub-IB3A-I03B",
    "SpotifyHub-7W2R-IR3V","SpotifyHub-T3YE-QY25","SpotifyHub-U8JB-YAK8","SpotifyHub-WXHU-BF47",
    "SpotifyHub-HSXW-9KV1","SpotifyHub-AB2A-4BQA"
  ];

  return keys.map((k) => `
    <tr>
      <td>${k}</td>
      <td><span class="badge unused-badge">UNUSED</span></td>
      <td>-</td>
      <td>-</td>
      <td>3/2/2026</td>
      <td>-</td>
      <td><i class="fas fa-lock lock-icon"></i></td>
    </tr>
  `).join("");
}

/* ---------------- Page Events ---------------- */

function wireGenerateEvents() {
  const btn = document.getElementById("btnGenerate");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const qty = Number(document.getElementById("keyQty")?.value || 10);
    const preview = document.getElementById("generatedKeysPreview");

    if (preview) {
      let html = "<strong>new keys (demo):</strong><br>";
      for (let i = 0; i < Math.min(5, qty); i++) html += `SpotifyHub-XXXX${i}<br>`;
      if (qty > 5) html += "...";
      preview.innerHTML = html;
    }

    alert(`Simulated generation of ${qty} keys. In production: insert into DB.`);
  });
}

function wireStockEvents() {
  const btnAdd = document.getElementById("btnAddLinks");
  if (!btnAdd) return;

  btnAdd.addEventListener("click", () => {
    // In real app: send invite links to backend / DB
    alert("Links would be added to DB");
  });
}

/* ---------------- Boot ---------------- */

window.addEventListener("DOMContentLoaded", () => {
  wireNav();
  showSection("dashboard");
});