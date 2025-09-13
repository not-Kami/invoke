import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware.js";
import { restrictTo } from "../../middlewares/restrictTo.middleware.js";
import * as searchController from "./search.controller.js";

const searchRouter = Router();

// Toutes les routes de recherche nécessitent une authentification et des droits admin
searchRouter.use(protect);
searchRouter.use(restrictTo('admin'));

// Recherche globale
searchRouter.get("/", searchController.globalSearch);

// Suggestions de recherche
searchRouter.get("/suggestions", searchController.searchSuggestions);

export default searchRouter;
