import React from "react";
import { Play, Download, RotateCcw, Zap } from "lucide-react";

export default function EditorPanel({
  active,
  setActive,
  html,
  css,
  js,
  setHtml,
  setCss,
  setJs,
  autoRun,
  setAutoRun,
  runPreview,
  resetCode,
  downloadFile,
}) {
  return (
    <div className="editor-panel-adv">
      
      {/* Toolbar */}
      <div className="toolbar-adv">
        <button className="icon-btn" onClick={runPreview} title="Run (Ctrl+Enter)">
          <Play size={18} />
        </button>

        <label className="icon-btn" title="Auto Run">
          <input
            type="checkbox"
            checked={autoRun}
            onChange={(e) => setAutoRun(e.target.checked)}
          />
          <Zap size={18} />
        </label>

        <button className="icon-btn" onClick={downloadFile} title="Download Output">
          <Download size={18} />
        </button>

        <button className="icon-btn" onClick={resetCode} title="Reset Code">
          <RotateCcw size={18} />
        </button>
      </div>

      {/* File Tabs */}
      <div className="tabs-adv">
        <button
          className={`tab-btn ${active === "html" ? "active" : ""}`}
          onClick={() => setActive("html")}
        >
          index.html
        </button>

        <button
          className={`tab-btn ${active === "css" ? "active" : ""}`}
          onClick={() => setActive("css")}
        >
          style.css
        </button>

        <button
          className={`tab-btn ${active === "js" ? "active" : ""}`}
          onClick={() => setActive("js")}
        >
          script.js
        </button>
      </div>

      {/* Editor */}
      <div className="editor-wrapper">
        {active === "html" && (
          <textarea
            className="adv-textarea"
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
        )}

        {active === "css" && (
          <textarea
            className="adv-textarea"
            value={css}
            onChange={(e) => setCss(e.target.value)}
          />
        )}

        {active === "js" && (
          <textarea
            className="adv-textarea"
            value={js}
            onChange={(e) => setJs(e.target.value)}
          />
        )}
      </div>
    </div>
  );
}
