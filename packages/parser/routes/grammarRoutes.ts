import express from "express";
import * as grammarController from "../controllers/grammarController";

const router = express.Router();

router.post("/compile-from-file", grammarController.compileGrammarFile);
router.post("/compile-from-string", grammarController.compileGrammarString);

export default router;
