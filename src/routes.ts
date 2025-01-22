import express from "express";
import instructorRoutes from './routes/instructor/instructor.routes'
import userRoutes from './routes/user/user.routes'
import courseRoutes from './routes/course/course.routes'

const router = express.Router();

router.use("/user", userRoutes);
router.use("/instructor", instructorRoutes);
router.use("/course", courseRoutes);
// router.use('/module', moduleRoutes);
export default router;