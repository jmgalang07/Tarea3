let users = [];
let expenses = [];

// Class AddUser
class AddUser {
  constructor(name, genero, icono) {
    this.name = name;
    this.genero = genero;
    this.icono = icono;
  }
}

// Class AddExpense
class AddExpense {
  constructor(usuario, cantidad, titulo, fecha) {
    this.usuario = usuario;
    this.cantidad = cantidad;
    this.titulo = titulo;
    this.fecha = fecha;
  }
}

// Page display function
function displayPage(pageID) {
  const pages = document.querySelectorAll(".container");
  pages.forEach((page) => page.classList.remove("visible"));

  document.getElementById(pageID).classList.add("visible");

  if (pageID === "balances") {
    showBalances();
  }
}

// Add an User
function addUser() {
  const userName = document.getElementById("userName").value;
  const genre = document.querySelector('input[name="logo"]:checked')?.value;
  const icon = document.querySelector('input[name="icon"]:checked')?.value;

  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(userName)) {
    alert("Invalid name. Only letters and spaces are allowed.");
    return;
  }

  if (!genre) {
    alert("You must select a genre.");
    return;
  }

  if (!icon) {
    alert("You must select a icon.");
    return;
  }

  const newUser = new AddUser(userName, genre, icon);
  users.push(newUser);

  updateUserList();
  updateUserSelect();
  clearUserFields();
}

// Clear user fields
function clearUserFields() {
  document.getElementById("userName").value = "";
  document.querySelector('input[name="logo"]:checked').checked = false;
  document.querySelector('input[name="icon"]:checked').checked = false;
}

// Update user list
function updateUserList() {
  const userList = document.getElementById("userList");
  userList.innerHTML = "";
  users.forEach((user) => {
    const userDiv = document.createElement("div");
    userDiv.classList.add("newUser");
    userDiv.innerHTML = `
            <img class="usersImg" src="./src/img/${user.icono}.png" alt="${user.name}">
            <p>${user.name}</p>`;
    userList.appendChild(userDiv);
  });
}

function updateUserSelect() {
  const userSelect = document.getElementById("expenseUser");
  userSelect.innerHTML =
    '<option value="" disabled selected>Select a user</option>';

  if (users.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "empty";
    userSelect.appendChild(option);
  } else {
    users.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.name;
      option.textContent = user.name;
      userSelect.appendChild(option);
    });
  }
}

// Add an Expense
function addExpense() {
  const userName = document.getElementById("expenseUser").value;
  const amount = document.getElementById("amount").value;
  const title = document.getElementById("title").value;
  const currentDate = new Date().toLocaleDateString();

  const titleRegex = /^[a-zA-Z\s]+$/;
  const amountRegex = /^\d+(\.\d+)?$/;

  if (users.length === 0) {
    alert("There are no users. Add a user first.");
    return;
  }

  if (!amountRegex.test(amount)) {
    alert("Invalid amount. Only numbers allowed.");
    return;
  }

  if (!titleRegex.test(title.trim())) {
    alert("Invalid title. Only letters and spaces are allowed.");
    return;
  }

  const trimmedTitle = title.trim();

  const newExpense = new AddExpense(
    userName,
    parseFloat(amount),
    trimmedTitle,
    currentDate
  );
  expenses.push(newExpense);

  updateExpenseList();
  clearExpenseFields();
}

function clearExpenseFields() {
  document.getElementById("amount").value = "0";
  document.getElementById("title").value = "";
}

// Update Expense List
function updateExpenseList() {
  const expenseList = document.getElementById("expenseList");
  expenseList.innerHTML = "";

  expenses.forEach((expense) => {
    const expenseDiv = document.createElement("div");
    expenseDiv.classList.add("newUserHome");

    const pronoun = getPronoun(expense.usuario);

    expenseDiv.innerHTML = `
            <p>${expense.fecha}</p>
            <img src="./src/img/money.png" alt="Expense" />
            <div>
                <p>${expense.titulo}</p>
                <p>${pronoun} paid ${expense.cantidad.toFixed(2)} €</p>
            </div>
        `;
    expenseList.appendChild(expenseDiv);
  });
}

// I get the appropriate pronoun ("He" or "She") based on the user's gender.
function getPronoun(userName) {
  const user = users.find((u) => u.name === userName);
  return user && user.genero === "Male" ? "He" : "She";
}

// Resets all expense amounts to 0 and updates balances.
function settleUp() {
  expenses.forEach((expense) => {
    expense.cantidad = 0;
  });
  showBalances();
}

// Balances
function showBalances() {
  const balanceList = document.querySelector(".formularioBalances");
  balanceList.innerHTML = "";

  const balanceMap = {};

  expenses.forEach((expense) => {
    if (!balanceMap[expense.usuario]) {
      balanceMap[expense.usuario] = {
        totalPaid: 0,
        totalOwed: 0,
        icono: users.find((user) => user.name === expense.usuario).icono, // Cambiado a "icono"
      };
    }
    balanceMap[expense.usuario].totalPaid += parseFloat(expense.cantidad);
    balanceMap[expense.usuario].totalOwed += parseFloat(expense.cantidad);
  });

  for (const user in balanceMap) {
    const balanceItem = document.createElement("div");
    balanceItem.classList.add("informacionBalances");

    const pronoun = getPronoun(user);

    balanceItem.innerHTML = `
        <img src="./src/img/${
          balanceMap[user].icono
        }.png" alt="Icono de ${user}" />
        <label class="title">${user} <br />
          <p>${pronoun} has paid ${balanceMap[user].totalPaid.toFixed(2)} €</p>
          <p>${pronoun} is owed ${balanceMap[user].totalOwed.toFixed(2)} €</p>
        </label><br />
    `;

    balanceList.appendChild(balanceItem);
  }
}
