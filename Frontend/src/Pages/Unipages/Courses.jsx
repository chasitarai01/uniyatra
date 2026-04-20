import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../api/axios.js";
import { FaBook, FaGraduationCap, FaClock, FaDollarSign } from "react-icons/fa";

export const Courses = () => {
  const { id } = useParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [university, setUniversity] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Fetch university details
        const uniResponse = await axios.get(`/api/universities/${id}`);
        const uniData = uniResponse.data.data;
        setUniversity(uniData);

        // Fetch courses for this university using the new API endpoint
        if (uniData && uniData.UniversityCode) {
          const coursesResponse = await axios.get(`/api/courses/university/${uniData.UniversityCode}`);
          setCourses(coursesResponse.data.data || []);
        } else {
          setCourses([]);
        }
      } catch (err) {
        console.error("Error fetching university data:", err);
        setError("Failed to fetch university information");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
          Courses at {university?.University || 'University'}
        </h1>
        <p className="text-gray-600">
          Explore the academic programs and courses offered by this institution
        </p>
      </div>

      {courses.length > 0 ? (
        <div className="grid gap-6">
          {courses.map((course, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.CourseName || 'Course Name'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {course.Overview || 'Course description not available'}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    {course.Duration && (
                      <div className="flex items-center">
                        <FaClock className="mr-2 text-indigo-600" />
                        Duration: {course.Duration}
                      </div>
                    )}
                    {(course.TuitionFee || course.TotalFee) && (
                      <div className="flex items-center">
                        <FaDollarSign className="mr-2 text-green-600" />
                        Fee: {course.TuitionFee || course.TotalFee}
                      </div>
                    )}
                    {course.Level && (
                      <div className="flex items-center">
                        <FaGraduationCap className="mr-2 text-blue-600" />
                        Level: {course.Level}
                      </div>
                    )}
                  </div>
                </div>

                <div className="ml-4 p-3 bg-indigo-100 rounded-full">
                  <FaBook className="text-indigo-600 text-2xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Courses Available</h3>
          <p className="text-gray-500">
            Courses information for this university is not currently available.
          </p>
        </div>
      )}
    </div>
  );
};