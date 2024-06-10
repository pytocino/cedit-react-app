import { useState, useEffect, useRef } from "react";
import { getUsers, deleteUser, getRoles } from "../Services/UserService";
import { getUserRoles } from "../Services/UserRoles";
import { useAuth } from "../Contexts/authContext";

const useUsers = (currentPage, selectedRole) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userRoles, setUserRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);
    const { auth } = useAuth();
    const allUsersRef = useRef([]);

    const loadUsers = async () => {
        try {
            setLoading(true);
            const fetchedUsers = await getUsers(currentPage, 10, auth.username, auth.password);
            const fetchedUserRoles = await getUserRoles(auth.username, auth.password);
            const fetchedRoles = await getRoles(auth.username, auth.password);

            allUsersRef.current = fetchedUsers;

            setUserRoles(fetchedUserRoles);
            setRoles(fetchedRoles);

            const filteredUsers = filterUsersByRole(fetchedUsers, selectedRole);
            setUsers(filteredUsers);
            setHasMore(fetchedUsers.length >= 10);
        } catch (error) {
            console.error("Failed to load users:", error);
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, [currentPage, selectedRole]);

    const filterUsersByRole = (users, role) => {
        if (!role) return users;
        const userIdsWithSelectedRole = userRoles
            .filter((userRole) => userRole.roles.includes(role))
            .map((userRole) => userRole.user_id);
        return users.filter((user) => userIdsWithSelectedRole.includes(user.id));
    };

    const handleDeleteUser = async (userId) => {
        try {
            const reassignId = prompt("Enter the ID to reassign the user's data to:", 1);
            await deleteUser(userId, reassignId, auth.username, auth.password);
            loadUsers();
        } catch (error) {
            console.error("Failed to delete user:", error);
            setError("Failed to delete user");
        }
    };

    return { users, roles, loading, hasMore, error, handleDeleteUser };
};

export default useUsers;
