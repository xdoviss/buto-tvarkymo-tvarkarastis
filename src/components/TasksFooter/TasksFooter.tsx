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
        <p>🎉 Namai tvarkingi, yippie!</p>
      ) : (
        <p>
          📝 Liko sutvarkyti {unchecked}/{total}
        </p>
      )}
    </footer>
  );
};
