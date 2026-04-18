import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ScholarshipsByUniversity = () => {
  const { id } = useParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/scholarships/university/${id}`);
        const data = Array.isArray(res.data.scholarships)
          ? res.data.scholarships
          : [res.data.scholarships];
        setScholarships(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchScholarships();
  }, [id]);

  if (loading) return <p>Loading scholarships...</p>;
  if (!scholarships.length) return <p>No scholarships found for this university.</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Scholarships for University {id}</h1>
      <div className="grid gap-4">
        {scholarships.map(s => (
          <div key={s._id} className="border p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{s.scholarshipName}</h2>
            <p>{s.scholarshipValue}</p>
            <a href={s.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipsByUniversity;
