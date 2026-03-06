// public/costumer.js

const form = document.getElementById("redeemForm");
const keyInput = document.getElementById("key");
const emailInput = document.getElementById("email");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  msg.textContent = "Loading...";

  const key = keyInput.value.trim();
  const email = emailInput.value.trim();

  try {
    const r = await fetch("/api/redeem", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, email })
    });

    const data = await r.json().catch(() => ({}));
    msg.textContent = r.ok && data.ok ? "✅ Redeem successful" : `❌ ${data.msg || "Error"}`;
  } catch (err) {
    msg.textContent = "❌ Server not reachable";
  }
});