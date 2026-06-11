import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [handle, setHandle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!handle.trim()) return;

    localStorage.setItem("cfHandle", handle);

    navigate(`/dashboard/${handle}`);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
      <div className="w-full max-w-md p-6">
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          CodePulse
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Track your Codeforces progress
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Codeforces Handle"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#16213e] text-white border border-gray-700"
          />

          <button
            type="submit"
            className="w-full mt-4 bg-green-500 py-3 rounded-lg font-semibold"
          >
            Track
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;