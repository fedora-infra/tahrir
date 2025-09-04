import { useEffect } from "react";
import { Badge, Button, Card, ListGroup, Stack } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router";

import VertItem from "../components/vertitem.jsx";
import { useRetrieveAccoladeQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { generateIdentity, portraitProvider, rarities } from "../features/util.js";
import { formatTime } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Accolade() {
  const dispatch = useDispatch();
  const { slugdata: accolade } = useParams();

  const {
    data: acco,
    isLoading,
    error,
  } = useRetrieveAccoladeQuery(accolade, {
    skip: !accolade,
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

  if (isLoading || !acco) {
    return null;
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2">
          <Card.Img variant="top" src={acco.image} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate mb-1">{acco.name}</Card.Title>
            <Card.Text className="small mb-2">{acco.description}</Card.Text>
            <div>
              {acco.tags &&
                acco.tags.map((name) => (
                  <Badge
                    key={generateIdentity(name)}
                    as={Link}
                    to={`/category/${name}`}
                    bg="secondary"
                    className="monoelem text-capitalize text-decoration-none me-1"
                  >
                    {name}
                  </Badge>
                ))}
            </div>
          </Card.Body>
        </Card>
        <Card className="mb-2">
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Tier</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <VertItem
                link={`/rarities/${acco.rarity}`}
                head={rarities[acco.rarity]}
                body={`${parseFloat(acco.percent_earned).toFixed(4)}% earned`}
                shot={`/imgs/rare_${acco.rarity.toLowerCase()}.png`}
              />
            </ListGroup>
          </Card.Body>
        </Card>
        <Card className="mb-2">
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">First awarded</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <VertItem
                link={`/identity/${acco.assertions[0].name}`}
                head={acco.assertions[0].name}
                body={`On ${formatTime(acco.assertions[0].date)}`}
                shot={portraitProvider(acco.assertions[0].mail)}
                hand={
                  <Badge bg="secondary" className="monoelem">
                    #{acco.assertions[0].rank}
                  </Badge>
                }
              />
            </ListGroup>
          </Card.Body>
        </Card>
        <Card className="mb-2">
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Last awarded</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <VertItem
                link={`/identity/${acco.assertions[acco.assertions.length - 1].name}`}
                head={acco.assertions[acco.assertions.length - 1].name}
                body={`On ${formatTime(acco.assertions[acco.assertions.length - 1].date)}`}
                shot={portraitProvider(acco.assertions[acco.assertions.length - 1].mail)}
                hand={
                  <Badge bg="secondary" className="monoelem">
                    #{acco.assertions[acco.assertions.length - 1].rank}
                  </Badge>
                }
              />
            </ListGroup>
          </Card.Body>
        </Card>
        <Button
          as="a"
          href={acco.criteria}
          target="_blank"
          rel="noopener noreferrer"
          variant="secondary"
          className="d-grid mb-2"
          size="sm"
        >
          Criteria
        </Button>
        <Button as={Link} to="/assembly" variant="secondary" className="d-grid" size="sm">
          Collection
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="mb-2">
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              History
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Awarded {acco.assertions.length} time(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              {acco.assertions &&
                acco.assertions.map((item) => (
                  <VertItem
                    key={generateIdentity(item.name)}
                    link={`/identity/${item.name}`}
                    head={item.name}
                    body={`On ${formatTime(item.date)}`}
                    shot={portraitProvider(item.mail)}
                    hand={
                      <Badge bg="secondary" className="monoelem">
                        #{item.rank}
                      </Badge>
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
