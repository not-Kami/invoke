import { Router } from "express";
import gameController from "./game.controller.js";
import { validate, validateParams } from "../../middlewares/validate.js";
import * as gameValidation from "./game.validation.js";
import { protect } from "../../middlewares/auth.middleware.js";

const gameRouter = Router();

gameRouter.post("/", protect, validate(gameValidation.createGameSchema), gameController.createGame);
gameRouter.get("/", validate(gameValidation.getGamesSchema), gameController.getGames);
gameRouter.get("/:id", validateParams(gameValidation.getGameSchema), gameController.getGame);
gameRouter.put("/:id", protect, validateParams(gameValidation.getGameSchema), validate(gameValidation.updateGameSchema), gameController.updateGame);
gameRouter.delete("/:id", protect, validateParams(gameValidation.getGameSchema), gameController.deleteGame);

export default gameRouter;