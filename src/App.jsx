import { useState, useEffect, useRef } from "react";

// ============================================================
// MOCK DATA & STATE
// ============================================================
const MOCK_CLIENTS = [
  { id: "c1", name: "TechCorp USA", color: "#6366f1", agents: 24, modules: 8 },
  { id: "c2", name: "FinanceHub", color: "#10b981", agents: 18, modules: 5 },
  { id: "c3", name: "RetailPro", color: "#f59e0b", agents: 31, modules: 12 },
];

const MOCK_MODULES = [
  { id: "m1", clientId: "c1", title: "Customer Service Fundamentals", role: "Support Agent", lessons: 6, completions: 18, total: 24, status: "published" },
  { id: "m2", clientId: "c1", title: "TechCorp Product Knowledge", role: "Sales Agent", lessons: 9, completions: 12, total: 24, status: "published" },
  { id: "m3", clientId: "c2", title: "Compliance & Regulations", role: "All", lessons: 4, completions: 16, total: 18, status: "published" },
  { id: "m4", clientId: "c3", title: "Retail Sales Techniques", role: "Sales Agent", lessons: 7, completions: 5, total: 31, status: "draft" },
  { id: "m5", clientId: "c1", title: "Escalation Procedures", role: "Support Agent", lessons: 3, completions: 22, total: 24, status: "published" },
];

const MOCK_LESSONS = [
  { id: "l1", moduleId: "m1", title: "Welcome & Orientation", type: "video", duration: "8 min", order: 1 },
  { id: "l2", moduleId: "m1", title: "Core Values & Mission", type: "pdf", duration: "5 min", order: 2 },
  { id: "l3", moduleId: "m1", title: "Communication Standards", type: "text", duration: "10 min", order: 3 },
  { id: "l4", moduleId: "m1", title: "Handling Escalations", type: "video", duration: "12 min", order: 4 },
  { id: "l5", moduleId: "m1", title: "Practice Quiz", type: "quiz", duration: "15 min", order: 5 },
  { id: "l6", moduleId: "m1", title: "Final Acknowledgment", type: "acknowledgment", duration: "5 min", order: 6 },
];

const MOCK_AGENTS = [
  { id: "a1", name: "Maria Santos", email: "m.santos@agency.com", client: "c1", role: "Support Agent", avatar: "MS", progress: 83, status: "In Progress" },
  { id: "a2", name: "James Okafor", email: "j.okafor@agency.com", client: "c1", role: "Sales Agent", avatar: "JO", progress: 100, status: "Completed" },
  { id: "a3", name: "Priya Nair", email: "p.nair@agency.com", client: "c2", role: "Support Agent", avatar: "PN", progress: 45, status: "In Progress" },
  { id: "a4", name: "Carlos Rivera", email: "c.rivera@agency.com", client: "c3", role: "Sales Agent", avatar: "CR", progress: 0, status: "Not Started" },
  { id: "a5", name: "Aisha Johnson", email: "a.johnson@agency.com", client: "c2", role: "All", avatar: "AJ", progress: 100, status: "Completed" },
  { id: "a6", name: "Wei Zhang", email: "w.zhang@agency.com", client: "c1", role: "Support Agent", avatar: "WZ", progress: 67, status: "In Progress" },
];

