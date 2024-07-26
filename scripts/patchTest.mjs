import axios from "axios";

const updateService = async () => {
  try {
    const response = await axios.get(
      "https://apiv3.lunni.io/services/7",
      {
        is_completed: 1,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer JWT_TOKEN",
        },
      },
    );
    console.log("Update successful:", response.data);
  } catch (error) {
    console.error(
      "Error updating service:",
      error.response ? error.response.data : error.message,
    );
  }
};

updateService();
