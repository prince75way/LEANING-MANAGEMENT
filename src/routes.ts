import express from "express";
import userRoutes from './routes/user/user.routes'
import instructorRoutes from './routes/instructor/instructor.routes'
import courseRoutes from './routes/courses/course.route'
import moduleRoutes from './routes/modules/modules.routes'

// routes
const router = express.Router();

router.use("/user", userRoutes);
router.use("/instructor", instructorRoutes);
router.use("/course", courseRoutes);
router.use('/module', moduleRoutes);
export default router;