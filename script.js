
const daysContainer = document.getElementById("days");
const monthYear = document.getElementById("monthYear");

const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const todayBtn = document.getElementById("todayBtn");

const eventForm = document.getElementById("eventForm");
const eventTitle = document.getElementById("eventTitle");
const eventDate = document.getElementById("eventDate");
const eventList = document.getElementById("eventList");

let currentDate = new Date();
let selectedDate = new Date();

let events = JSON.parse(localStorage.getItem("events")) || [];

// Display calendar
function renderCalendar() {

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();

    const lastDate = new Date(year, month + 1, 0).getDate();

    const today = new Date();

    monthYear.textContent = currentDate.toLocaleDateString(
        "en-US",
        { month: "long", year: "numeric" }
    );

    daysContainer.innerHTML = "";

    // Empty spaces before first day
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("div");
        daysContainer.appendChild(empty);
    }

    // Display all dates
    for (let day = 1; day <= lastDate; day++) {

        const dateElement = document.createElement("div");

        dateElement.textContent = day;

        const dateString = formatDate(year, month, day);

        if (
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear()
        ) {
            dateElement.classList.add("today");
        }

        if (dateString === formatDate(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate()
        )) {
            dateElement.classList.add("selected");
        }

        if (events.some(event => event.date === dateString)) {
            dateElement.classList.add("has-event");
        }

        dateElement.addEventListener("click", () => {
            selectedDate = new Date(year, month, day);
            renderCalendar();
            displayEvents();
        });

        daysContainer.appendChild(dateElement);
    }
}

// Format date as YYYY-MM-DD
function formatDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

// Previous month
prevBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

// Next month
nextBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

// Today button
todayBtn.addEventListener("click", () => {
    currentDate = new Date();
    selectedDate = new Date();
    renderCalendar();
    displayEvents();
});

// Add event
eventForm.addEventListener("submit", function(e) {

    e.preventDefault();

    const title = eventTitle.value.trim();
    const date = eventDate.value;

    if (!title || !date) {
        alert("Please enter event details");
        return;
    }

    events.push({
        id: Date.now(),
        title: title,
        date: date
    });

    localStorage.setItem("events", JSON.stringify(events));

    eventForm.reset();

    renderCalendar();
    displayEvents();

    alert("Event added successfully!");
});

// Display events
function displayEvents() {

    eventList.innerHTML = "";

    const selected = formatDate(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
    );

    const filteredEvents = events.filter(
        event => event.date === selected
    );

    if (filteredEvents.length === 0) {
        eventList.textContent = "No events on this date.";
        return;
    }

    filteredEvents.forEach(event => {

        const item = document.createElement("div");
        item.className = "event-item";

        const title = document.createElement("span");
        title.textContent = event.title;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.className = "delete-btn";

        deleteBtn.addEventListener("click", () => {

            events = events.filter(e => e.id !== event.id);

            localStorage.setItem(
                "events",
                JSON.stringify(events)
            );

            renderCalendar();
            displayEvents();
        });

        item.appendChild(title);
        item.appendChild(deleteBtn);

        eventList.appendChild(item);
    });
}

// Initial display
renderCalendar();
displayEvents();
