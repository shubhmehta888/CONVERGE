import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";
import Find from "./pages/Find.jsx";
import Team from "./pages/Team.jsx";
import Discover from "./pages/Discover.jsx";
import Events from "./pages/Events.jsx";
import Profile from "./pages/Profile.jsx";
import Chats from "./pages/Chats.jsx";
import Login from "./pages/Login.jsx";
import CampusLive from "./pages/CampusLive.jsx";
import Circles from "./pages/Circles.jsx";
import Vibe from "./pages/Vibe.jsx";

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/find" element={<Find />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/events" element={<Events />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/chats" element={<Chats />} />
          <Route path="/login" element={<Login />} />
          <Route path="/campus-live" element={<CampusLive />} />
          <Route path="/circles" element={<Circles />} />
          <Route path="/vibe" element={<Vibe />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </main>
      <footer className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-text-faint">
          Converge — the student connection layer for Scaler School of Technology.
        </div>
      </footer>
    </div>
  );
}
