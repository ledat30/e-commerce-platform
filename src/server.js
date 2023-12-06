import express from "express";
import initApiRouter from "./routes/api";
require("dotenv").config();
import bodyParser from "body-parser";
import connectDB from "./config/connectDB";
import configCors from "./config/cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT || 8080;

//config cors
configCors(app);

//config body-parser
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//db
connectDB();

//config cookie-parser
app.use(cookieParser());

//init web router
initApiRouter(app);

app.listen(PORT, () => {
  console.log(`>>>Jwt backend is running at http://localhost:${PORT}`);
});
