import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

function ProblemsByRating() {
  const { handle } = useParams();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await api.get(
        `/user/${handle}/submissions`
      );

      const solved = new Set();

      const buckets = {};

      res.data.forEach((sub) => {
        if (
          sub.verdict === "OK" &&
          sub.problem.rating
        ) {
          const key = `${sub.problem.contestId}-${sub.problem.index}`;

          if (!solved.has(key)) {
            solved.add(key);

            const rating =
              Math.floor(
                sub.problem.rating / 100
              ) * 100;

            buckets[rating] =
              (buckets[rating] || 0) + 1;
          }
        }
      });

      const chartData = Object.keys(
        buckets
      ).map((rating) => ({
        rating,
        count: buckets[rating],
      }));

      chartData.sort(
        (a, b) => a.rating - b.rating
      );

      setData(chartData);
    } catch (err) {
      console.error(err);
    }
  };
  const getRatingColor = (rating) => {
    rating = Number(rating);

    if (rating < 1200) return "#22c55e"; // Green
    if (rating < 1400) return "#14b8a6"; // Teal
    if (rating < 1600) return "#06b6d4"; // Cyan
    if (rating < 1900) return "#3b82f6"; // Blue
    if (rating < 2100) return "#8b5cf6"; // Violet
    if (rating < 2400) return "#a855f7"; // Purple
    if (rating < 2700) return "#d946ef"; // Pink
    if (rating < 3000) return "#ec4899"; // Rose
    if (rating < 3300) return "#f97316"; // Orange
    return "#eab308"; // Gold
    };

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-6">
      <h1 className="text-4xl text-white mb-8">
        Problems By Rating
      </h1>

      <div className="bg-[#16213e] p-6 rounded-lg">
        <ResponsiveContainer
          width="100%"
          height={500}
        >
          <BarChart data={data}>
            <XAxis dataKey="rating" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="count">
                {data.map((entry, index) => (
                    <Cell
                    key={`cell-${index}`}
                    fill={getRatingColor(entry.rating)}
                    />
                ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ProblemsByRating;