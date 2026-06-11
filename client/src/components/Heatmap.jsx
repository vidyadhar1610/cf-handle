import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

function Heatmap({ values }) {
  return (
    <div className="bg-[#16213e] p-4 rounded-lg mt-6">
      <h2 className="text-white text-xl mb-4">
        Submission Heatmap
      </h2>

      <CalendarHeatmap
        startDate={new Date("2026-01-01")}
        endDate={new Date()}
        values={values}
        classForValue={(value) => {
          if (!value) return "color-empty";

          if (value.count >= 10)
            return "color-github-4";

          if (value.count >= 5)
            return "color-github-3";

          if (value.count >= 2)
            return "color-github-2";

          return "color-github-1";
        }}
      />
    </div>
  );
}

export default Heatmap;