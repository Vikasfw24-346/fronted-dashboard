import { useEffect, useState, useMemo } from "react";
import { fetchInsights } from "../services/api";
import "./filter.css";
import IntensityChart from "./charts/IntensityChart";
import LikelihoodChart from "./charts/LikelihoodChart";
import RelevanceChart from "./charts/RelevanceChart";
import CountryChart from "./charts/CountryChart";
import TopicChart from "./charts/TopicChart";
import RegionChart from "./charts/RegionChart";
import Filters from "./Filters";
// import CongratulationsCard from "./charts/CongratulationsCard";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [clearSignal, setClearSignal] = useState(0);

  /*FETCH DATA FROM BACKEND */
  useEffect(() => {
    fetchInsights(filters).then(setData);
  }, [filters]);

  /*FILTER ALL CHARTS BY REGION*/
  const filteredData = useMemo(() => {
    if (!selectedRegion) return data;
    return data.filter((item) => item.region === selectedRegion);
  }, [data, selectedRegion]);

  return (
    <div
      className="p-6 bg-gray-100 min-h-screen dashboard-container"
      // style={{ backgroundColor: "#f3f4f6" }}
    >
      <div className="space-y-6">
        {/*FILTERS CARD*/}
        <div className="bg-white rounded-xl shadow p-4 relative">
          <Filters
            setFilters={setFilters}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            clearSignal={clearSignal}
          />
        </div>

        {/*ACTIVE REGION CHIP*/}
        {selectedRegion && (
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
              Region: {selectedRegion}
            </span>
            <button
              onClick={() => setSelectedRegion(null)}
              className="text-sm text-red-500 hover:underline"
            >
              Clear
            </button>
          </div>
        )}

        {/*CHARTS GRID*/}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 dashboard-charts"
          // style={{
          //   display: "grid",
          //   gridTemplateColumns: "repeat(auto-fit, minmax(500px, 1fr))",
          //   placeItems: "center",
          //   gap: "24px",
          // }}
        >
          {/* <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Congratulations Card</h3>
            < CongratulationsCard />
          </div> */}

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Intensity</h3>
            <IntensityChart data={filteredData} />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Likelihood</h3>
            <LikelihoodChart data={filteredData} />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Relevance</h3>
            <RelevanceChart data={filteredData} />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Country</h3>
            <CountryChart data={filteredData} />
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Topic</h3>
            <TopicChart data={filteredData} />
          </div>

          {/*REGION CONTROLS EVERYTHING */}
          <div className="bg-white rounded-xl shadow p-4">
            <h3 className="font-semibold text-sm mb-2">Region</h3>
            <RegionChart
              data={data}
              onSelectRegion={setSelectedRegion}
              selectedRegion={selectedRegion}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
