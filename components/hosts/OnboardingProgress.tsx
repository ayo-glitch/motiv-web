'use client';

import { CheckCircle, Circle } from 'lucide-react';

interface OnboardingStep {
  id: string;
  title: string;
  completed: boolean;
}

interface OnboardingProgressProps {
  steps: OnboardingStep[];
}

export function OnboardingProgress({ steps }: OnboardingProgressProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const totalSteps = steps.length;
  const progressPercentage = (completedSteps / totalSteps) * 100;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Setup Progress</h3>
        <span className="text-sm text-gray-600">
          {completedSteps} of {totalSteps} completed
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-[#D72638] h-2 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            {step.completed ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <span className={`text-sm ${step.completed ? 'text-green-600 line-through' : 'text-gray-700'}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      {completedSteps === totalSteps && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800 font-medium">
            🎉 Great! Your profile is complete. You're ready to start creating events!
          </p>
        </div>
      )}
    </div>
  );
}