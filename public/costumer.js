const API = "http://localhost:3000";

const keyInput = document.getElementById("keyInput");
const emailInput = document.getElementById("emailInput");
const redeemBtn = document.getElementById("redeemBtn");
const msg = document.getElementById("msg");

redeemBtn.addEventListener("click", async () => {
  msg.textContent = "Loading...";

  const key = keyInput.value.trim();
  const email = emailInput.value.trim();

  try {
    const r = await fetch(`${API}/api/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, email })
    });

    const data = await r.json();
    msg.textContent = data.ok ? "✅ Redeem successful" : `❌ ${data.msg}`;
  } catch {
    msg.textContent = "❌ Server not reachable";
  }
});