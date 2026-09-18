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
        await userManager.signinRedirectCallback();

        const result = await dispatch(loadUserData());
        if (result.type === "auth/loadUserData/fulfilled") {
          const redirectPath = sessionStorage.getItem("post_login_redirect");
          if (redirectPath) {
            sessionStorage.removeItem("post_login_redirect");
            navigate(redirectPath);
          } else {
            navigate(`/identity/${result.payload.nickname}`);
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("OIDC callback error encountered:", error);
        navigate("/");
      } finally {
        dispatch(hideLoad());
      }
    };

    handleCallback();
  }, [dispatch, navigate]);

  return <LoadNote />;
}
