import axios from "axios";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./EditUser.style.css";

export default function EditUser() {
    const [users, setUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [countries, setCountries] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [oldUser, setOldUser] = useState(null);
    const [newUser, setNewUser] = useState(null);

    useEffect(() => {
        const savedUsers = localStorage.getItem("users");
        if (savedUsers) {
            try {
                const parsedUsers = JSON.parse(savedUsers);
                setUsers(parsedUsers);
            } catch {
                loadUsersFromFile();
            }
        } else {
            loadUsersFromFile();
        }

        axios.get("data/Departments.json").then((res) => {
            const departmentsWithIds = res.data.map((d) => ({
                ...d,
                id: uuidv4(),
            }));
            setDepartments(departmentsWithIds);
        });

        axios.get("data/Statuses.json").then((res) => {
            const statusesWithIds = res.data.map((s) => ({
                ...s,
                id: uuidv4(),
            }));
            setStatuses(statusesWithIds);
        });

        axios.get("data/Countries.json").then((res) => {
            const countriesWithIds = res.data.map((c) => ({
                ...c,
                id: uuidv4(),
            }));
            setCountries(countriesWithIds);
        });
    }, []);

    function loadUsersFromFile() {
        axios.get("data/Users.json").then((res) => {
            const usersWithIds = res.data.map((user) => ({
                ...user,
                id: uuidv4(),
            }));
            setUsers(usersWithIds);
        });
    }

    const handleSelectUser = (e) => {
        const selectedId = e.target.value;
        const selectedUser = users.find((user) => user.id === selectedId);
        if (selectedUser) {
            setOldUser(selectedUser);
            setNewUser({ ...selectedUser });
        } else {
            setOldUser(null);
            setNewUser(null);
        }
    };

    const handleUndo = () => {
        if (oldUser) {
            setNewUser({ ...oldUser });
        }
    };

    const handleSave = () => {
        if (!newUser) return;

        const updatedUsers = users.map((user) =>
            user.id === newUser.id ? newUser : user
        );
        setUsers(updatedUsers);
        setOldUser({ ...newUser });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        alert("User saved successfully!");
    };

    const isEqualUsers = (u1, u2) => {
        if (!u1 || !u2) return false;
        return (
            u1.name === u2.name &&
            u1.status?.value === u2.status?.value &&
            u1.department?.value === u2.department?.value &&
            u1.country?.value === u2.country?.value
        );
    };

    const undoDisabled = !newUser || !oldUser || isEqualUsers(newUser, oldUser);

    return (
        <div className="main-container">
            <h1>EDIT USER</h1>

            <div className="select-container">
                <label htmlFor="user">Select User</label>
                <select
                    id="user"
                    className="user-select"
                    defaultValue=""
                    onChange={handleSelectUser}
                >
                    <option value="" disabled>
                        Select User
                    </option>
                    {users.map((user) => (
                        <option key={user.id} value={user.id}>
                            {user.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="redact-selectors-container">
                {/* Name */}
                <div className="select-container">
                    <label htmlFor="name">Full Name</label>
                    <input
                        type="text"
                        id="name"
                        disabled={!newUser}
                        value={newUser?.name || ""}
                        onChange={(e) =>
                            setNewUser((prev) => ({ ...prev, name: e.target.value }))
                        }
                    />
                </div>

                {/* Status */}
                <div className="select-container">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        disabled={!newUser}
                        value={newUser?.status?.value || ""}
                        onChange={(e) => {
                            const selected = statuses.find(
                                (s) => s.value === e.target.value
                            );
                            setNewUser((prev) => ({ ...prev, status: selected }));
                        }}
                    >
                        <option value="" disabled>
                            Select status
                        </option>
                        {statuses.map((status) => (
                            <option key={status.id} value={status.value}>
                                {status.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Department */}
                <div className="select-container">
                    <label htmlFor="department">Department</label>
                    <select
                        id="department"
                        disabled={!newUser}
                        value={newUser?.department?.value || ""}
                        onChange={(e) => {
                            const selected = departments.find(
                                (d) => d.value === e.target.value
                            );
                            setNewUser((prev) => ({ ...prev, department: selected }));
                        }}
                    >
                        <option value="" disabled>
                            Select department
                        </option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.value}>
                                {dept.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country */}
                <div className="select-container">
                    <label htmlFor="country">Country</label>
                    <select
                        id="country"
                        disabled={!newUser}
                        value={newUser?.country?.value || ""}
                        onChange={(e) => {
                            const selected = countries.find(
                                (c) => c.value === e.target.value
                            );
                            setNewUser((prev) => ({ ...prev, country: selected }));
                        }}
                    >
                        <option value="" disabled>
                            Select country
                        </option>
                        {countries.map((country) => (
                            <option key={country.id} value={country.value}>
                                {country.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="buttons-container">
                <button
                    onClick={handleUndo}
                    disabled={undoDisabled}
                    className="btn undo-btn"
                    type="button"
                >
                    UNDO
                </button>
                <button
                    onClick={handleSave}
                    disabled={!newUser}
                    className="btn save-btn"
                    type="button"
                >
                    SAVE
                </button>
            </div>
        </div>
    );
}
