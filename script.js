// ==========================================
// FARM WORK RECORDS - CORRECTED JAVASCRIPT
// ==========================================


// ==========================================
// GET HTML ELEMENTS
// ==========================================

const workForm = document.getElementById("workForm");
const recordsList = document.getElementById("recordsList");
const searchInput = document.getElementById("search");

const totalWorkers = document.getElementById("totalWorkers");
const totalRecords = document.getElementById("totalRecords");
const totalAmount = document.getElementById("totalAmount");

const landSizeInput = document.getElementById("landSize");
const workTypeInput = document.getElementById("workType");
const amountInput = document.getElementById("amount");


// ==========================================
// LOAD RECORDS
// ==========================================

let records =
    JSON.parse(localStorage.getItem("farmRecords")) || [];

let teluguMode = false;


// ==========================================
// WORK RATES
// ==========================================

const workRates = {

    "Sallu": 700,
    "Guntaka": 700,
    "Mekullu": 700,
    "Mandhu": 700,

    "TractorGorru": 800,
    "TractorSallu": 800,
    "TractorBochallu": 1500,
    "TractorRotavater": 1500,

    "fertilizer spray": 300,

    "Uprooting chilli plants with a tractor": 1500,

    "Uprooting cotton stalks": 1200

};


// ==========================================
// PAGE LOAD
// ==========================================

displayRecords();
updateSummary();
updateGrandTotal();
updateDashboard();


// ==========================================
// CALCULATE AMOUNT
// ==========================================

function calculateAmount() {

    if (!landSizeInput || !workTypeInput || !amountInput) {
        return;
    }

    const acres =
        Number(landSizeInput.value) || 0;

    const workType =
        workTypeInput.value;


    // OTHER
    if (workType === "other") {

        amountInput.readOnly = false;

        amountInput.value = "";

        amountInput.placeholder =
            teluguMode
                ? "మొత్తం నమోదు చేయండి"
                : "Enter Amount Manually";

        return;
    }


    // FIELD WORK
    if (workType === "Field Work") {

        amountInput.readOnly = false;

        amountInput.value = "";

        amountInput.placeholder =
            teluguMode
                ? "మొత్తం నమోదు చేయండి"
                : "Enter Amount Manually";

        return;
    }


    // AUTOMATIC CALCULATION

    amountInput.readOnly = true;

    const rate =
        workRates[workType] || 0;


    if (acres > 0 && rate > 0) {

        amountInput.value =
            acres * rate;

    } else {

        amountInput.value = "";

    }

}


// ==========================================
// INPUT EVENTS
// ==========================================

if (landSizeInput) {

    landSizeInput.addEventListener(
        "input",
        calculateAmount
    );

}


if (workTypeInput) {

    workTypeInput.addEventListener(
        "change",
        calculateAmount
    );

}


// ==========================================
// SAVE RECORD
// ==========================================

if (workForm) {

    workForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const date =
                document.getElementById("date")?.value || "";


            const workerName =
                document
                    .getElementById("workerName")
                    ?.value
                    .trim() || "";


            const landSize =
                document.getElementById("landSize")?.value || "";


            const workType =
                document.getElementById("workType")?.value || "";


            const workersCount =
                document
                    .getElementById("workersCount")
                    ?.value || "";


            const amount =
                document.getElementById("amount")?.value || "";


            const notes =
                document
                    .getElementById("notes")
                    ?.value
                    .trim() || "";


            // VALIDATION

            if (!workerName) {

                alert(
                    teluguMode
                        ? "దయచేసి కూలీ పేరు నమోదు చేయండి."
                        : "Please enter worker name."
                );

                return;
            }


            if (!workType) {

                alert(
                    teluguMode
                        ? "దయచేసి పని రకాన్ని ఎంచుకోండి."
                        : "Please select work type."
                );

                return;
            }


            if (!amount || Number(amount) <= 0) {

                alert(
                    teluguMode
                        ? "దయచేసి సరైన మొత్తాన్ని నమోదు చేయండి."
                        : "Please enter a valid amount."
                );

                return;
            }


            // CREATE RECORD

            const newRecord = {

                id: Date.now(),

                date: date,

                workerName: workerName,

                landSize:
                    Number(landSize) || 0,

                workType: workType,

                workersCount:
                    Number(workersCount) || 0,

                amount:
                    Number(amount) || 0,

                notes: notes

            };


            // ADD

            records.push(newRecord);


            // SAVE

            saveRecords();


            // UPDATE

            displayRecords();

            updateSummary();

            updateGrandTotal();

            updateDashboard();


            // RESET

            workForm.reset();


            if (amountInput) {

                amountInput.value = "";

                amountInput.readOnly = true;

                amountInput.placeholder =
                    teluguMode
                        ? "మొత్తం ఆటోమేటిక్‌గా వస్తుంది"
                        : "Amount will calculate automatically";

            }


            alert(
                teluguMode
                    ? "✅ వివరాలు విజయవంతంగా సేవ్ చేయబడ్డాయి!"
                    : "✅ Record saved successfully!"
            );

        }
    );

}


