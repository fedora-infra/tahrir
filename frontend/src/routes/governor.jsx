import { mdiAccountCircle, mdiCrown, mdiCubeScan, mdiDatabase, mdiMedal, mdiShieldStarOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useRef } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";

import BaseNote from "../components/basenote.jsx";
import HeadItem from "../components/headitem.jsx";
import SideArea from "../components/sidearea.jsx";
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

  const averRefs = useRef(null);
  const callRefs = useRef(null);
  const authRefs = useRef(null);
  const accoRefs = useRef(null);
  const userRefs = useRef(null);

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

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <div className="row g-2 mb-2">
        <SideArea>
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
          <Button
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
            onClick={() => scrollTo(averRefs)}
          >
            <Icon path={mdiMedal} size={0.875} className="me-1" />
            Assertions
          </Button>
          <Button
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
            onClick={() => scrollTo(callRefs)}
          >
            <Icon path={mdiCubeScan} size={0.875} className="me-1" />
            Invitations
          </Button>
          {inAdmins && (
            <Button
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
              onClick={() => scrollTo(authRefs)}
            >
              <Icon path={mdiCrown} size={0.875} className="me-1" />
              Authorizations
            </Button>
          )}
          {inAdmins && (
            <Button
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
              onClick={() => scrollTo(accoRefs)}
            >
              <Icon path={mdiShieldStarOutline} size={0.875} className="me-1" />
              Badges
            </Button>
          )}
          {inAdmins && (
            <Button
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
              onClick={() => scrollTo(userRefs)}
            >
              <Icon path={mdiAccountCircle} size={0.875} className="me-1" />
              Users
            </Button>
          )}
          {inAdmins && <hr className="m-0" />}
          {inAdmins && (
            <Button
              href="/database"
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiDatabase} size={0.875} className="me-1" />
              Database
            </Button>
          )}
        </SideArea>
        <div className="col-12 col-lg-9 d-flex flex-column gap-2">
          <div ref={averRefs} style={{ scrollMarginTop: "calc(var(--navbar-height) + 0.5rem)" }}>
            <HeadItem icon={mdiMedal} name="Assertions" vibe={vibe} />
          </div>
          <AssertionCreationForm />
          <AssertionUpdateForm show={inAdmins} />
          <hr className="mt-0 mb-0" />
          <div ref={callRefs} style={{ scrollMarginTop: "calc(var(--navbar-height) + 0.5rem)" }}>
            <HeadItem icon={mdiCubeScan} name="Invitations" vibe={vibe} />
          </div>
          <InvitationCreationForm />
          <InvitationDeletionForm show={inAdmins} />
          {inAdmins && <hr className="mt-0 mb-0" />}
          <div ref={authRefs} style={{ scrollMarginTop: "calc(var(--navbar-height) + 0.5rem)" }}>
            <HeadItem icon={mdiCrown} name="Authorizations" vibe={vibe} show={inAdmins} />
          </div>
          <AuthorizationCreationForm show={inAdmins} />
          <AuthorizationDeletionForm show={inAdmins} />
          {inAdmins && <hr className="mt-0 mb-0" />}
          <div ref={accoRefs} style={{ scrollMarginTop: "calc(var(--navbar-height) + 0.5rem)" }}>
            <HeadItem icon={mdiShieldStarOutline} name="Badges" vibe={vibe} show={inAdmins} />
          </div>
          <BadgeCreationForm show={inAdmins} />
          <BadgeUpdateForm show={inAdmins} />
          {inAdmins && <hr className="mt-0 mb-0" />}
          <div ref={userRefs} style={{ scrollMarginTop: "calc(var(--navbar-height) + 0.5rem)" }}>
            <HeadItem icon={mdiAccountCircle} name="Users" vibe={vibe} show={inAdmins} />
          </div>
          <UserCreationForm show={inAdmins} />
          <UserUpdateForm show={inAdmins} />
        </div>
      </div>
      <BaseNote />
    </>
  );
}
