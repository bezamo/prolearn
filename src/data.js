export const MOCK_CLIENTS = [
  { id: "c1", name: "TechCorp USA", color: "#6366f1", agents: 24, modules: 8 },
  { id: "c2", name: "FinanceHub", color: "#10b981", agents: 18, modules: 5 },
  { id: "c3", name: "RetailPro", color: "#f59e0b", agents: 31, modules: 12 },
];

export const MOCK_MODULES = [
  { id: "m1", clientId: "c1", title: "Customer Service Fundamentals", role: "Support Agent", lessons: 6, completions: 18, total: 24, status: "published" },
  { id: "m2", clientId: "c1", title: "TechCorp Product Knowledge", role: "Sales Agent", lessons: 9, completions: 12, total: 24, status: "published" },
  { id: "m3", clientId: "c2", title: "Compliance & Regulations", role: "All", lessons: 4, completions: 16, total: 18, status: "published" },
  { id: "m4", clientId: "c3", title: "Retail Sales Techniques", role: "Sales Agent", lessons: 7, completions: 5, total: 31, status: "draft" },
  { id: "m5", clientId: "c1", title: "Escalation Procedures", role: "Support Agent", lessons: 3, completions: 22, total: 24, status: "published" },
];

export const MOCK_LESSONS = [
  { id: "l1", moduleId: "m1", title: "Welcome & Orientation", type: "video", duration: "8 min", order: 1 },
  { id: "l2", moduleId: "m1", title: "Core Values & Mission", type: "pdf", duration: "5 min", order: 2 },
  { id: "l3", moduleId: "m1", title: "Communication Standards", type: "text", duration: "10 min", order: 3 },
  { id: "l4", moduleId: "m1", title: "Handling Escalations", type: "video", duration: "12 min", order: 4 },
  { id: "l5", moduleId: "m1", title: "Practice Quiz", type: "quiz", duration: "15 min", order: 5 },
  { id: "l6", moduleId: "m1", title: "Final Acknowledgment", type: "acknowledgment", duration: "5 min", order: 6 },
];

export const MOCK_AGENTS = [
  { id: "a1", name: "Maria Santos", email: "m.santos@agency.com", client: "c1", role: "Support Agent", avatar: "MS", progress: 83, status: "In Progress" },
  { id: "a2", name: "James Okafor", email: "j.okafor@agency.com", client: "c1", role: "Sales Agent", avatar: "JO", progress: 100, status: "Completed" },
  { id: "a3", name: "Priya Nair", email: "p.nair@agency.com", client: "c2", role: "Support Agent", avatar: "PN", progress: 45, status: "In Progress" },
  { id: "a4", name: "Carlos Rivera", email: "c.rivera@agency.com", client: "c3", role: "Sales Agent", avatar: "CR", progress: 0, status: "Not Started" },
  { id: "a5", name: "Aisha Johnson", email: "a.johnson@agency.com", client: "c2", role: "All", avatar: "AJ", progress: 100, status: "Completed" },
  { id: "a6", name: "Wei Zhang", email: "w.zhang@agency.com", client: "c1", role: "Support Agent", avatar: "WZ", progress: 67, status: "In Progress" },
];
