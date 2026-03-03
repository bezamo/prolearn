const css = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0b0f; --surface: #111318; --surface2: #181c24; --surface3: #1e2330;
    --border: rgba(255,255,255,0.07); --border2: rgba(255,255,255,0.12);
    --text: #e8eaf0; --text2: #8891a8; --text3: #4a5266;
    --accent: #6d72f6; --accent2: #8b8ffe; --accent-glow: rgba(109,114,246,0.15);
    --green: #22c55e; --amber: #f59e0b; --red: #ef4444; --blue: #3b82f6;
    --radius: 12px; --radius-sm: 8px; --sidebar-w: 240px;
    --font: 'Sora', sans-serif; --mono: 'JetBrains Mono', monospace;
  }
  body { font-family: var(--font); background: var(--bg); color: var(--text); min-height: 100vh; overflow: hidden; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
  .app { display: flex; height: 100vh; overflow: hidden; }
  .sidebar { width: var(--sidebar-w); background: var(--surface); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; }
  .sidebar-logo { padding: 20px 20px 16px; border-bottom: 1px solid var(--border); }
  .logo-mark { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; letter-spacing: -0.3px; color: var(--text); }
  .logo-icon { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .sidebar-role { margin-top: 8px; font-size: 10px; font-family: var(--mono); color: var(--text3); letter-spacing: 0.5px; text-transform: uppercase; }
  .nav-section { padding: 16px 12px 8px; flex: 1; overflow-y: auto; }
  .nav-label { font-size: 10px; font-family: var(--mono); color: var(--text3); letter-spacing: 1px; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; margin-top: 16px; }
  .nav-label:first-child { margin-top: 0; }
  .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--radius-sm); font-size: 13.5px; font-weight: 500; color: var(--text2); cursor: pointer; transition: all 0.15s; margin-bottom: 2px; border: 1px solid transparent; }
  .nav-item:hover { background: var(--surface2); color: var(--text); }
  .nav-item.active { background: var(--accent-glow); color: var(--accent2); border-color: rgba(109,114,246,0.2); }
  .nav-item .nav-icon { width: 16px; text-align: center; font-size: 14px; flex-shrink: 0; }
  .nav-badge { margin-left: auto; background: var(--surface3); color: var(--text3); font-size: 10px; font-family: var(--mono); padding: 1px 6px; border-radius: 10px; }
  .nav-item.active .nav-badge { background: rgba(109,114,246,0.2); color: var(--accent); }
  .sidebar-footer { padding: 12px; border-top: 1px solid var(--border); display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .user-avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .user-name { font-size: 13px; font-weight: 600; color: var(--text2); }
  .user-email { font-size: 11px; color: var(--text3); }
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar { height: 60px; background: var(--surface); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 24px; gap: 16px; flex-shrink: 0; }
  .topbar-title { font-size: 15px; font-weight: 600; color: var(--text); flex: 1; }
  .topbar-actions { display: flex; align-items: center; gap: 8px; }
  .content { flex: 1; overflow-y: auto; padding: 24px; }
  .btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px; border-radius: var(--radius-sm); font-size: 13px; font-weight: 600; font-family: var(--font); cursor: pointer; border: none; transition: all 0.15s; white-space: nowrap; }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(109,114,246,0.35); }
  .btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border2); }
  .btn-secondary:hover { background: var(--surface3); border-color: var(--accent); color: var(--accent2); }
  .btn-ghost { background: transparent; color: var(--text2); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-sm { padding: 5px 10px; font-size: 12px; }
  .btn-danger { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.2); }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; }
  .card:hover { border-color: var(--border2); }
  .card-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .card-title { font-size: 14px; font-weight: 600; color: var(--text); }
  .card-subtitle { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; position: relative; overflow: hidden; }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; }
  .stat-card.accent::before { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .stat-card.green::before { background: var(--green); }
  .stat-card.amber::before { background: var(--amber); }
  .stat-card.blue::before { background: var(--blue); }
  .stat-label { font-size: 11px; font-family: var(--mono); color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-value { font-size: 28px; font-weight: 700; color: var(--text); margin: 6px 0 4px; letter-spacing: -1px; }
  .stat-change { font-size: 12px; color: var(--text3); }
  .stat-change.up { color: var(--green); }
  .stat-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); font-size: 28px; opacity: 0.15; }
  .progress-bar { height: 4px; background: var(--surface3); border-radius: 4px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 4px; transition: width 0.6s ease; }
  .progress-bar.lg { height: 6px; }
  .progress-bar.sm { height: 3px; }
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  thead th { font-size: 11px; font-family: var(--mono); color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; padding: 10px 14px; text-align: left; border-bottom: 1px solid var(--border); font-weight: 500; }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:hover { background: var(--surface2); }
  tbody tr:last-child { border-bottom: none; }
  td { padding: 12px 14px; font-size: 13px; color: var(--text2); vertical-align: middle; }
  .badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; font-family: var(--mono); white-space: nowrap; }
  .badge.green { background: rgba(34,197,94,0.12); color: var(--green); }
  .badge.amber { background: rgba(245,158,11,0.12); color: var(--amber); }
  .badge.red { background: rgba(239,68,68,0.12); color: var(--red); }
  .badge.blue { background: rgba(59,130,246,0.12); color: var(--blue); }
  .badge.purple { background: var(--accent-glow); color: var(--accent2); }
  .badge.gray { background: var(--surface3); color: var(--text3); }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; background: currentColor; }
  .avatar { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .avatar-sm { width: 26px; height: 26px; font-size: 10px; border-radius: 6px; }
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .flex-row { display: flex; align-items: center; gap: 10px; }
  .flex-col { display: flex; flex-direction: column; gap: 6px; }
  .space-y { display: flex; flex-direction: column; gap: 16px; }
  .module-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; cursor: pointer; transition: all 0.15s; }
  .module-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(109,114,246,0.1); }
  .module-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
  .module-title { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.4; }
  .module-meta { display: flex; gap: 12px; margin: 10px 0; }
  .module-meta-item { font-size: 12px; color: var(--text3); display: flex; align-items: center; gap: 4px; }
  .client-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .lesson-item { display: flex; align-items: center; gap: 12px; padding: 12px 14px; border-radius: var(--radius-sm); border: 1px solid var(--border); background: var(--surface2); margin-bottom: 8px; cursor: pointer; transition: all 0.15s; }
  .lesson-item:hover { border-color: var(--border2); background: var(--surface3); }
  .lesson-number { width: 24px; height: 24px; border-radius: 6px; background: var(--surface3); display: flex; align-items: center; justify-content: center; font-size: 11px; font-family: var(--mono); color: var(--text3); flex-shrink: 0; }
  .lesson-number.done { background: rgba(34,197,94,0.15); color: var(--green); }
  .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 100; animation: fadeIn 0.15s ease; }
  .modal { background: var(--surface); border: 1px solid var(--border2); border-radius: 16px; width: 560px; max-height: 85vh; overflow-y: auto; box-shadow: 0 24px 80px rgba(0,0,0,0.6); animation: slideUp 0.2s ease; }
  .modal-header { padding: 24px 24px 0; display: flex; justify-content: space-between; align-items: center; }
  .modal-title { font-size: 17px; font-weight: 700; color: var(--text); }
  .modal-body { padding: 20px 24px 24px; }
  .modal-footer { padding: 0 24px 24px; display: flex; gap: 10px; justify-content: flex-end; border-top: 1px solid var(--border); padding-top: 20px; margin-top: 4px; }
  .close-btn { background: none; border: none; color: var(--text3); font-size: 20px; cursor: pointer; padding: 2px; line-height: 1; }
  .close-btn:hover { color: var(--text); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .form-group { margin-bottom: 16px; }
  .form-label { font-size: 12px; font-weight: 600; color: var(--text2); margin-bottom: 6px; display: block; }
  .form-input { width: 100%; padding: 9px 12px; background: var(--surface2); border: 1px solid var(--border2); border-radius: var(--radius-sm); color: var(--text); font-size: 13px; font-family: var(--font); outline: none; transition: border-color 0.15s; }
  .form-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238891a8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 10px center; padding-right: 28px; }
  textarea.form-input { min-height: 80px; resize: vertical; }
  .upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius); padding: 32px; text-align: center; cursor: pointer; transition: all 0.15s; background: var(--surface2); }
  .upload-zone:hover { border-color: var(--accent); background: var(--accent-glow); }
  .sig-pad-wrap { border: 1px solid var(--border2); border-radius: var(--radius-sm); overflow: hidden; background: white; }
  .tabs { display: flex; gap: 2px; background: var(--surface2); padding: 4px; border-radius: var(--radius-sm); width: fit-content; margin-bottom: 20px; }
  .tab { padding: 7px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--text3); transition: all 0.15s; }
  .tab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 4px rgba(0,0,0,0.3); }
  .search-input { padding: 7px 12px 7px 34px; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); color: var(--text); font-size: 13px; font-family: var(--font); outline: none; width: 220px; transition: all 0.15s; }
  .search-input:focus { border-color: var(--accent); width: 280px; }
  .search-wrap { position: relative; }
  .search-icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text3); font-size: 14px; pointer-events: none; }
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .section-title { font-size: 15px; font-weight: 700; color: var(--text); }
  .section-sub { font-size: 12px; color: var(--text3); margin-top: 2px; }
  .client-pill { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; color: var(--text2); transition: all 0.15s; }
  .client-pill:hover { background: var(--surface3); }
  .cert-preview { background: linear-gradient(135deg, #1a1f2e, #141824); border: 1px solid rgba(109,114,246,0.3); border-radius: 12px; padding: 32px; text-align: center; position: relative; overflow: hidden; }
  .cert-preview::before { content: ''; position: absolute; inset: 8px; border: 1px solid rgba(109,114,246,0.15); border-radius: 8px; pointer-events: none; }
  .cert-title { font-size: 11px; font-family: var(--mono); color: var(--accent); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 16px; }
  .cert-name { font-size: 26px; font-weight: 700; color: var(--text); margin-bottom: 8px; letter-spacing: -0.5px; }
  .cert-body { font-size: 13px; color: var(--text2); line-height: 1.6; max-width: 320px; margin: 0 auto 20px; }
  .cert-module { font-size: 16px; font-weight: 600; color: var(--accent2); margin-bottom: 20px; }
  .cert-meta { display: flex; justify-content: center; gap: 32px; font-size: 11px; font-family: var(--mono); color: var(--text3); }
  .drag-handle { color: var(--text3); cursor: grab; padding: 0 4px; font-size: 16px; }
  .divider { height: 1px; background: var(--border); margin: 16px 0; }
  .tag { display: inline-block; padding: 2px 7px; background: var(--surface3); border-radius: 4px; font-size: 11px; color: var(--text3); font-family: var(--mono); }
  .notif-dot { width: 8px; height: 8px; background: var(--accent); border-radius: 50%; }
  .av-purple { background: rgba(109,114,246,0.25); color: var(--accent2); }
  .av-green { background: rgba(34,197,94,0.2); color: var(--green); }
  .av-amber { background: rgba(245,158,11,0.2); color: var(--amber); }
  .av-blue { background: rgba(59,130,246,0.2); color: var(--blue); }
  .av-red { background: rgba(239,68,68,0.2); color: var(--red); }
  @media (max-width: 1100px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } .grid-3 { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 768px) { .sidebar { display: none; } .stats-grid { grid-template-columns: 1fr 1fr; } }
`;
export default css;
