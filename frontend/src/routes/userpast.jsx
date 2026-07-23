import { mdiBookAccount, mdiFencing, mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import TimeLine from "../components/timeline.jsx";
import UserCard from "../components/usercard.jsx";
import VertItem from "../components/vertitem.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function UserPast() {
  const { slugdata: identity } = useParams();
  const vibe = useSelector((data) => data.area.vibe);
  const authUser = useSelector((data) => data.auth.user);

  const {
    data: user,
    isLoading,
    error,
  } = useRetrieveIdentityQuery(identity, {
    skip: !identity,
  });

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3 d-flex flex-column gap-2">
        <UserCard
          mail={user.mail}
          name={user.user}
          rank={user.rank}
          perc={user.percentile}
          poll={user.serialized.length}
          earn={user.percent_earned}
        />
        {authUser && authUser.nickname === identity && (
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
        )}
        <Button
          as={Link}
          to={`/identity/${identity}`}
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiBookAccount} size={0.875} className="me-1" />
          Collection
        </Button>
        {authUser && authUser.nickname !== identity && (
          <Button
            as={Link}
            to={`/contrast/${identity}`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiFencing} size={0.875} className="me-1" />
            Compare
          </Button>
        )}
      </div>
      <div className="col-12 col-lg-9 d-flex flex-column gap-2">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <TimeLine badges={user.serialized} />
          </Card.Body>
        </Card>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              History
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Collected {user.serialized.length} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush" className="mb-0">
              {user.serialized &&
                user.serialized.map((item) => (
                  <VertItem
                    key={generateIdentity(item.id)}
                    link={`/accolade/${item.id}`}
                    head={item.name}
                    body={`Awarded on ${formatTime(item.issued)}`}
                    shot={item.image}
                    hand={
                      item.reason ? (
                        <Badge
                          as="span"
                          role="link"
                          bg="success"
                          text="light"
                          className="monoelem text-decoration-none"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            window.open(item.reason, "_blank", "noopener,noreferrer");
                          }}
                        >
                          AUTO
                        </Badge>
                      ) : (
                        <Badge bg="warning" text="dark" className="monoelem">
                          HAND
                        </Badge>
                      )
                    }
                  />
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
