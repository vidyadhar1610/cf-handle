import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
function PracticeZone() {
  const { handle } = useParams();
  const [unfinishedProblems, setUnfinishedProblems] =
  useState([]);

const [loading, setLoading] = useState(true);
const [activeTab, setActiveTab] =
  useState("unfinished");
  const [missedProblems, setMissedProblems] =
  useState([]);

useEffect(() => {
  fetchUnfinishedProblems();
}, []);
useEffect(() => {
  if (activeTab === "missed") {
    fetchMissedProblems();
  }
}, [activeTab]);

const fetchUnfinishedProblems = async () => {
  try {
    const res = await api.get(
      `/user/${handle}/submissions`
    );

    const problemMap = {};

    res.data.forEach((sub) => {
      const key = `${sub.problem.contestId}-${sub.problem.index}`;

      if (!problemMap[key]) {
        problemMap[key] = {
          name: sub.problem.name,
          rating:
            sub.problem.rating || "N/A",
          contestId:
            sub.problem.contestId,
          index: sub.problem.index,
          attempts: 0,
          solved: false,
        };
      }

      problemMap[key].attempts++;

      if (sub.verdict === "OK") {
        problemMap[key].solved = true;
      }
    });

    const unfinished = Object.values(
      problemMap
    ).filter(
      (problem) =>
        !problem.solved &&
        problem.attempts > 0
    );

    setUnfinishedProblems(
      unfinished.sort(
        (a, b) =>
          b.attempts - a.attempts
      )
    );
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};
const fetchMissedProblems = async () => {
  try {
    console.log(
      "Fetching missed problems..."
    );
  } catch (err) {
    console.error(err);
  }
};
if (loading) {
  return (
    <div className="text-white p-6">
      Loading...
    </div>
  );
}

  return (
  <div className="min-h-screen bg-[#1a1a2e] p-6">
    <h1 className="text-4xl text-white mb-6">
      Unfinished Business
    </h1>
    <div className="flex gap-3 mb-6">
  <button
    onClick={() =>
      setActiveTab("unfinished")
    }
    className={`px-4 py-2 rounded ${
      activeTab === "unfinished"
        ? "bg-purple-600"
        : "bg-[#16213e]"
    }`}
  >
    Unfinished Business
  </button>

  <button
    onClick={() =>
      setActiveTab("missed")
    }
    className={`px-4 py-2 rounded ${
      activeTab === "missed"
        ? "bg-purple-600"
        : "bg-[#16213e]"
    }`}
  >
    Missed In Contest
  </button>
</div>

    <div className="bg-[#16213e] rounded-lg overflow-hidden">
      <table className="w-full text-white">
        <thead className="bg-[#0f3460]">
          <tr>
            <th className="p-4 text-left">
              Problem
            </th>

            <th className="p-4 text-left">
              Rating
            </th>

            <th className="p-4 text-left">
              Attempts
            </th>

            <th className="p-4 text-left">
              Link
            </th>
          </tr>
        </thead>

        <tbody>
          {unfinishedProblems.map(
            (problem, index) => (
              <tr
                key={index}
                className="border-b border-gray-700"
              >
                <td className="p-4">
                  {problem.name}
                </td>

                <td className="p-4">
                  {problem.rating}
                </td>

                <td className="p-4">
                  {problem.attempts}
                </td>

                <td className="p-4">
                  <a
                    href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400"
                  >
                    Open
                  </a>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  </div>
);
}

export default PracticeZone;