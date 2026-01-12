import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useContext,
} from "react";
import { fetchUsers } from "../utils/api";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import useLocalStorage from "../hooks/useLocalStorage";
import useDebounce from "../hooks/useDebounce";
import UserList from "./UserList";

/**
 * Reducer for async user fetching
 */
function usersReducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.error };
    default:
      return state;
  }
}

const initialState = {
  loading: false,
  users: [],
  error: null,
};

/**
 * Dashboard
 * - intentionally large
 * - demonstrates many hooks & patterns
 */
export default function Dashboard() {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const renderCount = useRef(0);
  const { preferences, setPreferences } = useContext(UserPreferencesContext);

  const [lastViewedUser, setLastViewedUser] = useLocalStorage(
    "lastViewedUser",
    null
  );

  renderCount.current += 1;

  /**
   * Fetch users
   */
  const loadUsers = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await fetchUsers();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", error: err.message });
    }
  }, []);

  /**
   * Initial load
   */
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  /**
   * Persist preferences to localStorage
   */
  useEffect(() => {
    localStorage.setItem("userPreferences", JSON.stringify(preferences));
  }, [preferences]);

  /**
   * Derived filtered users
   */
  const filteredUsers = useMemo(() => {
    return state.users.filter((user) =>
      user.name.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [state.users, debouncedSearch]);

  /**
   * Event handlers
   */
  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const handleUserSelect = useCallback(
    (user) => {
      setLastViewedUser(user.id);
    },
    [setLastViewedUser]
  );

  const toggleDarkMode = () => {
    setPreferences((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  if (state.loading) {
    return <p>Loading users…</p>;
  }

  if (state.error) {
    return <p role="alert">Error: {state.error}</p>;
  }

  return (
    <section>
      <header>
        <h1>User Dashboard</h1>
        <button onClick={toggleDarkMode}>
          Toggle {preferences.darkMode ? "Light" : "Dark"} Mode
        </button>
      </header>

      <p>Render count: {renderCount.current}</p>

      <input
        type="search"
        placeholder="Search users"
        value={search}
        onChange={handleSearchChange}
      />

      <UserList
        users={filteredUsers}
        onUserSelect={handleUserSelect}
        lastViewedUser={lastViewedUser}
      />
    </section>
  );
}
