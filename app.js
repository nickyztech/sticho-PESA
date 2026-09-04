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

                <small>
                    Start tracking your spending.
                </small>

            </div>

        `;

        return;
    }


    expenseList.innerHTML = "";


    expenses.forEach(function (expense) {

        const expenseItem =
            document.createElement("div");


        expenseItem.className =
            "expense-item";


        expenseItem.innerHTML = `

            <div class="expense-icon">
                ${getCategoryIcon(expense.category)}
            </div>

            <div class="expense-details">

                <strong>
                    ${expense.note}
                </strong>

                <span>
                    ${expense.category}
                </span>

            </div>

            <div class="expense-amount">

                - KSh
                ${expense.amount.toLocaleString()}

            </div>

        `;


        expenseList.appendChild(expenseItem);

    });

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

updateDisplay();

displayExpenses();