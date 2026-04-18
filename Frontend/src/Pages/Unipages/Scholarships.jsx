import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaMoneyBillWave, FaTrophy, FaCalendarAlt, FaUserGraduate } from "react-icons/fa";

export const Scholarships = () => {
  const { id } = useParams();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    const fetchScholarships = async () => {
      try {
        // Fetch university details
        const uniResponse = await axios.get(`http://localhost:5001/api/universities/${id}`);
        setUniversity(uniResponse.data.data);

        // Fetch scholarships for this university using the new API endpoint
        const scholarshipsResponse = await axios.get(`http://localhost:5001/api/scholarships/university/${id}`);
        setScholarships(scholarshipsResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching university data:", err);
        setError("Failed to fetch university information");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-6 text-lg font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Scholarships at {university?.University || 'University'}
        </h1>
        <p className="text-gray-600">
          Explore scholarship opportunities available at this institution
        </p>
      </div>

      {scholarships.length > 0 ? (
        <div className="grid gap-6">
          {scholarships.map((scholarship, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {scholarship.name || scholarship.scholarshipName || 'Scholarship Name'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {scholarship.description || 'Scholarship description not available'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {scholarship.amount && (
                      <div className="flex items-center">
                        <FaMoneyBillWave className="mr-2 text-green-600" />
                        Amount: {scholarship.amount}
                      </div>
                    )}
                    {scholarship.deadline && (
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-blue-600" />
                        Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                      </div>
                    )}
                    {scholarship.eligibility && (
                      <div className="flex items-center">
                        <FaUserGraduate className="mr-2 text-purple-600" />
                        Eligibility: {scholarship.eligibility}
                      </div>
                    )}
                    {scholarship.type && (
                      <div className="flex items-center">
                        <FaTrophy className="mr-2 text-yellow-600" />
                        Type: {scholarship.type}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="ml-4 p-3 bg-green-100 rounded-full">
                  <FaMoneyBillWave className="text-green-600 text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FaMoneyBillWave className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Scholarships Available</h3>
          <p className="text-gray-500">
            Scholarship information for this university is not currently available.
          </p>
        </div>
      )}
    </div>
  );
};