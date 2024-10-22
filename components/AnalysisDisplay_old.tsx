'use client'

import React, { useEffect } from 'react';

interface CalorieEstimation {
  item: string;
  calories: string;
}

interface Modifications {
  snackType: string;
  add: string;
  remove: string;
}

interface AnalysisProps {
  analysis:{
    calorie_estimation: CalorieEstimation[];
    total_calories: number;
    suggested_meal: string;
    modifications: {
      lunch: Modifications;
      dinner: Modifications;
    };
    tags: Record<string, string>;
    potential_allergies: string[];
  }
}

const AnalysisDisplay: React.FC<AnalysisProps> = ( {analysis} ) => {

  useEffect(()=> {
      console.log("AnalysisDisplay", analysis)
  }, [analysis])
  return (
    <div className="analysis-display max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
     
      
      <div className="grid gap-6">
        <section className="card">
          <h3 className="card-title">Calorie Breakdown</h3>
          <ul className="list-disc pl-5">
            {analysis?.calorie_estimation.map((item, index) => (
              <li key={index}>{item.item}: <span className="font-semibold">{item.calories} calories</span></li>
            ))}
          </ul>
          <p className="mt-2"><strong>Total Calories:</strong> <span className="text-lg font-bold">{analysis?.total_calories}</span></p>
        </section>

        <section className="card">
          <h3 className="card-title">Meal Suggestion</h3>
          <p>{analysis?.suggested_meal}</p>
        </section>

        <section className="card">
          <h3 className="card-title">Recommended Modifications</h3>
          {analysis && Object.entries(analysis?.modifications).map(([mealType, modification]) => (
            <div key={mealType} className="mb-4">
              <h4 className="font-semibold capitalize">{modification.snackType}:</h4>
              <p className="text-green-600">✅ Add: {modification.add}</p>
              <p className="text-red-600">❌ Remove: {modification.remove}</p>
            </div>
          ))}
        </section>

        <section className="card">
          <h3 className="card-title">Food Tags</h3>
          <div className="flex flex-wrap gap-2">
            {analysis && Object.entries(analysis?.tags).map(([item, tag]) => (
              <span key={item} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </section>

        <section className="card">
          <h3 className="card-title">Potential Allergies</h3>
          <ul className="list-disc pl-5">
            {analysis?.potential_allergies.map((allergy, index) => (
              <li key={index} className="text-yellow-600">{allergy}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
