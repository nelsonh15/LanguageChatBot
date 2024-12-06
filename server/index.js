import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import openAiRoutes from "./src/routes/openai.js";
import elevenlabs from "./src/routes/elevenlabs.js"
import validateFirebaseIdToken from './src/middleware/authMiddleware.js';

/* CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

/* ROUTES */
//app.use("/openai", openAiRoutes);
//app.use("/elevenlabs", elevenlabs)
//app.use('/api', validateFirebaseIdToken);
app.use('/api/openai', validateFirebaseIdToken, openAiRoutes);

/* SERVER SETUP */
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});