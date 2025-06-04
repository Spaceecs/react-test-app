import './User.styles.css'
import {useEffect, useState} from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { FaTrash } from 'react-icons/fa';

export default function User(){
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [countries, setCountries] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [filters, setFilters] = useState({
        status: null,
        department: null,
        country: null,
    });
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [newUser, setNewUser] = useState({
        name: "",
        status: "",
        department: "",
        country: ""
    });


    useEffect(() => {
        const saved = localStorage.getItem("users");
        if (saved) {
            setUsers(JSON.parse(saved));
        } else {
            axios
                .get("/data/Users.json")
                .then((res) => {
                    setUsers(res.data);
                    localStorage.setItem("users", JSON.stringify(res.data));
                })
                .catch((err) => {
                    console.error("Помилка завантаження користувачів:", err);
                });
        }
        axios
            .get("data/Departments.json")
            .then((res) => {
                const departmentsWithIds = res.data.map((d) => ({
                    ...d,
                    id: uuidv4(),
                }));
                setDepartments(departmentsWithIds);
            });

        axios
            .get("data/Statuses.json")
            .then((res) => {
                const statusesWithIds = res.data.map((s) => ({
                    ...s,
                    id: uuidv4(),
                }));
                setStatuses(statusesWithIds);
            });

        axios
            .get("data/Countries.json")
            .then((res) => {
                const countriesWithIds = res.data.map((c) => ({
                    ...c,
                    id: uuidv4(),
                }));
                setCountries(countriesWithIds);
            });
    }, []);

    useEffect(() => {
        const filtered = users.filter(user => {
            const matchStatus = !filters.status || user.status?.value === filters.status;
            const matchDept = !filters.department || user.department?.value === filters.department;
            const matchCountry = !filters.country || user.country?.value === filters.country;
            return matchStatus && matchDept && matchCountry;
        });
        setFilteredUsers(filtered);
    }, [filters, users]);

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({
            ...prev,
            [field]: value === "" ? null : value
        }));
    };

    const handleDeleteUser = (userId) => {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    return(
        <div className={'main-container'}>
            <div>
                <h1>USERS</h1>
            </div>
            <div className={'filter-main-container'}>
                <div className={'filter-container'}>
                    <div className={'select-container'}>
                        <label htmlFor="country">Select country filter</label>
                        <select
                            id="country"
                            value={filters.country || ""}
                            onChange={(e) => handleFilterChange("country", e.target.value)}
                        >
                            <option value="">All countries</option>
                            {countries.map((country) => (
                                <option key={country.id} value={country.value}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={'select-container'}>
                        <label htmlFor="status">Select status filter</label>
                        <select
                            id="status"
                            value={filters.status || ""}
                            onChange={(e) => handleFilterChange("status", e.target.value)}
                        >
                            <option value="">All statuses</option>
                            {statuses.map((status) => (
                                <option key={status.id} value={status.value}>
                                    {status.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={'select-container'}>
                        <label htmlFor="department">Select department filter</label>
                        <select
                            id="department"
                            value={filters.department || ""}
                            onChange={(e) => handleFilterChange("department", e.target.value)}
                        >
                            <option value="">All departments</option>
                            {departments.map((department) => (
                                <option key={department.id} value={department.value}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className={'buttons-container'}>
                        <button className={'btn'} onClick={() => setFilters({status: null, department: null, country: null})} type="button">
                            <FaTrash />
                        </button>
                    </div>
                    <div className={'buttons-container'}>
                        <button className={'btn'} onClick={() => setShowAddPopup(true)}>
                            Add User
                        </button>
                    </div>
                </div>
            </div>
            <div className={'users-container'}>
                <table className="users-table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Department</th>
                        <th>Country</th>
                        <th>

                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>{user.name}</td>
                            <td>{user.status?.name || "N/A"}</td>
                            <td>{user.department?.name || "N/A"}</td>
                            <td>{user.country?.name || "N/A"}</td>
                            <td>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="delete-button"
                                    title="Delete user">
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            {showAddPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <h3>Add New User</h3>
                        <div className={'popup-field'}>
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                            />
                            <select
                                value={newUser.status}
                                onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                            >
                                <option value="">Select status</option>
                                {statuses.map(status => (
                                    <option key={status.id} value={status.value}>{status.name}</option>
                                ))}
                            </select>

                            <select
                                value={newUser.department}
                                onChange={(e) => setNewUser({...newUser, department: e.target.value})}
                            >
                                <option value="">Select department</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.value}>{dept.name}</option>
                                ))}
                            </select>

                            <select
                                value={newUser.country}
                                onChange={(e) => setNewUser({...newUser, country: e.target.value})}
                            >
                                <option value="">Select country</option>
                                {countries.map(c => (
                                    <option key={c.id} value={c.value}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="popup-buttons">
                            <button onClick={() => {
                                if (!newUser.name || !newUser.status || !newUser.department || !newUser.country) {
                                    alert("Заповніть усі поля!");
                                    return;
                                }
                                const statusObj = statuses.find(s => s.value === newUser.status);
                                const departmentObj = departments.find(d => d.value === newUser.department);
                                const countryObj = countries.find(c => c.value === newUser.country);

                                const userToAdd = {
                                    id: uuidv4(),
                                    name: newUser.name,
                                    status: statusObj,
                                    department: departmentObj,
                                    country: countryObj
                                };

                                const updatedUsers = [...users, userToAdd];
                                setUsers(updatedUsers);
                                localStorage.setItem("users", JSON.stringify(updatedUsers));
                                setNewUser({name: "", status: "", department: "", country: ""});
                                setShowAddPopup(false);
                            }}>
                                Save
                            </button>
                            <button onClick={() => setShowAddPopup(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
