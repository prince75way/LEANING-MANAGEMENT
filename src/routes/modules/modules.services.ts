// module.service.ts
import Module from './modules.schema';
import { ModuleDTO } from './modules.dto';

export const createModuleService = async (moduleData: ModuleDTO) => {
  const newModule = new Module(moduleData);
  await newModule.save();
  return newModule;
};
