import { useState } from "react";
import axios from "axios";

const App = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");

  const summarize = async () => {
    if (!text) return alert("Please enter something first!");

    try {
      const res = await axios.post("http://localhost:3000/api/summarize", {
        text,
      });
      const result = res.data.summary;
      setSummary(result);

      // Send message to content.js to show overlay
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs.length) {
          console.error("❌ No active tab found!");
          return;
        }
        
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: "SHOW_SUMMARY", summary: res.data.summary },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "❌ Could not send message:",
                chrome.runtime.lastError.message
              );
            } else {
              console.log("✅ Message sent to content script!");
            }
          }
        );
      });

    } catch (err) {
      console.error(err);
      alert("Error connecting to the server!");
    }
  };

  return (
    <div className="w-[320px] p-3 font-sans">
      <h3 className="font-bold text-lg">AI Clipboard Summarizer</h3>

      <textarea
        placeholder="Paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-24 mt-2 border border-gray-300 rounded p-2 text-sm"
      />

      <button
        onClick={summarize}
        className="w-full mt-3 bg-amber-300 hover:bg-amber-400 p-2 rounded font-bold"
      >
        Summarize
      </button>

      {summary && (
        <div className="mt-3 text-sm bg-gray-50 border border-gray-200 rounded p-2">
          <b>Summary:</b>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
};

export default App;
