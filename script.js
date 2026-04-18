// const user_id = localStorage.getItem("user_id");

// if (!user_id) {
//   window.location.href = "login.html";
// }
// function logout() {
//   localStorage.removeItem("user_id");
//   window.location.href = "login.html";
// }
const user_id = 1; // temporary fake user
document.addEventListener("DOMContentLoaded", () => {
  // === DOM Elements ===
const userDisplay = document.createElement("p");
userDisplay.textContent = "User ID: " + user_id;
document.querySelector("header").appendChild(userDisplay);
  // Container for budget cards
  const cardContainer = document.getElementById("card-container");

  // Budget modal elements (for adding a new budget)
  const budgetModal = document.getElementById("budget-modal");
  const addBudgetBtn = document.getElementById("add-budget-btn");
  const closeBudgetBtn = document.getElementById("close-budget");
  const submitBudgetBtn = document.getElementById("submit-budget");
  const budgetNameInput = document.getElementById("budget-name");
  const budgetLimitInput = document.getElementById("budget-limit");

  // Expense modal elements (for adding a new expense)
  const expenseModal = document.getElementById("expense-modal");
  const openExpenseBtn = document.getElementById("open-expense-modal-btn");
  const closeExpenseBtn = document.getElementById("close-expense");
  const submitExpenseBtn = document.getElementById("submit-expense");
  const expenseDescriptionInput = document.getElementById("expense-description");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseBudgetSelect = document.getElementById("expense-budget");

  // Expense details modal (for viewing expenses)
  const expenseDetailsModal = document.getElementById("expense-details-modal");
  const expenseDetailsContainer = document.getElementById("expense-details-container");
  const closeExpenseDetailsBtn = document.getElementById("close-expense-details");

  // === Data Storage ===
  const budgets = {};

  // === Utility Functions ===

  // Show a placeholder message if there are no budgets.
  function showPlaceholder() {
    if (!document.getElementById("placeholder-text")) {
      const p = document.createElement("p");
      p.id = "placeholder-text";
      p.textContent = 'No budgets yet. Click "Add Budget" to get started.';
      cardContainer.appendChild(p);
    }
  }

  // Remove the placeholder message.
  function removePlaceholder() {
    const placeholder = document.getElementById("placeholder-text");
    if (placeholder) placeholder.remove();
  }

  // Create a progress bar element for a budget card.
  function createProgressBar(limit) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("progress-bar-wrapper");

    const container = document.createElement("div");
    container.classList.add("progress-bar-container");

    const bar = document.createElement("div");
    bar.classList.add("progress-bar");
    container.appendChild(bar);

    const text = document.createElement("span");
    text.classList.add("spent-limit-text");
    text.textContent = `0 / $${limit.toFixed(2)}`;

    wrapper.appendChild(container);
    wrapper.appendChild(text);

    return { wrapper, bar, text };
  }

  // Opens the Expense Details Modal for a given budget, listing all expenses.
  function openExpenseDetails(budgetName) {
    console.log("Opening expense details for", budgetName);
    const budget = budgets[budgetName];
    if (!budget) {
      alert("Budget not found.");
      return;
    }
    // Clear any previous content.
    expenseDetailsContainer.innerHTML = "";
    
    // Build header with title and close icon.
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    
    const title = document.createElement("h3");
    title.textContent = `Expenses - ${budgetName}`;
    header.appendChild(title);
    
    const closeIcon = document.createElement("span");
    // In case the close icon isn't pre-existing in your HTML, we create and bind it here.
    closeIcon.id = "close-expense-details";
    closeIcon.classList.add("close");
    closeIcon.textContent = "×";
    closeIcon.addEventListener("click", () => {
      expenseDetailsModal.classList.add("hidden");
    });
    header.appendChild(closeIcon);
    
    expenseDetailsContainer.appendChild(header);
    
    // List each expense.
    if (budget.expenses.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No expenses recorded.";
      expenseDetailsContainer.appendChild(emptyMsg);
    } else {
      budget.expenses.forEach((expense, index) => {
        const expenseDiv = document.createElement("div");
        expenseDiv.classList.add("expense-item");
        
        const expenseText = document.createElement("span");
        expenseText.textContent = `${expense.name}: $${expense.amount.toFixed(2)}`;
        expenseDiv.appendChild(expenseText);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("btn", "outline");
        deleteBtn.addEventListener("click", () => {
          if (confirm(`Remove expense "${expense.name}" for $${expense.amount.toFixed(2)}?`)) {
            // Remove the expense from the array.
            budget.expenses.splice(index, 1);
            budget.totalSpent -= expense.amount;
            updateBudgetUI(budgetName);
            // Refresh the expense details modal content.
            openExpenseDetails(budgetName);
          }
        });
        
        expenseDiv.appendChild(deleteBtn);
        expenseDetailsContainer.appendChild(expenseDiv);
      });
    }
    // Show the modal.
    expenseDetailsModal.classList.remove("hidden");
  }

  // Updates the progress bar and text for a given budget.
  function updateBudgetUI(budgetName) {
    const budget = budgets[budgetName];
    if (!budget) return;
    
    if (budget.limit !== null) {
      const percent = (budget.totalSpent / budget.limit) * 100;
      budget.progressBar.style.width = Math.min(percent, 100) + "%";
      budget.progressBar.style.backgroundColor =
        budget.totalSpent > budget.limit ? "#e74c3c" : "#4caf50";
      budget.progressText.textContent = `${budget.totalSpent.toFixed(2)} / $${budget.limit.toFixed(2)}`;
    }
  }

  // === Budget Modal Handlers (Adding a New Budget) ===

  addBudgetBtn.addEventListener("click", () => {
    budgetModal.classList.remove("hidden");
  });

  closeBudgetBtn.addEventListener("click", () => {
    budgetModal.classList.add("hidden");
    budgetNameInput.value = "";
    budgetLimitInput.value = "";
  });

  submitBudgetBtn.addEventListener("click", () => {
    const name = budgetNameInput.value.trim();
    const limit = parseFloat(budgetLimitInput.value);
    
    if (!name || isNaN(limit) || limit <= 0 || budgets[name]) {
      alert("Please enter a unique valid name and a positive spending limit.");
      return;
    }
    removePlaceholder();
    
    // Create the budget card.
    const card = document.createElement("div");
    card.classList.add("card");
    const { wrapper: progressWrapper, bar, text } = createProgressBar(limit);
    
    // Updated innerHTML: the expense buttons are wrapped in a flex container for alignment.
    card.innerHTML = `
      <h3>${name}</h3>
      <div class="expense-buttons">
        <button class="btn add-expense-btn">Add Expense</button>
        <button class="btn view-expenses-btn">View Expenses</button>
      </div>
      <button class="btn outline remove-budget-btn">Remove</button>
    `;
    
    // Append progress bar below the buttons.
    card.appendChild(progressWrapper);
    cardContainer.appendChild(card);
    
    // Get references to the new buttons.
    const addExpenseBtn = card.querySelector(".add-expense-btn");
    const viewExpensesBtn = card.querySelector(".view-expenses-btn");
    const removeBudgetBtn = card.querySelector(".remove-budget-btn");
    
    // Bind "Add Expense" button to open the Expense Modal preselecting this budget.
    addExpenseBtn.addEventListener("click", () => {
      expenseDescriptionInput.value = "";
      expenseAmountInput.value = "";
      expenseBudgetSelect.innerHTML = "";
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      expenseBudgetSelect.appendChild(opt);
      expenseModal.classList.remove("hidden");
    });
    
    // Bind "View Expenses" button to open the Expense Details Modal.
    viewExpensesBtn.addEventListener("click", () => {
      openExpenseDetails(name);
    });
    
    // Bind "Remove" button to delete the budget.
    removeBudgetBtn.addEventListener("click", () => {
      if (confirm(`Remove the budget "${name}" and all its expenses?`)) {
        card.remove();
        delete budgets[name];
        if (Object.keys(budgets).length === 0) showPlaceholder();
      }
    });
    
    // Save the new budget data.
    budgets[name] = {
      limit: limit,
      expenses: [],
      totalSpent: 0,
      card: card,
      progressBar: bar,
      progressText: text,
    };
    
    // Reset and hide the budget modal.
    budgetNameInput.value = "";
    budgetLimitInput.value = "";
    budgetModal.classList.add("hidden");
  });

  // === Expense Modal Handlers (Adding a New Expense) ===

  closeExpenseBtn.addEventListener("click", () => {
    expenseModal.classList.add("hidden");
    expenseDescriptionInput.value = "";
    expenseAmountInput.value = "";
    expenseBudgetSelect.innerHTML = "";
  });

  submitExpenseBtn.addEventListener("click", () => {
    const desc = expenseDescriptionInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value);
    const budgetName = expenseBudgetSelect.value;
    
    if (!desc || isNaN(amount) || amount <= 0) {
      alert("Please enter valid expense details.");
      return;
    }
    if (!budgets[budgetName]) {
      alert("Selected budget does not exist.");
      return;
    }
    
    const budget = budgets[budgetName];
    budget.expenses.push({ name: desc, amount: amount });
    budget.totalSpent += amount;
    updateBudgetUI(budgetName);
    
    expenseModal.classList.add("hidden");
    expenseDescriptionInput.value = "";
    expenseAmountInput.value = "";
    expenseBudgetSelect.innerHTML = "";
  });

  // === Dedicated "Add Expense" Button Handler (Optional) ===

  openExpenseBtn.addEventListener("click", () => {
    expenseDescriptionInput.value = "";
    expenseAmountInput.value = "";
    expenseBudgetSelect.innerHTML = "";
    
    const budgetNames = Object.keys(budgets);
    if (budgetNames.length === 0) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No budgets available";
      expenseBudgetSelect.appendChild(opt);
    } else {
      budgetNames.forEach((name) => {
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        expenseBudgetSelect.appendChild(opt);
      });
    }
    expenseModal.classList.remove("hidden");
  });

  // === Expense Details Modal Handlers ===

  // Bind the close button for the Expense Details Modal.
  closeExpenseDetailsBtn.addEventListener("click", () => {
    expenseDetailsModal.classList.add("hidden");
  });

  // === Initial Setup ===

  if (Object.keys(budgets).length === 0) {
    showPlaceholder();
  }
});
