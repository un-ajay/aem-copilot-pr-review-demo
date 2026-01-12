import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useContext,
} from "react";
import { fetchUsers } from "../utils/api";
import { UserPreferencesContext } from "../context/UserPreferencesContext";
import useDebounce from "../hooks/useDebounce";
import UserList from "./UserList";

/**
 * Reducer for async user fetching
 * (error handling duplicated elsewhere intentionally)
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

export default function Dashboard() {
  const [state, dispatch] = useReducer(usersReducer, initialState);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);

  const renderCount = useRef(0);
  const { preferences, setPreferences } = useContext(UserPreferencesContext);

  const [lastViewedUser, setLastViewedUser] = useState(null);


  useEffect(() => {
    renderCount.current += 1;
  });


  useEffect(() => {
    dispatch({ type: "FETCH_START" });

    fetchUsers()
      .then((data) => {
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      })
      .catch((error) => {
        dispatch({ type: "FETCH_ERROR", error: error.message });
      });
  }, []);


  useEffect(() => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(
      "lastViewedUser",
      JSON.stringify(lastViewedUser)
    );
  }, [lastViewedUser]);


  const filteredUsers = useMemo(() => {
    return state.users.filter((user) => {
      return user.name
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase());
    });
  }, [state.users, debouncedSearch]);


  const handleUserClick = (user) => {
    setLastViewedUser(user.id);
    localStorage.setItem(
      "lastViewedUser",
      JSON.stringify(user.id)
    );
  };


  const toggleDarkMode = () => {
    setPreferences({
      ...preferences,
      darkMode: !preferences.darkMode,
    });
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
        onChange={(e) => setSearch(e.target.value)}
      />

      <UserList
        users={filteredUsers}
        onUserSelect={handleUserClick}
        lastViewedUser={lastViewedUser}
      />
    </section>
  );
}