// ==========================================
// SAVE TO LOCAL STORAGE
// ==========================================

function saveRecords() {

    localStorage.setItem(
        "farmRecords",
        JSON.stringify(records)
    );

}


// ==========================================
// DISPLAY RECORDS
// ==========================================

function displayRecords(searchText = "") {

    if (!recordsList) {
        return;
    }


    recordsList.innerHTML = "";


    const search =
        String(searchText)
            .toLowerCase()
            .trim();


    const filteredRecords =
        records.filter(function (record) {

            return String(
                record.workerName || ""
            )
                .toLowerCase()
                .includes(search);

        });


    // NO RECORDS

    if (filteredRecords.length === 0) {

        recordsList.innerHTML = `

            <p style="text-align:center;color:#777;">

                ${
                    teluguMode
                        ? "📋 వివరాలు ఏవీ లేవు"
                        : "📋 No records found"
                }

            </p>

        `;

        updateSummary();

        return;
    }


    // DISPLAY

    filteredRecords.forEach(function (record) {

        const card =
            document.createElement("div");


        card.className =
            "record-card";


        card.innerHTML = `

            <h3>
                👨‍🌾 ${record.workerName}
            </h3>


            <p>

                <strong>
                    ${
                        teluguMode
                            ? "📅 తేదీ:"
                            : "📅 Date:"
                    }
                </strong>

                ${formatDate(record.date)}

            </p>


            <p>

                <strong>
                    ${
                        teluguMode
                            ? "🌱 పొలం:"
                            : "🌱 Field:"
                    }
                </strong>

                ${record.landSize}

                ${teluguMode ? " ఎకరాలు" : " acres"}

            </p>


            <p>

                <strong>
                    ${
                        teluguMode
                            ? "🚜 పని:"
                            : "🚜 Work:"
                    }
                </strong>

                ${getWorkName(record.workType)}

            </p>


            <p>

                <strong>
                    ${
                        teluguMode
                            ? "👥 కూలీల సంఖ్య:"
                            : "👥 Workers:"
                    }
                </strong>

                ${record.workersCount}

            </p>


            <p>

                <strong>
                    ${
                        teluguMode
                            ? "💰 మొత్తం:"
                            : "💰 Amount:"
                    }
                </strong>

                ₹${Number(record.amount)
                    .toLocaleString("en-IN")}

            </p>


            ${
                record.notes
                    ? `
                        <p>

                            <strong>
                                ${
                                    teluguMode
                                        ? "📝 గమనిక:"
                                        : "📝 Notes:"
                                }
                            </strong>

                            ${record.notes}

                        </p>
                    `
                    : ""
            }


            <button
                onclick="editRecord(${record.id})"
            >

                ${
                    teluguMode
                        ? "✏️ మార్చండి"
                        : "✏️ Edit"
                }

            </button>


            <button
                onclick="deleteRecord(${record.id})"
                style="background:#d32f2f;"
            >

                ${
                    teluguMode
                        ? "🗑️ తొలగించండి"
                        : "🗑️ Delete"
                }

            </button>

        `;


        recordsList.appendChild(card);

    });


    updateSummary();

}


// ==========================================
// WORK TYPE NAME
// ==========================================

