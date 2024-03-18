const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-AM/events";

const state = {
  events: [],
};

const eventsList = document.querySelector("#events");

const addEventForm = document.querySelector("#addEvent");
addEventForm.addEventListener("submit", addEvent);

async function render() {
  await getEvents();
  renderEvents();
}
render();

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    console.log(json.data);
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

class Title {
  constructor(value) {
    this.value = value;
  }
}

class Description {
  constructor(value) {
    this.value = value;
  }
}

class Location {
  constructor(value) {
    this.value = value;
  }
}

async function addEvent(event) {
  event.preventDefault();

  const formData = {
    title: addEventForm.title.value,
    description: addEventForm.description.value,
    date: new Date(addEventForm.date.value),
    location: addEventForm.location.value,
  };

  try {
    await createEvent(formData);
  } catch (error) {
    console.error(error);
  }
}

async function createEvent({ title, description, date, location }) {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: title,
        description,
        date,
        location,
      }),
    });
    const json = await response.json();
    console.log("new event", json);

    if (json.error) {
      throw new Error(json.error.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function updateEvent(id, title, description, date, location) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, date, location }),
    });
    const json = await response.json();

    if (json.error) {
      throw new Error(json.message);
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    console.log(id);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Event could not be deleted.");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventsList.innerHTML = `<li> No events found.</li>`;
    return;
  }

  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("event");
    eventCard.innerHTML = `
    <h2> ${event.name}</h2>
    <p> Description: ${event.description}</p>
    <p> Date: ${event.date}</p>
    <p> Location: ${event.location}</p>
    `;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.append(deleteButton);

    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return eventCard;
  });
  eventsList.replaceChildren(...eventCards);
}
