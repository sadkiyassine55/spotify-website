const keyInput = document.getElementById("key");
const emailInput = document.getElementById("email");
const msg = document.getElementById("msg");

document.getElementById("redeemForm").addEventListener("submit", async (e) => {
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

    const data = await r.json();
    msg.textContent = data.ok ? "✅ Redeem successful" : `❌ ${data.msg}`;
  } catch {
    msg.textContent = "❌ Server not reachable";
  }
});