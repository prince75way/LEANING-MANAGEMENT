// module.dto.ts
export interface ModuleDTO {
    id:string;
    title: string;
    description: string;
    contentText: string; 
    videoUrl: string;        
    courseId: string;       
    createdAt?: Date;     
    updatedAt?: Date;        
  }