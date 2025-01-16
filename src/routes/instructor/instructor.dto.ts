import { BaseSchema } from "../../common/dto/base.dto";

export interface InstructorDTO extends BaseSchema{
    name: string;
    email: string;
    password: string;
    role: 'instructor';
    qualifications: string[];
    experience: string;
    accessToken?: string | null;
    refreshToken?: string | null;
  }
  