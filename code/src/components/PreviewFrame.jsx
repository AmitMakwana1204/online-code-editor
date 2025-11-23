import React, { useState } from "react";
import { RefreshCcw, ExternalLink, Smartphone, Tablet, Monitor } from "lucide-react";

export default function PreviewFrame({ iframeRef, runPreview }) {
  const [device, setDevice] = useState("pc");

  const getWidth = () => {
    if (device === "mobile") return "375px";
    if (device === "tablet") return "768px";
    return "100%";
  };

  return (
    <div className="preview-adv">

      {/* Toolbar */}
      <div className="preview-toolbar">
        <button className="pbtn" title="Refresh Preview" onClick={runPreview}>
          <RefreshCcw size={18} />
        </button>

        <button
          className="pbtn"
          title="Open in new tab"
          onClick={() => {
            if (!iframeRef.current) return;
            const blob = new Blob([iframeRef.current.srcdoc], { type: "text/html" });
            const url = URL.createObjectURL(blob);
            window.open(url, "_blank");
          }}
        >
          <ExternalLink size={18} />
        </button>

        <div className="device-btns">
          <button className={`dBtn ${device === "pc" ? "active" : ""}`} onClick={() => setDevice("pc")}>
            <Monitor size={16} />
          </button>
          <button className={`dBtn ${device === "tablet" ? "active" : ""}`} onClick={() => setDevice("tablet")}>
            <Tablet size={16} />
          </button>
          <button className={`dBtn ${device === "mobile" ? "active" : ""}`} onClick={() => setDevice("mobile")}>
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      {/* FRAME */}
      <div className="frame-container" style={{ width: getWidth() }}>
        <iframe
          ref={iframeRef}
          title="preview"
          className="frame"
          sandbox="allow-scripts allow-same-origin"
        ></iframe>
      </div>
    </div>
  );
}
