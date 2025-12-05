import type { ModuleResponse } from "../types/module";

const ModuleInfo = ({ module }: { module: ModuleResponse }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
      <p>{module.description}</p>
    </div>
  );
};

export default ModuleInfo;
