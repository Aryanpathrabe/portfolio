import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://dxlbgiifiesmbreedxhf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4bGJnaWlmaWVzbWJyZWVkeGhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMTk5NDcsImV4cCI6MjEwMzc5NTk0N30.jQdWep7rYWWa_QCLzyVqAbaCUhaZpf_ETaJL-JS9oFc"
);

const ADMIN_PASSWORD = "adminji@123";

type Project = { id?: string; num: string; title: string; role: string; category: string; tags: string[]; description: string; img: string; link: string; };
type Skill = { id?: string; name: string; level: number; };
const emptyProject: Project = { num: "", title: "", role: "", category: "Core", tags: [], description: "", img: "", link: "" };
const emptySkill: Skill = { name: "", level: 50 };

function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<"projects" | "skills">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [projectForm, setProjectForm] = useState<Project>(emptyProject);
  const [skillForm, setSkillForm] = useState<Skill>(emptySkill);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  useEffect(() => { if (authed) { fetchProjects(); fetchSkills(); } }, [authed]);
  async function fetchProjects() { const { data } = await supabase.from("projects").select("*").order("num"); if (data) setProjects(data); }
  async function fetchSkills() { const { data } = await supabase.from("skills").select("*").order("created_at"); if (data) setSkills(data); }
  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }
  async function saveProject() {
    const payload = { ...projectForm, tags: typeof projectForm.tags === "string" ? (projectForm.tags as unknown as string).split(",").map((t) => t.trim()) : projectForm.tags };
    if (editingProject) { await supabase.from("projects").update(payload).eq("id", editingProject); flash("Project updated!"); }
    else { await supabase.from("projects").insert(payload); flash("Project added!"); }
    setProjectForm(emptyProject); setEditingProject(null); fetchProjects();
  }
  async function deleteProject(id: string) { await supabase.from("projects").delete().eq("id", id); flash("Project deleted!"); fetchProjects(); }
  async function saveSkill() {
    if (editingSkill) { await supabase.from("skills").update(skillForm).eq("id", editingSkill); flash("Skill updated!"); }
    else { await supabase.from("skills").insert(skillForm); flash("Skill added!"); }
    setSkillForm(emptySkill); setEditingSkill(null); fetchSkills();
  }
  async function deleteSkill(id: string) { await supabase.from("skills").delete().eq("id", id); flash("Skill deleted!"); fetchSkills(); }
  const ac = "#e8001c";
  const iS = { background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fafafa", padding: "0.6rem 0.9rem", width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", borderRadius: "4px" };
  const lS = { fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: "0.35rem" };
  const bS = { fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "0.6rem 1.4rem", border: "none", cursor: "pointer", borderRadius: "4px" };
  if (!authed) return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#161616", border: "1px solid #2a2a2a", padding: "2.5rem", width: "100%", maxWidth: "360px", borderRadius: "8px" }}>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, color: "#fafafa", fontSize: "1.5rem", marginBottom: "0.5rem" }}><span style={{ color: ac }}>&lt;</span>Admin<span style={{ color: ac }}> /&gt;</span></h1>
        <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif" }}>Portfolio control panel</p>
        <label style={lS}>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (password === ADMIN_PASSWORD ? setAuthed(true) : flash("Wrong password!"))} style={{ ...iS, marginBottom: "1rem" }} placeholder="Enter password" />
        {msg && <p style={{ color: ac, fontSize: "0.8rem", marginBottom: "0.75rem" }}>{msg}</p>}
        <button onClick={() => password === ADMIN_PASSWORD ? setAuthed(true) : flash("Wrong password!")} style={{ ...bS, background: ac, color: "#fff", width: "100%" }}>Login</button>
      </div>
    </div>
  );
  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ background: "#111", borderBottom: "1px solid #2a2a2a", padding: "0.9rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "1rem" }}><span style={{ color: ac }}>&lt;</span>Admin<span style={{ color: ac }}> /&gt;</span></h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
          {msg && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#2dd4ac" }}>{msg}</span>}
          <button onClick={() => window.location.href = "/"} style={{ ...bS, background: "transparent", color: "#666", border: "1px solid #2a2a2a", padding: "0.45rem 0.85rem", fontSize: "0.72rem" }}>← Back</button>
          <button onClick={() => setAuthed(false)} style={{ ...bS, background: "#1a1a1a", color: "#fafafa", border: "1px solid #2a2a2a", padding: "0.45rem 0.85rem", fontSize: "0.72rem" }}>Logout</button>
        </div>
      </header>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "1.25rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {(["projects", "skills"] as const).map((t) => <button key={t} onClick={() => setTab(t)} style={{ ...bS, background: tab === t ? ac : "#1a1a1a", color: tab === t ? "#fff" : "#aaa", border: "1px solid #2a2a2a" }}>{t}</button>)}
        </div>

        {tab === "projects" && (
          <div className="admin-grid">
            <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1.25rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "1.1rem", color: "#fafafa" }}>{editingProject ? "Edit Project" : "Add Project"}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {([{ label: "Number (e.g. 01)", key: "num" }, { label: "Title", key: "title" }, { label: "Role (e.g. Core · 2024)", key: "role" }, { label: "Image URL", key: "img" }, { label: "Project Link", key: "link" }, { label: "Tags (comma separated)", key: "tags" }] as { label: string; key: keyof Project }[]).map(({ label, key }) => (
                  <div key={key}><label style={lS}>{label}</label><input style={iS} value={Array.isArray(projectForm[key]) ? (projectForm[key] as string[]).join(", ") : projectForm[key] as string} onChange={(e) => setProjectForm({ ...projectForm, [key]: e.target.value })} placeholder={label} /></div>
                ))}
                <div><label style={lS}>Category</label><select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} style={{ ...iS }}><option value="Core">Core</option><option value="AI Projects">AI Projects</option></select></div>
                <div><label style={lS}>Description</label><textarea rows={3} style={{ ...iS, resize: "vertical" }} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Description" /></div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={saveProject} style={{ ...bS, background: ac, color: "#fff", flex: 1 }}>{editingProject ? "Update" : "Add"} Project</button>
                  {editingProject && <button onClick={() => { setProjectForm(emptyProject); setEditingProject(null); }} style={{ ...bS, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a" }}>Cancel</button>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fafafa" }}>Projects ({projects.length})</h2>
              {projects.length === 0 && <p style={{ color: "#555", fontSize: "0.85rem" }}>No projects yet!</p>}
              {projects.map((p) => (
                <div key={p.id} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "0.9rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.num} — {p.title}</p>
                    <p style={{ color: "#666", fontSize: "0.75rem" }}>{p.category}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                    <button onClick={() => { setProjectForm({ ...p, tags: p.tags || [] }); setEditingProject(p.id!); }} style={{ ...bS, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a", fontSize: "0.68rem", padding: "0.4rem 0.75rem" }}>Edit</button>
                    <button onClick={() => deleteProject(p.id!)} style={{ ...bS, background: "#2a0a0a", color: ac, border: `1px solid ${ac}`, fontSize: "0.68rem", padding: "0.4rem 0.75rem" }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div className="admin-grid">
            <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1.25rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "1.1rem" }}>{editingSkill ? "Edit Skill" : "Add Skill"}</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div><label style={lS}>Skill Name</label><input style={iS} value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. React" /></div>
                <div><label style={lS}>Level: {skillForm.level}%</label><input type="range" min={0} max={100} value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })} style={{ width: "100%", accentColor: ac }} /></div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={saveSkill} style={{ ...bS, background: ac, color: "#fff", flex: 1 }}>{editingSkill ? "Update" : "Add"} Skill</button>
                  {editingSkill && <button onClick={() => { setSkillForm(emptySkill); setEditingSkill(null); }} style={{ ...bS, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a" }}>Cancel</button>}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem" }}>Skills ({skills.length})</h2>
              {skills.length === 0 && <p style={{ color: "#555", fontSize: "0.85rem" }}>No skills yet!</p>}
              {skills.map((s) => (
                <div key={s.id} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "0.9rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}><span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.88rem" }}>{s.name}</span><span style={{ color: ac, fontFamily: "'DM Mono', monospace", fontSize: "0.7rem" }}>{s.level}%</span></div>
                    <div style={{ background: "#2a2a2a", height: "2px" }}><div style={{ background: ac, height: "2px", width: `${s.level}%` }} /></div>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", flexShrink: 0 }}>
                    <button onClick={() => { setSkillForm(s); setEditingSkill(s.id!); }} style={{ ...bS, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a", fontSize: "0.68rem", padding: "0.4rem 0.75rem" }}>Edit</button>
                    <button onClick={() => deleteSkill(s.id!)} style={{ ...bS, background: "#2a0a0a", color: ac, border: `1px solid ${ac}`, fontSize: "0.68rem", padding: "0.4rem 0.75rem" }}>Del</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const NAV_ITEMS = ["Home", "About", "Skills", "Projects", "Contact"];

const SKILLS = [
  { name: "React / Next.js", level: 92 },
  { name: "TypeScript", level: 88 },
  { name: "Node.js / Express", level: 82 },
  { name: "UI / UX Design", level: 78 },
  { name: "PostgreSQL", level: 74 },
  { name: "Docker & DevOps", level: 68 },
];

const PROJECTS = [
  {
    num: "01",
    title: "Weather App",
    role: "Core · 2024",
    category: "Core",
    tags: ["HTML", "CSS", "JavaScript", "Weather API"],
    desc: "A clean weather app that fetches real-time data based on city search. Displays temperature, humidity, and conditions with a minimal, responsive interface.",
    img: "https://images.unsplash.com/photo-1599060052009-24d6d0b0161c?w=800&h=520&fit=crop&auto=format",
    link: "#",
  },
  {
    num: "02",
    title: "Task Manager",
    role: "Core · 2024",
    category: "Core",
    tags: ["React", "localStorage", "CSS"],
    desc: "A simple drag-and-drop task manager with add, complete, and delete functionality. Data persists in localStorage — built to practice React state and component design.",
    img: "https://images.unsplash.com/photo-1560803262-95a9de00a057?w=800&h=520&fit=crop&auto=format",
    link: "#",
  },
  {
    num: "03",
    title: "Color Palette Generator",
    role: "Core · 2024",
    category: "Core",
    tags: ["JavaScript", "CSS", "Canvas API"],
    desc: "Generate harmonious color palettes with one click. Supports hex copy, lock colors, and export. A fun tool built to sharpen DOM manipulation and color theory knowledge.",
    img: "https://images.unsplash.com/photo-1554034483-04fda0d3507b?w=800&h=520&fit=crop&auto=format",
    link: "#",
  },
  {
    num: "04",
    title: "AI Chatbot",
    role: "AI · 2025",
    category: "AI Projects",
    tags: ["OpenAI API", "React", "Node.js"],
    desc: "A conversational chatbot powered by the OpenAI API. Supports multi-turn dialogue with a clean chat UI — built to learn how to integrate and prompt LLMs effectively.",
    img: "https://images.unsplash.com/photo-1564284369929-026ba231f89b?w=800&h=520&fit=crop&auto=format",
    link: "#",
  },
  {
    num: "05",
    title: "AI Image Prompt Generator",
    role: "AI · 2025",
    category: "AI Projects",
    tags: ["GPT-4", "React", "Tailwind CSS"],
    desc: "Describe an idea in plain words and get a detailed, optimized prompt for AI image generators like Midjourney or DALL·E. Helps bridge the gap between imagination and output.",
    img: "https://images.unsplash.com/photo-1660831519595-dd4dafe57a31?w=800&h=520&fit=crop&auto=format",
    link: "#",
  },
  {
    num: "06",
    title: "AI Resume Analyser",
    role: "AI · 2025",
    category: "AI Projects",
    tags: ["GPT-4", "Next.js", "PDF.js"],
    desc: "Upload a resume and get instant AI feedback on structure, clarity, and keyword strength. Built to practice file handling, API integration, and presenting AI output cleanly.",
    img: "https://images.unsplash.com/photo-1547355253-ff0740f6e8c1?w=800&h=520&fit=crop&auto=format",
    link: "#",
  },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useDark() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return [dark, setDark] as const;
}

export default function App() {
  if (window.location.pathname === "/admin") return <Admin />;
  const [dark, setDark] = useDark();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("About");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [dbProjects, setDbProjects] = useState<typeof PROJECTS | null>(null);
  const [dbSkills, setDbSkills] = useState<typeof SKILLS | null>(null);

  useEffect(() => {
    supabase.from("projects").select("*").order("num").then(({ data }) => {
      if (data && data.length > 0) {
        setDbProjects(data.map((p: any) => ({ num: p.num, title: p.title, role: p.role, category: p.category, tags: p.tags || [], desc: p.description, img: p.img, link: p.link })));
      }
    });
    supabase.from("skills").select("*").order("created_at").then(({ data }) => {
      if (data && data.length > 0) {
        setDbSkills(data.map((s: any) => ({ name: s.name, level: s.level })));
      }
    });
  }, []);

  const projects = dbProjects ?? PROJECTS;
  const skills = dbSkills ?? SKILLS;

  const skillsSection = useInView(0.2);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = NAV_ITEMS.map((id) => document.getElementById(id.toLowerCase()));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = sections[i];
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) {
          setActiveSection(NAV_ITEMS[i]);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData(e.target as HTMLFormElement);
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(data as any).toString(),
    }).finally(() => setSent(true));
  };

  // CSS var shorthands for inline styles
  const bg     = "var(--bg)";
  const bgAlt  = "var(--bg-alt)";
  const fg     = "var(--fg)";
  const border = "var(--border)";
  const borderDk = "var(--border-dk)";
  const muted  = "var(--muted)";
  const mutedAlt = "var(--muted-alt)";
  const subtle = "var(--subtle)";
  const cardBg = "var(--card-bg)";
  const inputBg = "var(--input-bg)";
  const accent = "var(--accent)";

  return (
    <div style={{ background: bg, minHeight: "100%", transition: "background 0.3s" }}>
      {/* ── NAV ── */}
      <header
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: scrolled ? (dark ? "rgba(13,13,13,0.92)" : "rgba(250,250,250,0.92)") : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled ? `1px solid ${border}` : "1px solid transparent",
          transition: "all 0.3s",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              style={{
                fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "1rem",
                letterSpacing: "0.02em", background: "none", border: "none",
                cursor: "pointer", color: fg,
              }}
            >
              <span style={{ color: accent }}>&lt;</span>Aryan<span style={{ color: accent }}> /&gt;</span>
            </button>

            {/* Desktop nav */}
            <nav style={{ display: "flex", gap: "2.5rem", alignItems: "center" }} className="hidden-mobile">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item)}
                  className={`nav-link ${activeSection === item ? "active" : ""}`}
                >
                  {item}
                </button>
              ))}

              {/* Dark mode toggle */}
              <button
                onClick={() => setDark((d) => !d)}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1, padding: "2px" }}
              >
                {dark ? "🌙" : "☀️"}
              </button>
            </nav>

            {/* Mobile controls */}
            <div style={{ display: "none", alignItems: "center", gap: "1rem" }} className="show-mobile">
              <button
                onClick={() => setDark((d) => !d)}
                aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem", lineHeight: 1, padding: "2px" }}
              >
                {dark ? "🌙" : "☀️"}
              </button>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "4px" }}
                aria-label="Menu"
              >
                <span className="menu-line" style={{ transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
                <span className="menu-line" style={{ opacity: menuOpen ? 0 : 1 }} />
                <span className="menu-line" style={{ transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{ background: bg, borderTop: `1px solid ${border}`, padding: "1.5rem 2rem 2rem" }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item)}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  background: "none", border: "none", cursor: "pointer",
                  fontFamily: "'Jost', sans-serif", fontWeight: 600,
                  fontSize: "1.1rem", letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "0.75rem 0", color: fg, borderBottom: `1px solid ${border}`,
                }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ── HERO ── */}
      <section
        id="home"
        className="hero-section"
        style={{
          minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr",
          alignContent: "center", maxWidth: "1200px", margin: "0 auto",
          padding: "120px 2rem 80px", position: "relative",
        }}
      >
        <p className="section-num" style={{ marginBottom: "2rem" }}>— Currently learning &amp; building</p>
        <h1
          style={{
            fontFamily: "'Jost', sans-serif", fontWeight: 900,
            fontSize: "clamp(2.2rem, 6vw, 5.5rem)", lineHeight: 1,
            letterSpacing: "-0.03em", color: fg, margin: "0 0 0.2em",
          }}
        >
          Learning web development<br />by building real projects<span style={{ color: "#fff" }}>.</span>
        </h1>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1.2rem", alignItems: "center", marginTop: "1.5rem", marginBottom: "3rem" }}>
          {["Full-Stack Developer", "UI Designer", "Open Source"].map((t) => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7, color: muted, maxWidth: "560px", marginBottom: "2.5rem" }}>
          Currently focused on building simple and clean websites while improving my development skills. Always learning and working on new projects.
        </p>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button onClick={() => scrollTo("Projects")} className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            View Projects
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="2 4 7 10 12 4" />
            </svg>
          </button>
          <button onClick={() => scrollTo("Contact")} className="btn-outline">Get in touch</button>
        </div>

        {/* Scroll down arrow */}
        <button
          onClick={() => scrollTo("About")}
          className="scroll-arrow"
          style={{
            position: "absolute", bottom: "2.5rem", left: "50%",
            transform: "translateX(-50%)",
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem",
            animation: "bounce 2s infinite",
          }}
          aria-label="Scroll down"
        >
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.12em", color: "var(--subtle)", textTransform: "uppercase" }}>scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="4 8 10 14 16 8" />
          </svg>
        </button>

      </section>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>

      {/* ── ABOUT ── */}
      <section id="about" className="section-pad" style={{ borderTop: `1px solid ${border}`, padding: "100px 0", transition: "border-color 0.3s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div className="two-col-grid about-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "5rem", alignItems: "center" }}>
            <div>
              <p className="section-num" style={{ marginBottom: "1.2rem", fontSize: "1rem", letterSpacing: "0.1em" }}>About Me</p>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "1.5rem", color: fg }}>
                A curious learner,<br />building with purpose.
              </h2>
              <div style={{ width: "40px", height: "3px", background: accent, marginBottom: "2rem" }} />
              <p style={{ color: muted, lineHeight: 1.8, marginBottom: "1.2rem" }}>
                I'm a beginner frontend developer with a passion for creating clean, well-structured websites. I believe great design starts with simplicity — and I'm constantly improving my skills in HTML, CSS, and JavaScript to turn ideas into real projects.
              </p>
              <p style={{ color: muted, lineHeight: 1.8, marginBottom: "2rem" }}>
                Every project I build is a chance to learn something new. Right now, I'm focused on writing readable code and building interfaces that actually work well on every device.
              </p>

              <div className="about-badges" style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                {[
                  { icon: "🎯", label: "Learning Mindset" },
                  { icon: "🛠", label: "Clean Code" },
                  { icon: "📱", label: "Responsive Design" },
                  { icon: "🚀", label: "Always Improving" },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: "0.4rem",
                      padding: "0.4rem 0.9rem",
                      border: `1px solid ${border}`,
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: "0.8rem",
                      color: fg,
                      background: "transparent",
                      transition: "border-color 0.2s",
                    }}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Right — tech photo */}
            <div className="about-photo" style={{ position: "relative", maxWidth: "320px", justifySelf: "center" }}>
              {/* Corner brackets */}
              {[
                { top: 0, left: 0, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` },
                { top: 0, right: 0, borderTop: `2px solid ${accent}`, borderRight: `2px solid ${accent}` },
                { bottom: 0, left: 0, borderBottom: `2px solid ${accent}`, borderLeft: `2px solid ${accent}` },
                { bottom: 0, right: 0, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}` },
              ].map((s, i) => (
                <div key={i} style={{ position: "absolute", width: "18px", height: "18px", zIndex: 2, ...s }} />
              ))}
              <div
                style={{
                  overflow: "hidden",
                  aspectRatio: "4/5",
                  background: "#111",
                  filter: dark ? "grayscale(20%)" : "grayscale(30%) contrast(1.05)",
                  transition: "filter 0.3s",
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1650661926447-9efb2610f64c?w=700&h=875&fit=crop&auto=format"
                  alt="Tech coding setup"
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.45) 0%, transparent 55%)" }} />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section
        id="skills"
        ref={skillsSection.ref as React.RefObject<HTMLElement>}
        className="section-pad"
        style={{ borderTop: `1px solid ${border}`, padding: "100px 0", background: dark ? "#111" : "#0d0d0d", transition: "background 0.3s, border-color 0.3s" }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "5rem", alignItems: "start" }}>
            <div>
              <p className="section-num" style={{ marginBottom: "1.2rem", fontSize: "1rem", letterSpacing: "0.1em" }}>Skills</p>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fafafa", marginBottom: "1.5rem" }}>
                What I work with.
              </h2>
              <div style={{ width: "40px", height: "3px", background: accent, marginBottom: "2rem" }} />
              <p style={{ color: "#aaa", lineHeight: 1.8 }}>
                Technologies and tools I'm actively learning and using in real projects.
              </p>
            </div>

            <div>
              {skills.map((skill) => (
                <div key={skill.name} style={{ borderTop: "1px solid #2a2a2a", padding: "1.25rem 0" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 500, color: "#fafafa", fontSize: "0.95rem" }}>{skill.name}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: accent }}>{skill.level}%</span>
                  </div>
                  <div style={{ background: "#2a2a2a", height: "2px" }}>
                    <div style={{ background: accent, height: "2px", width: skillsSection.inView ? `${skill.level}%` : "0%", transition: "width 0.9s cubic-bezier(0.4,0,0.2,1)" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="section-pad" style={{ borderTop: `1px solid ${border}`, padding: "100px 0", transition: "border-color 0.3s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div style={{ marginBottom: "4rem" }}>
            <p className="section-num" style={{ marginBottom: "1rem", fontSize: "1rem", letterSpacing: "0.1em" }}>Projects</p>
            <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: fg }}>
              What I've built.
            </h2>
            <p style={{ color: subtle, fontSize: "0.95rem", lineHeight: 1.7, marginTop: "0.75rem", marginBottom: "2rem" }}>
              A mix of practice projects and AI-powered UI experiments — all honest, all real.
            </p>
            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "0.5rem", background: dark ? "#1a1a1a" : "#f0f0f0", padding: "4px", borderRadius: "999px", width: "fit-content" }}>
              {["All", "Core", "AI Projects"].map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "0.82rem",
                    fontWeight: 500,
                    padding: "0.4rem 1.1rem",
                    borderRadius: "999px",
                    border: "none",
                    cursor: "pointer",
                    background: activeFilter === f ? "#2dd4ac" : "transparent",
                    color: activeFilter === f ? "#000" : (dark ? "#aaa" : "#555"),
                    transition: "background 0.2s, color 0.2s",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="projects-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: border }}>
            {projects.filter((p) => activeFilter === "All" || p.category === activeFilter).map((p) => (
              <article key={p.num} className="project-card">
                <div style={{ aspectRatio: "16/9", background: border, overflow: "hidden" }}>
                  <img
                    src={p.img}
                    alt={p.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s ease" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "1.75rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: accent }}>{p.num}</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: subtle, textTransform: "uppercase" }}>{p.role}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "1.6rem", letterSpacing: "-0.02em", marginBottom: "0.75rem", color: fg }}>
                    {p.title}
                  </h3>
                  <p style={{ color: muted, fontSize: "0.88rem", lineHeight: 1.7, flex: 1, marginBottom: "1.25rem" }}>{p.desc}</p>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
                    {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
                  </div>
                  <a href={p.link} style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.1em", textTransform: "uppercase", color: accent, textDecoration: "none" }}>
                    View case study →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section-pad" style={{ borderTop: `1px solid ${border}`, padding: "60px 0", background: dark ? "#111" : "#0d0d0d", transition: "background 0.3s, border-color 0.3s" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>
          <div className="two-col-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem", alignItems: "start" }}>
            <div>
              <p className="section-num" style={{ marginBottom: "0.8rem", fontSize: "1rem", letterSpacing: "0.1em" }}>Contact</p>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.1, letterSpacing: "-0.02em", color: "#fafafa", marginBottom: "1rem" }}>
                Let&apos;s connect.
              </h2>
              <div style={{ width: "40px", height: "3px", background: accent, marginBottom: "1.2rem" }} />
              <p style={{ color: "#aaa", lineHeight: 1.7, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
                Feel free to reach out—whether it&apos;s work, curiosity, or just a friendly hello.
              </p>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { label: "Email",    val: "aryanpathrabe@gmail.com" },
                  { label: "LinkedIn", val: "linkedin.com/in/aryanpathrabe" },
                  { label: "GitHub",   val: "github.com/Aryanpathrabe" },
                ].map(({ label, val }) => (
                  <div key={label} style={{ borderTop: "1px solid #2a2a2a", padding: "0.75rem 0" }}>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.2rem" }}>{label}</p>
                    <p style={{ color: "#fafafa", fontSize: "0.88rem" }}>{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              {sent ? (
                <div style={{ border: "1px solid #2a2a2a", padding: "3rem", textAlign: "center" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "1rem", color: accent }}>✓</div>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, color: "#fafafa", fontSize: "1.2rem", marginBottom: "0.5rem" }}>Message sent.</p>
                  <p style={{ color: "#888", fontSize: "0.9rem" }}>I&apos;ll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} name="contact" method="POST" data-netlify="true" style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                  <input type="hidden" name="form-name" value="contact" />
                  {[
                    { label: "Name",    key: "name" as const,    type: "text",  ph: "Your full name" },
                    { label: "Email",   key: "email" as const,   type: "email", ph: "you@company.com" },
                  ].map(({ label, key, type, ph }) => (
                    <div key={key}>
                      <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>{label}</label>
                      <input
                        required type={type} placeholder={ph} name={key}
                        value={formData[key]}
                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                        style={{ background: "#161616", border: "1px solid #2a2a2a", color: "#fafafa" }}
                      />
                    </div>
                  ))}
                  <div>
                    <label style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "0.5rem" }}>Message</label>
                    <textarea
                      required rows={5} placeholder="Tell me about your project..." name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      style={{ background: "#161616", border: "1px solid #2a2a2a", color: "#fafafa", resize: "vertical" }}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: "100%", textAlign: "center" }}>
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${borderDk}`, background: dark ? "#111" : "#0d0d0d", padding: "2rem", transition: "background 0.3s" }}>
        <div className="footer-inner" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, color: "#fafafa" }}>
            <span style={{ color: accent }}>&lt;</span>Aryan<span style={{ color: accent }}> /&gt;</span>
          </span>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem", textAlign: "center" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", color: "#555", letterSpacing: "0.1em" }}>
              © 2026 Aryan Pathrabe
            </span>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", color: "#444", letterSpacing: "0.06em" }}>
              Built with HTML, CSS &amp; JavaScript · Hosted on GitHub Pages or Netlify
            </span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[
              { label: "GitHub", url: "https://github.com/Aryanpathrabe" },
              { label: "LinkedIn", url: "https://linkedin.com/in/aryanpathrabe" },
              { label: "Instagram", url: "https://instagram.com/arynn_77" },
            ].map(({ label, url }) => (
              <a
                key={label} href={url} target="_blank" rel="noopener noreferrer"
                style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "#555", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
