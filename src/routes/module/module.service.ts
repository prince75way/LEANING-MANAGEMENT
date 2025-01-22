import { Module } from './module.entity';
import { ModuleDTO } from './module.dto';
import { addModuleToCourseService as addModuleToCourse } from '../course/course.service'; // Import course service
import { AppDataSource } from '../../services/databasetypeorm'; // Import AppDataSource for TypeORM

/**
 * Creates a new module and saves it to the database.
 * 
 * @param {ModuleDTO} moduleData - The module data to create and save.
 * @returns {Promise<Module>} - The newly created module document.
 */
export const createModuleService = async (moduleData: ModuleDTO) => {
  const moduleRepository = AppDataSource.getRepository(Module);
  
  const newModule = moduleRepository.create(moduleData); // Using TypeORM's create method to instantiate a new entity
  await moduleRepository.save(newModule); // Save the new module to the database
  
  return newModule;
};

/**
 * Deletes a module by its ID.
 * 
 * @param {string} moduleId - The ID of the module to delete.
 * @returns {Promise<Module | null>} - The deleted module or null if not found.
 */
export const deleteModuleService = async (moduleId: string) => {
  const moduleRepository = AppDataSource.getRepository(Module);
  
  const module = await moduleRepository.findOne({ where: { id: moduleId } });
  
  if (!module) {
    throw new Error('Module not found');
  }
  
  await moduleRepository.remove(module); // TypeORM method to delete the module
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
  const moduleRepository = AppDataSource.getRepository(Module);
  
  const module = await moduleRepository.findOne({ where: { id: moduleId } });
  if (!module) {
    throw new Error('Module not found');
  }

  // Update module fields
  module.title = updateData.title || module.title;
  module.description = updateData.description || module.description;
  module.contentText = updateData.contentText || module.contentText;
  module.videoUrl = updateData.videoUrl || module.videoUrl;

  await moduleRepository.save(module); // Save the updated module
  
  return module;
};

/**
 * Adds a module to a course.
 * 
 * @param {string} courseId - The ID of the course to add the module to.
 * @param {string} moduleId - The ID of the module to add to the course.
 */
export const addModuleToCourseService = async (courseId: string, moduleId: string) => {
  return addModuleToCourse(courseId, moduleId); // Using the course service here
};
