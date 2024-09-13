import { database } from "../db/database.js";

export const getAllTodosCtrl = (req, res) => {
  console.log(req.user.id);
  const todos = database.todos.filter((todo) => todo.owner === req.user.id);

  res.json({ todos });
};
