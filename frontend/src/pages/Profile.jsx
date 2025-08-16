import React, { useEffect } from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card } from "../componets/ui";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = React.useState(null);
  const userId = localStorage.getItem("userId");
      useEffect(() => {
        if (!localStorage.getItem("token")) {
          navigate("/login");
        }
      }, [navigate]);
  
  React.useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(`http://localhost:3000/api/auth/me/${userId}`, { withCredentials: true });
      setUser(response.data.user);
    };
    fetchUser();
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-4">User Profile</h1>
      <Card>
        <p className="text-white"><strong>Name:</strong> {user?.name}</p>
        <p className="text-white"><strong>Email:</strong> {user?.email}</p>
        <p className="text-white"><strong>Quota Left:</strong> {user?.credits} requests</p>
      </Card>
    </DashboardLayout>
  );
}
