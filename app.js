// ===============================
// STICHO PESA
// Expense Tracker
// ===============================


// ===============================
// DATA
// ===============================

let startingMoney =
    Number(localStorage.getItem("stichoStartingMoney")) || 0;

let expenses =
    JSON.parse(localStorage.getItem("stichoExpenses")) || [];


// ===============================
// GET ELEMENTS
// ===============================

const moneyLeftElement =
    document.getElementById("moneyLeft");

const todaySpentElement =
    document.getElementById("todaySpent");

const monthSpentElement =
    document.getElementById("monthSpent");

const addExpenseBtn =
    document.getElementById("addExpenseBtn");

const closeModal =
    document.getElementById("closeModal");

const expenseModal =
    document.getElementById("expenseModal");

const amountInput =
    document.getElementById("amount");

const categoryInput =
    document.getElementById("category");
const customCategoryInput =
    document.getElementById("customCategory");

const noteInput =
    document.getElementById("note");

const saveExpenseBtn =
    document.getElementById("saveExpense");

const expenseList =
    document.getElementById("expenseList");

const setMoneyBtn =
    document.getElementById("setMoneyBtn");

const moneyModal =
    document.getElementById("moneyModal");

const closeMoneyModal =
    document.getElementById("closeMoneyModal");

const startingMoneyInput =
    document.getElementById("startingMoney");

const saveMoneyBtn =
    document.getElementById("saveMoney");
const homeScreen = document.getElementById("homeScreen");
const historyScreen = document.getElementById("historyScreen");
const insightsScreen = document.getElementById("insightsScreen");

const insightsNav = document.getElementById("insightsNav");

const insightsTotal = document.getElementById("insightsTotal");
const insightsCount = document.getElementById("insightsCount");

const categoryList = document.getElementById("categoryList");

const homeNav = document.getElementById("homeNav");
const historyNav = document.getElementById("historyNav");


// ===============================
// OPEN EXPENSE MODAL
// ===============================

addExpenseBtn.addEventListener("click", function () {

    expenseModal.style.display = "flex";

    amountInput.focus();

});


// ===============================
// CLOSE EXPENSE MODAL
// ===============================

closeModal.addEventListener("click", function () {

    expenseModal.style.display = "none";

});


// ===============================
// OPEN MONEY MODAL
// ===============================

setMoneyBtn.addEventListener("click", function () {

    moneyModal.style.display = "flex";

    startingMoneyInput.focus();

});


// ===============================
// CLOSE MONEY MODAL
// ===============================

closeMoneyModal.addEventListener("click", function () {

    moneyModal.style.display = "none";

});


// ===============================
// SAVE STARTING MONEY
// ===============================

saveMoneyBtn.addEventListener("click", function () {

    const amount =
        Number(startingMoneyInput.value);


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        startingMoneyInput.focus();

        return;
    }


    startingMoney = amount;


    // SAVE TO BROWSER
    localStorage.setItem(
        "stichoStartingMoney",
        startingMoney
    );


    updateDisplay();


    startingMoneyInput.value = "";

    moneyModal.style.display = "none";

});
// ===============================
// CUSTOM CATEGORY
// ===============================

categoryInput.addEventListener("change", function () {

    if (categoryInput.value === "Other") {

        customCategoryInput.style.display = "block";

        customCategoryInput.focus();

    } else {

        customCategoryInput.style.display = "none";

        customCategoryInput.value = "";

    }

});

// ===============================
// SAVE EXPENSE
// ===============================

