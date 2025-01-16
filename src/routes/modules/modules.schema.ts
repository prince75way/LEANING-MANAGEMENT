// module.schema.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ModuleDTO } from './modules.dto'; // Import DTO to maintain consistency

const moduleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },                     // Module title
    description: { type: String, required: true },               // Module description
    contentText: { type: String, required: true },               // Text content of the module
    videoUrl: { type: String, required: true },                  // URL for the uploaded video
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // Reference to the Course model
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const Module = mongoose.model<ModuleDTO & Document>('Module', moduleSchema);
export default Module;
