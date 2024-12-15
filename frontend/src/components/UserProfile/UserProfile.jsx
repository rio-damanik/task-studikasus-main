import React from "react";
import "./UserProfile.css";

const UserProfile = () => {
  const user = { name: "John Doe", email: "john@example.com" };

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default UserProfile;
