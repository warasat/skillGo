import type { ModuleResponse } from "../types/module";

interface ModuleInfoProps {
  module: ModuleResponse;
  onAttemptQuiz?: (module: ModuleResponse) => void;
}

const ModuleInfo = ({ module }: ModuleInfoProps) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">
        {module.title}
      </h2>
      <p className="text-gray-600 mb-4">{module.description}</p>
    </div>
  );
};

export default ModuleInfo;
