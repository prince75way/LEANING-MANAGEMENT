// module.dto.ts
export interface ModuleDTO {
  title: string;
  description: string;
  contentText: string; 
  videoUrl: string;        
  courseId: string;       
  createdAt?: Date;     
  updatedAt?: Date;        
}
