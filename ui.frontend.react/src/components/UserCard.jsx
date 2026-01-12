import { useCallback } from "react";

export default function UserCard({ user, isLastViewed, onSelect }) {
  const handleClick = useCallback(() => {
    onSelect(user);
  }, [onSelect, user]);

  return (
    <li
      onClick={handleClick}
      style={{
        cursor: "pointer",
        fontWeight: isLastViewed ? "bold" : "normal",
      }}
    >
      {user.name} ({user.email})
    </li>
  );
}
