import { Router } from "express";
import auth from "../middlewares/auth";

import { registerUser, loginUser } from "./users";
import { getMarvelCharacters } from "./marvel";

const router = Router();

router.post("/users/login", loginUser);
router.post("/users/register", registerUser);
router.get("/marvel/characters", auth, getMarvelCharacters);

export default router;
