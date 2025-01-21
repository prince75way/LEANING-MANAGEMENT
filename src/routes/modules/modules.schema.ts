// module.schema.ts
import mongoose, { Schema, Document } from 'mongoose';
import { ModuleDTO } from './modules.dto'; 

const moduleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },                  
    description: { type: String, required: true },             
    contentText: { type: String, required: true },               
    videoUrl: { type: String, required: true },                  
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  },
  { timestamps: true } 
);

const Module = mongoose.model<ModuleDTO & Document>('Module', moduleSchema);
export default Module;
