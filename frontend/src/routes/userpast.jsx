import { mdiBookAccount } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import VertItem from "../components/vertitem.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { formatTime, generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function UserPast() {
  const dispatch = useDispatch();
  const { slugdata: identity } = useParams();
  const vibe = useSelector((data) => data.area.vibe);

  const {
    data: user,
    isLoading,
    error,
  } = useRetrieveIdentityQuery(identity, {
    skip: !identity,
  });

  // Show or Hide LoadNote
  useEffect(() => {
    if (isLoading) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [isLoading, dispatch]);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Img variant="top" src={portraitProvider(user.mail, 512)} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">{user.user}</Card.Title>
            <Card.Text className="small">
              Rank #{user.rank}
              <br />
              Top {parseFloat(user.percentile).toFixed(2)}%
              <br />
              Collected {user.serialized.length} badge(s)
              <br />
              Has {parseFloat(user.percent_earned).toFixed(2)}%
            </Card.Text>
          </Card.Body>
        </Card>
        <div className="d-grid gap-2">
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
        </div>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
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
                          as="a"
                          href={item.reason}
                          target="_blank"
                          rel="noopener noreferrer"
                          bg="success"
                          text="light"
                          className="monoelem text-decoration-none"
                          onClick={(e) => e.stopPropagation()}
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
