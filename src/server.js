import express from "express";
import initApiRouter from "./routes/api";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8080;

//init web router
initApiRouter(app);

app.listen(PORT, () => {
  console.log(`>>>Jwt backend is running at http://localhost:${PORT}`);
});
