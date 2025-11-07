console.log("✅ content.js loaded");

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SHOW_SUMMARY") {
    showSummaryCard(message.summary);
  }
});

function showSummaryCard(summary) {
  // Remove old overlay
  const old = document.getElementById("ai-summary-overlay");
  if (old) old.remove();

  // Create grey background layer
  const backdrop = document.createElement("div");
  backdrop.style = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.3);
    z-index: 999998;
  `;
  backdrop.id = "ai-summary-backdrop";
  backdrop.addEventListener("click", () => {
    backdrop.remove();
    overlay.remove();
  });

  // Create white centered card
  const overlay = document.createElement("div");
  overlay.id = "ai-summary-overlay";
  overlay.style = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border: 1px solid #ddd;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    z-index: 999999;
    width: 350px;
    font-family: system-ui, sans-serif;
  `;
  overlay.innerHTML = `
    <b>AI Summary 🧠</b><br><br>
    <div style="max-height: 300px; overflow-y: auto;">${summary}</div>
    <br>
    <button id="close-ai-summary" style="
      background: #ef4444;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
    ">Close</button>
  `;

  document.body.append(backdrop, overlay);
  document.getElementById("close-ai-summary").onclick = () => {
    backdrop.remove();
    overlay.remove();
  };
}

