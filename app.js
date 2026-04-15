const SUPABASE_URL = "https://fdcuyqjompbarlovfixm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_LKmMBMOkC5vLBoU_Gz719Q_0b645I7X";

const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const listEl = document.getElementById("list");
const addBtn = document.getElementById("addBtn");
const itemInput = document.getElementById("itemInput");
const nameInput = document.getElementById("nameInput");

async function loadItems() {
  const { data, error } = await client
    .from("items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  listEl.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");

    const left = document.createElement("span");
    left.textContent = `${item.text} (${item.added_by || "ohne Name"})`;
    if (item.done) left.classList.add("done");

    const actions = document.createElement("div");

    const doneBtn = document.createElement("button");
    doneBtn.textContent = item.done ? "Offen" : "Erledigt";
    doneBtn.onclick = async () => {
      await client.from("items").update({ done: !item.done }).eq("id", item.id);
      loadItems();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Löschen";
    deleteBtn.onclick = async () => {
      await client.from("items").delete().eq("id", item.id);
      loadItems();
    };

    actions.appendChild(doneBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(left);
    li.appendChild(actions);
    listEl.appendChild(li);
  });
}

addBtn.onclick = async () => {
  const text = itemInput.value.trim();
  const addedBy = nameInput.value.trim();

  if (!text) return;

  const { error } = await client.from("items").insert([
    {
      text,
      added_by: addedBy || "Unbekannt",
      done: false
    }
  ]);

  if (error) {
    console.error(error);
    return;
  }

  itemInput.value = "";
  loadItems();
};

loadItems();