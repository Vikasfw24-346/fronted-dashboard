import { useState } from "react";
import "./filter.css";
// FiltersForm Component
export default function FiltersForm({ setFilters }) {
  const [form, setForm] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
    city: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFilters(form);
  };

  const handleReset = () => {
    const resetForm = {
      end_year: "",
      topic: "",
      sector: "",
      region: "",
      pestle: "",
      source: "",
      country: "",
      city: "",
    };
    setForm(resetForm);
    setFilters({});
  };

  return (
    <div
      className="app-content content"
      style={{
        padding: "20px",
        backgroundColor: "#ffffff",
        maxWidth: "100%",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="content-wrapper">
        <div className="bg-indigo-50 shadow-lg rounded-2xl p-8 mx-auto">
          <h2 className="text-2xl font-semibold mb-6 filter-title">Filter Insights</h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 filters-form"
            // style={{
            //   display: "grid",
            //   gridTemplateColumns: "1fr 1fr 1fr 1fr",
            //   gap: "20px",
            //   alignItems: "center",
              
            // }}
          >
            {/* Other fields */}
            {[
              "End Year",
              "topic",
              "sector",
              "region",
              "pestle",
              "source",
              "country",
              "city",
            ].map((field) => (
              <div
                key={field}
                style={{
                  padding: "12px 24px",
                  margin: "6px",
                  border: "none",
                  borderRadius: "8px",
                  backgroundColor: "#f3f4f6",
                }}
              >
                <label
                  className="block text-gray-700 text-sm font-medium mb-4 capitalize"
                  style={{ textTransform: "capitalize", fontWeight: "600" }}
                >
                  {field}
                </label>
                <input
                  type="text"
                  name={field}
                  placeholder={`Enter ${field}`}
                  value={form[field]}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    border: "1px solid #d1d5db",
                    borderRadius: "8px",
                    padding: "12px",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box",
                    marginTop: "4px",
                  }}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            ))}

            {/* Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="submit"
                className="bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                style={{
                  padding: "12px 24px",
                  margin: "6px",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Apply Filters
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                style={{
                  padding: "12px 24px",
                  margin: "6px",
                  border: "none",
                  borderRadius: "8px",
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
