import { useState } from "react";

export function Sidebar() {
  const [components, setComponents] = useState([
    { id: "1", name: "Component 1" },
    { id: "2", name: "Component 2" },
    { id: "3", name: "Component 3" }
  ]);

  return (
    <div className="sidebar">
      <h2>Components</h2>
      <ul>
        {components.map((component) => (
          <li key={component.id}>{component.name}</li>
        ))}
      </ul>
    </div>
  );
}