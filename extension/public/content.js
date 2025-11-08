console.log("content.js loaded");

// check for text copying
document.addEventListener("copy", async () => {
  const copiedText = window.getSelection().toString().trim();

  if (copiedText.length > 0) {
    console.log("Copied text detected:", copiedText);
    // Save to Chrome storage
    chrome.storage.local.set({ lastCopied: copiedText });
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "SHOW_SUMMARY") {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "999999";

    const card = document.createElement("div");
    card.style.background = "white";
    card.style.padding = "20px";
    card.style.borderRadius = "12px";
    card.style.width = "400px";
    card.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
    card.style.maxHeight = "80%";
    card.style.overflowY = "auto";

    const title = document.createElement("h3");
    title.innerText = "AI Summary 😉🐲";
    title.style.marginBottom = "10px";

    // format the api response
    const formatted = message.summary
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => `<li>${line.replace(/^[-•\s]+/, "")}</li>`)
      .join("");

    const list = document.createElement("ul");
    list.innerHTML = formatted;
    list.style.marginBottom = "16px";
    list.style.lineHeight = "1.6";
    list.style.color = "black";
    list.style.fontSize = "16px";
    list.style.fontWeight = "500";
    list.style.fontFamily = "sans-serif";

    const close = document.createElement("button");
    close.innerText = "Close";
    close.style.background = "#ef4444";
    close.style.color = "white";
    close.style.border = "none";
    close.style.padding = "6px 12px";
    close.style.borderRadius = "6px";
    close.style.cursor = "pointer";
    close.onclick = () => overlay.remove();

    card.appendChild(title);
    card.appendChild(list);
    card.appendChild(close);
    overlay.appendChild(card);
    document.body.appendChild(overlay);
  }
});
