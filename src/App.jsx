import { useState, useRef } from "react";

// ─── DESIGN TOKENS (Lead Virtual brand-aligned) ───────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Lead Virtual brand palette */
    --bg:        #F7F8FA;
    --surface:   #FFFFFF;
    --surface2:  #F2F4F7;
    --surface3:  #E8ECF0;
    --border:    #E2E6EB;
    --border2:   #CBD2DA;

    /* Text */
    --text:      #0F1923;
    --text2:     #4A5568;
    --text3:     #8A96A3;

    /* Brand — teal/blue-green matching Lead Virtual's palette */
    --brand:     #0EA5A0;
    --brand2:    #0BC4BE;
    --brand-bg:  rgba(14,165,160,0.08);
    --brand-border: rgba(14,165,160,0.2);

    /* Status */
    --green:     #16A34A;
    --green-bg:  rgba(22,163,74,0.08);
    --amber:     #D97706;
    --amber-bg:  rgba(217,119,6,0.08);
    --red:       #DC2626;
    --red-bg:    rgba(220,38,38,0.08);
    --blue:      #2563EB;
    --blue-bg:   rgba(37,99,235,0.08);

    --radius:    10px;
    --radius-sm: 7px;
    --sidebar-w: 232px;
    --font:      'Plus Jakarta Sans', sans-serif;
    --body-font: 'DM Sans', sans-serif;
    --mono:      'DM Mono', monospace;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
    --shadow:    0 4px 16px rgba(0,0,0,0.08);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.12);
  }

  body {
    font-family: var(--body-font);
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    overflow: hidden;
    -webkit-font-smoothing: antialiased;
  }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }

  /* ── LAYOUT ── */
  .app { display: flex; height: 100vh; overflow: hidden; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    flex-shrink: 0; position: relative; z-index: 10;
    box-shadow: var(--shadow-sm);
  }
  .sidebar-logo {
    padding: 18px 16px 14px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 34px; height: 34px;
    background: var(--brand);
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    color: white; font-size: 16px; font-weight: 800;
    font-family: var(--font);
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(14,165,160,0.35);
  }
  .logo-text { font-family: var(--font); font-weight: 800; font-size: 15px; color: var(--text); letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: var(--text3); font-family: var(--mono); letter-spacing: 0.3px; margin-top: 1px; }
  .sidebar-role-tag {
    margin: 10px 16px;
    padding: 5px 10px;
    background: var(--brand-bg);
    border: 1px solid var(--brand-border);
    border-radius: 6px;
    font-size: 11px; font-family: var(--mono);
    color: var(--brand); font-weight: 500; letter-spacing: 0.3px;
  }
  .nav-section { padding: 8px; flex: 1; overflow-y: auto; }
  .nav-group-label {
    font-size: 10px; font-family: var(--mono); color: var(--text3);
    letter-spacing: 0.8px; text-transform: uppercase;
    padding: 12px 8px 5px; display: block;
  }
  .nav-item {
    display: flex; align-items: center; gap: 9px;
    padding: 8px 10px; border-radius: var(--radius-sm);
    font-size: 13.5px; font-weight: 500; font-family: var(--font);
    color: var(--text2); cursor: pointer;
    transition: all 0.13s; margin-bottom: 1px;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--brand-bg); color: var(--brand); font-weight: 600; }
  .nav-item .nav-ic { width: 18px; height: 18px; flex-shrink: 0; opacity: 0.7; }
  .nav-item.active .nav-ic { opacity: 1; }
  .nav-badge {
    margin-left: auto; background: var(--surface3);
    color: var(--text3); font-size: 10px; font-family: var(--mono);
    padding: 1px 6px; border-radius: 8px; min-width: 20px; text-align: center;
  }
  .nav-item.active .nav-badge { background: var(--brand-border); color: var(--brand); }
  .sidebar-footer {
    padding: 12px 16px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .avatar {
    width: 32px; height: 32px; border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; font-family: var(--font); flex-shrink: 0;
  }
  .av-brand { background: var(--brand-bg); color: var(--brand); }
  .av-green { background: var(--green-bg); color: var(--green); }
  .av-amber { background: var(--amber-bg); color: var(--amber); }
  .av-blue  { background: var(--blue-bg);  color: var(--blue); }
  .av-red   { background: var(--red-bg);   color: var(--red); }
  .avatar-lg { width: 38px; height: 38px; font-size: 13px; border-radius: 10px; }
  .user-name  { font-size: 13px; font-weight: 600; color: var(--text); font-family: var(--font); }
  .user-email { font-size: 11px; color: var(--text3); }

  /* ── MAIN ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    height: 56px; background: var(--surface);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 12px;
    flex-shrink: 0;
  }
  .topbar-title { font-size: 15px; font-weight: 700; color: var(--text); font-family: var(--font); flex: 1; }
  .content { flex: 1; overflow-y: auto; padding: 24px; }

  /* ── BUTTONS ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-sm);
    font-size: 13px; font-weight: 600; font-family: var(--font);
    cursor: pointer; border: none; transition: all 0.13s;
    white-space: nowrap; line-height: 1;
  }
  .btn-primary { background: var(--brand); color: white; box-shadow: 0 1px 4px rgba(14,165,160,0.3); }
  .btn-primary:hover { background: var(--brand2); transform: translateY(-1px); box-shadow: 0 4px 12px rgba(14,165,160,0.35); }
  .btn-secondary {
    background: var(--surface); color: var(--text2);
    border: 1px solid var(--border); box-shadow: var(--shadow-sm);
  }
  .btn-secondary:hover { border-color: var(--brand); color: var(--brand); background: var(--brand-bg); }
  .btn-ghost { background: transparent; color: var(--text3); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-danger { background: var(--red-bg); color: var(--red); border: 1px solid rgba(220,38,38,0.15); }
  .btn-sm  { padding: 5px 11px; font-size: 12px; }
  .btn-xs  { padding: 3px 8px;  font-size: 11px; }
  .btn-icon { padding: 7px; }

  /* ── CARDS ── */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px;
    box-shadow: var(--shadow-sm);
  }
  .card-hd {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 16px;
  }
  .card-title { font-size: 14px; font-weight: 700; color: var(--text); font-family: var(--font); }
  .card-sub   { font-size: 12px; color: var(--text3); margin-top: 2px; }

  /* ── STAT CARDS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; margin-bottom: 22px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px 20px;
    box-shadow: var(--shadow-sm); position: relative; overflow: hidden;
  }
  .stat-card-accent { border-top: 2px solid var(--brand); }
  .stat-card-green  { border-top: 2px solid var(--green); }
  .stat-card-amber  { border-top: 2px solid var(--amber); }
  .stat-card-blue   { border-top: 2px solid var(--blue); }
  .stat-lbl  { font-size: 11px; color: var(--text3); font-family: var(--mono); letter-spacing: 0.3px; text-transform: uppercase; }
  .stat-val  { font-size: 26px; font-weight: 800; color: var(--text); font-family: var(--font); margin: 6px 0 3px; letter-spacing: -0.5px; }
  .stat-chg  { font-size: 12px; color: var(--text3); font-family: var(--body-font); }
  .stat-chg.up { color: var(--green); }
  .stat-bg-icon { position: absolute; right: 14px; bottom: 10px; font-size: 32px; opacity: 0.06; }

  /* ── PROGRESS ── */
  .prog-bar { height: 5px; background: var(--surface2); border-radius: 8px; overflow: hidden; }
  .prog-fill { height: 100%; border-radius: 8px; transition: width 0.5s ease; }
  .prog-bar.sm { height: 3px; }
  .prog-bar.lg { height: 7px; }

  /* ── BADGE ── */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 8px; border-radius: 5px;
    font-size: 11px; font-weight: 600; font-family: var(--mono);
    white-space: nowrap;
  }
  .badge-green  { background: var(--green-bg); color: var(--green); }
  .badge-amber  { background: var(--amber-bg); color: var(--amber); }
  .badge-blue   { background: var(--blue-bg);  color: var(--blue); }
  .badge-brand  { background: var(--brand-bg); color: var(--brand); }
  .badge-gray   { background: var(--surface2); color: var(--text3); }
  .badge-red    { background: var(--red-bg);   color: var(--red); }
  .dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }

  /* ── TABLE ── */
  .tbl-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    font-size: 11px; font-family: var(--mono); color: var(--text3);
    text-transform: uppercase; letter-spacing: 0.4px;
    padding: 9px 14px; text-align: left;
    border-bottom: 1px solid var(--border); font-weight: 500;
    background: var(--bg);
  }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--surface2); }
  td { padding: 11px 14px; font-size: 13px; color: var(--text2); vertical-align: middle; }

  /* ── FORM ── */
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .form-grp { margin-bottom: 14px; }
  .form-lbl { font-size: 12px; font-weight: 600; font-family: var(--font); color: var(--text2); display: block; margin-bottom: 5px; }
  .form-lbl span { color: var(--red); }
  .form-inp {
    width: 100%; padding: 9px 11px;
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); color: var(--text);
    font-size: 13px; font-family: var(--body-font);
    outline: none; transition: border-color 0.13s;
  }
  .form-inp:focus { border-color: var(--brand); box-shadow: 0 0 0 3px var(--brand-bg); }
  .form-inp::placeholder { color: var(--text3); }
  select.form-inp {
    appearance: none; cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238A96A3' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px;
  }
  textarea.form-inp { min-height: 76px; resize: vertical; line-height: 1.5; }

  /* ── MODAL ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(15,25,35,0.45);
    backdrop-filter: blur(3px);
    display: flex; align-items: center; justify-content: center; z-index: 200;
    animation: fadeIn 0.15s ease;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; width: 520px; max-height: 88vh; overflow-y: auto;
    box-shadow: var(--shadow-lg);
    animation: slideUp 0.18s ease;
  }
  .modal-hd { padding: 22px 22px 0; display: flex; justify-content: space-between; align-items: flex-start; }
  .modal-title { font-size: 16px; font-weight: 700; color: var(--text); font-family: var(--font); }
  .modal-sub { font-size: 12px; color: var(--text3); margin-top: 3px; }
  .modal-body { padding: 18px 22px; }
  .modal-ft {
    padding: 14px 22px 18px; border-top: 1px solid var(--border);
    display: flex; gap: 8px; justify-content: flex-end;
  }
  .close-btn { background: none; border: none; color: var(--text3); font-size: 20px; cursor: pointer; line-height: 1; padding: 2px; }
  .close-btn:hover { color: var(--text); }
  @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

  /* ── MISC ── */
  .section-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .section-title { font-size: 15px; font-weight: 700; color: var(--text); font-family: var(--font); }
  .section-sub   { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .divider { height: 1px; background: var(--border); margin: 14px 0; }
  .tag {
    display: inline-block; padding: 2px 7px; background: var(--surface2);
    border: 1px solid var(--border); border-radius: 4px;
    font-size: 11px; color: var(--text3); font-family: var(--mono);
  }
  .flex { display: flex; align-items: center; }
  .flex-gap { display: flex; align-items: center; gap: 8px; }
  .flex-between { display: flex; align-items: center; justify-content: space-between; }
  .stack { display: flex; flex-direction: column; gap: 10px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 14px; }
  .col-span-2 { grid-column: span 2; }

  /* ── UPLOAD ZONE ── */
  .upload-zone {
    border: 2px dashed var(--border2); border-radius: var(--radius);
    padding: 28px; text-align: center; cursor: pointer;
    background: var(--surface2); transition: all 0.13s;
  }
  .upload-zone:hover { border-color: var(--brand); background: var(--brand-bg); }
  .upload-icon { font-size: 28px; margin-bottom: 8px; }
  .upload-txt { font-size: 13px; color: var(--text2); font-weight: 500; }
  .upload-sub { font-size: 11px; color: var(--text3); margin-top: 4px; }

  /* ── MODULE / LESSON CARDS ── */
  .module-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: var(--radius); padding: 16px; cursor: pointer;
    transition: all 0.15s; box-shadow: var(--shadow-sm);
  }
  .module-card:hover { border-color: var(--brand); box-shadow: 0 4px 16px rgba(14,165,160,0.1); transform: translateY(-1px); }
  .module-card-hd { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
  .module-name { font-size: 14px; font-weight: 700; color: var(--text); font-family: var(--font); line-height: 1.35; margin-bottom: 4px; }
  .client-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 9px; border-radius: 20px;
    border: 1px solid var(--border); background: var(--surface2);
    font-size: 11px; font-weight: 500; color: var(--text2);
    cursor: pointer; transition: all 0.12s; font-family: var(--font);
  }
  .client-pill:hover { background: var(--surface3); }
  .client-pill.active { border-color: var(--brand); background: var(--brand-bg); color: var(--brand); }
  .cdot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }

  /* ── LESSON ITEM ── */
  .lesson-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 13px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--surface);
    margin-bottom: 7px; cursor: pointer; transition: all 0.13s;
  }
  .lesson-item:hover { border-color: var(--brand); background: var(--brand-bg); }
  .lesson-num {
    width: 22px; height: 22px; border-radius: 6px;
    background: var(--surface2); border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; font-family: var(--mono); color: var(--text3); flex-shrink: 0;
  }
  .lesson-num.done { background: var(--green-bg); border-color: transparent; color: var(--green); }
  .lesson-title { flex: 1; font-size: 13px; font-weight: 500; color: var(--text); }
  .lesson-meta  { font-size: 11px; color: var(--text3); margin-top: 1px; }

  /* ── CERT ── */
  .cert-wrap {
    background: linear-gradient(135deg, #f0fafa 0%, #e6f7f7 100%);
    border: 1.5px solid var(--brand-border); border-radius: 14px;
    padding: 36px; text-align: center; position: relative; overflow: hidden;
  }
  .cert-wrap::before {
    content: ''; position: absolute; inset: 10px;
    border: 1px solid var(--brand-border); border-radius: 10px; pointer-events: none;
  }
  .cert-badge { font-size: 42px; margin-bottom: 14px; }
  .cert-label { font-size: 10px; font-family: var(--mono); color: var(--brand); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 14px; }
  .cert-name  { font-size: 24px; font-weight: 800; color: var(--text); font-family: var(--font); letter-spacing: -0.3px; margin-bottom: 8px; }
  .cert-body  { font-size: 13px; color: var(--text2); line-height: 1.6; max-width: 300px; margin: 0 auto 16px; }
  .cert-module { font-size: 15px; font-weight: 700; color: var(--brand); margin-bottom: 22px; font-family: var(--font); }
  .cert-footer { display: flex; justify-content: center; gap: 32px; font-size: 11px; font-family: var(--mono); color: var(--text3); }

  /* ── SEARCH ── */
  .search-wrap { position: relative; }
  .search-inp {
    padding: 7px 11px 7px 32px; background: var(--surface);
    border: 1.5px solid var(--border); border-radius: var(--radius-sm);
    color: var(--text); font-size: 13px; font-family: var(--body-font);
    outline: none; width: 200px; transition: all 0.13s;
  }
  .search-inp:focus { border-color: var(--brand); width: 240px; box-shadow: 0 0 0 3px var(--brand-bg); }
  .search-ic { position: absolute; left: 9px; top: 50%; transform: translateY(-50%); color: var(--text3); font-size: 14px; pointer-events: none; }

  /* ── SIG PAD ── */
  .sig-wrap { border: 1.5px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; background: white; }

  /* ── INFO BOX ── */
  .info-box {
    background: var(--brand-bg); border: 1px solid var(--brand-border);
    border-radius: var(--radius-sm); padding: 11px 13px;
    font-size: 12px; color: var(--text2); line-height: 1.5;
  }
  .warn-box {
    background: var(--amber-bg); border: 1px solid rgba(217,119,6,0.18);
    border-radius: var(--radius-sm); padding: 11px 13px;
    font-size: 12px; color: var(--amber); line-height: 1.5;
  }

  /* ── EMPTY STATE ── */
  .empty-state { text-align: center; padding: 40px 24px; }
  .empty-icon  { font-size: 36px; margin-bottom: 10px; opacity: 0.4; }
  .empty-title { font-size: 14px; font-weight: 600; color: var(--text2); font-family: var(--font); margin-bottom: 5px; }
  .empty-sub   { font-size: 12px; color: var(--text3); }

  /* ── LOGIN ── */
  .login-wrap {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
  }
  .login-box { width: 420px; }
  .login-hero {
    text-align: center; margin-bottom: 28px;
  }
  .login-logo {
    width: 52px; height: 52px; background: var(--brand);
    border-radius: 14px; display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 900; font-family: var(--font);
    color: white; margin: 0 auto 14px;
    box-shadow: 0 4px 16px rgba(14,165,160,0.3);
  }
  .login-title { font-size: 22px; font-weight: 800; color: var(--text); font-family: var(--font); letter-spacing: -0.3px; }
  .login-sub   { font-size: 13px; color: var(--text3); margin-top: 5px; }
  .login-tabs  { display: flex; background: var(--surface2); border-radius: var(--radius-sm); padding: 4px; margin-bottom: 20px; }
  .login-tab   { flex: 1; text-align: center; padding: 8px; border-radius: 5px; font-size: 13px; font-weight: 600; cursor: pointer; color: var(--text3); transition: all 0.13s; font-family: var(--font); }
  .login-tab.active { background: var(--surface); color: var(--text); box-shadow: var(--shadow-sm); }

  /* ── DRAG HANDLE ── */
  .drag-handle { color: var(--text3); cursor: grab; font-size: 15px; padding: 0 3px; }
  .drag-handle:active { cursor: grabbing; }

  /* Responsive */
  @media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2,1fr); }
    .grid-3 { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 720px) {
    .sidebar { display: none; }
  }
