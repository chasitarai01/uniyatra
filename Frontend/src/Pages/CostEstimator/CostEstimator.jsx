import React, { useState, useEffect } from 'react';
import { Calculator, Plane, Home, GraduationCap, FileText, HeartPulse, DollarSign, PieChart } from 'lucide-react';

export default function CostEstimator() {
  const [costs, setCosts] = useState({
    tuition: 15000,
    living: 8000,
    visa: 350,
    medical: 1200,
    flights: 1500,
    misc: 1000
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    const sum = Object.values(costs).reduce((acc, curr) => acc + (Number(curr) || 0), 0);
    setTotal(sum);
  }, [costs]);

  const handleInputChange = (field, value) => {
    setCosts(prev => ({ ...prev, [field]: value }));
  };

  const getPercentage = (value) => {
    return total === 0 ? 0 : Math.round(((Number(value) || 0) / total) * 100);
  };

  const categories = [
    { id: 'tuition', label: 'Tuition Fees', icon: <GraduationCap size={20} />, color: 'bg-indigo-500' },
    { id: 'living', label: 'Living Expenses', icon: <Home size={20} />, color: 'bg-emerald-500' },
    { id: 'flights', label: 'Travel & Flights', icon: <Plane size={20} />, color: 'bg-sky-500' },
    { id: 'medical', label: 'Health Insurance', icon: <HeartPulse size={20} />, color: 'bg-rose-500' },
    { id: 'visa', label: 'Visa & Documents', icon: <FileText size={20} />, color: 'bg-amber-500' },
    { id: 'misc', label: 'Miscellaneous', icon: <PieChart size={20} />, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 flex items-center justify-center gap-3">
            <Calculator className="text-indigo-600" size={40} />
            Study Abroad Cost Estimator
          </h1>
          <p className="text-lg text-slate-600">
            Plan your journey smartly. Calculate your total estimated expenses for studying abroad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-semibold text-slate-800 mb-6">Enter Your Estimated Costs (USD)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="relative group">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <span className={`${cat.color} text-white p-1.5 rounded-lg`}>
                      {cat.icon}
                    </span>
                    {cat.label}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="text-slate-400" size={18} />
                    </div>
                    <input
                      type="number"
                      min="0"
                      value={costs[cat.id]}
                      onChange={(e) => handleInputChange(cat.id, e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-medium text-slate-300 mb-2">Total Estimated Cost</h2>
              <div className="text-5xl font-bold tracking-tight mb-8">
                ${total.toLocaleString()}
              </div>

              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Cost Breakdown</h3>
              
              <div className="space-y-4">
                {categories.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-300 flex items-center gap-2">
                        {cat.label}
                      </span>
                      <span className="font-medium">${Number(costs[cat.id] || 0).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`h-2.5 rounded-full ${cat.color} transition-all duration-500 ease-out`} 
                        style={{ width: `${getPercentage(costs[cat.id])}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button className="mt-10 w-full py-4 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2">
              <FileText size={20} />
              Save Estimate
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
