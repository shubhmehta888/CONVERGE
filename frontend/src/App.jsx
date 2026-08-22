import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Find from "./pages/Find.jsx";
import Team from "./pages/Team.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<Find />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </main>
      <footer className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-text-faint">
          Converge — a student-built full-stack demo. Not affiliated with any campus.
        </div>
      </footer>
    </div>
  );
}