`;

// ─── DATA ─────────────────────────────────────────────────────────────────
const initClients = [
  { id: "c1", name: "TechCorp USA",  color: "#0EA5A0", active: true  },
  { id: "c2", name: "FinanceHub",    color: "#2563EB", active: true  },
  { id: "c3", name: "RetailPro",     color: "#D97706", active: true  },
];

const initModules = [
  { id: "m1", clientId: "c1", title: "Customer Service Fundamentals", role: "Support Agent", status: "published" },
  { id: "m2", clientId: "c1", title: "Product Knowledge Essentials",  role: "Sales Agent",   status: "published" },
  { id: "m3", clientId: "c2", title: "Compliance & Regulations",       role: "All",           status: "published" },
  { id: "m4", clientId: "c3", title: "Retail Sales Techniques",        role: "Sales Agent",   status: "draft"     },
];

const initLessons = [
  { id: "l1", moduleId: "m1", title: "Welcome & Orientation",    type: "video",           duration: "8 min",  order: 1 },
  { id: "l2", moduleId: "m1", title: "Core Values & Mission",    type: "document",        duration: "5 min",  order: 2 },
  { id: "l3", moduleId: "m1", title: "Communication Standards",  type: "text",            duration: "10 min", order: 3 },
  { id: "l4", moduleId: "m1", title: "Handling Escalations",     type: "video",           duration: "12 min", order: 4 },
  { id: "l5", moduleId: "m1", title: "Knowledge Check",          type: "quiz",            duration: "15 min", order: 5 },
  { id: "l6", moduleId: "m1", title: "Final Acknowledgment",     type: "acknowledgment",  duration: "5 min",  order: 6 },
];

const initAgents = [
  { id: "a1", name: "Maria Santos",  email: "m.santos@lv.com",   clientId: "c1", role: "Support Agent", avatar: "MS", color: "av-brand", completedLessons: ["l1","l2"], assignedModules: ["m1"] },
  { id: "a2", name: "James Okafor",  email: "j.okafor@lv.com",   clientId: "c1", role: "Sales Agent",   avatar: "JO", color: "av-green", completedLessons: ["l1","l2","l3","l4","l5","l6"], assignedModules: ["m1","m2"] },
  { id: "a3", name: "Priya Nair",    email: "p.nair@lv.com",     clientId: "c2", role: "Support Agent", avatar: "PN", color: "av-blue",  completedLessons: ["l1","l2","l3"], assignedModules: ["m3"] },
  { id: "a4", name: "Carlos Rivera", email: "c.rivera@lv.com",   clientId: "c3", role: "Sales Agent",   avatar: "CR", color: "av-amber", completedLessons: [], assignedModules: ["m4"] },
  { id: "a5", name: "Aisha Johnson", email: "a.johnson@lv.com",  clientId: "c2", role: "All",           avatar: "AJ", color: "av-green", completedLessons: ["l1","l2","l3","l4","l5","l6"], assignedModules: ["m3"] },
  { id: "a6", name: "Wei Zhang",     email: "w.zhang@lv.com",    clientId: "c1", role: "Support Agent", avatar: "WZ", color: "av-brand", completedLessons: ["l1","l2","l3","l4"], assignedModules: ["m1"] },
];

const initAcknowledgments = [
  { id: "ak1", agentId: "a2", moduleId: "m1", timestamp: "2026-02-28 14:07:32 UTC", name: "James Okafor", ip: "192.168.1.14" },
  { id: "ak2", agentId: "a5", moduleId: "m3", timestamp: "2026-02-27 09:15:44 UTC", name: "Aisha Johnson", ip: "192.168.2.21" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────
function agentProgress(agent, lessons) {
  const moduleLessons = lessons.filter(l => agent.assignedModules.includes(l.moduleId));
  if (!moduleLessons.length) return 0;
  const done = moduleLessons.filter(l => agent.completedLessons.includes(l.id)).length;
  return Math.round((done / moduleLessons.length) * 100);
}
function agentStatus(pct) {
  if (pct === 100) return "Completed";
  if (pct > 0)    return "In Progress";
  return "Not Started";
}
const TYPE_ICON = { video: "▶", document: "📄", text: "📝", quiz: "✦", acknowledgment: "✍", audio: "🎧", image: "🖼" };
const TYPE_BADGE = { video: "badge-blue", document: "badge-amber", text: "badge-gray", quiz: "badge-brand", acknowledgment: "badge-green", audio: "badge-green" };

// ─── SHARED COMPONENTS ─────────────────────────────────────────────────────
function StatCard({ label, value, change, icon, variant, up }) {
  return (
    <div className={`stat-card stat-card-${variant}`}>
      <div className="stat-lbl">{label}</div>
      <div className="stat-val">{value}</div>
      <div className={`stat-chg ${up?"up":""}`}>{change}</div>
      <div className="stat-bg-icon">{icon}</div>
    </div>
  );
}

function Modal({ title, sub, children, onClose, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target.classList.contains("modal-overlay") && onClose()}>
      <div className="modal">
        <div className="modal-hd">
          <div>
            <div className="modal-title">{title}</div>
            {sub && <div className="modal-sub">{sub}</div>}
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-ft">{footer}</div>}
      </div>
    </div>
  );
}

function ProgressCell({ pct }) {
  const color = pct===100 ? "#16A34A" : pct>0 ? "var(--brand)" : "var(--surface3)";
  return (
    <div className="flex-gap" style={{minWidth:130}}>
      <div className="prog-bar" style={{flex:1}}>
        <div className="prog-fill" style={{width:`${pct}%`, background:color}}/>
      </div>
      <span style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--text3)",minWidth:28,textAlign:"right"}}>{pct}%</span>
    </div>
  );
}

function StatusBadge({ pct }) {
  const s = agentStatus(pct);
  const cls = s==="Completed" ? "badge-green" : s==="In Progress" ? "badge-blue" : "badge-gray";
  return <span className={`badge ${cls}`}><span className="dot"/> {s}</span>;
}

function AgentRow({ agent, lessons, clients }) {
  const pct = agentProgress(agent, lessons);
  const client = clients.find(c => c.id === agent.clientId);
  return (
    <tr>
      <td>
        <div className="flex-gap">
          <div className={`avatar ${agent.color}`}>{agent.avatar}</div>
          <div>
            <div style={{fontWeight:600,color:"var(--text)",fontSize:13,fontFamily:"var(--font)"}}>{agent.name}</div>
            <div style={{fontSize:11,color:"var(--text3)"}}>{agent.email}</div>
          </div>
        </div>
      </td>
      <td>
        <div className="flex-gap">
          <div className="cdot" style={{background:client?.color}}/>
          <span>{client?.name}</span>
        </div>
      </td>
      <td><span className="tag">{agent.role}</span></td>
      <td><ProgressCell pct={pct}/></td>
      <td><StatusBadge pct={pct}/></td>
    </tr>
  );
}

// ─── ADMIN VIEWS ───────────────────────────────────────────────────────────

function AdminDashboard({ setView, agents, lessons, modules, clients, acknowledgments }) {
  const completionRate = Math.round((agents.filter(a=>agentProgress(a,lessons)===100).length/agents.length)*100);
  const inProgress = agents.filter(a=>{const p=agentProgress(a,lessons);return p>0&&p<100;}).length;

  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total Agents"     value={agents.length}  change="Across all clients" icon="👥" variant="accent" />
        <StatCard label="Completion Rate"  value={`${completionRate}%`} change="↑ 8% this month" icon="✅" variant="green" up />
        <StatCard label="In Progress"      value={inProgress}     change="Active right now"   icon="📈" variant="blue" />
        <StatCard label="Signatures on File" value={acknowledgments.length} change="Compliance records" icon="✍" variant="amber" />
      </div>

      <div className="grid-2" style={{gap:16,marginBottom:16}}>
        {/* Client Progress */}
        <div className="card">
          <div className="card-hd">
            <div><div className="card-title">Client Progress</div><div className="card-sub">Avg. completion per client</div></div>
            <button className="btn btn-ghost btn-sm" onClick={()=>setView("clients")}>View all →</button>
          </div>
          {clients.map(c => {
            const ca = agents.filter(a=>a.clientId===c.id);
            const avg = ca.length ? Math.round(ca.reduce((s,a)=>s+agentProgress(a,lessons),0)/ca.length) : 0;
            return (
              <div key={c.id} style={{marginBottom:12}}>
                <div className="flex-between" style={{marginBottom:5}}>
                  <div className="flex-gap"><div className="cdot" style={{background:c.color}}/><span style={{fontSize:13,fontWeight:500,color:"var(--text)",fontFamily:"var(--font)"}}>{c.name}</span></div>
                  <span style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--text3)"}}>{avg}%</span>
                </div>
                <div className="prog-bar lg"><div className="prog-fill" style={{width:`${avg}%`,background:c.color}}/></div>
              </div>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="card-hd"><div className="card-title">Recent Activity</div><div className="card-sub">Last 24 hours</div></div>
          <div className="stack">
            {[
              {a:"James Okafor",  action:"Completed module",      module:"Customer Service",    time:"2h ago",  color:"av-green"},
              {a:"Aisha Johnson", action:"Signed acknowledgment",  module:"Compliance",          time:"4h ago",  color:"av-amber"},
              {a:"Wei Zhang",     action:"Completed lesson 4",     module:"Customer Service",    time:"6h ago",  color:"av-brand"},
              {a:"Priya Nair",    action:"Started training",       module:"Compliance",          time:"9h ago",  color:"av-blue"},
            ].map((item,i)=>(
              <div key={i} className="flex-gap">
                <div className={`avatar ${item.color}`} style={{width:28,height:28,fontSize:10}}>{item.a.split(" ").map(n=>n[0]).join("")}</div>
                <div style={{flex:1}}>
                  <span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{item.a}</span>
                  <span style={{fontSize:12,color:"var(--text3)"}}> {item.action}</span>
                  <div style={{fontSize:11,color:"var(--text3)"}}>{item.module}</div>
                </div>
                <span className="tag">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent table */}
      <div className="section-hd">
        <div className="section-title">All Agents</div>
        <button className="btn btn-secondary btn-sm" onClick={()=>setView("agents")}>Manage →</button>
      </div>
      <div className="card" style={{padding:0}}>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>
              {agents.map(a=><AgentRow key={a.id} agent={a} lessons={lessons} clients={clients}/>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminClients({ clients, setClients, modules, agents }) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm]       = useState({name:"",color:"#0EA5A0"});

  function addClient() {
    if (!form.name.trim()) return;
    setClients(prev=>[...prev,{id:`c${Date.now()}`,name:form.name,color:form.color,active:true}]);
    setForm({name:"",color:"#0EA5A0"});
    setShowAdd(false);
  }

  return (
    <div>
      <div className="section-hd">
        <div><div className="section-title">Clients</div><div className="section-sub">{clients.length} client organizations</div></div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)}>+ Add Client</button>
      </div>
      <div className="grid-3">
        {clients.map(c=>{
          const cm = modules.filter(m=>m.clientId===c.id).length;
          const ca = agents.filter(a=>a.clientId===c.id).length;
          return (
            <div key={c.id} className="card">
              <div style={{width:42,height:42,borderRadius:10,background:c.color+"18",border:`1px solid ${c.color}30`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,fontSize:20}}>◉</div>
              <div style={{fontWeight:700,fontSize:15,color:"var(--text)",fontFamily:"var(--font)",marginBottom:4}}>{c.name}</div>
              <div className="divider"/>
              <div className="grid-2" style={{gap:8}}>
                <div style={{textAlign:"center",padding:"10px 0",background:"var(--surface2)",borderRadius:"var(--radius-sm)"}}>
                  <div style={{fontSize:20,fontWeight:800,color:"var(--text)",fontFamily:"var(--font)"}}>{ca}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>Agents</div>
                </div>
                <div style={{textAlign:"center",padding:"10px 0",background:"var(--surface2)",borderRadius:"var(--radius-sm)"}}>
                  <div style={{fontSize:20,fontWeight:800,color:"var(--text)",fontFamily:"var(--font)"}}>{cm}</div>
                  <div style={{fontSize:11,color:"var(--text3)"}}>Modules</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAdd && (
        <Modal title="Add Client" sub="Create a new client organization" onClose={()=>setShowAdd(false)}
          footer={<><button className="btn btn-secondary" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={addClient}>Add Client</button></>}>
          <div className="form-grp">
            <label className="form-lbl">Client Name <span>*</span></label>
            <input className="form-inp" placeholder="e.g. Acme Corp" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}/>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Brand Color</label>
            <div className="flex-gap">
              <input type="color" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{width:36,height:36,border:"1px solid var(--border)",borderRadius:6,cursor:"pointer",padding:2}}/>
              <input className="form-inp" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))} style={{flex:1}}/>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AdminModules({ modules, setModules, clients, lessons }) {
  const [filterClient, setFilterClient] = useState("all");
  const [showCreate, setShowCreate]     = useState(false);
  const [form, setForm] = useState({title:"",clientId:"",role:"Support Agent",status:"draft"});

  const filtered = filterClient==="all" ? modules : modules.filter(m=>m.clientId===filterClient);

  function createModule() {
    if (!form.title.trim() || !form.clientId) return;
    setModules(prev=>[...prev,{id:`m${Date.now()}`,title:form.title,clientId:form.clientId,role:form.role,status:form.status}]);
    setForm({title:"",clientId:"",role:"Support Agent",status:"draft"});
    setShowCreate(false);
  }

  return (
    <div>
      <div className="section-hd">
        <div><div className="section-title">Modules</div><div className="section-sub">{modules.length} training modules</div></div>
        <button className="btn btn-primary" onClick={()=>setShowCreate(true)}>+ New Module</button>
      </div>

      <div className="flex-gap" style={{marginBottom:16,flexWrap:"wrap"}}>
        <div className={`client-pill ${filterClient==="all"?"active":""}`} onClick={()=>setFilterClient("all")}>All Clients</div>
        {clients.map(c=>(
          <div key={c.id} className={`client-pill ${filterClient===c.id?"active":""}`} style={filterClient===c.id?{borderColor:c.color,color:c.color,background:c.color+"12"}:{}} onClick={()=>setFilterClient(c.id)}>
            <div className="cdot" style={{background:c.color}}/>{c.name}
          </div>
        ))}
      </div>

      {filtered.length===0 && (
        <div className="card"><div className="empty-state"><div className="empty-icon">📦</div><div className="empty-title">No modules yet</div><div className="empty-sub">Create your first training module to get started.</div></div></div>
      )}

      <div className="grid-3">
        {filtered.map(m=>{
          const client = clients.find(c=>c.id===m.clientId);
          const lcount = lessons.filter(l=>l.moduleId===m.id).length;
          return (
            <div key={m.id} className="module-card">
              <div className="module-card-hd">
                <span className={`badge ${m.status==="published"?"badge-green":"badge-amber"}`}>{m.status}</span>
                <button className="btn btn-ghost btn-xs">⋯</button>
              </div>
              <div className="module-name">{m.title}</div>
              <div className="flex-gap" style={{marginBottom:10}}>
                <div className="cdot" style={{background:client?.color}}/><span style={{fontSize:12,color:"var(--text3)"}}>{client?.name}</span>
                <span style={{fontSize:12,color:"var(--border2)"}}>·</span>
                <span style={{fontSize:12,color:"var(--text3)"}}>{lcount} lessons</span>
              </div>
              <span className="tag">{m.role}</span>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <Modal title="Create Module" sub="Add a new training module" onClose={()=>setShowCreate(false)}
          footer={<><button className="btn btn-secondary" onClick={()=>setShowCreate(false)}>Cancel</button><button className="btn btn-primary" onClick={createModule}>Create</button></>}>
          <div className="form-grp">
            <label className="form-lbl">Module Title <span>*</span></label>
            <input className="form-inp" placeholder="e.g. Customer Service Fundamentals" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          </div>
          <div className="form-row">
            <div className="form-grp">
              <label className="form-lbl">Client <span>*</span></label>
              <select className="form-inp" value={form.clientId} onChange={e=>setForm(f=>({...f,clientId:e.target.value}))}>
                <option value="">Select client…</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-grp">
              <label className="form-lbl">Target Role</label>
              <select className="form-inp" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option>Support Agent</option><option>Sales Agent</option><option>All</option>
              </select>
            </div>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Status</label>
            <select className="form-inp" value={form.status} onChange={e=>setForm(f=>({...f,status:e.target.value}))}>
              <option value="draft">Draft</option><option value="published">Published</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
}

function AdminLessons({ lessons, setLessons, modules, clients }) {
  const [selModule, setSelModule] = useState(modules[0]?.id||null);
  const [showAdd, setShowAdd]     = useState(false);
  const [form, setForm] = useState({title:"",type:"video",duration:"",content:""});

  const module     = modules.find(m=>m.id===selModule);
  const client     = clients.find(c=>c.id===module?.clientId);
  const modLessons = lessons.filter(l=>l.moduleId===selModule).sort((a,b)=>a.order-b.order);

  function addLesson() {
    if (!form.title.trim()) return;
    const maxOrder = modLessons.length ? Math.max(...modLessons.map(l=>l.order)) : 0;
    setLessons(prev=>[...prev,{id:`l${Date.now()}`,moduleId:selModule,title:form.title,type:form.type,duration:form.duration||"5 min",order:maxOrder+1}]);
    setForm({title:"",type:"video",duration:"",content:""});
    setShowAdd(false);
  }

  return (
    <div>
      <div className="section-hd">
        <div><div className="section-title">Lesson Builder</div><div className="section-sub">Select a module to manage its lessons</div></div>
        <button className="btn btn-primary" onClick={()=>setShowAdd(true)} disabled={!selModule}>+ Add Lesson</button>
      </div>
      <div className="grid-2" style={{gap:18,alignItems:"start"}}>
        {/* Module list */}
        <div>
          <div style={{fontSize:12,fontWeight:600,color:"var(--text2)",fontFamily:"var(--font)",marginBottom:8}}>Modules</div>
          <div className="stack" style={{gap:6}}>
            {modules.map(m=>{
              const c = clients.find(cl=>cl.id===m.clientId);
              return (
                <div key={m.id} onClick={()=>setSelModule(m.id)} style={{
                  padding:"11px 13px",borderRadius:"var(--radius-sm)",cursor:"pointer",transition:"all .13s",
                  border:`1.5px solid ${m.id===selModule?"var(--brand)":"var(--border)"}`,
                  background:m.id===selModule?"var(--brand-bg)":"var(--surface)"
                }}>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)",fontFamily:"var(--font)",marginBottom:3}}>{m.title}</div>
                  <div className="flex-gap"><div className="cdot" style={{background:c?.color}}/><span style={{fontSize:11,color:"var(--text3)"}}>{c?.name} · {lessons.filter(l=>l.moduleId===m.id).length} lessons</span></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lesson list */}
        <div>
          {module ? (
            <>
              <div className="flex-between" style={{marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:"var(--text2)",fontFamily:"var(--font)"}}>{module.title}</div>
                <div className="flex-gap">
                  <div className="cdot" style={{background:client?.color}}/>
                  <span style={{fontSize:11,color:"var(--text3)"}}>{client?.name}</span>
                </div>
              </div>
              {modLessons.length===0 && (
                <div className="card" style={{textAlign:"center",padding:"28px 16px"}}>
                  <div style={{fontSize:11,color:"var(--text3)"}}>No lessons yet. Add your first lesson.</div>
                </div>
              )}
              {modLessons.map((l,i)=>(
                <div key={l.id} className="lesson-item">
                  <span className="drag-handle">⠿</span>
                  <div className="lesson-num">{i+1}</div>
                  <span style={{fontSize:15,flexShrink:0}}>{TYPE_ICON[l.type]||"📄"}</span>
                  <div style={{flex:1}}>
                    <div className="lesson-title">{l.title}</div>
                    <div className="lesson-meta">{l.duration} · {l.type}</div>
                  </div>
                  <span className={`badge ${TYPE_BADGE[l.type]||"badge-gray"} badge-xs`}>{l.type}</span>
                  <button className="btn btn-ghost btn-xs">✎</button>
                </div>
              ))}
            </>
          ) : (
            <div className="card"><div className="empty-state"><div className="empty-icon">👈</div><div className="empty-title">Select a module</div></div></div>
          )}
        </div>
      </div>

      {showAdd && selModule && (
        <Modal title="Add Lesson" sub={`Adding to: ${module?.title}`} onClose={()=>setShowAdd(false)}
          footer={<><button className="btn btn-secondary" onClick={()=>setShowAdd(false)}>Cancel</button><button className="btn btn-primary" onClick={addLesson}>Add Lesson</button></>}>
          <div className="form-grp">
            <label className="form-lbl">Lesson Title <span>*</span></label>
            <input className="form-inp" placeholder="e.g. Introduction to the Platform" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
          </div>
          <div className="form-row">
            <div className="form-grp">
              <label className="form-lbl">Content Type</label>
              <select className="form-inp" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                <option value="video">Video</option><option value="document">Document / PDF</option>
                <option value="text">Written Content</option><option value="audio">Audio</option>
                <option value="quiz">Quiz</option><option value="acknowledgment">Acknowledgment</option>
              </select>
            </div>
            <div className="form-grp">
              <label className="form-lbl">Duration</label>
              <input className="form-inp" placeholder="e.g. 10 min" value={form.duration} onChange={e=>setForm(f=>({...f,duration:e.target.value}))}/>
            </div>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Upload File</label>
            <div className="upload-zone">
              <div className="upload-icon">📎</div>
              <div className="upload-txt">Drop file or click to browse</div>
              <div className="upload-sub">PDF, DOCX, MP4, MP3, PNG · Max 500MB</div>
            </div>
          </div>
          {form.type==="text" && (
            <div className="form-grp">
              <label className="form-lbl">Written Content</label>
              <textarea className="form-inp" placeholder="Write lesson content here…" value={form.content} onChange={e=>setForm(f=>({...f,content:e.target.value}))}/>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

function AdminAgents({ agents, setAgents, lessons, modules, clients }) {
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  const [form, setForm]       = useState({name:"",email:"",clientId:"",role:"Support Agent"});

  const filtered = agents.filter(a=>{
    const ms = a.name.toLowerCase().includes(search.toLowerCase())||a.email.toLowerCase().includes(search.toLowerCase());
    const mc = filter==="all"||a.clientId===filter;
    return ms&&mc;
  });

  function inviteAgent() {
    if(!form.name.trim()||!form.email.trim()||!form.clientId) return;
    const initials = form.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2);
    const colors   = ["av-brand","av-green","av-amber","av-blue"];
    setAgents(prev=>[...prev,{id:`a${Date.now()}`,name:form.name,email:form.email,clientId:form.clientId,role:form.role,avatar:initials,color:colors[prev.length%colors.length],completedLessons:[],assignedModules:[]}]);
    setForm({name:"",email:"",clientId:"",role:"Support Agent"});
    setShowInvite(false);
  }

  return (
    <div>
      <div className="section-hd">
        <div><div className="section-title">Agents</div><div className="section-sub">{agents.length} registered agents</div></div>
        <div className="flex-gap">
          <div className="search-wrap">
            <span className="search-ic">🔍</span>
            <input className="search-inp" placeholder="Search agents…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <button className="btn btn-primary" onClick={()=>setShowInvite(true)}>+ Invite Agent</button>
        </div>
      </div>

      <div className="flex-gap" style={{marginBottom:14,flexWrap:"wrap"}}>
        <div className={`client-pill ${filter==="all"?"active":""}`} onClick={()=>setFilter("all")}>All</div>
        {clients.map(c=>(
          <div key={c.id} className={`client-pill ${filter===c.id?"active":""}`} style={filter===c.id?{borderColor:c.color,color:c.color,background:c.color+"12"}:{}} onClick={()=>setFilter(c.id)}>
            <div className="cdot" style={{background:c.color}}/>{c.name}
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0}}>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th></tr></thead>
            <tbody>{filtered.map(a=><AgentRow key={a.id} agent={a} lessons={lessons} clients={clients}/>)}</tbody>
          </table>
        </div>
      </div>

      {showInvite && (
        <Modal title="Invite Agent" sub="Send training access to a new agent" onClose={()=>setShowInvite(false)}
          footer={<><button className="btn btn-secondary" onClick={()=>setShowInvite(false)}>Cancel</button><button className="btn btn-primary" onClick={inviteAgent}>Send Invite</button></>}>
          <div className="form-row">
            <div className="form-grp">
              <label className="form-lbl">First Name <span>*</span></label>
              <input className="form-inp" placeholder="Maria" value={form.name.split(" ")[0]||""} onChange={e=>setForm(f=>({...f,name:e.target.value+" "+(f.name.split(" ")[1]||"")}))}/>
            </div>
            <div className="form-grp">
              <label className="form-lbl">Last Name <span>*</span></label>
              <input className="form-inp" placeholder="Santos" value={form.name.split(" ")[1]||""} onChange={e=>setForm(f=>({...f,name:(f.name.split(" ")[0]||"")+" "+e.target.value}))}/>
            </div>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Email Address <span>*</span></label>
            <input className="form-inp" type="email" placeholder="agent@company.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}/>
          </div>
          <div className="form-row">
            <div className="form-grp">
              <label className="form-lbl">Client <span>*</span></label>
              <select className="form-inp" value={form.clientId} onChange={e=>setForm(f=>({...f,clientId:e.target.value}))}>
                <option value="">Select…</option>
                {clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="form-grp">
              <label className="form-lbl">Role</label>
              <select className="form-inp" value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}>
                <option>Support Agent</option><option>Sales Agent</option><option>All</option>
              </select>
            </div>
          </div>
          <div className="info-box">An invitation email will be sent with login credentials and assigned training.</div>
        </Modal>
      )}
    </div>
  );
}

function AdminSignatures({ acknowledgments, agents, modules, clients }) {
  return (
    <div>
      <div className="section-hd">
        <div><div className="section-title">Signed Acknowledgments</div><div className="section-sub">{acknowledgments.length} compliance records</div></div>
        <button className="btn btn-secondary">⤓ Export CSV</button>
      </div>
      <div className="card" style={{padding:0}}>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Agent</th><th>Module</th><th>Client</th><th>Signed At</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {acknowledgments.map(ack=>{
                const agent  = agents.find(a=>a.id===ack.agentId);
                const module = modules.find(m=>m.id===ack.moduleId);
                const client = clients.find(c=>c.id===module?.clientId);
                return (
                  <tr key={ack.id}>
                    <td>
                      <div className="flex-gap">
                        <div className={`avatar ${agent?.color||"av-brand"}`}>{agent?.avatar}</div>
                        <div>
                          <div style={{fontWeight:600,color:"var(--text)",fontSize:13,fontFamily:"var(--font)"}}>{agent?.name}</div>
                          <div style={{fontSize:11,color:"var(--text3)"}}>{agent?.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{fontWeight:500,color:"var(--text)",fontSize:13}}>{module?.title}</td>
                    <td><div className="flex-gap"><div className="cdot" style={{background:client?.color}}/>{client?.name}</div></td>
                    <td><div style={{fontSize:12}}>{ack.timestamp.split(" ")[0]}</div><div style={{fontSize:11,color:"var(--text3)"}}>{ack.timestamp.split(" ")[1]}</div></td>
                    <td><span className="badge badge-green"><span className="dot"/>Verified</span></td>
                    <td><div className="flex-gap"><button className="btn btn-ghost btn-xs">View</button><button className="btn btn-secondary btn-xs">⤓ PDF</button></div></td>
                  </tr>
                );
              })}
              {acknowledgments.length===0 && (
                <tr><td colSpan={6}><div className="empty-state"><div className="empty-icon">✍</div><div className="empty-title">No signatures yet</div></div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminReports({ agents, lessons, modules, clients, acknowledgments }) {
  return (
    <div>
      <div className="section-hd">
        <div><div className="section-title">Completion Reports</div><div className="section-sub">Training performance overview</div></div>
        <div className="flex-gap">
          <button className="btn btn-secondary">⤓ Export CSV</button>
          <button className="btn btn-primary">⤓ PDF Report</button>
        </div>
      </div>
      <div className="grid-3" style={{marginBottom:18}}>
        {clients.map(c=>{
          const ca = agents.filter(a=>a.clientId===c.id);
          const completed  = ca.filter(a=>agentProgress(a,lessons)===100).length;
          const inProgress = ca.filter(a=>{const p=agentProgress(a,lessons);return p>0&&p<100;}).length;
          const notStarted = ca.filter(a=>agentProgress(a,lessons)===0).length;
          return (
            <div key={c.id} className="card">
              <div className="flex-gap" style={{marginBottom:12}}>
                <div className="cdot" style={{background:c.color,width:10,height:10}}/>
                <div className="card-title">{c.name}</div>
              </div>
              <div style={{display:"flex",gap:3,height:6,borderRadius:4,overflow:"hidden",marginBottom:12}}>
                <div style={{flex:completed,background:"var(--green)",borderRadius:4}}/>
                <div style={{flex:inProgress,background:"var(--brand)",borderRadius:4}}/>
                <div style={{flex:notStarted||0.01,background:"var(--surface3)",borderRadius:4}}/>
              </div>
              <div className="stack" style={{gap:6}}>
                <div className="flex-between"><span style={{fontSize:12,color:"var(--green)"}}>● Completed</span><span style={{fontSize:13,fontFamily:"var(--mono)",fontWeight:500,color:"var(--text)"}}>{completed}</span></div>
                <div className="flex-between"><span style={{fontSize:12,color:"var(--brand)"}}>● In Progress</span><span style={{fontSize:13,fontFamily:"var(--mono)",fontWeight:500,color:"var(--text)"}}>{inProgress}</span></div>
                <div className="flex-between"><span style={{fontSize:12,color:"var(--text3)"}}>● Not Started</span><span style={{fontSize:13,fontFamily:"var(--mono)",fontWeight:500,color:"var(--text)"}}>{notStarted}</span></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card" style={{padding:0}}>
        <div className="tbl-wrap">
          <table>
            <thead><tr><th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th><th>Signed</th></tr></thead>
            <tbody>
              {agents.map(a=>{
                const pct = agentProgress(a,lessons);
                const c   = clients.find(cl=>cl.id===a.clientId);
                const signed = acknowledgments.some(ak=>ak.agentId===a.id);
                return (
                  <tr key={a.id}>
                    <td style={{fontWeight:600,color:"var(--text)",fontFamily:"var(--font)"}}>{a.name}</td>
                    <td><div className="flex-gap"><div className="cdot" style={{background:c?.color}}/>{c?.name}</div></td>
                    <td><span className="tag">{a.role}</span></td>
                    <td><ProgressCell pct={pct}/></td>
                    <td><StatusBadge pct={pct}/></td>
                    <td>{signed?<span className="badge badge-green">✓ Yes</span>:<span className="badge badge-gray">—</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AGENT VIEWS ───────────────────────────────────────────────────────────

function AgentTraining({ agent, setAgent, lessons, modules, clients, acknowledgments, setAcknowledgments }) {
  const [openModule, setOpenModule] = useState(null);
  const [showAck, setShowAck]       = useState(false);
  const [ackDone, setAckDone]       = useState(false);
  const [sigName, setSigName]       = useState("");
  const canvasRef                   = useRef(null);
  const [drawing, setDrawing]       = useState(false);
  const [hasSig, setHasSig]         = useState(false);

  const myModules = modules.filter(m=>agent.assignedModules.includes(m.id));

  function startDraw(e) {
    const r=canvasRef.current.getBoundingClientRect();
    const ctx=canvasRef.current.getContext("2d");
    ctx.beginPath(); ctx.moveTo(e.clientX-r.left,e.clientY-r.top);
    setDrawing(true);
  }
  function draw(e) {
    if(!drawing) return;
    const r=canvasRef.current.getBoundingClientRect();
    const ctx=canvasRef.current.getContext("2d");
    ctx.lineTo(e.clientX-r.left,e.clientY-r.top);
    ctx.strokeStyle="#0F1923"; ctx.lineWidth=2; ctx.stroke();
    setHasSig(true);
  }
  function endDraw() { setDrawing(false); }
  function clearSig() {
    const ctx=canvasRef.current.getContext("2d");
    ctx.clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
    setHasSig(false);
  }
  function submitAck(moduleId) {
    if(!hasSig||!sigName.trim()) return;
    const newAck = { id:`ak${Date.now()}`, agentId:agent.id, moduleId, timestamp:new Date().toISOString().replace("T"," ").slice(0,19)+" UTC", name:sigName, ip:"192.168.1.x" };
    setAcknowledgments(prev=>[...prev,newAck]);
    // mark ack lesson complete
    const ackLesson = lessons.find(l=>l.moduleId===moduleId&&l.type==="acknowledgment");
    if(ackLesson && !agent.completedLessons.includes(ackLesson.id)) {
      setAgent(a=>({...a,completedLessons:[...a.completedLessons,ackLesson.id]}));
    }
    setAckDone(true);
    setShowAck(false);
  }

  // If viewing a specific module
  if (openModule) {
    const m      = modules.find(mod=>mod.id===openModule);
    const client = clients.find(c=>c.id===m?.clientId);
    const mLessons = lessons.filter(l=>l.moduleId===openModule).sort((a,b)=>a.order-b.order);
    const done   = mLessons.filter(l=>agent.completedLessons.includes(l.id)).length;
    const pct    = mLessons.length ? Math.round((done/mLessons.length)*100) : 0;
    const isAlreadyAcked = acknowledgments.some(ak=>ak.agentId===agent.id&&ak.moduleId===openModule);

    function completeLesson(lessonId) {
      if(agent.completedLessons.includes(lessonId)) return;
      setAgent(a=>({...a,completedLessons:[...a.completedLessons,lessonId]}));
    }

    return (
      <div>
        <div className="flex-gap" style={{marginBottom:18}}>
          <button className="btn btn-ghost btn-sm" onClick={()=>setOpenModule(null)}>← Back</button>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:700,color:"var(--text)",fontFamily:"var(--font)"}}>{m?.title}</div>
            <div className="flex-gap" style={{marginTop:3}}>
              <div className="cdot" style={{background:client?.color}}/><span style={{fontSize:12,color:"var(--text3)"}}>{client?.name} · {done}/{mLessons.length} lessons complete</span>
            </div>
          </div>
          <span style={{fontSize:20,fontWeight:800,fontFamily:"var(--mono)",color:pct===100?"var(--green)":"var(--brand)"}}>{pct}%</span>
        </div>

        <div className="prog-bar lg" style={{marginBottom:22}}>
          <div className="prog-fill" style={{width:`${pct}%`,background:pct===100?"var(--green)":"var(--brand)"}}/>
        </div>

        <div className="stack">
          {mLessons.map((l,i)=>{
            const isDone = agent.completedLessons.includes(l.id);
            const isAck  = l.type==="acknowledgment";
            return (
              <div key={l.id} className="lesson-item" style={{background:isDone?"rgba(22,163,74,0.04)":"var(--surface)",borderColor:isDone?"rgba(22,163,74,0.2)":"var(--border)"}}>
                <div className={`lesson-num ${isDone?"done":""}`}>{isDone?"✓":i+1}</div>
                <span style={{fontSize:16,flexShrink:0}}>{TYPE_ICON[l.type]||"📄"}</span>
                <div style={{flex:1}}>
                  <div className="lesson-title">{l.title}</div>
                  <div className="lesson-meta">{l.duration} · {l.type}</div>
                </div>
                {isAck ? (
                  isAlreadyAcked||isDone
                    ? <span className="badge badge-green">✓ Signed</span>
                    : <button className="btn btn-primary btn-sm" onClick={()=>setShowAck(openModule)}>Sign Now</button>
                ) : (
                  isDone
                    ? <span className="badge badge-green">Complete</span>
                    : <button className="btn btn-secondary btn-sm" onClick={()=>completeLesson(l.id)}>Mark Done</button>
                )}
              </div>
            );
          })}
        </div>

        {/* Acknowledgment Modal */}
        {showAck && (
          <Modal title="Training Acknowledgment" sub="Read carefully before signing" onClose={()=>setShowAck(false)}
            footer={<>
              <button className="btn btn-secondary" onClick={()=>setShowAck(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>submitAck(openModule)} disabled={!hasSig||!sigName.trim()}>Submit & Sign</button>
            </>}>
            <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:14,marginBottom:14,fontSize:13,color:"var(--text2)",lineHeight:1.7}}>
              <p style={{fontWeight:700,color:"var(--text)",marginBottom:6,fontFamily:"var(--font)"}}>Acknowledgment of Training Completion</p>
              <p>I hereby confirm that I have completed the training module <strong style={{color:"var(--text)"}}>{m?.title}</strong> in full.</p>
              <p style={{marginTop:8}}>I agree to comply with all policies and procedures outlined in this training for <strong style={{color:"var(--text)"}}>{client?.name}</strong>.</p>
            </div>
            <div className="form-grp">
              <label className="form-lbl">Full Name <span>*</span></label>
              <input className="form-inp" placeholder="Type your full legal name" value={sigName} onChange={e=>setSigName(e.target.value)}/>
            </div>
            <div className="form-grp">
              <label className="form-lbl">Digital Signature <span>*</span> <span style={{fontWeight:400,color:"var(--text3)",fontSize:11}}>(draw with mouse)</span></label>
              <div className="sig-wrap">
                <canvas ref={canvasRef} width={468} height={110} style={{display:"block",cursor:"crosshair"}}
                  onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}/>
              </div>
              <div className="flex-between" style={{marginTop:5}}>
                <span style={{fontSize:11,color:"var(--text3)"}}>Sign above using your mouse or trackpad</span>
                <button className="btn btn-ghost btn-xs" onClick={clearSig}>Clear</button>
              </div>
            </div>
            <div className="info-box">🔒 This signature will be timestamped and stored securely for compliance records.</div>
          </Modal>
        )}
      </div>
    );
  }

  // Module list view
  const overallPct = (() => {
    const all = lessons.filter(l=>agent.assignedModules.includes(l.moduleId));
    if(!all.length) return 0;
    return Math.round((agent.completedLessons.filter(id=>all.find(l=>l.id===id)).length/all.length)*100);
  })();

  return (
    <div>
      {/* Agent welcome header */}
      <div className="card" style={{marginBottom:18,background:"linear-gradient(135deg,#f0fafa,#e6f7f7)",border:"1.5px solid var(--brand-border)"}}>
        <div className="flex-between">
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"var(--text)",fontFamily:"var(--font)",marginBottom:4}}>
              Welcome back, {agent.name.split(" ")[0]} 👋
            </div>
            <div style={{fontSize:13,color:"var(--text2)"}}>{myModules.length} modules assigned · {agent.role} · <span style={{color:"var(--brand)",fontWeight:600}}>{overallPct}% overall complete</span></div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:28,fontWeight:800,fontFamily:"var(--mono)",color:overallPct===100?"var(--green)":"var(--brand)"}}>{overallPct}%</div>
            <StatusBadge pct={overallPct}/>
          </div>
        </div>
        <div className="prog-bar lg" style={{marginTop:14}}>
          <div className="prog-fill" style={{width:`${overallPct}%`,background:overallPct===100?"var(--green)":"var(--brand)"}}/>
        </div>
      </div>

      <div className="section-hd"><div className="section-title">My Assigned Training</div></div>
      <div className="stack">
        {myModules.map(m=>{
          const client   = clients.find(c=>c.id===m.clientId);
          const mLessons = lessons.filter(l=>l.moduleId===m.id);
          const done     = mLessons.filter(l=>agent.completedLessons.includes(l.id)).length;
          const pct      = mLessons.length ? Math.round((done/mLessons.length)*100) : 0;
          const isAcked  = acknowledgments.some(ak=>ak.agentId===agent.id&&ak.moduleId===m.id);
          return (
            <div key={m.id} className="card flex-between" style={{cursor:"pointer",gap:16}} onClick={()=>setOpenModule(m.id)}>
              <div style={{width:44,height:44,borderRadius:10,background:client?.color+"15",border:`1px solid ${client?.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📚</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"var(--text)",fontFamily:"var(--font)",marginBottom:4}}>{m.title}</div>
                <div className="flex-gap" style={{marginBottom:8}}>
                  <div className="cdot" style={{background:client?.color}}/><span style={{fontSize:12,color:"var(--text3)"}}>{client?.name} · {mLessons.length} lessons</span>
                  {isAcked && <span className="badge badge-green" style={{fontSize:10}}>✍ Signed</span>}
                </div>
                <div className="prog-bar">
                  <div className="prog-fill" style={{width:`${pct}%`,background:pct===100?"var(--green)":"var(--brand)"}}/>
                </div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}>
                <div style={{fontSize:20,fontWeight:800,fontFamily:"var(--mono)",color:pct===100?"var(--green)":"var(--brand)"}}>{pct}%</div>
                <StatusBadge pct={pct}/>
              </div>
            </div>
          );
        })}
        {myModules.length===0 && (
          <div className="card"><div className="empty-state"><div className="empty-icon">📭</div><div className="empty-title">No training assigned yet</div><div className="empty-sub">Your admin will assign training soon.</div></div></div>
        )}
      </div>
    </div>
  );
}

