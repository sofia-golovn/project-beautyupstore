import axios from "axios";

const axiosInstance = axios.create({
	baseURL: import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api",
	withCredentials: true,
});

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		if (error.response?.status === 401 && originalRequest.url.includes("/auth/refresh-token")) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				await axiosInstance.post("/auth/refresh-token");
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	}
);

export default axiosInstance;