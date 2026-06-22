import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import ProblemsByRating from "./pages/ProblemsByRating";
import Friends from "./pages/Friends";
import FriendProblems from "./pages/FriendProblems";
import PracticeZone from "./pages/PracticeZone";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard/:handle"
          element={<Dashboard />}
        />
        <Route
          path="/problems/:handle"
          element={<ProblemsByRating />}
        />
        <Route
          path="/friends"
          element={<Friends />}
        />
        <Route
          path="/friends-problems"
          element={<FriendProblems />}
        />
        <Route
          path="/practice/:handle"
          element={<PracticeZone />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;