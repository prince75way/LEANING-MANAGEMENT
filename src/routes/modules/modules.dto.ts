// module.dto.ts
export interface ModuleDTO {
  title: string;           // Title of the module
  description: string;     // Description of the module
  contentText: string;     // Text content of the module
  videoUrl: string;        // URL of the video uploaded to Cloudinary
  courseId: string;        // ID of the course this module belongs to
  createdAt?: Date;        // Creation date of the module
  updatedAt?: Date;        // Last updated date of the module
}
