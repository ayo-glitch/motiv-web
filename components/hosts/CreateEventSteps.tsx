"use client";

interface Step {
  number: number;
  title: string;
  active: boolean;
}

interface CreateEventStepsProps {
  steps: Step[];
}

export function CreateEventSteps({ steps }: CreateEventStepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            {/* Step Circle */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.active
                  ? "bg-[#D72638] text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.number}
            </div>
            
            {/* Step Title */}
            <span
              className={`ml-2 text-sm font-medium ${
                step.active ? "text-[#D72638]" : "text-gray-600"
              }`}
            >
              {step.title}
            </span>
            
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-300 mx-4 min-w-[50px]" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}