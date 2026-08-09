"use client";

import { useEffect, useState } from "react";

const NAV_MAIN = [
  { id: "home", icon: "⌂", label: "Home" },
  { id: "courses", icon: "▦", label: "Courses" },
  { id: "lectures", icon: "▶", label: "Video Lectures" },
  { id: "tests", icon: "✓", label: "Test Series" },
  { id: "materials", icon: "▤", label: "Study Materials" },
  { id: "progress", icon: "◒", label: "My Progress" },
  { id: "saved", icon: "☆", label: "Saved" },
];
const NAV_COMMUNITY = [
  { id: "community", icon: "◎", label: "Community" },
  { id: "announcements", icon: "!", label: "Announcements" },
];
const NAV_ACCOUNT = [
  { id: "notifications", icon: "♢", label: "Notifications" },
  { id: "profile", icon: "○", label: "Profile" },
  { id: "settings", icon: "⚙", label: "Settings" },
  { id: "admin", icon: "▣", label: "Admin" },
];

function pageTitle(id) {
  if (id === "home") return "Home";
  return id.charAt(0).toUpperCase() + id.slice(1);
}

export default function App() {
  const [page, setPage] = useState("home");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [headerQuery, setHeaderQuery] = useState("");
  const [courseQuery, setCourseQuery] = useState("");
  const [savedKeys, setSavedKeys] = useState(new Set());
  const [selectedOption, setSelectedOption] = useState(null);

  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [tests, setTests] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Load real data from the database-backed API routes
  useEffect(() => {
    async function loadData() {
      try {
        const [coursesRes, lecturesRes, testsRes, materialsRes] = await Promise.all([
          fetch("/api/courses"),
          fetch("/api/lectures"),
          fetch("/api/tests"),
          fetch("/api/materials"),
        ]);
        if (!coursesRes.ok || !lecturesRes.ok || !testsRes.ok || !materialsRes.ok) {
          throw new Error("One or more API routes returned an error");
        }
        setCourses(await coursesRes.json());
        setLectures(await lecturesRes.json());
        setTests(await testsRes.json());
        setMaterials(await materialsRes.json());
      } catch (error) {
        console.error("Failed to load data:", error);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Close modal on Escape, matching original keyboard behavior
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setActiveModal(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Theme: read saved preference on mount, then keep in sync with system changes
  useEffect(() => {
    applyTheme(localStorage.getItem("ph-theme-mode") || "system");
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if ((localStorage.getItem("ph-theme-mode") || "system") === "system") {
        applyTheme("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  function systemTheme() {
    return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function applyTheme(mode) {
    const actual = mode === "system" ? systemTheme() : mode;
    document.documentElement.dataset.theme = actual;
    localStorage.setItem("ph-theme-mode", mode);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", actual === "dark" ? "#141518" : "#f7f7f8");
  }
  function setTheme(mode) {
    applyTheme(mode);
  }
  function toggleTheme() {
    const current = localStorage.getItem("ph-theme-mode") || "system";
    const next = current === "light" ? "dark" : current === "dark" ? "system" : "light";
    setTheme(next);
  }

  function showPage(id) {
    setPage(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  function globalSearch(q) {
    setHeaderQuery(q);
    if (q.trim().length > 1) showPage("courses");
  }
  function toggleSave(key) {
    setSavedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }
  function openVideo(title) {
    alert(
      title +
        " opened.\n\nVideo player, playlist and resume position are ready for backend video integration."
    );
  }
  function submitDemoTest() {
    setActiveModal(null);
    setSelectedOption(null);
    alert("Demo test submitted. Results: 4/5 correct · 80% accuracy.");
  }

  const filteredCourses = courses.filter((c) =>
    (c.name + " " + c.desc).toLowerCase().includes(courseQuery.toLowerCase())
  );

  return (
    <>
      <div
        className={`overlay${sidebarOpen ? " show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />
      <div className="app">
        <aside className={`sidebar${sidebarOpen ? " open" : ""}`}>
          <div className="brand">
            <div className="logo">P</div>
            <div>
              <strong>PROLIFIC HUB</strong>
              <small>Educational Platform</small>
            </div>
          </div>

          <div className="nav-title">Main</div>
          <nav className="nav">
            {NAV_MAIN.map((item) => (
              <button
                key={item.id}
                className={page === item.id ? "active" : ""}
                onClick={() => showPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-title">Community</div>
          <nav className="nav">
            {NAV_COMMUNITY.map((item) => (
              <button
                key={item.id}
                className={page === item.id ? "active" : ""}
                onClick={() => showPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="nav-title">Account</div>
          <nav className="nav">
            {NAV_ACCOUNT.map((item) => (
              <button
                key={item.id}
                className={page === item.id ? "active" : ""}
                onClick={() => showPage(item.id)}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          <div className="student">
            <div className="avatar">IJ</div>
            <div>
              <b>Ishu Jangir</b>
              <span>SSC CGL 2026</span>
            </div>
          </div>
        </aside>

        <main className="main">
          <header className="header">
            <button className="round mobile-menu" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div className="crumb">{pageTitle(page)}</div>
            <input
              className="search"
              placeholder="Search courses, lectures, tests..."
              value={headerQuery}
              onChange={(e) => globalSearch(e.target.value)}
            />
            <div className="header-actions">
              <button className="round" onClick={() => showPage("notifications")}>
                ♢
              </button>
              <button className="round" onClick={toggleTheme}>
                ◐
              </button>
              <button className="round" onClick={() => showPage("profile")}>
                IJ
              </button>
            </div>
          </header>

          <div className="content">
            {/* HOME */}
            <section className={`page${page === "home" ? " active" : ""}`}>
              <h1>Good morning, Student 👋</h1>
              <div className="sub">Continue your preparation from where you left off.</div>
              {loading && <div className="notice">Loading your courses…</div>}
              {loadError && (
                <div className="notice danger">
                  Couldn't reach the database. Check that DATABASE_URL is set correctly in Vercel and redeploy.
                </div>
              )}
              <div className="card hero">
                <div>
                  <div className="small">CONTINUE LEARNING</div>
                  <h2>SSC CGL 2026</h2>
                  <p>General Awareness · Lecture 48 — Vedic Age</p>
                  <div style={{ maxWidth: 500 }}>
                    <div className="row small">
                      <span>Course Progress</span>
                      <b>78%</b>
                    </div>
                    <div className="progress">
                      <i style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
                <button className="btn primary" onClick={() => showPage("lectures")}>
                  Continue Learning →
                </button>
              </div>

              <div className="section">
                <div className="section-head">
                  <h2>Quick Actions</h2>
                </div>
                <div className="quick">
                  <button onClick={() => showPage("tests")}>
                    <span>✓</span>
                    <b>Start Test</b>
                    <small>Practice now</small>
                  </button>
                  <button onClick={() => showPage("courses")}>
                    <span>▦</span>
                    <b>My Courses</b>
                    <small>Continue learning</small>
                  </button>
                  <button onClick={() => showPage("materials")}>
                    <span>▤</span>
                    <b>Study Materials</b>
                    <small>Notes &amp; PDFs</small>
                  </button>
                  <button onClick={() => showPage("progress")}>
                    <span>◒</span>
                    <b>My Progress</b>
                    <small>Track performance</small>
                  </button>
                </div>
              </div>

              <div className="section">
                <div className="section-head">
                  <h2>Your Courses</h2>
                  <button className="btn ghost" onClick={() => showPage("courses")}>
                    View all
                  </button>
                </div>
                <div className="grid g3">
                  {courses.slice(0, 3).map((c, i) => (
                    <CourseCard key={c.id} course={c} index={i} onContinue={() => showPage("lectures")} />
                  ))}
                </div>
              </div>

              <div className="section">
                <div className="section-head">
                  <h2>Recent Tests</h2>
                  <button className="btn ghost" onClick={() => showPage("tests")}>
                    View all
                  </button>
                </div>
                <div className="list">
                  <div className="item">
                    <div className="mini">25Q</div>
                    <div className="grow">
                      <b>Ancient India — Mini Test</b>
                      <div className="small">25 Questions · 20 min · Moderate</div>
                    </div>
                    <span className="success">82%</span>
                  </div>
                  <div className="item">
                    <div className="mini">50Q</div>
                    <div className="grow">
                      <b>SSC CGL GA Practice Set 04</b>
                      <div className="small">50 Questions · 35 min · Hard</div>
                    </div>
                    <span className="success">76%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* COURSES */}
            <section className={`page${page === "courses" ? " active" : ""}`}>
              <h1>Your Courses</h1>
              <div className="sub">Continue learning at your own pace.</div>
              <input
                className="search"
                style={{ width: "100%", maxWidth: 520, marginBottom: 17 }}
                placeholder="Search courses..."
                value={courseQuery}
                onChange={(e) => setCourseQuery(e.target.value)}
              />
              <div className="filters">
                <button className="chip active">All</button>
                <button className="chip">Active</button>
                <button className="chip">Completed</button>
                <button className="chip">Exam</button>
                <button className="chip">Subject</button>
              </div>
              <div className="grid g3">
                {filteredCourses.map((c, i) => (
                  <CourseCard key={c.id} course={c} index={i} onContinue={() => showPage("lectures")} />
                ))}
              </div>
            </section>

            {/* LECTURES */}
            <section className={`page${page === "lectures" ? " active" : ""}`}>
              <h1>Video Lectures</h1>
              <div className="sub">Pick up exactly where you stopped.</div>
              <div className="filters">
                <button className="chip active">All</button>
                <button className="chip">Completed</button>
                <button className="chip">Unwatched</button>
              </div>
              <div className="grid g2">
                {lectures.map((lecture, i) => (
                  <LectureCard
                    key={lecture.id}
                    lecture={lecture}
                    index={i}
                    saved={savedKeys.has(`lecture-${lecture.id}`)}
                    onWatch={() => openVideo(lecture.title)}
                    onToggleSave={() => toggleSave(`lecture-${lecture.id}`)}
                  />
                ))}
              </div>
            </section>

            {/* TESTS */}
            <section className={`page${page === "tests" ? " active" : ""}`}>
              <h1>Test Series</h1>
              <div className="sub">Practice under exam-like conditions and improve your accuracy.</div>
              <div className="filters">
                <button className="chip active">All</button>
                <button className="chip">SSC CGL</button>
                <button className="chip">CDS</button>
                <button className="chip">Banking</button>
                <button className="chip">Railway</button>
              </div>
              <div className="grid g2">
                {tests.map((test, i) => (
                  <TestCard key={test.id} test={test} index={i} onStart={() => setActiveModal("testModal")} />
                ))}
              </div>
            </section>

            {/* MATERIALS */}
            <section className={`page${page === "materials" ? " active" : ""}`}>
              <h1>Study Materials</h1>
              <div className="sub">A focused library for notes, PDFs, vocabulary and PYQs.</div>
              <div className="filters">
                <button className="chip active">All</button>
                <button className="chip">Notes</button>
                <button className="chip">PDFs</button>
                <button className="chip">Current Affairs</button>
                <button className="chip">Vocabulary</button>
                <button className="chip">PYQs</button>
              </div>
              <div className="list">
                {materials.map((material) => (
                  <MaterialItem
                    key={material.id}
                    material={material}
                    saved={savedKeys.has(`material-${material.id}`)}
                    onToggleSave={() => toggleSave(`material-${material.id}`)}
                  />
                ))}
              </div>
            </section>

            {/* PROGRESS */}
            <section className={`page${page === "progress" ? " active" : ""}`}>
              <h1>My Progress</h1>
              <div className="sub">A clear view of your preparation journey.</div>
              <div className="grid g4">
                <div className="card stat">
                  <div className="label">TESTS COMPLETED</div>
                  <div className="num">42</div>
                </div>
                <div className="card stat">
                  <div className="label">AVERAGE SCORE</div>
                  <div className="num">78%</div>
                </div>
                <div className="card stat">
                  <div className="label">ACCURACY</div>
                  <div className="num">84%</div>
                </div>
                <div className="card stat">
                  <div className="label">STUDY STREAK</div>
                  <div className="num">18 days</div>
                </div>
              </div>
              <div className="grid g2 section">
                <div className="card">
                  <h2>Score Progression</h2>
                  <div className="sub">Recent test performance</div>
                  <div className="bar-chart">
                    {[42, 55, 51, 68, 62, 77, 84, 88].map((h, i) => (
                      <i key={i} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="card">
                  <h2>Subject Performance</h2>
                  <div className="sub">Current accuracy</div>
                  <div className="list">
                    {[
                      { subject: "History", pct: 91 },
                      { subject: "Polity", pct: 86 },
                      { subject: "Geography", pct: 79 },
                      { subject: "Economics", pct: 72 },
                    ].map((s) => (
                      <div key={s.subject}>
                        <div className="row small">
                          <span>{s.subject}</span>
                          <b>{s.pct}%</b>
                        </div>
                        <div className="progress">
                          <i style={{ width: `${s.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SAVED */}
            <section className={`page${page === "saved" ? " active" : ""}`}>
              <h1>Saved Content</h1>
              <div className="sub">Everything you bookmarked, in one place.</div>
              <div className="filters">
                <button className="chip active">Saved Lectures</button>
                <button className="chip">Saved Tests</button>
                <button className="chip">Saved Questions</button>
                <button className="chip">Saved Materials</button>
              </div>
              <div className="list">
                <div className="item">
                  <div className="mini">▶</div>
                  <div className="grow">
                    <b>Lecture 48 — Vedic Age</b>
                    <div className="small">SSC CGL 2026 · History</div>
                  </div>
                  <button className="btn secondary" onClick={() => showPage("lectures")}>
                    Open
                  </button>
                </div>
                <div className="item">
                  <div className="mini">PDF</div>
                  <div className="grow">
                    <b>Modern History Revision Notes</b>
                    <div className="small">History · 4.2 MB</div>
                  </div>
                  <button className="btn secondary" onClick={() => showPage("materials")}>
                    Open
                  </button>
                </div>
              </div>
            </section>

            {/* COMMUNITY */}
            <section className={`page${page === "community" ? " active" : ""}`}>
              <h1>Community</h1>
              <div className="sub">Learn together, ask questions and stay connected.</div>
              <div className="grid g3">
                <div className="card">
                  <h2>Discussion</h2>
                  <p className="sub">Share doubts, strategies and useful resources with fellow aspirants.</p>
                  <button className="btn primary">Open Discussion</button>
                </div>
                <div className="card">
                  <h2>WhatsApp Community</h2>
                  <p className="sub">Join the official student community.</p>
                  <button className="btn secondary">Join Community</button>
                </div>
                <div className="card">
                  <h2>Telegram Community</h2>
                  <p className="sub">Get announcements and study updates.</p>
                  <button className="btn secondary">Join Telegram</button>
                </div>
              </div>
            </section>

            {/* ANNOUNCEMENTS */}
            <section className={`page${page === "announcements" ? " active" : ""}`}>
              <h1>Announcements</h1>
              <div className="sub">Important updates from PROLIFIC HUB.</div>
              <div className="list">
                <div className="item">
                  <div className="mini">!</div>
                  <div className="grow">
                    <b>New SSC CGL test series added</b>
                    <div className="small">Today · 12 new tests are now available.</div>
                  </div>
                </div>
                <div className="item">
                  <div className="mini">▶</div>
                  <div className="grow">
                    <b>Ancient India lecture module updated</b>
                    <div className="small">Yesterday · 6 new lectures added.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* NOTIFICATIONS */}
            <section className={`page${page === "notifications" ? " active" : ""}`}>
              <h1>Notifications</h1>
              <div className="sub">Stay updated without losing focus.</div>
              <div className="list">
                <div className="item">
                  <div className="mini">N</div>
                  <div className="grow">
                    <b>New lecture available</b>
                    <div className="small">Vedic Age — Lecture 49</div>
                  </div>
                  <span className="small">New</span>
                </div>
                <div className="item">
                  <div className="mini">✓</div>
                  <div className="grow">
                    <b>Test result is ready</b>
                    <div className="small">SSC CGL GA Practice Set 04 — 76%</div>
                  </div>
                </div>
              </div>
            </section>

            {/* PROFILE */}
            <section className={`page${page === "profile" ? " active" : ""}`}>
              <h1>Profile</h1>
              <div className="sub">Manage your student profile.</div>
              <div className="card">
                <div className="row">
                  <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                    <div className="avatar" style={{ width: 58, height: 58 }}>
                      IJ
                    </div>
                    <div>
                      <h2>Ishu Jangir</h2>
                      <div className="small">SSC CGL 2026 · Student</div>
                    </div>
                  </div>
                  <button className="btn secondary" onClick={() => setActiveModal("editModal")}>
                    Edit Profile
                  </button>
                </div>
                <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "22px 0" }} />
                <div className="grid g3">
                  <div>
                    <span className="small">Email</span>
                    <p>student@example.com</p>
                  </div>
                  <div>
                    <span className="small">Mobile</span>
                    <p>+91 ••••• •••••</p>
                  </div>
                  <div>
                    <span className="small">Target Exam</span>
                    <p>SSC CGL 2026</p>
                  </div>
                </div>
              </div>
            </section>

            {/* SETTINGS */}
            <section className={`page${page === "settings" ? " active" : ""}`}>
              <h1>Settings</h1>
              <div className="sub">Personalize your PROLIFIC HUB experience.</div>
              <div className="card">
                <h2>Appearance</h2>
                <p className="sub">Choose how PROLIFIC HUB looks on this device.</p>
                <div className="filters">
                  <button className="chip" onClick={() => setTheme("light")}>
                    ☀ Light
                  </button>
                  <button className="chip" onClick={() => setTheme("dark")}>
                    🌙 Dark
                  </button>
                  <button className="chip" onClick={() => setTheme("system")}>
                    ⚙ System
                  </button>
                </div>
                <div className="notice">Your appearance preference is saved automatically.</div>
              </div>
              <div className="card section">
                <h2>Notifications</h2>
                <div className="row">
                  <span>New lecture notifications</span>
                  <input type="checkbox" defaultChecked />
                </div>
                <hr style={{ border: 0, borderTop: "1px solid var(--border)", margin: "16px 0" }} />
                <div className="row">
                  <span>Test result notifications</span>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </section>

            {/* ADMIN */}
            <section className={`page${page === "admin" ? " active" : ""}`}>
              <h1>Admin Dashboard</h1>
              <div className="sub">Manage the PROLIFIC HUB learning ecosystem.</div>
              <div className="grid g4">
                <div className="card stat">
                  <div className="label">USERS</div>
                  <div className="num">1,248</div>
                </div>
                <div className="card stat">
                  <div className="label">COURSES</div>
                  <div className="num">12</div>
                </div>
                <div className="card stat">
                  <div className="label">LECTURES</div>
                  <div className="num">486</div>
                </div>
                <div className="card stat">
                  <div className="label">TESTS</div>
                  <div className="num">164</div>
                </div>
              </div>
              <div className="card section">
                <div className="section-head">
                  <h2>Content Management</h2>
                  <button className="btn primary" onClick={() => setActiveModal("courseModal")}>
                    + Create Course
                  </button>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Teacher</th>
                      <th>Status</th>
                      <th>Content</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>SSC CGL 2026</td>
                      <td>Ishu Jangir</td>
                      <td className="success">Published</td>
                      <td>120 Lectures</td>
                      <td>
                        <button className="btn secondary" onClick={() => setActiveModal("courseModal")}>
                          Edit
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td>English Vocabulary &amp; Grammar</td>
                      <td>Ishu Jangir</td>
                      <td className="success">Published</td>
                      <td>86 Lectures</td>
                      <td>
                        <button className="btn secondary" onClick={() => setActiveModal("courseModal")}>
                          Edit
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* TEST MODAL */}
      <div className={`modal${activeModal === "testModal" ? " show" : ""}`}>
        <div className="modalbox">
          <div className="row">
            <h2>SSC CGL — Ancient India</h2>
            <button className="round" onClick={() => setActiveModal(null)}>
              ×
            </button>
          </div>
          <div className="small">
            Question 1 of 5 · <span>20:00</span>
          </div>
          <div className="question">
            Which of the following is associated with the mature phase of the Harappan Civilization?
          </div>
          {[
            "A. Painted Grey Ware",
            "B. Great Bath at Mohenjo-daro",
            "C. Northern Black Polished Ware",
            "D. Megalithic burials",
          ].map((opt) => (
            <button
              key={opt}
              className={`option${selectedOption === opt ? " selected" : ""}`}
              onClick={() => setSelectedOption(opt)}
            >
              {opt}
            </button>
          ))}
          <div className="row" style={{ marginTop: 20 }}>
            <button className="btn secondary">← Previous</button>
            <button className="btn primary" onClick={submitDemoTest}>
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <div className={`modal${activeModal === "editModal" ? " show" : ""}`}>
        <div className="modalbox">
          <div className="row">
            <h2>Edit Profile</h2>
            <button className="round" onClick={() => setActiveModal(null)}>
              ×
            </button>
          </div>
          <div className="form">
            <label>NAME</label>
            <input defaultValue="Ishu Jangir" />
            <label>TARGET EXAM</label>
            <select defaultValue="SSC CGL 2026">
              <option>SSC CGL 2026</option>
              <option>CDS</option>
              <option>AFCAT</option>
              <option>Banking</option>
            </select>
            <button className="btn primary" onClick={() => setActiveModal(null)}>
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* COURSE MODAL */}
      <div className={`modal${activeModal === "courseModal" ? " show" : ""}`}>
        <div className="modalbox">
          <div className="row">
            <h2>Course Management</h2>
            <button className="round" onClick={() => setActiveModal(null)}>
              ×
            </button>
          </div>
          <div className="form">
            <label>COURSE NAME</label>
            <input placeholder="Enter course name" />
            <label>TEACHER</label>
            <input defaultValue="Ishu Jangir" />
            <label>CATEGORY</label>
            <select defaultValue="SSC CGL">
              <option>SSC CGL</option>
              <option>SSC CHSL</option>
              <option>CDS</option>
              <option>General Awareness</option>
            </select>
            <button className="btn primary" onClick={() => setActiveModal(null)}>
              Save Course
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function CourseCard({ course, index, onContinue }) {
  return (
    <div className="card course">
      <div className={`course-thumb${index % 2 ? " darkthumb" : ""}`}>{course.name}</div>
      <h3>{course.name}</h3>
      <p className="sub">{course.desc}</p>
      <div className="small">{course.teacher}</div>
      <div className="meta">{course.meta}</div>
      <div className="row small">
        <span>Course Progress</span>
        <b>{course.progress}%</b>
      </div>
      <div className="progress">
        <i style={{ width: `${course.progress}%` }} />
      </div>
      <p className="small" style={{ margin: "12px 0" }}>
        Last watched: <b style={{ color: "var(--text)" }}>{course.last}</b>
      </p>
      <button className="btn primary" onClick={onContinue}>
        Continue Learning
      </button>
    </div>
  );
}

function LectureCard({ lecture, index, saved, onWatch, onToggleSave }) {
  return (
    <div className="card">
      <div className="row">
        <div className="mini">▶</div>
        <span className="small">{index < 1 ? "78% watched" : "Unwatched"}</span>
      </div>
      <h3 style={{ marginTop: 18 }}>{lecture.title}</h3>
      <p className="sub">SSC CGL 2026 · History · {lecture.duration}</p>
      <div className="row">
        <button className="btn primary" onClick={onWatch}>
          Watch Lecture
        </button>
        <button className="btn secondary" onClick={onToggleSave}>
          {saved ? "★ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}

function TestCard({ test, index, onStart }) {
  return (
    <div className="card">
      <div className="row">
        <h3>{test.title}</h3>
        <span className="chip">{test.difficulty}</span>
      </div>
      <div className="meta">
        {test.question_count} Questions · {test.duration_minutes} min · {test.marks} Marks
      </div>
      <p className="small">
        Previous score: <b style={{ color: "var(--text)" }}>{index % 3 ? 76 : 82}%</b>
      </p>
      <button className="btn primary" onClick={onStart}>
        Start Test
      </button>
    </div>
  );
}

function MaterialItem({ material, saved, onToggleSave }) {
  return (
    <div className="item">
      <div className="mini">{material.file_type}</div>
      <div className="grow">
        <b>{material.title}</b>
        <div className="small">{material.size_mb} MB · Updated recently</div>
      </div>
      <button className="btn secondary" onClick={onToggleSave}>
        {saved ? "★ Saved" : "☆ Save"}
      </button>
      <button className="btn primary">Open</button>
    </div>
  );
}