function AgentCertificates({ agent, modules, clients, acknowledgments, lessons }) {
  const earned = acknowledgments.filter(ak=>ak.agentId===agent.id);
  return (
    <div>
      <div className="section-hd"><div><div className="section-title">My Certificates</div><div className="section-sub">{earned.length} certificate{earned.length!==1?"s":""} earned</div></div></div>
      {earned.length===0 && (
        <div className="card"><div className="empty-state"><div className="empty-icon">🏆</div><div className="empty-title">No certificates yet</div><div className="empty-sub">Complete a full training module and sign the acknowledgment to earn a certificate.</div></div></div>
      )}
      {earned.map(ack=>{
        const m = modules.find(mod=>mod.id===ack.moduleId);
        const c = clients.find(cl=>cl.id===m?.clientId);
        return (
          <div key={ack.id} style={{marginBottom:16}}>
            <div className="cert-wrap">
              <div className="cert-badge">🏆</div>
              <div className="cert-label">Certificate of Completion</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:6}}>This certifies that</div>
              <div className="cert-name">{agent.name}</div>
              <div className="cert-body">has successfully completed all required training and demonstrated understanding of policies and procedures for</div>
              <div className="cert-module">{m?.title}</div>
              <div className="cert-footer">
                <div><div style={{marginBottom:2}}>CLIENT</div>{c?.name}</div>
                <div><div style={{marginBottom:2}}>COMPLETED</div>{ack.timestamp.slice(0,10)}</div>
                <div><div style={{marginBottom:2}}>CERT ID</div>LV-{ack.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>
            <div className="flex-gap" style={{marginTop:10,justifyContent:"center"}}>
              <button className="btn btn-secondary btn-sm">⤓ Download PDF</button>
              <button className="btn btn-ghost btn-sm">Share</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const submit = async () => {
    if (!email || !pass) { setError("Email and password are required."); return; }
    setLoading(true); setError("");
    try {
      const { api } = await import("./api.js");
      const data = await api.login(email, pass);
      localStorage.setItem("lv_token", data.token);
      onLogin(data.user);
    } catch(e) {
      setError(e.message || "Login failed. Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-hero">
          <div className="login-logo">LV</div>
          <div className="login-title">Lead Virtual Training</div>
          <div className="login-sub">Internal agent training & compliance platform</div>
        </div>
        <div className="card">
          {error && <div style={{background:"var(--red-bg)",border:"1px solid rgba(220,38,38,.2)",borderRadius:"var(--radius-sm)",padding:"10px 13px",fontSize:12,color:"var(--red)",marginBottom:14}}>{error}</div>}
          <div className="form-grp">
            <label className="form-lbl">Email Address</label>
            <input className="form-inp" type="email" placeholder="you@leadvirtual.com" value={email}
              onChange={e=>setEmail(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Password</label>
            <input className="form-inp" type="password" placeholder="••••••••" value={pass}
              onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"10px"}}
            onClick={submit} disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
          <div style={{textAlign:"center",fontSize:11,color:"var(--text3)",marginTop:12}}>
            Access is by invitation only.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ACCEPT INVITE ──────────────────────────────────────────────────────────
function AcceptInvitePage({ token, onActivated }) {
  const [invite, setInvite]   = useState(null);
  const [pass,   setPass]     = useState("");
  const [pass2,  setPass2]    = useState("");
  const [name,   setName]     = useState("");
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState("");

  useState(() => {
    (async () => {
      try {
        const { api } = await import("./api.js");
        const data = await api.getInvite(token);
        setInvite(data);
        setName(data.name || "");
      } catch(e) {
        setError(e.message || "Invalid or expired invitation link.");
      } finally { setLoading(false); }
    })();
  }, [token]);

  const submit = async () => {
    if (!pass || pass.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (pass !== pass2) { setError("Passwords do not match."); return; }
    setSaving(true); setError("");
    try {
      const { api } = await import("./api.js");
      const data = await api.acceptInvite(token, pass, name);
      localStorage.setItem("lv_token", data.token);
      onActivated(data.user);
    } catch(e) {
      setError(e.message || "Failed to activate account.");
    } finally { setSaving(false); }
  };

  if (loading) return (
    <div className="login-wrap">
      <div style={{textAlign:"center",color:"var(--text3)",fontSize:14}}>Verifying invitation…</div>
    </div>
  );

  return (
    <div className="login-wrap">
      <div className="login-box">
        <div className="login-hero">
          <div className="login-logo">LV</div>
          <div className="login-title">Set Up Your Account</div>
          <div className="login-sub">Lead Virtual Training Platform</div>
        </div>
        <div className="card">
          {error && <div style={{background:"var(--red-bg)",border:"1px solid rgba(220,38,38,.2)",borderRadius:"var(--radius-sm)",padding:"10px 13px",fontSize:12,color:"var(--red)",marginBottom:14}}>{error}</div>}
          {invite && (
            <div style={{background:"var(--brand-bg)",border:"1px solid var(--brand-border)",borderRadius:"var(--radius-sm)",padding:"12px 14px",marginBottom:16,fontSize:13}}>
              <div style={{fontWeight:700,color:"var(--text)",marginBottom:4}}>You're invited as a <span style={{color:"var(--brand)"}}>{invite.role}</span></div>
              <div style={{color:"var(--text2)",fontSize:12}}>{invite.email}{invite.clientName ? ` · ${invite.clientName}` : ""}</div>
            </div>
          )}
          <div className="form-grp">
            <label className="form-lbl">Your Name</label>
            <input className="form-inp" placeholder="Full name" value={name} onChange={e=>setName(e.target.value)}/>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Create Password <span style={{color:"var(--red)"}}>*</span></label>
            <input className="form-inp" type="password" placeholder="Min 8 characters" value={pass} onChange={e=>setPass(e.target.value)}/>
          </div>
          <div className="form-grp">
            <label className="form-lbl">Confirm Password <span style={{color:"var(--red)"}}>*</span></label>
            <input className="form-inp" type="password" placeholder="Repeat password" value={pass2}
              onChange={e=>setPass2(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()}/>
          </div>
          <button className="btn btn-primary" style={{width:"100%",justifyContent:"center",padding:"10px"}}
            onClick={submit} disabled={saving}>
            {saving ? "Activating…" : "Activate Account →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  // Auth
  const [authUser, setAuthUser] = useState(null);  // { id, email, name, role, clientId }
  const [authLoading, setAuthLoading] = useState(true);
  const [inviteToken, setInviteToken] = useState(null);

  // On mount: check for ?token= (invite) or existing session
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) { setInviteToken(t); setAuthLoading(false); return; }
    const saved = localStorage.getItem("lv_token");
    if (saved) {
      import("./api.js").then(({ api }) =>
        api.me(saved)
          .then(u => setAuthUser(u))
          .catch(() => localStorage.removeItem("lv_token"))
          .finally(() => setAuthLoading(false))
      );
    } else { setAuthLoading(false); }
  }, []);

  const onLogin    = (user) => { setAuthUser(user); setInviteToken(null); };
  const onActivated= (user) => { setAuthUser(user); setInviteToken(null); window.history.replaceState({}, "", "/"); };

  // Derive portal role from real user
  const role = authUser ? (["superadmin","admin"].includes(authUser.role) ? "admin" : "agent") : null;

  const [view,             setView]             = useState("dashboard");
  const [clients,          setClients]          = useState(initClients);
  const [modules,          setModules]          = useState(initModules);
  const [lessons,          setLessons]          = useState(initLessons);
  const [agents,           setAgents]           = useState(initAgents);
  const [acknowledgments,  setAcknowledgments]  = useState(initAcknowledgments);
  const [agentSelf, setAgentSelf] = useState(initAgents[0]);

  function logout() {
    localStorage.removeItem("lv_token");
    setAuthUser(null);
    setView("dashboard");
  }

  // When role changes, set default view
  useState(() => {
    if (role === "admin") setView("dashboard");
    if (role === "agent") setView("training");
  }, [role]);

  // Sync agentSelf with agents array
  const syncedAgent = agents.find(a=>a.id===agentSelf.id)||agentSelf;

  // ── Admin nav ──
  const adminNav = [
    { label:"Overview", items:[
      { key:"dashboard",   icon:"🏠", label:"Dashboard"  },
      { key:"reports",     icon:"📊", label:"Reports"    },
    ]},
    { label:"Content", items:[
      { key:"clients",  icon:"🏢", label:"Clients",  badge:clients.length  },
      { key:"modules",  icon:"📦", label:"Modules",  badge:modules.length  },
      { key:"lessons",  icon:"📝", label:"Lessons"                         },
    ]},
    { label:"People", items:[
      { key:"agents",      icon:"👥", label:"Agents",    badge:agents.length  },
    ]},
    { label:"Compliance", items:[
      { key:"signatures",  icon:"✍",  label:"Signatures", badge:acknowledgments.length },
    ]},
  ];

  // ── Agent nav ──
  const agentNav = [
    { label:"Training", items:[
      { key:"training",      icon:"📚", label:"My Training" },
      { key:"certificates",  icon:"🏆", label:"Certificates" },
    ]},
  ];

  const nav    = role==="admin" ? adminNav : agentNav;
  const titles = { dashboard:"Dashboard", reports:"Reports", clients:"Clients", modules:"Modules", lessons:"Lessons", agents:"Agents", signatures:"Signatures", training:"My Training", certificates:"My Certificates" };

  function renderView() {
    if (role==="admin") {
      const p = { agents, lessons, modules, clients, acknowledgments };
      switch(view) {
        case "dashboard":   return <AdminDashboard setView={setView} {...p}/>;
        case "clients":     return <AdminClients   clients={clients} setClients={setClients} modules={modules} agents={agents}/>;
        case "modules":     return <AdminModules   modules={modules} setModules={setModules} clients={clients} lessons={lessons}/>;
        case "lessons":     return <AdminLessons   lessons={lessons} setLessons={setLessons} modules={modules} clients={clients}/>;
        case "agents":      return <AdminAgents    agents={agents}   setAgents={setAgents}   {...p}/>;
        case "signatures":  return <AdminSignatures {...p}/>;
        case "reports":     return <AdminReports   {...p}/>;
        default:            return <AdminDashboard setView={setView} {...p}/>;
      }
    } else {
      switch(view) {
        case "training":    return <AgentTraining  agent={syncedAgent} setAgent={a=>{ setAgentSelf(a); setAgents(prev=>prev.map(ag=>ag.id===a.id?a:ag)); }} lessons={lessons} modules={modules} clients={clients} acknowledgments={acknowledgments} setAcknowledgments={setAcknowledgments}/>;
        case "certificates":return <AgentCertificates agent={syncedAgent} modules={modules} clients={clients} acknowledgments={acknowledgments} lessons={lessons}/>;
        default:            return <AgentTraining  agent={syncedAgent} setAgent={a=>{ setAgentSelf(a); setAgents(prev=>prev.map(ag=>ag.id===a.id?a:ag)); }} lessons={lessons} modules={modules} clients={clients} acknowledgments={acknowledgments} setAcknowledgments={setAcknowledgments}/>;
      }
    }
  }

  const userInitials = authUser ? authUser.name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2) : "?";

  return (
    <>
      <style>{CSS}</style>
      {authLoading ? (
        <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)"}}>
          <div style={{textAlign:"center",color:"var(--text3)",fontSize:14}}>Loading…</div>
        </div>
      ) : inviteToken ? (
        <AcceptInvitePage token={inviteToken} onActivated={onActivated}/>
      ) : !authUser ? (
        <LoginScreen onLogin={onLogin}/>
      ) : (
        <div className="app">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-logo">
              <div className="logo-icon">LV</div>
              <div>
                <div className="logo-text">Lead Virtual</div>
                <div className="logo-sub">Training Platform</div>
              </div>
            </div>
            <div className="sidebar-role-tag">{role==="admin"?"Admin Portal":"Agent Portal"}</div>
            <div className="nav-section">
              {nav.map(section=>(
                <div key={section.label}>
                  <span className="nav-group-label">{section.label}</span>
                  {section.items.map(item=>(
                    <div key={item.key} className={`nav-item ${view===item.key?"active":""}`} onClick={()=>setView(item.key)}>
                      <span style={{fontSize:15}}>{item.icon}</span>
                      {item.label}
                      {item.badge!=null && <span className="nav-badge">{item.badge}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="sidebar-footer">
              <div className={`avatar ${role==="admin"?"av-brand":"av-green"} avatar-lg`}>{userInitials}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="user-name">{authUser.name || authUser.email}</div>
                <div className="user-email">{authUser.email}</div>
              </div>
              <button className="btn btn-ghost btn-xs" onClick={logout} title="Sign out">↩</button>
            </div>
          </div>

          {/* Main */}
          <div className="main">
            <div className="topbar">
              <div className="topbar-title">{titles[view]||view}</div>
              {authUser.role === "superadmin" && <span style={{fontSize:10,fontFamily:"var(--mono)",background:"var(--amber-bg)",color:"var(--amber)",padding:"2px 8px",borderRadius:5,border:"1px solid rgba(217,119,6,.2)"}}>SUPER ADMIN</span>}
            </div>
            <div className="content">
              {renderView()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
