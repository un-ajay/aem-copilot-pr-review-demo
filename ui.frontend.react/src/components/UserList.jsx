import { memo } from "react";
import UserCard from "./UserCard";

function UserList({ users, onUserSelect, lastViewedUser }) {
  if (!users.length) {
    return <p>No users found.</p>;
  }

  return (
    <ul>
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          isLastViewed={user.id === lastViewedUser}
          onSelect={onUserSelect}
        />
      ))}
    </ul>
  );
}

export default memo(UserList);
