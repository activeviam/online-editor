import express from "express";
import * as grammarController from "../controllers/grammarController";

const router = express.Router();

router.post("/compile-from-file", grammarController.compileGrammarFile);

export default router;
