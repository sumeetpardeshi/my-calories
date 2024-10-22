import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CalorieEstimation {
  item: string;
  calories: string;
}

interface Modifications {
  snackType?: string;
  add?: string;
  remove?: string;
}

interface AnalysisProps {
  analysis: {
    calorie_estimation?: CalorieEstimation[];
    total_calories?: number;
    suggested_meal?: string;
    modifications?: {
      lunch?: Modifications;
      dinner?: Modifications;
    };
    tags?: Record<string, string>;
    potential_allergies?: string[];
  };
}

const AnalysisDisplay: React.FC<AnalysisProps> = ({ analysis }) => {
  if (!analysis || Object.keys(analysis).length === 0) {
    return <p>No analysis data available.</p>;
  }

  return (
    <div className="space-y-4">
      {analysis.calorie_estimation && analysis.calorie_estimation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Calorie Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {analysis.calorie_estimation.map((item, index) => (
                <li key={index}>{item.item}: {item.calories} calories</li>
              ))}
            </ul>
            {analysis.total_calories && (
              <p className="font-bold mt-2">Total Calories: {analysis.total_calories}</p>
            )}
          </CardContent>
        </Card>
      )}

      {analysis.suggested_meal && (
        <Card>
          <CardHeader>
            <CardTitle>Suggested Meal</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{analysis.suggested_meal}</p>
          </CardContent>
        </Card>
      )}

      {analysis.modifications && (
        <Card>
          <CardHeader>
            <CardTitle>Modifications</CardTitle>
          </CardHeader>
          <CardContent>
            {analysis.modifications.lunch && (
              <>
                <h4 className="font-semibold">Lunch:</h4>
                <p>Snack Type: {analysis.modifications.lunch.snackType || 'N/A'}</p>
                <p>Add: {analysis.modifications.lunch.add || 'N/A'}</p>
                <p>Remove: {analysis.modifications.lunch.remove || 'N/A'}</p>
              </>
            )}
            {analysis.modifications.dinner && (
              <>
                <h4 className="font-semibold mt-2">Dinner:</h4>
                <p>Snack Type: {analysis.modifications.dinner.snackType || 'N/A'}</p>
                <p>Add: {analysis.modifications.dinner.add || 'N/A'}</p>
                <p>Remove: {analysis.modifications.dinner.remove || 'N/A'}</p>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {analysis.tags && Object.keys(analysis.tags).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {Object.entries(analysis.tags).map(([key, value]) => (
                <li key={key}>{key}: {value}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {analysis.potential_allergies && analysis.potential_allergies.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Potential Allergies</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {analysis.potential_allergies.map((allergy, index) => (
                <li key={index}>{allergy}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AnalysisDisplay;
