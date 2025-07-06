import { Router } from "express";
import gameController from "./game.controller.js";
import validate from "../../middlewares/validate.js";
import * as gameValidation from "./game.validation.js";

const gameRouter = Router();

gameRouter.post("/", validate(gameValidation.createGameSchema), gameController.createGame);
gameRouter.get("/", validate(gameValidation.getGamesSchema), gameController.getGames);
gameRouter.get("/:id", validate(gameValidation.getGameSchema), gameController.getGame);
gameRouter.put("/:id", validate(gameValidation.updateGameSchema), gameController.updateGame);
gameRouter.delete("/:id", validate(gameValidation.deleteGameSchema), gameController.deleteGame);

export default gameRouter;