// ============================================================
// DESIGN TOKENS
// ============================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg: #0a0b0f;
    --surface: #111318;
    --surface2: #181c24;
    --surface3: #1e2330;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --text: #e8eaf0;
    --text2: #8891a8;
    --text3: #4a5266;
    --accent: #6d72f6;
    --accent2: #8b8ffe;
    --accent-glow: rgba(109,114,246,0.15);
    --green: #22c55e;
    --amber: #f59e0b;
    --red: #ef4444;
    --blue: #3b82f6;
    --radius: 12px;
    --radius-sm: 8px;
    --sidebar-w: 240px;
    --font: 'Sora', sans-serif;
    --mono: 'JetBrains Mono', monospace;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
  }
  
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; overflow: hidden; }
  
  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
  
  /* Layout */
  .app { display: flex; height: 100vh; overflow: hidden; }
  
  /* Sidebar */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    position: relative;
    z-index: 10;
  }
  .sidebar-logo {
    padding: 20px 20px 16px;
    border-bottom: 1px solid var(--border);
  }
  .logo-mark {
    display: flex; align-items: center; gap: 10px;
    font-size: 15px; font-weight: 700; letter-spacing: -0.3px; color: var(--text);
  }
  .logo-icon {
    width: 32px; height: 32px; background: var(--accent);
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-size: 16px;
  }
  .sidebar-role {
    margin-top: 8px; font-size: 10px; font-family: var(--mono);
    color: var(--text3); letter-spacing: 0.5px; text-transform: uppercase;
  }
  .nav-section { padding: 16px 12px 8px; flex: 1; overflow-y: auto; }
  .nav-label { font-size: 10px; font-family: var(--mono); color: var(--text3); letter-spacing: 1px; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; margin-top: 16px; }
  .nav-label:first-child { margin-top: 0; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 10px; border-radius: var(--radius-sm);
    font-size: 13.5px; font-weight: 500; color: var(--text2);
    cursor: pointer; transition: all 0.15s; margin-bottom: 2px;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent-glow); color: var(--accent2); border-color: rgba(109,114,246,0.2); }
  .nav-item .nav-icon { width: 16px; text-align: center; font-size: 14px; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: var(--surface3); color: var(--text3); font-size: 10px; font-family: var(--mono); padding: 1px 6px; border-radius: 10px; }
  .nav-item.active .nav-badge { background: rgba(109,114,246,0.2); color: var(--accent); }
  .sidebar-footer {
    padding: 12px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px; cursor: pointer;
  }
  .sidebar-footer:hover .user-name { color: var(--text); }
  .user-avatar { width: 32px; height: 32px; border-radius: 8px; background: var(--accent); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: var(--text2); }
  .user-email { font-size: 11px; color: var(--text3); }
  
  /* Main */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    height: 60px; background: var(--surface); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0;
  }
  .topbar-title { font-size: 15px; font-weight: 600; color: var(--text); flex: 1; }
  .topbar-actions { display: flex; align-items: center; gap: 8px; }
  .content { flex: 1; overflow-y: auto; padding: 24px; }
  
  /* Buttons */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px;
    font-weight: 600; font-family: var(--font); cursor: pointer; border: none;
    transition: all 0.15s; white-space: nowrap;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(109,114,246,0.35); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
  .btn-secondary:hover { background: var(--surface3); border-color: var(--accent); color: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--text2); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }
  
  /* Cards */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px;
  }
  .card:hover { border-color: var(--border2); }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .card-title { font-size: 14px; font-weight: 600; color: var(--text); }
  .card-subtitle { font-size: 12px; color: var(--text3); margin-top: 2px; }
  
  /* Stats Grid */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px; position: relative; overflow: hidden;
  }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-card.accent::before { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.amber::before { background: var(--amber); }
  .stat-card.blue::before { background: var(--blue); }
  .stat-label { font-size: 11px; font-family: var(--mono); color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-size: 28px; font-weight: 700; color: var(--text); margin: 6px 0 4px; letter-spacing: -1px; }
  .stat-change { font-size: 12px; color: var(--text3); }
  .stat-change.up { color: var(--green); }
  .stat-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 28px; opacity: 0.15; }
  
  /* Progress Bar */
  .progress-bar { height: 4px; background: var(--surface3); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .progress-fill.green { background: var(--green); }
  .progress-fill.accent { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .progress-fill.amber { background: var(--amber); }
  .progress-bar.lg { height: 6px; }
  .progress-bar.sm { height: 3px; }
  
  /* Table */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead th {
    font-size: 11px; font-family: var(--mono); color: var(--text3); text-transform: uppercase;
    letter-spacing: 0.5px; padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border);
    font-weight: 500;
  }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:hover { background: var(--surface2); }
  tbody tr:last-child { border-bottom: none; }
  td { padding: 12px 14px; font-size: 13px; color: var(--text2); vertical-align: middle; }
  td.primary { color: var(--text); font-weight: 500; }
  
  /* Badge */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: var(--mono);
    white-space: nowrap;
  }
  .badge.green { background: rgba(34,197,94,0.12); color: var(--green); }
  .badge.amber { background: rgba(245,158,11,0.12); color: var(--amber); }
  .badge.red { background: rgba(239,68,68,0.12); color: var(--red); }
  .badge.blue { background: rgba(59,130,246,0.12); color: var(--blue); }
  .badge.purple { background: var(--accent-glow); color: var(--accent2); }
  .badge.gray { background: var(--surface3); color: var(--text3); }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  
  /* Avatar */
  .avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .avatar-sm { width: 26px; height: 26px; font-size: 10px; border-radius: 6px; }
  
  /* Grid layouts */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .flex-row { display: flex; align-items: center; gap: 10px; }
  .flex-col { display: flex; flex-direction: column; gap: 6px; }
  .space-y { display: flex; flex-direction: column; gap: 16px; }
  
  /* Module Card */
  .module-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px; cursor: pointer;
    transition: all 0.15s;
  }
  .module-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(109,114,246,0.1); }
  .module-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .module-title { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.4; }
  .module-meta { display: flex; gap: 12px; margin: 10px 0; }
  .module-meta-item { font-size: 12px; color: var(--text3); display: flex; align-items: center; gap: 4px; }
  .client-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  
  /* Lesson Item */
  .lesson-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 14px; border-radius: var(--radius-sm);
    border: 1px solid var(--border); background: var(--surface2);
    margin-bottom: 8px; cursor: pointer; transition: all 0.15s;
  }
  .lesson-item:hover { border-color: var(--border2); background: var(--surface3); }
  .lesson-item.completed { opacity: 0.7; }
  .lesson-number { width: 24px; height: 24px; border-radius: 6px; background: var(--surface3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-family: var(--mono); color: var(--text3); flex-shrink: 0; }
  .lesson-number.done { background: rgba(34,197,94,0.15); color: var(--green); }
  .lesson-title { flex: 1; font-size: 13px; font-weight: 500; color: var(--text); }
  .lesson-type-icon { font-size: 14px; }
  
  /* Modal */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px);
    display: flex; align-items: center; justify-content: center; z-index: 100;
    animation: fadeIn 0.15s ease;
  }
  .modal {
    background: var(--surface); border: 1px solid var(--border2);
    border-radius: 16px; width: 560px; max-height: 85vh; overflow-y: auto;
    box-shadow: 0 24px 80px rgba(0,0,0,0.6);
    animation: slideUp 0.2s ease;
  }
  .modal-header { padding: 24px 24px 0; display: flex; justify-content: space-between; align-items: center; }
  .modal-title { font-size: 17px; font-weight: 700; color: var(--text); }
  .modal-body { padding: 20px 24px 24px; }
  .modal-footer { padding: 0 24px 24px; display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 4px; }
  .close-btn { background: none; border: none; color: var(--text3); font-size: 20px; cursor: pointer; padding: 2px; line-height: 1; transition: color 0.1s; }
  .close-btn:hover { color: var(--text); }
  
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  /* Form */
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; display: block; letter-spacing: 0.2px; }
  .form-input {
    width: 100%; padding: 9px 12px; background: var(--surface2); border: 1px solid var(--border2);
    border-radius: var(--radius-sm); color: var(--text); font-size: 13px; font-family: var(--font);
    transition: border-color 0.15s; outline: none;
  }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238891a8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
  textarea.form-input { min-height: 80px; resize: vertical; }
  
  /* Upload Zone */
  .upload-zone {
    border: 2px dashed var(--border2); border-radius: var(--radius);
    padding: 32px; text-align: center; cursor: pointer; transition: all 0.15s;
    background: var(--surface2);
  }
  .upload-zone:hover { border-color: var(--accent); background: var(--accent-glow); }
  .upload-icon { font-size: 32px; margin-bottom: 10px; }
  .upload-text { font-size: 13px; color: var(--text2); }
  .upload-subtext { font-size: 11px; color: var(--text3); margin-top: 4px; }
  
  /* Signature Pad */
  .sig-pad-wrap { border: 1px solid var(--border2); border-radius: var(--radius-sm); overflow: hidden; background: white; }
  
  /* Tabs */
  .tabs { display: flex; gap: 2px; background: var(--surface2); padding: 4px; border-radius: var(--radius-sm); width: fit-content; margin-bottom: 20px; }
  .tab { padding: 7px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text3); transition: all 0.15s; }
  .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
  
  /* Search */
  .search-input {
    padding: 7px 12px 7px 34px; background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); color: var(--text); font-size: 13px; font-family: var(--font);
    outline: none; width: 220px; transition: all 0.15s;
  }
  .search-input:focus { border-color: var(--accent); width: 280px; }
  .search-wrap { position: relative; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text3); font-size: 14px; pointer-events: none; }
  
  /* Section header */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-size: 15px; font-weight: 700; color: var(--text); }
  .section-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
  
  /* Client pill */
  .client-pill { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; color: var(--text2); transition: all 0.15s; }
  .client-pill.active { border-color: currentColor; color: var(--text); }
  .client-pill:hover { background: var(--surface3); }
  
  /* Certificate preview */
  .cert-preview {
    background: linear-gradient(135deg, #1a1f2e, #141824);
    border: 1px solid rgba(109,114,246,0.3); border-radius: 12px; padding: 32px; text-align: center;
    position: relative; overflow: hidden;
  }
  .cert-preview::before {
    content: ''; position: absolute; inset: 8px;
    border: 1px solid rgba(109,114,246,0.15); border-radius: 8px; pointer-events: none;
  }
  .cert-title { font-size: 11px; font-family: var(--mono); color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
  .cert-name { font-size: 26px; font-weight: 700; color: var(--text); margin-bottom: 8px; letter-spacing: -0.5px; }
  .cert-body { font-size: 13px; color: var(--text2); line-height: 1.6; max-width: 320px; margin: 0 auto 20px; }
  .cert-module { font-size: 16px; font-weight: 600; color: var(--accent2); margin-bottom: 20px; }
  .cert-meta { display: flex; justify-content: center; gap: 32px; font-size: 11px; font-family: var(--mono); color: var(--text3); }
  .cert-seal { font-size: 40px; margin-bottom: 12px; }
  
  /* Drag handle */
  .drag-handle { color: var(--text3); cursor: grab; padding: 0 4px; font-size: 16px; }
  .drag-handle:active { cursor: grabbing; }
  
  /* Empty state */
  .empty-state { text-align: center; padding: 48px 24px; color: var(--text3); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-title { font-size: 15px; font-weight: 600; color: var(--text2); margin-bottom: 6px; }
  .empty-text { font-size: 13px; }
  
  /* Notification dot */
  .notif-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; }
  
  /* Divider */
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  
  /* Tooltip-like label */
  .tag { display: inline-block; padding: 2px 7px; background: var(--surface3); border-radius: 4px; font-size: 11px; color: var(--text3); font-family: var(--mono); }
  
  /* Scroll area */
  .scroll-area { overflow-y: auto; max-height: 400px; }
  
  /* Color variants for avatars */
  .av-purple { background: rgba(109,114,246,0.25); color: var(--accent2); }
  .av-green { background: rgba(34,197,94,0.2); color: var(--green); }
  .av-amber { background: rgba(245,158,11,0.2); color: var(--amber); }
  .av-blue { background: rgba(59,130,246,0.2); color: var(--blue); }
  .av-red { background: rgba(239,68,68,0.2); color: var(--red); }
  
  /* Responsive */
  @media (max-width: 1100px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .grid-3 { grid-template-columns: repeat(2, 1fr); }
  }
`;

// ============================================================
// COMPONENTS
// ============================================================

function Sidebar({ role, activeView, setActiveView }) {
  const adminNav = [
    { label: "Overview", items: [
      { key: "dashboard", icon: "⬡", label: "Dashboard" },
      { key: "analytics", icon: "◈", label: "Analytics" },
    ]},
    { label: "Content", items: [
      { key: "modules", icon: "▦", label: "Modules", badge: MOCK_MODULES.length },
      { key: "lessons", icon: "▤", label: "Lessons" },
      { key: "clients", icon: "◉", label: "Clients", badge: MOCK_CLIENTS.length },
    ]},
    { label: "People", items: [
      { key: "agents", icon: "◎", label: "Agents", badge: MOCK_AGENTS.length },
      { key: "assignments", icon: "⊞", label: "Assignments" },
    ]},
    { label: "Compliance", items: [
      { key: "signatures", icon: "✦", label: "Signatures" },
      { key: "reports", icon: "⊟", label: "Reports" },
    ]},
  ];
  
  const agentNav = [
    { label: "Training", items: [
      { key: "agent-home", icon: "⬡", label: "My Training" },
      { key: "agent-progress", icon: "◈", label: "Progress" },
      { key: "agent-history", icon: "⊟", label: "History" },
    ]},
    { label: "Achievements", items: [
      { key: "agent-certs", icon: "✦", label: "Certificates" },
    ]},
  ];
  
  const nav = role === "admin" ? adminNav : agentNav;
  
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">⬢</div>
          ProLearn
        </div>
        <div className="sidebar-role">{role === "admin" ? "Admin Portal" : "Agent Portal"}</div>
      </div>
      <div className="nav-section">
        {nav.map(section => (
          <div key={section.label}>
            <div className="nav-label">{section.label}</div>
            {section.items.map(item => (
              <div
                key={item.key}
                className={`nav-item ${activeView === item.key ? "active" : ""}`}
                onClick={() => setActiveView(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
                {item.badge && <span className="nav-badge">{item.badge}</span>}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="sidebar-footer">
        <div className={`user-avatar av-${role === "admin" ? "purple" : "blue"}`}>
          {role === "admin" ? "AD" : "MA"}
        </div>
        <div>
          <div className="user-name">{role === "admin" ? "Admin User" : "Maria Santos"}</div>
          <div className="user-email">{role === "admin" ? "admin@prolearn.io" : "m.santos@agency.com"}</div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, change, icon, variant, up }) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${up ? "up" : ""}`}>{change}</div>
      <div className="stat-icon">{icon}</div>
    </div>
  );
}

