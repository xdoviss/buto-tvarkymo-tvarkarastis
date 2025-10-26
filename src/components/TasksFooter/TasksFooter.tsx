import "./TasksFooter.css";

interface TasksFooterProps {
  total: number;
  unchecked: number;
}

export const TasksFooter: React.FC<TasksFooterProps> = ({
  total,
  unchecked,
}) => {
  return (
    <footer className="tasks-footer">
      {unchecked === 0 ? (
        <button>🎉 Pranešti apie tvarkymo pabaigą</button>
      ) : (
        <p>
          📝 Liko sutvarkyti {unchecked}/{total}
        </p>
      )}
    </footer>
  );
};
