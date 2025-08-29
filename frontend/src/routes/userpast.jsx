import { useEffect } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router";

import PastItem from "../components/pastitem.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function UserPast() {
  const dispatch = useDispatch();
  const { slugdata: identity } = useParams();

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
        <Card className="mb-2">
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
        <Button as={Link} to={`/discover/identity/${identity}`} variant="secondary" className="d-grid" size="sm">
          Collection
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="mb-2">
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              History
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Collected {user.serialized.length} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush" className="mb-0">
              {user.serialized &&
                user.serialized.map((item) => (
                  <PastItem
                    key={generateIdentity(item.id)}
                    iden={item.id}
                    name={item.name}
                    shot={item.image}
                    link={item.reason}
                    time={item.issued}
                  />
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
