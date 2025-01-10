import  express  from "express";
import cors from "cors";
const api = express();
import usersRoutes  from "./src/routes/users.js";
import postsRoutes  from "./src/routes/posts.js";
import likesRoutes  from "./src/routes/likes.js";
import commentsRoutes  from "./src/routes/comments.js";
import authRoutes  from "./src/routes/auth.js"; 
import cookieParser from "cookie-parser";


//middleware
api.use(express.json());
api.use(cors());
api.use(cookieParser());

api.use("/api/users",        usersRoutes)
api.use("/api/posts",        postsRoutes)
api.use("/api/likes",        likesRoutes)
api.use("/api/comments",     commentsRoutes)
api.use("/api/auth",         authRoutes)

api.listen(3000, () => {
    console.log("server is running on port 3000 ༼ つ ◕_◕ ༽つ");
});