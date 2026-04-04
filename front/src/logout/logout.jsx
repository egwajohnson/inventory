import axios from "axios";

async function Logout() {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      await axios.post(
        "http://localhost:5000/api/v1/user/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
    }
  } catch (error) {
    console.warn("Logout API failed:", error?.response?.data || error.message);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.replace("/");
  }
}

export default Logout;
