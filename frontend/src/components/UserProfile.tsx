interface UserProfileProps {
  user: {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
    username?: string;
  };
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="user-profile">
      <div className="profile-header">
        {user.picture ? (
          <img
            src={user.picture}
            alt="Avatar"
            className="avatar"
          />
        ) : (
          <div className="avatar avatar-placeholder">
            {(user.name || user.email || "U").charAt(0).toUpperCase()}
          </div>
        )}
        <div className="profile-info">
          <h2>{user.name || user.username || "User"}</h2>
          <p className="email">
            {user.email}
            {user.email_verified && (
              <span className="badge badge-success" title="Email verified">✓ Verified</span>
            )}
          </p>
        </div>
      </div>

      <div className="claims-table">
        <h3>User Claims</h3>
        <table>
          <tbody>
            <tr>
              <td className="claim-key">Subject (sub)</td>
              <td className="claim-value">{user.sub || "—"}</td>
            </tr>
            <tr>
              <td className="claim-key">Email</td>
              <td className="claim-value">{user.email || "—"}</td>
            </tr>
            <tr>
              <td className="claim-key">Email Verified</td>
              <td className="claim-value">{user.email_verified ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <td className="claim-key">Name</td>
              <td className="claim-value">{user.name || "—"}</td>
            </tr>
            <tr>
              <td className="claim-key">Username</td>
              <td className="claim-value">{user.username || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
