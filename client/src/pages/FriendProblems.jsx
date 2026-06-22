import { useEffect, useState } from "react";
import api from "../services/api";

function FriendProblems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] =
  useState(null);
  const [searchTerm, setSearchTerm] =
  useState("");

  useEffect(() => {
    fetchFriendProblems();
  }, []);

  const fetchFriendProblems = async () => {
    try {
      const friends =
        JSON.parse(
          localStorage.getItem("friends")
        ) || [];

      const problemMap = {};

      for (const friend of friends) {
        const res = await api.get(
          `/user/${friend}/submissions`
        );

        const solved = res.data.filter(
          (sub) =>
            sub.verdict === "OK" &&
            sub.problem.rating
        );

        solved.forEach((sub) => {
          const key = `${sub.problem.contestId}-${sub.problem.index}`;

          if (!problemMap[key]) {
            problemMap[key] = {
              name: sub.problem.name,
              rating: sub.problem.rating,
              contestId: sub.problem.contestId,
              index: sub.problem.index,
              solvedBy: [],
            };
          }

          if (
            !problemMap[key].solvedBy.includes(
              friend
            )
          ) {
            problemMap[key].solvedBy.push(
              friend
            );
          }
        });
      }

      setProblems(
  Object.values(problemMap).sort(
    (a, b) => a.rating - b.rating
  )
);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-white p-6">
        Loading...
      </div>
    );
  }
  const getRatingColor = (rating) => {
  if (rating < 1200)
    return "text-green-400";

  if (rating < 1600)
    return "text-cyan-400";

  if (rating < 1900)
    return "text-blue-400";

  if (rating < 2100)
    return "text-violet-400";

  if (rating < 2400)
    return "text-orange-400";

  return "text-red-400";
};
const ratingBuckets = [
  800, 900, 1000, 1100, 1200,
  1300, 1400, 1500, 1600,
  1700, 1800, 1900, 2000
];

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-6">
      <h1 className="text-4xl text-white mb-6">
        Friend Problem Explorer
      </h1>
      <div className="flex flex-wrap gap-2 mb-6">
  <button
    onClick={() => setSelectedRating(null)}
    className="px-4 py-2 rounded bg-gray-600 text-white"
  >
    All
  </button>

  {ratingBuckets.map((rating) => (
    <button
      key={rating}
      onClick={() =>
        setSelectedRating(rating)
      }
      className={`px-4 py-2 rounded text-white ${
        selectedRating === rating
          ? "bg-green-600"
          : "bg-[#0f3460]"
      }`}
    >
      {rating}
    </button>
  ))}
</div>
<p className="text-gray-400 mb-4">
  Showing {
    problems.filter((problem) => {
  const ratingMatch =
    selectedRating === null ||
    Math.floor(
      problem.rating / 100
    ) *
      100 ===
      selectedRating;

  const searchMatch =
    problem.name
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      );

  return ratingMatch && searchMatch;
}).length
  } problems
</p>
<input
  type="text"
  placeholder="Search problem..."
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  className="w-full mb-4 p-3 rounded bg-[#0f3460] text-white"
/>

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
          Solved By
        </th>

        <th className="p-4 text-left">
          Link
        </th>
      </tr>
    </thead>

    <tbody>
  {problems
    .filter((problem) => {
      if (selectedRating === null)
        return true;

      return (
        Math.floor(
          problem.rating / 100
        ) *
          100 ===
        selectedRating
      );
    })
    .map((problem, index) => (
          <tr
            key={index}
            className="border-b border-gray-700 hover:bg-[#1e293b]"
          >
           <td className="p-4">
  <a
    href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
    target="_blank"
    rel="noreferrer"
    className="text-cyan-400 hover:text-cyan-300"
  >
    {problem.name}
  </a>
</td>

            <td
              className={`p-4 ${getRatingColor(
                problem.rating
              )}`}
            >
              {problem.rating}
            </td>

            <td className="p-4">
  <div className="flex flex-wrap gap-2">
    {problem.solvedBy.map(
      (friend) => (
        <span
          key={friend}
          className="px-2 py-1 rounded-full bg-blue-600 text-white text-sm"
        >
          {friend}
        </span>
      )
    )}
  </div>
</td>

            <td className="p-4">
              <a
                href={`https://codeforces.com/problemset/problem/${problem.contestId}/${problem.index}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400"
              >
                Open
              </a>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
    </div>
  );
}

export default FriendProblems;