import { useState, useEffect } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import axios from "axios";

import Login from "./components/admin/Login";

import Register from "./components/admin/Register"
import { jwtDecode } from "jwt-decode";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import './css/App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  const [loading, setLoading] = useState(false);
  const [succMsg, setSuccMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const [isLogin, setIsLogin] = useState(false);
  const [page, setPage] = useState('login');

  const [authToken, setAuthToken] = useState(localStorage.getItem("token") || '');
  const [loggedInUser, setLoggedInUser] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (err) {
      console.error("Invalid JSON in localStorage 'user':", err);
      return null;
    }
  });

  const [pagiantePage, setPaginatePage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
          setAuthToken(token);
          setIsLogin(true);
        } else {
          logout();
        }
      } catch (err) {
        logout();
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken('');
    setIsLogin(false);

    localStorage.removeItem("user");
    setLoggedInUser(null);
  };


  const fetchUsers = async (pageNumber = 1, searchTerm = search) => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/users/list`, {
        params: { page: pageNumber, search: searchTerm },
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });
      setUsers(res.data.data);
      setTotalPages(res.data.totalPages);
      setPaginatePage(res.data.currentPage);
      setTotalRecords(res.data.totalRecords);
    } catch (err) {
      console.error("Fetch users failed", err);
      if (err.response?.status === 401 || err.response?.status === 403) logout();
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (isLogin && authToken) {
        fetchUsers(pagiantePage, search);
      }
    }, 500); // 500ms delay


    const handleArrowKeys = (e) => {

      if (e.key === "ArrowRight" && e.ctrlKey) {
        if (pagiantePage !== totalPages) {
          setPaginatePage(totalPages);
        } else {
          toast.info("You’re already on the last page");
        }
      }
      // Jump to first page
      else if (e.key === "ArrowLeft" && e.ctrlKey) {
        if (pagiantePage !== 1) {
          setPaginatePage(1);
        } else {
          toast.info("You’re already on the first page");
        }
      }
      else if (e.key === "ArrowRight") {
        if (pagiantePage < totalPages) {
          setPaginatePage((prev) => prev + 1);
        } else {
          toast.warning("No more next pages");
        }
      }
      // Normal previous
      else if (e.key === "ArrowLeft") {
        if (pagiantePage > 1) {
          setPaginatePage((prev) => prev - 1);
        } else {
          toast.warning("You're already at the first page");
        }
      }
    };

    window.addEventListener("keydown", handleArrowKeys);

    return () => {
      window.removeEventListener("keydown", handleArrowKeys);
      clearTimeout(delayDebounce);
    };


  }, [isLogin, authToken, pagiantePage, totalPages, search]);

  const handleUserAdded = async () => {
    await fetchUsers();
  };

  const handleEdit = (user) => {
    setEditUser(user);
  }

  const handleUpdateComplete = async () => {
    setEditUser(null);
    await fetchUsers();
  }

  const handleLoginSuccess = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user || {}));
    setAuthToken(token);
    setLoggedInUser(user);
    setIsLogin(true);
  };

  return (
    <div className="container">
      <ToastContainer position="bottom-right" autoClose={2000} />
      <h1>MERN CRUD</h1>

      {isLogin && (
        <div className="top-bar">
          <div className="user-info">
            <img
              src={`http://localhost:5000/uploads/${loggedInUser?.file}`}
              alt="Uploaded"
              className="profile-img"
            />
            <span className="welcome-text">Welcome, {loggedInUser?.name}</span>
          </div>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </div>
      )}

      {succMsg && <p className="success">{succMsg}</p>}
      {errMsg && <p className="error">
        {typeof errMsg === 'string' ? errMsg : JSON.stringify(errMsg)}
      </p>}

      {!isLogin ? (
        page === "login" ? (
          <>
            <Login
              setErrMsg={setErrMsg}
              setSuccMsg={setSuccMsg}
              onTokenReceive={handleLoginSuccess}
            />
            <p>
              Don’t have an account?{" "}
              <span className="link-text" onClick={() => setPage('register')}>
                Register
              </span>
            </p>
          </>
        ) : (
          <>
            <Register
              onRegister={handleUserAdded}
              setErrMsg={setErrMsg}
              setSuccMsg={setSuccMsg}
              setPage={setPage}
            />
            <p>
              Already have an account?{" "}
              <span className="link-text" onClick={() => setPage('login')}>
                Login
              </span>
            </p>
          </>
        )
      ) : (
        <>
          <AddUser
            onUserAdded={handleUserAdded}
            editUser={editUser}
            onUpdateComplete={handleUpdateComplete}
            setLoading={setLoading}
            loading={loading}
            setErrMsg={setErrMsg}
            setSuccMsg={setSuccMsg}
          />

          {loading && <p>Loading...</p>}

          <UserList
            users={users}
            onUserDeleted={handleUserAdded}
            onEdit={handleEdit}
            totalPages={totalPages}
            setPage={setPaginatePage}
            page={pagiantePage}
            totalRecords={totalRecords}
            setSearch={setSearch}
            search={search}
            fetchUsers={fetchUsers}
          />
        </>
      )}
    </div>

  );
};

export default App;
