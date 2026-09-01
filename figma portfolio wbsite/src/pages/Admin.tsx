import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const ADMIN_PASSWORD = "aryan@admin123";

type Project = {
  id?: string;
  num: string;
  title: string;
  role: string;
  category: string;
  tags: string[];
  description: string;
  img: string;
  link: string;
};

type Skill = {
  id?: string;
  name: string;
  level: number;
};

const emptyProject: Project = { num: "", title: "", role: "", category: "Core", tags: [], description: "", img: "", link: "" };
const emptySkill: Skill = { name: "", level: 50 };

export default function Admin() {
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

  useEffect(() => {
    if (authed) { fetchProjects(); fetchSkills(); }
  }, [authed]);

  async function fetchProjects() {
    const { data } = await supabase.from("projects").select("*").order("num");
    if (data) setProjects(data);
  }

  async function fetchSkills() {
    const { data } = await supabase.from("skills").select("*").order("created_at");
    if (data) setSkills(data);
  }

  function flash(m: string) { setMsg(m); setTimeout(() => setMsg(""), 2500); }

  async function saveProject() {
    const payload = { ...projectForm, tags: typeof projectForm.tags === "string" ? (projectForm.tags as unknown as string).split(",").map((t) => t.trim()) : projectForm.tags };
    if (editingProject) {
      await supabase.from("projects").update(payload).eq("id", editingProject);
      flash("Project updated!");
    } else {
      await supabase.from("projects").insert(payload);
      flash("Project added!");
    }
    setProjectForm(emptyProject); setEditingProject(null); fetchProjects();
  }

  async function deleteProject(id: string) {
    await supabase.from("projects").delete().eq("id", id);
    flash("Project deleted!"); fetchProjects();
  }

  async function saveSkill() {
    if (editingSkill) {
      await supabase.from("skills").update(skillForm).eq("id", editingSkill);
      flash("Skill updated!");
    } else {
      await supabase.from("skills").insert(skillForm);
      flash("Skill added!");
    }
    setSkillForm(emptySkill); setEditingSkill(null); fetchSkills();
  }

  async function deleteSkill(id: string) {
    await supabase.from("skills").delete().eq("id", id);
    flash("Skill deleted!"); fetchSkills();
  }

  const accent = "#e8001c";
  const inputStyle = { background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#fafafa", padding: "0.6rem 0.9rem", width: "100%", fontFamily: "'DM Sans', sans-serif", fontSize: "0.9rem", borderRadius: "4px" };
  const labelStyle = { fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: "0.35rem" };
  const btnStyle = { fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.08em", textTransform: "uppercase" as const, padding: "0.6rem 1.4rem", border: "none", cursor: "pointer", borderRadius: "4px" };

  if (!authed) {
    return (
      <div style={{ minHeight: "100vh", background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#161616", border: "1px solid #2a2a2a", padding: "2.5rem", width: "100%", maxWidth: "360px", borderRadius: "8px" }}>
          <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, color: "#fafafa", fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            <span style={{ color: accent }}>&lt;</span>Admin<span style={{ color: accent }}> /&gt;</span>
          </h1>
          <p style={{ color: "#666", fontSize: "0.85rem", marginBottom: "1.5rem", fontFamily: "'DM Sans', sans-serif" }}>Portfolio control panel</p>
          <label style={labelStyle}>Password</label>
          <input
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (password === ADMIN_PASSWORD ? setAuthed(true) : flash("Wrong password!"))}
            style={{ ...inputStyle, marginBottom: "1rem" }}
            placeholder="Enter password"
          />
          {msg && <p style={{ color: accent, fontSize: "0.8rem", marginBottom: "0.75rem", fontFamily: "'DM Mono', monospace" }}>{msg}</p>}
          <button onClick={() => password === ADMIN_PASSWORD ? setAuthed(true) : flash("Wrong password!")} style={{ ...btnStyle, background: accent, color: "#fff", width: "100%" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d0d", color: "#fafafa", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <header style={{ background: "#111", borderBottom: "1px solid #2a2a2a", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 800, fontSize: "1.1rem" }}>
          <span style={{ color: accent }}>&lt;</span>Admin Panel<span style={{ color: accent }}> /&gt;</span>
        </h1>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {msg && <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: "#2dd4ac" }}>{msg}</span>}
          <button onClick={() => window.location.href = "/"} style={{ ...btnStyle, background: "transparent", color: "#666", border: "1px solid #2a2a2a" }}>
            ← Portfolio
          </button>
          <button onClick={() => setAuthed(false)} style={{ ...btnStyle, background: "#1a1a1a", color: "#fafafa", border: "1px solid #2a2a2a" }}>
            Logout
          </button>
        </div>
      </header>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem" }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
          {(["projects", "skills"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{ ...btnStyle, background: tab === t ? accent : "#1a1a1a", color: tab === t ? "#fff" : "#aaa", border: "1px solid #2a2a2a" }}>
              {t}
            </button>
          ))}
        </div>

        {/* PROJECTS TAB */}
        {tab === "projects" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem", alignItems: "start" }}>
            {/* Form */}
            <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem", color: "#fafafa" }}>
                {editingProject ? "Edit Project" : "Add Project"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {([
                  { label: "Number (e.g. 01)", key: "num" },
                  { label: "Title", key: "title" },
                  { label: "Role (e.g. Core · 2024)", key: "role" },
                  { label: "Image URL", key: "img" },
                  { label: "Project Link", key: "link" },
                  { label: "Tags (comma separated)", key: "tags" },
                ] as { label: string; key: keyof Project }[]).map(({ label, key }) => (
                  <div key={key}>
                    <label style={labelStyle}>{label}</label>
                    <input
                      style={inputStyle}
                      value={Array.isArray(projectForm[key]) ? (projectForm[key] as string[]).join(", ") : projectForm[key] as string}
                      onChange={(e) => setProjectForm({ ...projectForm, [key]: e.target.value })}
                      placeholder={label}
                    />
                  </div>
                ))}
                <div>
                  <label style={labelStyle}>Category</label>
                  <select value={projectForm.category} onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })} style={{ ...inputStyle }}>
                    <option value="Core">Core</option>
                    <option value="AI Projects">AI Projects</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Description</label>
                  <textarea rows={3} style={{ ...inputStyle, resize: "vertical" }} value={projectForm.description} onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })} placeholder="Project description" />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={saveProject} style={{ ...btnStyle, background: accent, color: "#fff", flex: 1 }}>
                    {editingProject ? "Update" : "Add"} Project
                  </button>
                  {editingProject && (
                    <button onClick={() => { setProjectForm(emptyProject); setEditingProject(null); }} style={{ ...btnStyle, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a" }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem", color: "#fafafa" }}>
                Projects ({projects.length})
              </h2>
              {projects.length === 0 && <p style={{ color: "#555", fontSize: "0.85rem" }}>No projects yet — add one!</p>}
              {projects.map((p) => (
                <div key={p.id} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "0.95rem" }}>{p.num} — {p.title}</p>
                    <p style={{ color: "#666", fontSize: "0.8rem", fontFamily: "'DM Mono', monospace" }}>{p.category} · {p.role}</p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => { setProjectForm({ ...p, tags: p.tags || [] }); setEditingProject(p.id!); }} style={{ ...btnStyle, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a", fontSize: "0.72rem" }}>
                      Edit
                    </button>
                    <button onClick={() => deleteProject(p.id!)} style={{ ...btnStyle, background: "#2a0a0a", color: accent, border: `1px solid ${accent}`, fontSize: "0.72rem" }}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILLS TAB */}
        {tab === "skills" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "2rem", alignItems: "start" }}>
            {/* Form */}
            <div style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1.5rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem", marginBottom: "1.25rem" }}>
                {editingSkill ? "Edit Skill" : "Add Skill"}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={labelStyle}>Skill Name</label>
                  <input style={inputStyle} value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} placeholder="e.g. React / Next.js" />
                </div>
                <div>
                  <label style={labelStyle}>Level: {skillForm.level}%</label>
                  <input type="range" min={0} max={100} value={skillForm.level} onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })} style={{ width: "100%", accentColor: accent }} />
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={saveSkill} style={{ ...btnStyle, background: accent, color: "#fff", flex: 1 }}>
                    {editingSkill ? "Update" : "Add"} Skill
                  </button>
                  {editingSkill && (
                    <button onClick={() => { setSkillForm(emptySkill); setEditingSkill(null); }} style={{ ...btnStyle, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a" }}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <h2 style={{ fontFamily: "'Jost', sans-serif", fontWeight: 700, fontSize: "1rem" }}>
                Skills ({skills.length})
              </h2>
              {skills.length === 0 && <p style={{ color: "#555", fontSize: "0.85rem" }}>No skills yet — add one!</p>}
              {skills.map((s) => (
                <div key={s.id} style={{ background: "#111", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ flex: 1, marginRight: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 600, fontSize: "0.9rem" }}>{s.name}</span>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", color: accent }}>{s.level}%</span>
                    </div>
                    <div style={{ background: "#2a2a2a", height: "2px", borderRadius: "1px" }}>
                      <div style={{ background: accent, height: "2px", width: `${s.level}%`, borderRadius: "1px" }} />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => { setSkillForm(s); setEditingSkill(s.id!); }} style={{ ...btnStyle, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a", fontSize: "0.72rem" }}>
                      Edit
                    </button>
                    <button onClick={() => deleteSkill(s.id!)} style={{ ...btnStyle, background: "#2a0a0a", color: accent, border: `1px solid ${accent}`, fontSize: "0.72rem" }}>
                      Delete
                    </button>
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