// ============================================================
// VIEWS — ADMIN
// ============================================================

function DashboardView({ setActiveView }) {
  const completionRate = Math.round((MOCK_AGENTS.filter(a => a.status === "Completed").length / MOCK_AGENTS.length) * 100);
  
  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total Agents" value="73" change="↑ 12 this month" icon="◎" variant="accent" up />
        <StatCard label="Completion Rate" value={`${completionRate}%`} change="↑ 8% vs last month" icon="✓" variant="green" up />
        <StatCard label="Active Modules" value="5" change="2 drafts pending" icon="▦" variant="amber" />
        <StatCard label="Pending Signatures" value="11" change="3 expiring soon" icon="✦" variant="blue" />
      </div>
      
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Completion by Client</div>
              <div className="card-subtitle">Active training progress</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={() => setActiveView("analytics")}>View all</button>
          </div>
          {MOCK_CLIENTS.map(client => {
            const clientAgents = MOCK_AGENTS.filter(a => a.client === client.id);
            const avg = clientAgents.length ? Math.round(clientAgents.reduce((s, a) => s + a.progress, 0) / clientAgents.length) : 0;
            return (
              <div key={client.id} style={{ marginBottom: 14 }}>
                <div className="flex-row" style={{ marginBottom: 6 }}>
                  <div className="client-dot" style={{ background: client.color }}></div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", flex: 1 }}>{client.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text3)" }}>{avg}%</span>
                </div>
                <div className="progress-bar lg">
                  <div className="progress-fill accent" style={{ width: `${avg}%`, background: client.color }}></div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Activity</div>
              <div className="card-subtitle">Last 24 hours</div>
            </div>
          </div>
          <div className="space-y">
            {[
              { agent: "James Okafor", action: "Completed module", module: "Customer Service", time: "2h ago", color: "av-green" },
              { agent: "Aisha Johnson", action: "Signed acknowledgment", module: "Compliance", time: "4h ago", color: "av-amber" },
              { agent: "Wei Zhang", action: "Started lesson 5", module: "Customer Service", time: "5h ago", color: "av-blue" },
              { agent: "Priya Nair", action: "Uploaded response", module: "Compliance", time: "8h ago", color: "av-purple" },
            ].map((item, i) => (
              <div key={i} className="flex-row">
                <div className={`avatar av-sm ${item.color}`}>{item.agent.split(" ").map(n => n[0]).join("")}</div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{item.agent}</span>
                  <span style={{ fontSize: 13, color: "var(--text3)" }}> {item.action}</span>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{item.module}</div>
                </div>
                <span className="tag">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="divider"></div>
      
      <div className="section-header">
        <div>
          <div className="section-title">Agent Status Overview</div>
          <div className="section-sub">Training progress across all agents</div>
        </div>
        <button className="btn btn-secondary btn-sm" onClick={() => setActiveView("agents")}>Manage Agents →</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th>
            </tr></thead>
            <tbody>
              {MOCK_AGENTS.slice(0,5).map(agent => {
                const client = MOCK_CLIENTS.find(c => c.id === agent.client);
                const colors = ["av-purple","av-green","av-amber","av-blue","av-red"];
                return (
                  <tr key={agent.id}>
                    <td>
                      <div className="flex-row">
                        <div className={`avatar ${colors[MOCK_AGENTS.indexOf(agent) % colors.length]}`}>{agent.avatar}</div>
                        <div>
                          <div style={{ color: "var(--text)", fontWeight: 500, fontSize: 13 }}>{agent.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>{agent.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex-row">
                        <div className="client-dot" style={{ background: client?.color }}></div>
                        {client?.name}
                      </div>
                    </td>
                    <td>{agent.role}</td>
                    <td style={{ minWidth: 140 }}>
                      <div className="flex-row">
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${agent.progress}%`, background: agent.progress === 100 ? "var(--green)" : agent.progress > 0 ? "var(--accent)" : "var(--text3)" }}></div>
                        </div>
                        <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text3)", minWidth: 32, textAlign: "right" }}>{agent.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${agent.status === "Completed" ? "green" : agent.status === "In Progress" ? "blue" : "gray"}`}>
                        <span className="badge-dot"></span>{agent.status}
                      </span>
                    </td>
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

function ModulesView() {
  const [filter, setFilter] = useState("all");
  const [showCreate, setShowCreate] = useState(false);
  const [modules, setModules] = useState(MOCK_MODULES);
  
  const filtered = filter === "all" ? modules : modules.filter(m => m.clientId === filter);
  
  function getTypeIcon(type) {
    return { video: "▶", pdf: "⊡", text: "≡", quiz: "◈", acknowledgment: "✦", audio: "♪", doc: "⊟", image: "⊞" }[type] || "⊡";
  }
  
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Training Modules</div>
          <div className="section-sub">{modules.length} modules across {MOCK_CLIENTS.length} clients</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowCreate(true)}>+ New Module</button>
      </div>
      
      <div className="flex-row" style={{ marginBottom: 20, flexWrap: "wrap", gap: 8 }}>
        <div className={`client-pill ${filter === "all" ? "active" : ""}`} onClick={() => setFilter("all")}>
          All Clients
        </div>
        {MOCK_CLIENTS.map(c => (
          <div key={c.id} className={`client-pill ${filter === c.id ? "active" : ""}`} style={{ color: filter === c.id ? c.color : "" }} onClick={() => setFilter(c.id)}>
            <div className="client-dot" style={{ background: c.color }}></div>
            {c.name}
          </div>
        ))}
      </div>
      
      <div className="grid-3">
        {filtered.map(module => {
          const client = MOCK_CLIENTS.find(c => c.id === module.clientId);
          const pct = Math.round((module.completions / module.total) * 100);
          return (
            <div key={module.id} className="module-card">
              <div className="module-card-header">
                <span className={`badge ${module.status === "published" ? "green" : "amber"}`}>
                  {module.status}
                </span>
                <button className="btn btn-ghost btn-sm">⋯</button>
              </div>
              <div className="module-title">{module.title}</div>
              <div className="module-meta">
                <div className="module-meta-item">
                  <div className="client-dot" style={{ background: client?.color }}></div>
                  {client?.name}
                </div>
                <div className="module-meta-item">▤ {module.lessons} lessons</div>
              </div>
              <div className="tag" style={{ marginBottom: 14 }}>{module.role}</div>
              <div className="divider" style={{ margin: "12px 0" }}></div>
              <div className="flex-row" style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: "var(--text3)", flex: 1 }}>Completions</span>
                <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text2)" }}>{module.completions}/{module.total}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--accent)" }}></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {showCreate && (
        <div className="modal-overlay" onClick={e => e.target.className.includes("modal-overlay") && setShowCreate(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Create Training Module</div>
              <button className="close-btn" onClick={() => setShowCreate(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Module Title</label>
                <input className="form-input" placeholder="e.g. Customer Service Fundamentals" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <select className="form-input form-select">
                    {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Role</label>
                  <select className="form-input form-select">
                    <option>Support Agent</option>
                    <option>Sales Agent</option>
                    <option>All</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" placeholder="Brief description of this training module..." />
              </div>
              <div className="form-group">
                <label className="form-label">Content Upload</label>
                <div className="upload-zone">
                  <div className="upload-icon">⊞</div>
                  <div className="upload-text">Drop files here or click to browse</div>
                  <div className="upload-subtext">PDF, DOCX, MP4, MP3, PNG, JPG • Max 500MB</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="form-input form-select">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowCreate(false)}>Create Module</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LessonsView() {
  const [selectedModule, setSelectedModule] = useState("m1");
  const [lessons, setLessons] = useState(MOCK_LESSONS);
  const [dragging, setDragging] = useState(null);
  
  const module = MOCK_MODULES.find(m => m.id === selectedModule);
  const modLessons = lessons.filter(l => l.moduleId === selectedModule).sort((a,b) => a.order - b.order);
  
  const typeIcon = { video: "▶", pdf: "⊡", text: "≡", quiz: "◈", acknowledgment: "✦", audio: "♪" };
  const typeBadge = { video: "blue", pdf: "amber", text: "gray", quiz: "purple", acknowledgment: "green", audio: "green" };
  
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Lesson Builder</div>
          <div className="section-sub">Drag to reorder lessons</div>
        </div>
        <button className="btn btn-primary">+ Add Lesson</button>
      </div>
      
      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>Select Module</div>
          <div className="space-y">
            {MOCK_MODULES.map(m => {
              const client = MOCK_CLIENTS.find(c => c.id === m.clientId);
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedModule(m.id)}
                  style={{
                    padding: "12px 14px", borderRadius: "var(--radius-sm)",
                    border: `1px solid ${m.id === selectedModule ? "var(--accent)" : "var(--border)"}`,
                    background: m.id === selectedModule ? "var(--accent-glow)" : "var(--surface)",
                    cursor: "pointer", transition: "all 0.15s"
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{m.title}</div>
                  <div className="flex-row">
                    <div className="client-dot" style={{ background: client?.color }}></div>
                    <span style={{ fontSize: 12, color: "var(--text3)" }}>{client?.name} • {m.lessons} lessons</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>{module?.title} — Lessons</div>
          <div>
            {modLessons.map((lesson, i) => (
              <div key={lesson.id} className="lesson-item">
                <span className="drag-handle">⠿</span>
                <div className="lesson-number">{i + 1}</div>
                <span style={{ fontSize: 16, marginRight: 2 }}>{typeIcon[lesson.type] || "⊡"}</span>
                <div style={{ flex: 1 }}>
                  <div className="lesson-title">{lesson.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{lesson.duration}</div>
                </div>
                <span className={`badge ${typeBadge[lesson.type] || "gray"}`}>{lesson.type}</span>
                <button className="btn btn-ghost btn-sm">✎</button>
              </div>
            ))}
            <div
              style={{
                border: "2px dashed var(--border)", borderRadius: "var(--radius-sm)",
                padding: "14px", textAlign: "center", fontSize: 13, color: "var(--text3)",
                cursor: "pointer", marginTop: 8, transition: "all 0.15s"
              }}
              onMouseEnter={e => e.target.style.borderColor = "var(--accent)"}
              onMouseLeave={e => e.target.style.borderColor = "var(--border)"}
            >
              + Add lesson to this module
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentsView() {
  const [search, setSearch] = useState("");
  const [filterClient, setFilterClient] = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  
  const colors = ["av-purple","av-green","av-amber","av-blue","av-red"];
  
  const filtered = MOCK_AGENTS.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase());
    const matchClient = filterClient === "all" || a.client === filterClient;
    return matchSearch && matchClient;
  });
  
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Agents</div>
          <div className="section-sub">{MOCK_AGENTS.length} total agents</div>
        </div>
        <div className="flex-row">
          <div className="search-wrap">
            <span className="search-icon">⊕</span>
            <input className="search-input" placeholder="Search agents..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button className="btn btn-primary" onClick={() => setShowInvite(true)}>+ Invite Agent</button>
        </div>
      </div>
      
      <div className="flex-row" style={{ marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div className={`client-pill ${filterClient === "all" ? "active" : ""}`} onClick={() => setFilterClient("all")}>All</div>
        {MOCK_CLIENTS.map(c => (
          <div key={c.id} className={`client-pill ${filterClient === c.id ? "active" : ""}`} style={{ color: filterClient === c.id ? c.color : "" }} onClick={() => setFilterClient(c.id)}>
            <div className="client-dot" style={{ background: c.color }}></div>{c.name}
          </div>
        ))}
      </div>
      
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {filtered.map((agent, i) => {
                const client = MOCK_CLIENTS.find(c => c.id === agent.client);
                return (
                  <tr key={agent.id}>
                    <td>
                      <div className="flex-row">
                        <div className={`avatar ${colors[i % colors.length]}`}>{agent.avatar}</div>
                        <div>
                          <div style={{ color: "var(--text)", fontWeight: 500, fontSize: 13 }}>{agent.name}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)" }}>{agent.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex-row">
                        <div className="client-dot" style={{ background: client?.color }}></div>
                        {client?.name}
                      </div>
                    </td>
                    <td><span className="tag">{agent.role}</span></td>
                    <td style={{ minWidth: 160 }}>
                      <div className="flex-row">
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-fill" style={{ width: `${agent.progress}%`, background: agent.progress === 100 ? "var(--green)" : agent.progress > 0 ? "var(--accent)" : "var(--surface3)" }}></div>
                        </div>
                        <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text3)", minWidth: 32, textAlign: "right" }}>{agent.progress}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${agent.status === "Completed" ? "green" : agent.status === "In Progress" ? "blue" : "gray"}`}>
                        <span className="badge-dot"></span>{agent.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex-row">
                        <button className="btn btn-ghost btn-sm">View</button>
                        <button className="btn btn-ghost btn-sm">Assign</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {showInvite && (
        <div className="modal-overlay" onClick={e => e.target.className.includes("modal-overlay") && setShowInvite(false)}>
          <div className="modal">
            <div className="modal-header">
              <div className="modal-title">Invite New Agent</div>
              <button className="close-btn" onClick={() => setShowInvite(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="John" />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Doe" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input className="form-input" type="email" placeholder="agent@company.com" />
              </div>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Assign to Client</label>
                  <select className="form-input form-select">
                    {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-input form-select">
                    <option>Support Agent</option>
                    <option>Sales Agent</option>
                    <option>All</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Auto-assign Training</label>
                <select className="form-input form-select">
                  <option>Based on role & client</option>
                  <option>Select manually</option>
                  <option>No auto-assignment</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowInvite(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => setShowInvite(false)}>Send Invite</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SignaturesView() {
  const signed = MOCK_AGENTS.filter(a => a.status === "Completed");
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Signed Acknowledgments</div>
          <div className="section-sub">{signed.length} completed signatures on file</div>
        </div>
        <button className="btn btn-secondary">⤓ Export All</button>
      </div>
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Agent</th><th>Module</th><th>Signed At</th><th>IP Address</th><th>Status</th><th>Actions</th>
            </tr></thead>
            <tbody>
              {signed.map((agent, i) => (
                <tr key={agent.id}>
                  <td>
                    <div className="flex-row">
                      <div className={`avatar av-green`}>{agent.avatar}</div>
                      <div>
                        <div style={{ color: "var(--text)", fontWeight: 500, fontSize: 13 }}>{agent.name}</div>
                        <div style={{ fontSize: 11, color: "var(--text3)" }}>{agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: "var(--text)", fontSize: 13 }}>Customer Service Fundamentals</td>
                  <td>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>Feb 28, 2026</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>14:{(i+1)*7}:32 UTC</div>
                  </td>
                  <td><span className="tag">192.168.{i+1}.{i*10+4}</span></td>
                  <td><span className="badge green"><span className="badge-dot"></span>Verified</span></td>
                  <td>
                    <div className="flex-row">
                      <button className="btn btn-ghost btn-sm">View</button>
                      <button className="btn btn-ghost btn-sm">⤓ PDF</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ReportsView() {
  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Completion Reports</div>
          <div className="section-sub">Export and analyze training data</div>
        </div>
        <div className="flex-row">
          <button className="btn btn-secondary">⤓ Export CSV</button>
          <button className="btn btn-primary">⤓ Export PDF Report</button>
        </div>
      </div>
      
      <div className="grid-3" style={{ marginBottom: 20 }}>
        {MOCK_CLIENTS.map(client => {
          const clientAgents = MOCK_AGENTS.filter(a => a.client === client.id);
          const completed = clientAgents.filter(a => a.status === "Completed").length;
          const inProgress = clientAgents.filter(a => a.status === "In Progress").length;
          const notStarted = clientAgents.filter(a => a.status === "Not Started").length;
          return (
            <div key={client.id} className="card">
              <div className="card-header" style={{ marginBottom: 12 }}>
                <div className="flex-row">
                  <div className="client-dot" style={{ background: client.color, width: 10, height: 10 }}></div>
                  <div className="card-title">{client.name}</div>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div className="flex-row" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--green)", flex: 1 }}>● Completed</span>
                  <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--text)" }}>{completed}</span>
                </div>
                <div className="flex-row" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--blue)", flex: 1 }}>● In Progress</span>
                  <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--text)" }}>{inProgress}</span>
                </div>
                <div className="flex-row">
                  <span style={{ fontSize: 12, color: "var(--text3)", flex: 1 }}>● Not Started</span>
                  <span style={{ fontSize: 13, fontFamily: "var(--mono)", color: "var(--text)" }}>{notStarted}</span>
                </div>
              </div>
              <div className="divider" style={{ margin: "10px 0" }}></div>
              <div style={{ display: "flex", height: 8, borderRadius: 4, overflow: "hidden", gap: 2 }}>
                <div style={{ flex: completed, background: "var(--green)", borderRadius: 4 }}></div>
                <div style={{ flex: inProgress, background: "var(--accent)", borderRadius: 4 }}></div>
                <div style={{ flex: notStarted || 0.1, background: "var(--surface3)", borderRadius: 4 }}></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Detailed Report</div>
          <div className="flex-row">
            <select className="form-input form-select" style={{ width: "auto", fontSize: 12, padding: "5px 28px 5px 10px" }}>
              <option>All Clients</option>
              {MOCK_CLIENTS.map(c => <option key={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr>
              <th>Agent</th><th>Client</th><th>Module</th><th>Progress</th><th>Status</th><th>Signed</th>
            </tr></thead>
            <tbody>
              {MOCK_AGENTS.map((agent, i) => {
                const client = MOCK_CLIENTS.find(c => c.id === agent.client);
                return (
                  <tr key={agent.id}>
                    <td className="primary">{agent.name}</td>
                    <td>
                      <div className="flex-row">
                        <div className="client-dot" style={{ background: client?.color }}></div>
                        {client?.name}
                      </div>
                    </td>
                    <td>Customer Service Fundamentals</td>
                    <td>{agent.progress}%</td>
                    <td>
                      <span className={`badge ${agent.status === "Completed" ? "green" : agent.status === "In Progress" ? "blue" : "gray"}`}>
                        {agent.status}
                      </span>
                    </td>
                    <td>
                      {agent.status === "Completed"
                        ? <span className="badge green">✓ Yes</span>
                        : <span className="badge gray">—</span>}
                    </td>
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

function AnalyticsView() {
  const weeks = ["W1","W2","W3","W4","W5","W6","W7","W8"];
  const completionData = [8,14,19,27,35,41,52,61];
  const maxVal = Math.max(...completionData);
  
  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">Analytics</div><div className="section-sub">Training performance over time</div></div>
      </div>
      <div className="stats-grid">
        <StatCard label="Avg. Time to Complete" value="4.2d" change="Per module average" icon="⏱" variant="accent" />
        <StatCard label="Pass Rate" value="94%" change="↑ 3% this month" icon="✓" variant="green" up />
        <StatCard label="Dropout Rate" value="6%" change="↓ 2% improvement" icon="↓" variant="amber" up />
        <StatCard label="Certs Issued" value="47" change="↑ 12 this month" icon="✦" variant="blue" up />
      </div>
      <div className="card">
        <div className="card-header">
          <div className="card-title">Completions Over Time</div>
          <span className="tag">Last 8 weeks</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 160, paddingTop: 20 }}>
          {completionData.map((val, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--text3)" }}>{val}</span>
              <div
                style={{
                  width: "100%", borderRadius: "6px 6px 2px 2px",
                  height: `${(val / maxVal) * 120}px`,
                  background: `linear-gradient(180deg, var(--accent2), var(--accent))`,
                  opacity: 0.7 + (i / completionData.length) * 0.3,
                  transition: "height 0.3s"
                }}
              ></div>
              <span style={{ fontSize: 10, fontFamily: "var(--mono)", color: "var(--text3)" }}>{weeks[i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClientsView() {
  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">Clients</div><div className="section-sub">Manage client organizations</div></div>
        <button className="btn btn-primary">+ Add Client</button>
      </div>
      <div className="grid-3">
        {MOCK_CLIENTS.map(client => {
          const clientAgents = MOCK_AGENTS.filter(a => a.client === client.id);
          const completed = clientAgents.filter(a => a.status === "Completed").length;
          return (
            <div key={client.id} className="card" style={{ cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: client.color + "25", border: `1px solid ${client.color}40`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, fontSize: 20 }}>◉</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>{client.name}</div>
              <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 14 }}>Active client</div>
              <div className="divider" style={{ margin: "12px 0" }}></div>
              <div className="grid-2" style={{ gap: 8 }}>
                <div style={{ textAlign: "center", padding: "10px 0", background: "var(--surface2)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{clientAgents.length}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Agents</div>
                </div>
                <div style={{ textAlign: "center", padding: "10px 0", background: "var(--surface2)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{client.modules}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>Modules</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="flex-row" style={{ marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: "var(--text3)", flex: 1 }}>Completion</span>
                  <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--text2)" }}>{completed}/{clientAgents.length}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${(completed/clientAgents.length)*100}%`, background: client.color }}></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssignmentsView() {
  const [selectedAgent, setSelectedAgent] = useState(MOCK_AGENTS[0]);
  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">Training Assignments</div><div className="section-sub">Assign modules to agents</div></div>
        <button className="btn btn-primary">Bulk Assign</button>
      </div>
      <div className="grid-2" style={{ gap: 20 }}>
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>Select Agent</div>
          <div className="space-y">
            {MOCK_AGENTS.map((agent, i) => {
              const colors = ["av-purple","av-green","av-amber","av-blue","av-red"];
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  style={{
                    padding: "12px 14px", borderRadius: "var(--radius-sm)",
                    border: `1px solid ${agent.id === selectedAgent.id ? "var(--accent)" : "var(--border)"}`,
                    background: agent.id === selectedAgent.id ? "var(--accent-glow)" : "var(--surface)",
                    cursor: "pointer", transition: "all 0.15s", display: "flex", alignItems: "center", gap: 10
                  }}
                >
                  <div className={`avatar ${colors[i % colors.length]}`}>{agent.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{agent.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)" }}>{agent.role}</div>
                  </div>
                  <span className={`badge ${agent.status === "Completed" ? "green" : agent.status === "In Progress" ? "blue" : "gray"}`}>{agent.progress}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <div className="card-title" style={{ marginBottom: 12 }}>Assigned Modules — {selectedAgent.name}</div>
          <div className="space-y">
            {MOCK_MODULES.map(m => {
              const client = MOCK_CLIENTS.find(c => c.id === m.clientId);
              const isAssigned = m.clientId === selectedAgent.client;
              return (
                <div key={m.id} style={{
                  padding: "12px 14px", borderRadius: "var(--radius-sm)",
                  border: `1px solid ${isAssigned ? "rgba(34,197,94,0.3)" : "var(--border)"}`,
                  background: isAssigned ? "rgba(34,197,94,0.05)" : "var(--surface2)",
                  display: "flex", alignItems: "center", gap: 10
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", marginBottom: 3 }}>{m.title}</div>
                    <div className="flex-row">
                      <div className="client-dot" style={{ background: client?.color }}></div>
                      <span style={{ fontSize: 11, color: "var(--text3)" }}>{client?.name} • {m.lessons} lessons</span>
                    </div>
                  </div>
                  <button className={`btn btn-sm ${isAssigned ? "btn-danger" : "btn-secondary"}`}>
                    {isAssigned ? "Remove" : "Assign"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// VIEWS — AGENT
// ============================================================

function AgentHomeView() {
  const [activeLessonModule, setActiveLessonModule] = useState(null);
  const [completedLessons, setCompletedLessons] = useState(["l1","l2"]);
  const [showAck, setShowAck] = useState(false);
  const [signed, setSigned] = useState(false);
  const [sigData, setSigData] = useState("");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  const myModules = MOCK_MODULES.filter(m => m.clientId === "c1");
  
  const typeIcon = { video: "▶", pdf: "⊡", text: "≡", quiz: "◈", acknowledgment: "✦" };
  
  function startDraw(e) {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  }
  function draw(e) {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = "#1a1a2e";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  function endDraw() { setIsDrawing(false); if(canvasRef.current) setSigData(canvasRef.current.toDataURL()); }
  function clearSig() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
    setSigData("");
  }
  
  if (activeLessonModule) {
    const module = MOCK_MODULES.find(m => m.id === activeLessonModule);
    const lessons = MOCK_LESSONS.filter(l => l.moduleId === activeLessonModule).sort((a,b) => a.order - b.order);
    const done = lessons.filter(l => completedLessons.includes(l.id)).length;
    const pct = Math.round((done / lessons.length) * 100);
    
    return (
      <div>
        <div className="flex-row" style={{ marginBottom: 20 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => setActiveLessonModule(null)}>← Back</button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>{module?.title}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{done}/{lessons.length} completed</div>
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: "var(--mono)", color: "var(--accent)" }}>{pct}%</span>
        </div>
        <div className="progress-bar lg" style={{ marginBottom: 24 }}>
          <div className="progress-fill accent" style={{ width: `${pct}%` }}></div>
        </div>
        <div className="space-y">
          {lessons.map((lesson, i) => {
            const done = completedLessons.includes(lesson.id);
            return (
              <div key={lesson.id} className={`lesson-item ${done ? "completed" : ""}`} style={{ background: done ? "rgba(34,197,94,0.05)" : "var(--surface2)", border: done ? "1px solid rgba(34,197,94,0.2)" : "1px solid var(--border)" }}>
                <div className={`lesson-number ${done ? "done" : ""}`}>{done ? "✓" : i+1}</div>
                <span style={{ fontSize: 16, marginRight: 2 }}>{typeIcon[lesson.type] || "⊡"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{lesson.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{lesson.duration} • {lesson.type}</div>
                </div>
                {lesson.type === "acknowledgment" ? (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowAck(true)}
                  >
                    {done ? "View" : "Complete"}
                  </button>
                ) : (
                  <button
                    className={`btn btn-sm ${done ? "btn-ghost" : "btn-secondary"}`}
                    onClick={() => setCompletedLessons(prev => done ? prev.filter(id => id !== lesson.id) : [...prev, lesson.id])}
                  >
                    {done ? "✓ Done" : "Mark Complete"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        
        {showAck && !signed && (
          <div className="modal-overlay" onClick={e => e.target.className.includes("modal-overlay") && setShowAck(false)}>
            <div className="modal" style={{ width: 620 }}>
              <div className="modal-header">
                <div>
                  <div className="modal-title">Training Acknowledgment</div>
                  <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>Please read carefully before signing</div>
                </div>
                <button className="close-btn" onClick={() => setShowAck(false)}>×</button>
              </div>
              <div className="modal-body">
                <div style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "16px", marginBottom: 16, fontSize: 13, color: "var(--text2)", lineHeight: 1.7 }}>
                  <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: 8 }}>Acknowledgment of Training Completion</p>
                  <p>I, the undersigned, hereby acknowledge that I have completed the training module <strong style={{ color: "var(--text)" }}>{module?.title}</strong> in its entirety.</p>
                  <p style={{ marginTop: 8 }}>I confirm that I have read, understood, and agree to comply with all policies, procedures, and guidelines outlined in this training program for <strong style={{ color: "var(--text)" }}>TechCorp USA</strong>.</p>
                  <p style={{ marginTop: 8 }}>I understand that non-compliance with these policies may result in disciplinary action.</p>
                </div>
                <div className="form-group">
                  <label className="form-label">Digital Signature <span style={{ color: "var(--red)" }}>*</span></label>
                  <div className="sig-pad-wrap">
                    <canvas
                      ref={canvasRef}
                      width={510} height={120}
                      style={{ display: "block", cursor: "crosshair" }}
                      onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
                    />
                  </div>
                  <div className="flex-row" style={{ marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: "var(--text3)" }}>Sign above using your mouse</span>
                    <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto" }} onClick={clearSig}>Clear</button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Full Name (confirmation)</label>
                  <input className="form-input" placeholder="Type your full name" />
                </div>
                <div style={{ background: "rgba(109,114,246,0.08)", border: "1px solid rgba(109,114,246,0.2)", borderRadius: "var(--radius-sm)", padding: 12, fontSize: 12, color: "var(--text3)" }}>
                  🕐 This signature will be timestamped and recorded with your IP address for compliance purposes.
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAck(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => {
                  setSigned(true);
                  setShowAck(false);
                  setCompletedLessons(prev => [...prev, "l6"]);
                }}>
                  ✦ Submit Acknowledgment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Welcome back, Maria 👋</div>
        <div style={{ fontSize: 13, color: "var(--text3)" }}>You have {myModules.length} training modules assigned</div>
      </div>
      
      <div className="stats-grid">
        <StatCard label="Assigned Modules" value={myModules.length} change="2 in progress" icon="▦" variant="accent" />
        <StatCard label="Overall Progress" value="83%" change="Updated today" icon="◈" variant="green" up />
        <StatCard label="Completed" value="1" change="1 certificate earned" icon="✦" variant="amber" up />
        <StatCard label="Pending Actions" value="2" change="Lessons to complete" icon="▤" variant="blue" />
      </div>
      
      <div className="section-header">
        <div className="section-title">My Training</div>
      </div>
      <div className="space-y">
        {myModules.map(module => {
          const client = MOCK_CLIENTS.find(c => c.id === module.clientId);
          const lessons = MOCK_LESSONS.filter(l => l.moduleId === module.id);
          const completed = lessons.filter(l => completedLessons.includes(l.id)).length;
          const pct = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;
          return (
            <div key={module.id} className="card" style={{ display: "flex", gap: 20, alignItems: "center", cursor: "pointer" }} onClick={() => setActiveLessonModule(module.id)}>
              <div style={{ width: 52, height: 52, borderRadius: 12, background: client?.color + "20", border: `1px solid ${client?.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>▦</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 3 }}>{module.title}</div>
                <div className="flex-row" style={{ marginBottom: 8 }}>
                  <div className="client-dot" style={{ background: client?.color }}></div>
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>{client?.name} • {module.lessons} lessons</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${pct}%`, background: pct === 100 ? "var(--green)" : "var(--accent)" }}></div>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: pct === 100 ? "var(--green)" : "var(--accent)", fontFamily: "var(--mono)" }}>{pct}%</div>
                <span className={`badge ${pct === 100 ? "green" : pct > 0 ? "blue" : "gray"}`}>
                  {pct === 100 ? "Completed" : pct > 0 ? "In Progress" : "Not Started"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AgentCertsView() {
  return (
    <div>
      <div className="section-header">
        <div><div className="section-title">My Certificates</div><div className="section-sub">Earned training certificates</div></div>
      </div>
      <div className="cert-preview">
        <div className="cert-seal">🏆</div>
        <div className="cert-title">Certificate of Completion</div>
        <div style={{ fontSize: 13, color: "var(--text3)", marginBottom: 4 }}>This certifies that</div>
        <div className="cert-name">Maria Santos</div>
        <div className="cert-body">has successfully completed all required training and demonstrated understanding of the policies and procedures for</div>
        <div className="cert-module">Customer Service Fundamentals</div>
        <div className="cert-meta">
          <div><div style={{ color: "var(--text3)", marginBottom: 2 }}>CLIENT</div>TechCorp USA</div>
          <div><div style={{ color: "var(--text3)", marginBottom: 2 }}>COMPLETED</div>Feb 28, 2026</div>
          <div><div style={{ color: "var(--text3)", marginBottom: 2 }}>CERT ID</div>PL-2026-0421</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "center" }}>
        <button className="btn btn-secondary">⤓ Download PDF</button>
        <button className="btn btn-ghost">Share</button>
      </div>
    </div>
  );
}

// ============================================================
// LOGIN SCREEN
// ============================================================
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, background: "var(--accent)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, margin: "0 auto 16px" }}>⬢</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: "var(--text)", letterSpacing: -0.5 }}>ProLearn</div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>Training Management Platform</div>
        </div>
        <div className="card">
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>Sign in to your account</div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => onLogin("admin")}>Sign in as Admin</button>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => onLogin("agent")}>Sign in as Agent (Demo)</button>
          </div>
          <div style={{ fontSize: 11, color: "var(--text3)", textAlign: "center", marginTop: 14 }}>
            Demo mode — click either button to explore
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [role, setRole] = useState(null);
  const [activeView, setActiveView] = useState("dashboard");
  
  function handleLogin(r) {
    setRole(r);
    setActiveView(r === "admin" ? "dashboard" : "agent-home");
  }
  function handleLogout() { setRole(null); }
  
  const viewTitles = {
    dashboard: "Dashboard", analytics: "Analytics", modules: "Modules", lessons: "Lesson Builder",
    clients: "Clients", agents: "Agents", assignments: "Assignments", signatures: "Signatures",
    reports: "Reports", "agent-home": "My Training", "agent-progress": "Progress",
    "agent-history": "History", "agent-certs": "Certificates"
  };
  
  function renderView() {
    const views = {
      dashboard: <DashboardView setActiveView={setActiveView} />,
      analytics: <AnalyticsView />,
      modules: <ModulesView />,
      lessons: <LessonsView />,
      clients: <ClientsView />,
      agents: <AgentsView />,
      assignments: <AssignmentsView />,
      signatures: <SignaturesView />,
      reports: <ReportsView />,
      "agent-home": <AgentHomeView />,
      "agent-progress": <AgentHomeView />,
      "agent-history": <AgentHomeView />,
      "agent-certs": <AgentCertsView />,
    };
    return views[activeView] || <DashboardView setActiveView={setActiveView} />;
  }
  
  return (
    <>
      <style>{styles}</style>
      {!role ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <div className="app">
          <Sidebar role={role} activeView={activeView} setActiveView={setActiveView} />
          <div className="main">
            <div className="topbar">
              <div className="topbar-title">{viewTitles[activeView] || activeView}</div>
              <div className="topbar-actions">
                <div className="notif-dot"></div>
                <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
                  Switch Role
                </button>
                <div className={`user-avatar av-${role === "admin" ? "purple" : "blue"}`} style={{ fontSize: 11, fontWeight: 700 }}>
                  {role === "admin" ? "AD" : "MA"}
                </div>
              </div>
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
