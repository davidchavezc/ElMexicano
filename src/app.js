import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import {port} from './config.js';
import router from "./routes/users.routes.js";
import routerUsuarios from "./routes/users.routes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();


app.use(express.static(__dirname + "/public"));
app.use(routerUsuarios);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});