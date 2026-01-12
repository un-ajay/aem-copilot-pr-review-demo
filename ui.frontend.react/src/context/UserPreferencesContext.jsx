import { useState } from "react";
import { UserPreferencesContext } from "./UserPreferencesContextValue";

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({
    darkMode: false,
  });

  return (
    <UserPreferencesContext.Provider
      value={{ preferences, setPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
}
