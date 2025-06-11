import { NAME, ROLE } from "@/constant/auth";
import { useAuth } from "@/hooks/useAuth";
import { wealthService } from "@/services/wealthService";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idToken = params.get("user");
    console.log("idToken", idToken);

    if (idToken) {
      const payload = JSON.parse(atob(idToken!.split(".")[1]));
      console.log(payload);
      const name = payload[NAME];
      localStorage.setItem(
        "user",
        JSON.stringify({
          roles: [payload[ROLE]],
          name: name.split("@")[0],
          id: name,
        })
      );
      setUser({
        id: name,
        username: name,
        name: name.split("@")[0],
      });

      const userInfo = async () => {
        params.set("searchTerm", name);
        const user = await wealthService.getAllUsers(params)
        const userToEdit = {
          ...user.items[0],
          roleId: user.items[0].roleTitle?.id, // Ensure this exists
          lastLoginDate: new Date().toISOString(),
          clusterHeadId: user.items[0].clusterHeadId !== null && user.items[0].clusterHeadId !== undefined
            ? Number(user.items[0].clusterHeadId)
            : null,
        };
        await wealthService.editUser(userToEdit, userToEdit.id);
      }

      userInfo();

      navigate("/");
    } else {
      // Handle login error (e.g., display an error message)
      console.error("Login failed.");
      navigate("/");
    }
  }, []);

  return <div>Loading...</div>;
};

export default Callback;
