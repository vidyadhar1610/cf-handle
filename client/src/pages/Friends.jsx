import { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
function Friends() {
  const [friend, setFriend] = useState("");
  const [friends, setFriends] = useState([]);
    const [friendDetails, setFriendDetails] =
    useState([]);

  useEffect(() => {
    const saved =
        JSON.parse(
        localStorage.getItem("friends")
        ) || [];

    setFriends(saved);

    fetchFriendDetails(saved);
    }, []);

  const addFriend = () => {
    if (!friend.trim()) return;

    const updated = [...friends, friend];

    setFriends(updated);
    fetchFriendDetails(updated);

    localStorage.setItem(
      "friends",
      JSON.stringify(updated)
    );

    setFriend("");
  };

  const removeFriend = (handle) => {
    const updated = friends.filter(
      (f) => f !== handle
    );

    setFriends(updated);
    fetchFriendDetails(updated);

    localStorage.setItem(
      "friends",
      JSON.stringify(updated)
    );
  };
  const fetchFriendDetails = async (
    handles
    ) => {
    try {
        const details = await Promise.all(
        handles.map(async (handle) => {
            const res = await api.get(
            `/user/${handle}`
            );

            return res.data;
        })
        );

        setFriendDetails(details);
    } catch (err) {
        console.error(err);
    }
    };

  return (
    <div className="min-h-screen bg-[#1a1a2e] p-6">
      <h1 className="text-4xl text-white mb-6">
        Friends
      </h1>
      <Link
        to="/friends-problems"
        className="bg-green-500 px-4 py-2 rounded-lg text-white"
        >
        Friend Problems
        </Link>

      <div className="flex gap-2 mb-6">
        <input
          value={friend}
          onChange={(e) =>
            setFriend(e.target.value)
          }
          placeholder="Enter Codeforces Handle"
          className="bg-[#16213e] text-white p-3 rounded-lg flex-1"
        />

        <button
          onClick={addFriend}
          className="bg-green-500 px-4 rounded-lg text-white"
        >
          Add
        </button>
      </div>

      <div className="space-y-3">
        {friendDetails.map((f) => (
          <div
            key={f}
            className="bg-[#16213e] p-4 rounded-lg flex justify-between items-center"
          >
            <div>
            <p className="text-white text-lg">
                {f.handle}
            </p>

            <p className="text-gray-400">
                {f.rank}
            </p>
            </div>

            <button
              onClick={() =>
                removeFriend(f.handle)
              }
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Friends;