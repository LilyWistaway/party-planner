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
      throw new Error(`GET /events failed: ${res.status}`);
    }

    const json = await res.json();

    if (json && Array.isArray(json.data)) {
      state.events = json.data;
    } else {
      state.events = [];
    }
  } catch (err) {
    state.error = err && err.message ? err.message : String(err);
    state.events = [];
  } finally {
    state.loading = false;
  }
}

// ===== Data: fetch one by id =====
async function fetchEventById(id) {
  try {
    state.error = null;

    const res = await fetch(`${API}/events/${id}`);
    if (!res.ok) {
      throw new Error(`GET /events/${id} failed: ${res.status}`);
    }

    const json = await res.json();

    if (json && json.data) {
      state.selected = json.data;
    } else {
      state.selected = null;
    }
  } catch (err) {
    state.error = err && err.message ? err.message : String(err);
    state.selected = null;
  }
}

// ===== Render =====
function render() {
  // wipe
  document.body.innerHTML = "";

  // title
  const h1 = document.createElement("h1");
  h1.textContent = "Party Planner";
  document.body.appendChild(h1);

  // status
  const status = document.createElement("p");
  if (state.error) {
    status.textContent = `Error: ${state.error}`;
  } else if (state.loading) {
    status.textContent = "Loading…";
  } else {
    status.textContent = `Loaded ${state.events.length} events.`;
  }
  document.body.appendChild(status);

  // if loading or error, stop here
  if (state.loading || state.error) {
    return;
  }

  // layout
  const layout = document.createElement("div");
  layout.style.display = "grid";
  layout.style.gridTemplateColumns = "1fr 2fr";
  layout.style.gap = "16px";
  document.body.appendChild(layout);

  // LEFT: list
  const left = document.createElement("section");
  const leftTitle = document.createElement("h2");
  leftTitle.textContent = "Upcoming Parties";
  left.appendChild(leftTitle);

  const list = document.createElement("ul");

  for (let i = 0; i < state.events.length; i++) {
    const ev = state.events[i];
    const li = document.createElement("li");
    li.textContent = ev.name;

    // simple selected styling (extension-friendly)
    if (state.selectedId === ev.id) {
      li.style.fontStyle = "italic";
      li.style.fontWeight = "600";
    }

    li.addEventListener("click", async () => {
      if (state.selectedId === ev.id && state.selected) {
        return; // already selected and loaded
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
    const details = document.createElement("div");

    const dateText = d.date ? new Date(d.date).toLocaleDateString() : "";
    const locationText = d.location ? d.location : "";
    const descriptionText = d.description ? d.description : "";

    details.innerHTML = `
      <h3>${d.name} #${d.id}</h3>
      <p>${dateText}</p>
      <p><em>${locationText}</em></p>
      <p>${descriptionText}</p>
    `;
    right.appendChild(details);
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