saveExpenseBtn.addEventListener("click", function () {

    const amount =
        Number(amountInput.value);

let category =
    categoryInput.value;

if (category === "Other") {

    const customCategory =
        customCategoryInput.value.trim();

    if (!customCategory) {

        alert("Please enter your custom category.");

        customCategoryInput.focus();

        return;
    }

    category = customCategory;
}


if (category === "Other") {

    const customCategory =
        customCategoryInput.value.trim();


    if (!customCategory) {

        alert("Please enter your category.");

        customCategoryInput.focus();

        return;

    }


    category = customCategory;

}

    const note =
        noteInput.value.trim();


    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        amountInput.focus();

        return;
    }


    const expense = {

        id: Date.now(),

        amount: amount,

        category: category,

        note: note || category,

        date: new Date().toISOString()

    };


    expenses.unshift(expense);


    // SAVE EXPENSES
    localStorage.setItem(
        "stichoExpenses",
        JSON.stringify(expenses)
    );


    updateDisplay();

    displayExpenses();


    amountInput.value = "";

    noteInput.value = "";
    customCategoryInput.value = "";
customCategoryInput.style.display = "none";
categoryInput.value = "Food";

    expenseModal.style.display = "none";

});


// ===============================
// UPDATE DISPLAY
// ===============================

function updateDisplay() {

    const monthSpent =
        calculateMonthSpent();

    const todaySpent =
        calculateTodaySpent();

    const moneyLeft =
        startingMoney - monthSpent;


    moneyLeftElement.textContent =
        `KSh ${moneyLeft.toLocaleString()}`;

    todaySpentElement.textContent =
        `KSh ${todaySpent.toLocaleString()}`;

    monthSpentElement.textContent =
        `KSh ${monthSpent.toLocaleString()}`;

}


// ===============================
// CALCULATE TODAY'S SPENDING
// ===============================

function calculateTodaySpent() {

    const today =
        new Date().toDateString();


    return expenses

        .filter(function (expense) {

            return new Date(expense.date)
                .toDateString() === today;

        })

        .reduce(function (total, expense) {

            return total + expense.amount;

        }, 0);

}


// ===============================
// CALCULATE MONTH SPENDING
// ===============================

function calculateMonthSpent() {

    const now =
        new Date();


    return expenses

        .filter(function (expense) {

            const date =
                new Date(expense.date);


            return (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            );

        })

        .reduce(function (total, expense) {

            return total + expense.amount;

        }, 0);

}


// ===============================
// DISPLAY EXPENSES
// ===============================

function displayExpenses() {

    if (expenses.length === 0) {

        expenseList.innerHTML = `
            <div class="empty-state">
                <div>💸</div>
                <p>No expenses yet.</p>
                <small>Start tracking your spending.</small>
            </div>
        `;

        return;
    }

    expenseList.innerHTML = "";

    expenses.forEach(function (expense) {

        const expenseItem =
            document.createElement("div");

        expenseItem.className = "expense-item";

        expenseItem.innerHTML = `

            <div class="expense-icon">
                ${getCategoryIcon(expense.category)}
            </div>

            <div class="expense-details">

                <strong>${expense.note}</strong>

                <span>${expense.category}</span>

                <div class="expense-actions">

                    <button
                        class="edit-btn"
                        onclick="editExpense(${expense.id})"
                    >
                        ✏️ Edit
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})"
                    >
                        🗑️ Delete
                    </button>

                </div>

            </div>

            <div class="expense-amount">
                - KSh ${expense.amount.toLocaleString()}
            </div>

        `;

        expenseList.appendChild(expenseItem);
    });
}
function deleteExpense(id) {

    const confirmDelete =
        confirm("Delete this expense?");

    if (!confirmDelete) {
        return;
    }

    expenses =
        expenses.filter(function (expense) {

            return expense.id !== id;

        });

    localStorage.setItem(
        "stichoExpenses",
        JSON.stringify(expenses)
    );

    updateDisplay();

    displayExpenses();
}
function editExpense(id) {

    const expense =
        expenses.find(function (item) {

            return item.id === id;

        });

    if (!expense) {
        return;
    }

    const newAmount =
        prompt(
            "Enter new amount:",
            expense.amount
        );

    if (newAmount === null) {
        return;
    }

    const amount =
        Number(newAmount);

    if (!amount || amount <= 0) {

        alert("Please enter a valid amount.");

        return;
    }


    const newNote =
        prompt(
            "Enter note:",
            expense.note
        );

    if (newNote === null) {
        return;
    }


    expense.amount = amount;

    expense.note =
        newNote.trim() || expense.category;


    localStorage.setItem(
        "stichoExpenses",
        JSON.stringify(expenses)
    );


    updateDisplay();

    displayExpenses();
}

