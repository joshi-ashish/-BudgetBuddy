// import { useContext, useEffect } from "react";
// import { UserContext } from "../context/userContext";
// import { useNavigate } from "react-router-dom";
// import axiosInstance from "../utils/axiosInstance";
// import { API_PATHS } from "../utils/apiPath";

// export const useUserAuth = () => {
//     const { user, updateUser, clearUser } = useContext(UserContext);
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (user) return; 

//         const controller = new AbortController();

//         const fetchUserInfo = async () => {
//             try {
//                 const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
//                     signal: controller.signal
//                 });
//                 if (response.data) {
//                     updateUser(response.data);
//                 }
//             } catch (error) {
//                 if (!axiosInstance.isCancel(error)) {
//                     console.error("❌ Failed to fetch user info:", error);
//                     clearUser();
//                     navigate("/login");
//                 }
//             }
//         };

//         fetchUserInfo();

//         return () => controller.abort(); // Cleanup request on unmount
//     }, [updateUser, clearUser, navigate]);

// };
import { useContext, useEffect } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";
import axios from "axios"; // axios को सीधे इम्पोर्ट करें

export const useUserAuth = () => {
    const { user, updateUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) return;

        const controller = new AbortController();

        const fetchUserInfo = async () => {
            try {
                const response = await axiosInstance.get(API_PATHS.AUTH.GET_USER_INFO, {
                    signal: controller.signal
                });
                if (response.data) {
                    updateUser(response.data);
                }
            } catch (error) {
                if (!axios.isCancel(error)) { // यहां बदलाव किया गया
                    console.error("❌ Failed to fetch user info:", error);
                    clearUser();
                    navigate("/login");
                }
            }
        };

        fetchUserInfo();

        return () => controller.abort();
    }, [user, updateUser, clearUser, navigate]); // user को डिपेंडेंसी में जोड़ा

    return { user }; // हुक से user रिटर्न करें
};