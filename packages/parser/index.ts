import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import grammarRouter from "./routes/grammar";

// Constants

const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares

app.use(
  cors({
    credentials: true,
  }),
);

app.use(bodyParser.json());

// Routes
app.use("/grammar", grammarRouter);
// Start server

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
