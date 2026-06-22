import axios from "axios";

export const getContestProblems = async (
  req,
  res
) => {
  try {
    const { contestId } = req.params;

    const response = await axios.get(
  `https://codeforces.com/api/contest.standings?contestId=${contestId}`
);

    console.log(response.data);

    res.json(
      response.data.result.problems
    );
  } catch (error) {
    console.error(
      "Contest API Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      message:
        "Failed to fetch contest problems",
      error:
        error.response?.data ||
        error.message,
    });
  }
};