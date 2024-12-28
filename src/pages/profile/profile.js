import React, { useEffect, useState } from "react";
import "./profile.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
import ServiceUtilities from "../../utils/servics_utilities/service_utilities";
const Service = new ServiceUtilities();

function ProfilePage() {
  return <div className="page-container"></div>;
}

export default ProfilePage;
