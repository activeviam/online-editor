import express from "express";
const router = express.Router();

router.post("/", (req, res) => {
  console.log(req.body.grammar);
  res.send("OK");
});

export default router;
