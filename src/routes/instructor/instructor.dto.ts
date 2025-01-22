export interface InstructorDTO {
    id: string;
    name: string;
    email: string;
    password:string;
    qualifications: string[];
    experience: string;
    accessToken: string | null;
    refreshToken: string | null;
    createdAt: string;
    updatedAt: string;
  }
  