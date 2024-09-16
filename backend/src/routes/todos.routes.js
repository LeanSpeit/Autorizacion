import { Router } from "express";
import { getAllTodosCtrl, createTodoCtrl, updateTodoCtrl, deleteTodoCtrl } from "../controllers/todos.controllers.js";
import validarJwt from "../middlewares/validar-jwt.js";


const todosRouter = Router();

// Obtener todas las tareas del usuario autenticado
todosRouter.get("/", validarJwt, getAllTodosCtrl);

// Crear una nueva tarea
todosRouter.post("/", validarJwt, createTodoCtrl);

// Actualizar una tarea
todosRouter.put("/:id", validarJwt, updateTodoCtrl);

// Eliminar una tarea
todosRouter.delete("/:id", validarJwt, deleteTodoCtrl);


export { todosRouter };
