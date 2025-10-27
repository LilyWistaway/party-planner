const API =
  "https://fsa-crud-2aa9294fe819.herokuapp.com/api/2509-FTB-CT-WEB-PT";

const state = {
  events: [],
  selectedId: null,
  selected: null,
  error: null,
  loading: false,
};

async function fetchEvents() {
  try {
    state.loading = true;
    state.error = null;

    const res = await fetch(`${API}/events`);
    if (!res.ok) {
      throw new Error("GET /events failed: " + res.status);
    }

    const json = await res.json();

    if (json && Array.isArray(json.data)) {
      state.events = json.data;
    } else {
      state.events = [];
    }
  } catch (err) {
    if (err && err.message) {
      state.error = err.message;
    } else {
      state.error = String(err);
    }
    state.events = [];
  } finally {
    state.loading = false;
  }
}

async function fetchEventById(id) {
  try {
    state.error = null;

    const res = await fetch(`${API}/events/${id}`);
    if (!res.ok) {
      throw new Error("GET /events/" + id + " failed: " + res.status);
    }

    const json = await res.json();

    if (json && json.data) {
      state.selected = json.data;
    } else {
      state.selected = null;
    }
  } catch (err) {
    if (err && err.message) {
      state.error = err.message;
    } else {
      state.error = String(err);
    }
    state.selected = null;
  }
}

function render() {
  document.body.innerHTML = "";

  const h1 = document.createElement("h1");
  h1.textContent = "Party Planner";
  document.body.appendChild(h1);

  const status = document.createElement("p");
  if (state.error) {
    status.textContent = "Error: " + state.error;
  } else if (state.loading) {
    status.textContent = "Loading…";
  } else {
    status.textContent = "Loaded " + state.events.length + " events.";
  }
  document.body.appendChild(status);

  if (state.loading || state.error) {
    return;
  }

  const layout = document.createElement("div");
  layout.id = "layout";
  document.body.appendChild(layout);

  const left = document.createElement("section");
  const leftTitle = document.createElement("h2");
  leftTitle.textContent = "Upcoming Parties";
  left.appendChild(leftTitle);

  const list = document.createElement("ul");
  for (let i = 0; i < state.events.length; i++) {
    const ev = state.events[i];
    const li = document.createElement("li");
    li.textContent = ev.name;

    if (state.selectedId === ev.id) {
      li.classList.add("selected");
    }

    li.addEventListener("click", async function () {
      if (state.selectedId === ev.id && state.selected) {
        return;
      }
      state.selectedId = ev.id;
      await fetchEventById(ev.id);
      render();
    });

    list.appendChild(li);
  }
  left.appendChild(list);
  layout.appendChild(left);

  const right = document.createElement("section");
  const rightTitle = document.createElement("h2");
  rightTitle.textContent = "Party Details";
  right.appendChild(rightTitle);

  if (state.selected) {
    const d = state.selected;

    const h3 = document.createElement("h3");
    h3.textContent = d.name + " #" + d.id;

    const pDate = document.createElement("p");
    if (d.date) {
      pDate.textContent = new Date(d.date).toLocaleDateString();
    } else {
      pDate.textContent = "";
    }

    const pLoc = document.createElement("p");
    if (d.location) {
      pLoc.textContent = d.location;
      pLoc.style.fontStyle = "italic";
    } else {
      pLoc.textContent = "";
    }

    const pDesc = document.createElement("p");
    if (d.description) {
      pDesc.textContent = d.description;
    } else {
      pDesc.textContent = "";
    }

    right.appendChild(h3);
    right.appendChild(pDate);
    right.appendChild(pLoc);
    right.appendChild(pDesc);
  } else {
    const hint = document.createElement("p");
    hint.textContent = "Select a party to see its details.";
    right.appendChild(hint);
  }

  layout.appendChild(right);
}

async function init() {
  render();
  await fetchEvents();
  render();
}

init();
