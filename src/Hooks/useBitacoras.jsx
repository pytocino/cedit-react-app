import { useState, useEffect, useRef } from "react";
import { getBitacoras } from "../Services/BitacoraService";
import { getTags } from "../Services/PostService";
import { getUsers } from "../Services/UserService";
import { useAuth } from "../Contexts/authContext";

const useBitacoras = (currentPage, selectedTags, startDate, endDate) => {
    const [bitacoras, setBitacoras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [tags, setTags] = useState([]);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const prevPageBitacorasRef = useRef([]);
    const { auth } = useAuth();

    const arraysAreEqual = (array1, array2) => {
        return (
            array1.length === array2.length &&
            array1.every((item, index) =>
                item.title.rendered === array2[index].title.rendered &&
                item.content.rendered === array2[index].content.rendered
            )
        );
    };

    const loadBitacoras = async (page) => {
        try {
            setLoading(true);
            const tags = selectedTags.length > 0 ? selectedTags.join(",") : null;
            const [fetchedBitacoras, fetchedTags, fetchedUsers] = await Promise.all([
                getBitacoras(page, tags, startDate, endDate, auth.username, auth.password),
                getTags(auth.username, auth.password),
                getUsers(1, 10, auth.username, auth.password),
            ]);

            setUsers(fetchedUsers);
            setBitacoras(fetchedBitacoras);
            setTags(fetchedTags);
            setHasMore(
                fetchedBitacoras.length >= 10 &&
                !arraysAreEqual(fetchedBitacoras, prevPageBitacorasRef.current)
            );
            prevPageBitacorasRef.current = [...fetchedBitacoras];
        } catch (error) {
            console.error("Failed to load bitacoras:", error);
            setError("Failed to load bitacoras");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBitacoras(currentPage);
    }, [currentPage, selectedTags, startDate, endDate]);

    return { bitacoras, tags, users, loading, hasMore, error, loadBitacoras };
};

export default useBitacoras;
