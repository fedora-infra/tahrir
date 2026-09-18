import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";

import { userManager } from "../config/oidc.js";
import { loadUserData } from "../features/auth.js";
import { useAffirmInvitationMutation } from "../features/call.js";
import { hideLoad, showBaseNote, showLoad } from "../features/part.js";

export default function Rsvp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { slugdata: invitationId } = useParams();
  const authUser = useSelector((data) => data.auth.user);
  const authStat = useSelector((data) => data.auth.status);

  const [affirmInvitation] = useAffirmInvitationMutation();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (authStat === "idle") {
      dispatch(showLoad());
      dispatch(loadUserData());
    }
  }, [authStat, dispatch]);

  useEffect(() => {
    if (authStat === "idle" || authStat === "load") {
      return;
    }

    if (hasTriggered.current) {
      return;
    }

    if (!invitationId) {
      navigate("/", { replace: true });
      return;
    }

    if (!authUser) {
      hasTriggered.current = true;
      sessionStorage.setItem("post_login_redirect", `/campaign/${invitationId}/rsvp`);
      userManager.signinRedirect();
      return;
    }

    hasTriggered.current = true;
    dispatch(showLoad());

    affirmInvitation(invitationId)
      .unwrap()
      .then((data) => {
        dispatch(
          showBaseNote({
            pass: true,
            data: data?.message,
          })
        );
      })
      .catch((error) => {
        const noteText = error?.data?.error || "Failed during badge redemption";
        dispatch(showBaseNote({ pass: false, data: noteText }));
      })
      .finally(() => {
        dispatch(hideLoad());
        navigate(`/identity/${authUser.nickname}`, { replace: true });
      });
  }, [authStat, authUser, invitationId, affirmInvitation, dispatch, navigate]);

  return null;
}