function getWorkName(type) {

    const englishNames = {

        "Sallu":
            "Araka (Sallu)",

        "Guntaka":
            "Araka (Guntaka)",

        "Mekullu":
            "Araka (Mekullu)",

        "Mandhu":
            "Araka (Mandhu)",

        "TractorGorru":
            "Tractor (Gorru)",

        "TractorSallu":
            "Tractor (Sallu)",

        "TractorBochallu":
            "Tractor (Bochallu)",

        "TractorRotavater":
            "Tractor (Rotavater)",

        "fertilizer spray":
            "Tractor (Fertilizer Spray)",

        "Uprooting chilli plants with a tractor":
            "Uprooting chilli plants with a tractor",

        "Uprooting cotton stalks":
            "Uprooting cotton stalks",

        "Field Work":
            "Field Work",

        "other":
            "Other"

    };


    const teluguNames = {

        "Sallu":
            "అరక (సళ్ళు)",

        "Guntaka":
            "అరక (గుంటక)",

        "Mekullu":
            "అరక (మేకులు)",

        "Mandhu":
            "అరక (మందు)",

        "TractorGorru":
            "ట్రాక్టర్ (గొర్రు)",

        "TractorSallu":
            "ట్రాక్టర్ (సళ్ళు)",

        "TractorBochallu":
            "ట్రాక్టర్ (బొచ్చళ్ళు)",

        "TractorRotavater":
            "ట్రాక్టర్ (రోటావేటర్)",

        "fertilizer spray":
            "ట్రాక్టర్ (ఎరువుల స్ప్రే)",

        "Uprooting chilli plants with a tractor":
            "ట్రాక్టర్ తో మిరప కట్టే పీకటం",

        "Uprooting cotton stalks":
            "పత్తి కట్ట పీకటం",

        "Field Work":
            "పొలం పని",

        "other":
            "ఇతర పని"

    };


    const names =
        teluguMode
            ? teluguNames
            : englishNames;


    return names[type] || type;

}


// ==========================================
// SEARCH
// ==========================================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            displayRecords(this.value);

        }
    );

}


// ==========================================
// DELETE RECORD
// ==========================================

function deleteRecord(id) {

    const confirmDelete =
        confirm(

            teluguMode
                ? "ఈ వివరాలను తొలగించాలా?"
                : "Are you sure you want to delete this record?"

        );


    if (!confirmDelete) {
        return;
    }


    records =
        records.filter(function (record) {

            return record.id !== id;

        });


    saveRecords();


    displayRecords();

    updateSummary();

    updateGrandTotal();

    updateDashboard();


    alert(

        teluguMode
            ? "🗑️ వివరాలు తొలగించబడ్డాయి!"
            : "🗑️ Record deleted!"

    );

}


// ==========================================
// EDIT RECORD
// ==========================================

function editRecord(id) {

    const record =
        records.find(function (item) {

            return item.id === id;

        });


    if (!record) {
        return;
    }


    document.getElementById("date").value =
        record.date || "";


    document.getElementById("workerName").value =
        record.workerName || "";


    document.getElementById("landSize").value =
        record.landSize || "";


    document.getElementById("workType").value =
        record.workType || "";


    document.getElementById("workersCount").value =
        record.workersCount || "";


    document.getElementById("amount").value =
        record.amount || "";


    document.getElementById("notes").value =
        record.notes || "";


    // Remove old record
    records =
        records.filter(function (item) {

            return item.id !== id;

        });


    saveRecords();


    displayRecords();

    updateSummary();

    updateGrandTotal();

    updateDashboard();


    calculateAmount();


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


    alert(

        teluguMode
            ? "✏️ వివరాలను మార్చి Save Record నొక్కండి."
            : "✏️ Edit the details and click Save Record."

    );

}


// ==========================================
// SUMMARY
// ==========================================

function updateSummary() {

    if (totalRecords) {

        totalRecords.textContent =
            records.length;

    }


    let workers = 0;

    let amount = 0;


    records.forEach(function (record) {

        workers +=
            Number(record.workersCount) || 0;

        amount +=
            Number(record.amount) || 0;

    });


    if (totalWorkers) {

        totalWorkers.textContent =
            workers;

    }


    if (totalAmount) {

        totalAmount.textContent =
            amount.toLocaleString("en-IN");

    }

}


// ==========================================
// DATE FORMAT
// ==========================================

