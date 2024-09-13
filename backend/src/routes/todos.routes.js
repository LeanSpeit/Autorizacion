import { Router } from "express";
import { getAllTodosCtrl } from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";


const todosRouter = Router();

todosRouter.get("/", validarJwt, getAllTodosCtrl);

export { todosRouter };
