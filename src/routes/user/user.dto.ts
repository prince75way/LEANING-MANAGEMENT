
import { CourseProgress } from './courseprogressentity';



export interface UserDTO {

  id: string;

  name: string;

  email: string;

  role: string;

  password: string;

  accessToken: string | null;

  refreshToken: string | null;

  courseProgress: CourseProgress[];

  createdAt: string;

  updatedAt: string;

}