function formatDate(date) {

    if (!date) {
        return "";
    }


    const parts =
        date.split("-");


    if (parts.length !== 3) {
        return date;
    }


    return `${parts[2]}-${parts[1]}-${parts[0]}`;

}


// ==========================================
// LANGUAGE SWITCH
// ==========================================

function toggleLanguage() {

    teluguMode =
        !teluguMode;


    const languageBtn =
        document.getElementById("languageBtn");


    if (!languageBtn) {
        return;
    }


    if (teluguMode) {

        languageBtn.textContent =
            "🌐 English";


        setText(
            "title",
            "🌾 వ్యవసాయ పనుల వివరాలు"
        );


        setText(
            "subtitle",
            "పొలం మరియు కూలీల వివరాలు"
        );


        setText(
            "addRecordTitle",
            "పని వివరాలు నమోదు చేయండి"
        );


        setText(
            "dateLabel",
            "📅 తేదీ"
        );


        setText(
            "workerNameLabel",
            "👨‍🌾 కూలీ పేరు"
        );


        setText(
            "landSizeLabel",
            "🌱 పొలం విస్తీర్ణం (ఎకరాలు)"
        );


        setText(
            "workTypeLabel",
            "🚜 పని రకం"
        );


        setText(
            "workersCountLabel",
            "👥 కూలీల సంఖ్య"
        );


        setText(
            "amountLabel",
            "💰 మొత్తం"
        );


        setText(
            "notesLabel",
            "📝 గమనిక"
        );


        setPlaceholder(
            "workerName",
            "కూలీ పేరు నమోదు చేయండి"
        );


        setPlaceholder(
            "landSize",
            "ఉదాహరణ: 3.5"
        );


        setPlaceholder(
            "workersCount",
            "కూలీల సంఖ్య నమోదు చేయండి"
        );


        setPlaceholder(
            "amount",
            "మొత్తం ఆటోమేటిక్‌గా వస్తుంది"
        );


        setPlaceholder(
            "notes",
            "అదనపు వివరాలు నమోదు చేయండి"
        );


        setPlaceholder(
            "search",
            "🔍 కూలీ పేరు వెతకండి..."
        );


        updateWorkOptionsTelugu();


        setText(
            "saveBtn",
            "💾 వివరాలు సేవ్ చేయండి"
        );


        setText(
            "recordsTitle",
            "📋 పని వివరాలు"
        );


        setText(
            "summaryTitle",
            "📊 మొత్తం వివరాలు"
        );


        setText(
            "totalWorkersLabel",
            "మొత్తం కూలీలు"
        );


        setText(
            "totalRecordsLabel",
            "మొత్తం వివరాలు"
        );


        setText(
            "totalAmountLabel",
            "మొత్తం మొత్తం"
        );


        setText(
            "footerText",
            "🌾 వ్యవసాయ పని రికార్డులు | భూక్యా సైదా నాయక్ అభివృద్ధి చేశారు"
        );

    }

    else {

        languageBtn.textContent =
            "🌐 తెలుగు";


        setText(
            "title",
            "🌾 Farm Work Records"
        );


        setText(
            "subtitle",
            "Field & Workers Details"
        );


        setText(
            "addRecordTitle",
            "Add Work Record"
        );


        setText(
            "dateLabel",
            "📅 Date"
        );


        setText(
            "workerNameLabel",
            "👨‍🌾 Worker Name"
        );


        setText(
            "landSizeLabel",
            "🌱 Field Size (Acres)"
        );


        setText(
            "workTypeLabel",
            "🚜 Work Type"
        );


        setText(
            "workersCountLabel",
            "👥 Number of Workers"
        );


        setText(
            "amountLabel",
            "💰 Total Amount"
        );


        setText(
            "notesLabel",
            "📝 Notes"
        );


        setPlaceholder(
            "workerName",
            "Enter worker name"
        );


        setPlaceholder(
            "landSize",
            "Example: 3.5"
        );


        setPlaceholder(
            "workersCount",
            "Enter workers count"
        );


        setPlaceholder(
            "amount",
            "Amount will calculate automatically"
        );


        setPlaceholder(
            "notes",
            "Enter extra details"
        );


        setPlaceholder(
            "search",
            "🔍 Search worker name..."
        );


        updateWorkOptionsEnglish();


        setText(
            "saveBtn",
            "💾 Save Record"
        );


        setText(
            "recordsTitle",
            "📋 Work Records"
        );


        setText(
            "summaryTitle",
            "📊 Summary"
        );


        setText(
            "totalWorkersLabel",
            "Total Workers"
        );


        setText(
            "totalRecordsLabel",
            "Total Records"
        );


        setText(
            "totalAmountLabel",
            "Total Amount"
        );


        setText(
            "footerText",
            "🌾 Farm Work Records | Developed by BHUKYA SAIDA NAIK"
        );

    }


    displayRecords();

    calculateAmount();

}


