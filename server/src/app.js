import app from "./config/app.config.js";
import env from "./config/dotenv.config.js";
import helmet from "helmet";
import loggerMiddleware from "./middlewares/logger.middleware.js";



app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});

app.use(helmet);
app.use(loggerMiddleware);

