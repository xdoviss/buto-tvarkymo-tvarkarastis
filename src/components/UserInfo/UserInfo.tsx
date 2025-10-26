import "./UserInfo.css";

const UserInfo: React.FC<{
  name?: string;
  onLogout: () => void;
}> = ({ name, onLogout }) => {
  return (
    <div className="user-info">
      <p>
        <strong>Butiokas:</strong> {name}
      </p>
      <button onClick={onLogout}>
        <p>Atsijungti</p>
      </button>
    </div>
  );
};

export default UserInfo;
