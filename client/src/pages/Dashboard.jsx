import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import RatingGraph from "../components/RatingGraph";
import Heatmap from "../components/Heatmap";

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

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-6">
      <h1 className="text-3xl text-white mb-6">
        {user.handle}
      </h1>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
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