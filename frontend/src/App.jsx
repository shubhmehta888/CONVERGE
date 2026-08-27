import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Home from "./pages/Home.jsx";

// Route-level code splitting: only Home ships in the initial bundle,
// every other page is fetched on demand (fixes "shipping unused JS").
const Find = lazy(() => import("./pages/Find.jsx"));
const Discover = lazy(() => import("./pages/Discover.jsx"));
const Events = lazy(() => import("./pages/Events.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Chats = lazy(() => import("./pages/Chats.jsx"));
const Login = lazy(() => import("./pages/Login.jsx"));
const CampusLive = lazy(() => import("./pages/CampusLive.jsx"));
const Circles = lazy(() => import("./pages/Circles.jsx"));
const Vibe = lazy(() => import("./pages/Vibe.jsx"));
const Team = lazy(() => import("./pages/Team.jsx"));

export default function App() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Suspense fallback={null}>
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
        </Suspense>
      </main>
      <footer className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-text-faint">
          Converge — the student connection layer for Scaler School of Technology.
        </div>
      </footer>
    </div>
  );
}
