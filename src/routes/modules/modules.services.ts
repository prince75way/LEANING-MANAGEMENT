import Module from './modules.schema';
import { ModuleDTO } from './modules.dto';
import { addModuleToCourseService as addModuleToCourse } from '../courses/course.service';  // Import course service

/**
 * Creates a new module and saves it to the database.
 * 
 * @param {ModuleDTO} moduleData - The module data to create and save.
 * @returns {Promise<Module>} - The newly created module document.
 */
export const createModuleService = async (moduleData: ModuleDTO) => {
  const newModule = new Module(moduleData);
  await newModule.save();
  return newModule;
};



/**
 * Deletes a module by its ID.
 * 
 * @param {string} moduleId - The ID of the module to delete.
 * @returns {Promise<Module | null>} - The deleted module or null if not found.
 */
export const deleteModuleService = async (moduleId: string) => {
  const module = await Module.findByIdAndDelete(moduleId);
  if (!module) {
    throw new Error('Module not found');
  }
  return module;
};


/**
 * Edits a module's data and updates it in the database.
 * 
 * @param {string} moduleId - The ID of the module to edit.
 * @param {Partial<ModuleDTO>} updateData - The data to update the module with.
 * @returns {Promise<Module>} - The updated module document.
 */
export const editModuleService = async (moduleId: string, updateData: Partial<ModuleDTO>) => {
  const module = await Module.findById(moduleId);
  if (!module) {
    throw new Error('Module not found');
  }

  // Update module fields
  module.title = updateData.title || module.title;
  module.description = updateData.description || module.description;
  module.contentText = updateData.contentText || module.contentText;
  module.videoUrl = updateData.videoUrl || module.videoUrl;

  await module.save();
  return module;
};


/**
 * Adds a module to a course.
 * 
 * @param {string} courseId - The ID of the course to add the module to.
 * @param {string} moduleId - The ID of the module to add to the course.
 
 */


export const addModuleToCourseService = async (courseId: string, moduleId: string)=> {
  return addModuleToCourse(courseId, moduleId);  // Using the course service here
};
