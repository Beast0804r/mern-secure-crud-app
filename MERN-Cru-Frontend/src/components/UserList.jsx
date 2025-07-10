import axios from "axios";
import '../css/App.css';
import { useRef } from 'react';

const UserList = ({ users, onUserDeleted, onEdit, totalPages, setPage, page, totalRecords, setSearch, search, fetchUsers }) => {
    const token = localStorage.getItem("token");

    const handleUser = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/delete/${id}`, {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onUserDeleted();
            } catch (err) {
                alert(err?.response?.data?.message || "Error deleting");
                onUserDeleted();
            }
        }
    };

    const searchTimeout = useRef(null);

    const hitAPI = (e) => {
        const value = e.target.value;
        setSearch(value); // Update search immediately for smooth typing

        // Clear previous timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Debounce only the API call
        searchTimeout.current = setTimeout(() => {
            setPage(1);
            fetchUsers(1, value);
        }, 500);
    };


    return (
        <>
            <div className="form-group">

                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={hitAPI}
                    style={{ padding: "8px", marginBottom: "10px", width: "300px" }}
                />
            </div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Sno</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={user._id}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className="action-btn edit-btn" onClick={() => onEdit(user)}>Edit</button>
                                <button className="action-btn delete-btn" onClick={() => handleUser(user._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={page === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <p className="text-center">
                Showing {(page - 1) * 5 + 1} – {Math.min(page * 5, totalRecords)} of {totalRecords}
            </p>
        </>
    );
};

export default UserList;
