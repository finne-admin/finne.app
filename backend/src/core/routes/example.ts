import { Router } from "express";
const router = Router();

router.get("/hello", (_, res) => res.json({ message: "Hello from core route!" }));

export default router;
