import { Badge, Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import SideArea from "../components/sidearea.jsx";
import TimeLine from "../components/timeline.jsx";
import UserCard from "../components/usercard.jsx";
import UserSide from "../components/userside.jsx";
import VertItem from "../components/vertitem.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { useLoadingState } from "../features/hook.js";
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
      <SideArea>
        <UserCard
          mail={user.user.mail}
          name={user.user.nickname}
          rank={user.rank}
          perc={user.percentile}
          poll={user.badges.length}
          earn={user.percent_earned}
        />
        <UserSide identity={identity} authUser={authUser} />
      </SideArea>
      <div className="col-12 col-lg-9 d-flex flex-column gap-2">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <TimeLine badges={user.badges} />
          </Card.Body>
        </Card>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              History
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Collected {user.badges.length} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush" className="mb-0">
              {user.badges &&
                user.badges.map((item) => (
                  <VertItem
                    key={generateIdentity(item.id)}
                    link={`/accolade/${item.id}`}
                    head={item.name}
                    body={`Awarded on ${formatTime(item.created_on)}`}
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
