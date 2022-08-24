// array yang akan menampung beberapa object yang berisi data todo user
const todos = [];
// untuk menfenisikan Custom Event yang dignakan sebagai patokan pada perubahan data variabel todos
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addTodo();
  });
});

function addTodo() {
  // untuk mengambil value yang diinput oleh user yang tersimpan pada sebuah variabel
  const textTodo = document.getElementById("title").value;
  const timestamp = document.getElementById("date").value;

  const generatedID = generatedId();
  const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
  // object baru tersimpan pada array todos menggunakan metode push
  todos.push(todoObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// berfungsi menghasilkan identitas unik pada setiap item todo
// memanfaatkan +new Data() untuk mendapatkan timestamp pada js
function generatedId() {
  return +new Date();
}

// berfungsi untuk membuat object baru dari data yang disediakan dari inputan
function generateTodoObject(id, task, timestamp, isCompleted) {
  return {
    id,
    // nama todo
    task,
    // waktu
    timestamp,
    // penanda apakah todo selesai/belum
    isCompleted,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  // console.log(todos);

  const uncompletedTODOList = document.getElementById("todos");
  uncompletedTODOList.innerHTML = " ";

  const completedTODOList = document.getElementById("completed-todos");
  completedTODOList.innerHTML = " ";

  for (const todoItem of todos) {
    const todoElement = makeTodo(todoItem);

    if (!todoItem.isCompleted) {
      uncompletedTODOList.append(todoElement);
    } else {
      completedTODOList.append(todoElement);
    }
  }
});

function makeTodo(todoObject) {
  // membuat object DOM eleme html
  const textTitle = document.createElement("h2");
  textTitle.innerText = todoObject.task;

  const textTimestamp = document.createElement("p");
  textTimestamp.innerText = todoObject.timestamp;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(textTitle, textTimestamp);

  const container = document.createElement("div");
  container.classList.add("item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", "todo-${todoObject.id}");

  if (todoObject.isCompleted) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(todoObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(todoObject.id);
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addTaskToCompleted(todoObject.id);
    });
    container.append(checkButton);
  }
  return container;
}

function addTaskToCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoTarget == null) return;

  todoTarget.isCompleted = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId) {
  for (const todoItem of todos) {
    if (todoItem.id === todoId) {
      return todoItem;
    }
  }
  return null;
}

function removeTaskFromCompleted(todoId) {
  const todoTarget = findTodoIndex(todoId);

  if (todoTarget === -1) return;

  todos.splice(todoTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function undoTaskFromCompleted(todoId) {
  const todoTarget = findTodo(todoId);

  if (todoId == null) return;
  // state isCompleted diubah menjadi nilai false
  // agar todo task yang sebelumnya completed dapat pindah menjadi incompleted
  todoTarget.isCompleted = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
  for (const index in todos) {
    if (todos[index].id === todoId) {
      return index;
    }
  }
  return -1;
}
