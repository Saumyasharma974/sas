import React from "react";
import DashboardLayout from "../componets/DashboardLayout";
import { Card } from "../componets/ui";

export default function Profile() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-white mb-4">User Profile</h1>
      <Card>
        <p className="text-white"><strong>Name:</strong> Saumya</p>
        <p className="text-white"><strong>Email:</strong> saumya@example.com</p>
        <p className="text-white"><strong>Quota Left:</strong> 10 requests</p>
      </Card>
    </DashboardLayout>
  );
}
