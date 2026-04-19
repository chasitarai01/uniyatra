import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChecklistPage = () => {
  const [checklists, setChecklists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChecklists = async () => {
    const token = localStorage.getItem("token"); // ✅ correct key
    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(
        '/api/checklist/create',
        {},
        { headers: { Authorization: `Bearer ${token}` } } // ✅ correct format
      );

      console.log("Checklists loaded:", response.data.checklists);
      setChecklists(response.data.checklists);
    } catch (err) {
      console.error("Error creating checklists:", err);
      setError(err.response?.data?.message || "Failed to create checklists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, []);

  const handleToggleItem = async (checklistId, itemIndex) => {
    const token = localStorage.getItem("token"); // ✅ correct key
    if (!token) {
      setError("You are not logged in. Please login first.");
      return;
    }

    try {
      console.log(`Toggling item ${itemIndex} in checklist ${checklistId}`);

      // Optimistic update
      const updatedChecklists = checklists.map(checklist => {
        if (checklist._id === checklistId) {
          const updatedChecklist = JSON.parse(JSON.stringify(checklist));
          updatedChecklist.items[itemIndex].completed = !updatedChecklist.items[itemIndex].completed;
          const completedItems = updatedChecklist.items.filter(item => item.completed).length;
          updatedChecklist.completionPercent = Math.round((completedItems / updatedChecklist.items.length) * 100);
          return updatedChecklist;
        }
        return checklist;
      });

      setChecklists(updatedChecklists);

      const response = await axios.patch(
        `/api/checklist/${checklistId}/toggle`,
        { itemIndex },
        { headers: { Authorization: `Bearer ${token}` } } // ✅ correct format
      );

      console.log("Server response:", response.data);

      setChecklists(prev =>
        prev.map(checklist =>
          checklist._id === checklistId ? response.data : checklist
        )
      );

      if (response.data.completionPercent === 100) {
        console.log(`Checklist ${checklistId} is now 100% complete!`);

        await axios.patch(
          `/api/checklist/${checklistId}/complete`,
          {},
          { headers: { Authorization: `Bearer ${token}` } } // ✅ correct format
        );
        console.log(`Checklist ${checklistId} marked as complete in DB`);
      }

    } catch (err) {
      console.error("Error toggling item:", err);
      if (err.response) {
        console.error("Error details:", err.response.data);
        console.error("Status code:", err.response.status);
      }
      setError(err.response?.data?.message || "Failed to toggle item");
      fetchChecklists();
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-center text-blue-600 text-lg">Loading checklists...</div>
    </div>
  );

  if (error) return (
    <div className="text-center mt-10">
      <p className="text-red-600 font-semibold">{error}</p>
      <button
        onClick={fetchChecklists}
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">My Document Checklist</h1>
      {checklists.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {checklists.map((checklist) => (
            <div
              key={checklist._id}
              className={`bg-white p-4 rounded-2xl shadow-md border ${
                checklist.completionPercent === 100 ? 'border-green-500 border-2' : ''
              }`}
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-700">
                {checklist.category}
                {checklist.completionPercent === 100 && (
                  <span className="ml-2 text-green-500">✓</span>
                )}
              </h2>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-4 overflow-hidden">
                <div
                  className={`h-4 text-xs text-white flex items-center justify-center transition-all duration-500 ${
                    checklist.completionPercent === 100 ? 'bg-green-600' : 'bg-green-500'
                  }`}
                  style={{ width: `${checklist.completionPercent}%` }}
                >
                  {checklist.completionPercent}%
                </div>
              </div>

              <ul className="space-y-2">
                {checklist.items.map((item, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={item.completed || false}
                      onChange={() => handleToggleItem(checklist._id, index)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <label className={`text-gray-700 transition-colors duration-300 ${
                      item.completed ? 'line-through text-gray-400' : ''
                    }`}>
                      {item.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No checklists available</p>
      )}
    </div>
  );
};

export default ChecklistPage;