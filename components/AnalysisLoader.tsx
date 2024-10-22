import React, { useState, useEffect } from 'react';

const phrases = [
  "Bon appétit!",
  "Analyzing your delicious meal...",
  "Counting calories, not judgments!",
  "Decoding your dish...",
  "Preparing your personalized nutrition insights...",
  "Savoring the details of your meal...",
];

const AnalysisLoader: React.FC = () => {
  const [currentPhrase, setCurrentPhrase] = useState(phrases[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhrase(phrases[Math.floor(Math.random() * phrases.length)]);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-xl font-semibold text-gray-800">{currentPhrase}</p>
      </div>
    </div>
  );
};

export default AnalysisLoader;
