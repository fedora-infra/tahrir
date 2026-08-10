import { Badge, Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import SideArea from "../components/sidearea.jsx";
import VertItem from "../components/vertitem.jsx";
import { useRetrieveDiscoverQuery } from "../features/call.js";
import { useLoadingState } from "../features/hook.js";
import { formatTime, generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function FindPage() {
  const { slugdata: findtext } = useParams();
  const { data: dict, isLoading, error } = useRetrieveDiscoverQuery(findtext, { skip: false });
  const vibe = useSelector((data) => data.area.vibe);

  useLoadingState(isLoading);

  if (findtext.length < 4) {
    return <Mistaken />;
  }

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !dict) {
    return null;
  }

  return (
    <div className="row g-2 mb-2">
      <SideArea>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Search result</Card.Title>
            <Card.Text className="small">For "{findtext}"</Card.Text>
          </Card.Body>
        </Card>
      </SideArea>
      <div className="col-12 col-lg-9 d-flex flex-column gap-2">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              Badges
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Found {dict.badges.length} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              {dict.badges.length > 0 ? (
                dict.badges.map((item) => (
                  <VertItem
                    key={generateIdentity(item.id)}
                    link={`/accolade/${item.id}`}
                    head={item.name}
                    body={item.description}
                    shot={item.image}
                    hand={
                      <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                        BADGE
                      </Badge>
                    }
                  />
                ))
              ) : (
                <VertItem head="No badges found" body="Try refining your search" />
              )}
            </ListGroup>
          </Card.Body>
        </Card>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              Users
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Found {dict.users.length} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              {dict.users.length > 0 ? (
                dict.users.map((item) => (
                  <VertItem
                    key={generateIdentity(item.nickname)}
                    link={`/identity/${item.nickname}`}
                    head={item.nickname}
                    body={`Last seen on ${formatTime(item.last_login)}`}
                    shot={portraitProvider(item.email)}
                    hand={
                      <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                        #{item.rank}
                      </Badge>
                    }
                  />
                ))
              ) : (
                <VertItem head="No users found" body="Try refining your search" />
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
