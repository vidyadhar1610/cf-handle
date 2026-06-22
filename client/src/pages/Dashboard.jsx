import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import RatingGraph from "../components/RatingGraph";
import Heatmap from "../components/Heatmap";
import { Link } from "react-router-dom";

function Dashboard() {
  const { handle } = useParams();

  const [user, setUser] = useState(null);
  const [ratingData, setRatingData] = useState([]);
  const [solvedCount, setSolvedCount] =
  useState(0);
  const [contestCount, setContestCount] = useState(0);
  const [currentStreak, setCurrentStreak] =
  useState(0);
  const [heatmapData, setHeatmapData] =
  useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [handle]);

const fetchData = async () => {
  try {
    const userRes = await api.get(`/user/${handle}`);

    const ratingRes = await api.get(
      `/user/${handle}/rating`
    );

    const submissionRes = await api.get(
      `/user/${handle}/submissions`
    );

    setUser(userRes.data);

    // Rating Graph Data
    const formattedData = ratingRes.data.map(
      (contest, index) => ({
        contestNumber: index + 1,
        rating: contest.newRating,
        contestName: contest.contestName,
      })
    );

    setRatingData(formattedData);
    setContestCount(ratingRes.data.length);

    // Problems Solved Count
    const solved = new Set();

    submissionRes.data.forEach((sub) => {
      if (sub.verdict === "OK") {
        solved.add(
          `${sub.problem.contestId}-${sub.problem.index}`
        );
      }
    });

    setSolvedCount(solved.size);
    const dates = new Set();
    const submissionMap = {};

submissionRes.data.forEach((sub) => {
  const date = new Date(
    sub.creationTimeSeconds * 1000
  )
    .toISOString()
    .split("T")[0];

  submissionMap[date] =
    (submissionMap[date] || 0) + 1;
});

const heatmap = Object.entries(
  submissionMap
).map(([date, count]) => ({
  date,
  count,
}));

setHeatmapData(heatmap);

submissionRes.data.forEach((sub) => {
  const date = new Date(
    sub.creationTimeSeconds * 1000
  )
    .toISOString()
    .split("T")[0];

  dates.add(date);
});

let streak = 0;

const today = new Date();

while (true) {
  const dateStr = today
    .toISOString()
    .split("T")[0];

  if (dates.has(dateStr)) {
    streak++;
    today.setDate(today.getDate() - 1);
  } else {
    break;
  }
}

setCurrentStreak(streak);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  if (loading) {
    return (
      <div className="text-white p-10">
        Loading...
      </div>
    );
  }
  const getRankColor = (rank) => {
  if (!rank) return "text-gray-400";

  if (rank.includes("newbie"))
    return "text-gray-400";

  if (rank.includes("pupil"))
    return "text-green-500";

  if (rank.includes("specialist"))
    return "text-cyan-400";

  if (rank.includes("expert"))
    return "text-blue-500";

  if (rank.includes("candidate master"))
    return "text-violet-500";

  if (rank.includes("master"))
    return "text-orange-400";

  if (rank.includes("grandmaster"))
    return "text-red-500";

  return "text-white";
};

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-6">
      <h1 className="text-3xl text-white mb-6">
        {user.handle}
      </h1>
      <Link
        to="/friends"
        className="bg-green-500 px-4 py-2 rounded-lg text-white"
      >
        Friends
      </Link>
      <Link
        to={`/problems/${handle}`}
        className="inline-block mb-6 bg-green-500 px-4 py-2 rounded-lg text-white"
      >
        Problems Analytics
      </Link>
      <Link
        to={`/practice/${handle}`}
        className="bg-purple-600 px-4 py-2 rounded-lg text-white"
      >
        Practice Zone
      </Link>

      <div className="grid md:grid-cols-5 gap-4 mb-6">
        <div className="bg-[#16213e] p-4 rounded-lg">
          <h3 className="text-gray-400">
            Current Rating
          </h3>
          <p className="text-2xl text-white">
            {user.rating || "Unrated"}
          </p>
        </div>

        <div className="bg-[#16213e] p-4 rounded-lg">
  <h3 className="text-gray-400">
    Current Streak
  </h3>

  <p className="text-2xl text-white">
    {currentStreak} days
  </p>
</div>

        <div className="bg-[#16213e] p-4 rounded-lg">
  <h3 className="text-gray-400">
    Contests
  </h3>

  <p className="text-2xl text-white">
    {contestCount}
  </p>
</div>
<div className="bg-[#16213e] p-4 rounded-lg">
  <h3 className="text-gray-400">
    Rank
  </h3>

  <p className="text-2xl text-white">
    {user.rank}
  </p>
</div>

        <div className="bg-[#16213e] p-4 rounded-lg">
  <h3 className="text-gray-400">
    Problems Solved
  </h3>
  <p className="text-2xl text-white">
    {solvedCount}
  </p>
</div>
      </div>

      <RatingGraph data={ratingData} />
      <Heatmap values={heatmapData} />
    </div>
  );
}

export default Dashboard;