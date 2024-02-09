import 'dotenv/config'
import express from "express";
import router from "./routes";
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT;
import dotenv from "dotenv";
dotenv.config();

app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1", router);

app.listen(port, () => {
  return console.log(`Express server is listening at ${port} 🚀`);
});
