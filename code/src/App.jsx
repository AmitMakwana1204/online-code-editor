import React, { useEffect, useRef, useState } from "react";
import EditorPanel from "./components/EditorPanel";
import PreviewFrame from "./components/PreviewFrame";
import { buildPreview } from "./utils/buildPreview";
import { Base64 } from "js-base64";

export default function App() {
  // Default values
  const DEFAULT_HTML = `<div id="app">Hello World</div>`;
  const DEFAULT_CSS = `body{ font-family: sans-serif; padding:20px; }`;
  const DEFAULT_JS = `document.getElementById('app').style.color = "blue";`;

  // State
  const [html, setHtml] = useState(localStorage.getItem("html") || DEFAULT_HTML);
  const [css, setCss] = useState(localStorage.getItem("css") || DEFAULT_CSS);
  const [js, setJs] = useState(localStorage.getItem("js") || DEFAULT_JS);
  const [autoRun, setAutoRun] = useState(true);
  const [active, setActive] = useState("html");
  const [theme, setTheme] = useState("dark");
  const [consoleLogs, setConsoleLogs] = useState([]);

  const iframeRef = useRef(null);
  const timeoutRef = useRef(null);

  // Listen to iframe console messages
  useEffect(() => {
    const listener = (event) => {
      if (event.data?.type === "console") {
        setConsoleLogs((prev) => [...prev, event.data.message]);
      }
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, []);

  // Autosave
  useEffect(() => localStorage.setItem("html", html), [html]);
  useEffect(() => localStorage.setItem("css", css), [css]);
  useEffect(() => localStorage.setItem("js", js), [js]);

  // Preview Execution
  const runPreview = () => {
    const output = buildPreview(html, css, js);

    if (iframeRef.current) {
      iframeRef.current.srcdoc = output;
    }

    // Clear console on new run
    setConsoleLogs([]);
  };

  // Auto-run Debounce
  useEffect(() => {
    if (autoRun) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => runPreview(), 350);
    }
  }, [html, css, js]);

  useEffect(() => runPreview(), []);

  // Reset code
  const resetCode = () => {
    setHtml(DEFAULT_HTML);
    setCss(DEFAULT_CSS);
    setJs(DEFAULT_JS);
    setConsoleLogs([]);
  };

  // Download as HTML file
  const downloadFile = () => {
    const code = buildPreview(html, css, js);
    const blob = new Blob([code], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "index.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 🔗 Generate Shareable URL
  const getShareLink = () => {
    const data = Base64.encode(JSON.stringify({ html, css, js }));
    const link = `${window.location.origin}#${data}`;
    navigator.clipboard.writeText(link);
    alert("Shareable link copied!");
  };

  // 📥 Load code from URL (if exists)
  useEffect(() => {
    if (window.location.hash.length > 5) {
      try {
        const data = JSON.parse(Base64.decode(window.location.hash.slice(1)));
        setHtml(data.html);
        setCss(data.css);
        setJs(data.js);
      } catch (err) {
        console.error("Invalid shared link.");
      }
    }
  }, []);

  return (
    <div className={`app-container ${theme}`}>
      
      {/* HEADER BAR */}
      <div className="topbar">
        <h2>⚡ Online Code Editor</h2>

        <button className="top-btn" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
          Theme: {theme === "dark" ? "🌙 Dark" : "🌞 Light"}
        </button>

        <button className="top-btn" onClick={getShareLink}>🔗 Share</button>
      </div>

      <div className="layout">
        
        {/* LEFT SIDE: Editor */}
        <EditorPanel
          active={active}
          setActive={setActive}
          html={html}
          css={css}
          js={js}
          setHtml={setHtml}
          setCss={setCss}
          setJs={setJs}
          autoRun={autoRun}
          setAutoRun={setAutoRun}
          runPreview={runPreview}
          resetCode={resetCode}
          downloadFile={downloadFile}
        />

        {/* CENTER: Preview */}
        <PreviewFrame iframeRef={iframeRef} runPreview={runPreview} />

      </div>

      {/* BOTTOM CONSOLE PANEL */}
      <div className="console-panel">
        <h3>Console</h3>
        <div className="console-output">
          {consoleLogs.length === 0 && <p className="empty-console">No logs yet...</p>}

          {consoleLogs.map((log, i) => (
            <pre key={i}>{log}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}
