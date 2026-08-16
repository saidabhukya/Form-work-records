// ==========================================
// FARM EXPENSES JAVASCRIPT
// ==========================================


// ==========================================
// LANGUAGE MODE
// ==========================================

let expenseTeluguMode = false;


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const expenseForm = document.getElementById("expenseForm");
const expensesList = document.getElementById("expensesList");


// ==========================================
// GET SAVED EXPENSES
// ==========================================

let expenses =
    JSON.parse(localStorage.getItem("farmExpenses")) || [];


// ==========================================
// PAGE LOAD
// ==========================================

displayExpenses();


// ==========================================
// SAVE EXPENSE
// ==========================================

expenseForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const date =
        document.getElementById("expenseDate").value;

    const type =
        document.getElementById("expenseType").value;

    const amount =
        document.getElementById("expenseAmount").value;

    const notes =
        document.getElementById("expenseNotes").value;


    // Check required values
    if (!date || !type || !amount) {

        alert(
            expenseTeluguMode
                ? "⚠️ అన్ని వివరాలు నమోదు చేయండి."
                : "⚠️ Please enter all required details."
        );

        return;
    }


    // Create expense
    const newExpense = {

        id: Date.now(),

        date: date,

        type: type,

        amount: Number(amount),

        notes: notes

    };


    // Add expense
    expenses.push(newExpense);


    // Save to Local Storage
    saveExpenses();


    // Display
    displayExpenses();


    // Clear form
    expenseForm.reset();
    // Update dashboard
    window.dispatchEvent(new Event("storage"));


    // Success message
    alert(
        expenseTeluguMode
            ? "✅ ఖర్చు విజయవంతంగా సేవ్ చేయబడింది!"
            : "✅ Expense saved successfully!"
    );

});


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveExpenses() {

    localStorage.setItem(
        "farmExpenses",
        JSON.stringify(expenses)
    );

}


// ==========================================
// DISPLAY EXPENSES
// ==========================================

function displayExpenses() {

    if (!expensesList) {
        return;
    }

    expensesList.innerHTML = "";


    // No expenses
    if (expenses.length === 0) {

        expensesList.innerHTML = `

            <p class="no-expenses">

                ${
                    expenseTeluguMode
                        ? "💰 ఖర్చుల వివరాలు ఏవీ లేవు"
                        : "💰 No expense records found"
                }

            </p>

        `;

        return;
    }


    // Display expenses
    expenses.forEach(function (expense) {

        const card =
            document.createElement("div");

        card.className = "expense-card";


        card.innerHTML = `

            <h3>
                ${getExpenseName(expense.type)}
            </h3>


            <p>
                <strong>
                    ${
                        expenseTeluguMode
                            ? "📅 తేదీ:"
                            : "📅 Date:"
                    }
                </strong>

                ${formatDate(expense.date)}
            </p>


            <p>
                <strong>
                    ${
                        expenseTeluguMode
                            ? "💵 మొత్తం:"
                            : "💵 Amount:"
                    }
                </strong>

                ₹${Number(expense.amount).toLocaleString("en-IN")}
            </p>


            ${
                expense.notes
                    ? `
                    <p>
                        <strong>
                            ${
                                expenseTeluguMode
                                    ? "📝 గమనిక:"
                                    : "📝 Notes:"
                            }
                        </strong>

                        ${expense.notes}
                    </p>
                    `
                    : ""
            }


            <button onclick="editExpense(${expense.id})">

                ${
                    expenseTeluguMode
                        ? "✏️ మార్చండి"
                        : "✏️ Edit"
                }

            </button>


            <button
                onclick="deleteExpense(${expense.id})"
                class="delete-btn"
            >

                ${
                    expenseTeluguMode
                        ? "🗑️ తొలగించండి"
                        : "🗑️ Delete"
                }

            </button>

        `;


        expensesList.appendChild(card);

    });

}


// ==========================================
// EXPENSE NAMES
// ==========================================

function getExpenseName(type) {

    const teluguNames = {

        Seeds: "🌱 విత్తనాలు",

        Petrol: "⛽ పెట్రోల్",

        Diesel: "🛢️ డీజిల్",

        Fertilizer: "🌾 ఎరువులు",

        Pesticide: "💊 పురుగుమందులు",

        Tractor: "🚜 ట్రాక్టర్",

        Electricity: "⚡ విద్యుత్",

        Water: "💧 నీరు / సాగునీరు",

        Transport: "🚚 రవాణా",

        Other: "📦 ఇతర"

    };


    const englishNames = {

        Seeds: "🌱 Seeds",

        Petrol: "⛽ Petrol",

        Diesel: "🛢️ Diesel",

        Fertilizer: "🌾 Fertilizer",

        Pesticide: "💊 Pesticides",

        Tractor: "🚜 Tractor",

        Electricity: "⚡ Electricity",

        Water: "💧 Water / Irrigation",

        Transport: "🚚 Transport",

        Other: "📦 Other"

    };


    if (expenseTeluguMode) {

        return teluguNames[type] || type;

    }

    return englishNames[type] || type;

}


// ==========================================
// DELETE EXPENSE
// ==========================================

function deleteExpense(id) {

    const confirmDelete = confirm(

        expenseTeluguMode
            ? "ఈ ఖర్చు వివరాలను తొలగించాలా?"
            : "Are you sure you want to delete this expense?"

    );


    if (!confirmDelete) {

        return;

    }


    expenses = expenses.filter(function (expense) {

        return expense.id !== id;

    });


    saveExpenses();

    displayExpenses();
    window.dispatchEvent(new Event("storage"));


    alert(

        expenseTeluguMode
            ? "🗑️ ఖర్చు వివరాలు తొలగించబడ్డాయి!"
            : "🗑️ Expense deleted!"

    );

}


