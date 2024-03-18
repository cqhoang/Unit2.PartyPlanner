const API_URL =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2401-FTB-ET-WEB-AM/events";

const state = {
  events: [],
};

// Select <ul> element with the ID 'events'
const eventsList = document.querySelector("#events");

// Select form element with the ID 'addEvent'
const addEventForm = document.querySelector("#addEvent");
// Add event listener to form for 'submit' event, calling addEvent function
addEventForm.addEventListener("submit", addEvent);

// Create a function to render events on page
async function render() {
  // fetch events from API
  await getEvents();
  // render events on page
  renderEvents();
}

// initial render of events when page loads
render();

// create a function to fetch events from API
async function getEvents() {
  try {
    // this fetches data from API_URL
    const response = await fetch(API_URL);
    // parses the JSON response
    const json = await response.json();
    // log data
    console.log(json.data);
    // updates state with fetched events
    state.events = json.data;
  } catch (error) {
    // log errors
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
// create event handler function to add a new event
async function addEvent(event) {
  // prevent default form submission behavior
  event.preventDefault();
  // get values from form and pass them into createEvent
  const formData = {
    title: addEventForm.title.value,
    description: addEventForm.description.value,
    date: new Date(addEventForm.date.value),
    location: addEventForm.location.value,
  };

  try {
    // create a new event using form data
    await createEvent(formData);
  } catch (error) {
    // log errors during createEvent
    console.error(error);
  }
}

// Create a function to create a new event
async function createEvent({ title, description, date, location }) {
  // make POST request to API to create a new event
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
    // parse JSON response
    const json = await response.json();
    // log response
    console.log("new event", json);
    // if there is an error, throw an error
    if (json.error) {
      throw new Error(json.error.message);
    }
    // re-render events on page after createEvent
    render();
  } catch (error) {
    // log errors during createEvent
    console.error(error);
  }
}

async function updateEvent(id, title, description, date, location) {
  // Ask API to update existing event and rerender
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
  // ask API to delete event and rerender
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

// create a function to render events on page
function renderEvents() {
  // if there are no events, return 'no events found'
  if (!state.events.length) {
    eventsList.innerHTML = `<li> No events found.</li>`;
    return;
  }

  // map over events and create html element to display each event
  const eventCards = state.events.map((event) => {
    const eventCard = document.createElement("li");
    eventCard.classList.add("event");
    eventCard.innerHTML = `
    <h2> ${event.name}</h2>
    <p> Description: ${event.description}</p>
    <p> Date: ${event.date}</p>
    <p> Location: ${event.location}</p>
    `;
    // create delete button for each event
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete Event";
    eventCard.append(deleteButton);
    // add event listener to delete button to delete event
    deleteButton.addEventListener("click", () => deleteEvent(event.id));

    return eventCard;
  });
  // replace events list with new events
  eventsList.replaceChildren(...eventCards);
}
