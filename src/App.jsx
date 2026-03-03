import { useState, useRef } from "react";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:wght@400;500&family=DM+Mono:wght@400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#F7F8FA;--surface:#fff;--surface2:#F2F4F7;--surface3:#E8ECF0;
    --border:#E2E6EB;--border2:#CBD2DA;
    --text:#0F1923;--text2:#4A5568;--text3:#8A96A3;
    --brand:#0EA5A0;--brand2:#0BC4BE;--brand-bg:rgba(14,165,160,0.08);--brand-border:rgba(14,165,160,0.2);
    --green:#16A34A;--green-bg:rgba(22,163,74,0.08);
    --amber:#D97706;--amber-bg:rgba(217,119,6,0.08);
    --red:#DC2626;--red-bg:rgba(220,38,38,0.08);
    --blue:#2563EB;--blue-bg:rgba(37,99,235,0.08);
    --radius:10px;--radius-sm:7px;--sidebar-w:232px;
    --font:'Plus Jakarta Sans',sans-serif;--body:'DM Sans',sans-serif;--mono:'DM Mono',monospace;
    --sh-sm:0 1px 3px rgba(0,0,0,0.06),0 1px 2px rgba(0,0,0,0.04);
    --sh:0 4px 16px rgba(0,0,0,0.08);--sh-lg:0 8px 32px rgba(0,0,0,0.12);
  }
  body{font-family:var(--body);background:var(--bg);color:var(--text);min-height:100vh;overflow:hidden;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:5px;height:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}
  .app{display:flex;height:100vh;overflow:hidden}
  /* SIDEBAR */
  .sb{width:var(--sidebar-w);background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;flex-shrink:0;box-shadow:var(--sh-sm)}
  .sb-logo{padding:18px 16px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px}
  .logo-ic{width:34px;height:34px;background:var(--brand);border-radius:9px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:13px;font-weight:800;font-family:var(--font);flex-shrink:0;box-shadow:0 2px 8px rgba(14,165,160,0.35)}
  .logo-t{font-family:var(--font);font-weight:800;font-size:15px;color:var(--text);letter-spacing:-0.3px}
  .logo-s{font-size:10px;color:var(--text3);font-family:var(--mono);margin-top:1px}
  .role-tag{margin:10px 16px;padding:5px 10px;background:var(--brand-bg);border:1px solid var(--brand-border);border-radius:6px;font-size:11px;font-family:var(--mono);color:var(--brand);font-weight:500}
  .nav-sc{padding:8px;flex:1;overflow-y:auto}
  .nav-gl{font-size:10px;font-family:var(--mono);color:var(--text3);letter-spacing:.8px;text-transform:uppercase;padding:12px 8px 5px;display:block}
  .nav-i{display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:var(--radius-sm);font-size:13.5px;font-weight:500;font-family:var(--font);color:var(--text2);cursor:pointer;transition:all .13s;margin-bottom:1px}
  .nav-i:hover{background:var(--surface2);color:var(--text)}
  .nav-i.on{background:var(--brand-bg);color:var(--brand);font-weight:600}
  .nav-b{margin-left:auto;background:var(--surface3);color:var(--text3);font-size:10px;font-family:var(--mono);padding:1px 6px;border-radius:8px;min-width:20px;text-align:center}
  .nav-i.on .nav-b{background:var(--brand-border);color:var(--brand)}
  .sb-ft{padding:12px 16px;border-top:1px solid var(--border);display:flex;align-items:center;gap:10px}
  .av{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;font-family:var(--font);flex-shrink:0}
  .av-lg{width:38px;height:38px;font-size:13px;border-radius:10px}
  .av-teal{background:var(--brand-bg);color:var(--brand)}.av-g{background:var(--green-bg);color:var(--green)}
  .av-a{background:var(--amber-bg);color:var(--amber)}.av-b{background:var(--blue-bg);color:var(--blue)}
  .u-name{font-size:13px;font-weight:600;color:var(--text);font-family:var(--font)}
  .u-email{font-size:11px;color:var(--text3)}
  /* MAIN */
  .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
  .topbar{height:56px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 24px;gap:12px;flex-shrink:0}
  .tb-title{font-size:15px;font-weight:700;color:var(--text);font-family:var(--font);flex:1}
  .content{flex:1;overflow-y:auto;padding:24px}
  /* BUTTONS */
  .btn{display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:var(--radius-sm);font-size:13px;font-weight:600;font-family:var(--font);cursor:pointer;border:none;transition:all .13s;white-space:nowrap;line-height:1}
  .btn-p{background:var(--brand);color:#fff;box-shadow:0 1px 4px rgba(14,165,160,.3)}
  .btn-p:hover{background:var(--brand2);transform:translateY(-1px);box-shadow:0 4px 12px rgba(14,165,160,.35)}
  .btn-p:disabled{opacity:.5;cursor:not-allowed;transform:none}
  .btn-s{background:var(--surface);color:var(--text2);border:1px solid var(--border);box-shadow:var(--sh-sm)}
  .btn-s:hover{border-color:var(--brand);color:var(--brand);background:var(--brand-bg)}
  .btn-g{background:transparent;color:var(--text3)}.btn-g:hover{background:var(--surface2);color:var(--text)}
  .btn-sm{padding:5px 11px;font-size:12px}.btn-xs{padding:3px 8px;font-size:11px}
  /* CARDS */
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:20px;box-shadow:var(--sh-sm)}
  .c-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
  .c-t{font-size:14px;font-weight:700;color:var(--text);font-family:var(--font)}
  .c-s{font-size:12px;color:var(--text3);margin-top:2px}
  /* STATS */
  .sg{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:22px}
  .sc{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:18px 20px;box-shadow:var(--sh-sm);position:relative;overflow:hidden}
  .sc-teal{border-top:2px solid var(--brand)}.sc-g{border-top:2px solid var(--green)}.sc-a{border-top:2px solid var(--amber)}.sc-b{border-top:2px solid var(--blue)}
  .sl{font-size:11px;color:var(--text3);font-family:var(--mono);letter-spacing:.3px;text-transform:uppercase}
  .sv{font-size:26px;font-weight:800;color:var(--text);font-family:var(--font);margin:6px 0 3px;letter-spacing:-.5px}
  .sc-bg{position:absolute;right:14px;bottom:10px;font-size:32px;opacity:.06}
  /* PROGRESS */
  .pb{height:5px;background:var(--surface2);border-radius:8px;overflow:hidden}
  .pf{height:100%;border-radius:8px;transition:width .5s ease}
  .pb-lg{height:7px}.pb-sm{height:3px}
  /* BADGE */
  .badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:5px;font-size:11px;font-weight:600;font-family:var(--mono);white-space:nowrap}
  .bg-g{background:var(--green-bg);color:var(--green)}.bg-a{background:var(--amber-bg);color:var(--amber)}
  .bg-b{background:var(--blue-bg);color:var(--blue)}.bg-t{background:var(--brand-bg);color:var(--brand)}
  .bg-gr{background:var(--surface2);color:var(--text3)}.bg-r{background:var(--red-bg);color:var(--red)}
  .dot{width:5px;height:5px;border-radius:50%;background:currentColor}
  /* TABLE */
  .tw{overflow-x:auto}
  table{width:100%;border-collapse:collapse}
  thead th{font-size:11px;font-family:var(--mono);color:var(--text3);text-transform:uppercase;letter-spacing:.4px;padding:9px 14px;text-align:left;border-bottom:1px solid var(--border);font-weight:500;background:var(--bg)}
  tbody tr{border-bottom:1px solid var(--border);transition:background .1s}
  tbody tr:last-child{border-bottom:none}
  tbody tr:hover{background:var(--surface2)}
  td{padding:11px 14px;font-size:13px;color:var(--text2);vertical-align:middle}
  /* FORM */
  .fr{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .fg{margin-bottom:14px}
  .fl{font-size:12px;font-weight:600;font-family:var(--font);color:var(--text2);display:block;margin-bottom:5px}
  .fl span{color:var(--red)}
  .fi{width:100%;padding:9px 11px;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;font-family:var(--body);outline:none;transition:border-color .13s}
  .fi:focus{border-color:var(--brand);box-shadow:0 0 0 3px var(--brand-bg)}
  .fi::placeholder{color:var(--text3)}
  select.fi{appearance:none;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238A96A3' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center;padding-right:28px}
  textarea.fi{min-height:76px;resize:vertical;line-height:1.5}
  /* MODAL */
  .mo{position:fixed;inset:0;background:rgba(15,25,35,.45);backdrop-filter:blur(3px);display:flex;align-items:center;justify-content:center;z-index:200;animation:fi .15s ease}
  .mb{background:var(--surface);border:1px solid var(--border);border-radius:14px;width:520px;max-height:88vh;overflow-y:auto;box-shadow:var(--sh-lg);animation:su .18s ease}
  .mh{padding:22px 22px 0;display:flex;justify-content:space-between;align-items:flex-start}
  .mt{font-size:16px;font-weight:700;color:var(--text);font-family:var(--font)}
  .ms{font-size:12px;color:var(--text3);margin-top:3px}
  .mbody{padding:18px 22px}
  .mft{padding:14px 22px 18px;border-top:1px solid var(--border);display:flex;gap:8px;justify-content:flex-end}
  .x{background:none;border:none;color:var(--text3);font-size:20px;cursor:pointer;line-height:1;padding:2px}.x:hover{color:var(--text)}
  @keyframes fi{from{opacity:0}to{opacity:1}}
  @keyframes su{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  /* UTILS */
  .sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
  .st{font-size:15px;font-weight:700;color:var(--text);font-family:var(--font)}
  .ss{font-size:12px;color:var(--text3);margin-top:2px}
  .div{height:1px;background:var(--border);margin:14px 0}
  .tag{display:inline-block;padding:2px 7px;background:var(--surface2);border:1px solid var(--border);border-radius:4px;font-size:11px;color:var(--text3);font-family:var(--mono)}
  .fg2{display:flex;align-items:center;gap:8px}
  .fb{display:flex;align-items:center;justify-content:space-between}
  .stk{display:flex;flex-direction:column;gap:10px}
  .g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .g3{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
  .cdot{width:7px;height:7px;border-radius:50%;flex-shrink:0}
  /* MODULE CARD */
  .mc{background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius);padding:16px;cursor:pointer;transition:all .15s;box-shadow:var(--sh-sm)}
  .mc:hover{border-color:var(--brand);box-shadow:0 4px 16px rgba(14,165,160,.1);transform:translateY(-1px)}
  .mc-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px}
  .mn{font-size:14px;font-weight:700;color:var(--text);font-family:var(--font);line-height:1.35;margin-bottom:4px}
  /* FILTER PILLS */
  .pill{display:inline-flex;align-items:center;gap:5px;padding:3px 9px;border-radius:20px;border:1px solid var(--border);background:var(--surface2);font-size:11px;font-weight:500;color:var(--text2);cursor:pointer;transition:all .12s;font-family:var(--font)}
  .pill:hover{background:var(--surface3)}
  .pill.on{border-color:var(--brand);background:var(--brand-bg);color:var(--brand)}
  /* LESSON */
  .li{display:flex;align-items:center;gap:10px;padding:11px 13px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--surface);margin-bottom:7px;cursor:pointer;transition:all .13s}
  .li:hover{border-color:var(--brand);background:var(--brand-bg)}
  .ln{width:22px;height:22px;border-radius:6px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;font-size:10px;font-family:var(--mono);color:var(--text3);flex-shrink:0}
  .ln.dn{background:var(--green-bg);border-color:transparent;color:var(--green)}
  /* CERT */
  .cert{background:linear-gradient(135deg,#f0fafa,#e6f7f7);border:1.5px solid var(--brand-border);border-radius:14px;padding:36px;text-align:center;position:relative;overflow:hidden}
  .cert::before{content:'';position:absolute;inset:10px;border:1px solid var(--brand-border);border-radius:10px;pointer-events:none}
  /* UPLOAD */
  .uz{border:2px dashed var(--border2);border-radius:var(--radius);padding:28px;text-align:center;cursor:pointer;background:var(--surface2);transition:all .13s}
  .uz:hover{border-color:var(--brand);background:var(--brand-bg)}
  /* INFO */
  .ib{background:var(--brand-bg);border:1px solid var(--brand-border);border-radius:var(--radius-sm);padding:11px 13px;font-size:12px;color:var(--text2);line-height:1.5}
  /* EMPTY */
  .es{text-align:center;padding:40px 24px}
  .ei{font-size:36px;margin-bottom:10px;opacity:.4}
  .et{font-size:14px;font-weight:600;color:var(--text2);font-family:var(--font);margin-bottom:5px}
  /* SEARCH */
  .srw{position:relative}
  .sri{padding:7px 11px 7px 32px;background:var(--surface);border:1.5px solid var(--border);border-radius:var(--radius-sm);color:var(--text);font-size:13px;font-family:var(--body);outline:none;width:200px;transition:all .13s}
  .sri:focus{border-color:var(--brand);width:240px;box-shadow:0 0 0 3px var(--brand-bg)}
  .sric{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--text3);font-size:13px;pointer-events:none}
  /* SIG */
  .sigw{border:1.5px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;background:#fff}
  /* LOGIN */
  .lw{min-height:100vh;background:var(--bg);display:flex;align-items:center;justify-content:center}
  .lb{width:420px}
  .lh{text-align:center;margin-bottom:28px}
  .ll{width:52px;height:52px;background:var(--brand);border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:900;font-family:var(--font);color:#fff;margin:0 auto 14px;box-shadow:0 4px 16px rgba(14,165,160,.3)}
  .lt{font-size:22px;font-weight:800;color:var(--text);font-family:var(--font);letter-spacing:-.3px}
  .lsub{font-size:13px;color:var(--text3);margin-top:5px}
  .ltabs{display:flex;background:var(--surface2);border-radius:var(--radius-sm);padding:4px;margin-bottom:20px}
  .ltab{flex:1;text-align:center;padding:8px;border-radius:5px;font-size:13px;font-weight:600;cursor:pointer;color:var(--text3);transition:all .13s;font-family:var(--font)}
  .ltab.on{background:var(--surface);color:var(--text);box-shadow:var(--sh-sm)}
  @media(max-width:1100px){.sg{grid-template-columns:repeat(2,1fr)}.g3{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:720px){.sb{display:none}}
`;

// ── DATA ──────────────────────────────────────────────────────────────────
const I_CLIENTS = [
  {id:"c1",name:"TechCorp USA",  color:"#0EA5A0"},
  {id:"c2",name:"FinanceHub",    color:"#2563EB"},
  {id:"c3",name:"RetailPro",     color:"#D97706"},
];
const I_MODULES = [
  {id:"m1",clientId:"c1",title:"Customer Service Fundamentals",role:"Support Agent",status:"published"},
  {id:"m2",clientId:"c1",title:"Product Knowledge Essentials", role:"Sales Agent",  status:"published"},
  {id:"m3",clientId:"c2",title:"Compliance & Regulations",      role:"All",          status:"published"},
  {id:"m4",clientId:"c3",title:"Retail Sales Techniques",       role:"Sales Agent",  status:"draft"},
];
const I_LESSONS = [
  {id:"l1",moduleId:"m1",title:"Welcome & Orientation",   type:"video",          duration:"8 min", order:1},
  {id:"l2",moduleId:"m1",title:"Core Values & Mission",   type:"document",       duration:"5 min", order:2},
  {id:"l3",moduleId:"m1",title:"Communication Standards", type:"text",           duration:"10 min",order:3},
  {id:"l4",moduleId:"m1",title:"Handling Escalations",    type:"video",          duration:"12 min",order:4},
  {id:"l5",moduleId:"m1",title:"Knowledge Check",         type:"quiz",           duration:"15 min",order:5},
  {id:"l6",moduleId:"m1",title:"Final Acknowledgment",    type:"acknowledgment", duration:"5 min", order:6},
];
const I_AGENTS = [
  {id:"a1",name:"Maria Santos", email:"m.santos@lv.com",  clientId:"c1",role:"Support Agent",av:"MS",col:"av-teal",done:["l1","l2"],         mods:["m1"]},
  {id:"a2",name:"James Okafor", email:"j.okafor@lv.com",  clientId:"c1",role:"Sales Agent",  av:"JO",col:"av-g",   done:["l1","l2","l3","l4","l5","l6"],mods:["m1","m2"]},
  {id:"a3",name:"Priya Nair",   email:"p.nair@lv.com",    clientId:"c2",role:"Support Agent",av:"PN",col:"av-b",   done:["l1","l2","l3"],      mods:["m3"]},
  {id:"a4",name:"Carlos Rivera",email:"c.rivera@lv.com",  clientId:"c3",role:"Sales Agent",  av:"CR",col:"av-a",   done:[],                   mods:["m4"]},
  {id:"a5",name:"Aisha Johnson",email:"a.johnson@lv.com", clientId:"c2",role:"All",          av:"AJ",col:"av-g",   done:["l1","l2","l3","l4","l5","l6"],mods:["m3"]},
  {id:"a6",name:"Wei Zhang",    email:"w.zhang@lv.com",   clientId:"c1",role:"Support Agent",av:"WZ",col:"av-teal",done:["l1","l2","l3","l4"],mods:["m1"]},
];
const I_ACKS = [
  {id:"ak1",agentId:"a2",moduleId:"m1",ts:"2026-02-28 14:07 UTC",name:"James Okafor", ip:"192.168.1.14"},
  {id:"ak2",agentId:"a5",moduleId:"m3",ts:"2026-02-27 09:15 UTC",name:"Aisha Johnson",ip:"192.168.2.21"},
];

// ── HELPERS ───────────────────────────────────────────────────────────────
const pct = (agent,lessons) => {
  const ml = lessons.filter(l=>agent.mods.includes(l.moduleId));
  return ml.length ? Math.round((ml.filter(l=>agent.done.includes(l.id)).length/ml.length)*100) : 0;
};
const status = p => p===100?"Completed":p>0?"In Progress":"Not Started";
const TICON = {video:"▶",document:"📄",text:"📝",quiz:"✦",acknowledgment:"✍",audio:"🎧"};
const TBADGE= {video:"bg-b",document:"bg-a",text:"bg-gr",quiz:"bg-t",acknowledgment:"bg-g",audio:"bg-g"};

// ── SHARED ────────────────────────────────────────────────────────────────
function Modal({title,sub,children,onClose,footer}){
  return(
    <div className="mo" onClick={e=>e.target.className==="mo"&&onClose()}>
      <div className="mb">
        <div className="mh">
          <div><div className="mt">{title}</div>{sub&&<div className="ms">{sub}</div>}</div>
          <button className="x" onClick={onClose}>×</button>
        </div>
        <div className="mbody">{children}</div>
        {footer&&<div className="mft">{footer}</div>}
      </div>
    </div>
  );
}

function PctBar({p,color}){
  const c = color||(p===100?"var(--green)":p>0?"var(--brand)":"var(--surface3)");
  return(
    <div className="fg2" style={{minWidth:130}}>
      <div className="pb" style={{flex:1}}><div className="pf" style={{width:`${p}%`,background:c}}/></div>
      <span style={{fontSize:11,fontFamily:"var(--mono)",color:"var(--text3)",minWidth:28,textAlign:"right"}}>{p}%</span>
    </div>
  );
}

function StatusBadge({p}){
  const s=status(p);
  return <span className={`badge ${s==="Completed"?"bg-g":s==="In Progress"?"bg-b":"bg-gr"}`}><span className="dot"/> {s}</span>;
}

function AgentRow({a,lessons,clients}){
  const p=pct(a,lessons);
  const c=clients.find(cl=>cl.id===a.clientId);
  return(
    <tr>
      <td><div className="fg2"><div className={`av ${a.col}`}>{a.av}</div><div><div style={{fontWeight:600,color:"var(--text)",fontSize:13,fontFamily:"var(--font)"}}>{a.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{a.email}</div></div></div></td>
      <td><div className="fg2"><div className="cdot" style={{background:c?.color}}/>{c?.name}</div></td>
      <td><span className="tag">{a.role}</span></td>
      <td><PctBar p={p}/></td>
      <td><StatusBadge p={p}/></td>
    </tr>
  );
}

// ── ADMIN DASHBOARD ───────────────────────────────────────────────────────
function Dashboard({sv,agents,lessons,modules,clients,acks}){
  const cr=Math.round((agents.filter(a=>pct(a,lessons)===100).length/agents.length)*100);
  const ip=agents.filter(a=>{const p=pct(a,lessons);return p>0&&p<100;}).length;
  return(
    <div>
      <div className="sg">
        {[
          {l:"Total Agents",    v:agents.length, i:"👥",c:"sc-teal"},
          {l:"Completion Rate", v:cr+"%",        i:"✅",c:"sc-g"},
          {l:"In Progress",     v:ip,            i:"📈",c:"sc-b"},
          {l:"Signed Records",  v:acks.length,   i:"✍",c:"sc-a"},
        ].map(s=>(
          <div key={s.l} className={`sc ${s.c}`}>
            <div className="sl">{s.l}</div>
            <div className="sv">{s.v}</div>
            <div className="sc-bg">{s.i}</div>
          </div>
        ))}
      </div>
      <div className="g2" style={{gap:16,marginBottom:16}}>
        <div className="card">
          <div className="c-hd"><div><div className="c-t">Client Progress</div><div className="c-s">Avg completion</div></div><button className="btn btn-g btn-sm" onClick={()=>sv("clients")}>View all →</button></div>
          {clients.map(c=>{
            const ca=agents.filter(a=>a.clientId===c.id);
            const avg=ca.length?Math.round(ca.reduce((s,a)=>s+pct(a,lessons),0)/ca.length):0;
            return(
              <div key={c.id} style={{marginBottom:12}}>
                <div className="fb" style={{marginBottom:5}}>
                  <div className="fg2"><div className="cdot" style={{background:c.color}}/><span style={{fontSize:13,fontWeight:500,color:"var(--text)",fontFamily:"var(--font)"}}>{c.name}</span></div>
                  <span style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--text3)"}}>{avg}%</span>
                </div>
                <div className="pb pb-lg"><div className="pf" style={{width:`${avg}%`,background:c.color}}/></div>
              </div>
            );
          })}
        </div>
        <div className="card">
          <div className="c-hd"><div className="c-t">Recent Activity</div><div className="c-s">Last 24 hours</div></div>
          <div className="stk">
            {[
              {n:"James Okafor", act:"Completed module",      mod:"Customer Service",t:"2h ago",c:"av-g"},
              {n:"Aisha Johnson",act:"Signed acknowledgment", mod:"Compliance",      t:"4h ago",c:"av-a"},
              {n:"Wei Zhang",    act:"Completed lesson 4",    mod:"Customer Service",t:"6h ago",c:"av-teal"},
              {n:"Priya Nair",   act:"Started training",      mod:"Compliance",      t:"9h ago",c:"av-b"},
            ].map((item,i)=>(
              <div key={i} className="fg2">
                <div className={`av ${item.c}`} style={{width:28,height:28,fontSize:10,borderRadius:7}}>{item.n.split(" ").map(x=>x[0]).join("")}</div>
                <div style={{flex:1}}><span style={{fontSize:12,fontWeight:600,color:"var(--text)"}}>{item.n}</span> <span style={{fontSize:12,color:"var(--text3)"}}>{item.act}</span><div style={{fontSize:11,color:"var(--text3)"}}>{item.mod}</div></div>
                <span className="tag">{item.t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="sh"><div className="st">All Agents</div><button className="btn btn-s btn-sm" onClick={()=>sv("agents")}>Manage →</button></div>
      <div className="card" style={{padding:0}}><div className="tw"><table>
        <thead><tr><th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th></tr></thead>
        <tbody>{agents.map(a=><AgentRow key={a.id} a={a} lessons={lessons} clients={clients}/>)}</tbody>
      </table></div></div>
    </div>
  );
}

// ── ADMIN CLIENTS ─────────────────────────────────────────────────────────
function Clients({clients,setClients,modules,agents}){
  const [show,setShow]=useState(false);
  const [f,setF]=useState({name:"",color:"#0EA5A0"});
  const add=()=>{if(!f.name.trim())return;setClients(p=>[...p,{id:`c${Date.now()}`,name:f.name,color:f.color}]);setF({name:"",color:"#0EA5A0"});setShow(false);};
  return(
    <div>
      <div className="sh"><div><div className="st">Clients</div><div className="ss">{clients.length} organizations</div></div><button className="btn btn-p" onClick={()=>setShow(true)}>+ Add Client</button></div>
      <div className="g3">
        {clients.map(c=>{
          const cm=modules.filter(m=>m.clientId===c.id).length;
          const ca=agents.filter(a=>a.clientId===c.id).length;
          return(
            <div key={c.id} className="card">
              <div style={{width:42,height:42,borderRadius:10,background:c.color+"18",border:`1px solid ${c.color}30`,display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,fontSize:18}}>🏢</div>
              <div style={{fontWeight:700,fontSize:15,color:"var(--text)",fontFamily:"var(--font)",marginBottom:4}}>{c.name}</div>
              <div className="div"/>
              <div className="g2" style={{gap:8}}>
                {[{v:ca,l:"Agents"},{v:cm,l:"Modules"}].map(({v,l})=>(
                  <div key={l} style={{textAlign:"center",padding:"10px 0",background:"var(--surface2)",borderRadius:"var(--radius-sm)"}}>
                    <div style={{fontSize:20,fontWeight:800,color:"var(--text)",fontFamily:"var(--font)"}}>{v}</div>
                    <div style={{fontSize:11,color:"var(--text3)"}}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {show&&<Modal title="Add Client" onClose={()=>setShow(false)} footer={<><button className="btn btn-s" onClick={()=>setShow(false)}>Cancel</button><button className="btn btn-p" onClick={add}>Add</button></>}>
        <div className="fg"><label className="fl">Client Name <span>*</span></label><input className="fi" placeholder="e.g. Acme Corp" value={f.name} onChange={e=>setF(x=>({...x,name:e.target.value}))}/></div>
        <div className="fg"><label className="fl">Brand Color</label><div className="fg2"><input type="color" value={f.color} onChange={e=>setF(x=>({...x,color:e.target.value}))} style={{width:36,height:36,border:"1px solid var(--border)",borderRadius:6,cursor:"pointer",padding:2}}/><input className="fi" value={f.color} onChange={e=>setF(x=>({...x,color:e.target.value}))} style={{flex:1}}/></div></div>
      </Modal>}
    </div>
  );
}

// ── ADMIN MODULES ─────────────────────────────────────────────────────────
function Modules({modules,setModules,clients,lessons}){
  const [fc,setFc]=useState("all");
  const [show,setShow]=useState(false);
  const [f,setF]=useState({title:"",clientId:"",role:"Support Agent",status:"draft"});
  const filtered=fc==="all"?modules:modules.filter(m=>m.clientId===fc);
  const create=()=>{if(!f.title.trim()||!f.clientId)return;setModules(p=>[...p,{id:`m${Date.now()}`,title:f.title,clientId:f.clientId,role:f.role,status:f.status}]);setF({title:"",clientId:"",role:"Support Agent",status:"draft"});setShow(false);};
  return(
    <div>
      <div className="sh"><div><div className="st">Modules</div><div className="ss">{modules.length} training modules</div></div><button className="btn btn-p" onClick={()=>setShow(true)}>+ New Module</button></div>
      <div className="fg2" style={{marginBottom:16,flexWrap:"wrap"}}>
        <div className={`pill ${fc==="all"?"on":""}`} onClick={()=>setFc("all")}>All Clients</div>
        {clients.map(c=><div key={c.id} className={`pill ${fc===c.id?"on":""}`} style={fc===c.id?{borderColor:c.color,color:c.color,background:c.color+"12"}:{}} onClick={()=>setFc(c.id)}><div className="cdot" style={{background:c.color}}/>{c.name}</div>)}
      </div>
      {!filtered.length&&<div className="card"><div className="es"><div className="ei">📦</div><div className="et">No modules yet</div></div></div>}
      <div className="g3">
        {filtered.map(m=>{
          const c=clients.find(cl=>cl.id===m.clientId);
          const lc=lessons.filter(l=>l.moduleId===m.id).length;
          return(
            <div key={m.id} className="mc">
              <div className="mc-hd"><span className={`badge ${m.status==="published"?"bg-g":"bg-a"}`}>{m.status}</span><button className="btn btn-g btn-xs">⋯</button></div>
              <div className="mn">{m.title}</div>
              <div className="fg2" style={{marginBottom:10}}><div className="cdot" style={{background:c?.color}}/><span style={{fontSize:12,color:"var(--text3)"}}>{c?.name} · {lc} lessons</span></div>
              <span className="tag">{m.role}</span>
            </div>
          );
        })}
      </div>
      {show&&<Modal title="Create Module" sub="Add a new training module" onClose={()=>setShow(false)} footer={<><button className="btn btn-s" onClick={()=>setShow(false)}>Cancel</button><button className="btn btn-p" onClick={create}>Create</button></>}>
        <div className="fg"><label className="fl">Title <span>*</span></label><input className="fi" placeholder="e.g. Customer Service Fundamentals" value={f.title} onChange={e=>setF(x=>({...x,title:e.target.value}))}/></div>
        <div className="fr">
          <div className="fg"><label className="fl">Client <span>*</span></label><select className="fi" value={f.clientId} onChange={e=>setF(x=>({...x,clientId:e.target.value}))}><option value="">Select…</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="fg"><label className="fl">Role</label><select className="fi" value={f.role} onChange={e=>setF(x=>({...x,role:e.target.value}))}><option>Support Agent</option><option>Sales Agent</option><option>All</option></select></div>
        </div>
        <div className="fg"><label className="fl">Status</label><select className="fi" value={f.status} onChange={e=>setF(x=>({...x,status:e.target.value}))}><option value="draft">Draft</option><option value="published">Published</option></select></div>
      </Modal>}
    </div>
  );
}

// ── ADMIN LESSONS ─────────────────────────────────────────────────────────
function Lessons({lessons,setLessons,modules,clients}){
  const [sel,setSel]=useState(modules[0]?.id||null);
  const [show,setShow]=useState(false);
  const [f,setF]=useState({title:"",type:"video",duration:""});
  const mod=modules.find(m=>m.id===sel);
  const cli=clients.find(c=>c.id===mod?.clientId);
  const ml=lessons.filter(l=>l.moduleId===sel).sort((a,b)=>a.order-b.order);
  const add=()=>{
    if(!f.title.trim())return;
    const maxO=ml.length?Math.max(...ml.map(l=>l.order)):0;
    setLessons(p=>[...p,{id:`l${Date.now()}`,moduleId:sel,title:f.title,type:f.type,duration:f.duration||"5 min",order:maxO+1}]);
    setF({title:"",type:"video",duration:""});setShow(false);
  };
  return(
    <div>
      <div className="sh"><div><div className="st">Lesson Builder</div><div className="ss">Manage lessons inside each module</div></div><button className="btn btn-p" onClick={()=>setShow(true)} disabled={!sel}>+ Add Lesson</button></div>
      <div className="g2" style={{gap:18,alignItems:"start"}}>
        <div>
          <div style={{fontSize:12,fontWeight:600,color:"var(--text2)",fontFamily:"var(--font)",marginBottom:8}}>Select Module</div>
          <div className="stk" style={{gap:6}}>
            {modules.map(m=>{
              const c=clients.find(cl=>cl.id===m.clientId);
              return(
                <div key={m.id} onClick={()=>setSel(m.id)} style={{padding:"11px 13px",borderRadius:"var(--radius-sm)",cursor:"pointer",transition:"all .13s",border:`1.5px solid ${m.id===sel?"var(--brand)":"var(--border)"}`,background:m.id===sel?"var(--brand-bg)":"var(--surface)"}}>
                  <div style={{fontSize:13,fontWeight:600,color:"var(--text)",fontFamily:"var(--font)",marginBottom:3}}>{m.title}</div>
                  <div className="fg2"><div className="cdot" style={{background:c?.color}}/><span style={{fontSize:11,color:"var(--text3)"}}>{c?.name} · {lessons.filter(l=>l.moduleId===m.id).length} lessons</span></div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          {mod?(
            <>
              <div className="fb" style={{marginBottom:8}}>
                <span style={{fontSize:12,fontWeight:600,color:"var(--text2)",fontFamily:"var(--font)"}}>{mod.title}</span>
                <div className="fg2"><div className="cdot" style={{background:cli?.color}}/><span style={{fontSize:11,color:"var(--text3)"}}>{cli?.name}</span></div>
              </div>
              {!ml.length&&<div className="card" style={{padding:20,textAlign:"center"}}><div style={{fontSize:11,color:"var(--text3)"}}>No lessons yet — add your first above.</div></div>}
              {ml.map((l,i)=>(
                <div key={l.id} className="li">
                  <span style={{color:"var(--text3)",cursor:"grab",fontSize:14}}>⠿</span>
                  <div className="ln">{i+1}</div>
                  <span style={{fontSize:14,flexShrink:0}}>{TICON[l.type]||"📄"}</span>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{l.title}</div><div style={{fontSize:11,color:"var(--text3)"}}>{l.duration} · {l.type}</div></div>
                  <span className={`badge ${TBADGE[l.type]||"bg-gr"}`} style={{fontSize:10}}>{l.type}</span>
                  <button className="btn btn-g btn-xs">✎</button>
                </div>
              ))}
            </>
          ):<div className="card"><div className="es"><div className="ei">👈</div><div className="et">Select a module</div></div></div>}
        </div>
      </div>
      {show&&sel&&<Modal title="Add Lesson" sub={`Adding to: ${mod?.title}`} onClose={()=>setShow(false)} footer={<><button className="btn btn-s" onClick={()=>setShow(false)}>Cancel</button><button className="btn btn-p" onClick={add}>Add</button></>}>
        <div className="fg"><label className="fl">Title <span>*</span></label><input className="fi" placeholder="e.g. Introduction to the Platform" value={f.title} onChange={e=>setF(x=>({...x,title:e.target.value}))}/></div>
        <div className="fr">
          <div className="fg"><label className="fl">Type</label><select className="fi" value={f.type} onChange={e=>setF(x=>({...x,type:e.target.value}))}><option value="video">Video</option><option value="document">Document/PDF</option><option value="text">Written Content</option><option value="audio">Audio</option><option value="quiz">Quiz</option><option value="acknowledgment">Acknowledgment</option></select></div>
          <div className="fg"><label className="fl">Duration</label><input className="fi" placeholder="e.g. 10 min" value={f.duration} onChange={e=>setF(x=>({...x,duration:e.target.value}))}/></div>
        </div>
        <div className="fg"><label className="fl">Upload File</label><div className="uz"><div style={{fontSize:22,marginBottom:6}}>📎</div><div style={{fontSize:13,color:"var(--text2)",fontWeight:500}}>Drop file or click to browse</div><div style={{fontSize:11,color:"var(--text3)",marginTop:4}}>PDF, DOCX, MP4, MP3 · Max 500MB</div></div></div>
      </Modal>}
    </div>
  );
}

// ── ADMIN AGENTS ──────────────────────────────────────────────────────────
function Agents({agents,setAgents,lessons,modules,clients,acks}){
  const [search,setSearch]=useState("");
  const [fil,setFil]=useState("all");
  const [show,setShow]=useState(false);
  const [f,setF]=useState({fn:"",ln:"",email:"",clientId:"",role:"Support Agent"});
  const filtered=agents.filter(a=>{
    const ms=a.name.toLowerCase().includes(search.toLowerCase())||a.email.toLowerCase().includes(search.toLowerCase());
    return ms&&(fil==="all"||a.clientId===fil);
  });
  const invite=()=>{
    const name=`${f.fn} ${f.ln}`.trim();
    if(!name||!f.email||!f.clientId)return;
    const cols=["av-teal","av-g","av-a","av-b"];
    setAgents(p=>[...p,{id:`a${Date.now()}`,name,email:f.email,clientId:f.clientId,role:f.role,av:name.split(" ").map(n=>n[0]).join("").toUpperCase().slice(0,2),col:cols[p.length%4],done:[],mods:[]}]);
    setF({fn:"",ln:"",email:"",clientId:"",role:"Support Agent"});setShow(false);
  };
  return(
    <div>
      <div className="sh">
        <div><div className="st">Agents</div><div className="ss">{agents.length} registered</div></div>
        <div className="fg2">
          <div className="srw"><span className="sric">🔍</span><input className="sri" placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/></div>
          <button className="btn btn-p" onClick={()=>setShow(true)}>+ Invite Agent</button>
        </div>
      </div>
      <div className="fg2" style={{marginBottom:14,flexWrap:"wrap"}}>
        <div className={`pill ${fil==="all"?"on":""}`} onClick={()=>setFil("all")}>All</div>
        {clients.map(c=><div key={c.id} className={`pill ${fil===c.id?"on":""}`} style={fil===c.id?{borderColor:c.color,color:c.color,background:c.color+"12"}:{}} onClick={()=>setFil(c.id)}><div className="cdot" style={{background:c.color}}/>{c.name}</div>)}
      </div>
      <div className="card" style={{padding:0}}><div className="tw"><table>
        <thead><tr><th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th></tr></thead>
        <tbody>{filtered.map(a=><AgentRow key={a.id} a={a} lessons={lessons} clients={clients}/>)}</tbody>
      </table></div></div>
      {show&&<Modal title="Invite Agent" sub="Grant training access" onClose={()=>setShow(false)} footer={<><button className="btn btn-s" onClick={()=>setShow(false)}>Cancel</button><button className="btn btn-p" onClick={invite}>Send Invite</button></>}>
        <div className="fr"><div className="fg"><label className="fl">First Name <span>*</span></label><input className="fi" placeholder="Maria" value={f.fn} onChange={e=>setF(x=>({...x,fn:e.target.value}))}/></div><div className="fg"><label className="fl">Last Name <span>*</span></label><input className="fi" placeholder="Santos" value={f.ln} onChange={e=>setF(x=>({...x,ln:e.target.value}))}/></div></div>
        <div className="fg"><label className="fl">Email <span>*</span></label><input className="fi" type="email" placeholder="agent@company.com" value={f.email} onChange={e=>setF(x=>({...x,email:e.target.value}))}/></div>
        <div className="fr">
          <div className="fg"><label className="fl">Client <span>*</span></label><select className="fi" value={f.clientId} onChange={e=>setF(x=>({...x,clientId:e.target.value}))}><option value="">Select…</option>{clients.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
          <div className="fg"><label className="fl">Role</label><select className="fi" value={f.role} onChange={e=>setF(x=>({...x,role:e.target.value}))}><option>Support Agent</option><option>Sales Agent</option><option>All</option></select></div>
        </div>
        <div className="ib">📧 Invitation email will be sent with login credentials.</div>
      </Modal>}
    </div>
  );
}

// ── ADMIN SIGNATURES ──────────────────────────────────────────────────────
function Signatures({acks,agents,modules,clients}){
  return(
    <div>
      <div className="sh"><div><div className="st">Signed Acknowledgments</div><div className="ss">{acks.length} records</div></div><button className="btn btn-s">⤓ Export CSV</button></div>
      <div className="card" style={{padding:0}}><div className="tw"><table>
        <thead><tr><th>Agent</th><th>Module</th><th>Client</th><th>Signed At</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {acks.map(ak=>{
            const a=agents.find(x=>x.id===ak.agentId);
            const m=modules.find(x=>x.id===ak.moduleId);
            const c=clients.find(x=>x.id===m?.clientId);
            return(
              <tr key={ak.id}>
                <td><div className="fg2"><div className={`av ${a?.col||"av-teal"}`}>{a?.av}</div><div><div style={{fontWeight:600,color:"var(--text)",fontSize:13,fontFamily:"var(--font)"}}>{a?.name}</div><div style={{fontSize:11,color:"var(--text3)"}}>{a?.email}</div></div></div></td>
                <td style={{fontWeight:500,color:"var(--text)",fontSize:13}}>{m?.title}</td>
                <td><div className="fg2"><div className="cdot" style={{background:c?.color}}/>{c?.name}</div></td>
                <td><span style={{fontSize:12}}>{ak.ts}</span></td>
                <td><span className="badge bg-g"><span className="dot"/>Verified</span></td>
                <td><div className="fg2"><button className="btn btn-g btn-xs">View</button><button className="btn btn-s btn-xs">⤓ PDF</button></div></td>
              </tr>
            );
          })}
          {!acks.length&&<tr><td colSpan={6}><div className="es"><div className="ei">✍</div><div className="et">No signatures yet</div></div></td></tr>}
        </tbody>
      </table></div></div>
    </div>
  );
}

// ── ADMIN REPORTS ─────────────────────────────────────────────────────────
function Reports({agents,lessons,modules,clients,acks}){
  return(
    <div>
      <div className="sh"><div><div className="st">Completion Reports</div></div><div className="fg2"><button className="btn btn-s">⤓ CSV</button><button className="btn btn-p">⤓ PDF</button></div></div>
      <div className="g3" style={{marginBottom:18}}>
        {clients.map(c=>{
          const ca=agents.filter(a=>a.clientId===c.id);
          const comp=ca.filter(a=>pct(a,lessons)===100).length;
          const ip=ca.filter(a=>{const p=pct(a,lessons);return p>0&&p<100;}).length;
          const ns=ca.filter(a=>pct(a,lessons)===0).length;
          return(
            <div key={c.id} className="card">
              <div className="fg2" style={{marginBottom:12}}><div className="cdot" style={{background:c.color,width:10,height:10}}/><div className="c-t">{c.name}</div></div>
              <div style={{display:"flex",gap:3,height:6,borderRadius:4,overflow:"hidden",marginBottom:12}}>
                <div style={{flex:comp,background:"var(--green)",borderRadius:4}}/><div style={{flex:ip,background:"var(--brand)",borderRadius:4}}/><div style={{flex:ns||0.01,background:"var(--surface3)",borderRadius:4}}/>
              </div>
              <div className="stk" style={{gap:6}}>
                {[["● Completed","var(--green)",comp],["● In Progress","var(--brand)",ip],["● Not Started","var(--text3)",ns]].map(([l,col,v])=>(
                  <div key={l} className="fb"><span style={{fontSize:12,color:col}}>{l}</span><span style={{fontSize:13,fontFamily:"var(--mono)",fontWeight:500,color:"var(--text)"}}>{v}</span></div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="card" style={{padding:0}}><div className="tw"><table>
        <thead><tr><th>Agent</th><th>Client</th><th>Role</th><th>Progress</th><th>Status</th><th>Signed</th></tr></thead>
        <tbody>{agents.map(a=>{
          const p=pct(a,lessons);const c=clients.find(cl=>cl.id===a.clientId);const signed=acks.some(ak=>ak.agentId===a.id);
          return(
            <tr key={a.id}>
              <td style={{fontWeight:600,color:"var(--text)",fontFamily:"var(--font)"}}>{a.name}</td>
              <td><div className="fg2"><div className="cdot" style={{background:c?.color}}/>{c?.name}</div></td>
              <td><span className="tag">{a.role}</span></td>
              <td><PctBar p={p}/></td>
              <td><StatusBadge p={p}/></td>
              <td>{signed?<span className="badge bg-g">✓ Yes</span>:<span className="badge bg-gr">—</span>}</td>
            </tr>
          );
        })}</tbody>
      </table></div></div>
    </div>
  );
}

// ── AGENT TRAINING ────────────────────────────────────────────────────────
function AgentTraining({agent,setAgent,lessons,modules,clients,acks,setAcks}){
  const [openMod,setOpenMod]=useState(null);
  const [showAck,setShowAck]=useState(false);
  const [sigName,setSigName]=useState("");
  const [hasSig,setHasSig]=useState(false);
  const [drawing,setDrawing]=useState(false);
  const canvasRef=useRef(null);

  const myMods=modules.filter(m=>agent.mods.includes(m.id));

  const startDraw=e=>{const r=canvasRef.current.getBoundingClientRect(),ctx=canvasRef.current.getContext("2d");ctx.beginPath();ctx.moveTo(e.clientX-r.left,e.clientY-r.top);setDrawing(true);};
  const draw=e=>{if(!drawing)return;const r=canvasRef.current.getBoundingClientRect(),ctx=canvasRef.current.getContext("2d");ctx.lineTo(e.clientX-r.left,e.clientY-r.top);ctx.strokeStyle="#0F1923";ctx.lineWidth=2;ctx.stroke();setHasSig(true);};
  const endDraw=()=>setDrawing(false);
  const clearSig=()=>{canvasRef.current.getContext("2d").clearRect(0,0,canvasRef.current.width,canvasRef.current.height);setHasSig(false);};

  const markDone=id=>{if(!agent.done.includes(id))setAgent(a=>({...a,done:[...a.done,id]}));};

  const submitAck=modId=>{
    if(!hasSig||!sigName.trim())return;
    const ackL=lessons.find(l=>l.moduleId===modId&&l.type==="acknowledgment");
    if(ackL)markDone(ackL.id);
    setAcks(p=>[...p,{id:`ak${Date.now()}`,agentId:agent.id,moduleId:modId,ts:new Date().toISOString().replace("T"," ").slice(0,16)+" UTC",name:sigName,ip:"192.168.x.x"}]);
    setShowAck(false);setSigName("");setHasSig(false);
    if(canvasRef.current)canvasRef.current.getContext("2d").clearRect(0,0,canvasRef.current.width,canvasRef.current.height);
  };

  // Module drill-down
  if(openMod){
    const m=modules.find(x=>x.id===openMod);
    const cli=clients.find(c=>c.id===m?.clientId);
    const ml=lessons.filter(l=>l.moduleId===openMod).sort((a,b)=>a.order-b.order);
    const done=ml.filter(l=>agent.done.includes(l.id)).length;
    const p=ml.length?Math.round((done/ml.length)*100):0;
    const isAcked=acks.some(ak=>ak.agentId===agent.id&&ak.moduleId===openMod);
    return(
      <div>
        <div className="fg2" style={{marginBottom:18}}>
          <button className="btn btn-g btn-sm" onClick={()=>setOpenMod(null)}>← Back</button>
          <div style={{flex:1}}>
            <div style={{fontSize:16,fontWeight:700,color:"var(--text)",fontFamily:"var(--font)"}}>{m?.title}</div>
            <div className="fg2" style={{marginTop:3}}><div className="cdot" style={{background:cli?.color}}/><span style={{fontSize:12,color:"var(--text3)"}}>{cli?.name} · {done}/{ml.length} complete</span></div>
          </div>
          <span style={{fontSize:20,fontWeight:800,fontFamily:"var(--mono)",color:p===100?"var(--green)":"var(--brand)"}}>{p}%</span>
        </div>
        <div className="pb pb-lg" style={{marginBottom:22}}><div className="pf" style={{width:`${p}%`,background:p===100?"var(--green)":"var(--brand)"}}/></div>
        <div className="stk">
          {ml.map((l,i)=>{
            const isDone=agent.done.includes(l.id);
            const isAck=l.type==="acknowledgment";
            return(
              <div key={l.id} className="li" style={{background:isDone?"rgba(22,163,74,0.03)":"var(--surface)",borderColor:isDone?"rgba(22,163,74,0.18)":"var(--border)"}}>
                <div className={`ln ${isDone?"dn":""}`}>{isDone?"✓":i+1}</div>
                <span style={{fontSize:14,flexShrink:0}}>{TICON[l.type]||"📄"}</span>
                <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:"var(--text)"}}>{l.title}</div><div style={{fontSize:11,color:"var(--text3)"}}>{l.duration} · {l.type}</div></div>
                {isAck
                  ?(isAcked||isDone?<span className="badge bg-g">✓ Signed</span>:<button className="btn btn-p btn-sm" onClick={()=>setShowAck(openMod)}>Sign Now</button>)
                  :(isDone?<span className="badge bg-g">Complete</span>:<button className="btn btn-s btn-sm" onClick={()=>markDone(l.id)}>Mark Done</button>)
                }
              </div>
            );
          })}
        </div>
        {showAck&&(
          <Modal title="Training Acknowledgment" sub="Read carefully before signing" onClose={()=>setShowAck(false)}
            footer={<><button className="btn btn-s" onClick={()=>setShowAck(false)}>Cancel</button><button className="btn btn-p" onClick={()=>submitAck(openMod)} disabled={!hasSig||!sigName.trim()}>Submit & Sign</button></>}>
            <div style={{background:"var(--surface2)",border:"1px solid var(--border)",borderRadius:"var(--radius-sm)",padding:14,marginBottom:14,fontSize:13,color:"var(--text2)",lineHeight:1.7}}>
              <p style={{fontWeight:700,color:"var(--text)",marginBottom:6,fontFamily:"var(--font)"}}>Acknowledgment of Training Completion</p>
              <p>I confirm I have completed <strong style={{color:"var(--text)"}}>{m?.title}</strong> in full and agree to comply with all outlined policies for <strong style={{color:"var(--text)"}}>{cli?.name}</strong>.</p>
            </div>
            <div className="fg"><label className="fl">Full Legal Name <span>*</span></label><input className="fi" placeholder="Type your full name" value={sigName} onChange={e=>setSigName(e.target.value)}/></div>
            <div className="fg">
              <label className="fl">Digital Signature <span>*</span></label>
              <div className="sigw"><canvas ref={canvasRef} width={468} height={110} style={{display:"block",cursor:"crosshair"}} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}/></div>
              <div className="fb" style={{marginTop:5}}><span style={{fontSize:11,color:"var(--text3)"}}>Draw your signature above</span><button className="btn btn-g btn-xs" onClick={clearSig}>Clear</button></div>
            </div>
            <div className="ib">🔒 Timestamped and stored securely for compliance records.</div>
          </Modal>
        )}
      </div>
    );
  }

  const overall=(()=>{const all=lessons.filter(l=>agent.mods.includes(l.moduleId));return all.length?Math.round((agent.done.filter(id=>all.find(l=>l.id===id)).length/all.length)*100):0;})();
  return(
    <div>
      <div className="card" style={{marginBottom:18,background:"linear-gradient(135deg,#f0fafa,#e6f7f7)",border:"1.5px solid var(--brand-border)"}}>
        <div className="fb">
          <div>
            <div style={{fontSize:18,fontWeight:800,color:"var(--text)",fontFamily:"var(--font)",marginBottom:4}}>Welcome back, {agent.name.split(" ")[0]} 👋</div>
            <div style={{fontSize:13,color:"var(--text2)"}}>{myMods.length} modules · {agent.role} · <span style={{color:"var(--brand)",fontWeight:600}}>{overall}% complete</span></div>
          </div>
          <div style={{textAlign:"right"}}><div style={{fontSize:28,fontWeight:800,fontFamily:"var(--mono)",color:overall===100?"var(--green)":"var(--brand)"}}>{overall}%</div><StatusBadge p={overall}/></div>
        </div>
        <div className="pb pb-lg" style={{marginTop:14}}><div className="pf" style={{width:`${overall}%`,background:overall===100?"var(--green)":"var(--brand)"}}/></div>
      </div>
      <div className="sh"><div className="st">My Assigned Training</div></div>
      <div className="stk">
        {myMods.map(m=>{
          const cli=clients.find(c=>c.id===m.clientId);
          const ml=lessons.filter(l=>l.moduleId===m.id);
          const done=ml.filter(l=>agent.done.includes(l.id)).length;
          const p=ml.length?Math.round((done/ml.length)*100):0;
          const isAcked=acks.some(ak=>ak.agentId===agent.id&&ak.moduleId===m.id);
          return(
            <div key={m.id} className="card fg2" style={{cursor:"pointer",gap:16}} onClick={()=>setOpenMod(m.id)}>
              <div style={{width:44,height:44,borderRadius:10,background:cli?.color+"15",border:`1px solid ${cli?.color}25`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>📚</div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700,fontSize:14,color:"var(--text)",fontFamily:"var(--font)",marginBottom:4}}>{m.title}</div>
                <div className="fg2" style={{marginBottom:8}}><div className="cdot" style={{background:cli?.color}}/><span style={{fontSize:12,color:"var(--text3)"}}>{cli?.name} · {ml.length} lessons</span>{isAcked&&<span className="badge bg-g" style={{fontSize:10}}>✍ Signed</span>}</div>
                <div className="pb"><div className="pf" style={{width:`${p}%`,background:p===100?"var(--green)":"var(--brand)"}}/></div>
              </div>
              <div style={{textAlign:"right",flexShrink:0}}><div style={{fontSize:20,fontWeight:800,fontFamily:"var(--mono)",color:p===100?"var(--green)":"var(--brand)"}}>{p}%</div><StatusBadge p={p}/></div>
            </div>
          );
        })}
        {!myMods.length&&<div className="card"><div className="es"><div className="ei">📭</div><div className="et">No training assigned yet</div><div style={{fontSize:12,color:"var(--text3)"}}>Your admin will assign modules soon.</div></div></div>}
      </div>
    </div>
  );
}

// ── AGENT CERTIFICATES ────────────────────────────────────────────────────
function AgentCerts({agent,modules,clients,acks}){
  const earned=acks.filter(ak=>ak.agentId===agent.id);
  return(
    <div>
      <div className="sh"><div><div className="st">My Certificates</div><div className="ss">{earned.length} earned</div></div></div>
      {!earned.length&&<div className="card"><div className="es"><div className="ei">🏆</div><div className="et">No certificates yet</div><div style={{fontSize:12,color:"var(--text3)"}}>Complete a module and sign the acknowledgment.</div></div></div>}
      {earned.map(ak=>{
        const m=modules.find(x=>x.id===ak.moduleId);
        const c=clients.find(x=>x.id===m?.clientId);
        return(
          <div key={ak.id} style={{marginBottom:16}}>
            <div className="cert">
              <div style={{fontSize:42,marginBottom:14}}>🏆</div>
              <div style={{fontSize:10,fontFamily:"var(--mono)",color:"var(--brand)",letterSpacing:2,textTransform:"uppercase",marginBottom:14}}>Certificate of Completion</div>
              <div style={{fontSize:12,color:"var(--text3)",marginBottom:6}}>This certifies that</div>
              <div style={{fontSize:24,fontWeight:800,color:"var(--text)",fontFamily:"var(--font)",letterSpacing:"-.3px",marginBottom:8}}>{agent.name}</div>
              <div style={{fontSize:13,color:"var(--text2)",lineHeight:1.6,maxWidth:300,margin:"0 auto 16px"}}>has successfully completed all required training and demonstrated understanding of policies for</div>
              <div style={{fontSize:15,fontWeight:700,color:"var(--brand)",marginBottom:22,fontFamily:"var(--font)"}}>{m?.title}</div>
              <div style={{display:"flex",justifyContent:"center",gap:32,fontSize:11,fontFamily:"var(--mono)",color:"var(--text3)"}}>
                <div><div style={{marginBottom:2}}>CLIENT</div>{c?.name}</div>
                <div><div style={{marginBottom:2}}>COMPLETED</div>{ak.ts.slice(0,10)}</div>
                <div><div style={{marginBottom:2}}>CERT ID</div>LV-{ak.id.slice(-6).toUpperCase()}</div>
              </div>
            </div>
            <div className="fg2" style={{marginTop:10,justifyContent:"center"}}><button className="btn btn-s btn-sm">⤓ Download PDF</button><button className="btn btn-g btn-sm">Share</button></div>
          </div>
        );
      })}
    </div>
  );
}

// ── LOGIN ─────────────────────────────────────────────────────────────────
function Login({onLogin}){
  const [tab,setTab]=useState("admin");
  const [email,setEmail]=useState("");
  const [pass,setPass]=useState("");
  return(
    <div className="lw">
      <div className="lb">
        <div className="lh">
          <div className="ll">LV</div>
          <div className="lt">Lead Virtual Training</div>
          <div className="lsub">Internal agent training & compliance platform</div>
        </div>
        <div className="card">
          <div className="ltabs">
            <div className={`ltab ${tab==="admin"?"on":""}`} onClick={()=>setTab("admin")}>Admin Portal</div>
            <div className={`ltab ${tab==="agent"?"on":""}`} onClick={()=>setTab("agent")}>Agent Portal</div>
          </div>
          <div className="fg"><label className="fl">Email</label><input className="fi" type="email" placeholder={tab==="admin"?"admin@leadvirtual.com":"agent@leadvirtual.com"} value={email} onChange={e=>setEmail(e.target.value)}/></div>
          <div className="fg"><label className="fl">Password</label><input className="fi" type="password" placeholder="••••••••" value={pass} onChange={e=>setPass(e.target.value)}/></div>
          <button className="btn btn-p" style={{width:"100%",justifyContent:"center",padding:"10px"}} onClick={()=>onLogin(tab)}>
            Sign in as {tab==="admin"?"Admin":"Agent"}
          </button>
          <div style={{textAlign:"center",fontSize:11,color:"var(--text3)",marginTop:12}}>Demo mode — credentials not required</div>
        </div>
      </div>
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────────────
export default function App(){
  const [role,setRole]=useState(null);
  const [view,setView]=useState("dashboard");
  const [clients,setClients]=useState(I_CLIENTS);
  const [modules,setModules]=useState(I_MODULES);
  const [lessons,setLessons]=useState(I_LESSONS);
  const [agents,setAgents]=useState(I_AGENTS);
  const [acks,setAcks]=useState(I_ACKS);
  const [agentSelf,setAgentSelf]=useState(I_AGENTS[0]);

  const login=r=>{setRole(r);setView(r==="admin"?"dashboard":"training");};
  const logout=()=>setRole(null);
  const synced=agents.find(a=>a.id===agentSelf.id)||agentSelf;

  const ADMIN_NAV=[
    {label:"Overview", items:[{k:"dashboard",i:"🏠",l:"Dashboard"},{k:"reports",i:"📊",l:"Reports"}]},
    {label:"Content",  items:[{k:"clients",i:"🏢",l:"Clients",b:clients.length},{k:"modules",i:"📦",l:"Modules",b:modules.length},{k:"lessons",i:"📝",l:"Lessons"}]},
    {label:"People",   items:[{k:"agents",i:"👥",l:"Agents",b:agents.length}]},
    {label:"Compliance",items:[{k:"signatures",i:"✍",l:"Signatures",b:acks.length}]},
  ];
  const AGENT_NAV=[
    {label:"Training", items:[{k:"training",i:"📚",l:"My Training"},{k:"certs",i:"🏆",l:"Certificates"}]},
  ];
  const nav=role==="admin"?ADMIN_NAV:AGENT_NAV;
  const TITLES={dashboard:"Dashboard",reports:"Reports",clients:"Clients",modules:"Modules",lessons:"Lessons",agents:"Agents",signatures:"Signatures",training:"My Training",certs:"My Certificates"};

  const p={agents,lessons,modules,clients,acks};
  const renderView=()=>{
    if(role==="admin"){
      switch(view){
        case "dashboard":  return <Dashboard sv={setView} {...p}/>;
        case "clients":    return <Clients clients={clients} setClients={setClients} modules={modules} agents={agents}/>;
        case "modules":    return <Modules modules={modules} setModules={setModules} clients={clients} lessons={lessons}/>;
        case "lessons":    return <Lessons lessons={lessons} setLessons={setLessons} modules={modules} clients={clients}/>;
        case "agents":     return <Agents agents={agents} setAgents={setAgents} {...p}/>;
        case "signatures": return <Signatures {...p}/>;
        case "reports":    return <Reports {...p}/>;
        default:           return <Dashboard sv={setView} {...p}/>;
      }
    }else{
      const ap={agent:synced,setAgent:a=>{setAgentSelf(a);setAgents(prev=>prev.map(ag=>ag.id===a.id?a:ag));},lessons,modules,clients,acks,setAcks};
      switch(view){
        case "training": return <AgentTraining {...ap}/>;
        case "certs":    return <AgentCerts agent={synced} modules={modules} clients={clients} acks={acks}/>;
        default:         return <AgentTraining {...ap}/>;
      }
    }
  };

  return(
    <>
      <style>{CSS}</style>
      {!role?<Login onLogin={login}/>:(
        <div className="app">
          <div className="sb">
            <div className="sb-logo">
              <div className="logo-ic">LV</div>
              <div><div className="logo-t">Lead Virtual</div><div className="logo-s">Training Platform</div></div>
            </div>
            <div className="role-tag">{role==="admin"?"Admin Portal":"Agent Portal"}</div>
            <div className="nav-sc">
              {nav.map(sec=>(
                <div key={sec.label}>
                  <span className="nav-gl">{sec.label}</span>
                  {sec.items.map(item=>(
                    <div key={item.k} className={`nav-i ${view===item.k?"on":""}`} onClick={()=>setView(item.k)}>
                      <span style={{fontSize:15}}>{item.i}</span>{item.l}
                      {item.b!=null&&<span className="nav-b">{item.b}</span>}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="sb-ft">
              <div className={`av av-lg ${role==="admin"?"av-teal":"av-g"}`}>{role==="admin"?"AD":synced.av}</div>
              <div style={{flex:1,minWidth:0}}><div className="u-name">{role==="admin"?"Admin User":synced.name}</div><div className="u-email">{role==="admin"?"admin@leadvirtual.com":synced.email}</div></div>
              <button className="btn btn-g btn-xs" onClick={logout} title="Sign out">↩</button>
            </div>
          </div>
          <div className="main">
            <div className="topbar">
              <div className="tb-title">{TITLES[view]||view}</div>
              <div className="fg2">
                {role==="admin"&&<button className="btn btn-s btn-sm" onClick={()=>{setRole("agent");setView("training");}}>↔ Agent View</button>}
                {role==="agent"&&<button className="btn btn-s btn-sm" onClick={()=>{setRole("admin");setView("dashboard");}}>↔ Admin View</button>}
              </div>
            </div>
            <div className="content">{renderView()}</div>
          </div>
        </div>
      )}
    </>
  );
}
