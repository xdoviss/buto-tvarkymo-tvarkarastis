import { Checklist } from "../types";

interface ChecklistSectionProps {
  checklist: Checklist;
  onCheck: (category: string, item: string) => void;
  onToggleExpand: (category: string) => void;
}

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  checklist,
  onCheck,
  onToggleExpand,
}) => {
  return (
    <section className="checklist-section">
      <h3>Tvarkymo sąrašas</h3>
      <ul className="categories-list">
        {Object.entries(checklist).map(([category, { items, expanded }]) => (
          <li key={category} className="category-item">
            <div
              className="category-header"
              onClick={() => onToggleExpand(category)}
            >
              <span style={{ textTransform: "capitalize" }}>{category}</span>
              <span className="expand-icon">{expanded ? "▼" : "▶"}</span>
            </div>
            {expanded && (
              <ul className="items-list">
                {Object.entries(items).map(([item, checked]) => (
                  <li key={item}>
                    <label>
                      <span>{item}</span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onCheck(category, item)}
                      />
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};
