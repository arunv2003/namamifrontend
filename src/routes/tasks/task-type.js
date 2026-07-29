import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const TaskTypeRoute = {
    getAllTaskTypes: async ({ page, limit, search }) => {
        try {
            const result = await axios.get(`${baseURL}/api/v1/task-types/get-all`, {
                withCredentials: true,
                params: {
                    page,
                    limit,
                    search
                },
            });
            return result.data;
        } catch (error) {
            console.log(error);
            const errorData = error.response?.data || {
                statusCode: 500,
                message: error.message || "Failed to fetch task types",
                success: false,
            };
            toast.error(errorData.message || "Failed to fetch task types");
            return errorData;
        }
    },
};
