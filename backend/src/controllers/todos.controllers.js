// controllers/todos.controllers.js
import { database } from "../db/database.js";

// Obtener todas las tareas del usuario autenticado
export const getAllTodosCtrl = (req, res) => {
  try {
    const todos = database.todos.filter(todo => todo.owner === req.user.id);
    res.json({ todos });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving todos' });
  }
};

// Crear una nueva tarea
export const createTodoCtrl = (req, res) => {
  const { title } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const newId = Math.max(...database.todos.map(todo => todo.id), 0) + 1;
    const newTodo = { id: newId, title, completed: false, owner: req.user.id };
    database.todos.push(newTodo);
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

// Actualizar una tarea
export const updateTodoCtrl = (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;

  try {
    const todo = database.todos.find(todo => todo.id === parseInt(id, 10));

    if (!todo) {
      return res.status(404).json({ message: 'tarea no en contrada' });
    }

    if (todo.owner !== req.user.id) {
      return res.status(403).json({ message: 'No está autorizado para editar esta tarea' });
    }

    todo.title = title !== undefined ? title : todo.title;
    todo.completed = completed !== undefined ? completed : todo.completed;
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};


// Eliminar una tarea
export const deleteTodoCtrl = (req, res) => {
  const { id } = req.params;

  try {
    const todoIndex = database.todos.findIndex(todo => todo.id === parseInt(id, 10));

    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const todo = database.todos[todoIndex];

    if (todo.owner !== req.user.id) {
      return res.status(403).json({ message: 'No está autorizado para elimninar esta tarea' });
    }

    database.todos.splice(todoIndex, 1);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};
