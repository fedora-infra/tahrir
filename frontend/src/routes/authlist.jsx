import { mdiBookAccount, mdiHistory, mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import UserCard from "../components/usercard.jsx";
import VertItem from "../components/vertitem.jsx";
import { loadUserData } from "../features/auth.js";
import { useRetrieveAuthListQuery, useRetrieveIdentityQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function AuthList() {
  const dispatch = useDispatch();
  const authUser = useSelector((data) => data.auth.user);
  const authStat = useSelector((data) => data.auth.status);
  const vibe = useSelector((data) => data.area.vibe);

  const { data: profile, isLoading: isProfileLoading } = useRetrieveIdentityQuery(authUser?.nickname, {
    skip: !authUser?.nickname,
  });

  const {
    data: authlist,
    isLoading: isAuthListLoading,
    error,
  } = useRetrieveAuthListQuery(authUser?.nickname, {
    skip: !authUser?.nickname,
  });

  const isLoading = isProfileLoading || isAuthListLoading;

  useEffect(() => {
    if (authStat === "idle") {
      dispatch(showLoad());
      dispatch(loadUserData());
      return;
    }
    if (authStat === "load" || isLoading) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [authStat, isLoading, dispatch]);

  if ((authStat === "pass" || authStat === "fail") && !authUser) {
    return <Mistaken />;
  }

  if (isLoading || !profile) {
    return null;
  }

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3 d-flex flex-column gap-2">
        <UserCard
          mail={profile.user.mail}
          name={profile.user.nickname}
          rank={profile.rank}
          perc={profile.percentile}
          poll={profile.badges.length}
          earn={profile.percent_earned}
        />
        <Button
          as={Link}
          to="/campaign"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiSend} size={0.875} className="me-1" />
          Campaign
        </Button>
        <Button
          as={Link}
          to={`/identity/${authUser.nickname}`}
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiBookAccount} size={0.875} className="me-1" />
          Collection
        </Button>
        <Button
          as={Link}
          to={`/userpast/${authUser.nickname}`}
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiHistory} size={0.875} className="me-1" />
          History
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              Approval
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">
              {error || !authlist || Object.keys(authlist).length === 0
                ? "No authorizations available"
                : `${Object.keys(authlist).length} badge(s)`}
            </Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush" className="mb-0">
              {error || !authlist || Object.keys(authlist).length === 0 ? (
                <VertItem head="No authorizations found" body="Create authorizations from the governor page" />
              ) : (
                Object.entries(authlist)
                  .sort(([, a], [, b]) => a.name.localeCompare(b.name))
                  .map(([badgeId, badge]) => (
                    <VertItem
                      key={generateIdentity(badgeId)}
                      link={`/accolade/${badgeId}`}
                      head={badge.name}
                      body={badge.description}
                      shot={badge.image}
                      hand={
                        <Badge bg="" className="monoelem" style={{ background: vibe }}>
                          {!badge.legacy ? "ACTIVE" : "LEGACY"}
                        </Badge>
                      }
                    />
                  ))
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
