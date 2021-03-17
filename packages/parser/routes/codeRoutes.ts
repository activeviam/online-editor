import express from "express";
import * as codeController from "../controllers/codeController";

const router = express.Router();

router.post("/get-code-ast", codeController.generateAST)

export default router;
