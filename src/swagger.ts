import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import courseswagger from './routes/course/course.swagger.json';
import userswagger from './routes/user/user.swagger.json';
import instructorswagger from './routes/instructor/instructor.swagger.json';
import modulesswagger from './routes/module/module.swagger.json'; 
export const setupSwagger = (app: Express): void => {
  // Manually add tags to each operation
  const addTags = (swaggerFile: any, tag: string) => {
    Object.keys(swaggerFile.paths).forEach((path) => {
      Object.keys(swaggerFile.paths[path]).forEach((method) => {
        const operation = swaggerFile.paths[path][method];
        operation.tags = operation.tags || []; // Ensure tags exist
        operation.tags.push(tag); // Add the tag for each route
      });
    });
  };

  // Apply tags to each swagger file
  addTags(courseswagger, "Courses");
  addTags(userswagger, "Users");
  addTags(instructorswagger, "Instructors");
  addTags(modulesswagger, "Modules");

  // Clean the definitions to ensure no unwanted models appear
  const removeUnwantedModels = (swaggerFile: any) => {
    delete swaggerFile.definitions.Enrollment;  // Remove the Enrollment definition if it exists
  };

  removeUnwantedModels(courseswagger);
  removeUnwantedModels(userswagger);
  removeUnwantedModels(instructorswagger);
  removeUnwantedModels(modulesswagger);

  // Merge all Swagger files into a single Swagger document
  const swaggerDocument = {
    swagger: "2.0",
    info: {
      version: "1.0.0",
      title: " Learning Management System (Prince)",
      description: "Combined API Documentation for Courses, Users, Instructors, and Modules"
    },
    host: "localhost:8000",
    basePath: "/api",
    schemes: ["http"],
    paths: {
      ...courseswagger.paths,
      ...userswagger.paths,
      ...instructorswagger.paths,
      ...modulesswagger.paths,
    },
    definitions: {
      ...courseswagger.definitions,
      ...userswagger.definitions,
      ...instructorswagger.definitions,
      ...modulesswagger.definitions,
    },
  };

  // Serve the combined Swagger documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
