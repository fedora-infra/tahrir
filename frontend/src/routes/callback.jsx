import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";

import LoadNote from "../components/loadnote.jsx";
import { userManager } from "../config/oidc.js";
import { loadUserData } from "../features/auth.js";
import { hideLoad, showLoad } from "../features/part.js";

export default function Callback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(showLoad());

    const handleCallback = async () => {
      try {
        const user = await userManager.signinRedirectCallback();

        // Log OIDC groups and agreements for testing
        console.log("OIDC Login Event - User Profile:", user.profile);
        console.log("OIDC Groups:", user.profile.groups || "No groups found");
        console.log("OIDC Agreements:", user.profile.agreements || "No agreements found");

        navigate(`/identity/${user.profile.preferred_username}`);
        dispatch(loadUserData());
      } catch (error) {
        console.error("OIDC callback error:", error);
        navigate("/");
      } finally {
        dispatch(hideLoad());
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return <LoadNote />;
}
