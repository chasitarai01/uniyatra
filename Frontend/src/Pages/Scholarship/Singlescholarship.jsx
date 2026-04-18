// SingleScholarship.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleScholarship = () => {
  const { id } = useParams(); // Get scholarship ID from URL
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScholarship = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/scholarships/${id}`);
        console.log("API response:", res.data);

        if (res.data.success && res.data.data) {
          setScholarship(res.data.data); // single scholarship object
        } else {
          setScholarship(null);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching scholarship:", err);
        setError("Failed to load scholarship");
        setLoading(false);
      }
    };

    fetchScholarship();
  }, [id]);

  if (loading) return <p className="p-6">Loading scholarship...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!scholarship) return <p className="p-6">Scholarship not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{scholarship.ScholarshipName}</h1>
      <div className="space-y-2">
        <p><strong>University:</strong> {scholarship.University}</p>
        <p><strong>Faculty:</strong> {scholarship.Faculty}</p>
        <p><strong>Level:</strong> {scholarship.Level}</p>
        <p><strong>Country:</strong> {scholarship.Country}</p>
        <p><strong>Scholarship Value:</strong> {scholarship.ScholarshipValue}</p>
        <p><strong>No. of Awards:</strong> {scholarship.NoOfAwardsAvailable}</p>
        <p>
          <strong>Criteria:</strong>{" "}
          {scholarship.Criteria?.split("\\n").map((line, index) => (
            <span key={index}>
              {line} <br />
            </span>
          ))}
        </p>
        <p><strong>Nationality:</strong> {scholarship.Nationality}</p>
        <p><strong>How to Apply:</strong> {scholarship["How to Apply"]}</p>
        <a
          href={scholarship.Link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline mt-2 block"
        >
          View Scholarship
        </a>
      </div>
    </div>
  );
};

export default SingleScholarship;