// ==========================================
// HELPER - SET TEXT
// ==========================================

function setText(id, text) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            text;

    }

}


// ==========================================
// HELPER - PLACEHOLDER
// ==========================================

function setPlaceholder(id, text) {

    const element =
        document.getElementById(id);


    if (element) {

        element.placeholder =
            text;

    }

}


// ==========================================
// ENGLISH WORK OPTIONS
// ==========================================

function updateWorkOptionsEnglish() {

    if (!workTypeInput) {
        return;
    }


    const options =
        workTypeInput.options;


    const texts = [

        "Select Work",

        "Araka (Sallu) - ₹700 / Acre",

        "Araka (Guntaka) - ₹700 / Acre",

        "Araka (Mekullu) - ₹700 / Acre",

        "Araka (Mandhu) - ₹700 / Acre",

        "Tractor (Gorru) - ₹800 / Acre",

        "Tractor (Sallu) - ₹800 / Acre",

        "Tractor (Bochallu) - ₹1500 / Acre",

        "Tractor (Rotavater) - ₹1500 / Acre",

        "Tractor (Fertilizer Spray) - ₹300 / Acre",

        "Uprooting chilli plants with a tractor - ₹1500 / Acre",

        "Uprooting cotton stalks - ₹1200 / Acre",

        "Field Work",

        "Other"

    ];


    for (
        let i = 0;
        i < texts.length && i < options.length;
        i++
    ) {

        options[i].textContent =
            texts[i];

    }

}


// ==========================================
// TELUGU WORK OPTIONS
// ==========================================

function updateWorkOptionsTelugu() {

    if (!workTypeInput) {
        return;
    }


    const options =
        workTypeInput.options;


    const texts = [

        "పని ఎంచుకోండి",

        "అరక (సళ్ళు) - ₹700 / ఎకరం",

        "అరక (గుంటక) - ₹700 / ఎకరం",

        "అరక (మేకులు) - ₹700 / ఎకరం",

        "అరక (మందు) - ₹700 / ఎకరం",

        "ట్రాక్టర్ (గొర్రు) - ₹800 / ఎకరం",

        "ట్రాక్టర్ (సళ్ళు) - ₹800 / ఎకరం",

        "ట్రాక్టర్ (బొచ్చళ్ళు) - ₹1500 / ఎకరం",

        "ట్రాక్టర్ (రోటావేటర్) - ₹1500 / ఎకరం",

        "ట్రాక్టర్ (ఎరువుల స్ప్రే) - ₹300 / ఎకరం",

        "ట్రాక్టర్ తో మిరప కట్టే పీకటం - ₹1500 / ఎకరం",

        "పత్తి కట్ట పీకటం - ₹1200 / ఎకరం",

        "పొలం పని",

        "ఇతర"

    ];


    for (
        let i = 0;
        i < texts.length && i < options.length;
        i++
    ) {

        options[i].textContent =
            texts[i];

    }

}


// ==========================================
// SPLASH SCREEN
// ==========================================

window.addEventListener(
    "load",
    function () {

        const splashScreen =
            document.getElementById("splash-screen");


        const homePage =
            document.getElementById("home-page");


        if (splashScreen && homePage) {

            setTimeout(
                function () {

                    splashScreen.style.display =
                        "none";

                    homePage.style.display =
                        "block";

                },
                5000
            );

        }

    }
);


// ==========================================
// GRAND TOTAL
// WORK + FARM EXPENSES
// ==========================================

