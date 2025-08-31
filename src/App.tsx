import { useState } from "react";
import Dropdown from "./components/dropdown/dropdown";
import type { Option } from "./components/dropdown/dropdown";
import Modal from "./components/modal/modal"; 
import "./App.css";

const options: Option[] = [
  { value: "all",    label: "All tasks" },
  { value: "active", label: "Active" },
  { value: "done",   label: "Completed" },
];

export default function App() {
  const [filter, setFilter] = useState<Option | null>(null);
  const [openModal, setOpenModal] = useState(false);

  return (
    <div className="app-shell">
      <div className="card stack">
        <h1>Dropdown Demo</h1>

        <Dropdown
          label="Filter"
          placeholder="Choose a filter"
          options={options}
          value={filter}
          onChange={setFilter}
          clearable
        />

        <p className="subtle">
          {filter ? <>Selected: <strong>{filter.label}</strong></> : "No selection yet"}
        </p>

        <button className="btn" onClick={() => setOpenModal(true)}>This is an example of a Modal.</button>
      </div>

      {/* مودال */}
      <Modal
        open={openModal}
        title="Summary"
        onClose={() => setOpenModal(false)}
      >
        <p style={{ margin: 0 }}>
          {filter ? (
            <>Current filter is <strong>{filter.label}</strong>.</>
          ) : (
            "No filter selected."
          )}
        </p>
      </Modal>
    </div>
  );
}
