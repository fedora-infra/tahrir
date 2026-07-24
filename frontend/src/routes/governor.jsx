import { mdiAccountCircle, mdiCrown, mdiCubeScan, mdiMedal, mdiShieldStarOutline } from "@mdi/js";
import { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import BaseNote from "../components/basenote.jsx";
import HeadItem from "../components/headitem.jsx";
import AssertionCreationForm from "../crud/assertions/create.jsx";
import AssertionUpdateForm from "../crud/assertions/delete.jsx";
import AuthorizationCreationForm from "../crud/authorizations/create.jsx";
import AuthorizationDeletionForm from "../crud/authorizations/delete.jsx";
import BadgeCreationForm from "../crud/badges/create.jsx";
import BadgeUpdateForm from "../crud/badges/update.jsx";
import InvitationCreationForm from "../crud/invitations/create.jsx";
import InvitationDeletionForm from "../crud/invitations/delete.jsx";
import UserCreationForm from "../crud/users/create.jsx";
import UserUpdateForm from "../crud/users/update.jsx";
import { loadUserData } from "../features/auth.js";
import { hideLoad, showLoad } from "../features/part.js";
import { admins, owners } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Governor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((data) => data.auth.user);
  const authStat = useSelector((data) => data.auth.status);
  const vibe = useSelector((data) => data.area.vibe);

  useEffect(() => {
    if (authStat === "idle") {
      dispatch(showLoad());
      dispatch(loadUserData());
      return;
    }

    // Show or Hide LoadNote
    if (authStat === "load") {
      dispatch(showLoad());
      return;
    }

    // Show or Hide LoadNote
    if (authStat === "pass" || authStat === "fail") {
      dispatch(hideLoad());
    }
  }, [user, authStat, navigate, dispatch]);

  // Show mistaken page if user is unauthorized (after auth is complete)
  if ((authStat === "pass" || authStat === "fail") && (!user || !user.groups || !user.groups.includes(owners))) {
    return <Mistaken />;
  }

  const inAdmins = user?.groups?.includes(admins);

  return (
    <>
      <div className="row g-2 mb-2">
        <div className="col-12 col-lg-3 d-flex flex-column gap-2">
          <Card className="vibe-border" style={{ "--vibe": vibe }}>
            <Card.Body className="p-2">
              <Card.Title className="dataelem text-truncate">Governor</Card.Title>
              <Card.Text as="div" className="small">
                {inAdmins ? (
                  <>
                    <div>
                      You have access to all administrative functions because you belong to the{" "}
                      <span className="fw-bold">{admins}</span> group.
                    </div>
                    <div className="mt-2">
                      Please be extremely careful about the changes you make as there are zero protections whatsoever to
                      mishaps.
                    </div>
                  </>
                ) : (
                  <div>
                    You have access to award badges and create invitations because you belong to the{" "}
                    <span className="fw-bold">{owners}</span> group.
                  </div>
                )}
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 col-lg-9 d-flex flex-column gap-2">
          <HeadItem icon={mdiMedal} name="Assertions" vibe={vibe} />
          <AssertionCreationForm />
          <AssertionUpdateForm show={inAdmins} />
          <hr className="mt-0 mb-0" />
          <HeadItem icon={mdiCubeScan} name="Invitations" vibe={vibe} />
          <InvitationCreationForm />
          <InvitationDeletionForm show={inAdmins} />
          {inAdmins && <hr className="mt-0 mb-0" />}
          <HeadItem icon={mdiCrown} name="Authorizations" vibe={vibe} show={inAdmins} />
          <AuthorizationCreationForm show={inAdmins} />
          <AuthorizationDeletionForm show={inAdmins} />
          {inAdmins && <hr className="mt-0 mb-0" />}
          <HeadItem icon={mdiShieldStarOutline} name="Badges" vibe={vibe} show={inAdmins} />
          <BadgeCreationForm show={inAdmins} />
          <BadgeUpdateForm show={inAdmins} />
          {inAdmins && <hr className="mt-0 mb-0" />}
          <HeadItem icon={mdiAccountCircle} name="Users" vibe={vibe} show={inAdmins} />
          <UserCreationForm show={inAdmins} />
          <UserUpdateForm show={inAdmins} />
        </div>
      </div>
      <BaseNote />
    </>
  );
}
