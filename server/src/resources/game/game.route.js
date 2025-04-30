import { Router } from "express";
import gameController from "./game.controller.js";

const gameRouter = Router();

gameRouter.post("/", gameController.createGame);
gameRouter.get("/", gameController.getGames);

export default gameRouter;