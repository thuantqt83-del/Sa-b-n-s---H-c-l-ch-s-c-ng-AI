/* Biểu tượng AI 3D (vẽ bằng SVG, có khối nổi, bóng đổ và ánh kim) dùng cho mọi chỗ nói về "AI" */
(function () {
  'use strict';
  const SBS = window.SBS;

  const AI_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs>
<linearGradient id="h" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f1f8ff"/><stop offset=".45" stop-color="#8fb8ff"/><stop offset="1" stop-color="#3452d1"/></linearGradient>
<linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14367a"/><stop offset="1" stop-color="#06122e"/></linearGradient>
<radialGradient id="e" cx=".38" cy=".33" r=".75"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="#7ff3ff"/><stop offset="1" stop-color="#0a9be6"/></radialGradient>
<radialGradient id="o" cx=".38" cy=".33" r=".8"><stop offset="0" stop-color="#fff9cc"/><stop offset=".5" stop-color="#ffd23f"/><stop offset="1" stop-color="#ef8400"/></radialGradient>
<linearGradient id="d" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7a98f5"/><stop offset="1" stop-color="#2a3fa8"/></linearGradient>
<filter id="ds" x="-25%" y="-25%" width="150%" height="160%"><feDropShadow dx="0" dy="2.2" stdDeviation="1.5" flood-color="#04112e" flood-opacity=".55"/></filter>
</defs>
<ellipse cx="32" cy="60" rx="18" ry="2.8" fill="#000" opacity=".28"/>
<rect x="30.6" y="6" width="2.8" height="9" rx="1.2" fill="url(#d)"/>
<circle cx="32" cy="6" r="4.2" fill="url(#o)"/><circle cx="30.7" cy="4.7" r="1.3" fill="#fff" opacity=".9"/>
<rect x="2.5" y="26" width="7.5" height="14" rx="3.2" fill="url(#d)" filter="url(#ds)"/>
<rect x="54" y="26" width="7.5" height="14" rx="3.2" fill="url(#d)" filter="url(#ds)"/>
<g filter="url(#ds)">
<rect x="8" y="14" width="48" height="41" rx="12.5" fill="url(#h)"/>
<path d="M9 42 Q9 54 22 54.2 H42 Q55 54 55 42 V47 Q55 55 43 55 H21 Q9 55 9 47Z" fill="#1d2f9c" opacity=".4"/>
<rect x="8.8" y="14.8" width="46.4" height="39.4" rx="11.8" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="1.3"/>
</g>
<rect x="13" y="19.5" width="38" height="26" rx="9" fill="url(#s)"/>
<rect x="13" y="19.5" width="38" height="26" rx="9" fill="none" stroke="#63a6ff" stroke-opacity=".6"/>
<path d="M16 23 Q32 17.5 48 23 L48 27.5 Q32 22 16 27.5Z" fill="#fff" opacity=".14"/>
<circle cx="24" cy="31.5" r="5.4" fill="url(#e)"/><circle cx="40" cy="31.5" r="5.4" fill="url(#e)"/>
<circle cx="22.3" cy="29.7" r="1.6" fill="#fff"/><circle cx="38.3" cy="29.7" r="1.6" fill="#fff"/>
<rect x="25" y="39.5" width="3.2" height="2.4" rx="1.1" fill="#7ff3ff"/><rect x="30.4" y="39.5" width="3.2" height="2.4" rx="1.1" fill="#7ff3ff"/><rect x="35.8" y="39.5" width="3.2" height="2.4" rx="1.1" fill="#7ff3ff"/>
<g filter="url(#ds)"><rect x="20.5" y="48" width="23" height="11.5" rx="5.7" fill="url(#o)"/><rect x="21.3" y="48.8" width="21.4" height="9.9" rx="5" fill="none" stroke="#fff" stroke-opacity=".6"/>
<text x="32" y="57" text-anchor="middle" font-family="Arial Black,Arial,sans-serif" font-weight="900" font-size="9.5" fill="#5a2d00">AI</text></g>
</svg>`;

  const uri = 'data:image/svg+xml;utf8,' + encodeURIComponent(AI_SVG);
  SBS.icons = { ai: AI_SVG, aiUri: uri };
  /* phần tử ảnh biểu tượng AI 3D, cỡ px */
  SBS.aiIcon = (px) => { const i = new Image(); i.src = uri; i.alt = 'AI'; i.className = 'ai3d'; i.width = i.height = px || 24; i.draggable = false; return i; };
})();
