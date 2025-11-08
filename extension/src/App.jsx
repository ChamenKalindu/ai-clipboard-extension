import { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

const App = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Load the last copied text when popup opens
  useEffect(() => {
    chrome.storage.local.get("lastCopied", (result) => {
      console.log("Retrieved from storage:", result);
      if (result.lastCopied) {
        setText(result.lastCopied);
      }
    });
  }, []);

  const summarize = async () => {
    if (!text) return alert("Please enter something first!");

    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/summarize", {
        text,
      });
      const result = res.data.summary;
      setSummary(result);

      console.log(summary);
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
    setIsLoading(false);
  };

  return (
    <div className="w-[340px] p-4 font-sans rounded-2xl bg-white/70 backdrop-blur-md shadow-lg border border-white/40">
      <h3 className="font-bold text-xl text-center font-serif text-gray-800 mb-3">
        ✨ AI Clipboard Summarizer
      </h3>

      <textarea
        autoFocus
        placeholder="Paste text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-28 mt-1 resize-none rounded-2xl border border-gray-200 bg-white/80 p-3 text-sm text-gray-800 shadow-inner placeholder:text-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-300/40 focus:outline-none transition-all duration-200 hover:shadow-md"
      />

      {!isLoading && (
        <button
          onClick={summarize}
          className="w-full mt-4 bg-gradient-to-r from-amber-300 to-yellow-400 hover:from-amber-400 hover:to-yellow-500 text-gray-900 font-semibold py-2.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg active:scale-[0.98]"
        >
          Summarize
        </button>
      )}

      {isLoading && (
        <div className="inline-flex gap-1 mt-4 rounded-full px-4 py-3 bg-amber-100 shadow-sm w-fit mx-auto">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse delay-150"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse delay-300"></div>
        </div>
      )}

      {summary && (
        <div className="mt-4 text-sm bg-gray-50 border border-gray-200 rounded-2xl p-3 shadow-inner max-h-40 overflow-y-auto transition-all duration-200">
          <h4 className="font-semibold text-gray-700 mb-1">Summary:</h4>
          <ReactMarkdown className="text-gray-800 leading-relaxed">
            {summary}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default App;