// ===============================
// CATEGORY ICONS
// ===============================

function getCategoryIcon(category) {

    const icons = {

        Food: "🍛",

        Transport: "🚌",

        Bundles: "📱",

        School: "📚",

        Entertainment: "🎮",

        Shopping: "🛍️",

        Rent: "🏠",

        Other: "💳"

    };


    return icons[category] || "💳";

}


// ===============================
// START APP
// ===============================
// =========================
// DISPLAY HISTORY
// =========================

function displayHistory() {

    const total = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    historyTotal.textContent =
        `KSh ${total.toLocaleString()}`;

    historyCount.textContent =
        expenses.length;

    if (expenses.length === 0) {
        historyList.innerHTML = `
            <div class="empty-state">
                <div>📋</div>
                <p>No history yet.</p>
                <small>Your expenses will appear here.</small>
            </div>
        `;
        return;
    }

    historyList.innerHTML = "";

    expenses.forEach(function (expense) {

        const item = document.createElement("div");

        item.className = "history-item";

        const date = new Date(expense.date);

        const formattedDate =
            date.toLocaleDateString("en-KE", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });

        item.innerHTML = `
            <div class="history-icon">
                ${getCategoryIcon(expense.category)}
            </div>

            <div class="history-details">
                <strong>${expense.note || expense.category}</strong>
                <span>${expense.category}</span>
                <span class="history-date">
                    ${formattedDate}
                </span>
            </div>

            <div class="history-amount">
                - KSh ${expense.amount.toLocaleString()}
            </div>
        `;

        historyList.appendChild(item);
    });
}
// =========================
// DISPLAY INSIGHTS
// =========================

function displayInsights() {

    const total = expenses.reduce(function (sum, expense) {
        return sum + expense.amount;
    }, 0);

    insightsTotal.textContent =
        `KSh ${total.toLocaleString()}`;

    insightsCount.textContent =
        expenses.length;

    if (expenses.length === 0) {
        categoryList.innerHTML = `
            <div class="empty-state">
                <div>📊</div>
                <p>No spending data yet.</p>
                <small>Add expenses to see your insights.</small>
            </div>
        `;
        return;
    }

    const categories = {};

    expenses.forEach(function (expense) {

        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }

        categories[expense.category] += expense.amount;
    });

    categoryList.innerHTML = "";

    Object.entries(categories).forEach(function ([category, amount]) {

        const item = document.createElement("div");

        item.className = "history-item";

        item.innerHTML = `
            <div class="history-icon">
                ${getCategoryIcon(category)}
            </div>

            <div class="history-details">
                <strong>${category}</strong>
                <span>Spent on ${category}</span>
            </div>

            <div class="history-amount">
                KSh ${amount.toLocaleString()}
            </div>
        `;

        categoryList.appendChild(item);
    });
}
// =========================
// SCREEN NAVIGATION
// =========================

homeNav.addEventListener("click", function () {
    showScreen("home");
});

historyNav.addEventListener("click", function () {
    showScreen("history");
});
insightsNav.addEventListener("click", function () {
    showScreen("insights");
});

function showScreen(screen) {

    homeScreen.classList.remove("active-screen");
    historyScreen.classList.remove("active-screen");
    insightsScreen.classList.remove("active-screen");

    homeNav.classList.remove("active");
    historyNav.classList.remove("active");
    insightsNav.classList.remove("active");

    if (screen === "home") {
        homeScreen.classList.add("active-screen");
        homeNav.classList.add("active");
    }

    if (screen === "history") {
        historyScreen.classList.add("active-screen");
        historyNav.classList.add("active");
        displayHistory();
    }

   if (screen === "insights") {
    insightsScreen.classList.add("active-screen");
    insightsNav.classList.add("active");
    displayInsights();
}
}
updateDisplay();

displayExpenses();