// ==========================================
// EDIT EXPENSE
// ==========================================

function editExpense(id) {

    const expense =
        expenses.find(function (item) {

            return item.id === id;

        });


    if (!expense) {

        return;

    }


    document.getElementById("expenseDate").value =
        expense.date;


    document.getElementById("expenseType").value =
        expense.type;


    document.getElementById("expenseAmount").value =
        expense.amount;


    document.getElementById("expenseNotes").value =
        expense.notes;


    // Remove old record
    expenses = expenses.filter(function (item) {

        return item.id !== id;

    });


    saveExpenses();

    displayExpenses();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    alert(

        expenseTeluguMode
            ? "✏️ వివరాలను మార్చి Save Expense నొక్కండి."
            : "✏️ Edit the details and click Save Expense."

    );

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    if (!date) {

        return "";

    }


    const parts = date.split("-");

    return `${parts[2]}-${parts[1]}-${parts[0]}`;

}


// ==========================================
// EXPENSE LANGUAGE SWITCH
// ==========================================

function toggleExpenseLanguage() {

    expenseTeluguMode = !expenseTeluguMode;


    const languageBtn =
        document.getElementById("languageBtn");


    if (expenseTeluguMode) {

        // Button
        languageBtn.textContent =
            "🌐 English";


        // Header
        document.getElementById("expenseTitle").textContent =
            "💰 వ్యవసాయ ఖర్చులు";


        document.getElementById("expenseSubtitle").textContent =
            "విత్తనాలు, పెట్రోల్, డీజిల్ మరియు ఇతర ఖర్చులు";


        document.getElementById("backBtn").textContent =
            "⬅️ పని వివరాలకు తిరిగి వెళ్లండి";


        // Add Expense
        document.getElementById("addExpenseTitle").textContent =
            "💰 వ్యవసాయ ఖర్చు నమోదు చేయండి";


        document.getElementById("expenseDateLabel").textContent =
            "📅 తేదీ";


        document.getElementById("expenseTypeLabel").textContent =
            "💰 ఖర్చు రకం";


        document.getElementById("expenseAmountLabel").textContent =
            "💵 మొత్తం";


        document.getElementById("expenseNotesLabel").textContent =
            "📝 గమనిక";


        document.getElementById("expenseAmount").placeholder =
            "మొత్తం నమోదు చేయండి";


        document.getElementById("expenseNotes").placeholder =
            "వివరాలు నమోదు చేయండి";


        document.getElementById("saveExpenseBtn").textContent =
            "💾 ఖర్చు సేవ్ చేయండి";


        // Records
        document.getElementById("expenseRecordsTitle").textContent =
            "📋 వ్యవసాయ ఖర్చుల వివరాలు";


        // Options
        const select =
            document.getElementById("expenseType");


        select.options[0].textContent =
            "ఖర్చు ఎంచుకోండి";


        select.options[1].textContent =
            "🌱 విత్తనాలు";


        select.options[2].textContent =
            "⛽ పెట్రోల్";


        select.options[3].textContent =
            "🛢️ డీజిల్";


        select.options[4].textContent =
            "🌾 ఎరువులు";


        select.options[5].textContent =
            "💊 పురుగుమందులు";


        select.options[6].textContent =
            "🚜 ట్రాక్టర్";


        select.options[7].textContent =
            "⚡ విద్యుత్";


        select.options[8].textContent =
            "💧 నీరు / సాగునీరు";


        select.options[9].textContent =
            "🚚 రవాణా";


        select.options[10].textContent =
            "📦 ఇతర";

    }


    else {

        // Button
        languageBtn.textContent =
            "🌐 తెలుగు";


        // Header
        document.getElementById("expenseTitle").textContent =
            "💰 Farm Expenses";


        document.getElementById("expenseSubtitle").textContent =
            "Seeds, Petrol, Diesel and Other Expenses";


        document.getElementById("backBtn").textContent =
            "⬅️ Back to Work Records";


        // Add Expense
        document.getElementById("addExpenseTitle").textContent =
            "💰 Add Farm Expense";


        document.getElementById("expenseDateLabel").textContent =
            "📅 Date";


        document.getElementById("expenseTypeLabel").textContent =
            "💰 Expense Type";


        document.getElementById("expenseAmountLabel").textContent =
            "💵 Amount";


        document.getElementById("expenseNotesLabel").textContent =
            "📝 Notes";


        document.getElementById("expenseAmount").placeholder =
            "Enter Amount";


        document.getElementById("expenseNotes").placeholder =
            "Enter details";


        document.getElementById("saveExpenseBtn").textContent =
            "💾 Save Expense";


        // Records
        document.getElementById("expenseRecordsTitle").textContent =
            "📋 Farm Expense Records";


        // Options
        const select =
            document.getElementById("expenseType");


        select.options[0].textContent =
            "Select Expense";


        select.options[1].textContent =
            "🌱 Seeds";


        select.options[2].textContent =
            "⛽ Petrol";


        select.options[3].textContent =
            "🛢️ Diesel";


        select.options[4].textContent =
            "🌾 Fertilizer";


        select.options[5].textContent =
            "💊 Pesticides";


        select.options[6].textContent =
            "🚜 Tractor";


        select.options[7].textContent =
            "⚡ Electricity";


        select.options[8].textContent =
            "💧 Water / Irrigation";


        select.options[9].textContent =
            "🚚 Transport";


        select.options[10].textContent =
            "📦 Other";

    }


    // Refresh records
    displayExpenses();

}