function updateGrandTotal() {

    const workRecords =
        JSON.parse(
            localStorage.getItem("farmRecords")
        ) || [];


    const farmExpenses =
        JSON.parse(
            localStorage.getItem("farmExpenses")
        ) || [];


    let workTotal = 0;


    workRecords.forEach(
        function (record) {

            workTotal +=
                Number(record.amount) || 0;

        }
    );


    let expenseTotal = 0;


    farmExpenses.forEach(
        function (expense) {

            expenseTotal +=
                Number(expense.amount) || 0;

        }
    );


    const grandTotal =
        workTotal + expenseTotal;


    const workAmountElement =
        document.getElementById("totalAmount");


    if (workAmountElement) {

        workAmountElement.textContent =
            workTotal.toLocaleString("en-IN");

    }


    const farmExpenseAmount =
        document.getElementById("farmExpenseAmount");


    if (farmExpenseAmount) {

        farmExpenseAmount.textContent =
            expenseTotal.toLocaleString("en-IN");

    }


    const grandTotalAmount =
        document.getElementById("grandTotalAmount");


    if (grandTotalAmount) {

        grandTotalAmount.textContent =
            grandTotal.toLocaleString("en-IN");

    }

}


// ==========================================
// FARM DASHBOARD
// ==========================================

function updateDashboard() {

    const workRecords =
        JSON.parse(
            localStorage.getItem("farmRecords")
        ) || [];


    const farmExpenses =
        JSON.parse(
            localStorage.getItem("farmExpenses")
        ) || [];


    let workers = 0;


    workRecords.forEach(
        function (record) {

            workers +=
                Number(record.workersCount) || 0;

        }
    );


    const dashboardWorkers =
        document.getElementById(
            "dashboardWorkers"
        );


    if (dashboardWorkers) {

        dashboardWorkers.textContent =
            workers;

    }


    const dashboardRecords =
        document.getElementById(
            "dashboardRecords"
        );


    if (dashboardRecords) {

        dashboardRecords.textContent =
            workRecords.length;

    }


    let workAmount = 0;


    workRecords.forEach(
        function (record) {

            workAmount +=
                Number(record.amount) || 0;

        }
    );


    const dashboardWorkAmount =
        document.getElementById(
            "dashboardWorkAmount"
        );


    if (dashboardWorkAmount) {

        dashboardWorkAmount.textContent =
            workAmount.toLocaleString("en-IN");

    }


    let expenseAmount = 0;


    farmExpenses.forEach(
        function (expense) {

            expenseAmount +=
                Number(expense.amount) || 0;

        }
    );


    const dashboardExpenseAmount =
        document.getElementById(
            "dashboardExpenseAmount"
        );


    if (dashboardExpenseAmount) {

        dashboardExpenseAmount.textContent =
            expenseAmount.toLocaleString("en-IN");

    }


    const grandTotal =
        workAmount + expenseAmount;


    const dashboardGrandTotal =
        document.getElementById(
            "dashboardGrandTotal"
        );


    if (dashboardGrandTotal) {

        dashboardGrandTotal.textContent =
            grandTotal.toLocaleString("en-IN");

    }

}


// ==========================================
// UPDATE WHEN PAGE GETS FOCUS
// ==========================================

window.addEventListener(
    "focus",
    function () {

        updateGrandTotal();

        updateDashboard();

    }
);


// ==========================================
// LOCAL STORAGE CHANGE
// ==========================================

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "farmRecords" ||
            event.key === "farmExpenses"
        ) {

            records =
                JSON.parse(
                    localStorage.getItem("farmRecords")
                ) || [];


            displayRecords();

            updateSummary();

            updateGrandTotal();

            updateDashboard();

        }

    }
);
// ==========================================
// SPLASH PROJECT NAME ANIMATION
// ==========================================

const projectName = "FARM WORK RECORDS";

const projectNameElement =
    document.getElementById("project-name");

let projectIndex = 0;

function typeProjectName() {

    if (!projectNameElement) {
        return;
    }

    if (projectIndex < projectName.length) {

        projectNameElement.textContent =
            projectName.substring(
                0,
                projectIndex + 1
            );

        projectIndex++;

        setTimeout(
            typeProjectName,
            120
        );
    }
}

window.addEventListener("load", function () {

    typeProjectName();

});
