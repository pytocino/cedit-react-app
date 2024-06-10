import { useState, useEffect, useRef } from "react";
import { getPosts } from "../Services/PostService";
import { getUsers } from "../Services/UserService";
import { useAuth } from "../Contexts/authContext";

const usePosts = (currentPage) => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const prevPagePostsRef = useRef([]);
    const { auth } = useAuth();

    const arraysAreEqual = (array1, array2) => {
        return (
            array1.length === array2.length &&
            array1.every((post, index) =>
                post.title.rendered === array2[index].title.rendered &&
                post.content.rendered === array2[index].content.rendered
            )
        );
    };

    const loadPosts = async (page) => {
        try {
            setLoading(true);
            const [fetchedPosts, fetchedUsers] = await Promise.all([
                getPosts(page, auth.username, auth.password),
                getUsers(1, 10, auth.username, auth.password),
            ]);

            setUsers(fetchedUsers);
            setPosts(fetchedPosts);
            setHasMore(
                fetchedPosts.length >= 10 &&
                !arraysAreEqual(fetchedPosts, prevPagePostsRef.current)
            );
            prevPagePostsRef.current = [...fetchedPosts];
        } catch (error) {
            console.error("Failed to load posts:", error);
            setError("Failed to load posts");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts(currentPage);
    }, [currentPage]);

    return { posts, users, loading, hasMore, error, loadPosts };
};

export default usePosts;
