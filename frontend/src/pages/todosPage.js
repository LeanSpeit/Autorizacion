export const todosPage = () => {
  const container = document.createElement("div");

  container.classList.add(
    "flex",
    "flex-col",
    "items-center",
    "justify-center",
    "h-screen",
    "bg-gray-200"
  );

  // Botón para volver a Home
  const btnHome = document.createElement("button");
  btnHome.classList.add(
    "bg-blue-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-blue-600",
    "mb-4"
  );
  btnHome.textContent = "Home";
  btnHome.addEventListener("click", () => {
    window.location.pathname = "/home";
  });

  // Título de la página
  const title = document.createElement("h1");
  title.classList.add("text-3xl", "font-bold", "mb-4");
  title.textContent = "List of Todos";

  // Formulario para agregar una nueva tarea
  const form = document.createElement("form");
  form.classList.add("mb-4");

  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Enter task title");
  input.classList.add("border", "p-2", "rounded", "mr-2");

  const submitBtn = document.createElement("button");
  submitBtn.textContent = "Add Task";
  submitBtn.classList.add(
    "bg-green-500",
    "text-white",
    "p-2",
    "rounded",
    "hover:bg-green-600"
  );

  form.appendChild(input);
  form.appendChild(submitBtn);

  // Manejar el envío del formulario para crear una nueva tarea
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = input.value;
    if (title) {
      fetch("http://localhost:4000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ title }),
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error al crear la tarea');
        }
        return response.json();
      })
      .then((newTodo) => {
        console.log({ newTodo });
        addTodoToTable(newTodo);
        input.value = ""; // Limpiar el input después de crear la tarea
      })
      .catch((error) => {
        alert('Error: ' + error.message);
      });
    }
  });

  // Tabla de tareas
  const table = document.createElement("table");
  table.classList.add(
    "w-1/2",
    "bg-white",
    "shadow-md",
    "h-[700px]",
    "overflow-y-scroll"
  );

  const thead = document.createElement("thead");
  const tr = document.createElement("tr");

  ["ID", "Title", "Completed", "Owner Id", "Actions"].forEach((text) => {
    const th = document.createElement("th");
    th.classList.add("border", "px-4", "py-2");
    th.textContent = text;
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  const tbody = document.createElement("tbody");
  tbody.classList.add("text-center");
  table.appendChild(thead);
  table.appendChild(tbody);

  // Obtener y mostrar las tareas existentes
  fetch("http://localhost:4000/todos", {
    credentials: "include",
  })
  .then((response) => response.json())
  .then((data) => {
    data.todos.forEach((todo) => {
      addTodoToTable(todo);
    });
  })
  .catch((error) => {
    console.error('Error al obtener las tareas:', error);
  });

  container.appendChild(btnHome);
  container.appendChild(title);
  container.appendChild(form);
  container.appendChild(table);

  return container;

  // Función para agregar tareas a la tabla
  function addTodoToTable(todo) {
    const tr = document.createElement("tr");
    tr.dataset.id = todo.id; // Establecer el atributo data-id

    const td1 = document.createElement("td");
    td1.classList.add("border", "px-4", "py-2");
    td1.textContent = todo.id;

    const td2 = document.createElement("td");
    td2.classList.add("border", "px-4", "py-2");

    const titleSpan = document.createElement("span");
    titleSpan.textContent = todo.title;

    td2.appendChild(titleSpan);

    const td3 = document.createElement("td");
    td3.classList.add("border", "px-4", "py-2");
    td3.textContent = todo.completed ? "Sí" : "No";

    const td4 = document.createElement("td");
    td4.classList.add("border", "px-4", "py-2");
    td4.textContent = todo.owner;

    // Botones de acción (Editar/Eliminar)
    const td5 = document.createElement("td");
    td5.classList.add("border", "px-4", "py-2");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("bg-yellow-500", "text-white", "p-2", "rounded", "mr-2", "hover:bg-yellow-600");
    editBtn.addEventListener("click", () => openEditModal(todo));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("bg-red-500", "text-white", "p-2", "rounded", "hover:bg-red-600");
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id, tr));

    td5.appendChild(editBtn);
    td5.appendChild(deleteBtn);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    tbody.appendChild(tr);
  }

  // Función para abrir el modal de edición
  function openEditModal(todo) {
    const modal = document.createElement("div");
    modal.classList.add(
      "fixed",
      "top-1/2",
      "left-1/2",
      "transform",
      "-translate-x-1/2",
      "-translate-y-1/2",
      "bg-white",
      "p-6",
      "shadow-lg",
      "rounded",
      "w-96"
    );

    const title = document.createElement("h2");
    title.classList.add("text-xl", "font-bold", "mb-4");
    title.textContent = "Edit Task";

    const input = document.createElement("input");
    input.setAttribute("type", "text");
    input.value = todo.title;
    input.classList.add("border", "p-2", "rounded", "mb-4", "w-full");

    const completedBtn = document.createElement("button");
    completedBtn.textContent = "Completed";
    completedBtn.classList.add("bg-blue-500", "text-white", "p-2", "rounded", "mr-2", "hover:bg-blue-600");
    completedBtn.addEventListener("click", () => updateTodoStatus(todo.id, true));

    const notCompletedBtn = document.createElement("button");
    notCompletedBtn.textContent = "Not Completed";
    notCompletedBtn.classList.add("bg-gray-500", "text-white", "p-2", "rounded", "mr-2", "hover:bg-gray-600");
    notCompletedBtn.addEventListener("click", () => updateTodoStatus(todo.id, false));

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Close";
    cancelBtn.classList.add("bg-red-500", "text-white", "p-2", "rounded", "hover:bg-red-600");
    cancelBtn.addEventListener("click", () => closeModal(modal));

    modal.appendChild(title);
    modal.appendChild(input);
    modal.appendChild(completedBtn);
    modal.appendChild(notCompletedBtn);
    modal.appendChild(cancelBtn);

    document.body.appendChild(modal);

    // Actualizar título en tiempo real
    input.addEventListener("input", () => {
      updateTodoTitle(todo.id, input.value);
    });
  }

  // Función para cerrar el modal
  function closeModal(modal) {
    document.body.removeChild(modal);
  }

  // Función para actualizar el título de una tarea
  function updateTodoTitle(id, newTitle) {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ title: newTitle }),
    })
    .then((response) => response.json())
    .then((updatedTodo) => {
      // Actualizar el título en la UI
      const row = tbody.querySelector(`tr[data-id="${id}"]`);
      if (row) {
        row.querySelector('td:nth-child(2) span').textContent = updatedTodo.title; // Actualizar título en la UI
      } else {
        console.error('Fila no encontrada en la UI para ID:', id);
      }
    })
    .catch((error) => {
      console.error('Error al actualizar la tarea:', error);
    });
  }

  // Función para actualizar el estado completado de una tarea
  function updateTodoStatus(id, completed) {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ completed }),
    })
    .then((response) => response.json())
    .then((updatedTodo) => {
      // Actualizar el estado en la UI
      const row = tbody.querySelector(`tr[data-id="${id}"]`);
      if (row) {
        row.querySelector('td:nth-child(3)').textContent = updatedTodo.completed ? "Sí" : "No"; // Actualizar estado en la UI
      } else {
        console.error('Fila no encontrada en la UI para ID:', id);
      }
    })
    .catch((error) => {
      console.error('Error al actualizar el estado de la tarea:', error);
    });
  }

  // Función para eliminar una tarea
  function deleteTodo(id, row) {
    fetch(`http://localhost:4000/todos/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
    .then((response) => response.json())
    .then(() => {
      row.remove(); // Eliminar la fila de la tabla
    })
    .catch((error) => {
      console.error('Error al eliminar la tarea:', error);
    });
  }
};
