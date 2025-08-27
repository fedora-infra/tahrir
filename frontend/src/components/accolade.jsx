import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { hideLoad, keepAcco, keepExpt, showLoad, wipeExpt } from "../features/part.js";
import { formatTime, httpCall } from "../features/util.js";
import Mistaken from "./mistaken.jsx";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import GiveItem from "./giveitem.jsx";
import { Badge, Stack } from "react-bootstrap";
import CryptoJS from "crypto-js";

export default function Accolade() {
  const { slugdata } = useParams();
  const dispatch = useDispatch();
  const acco = useSelector((area) => area.area.acco);
  const load = useSelector((area) => area.area.load);
  const expt = useSelector((area) => area.area.expt);

  useEffect(() => {
    const makeUnitData = async () => {
      try {
        dispatch(showLoad());
        dispatch(wipeExpt());
        const data = await httpCall("GET", `/badge/${slugdata}/json`);
        dispatch(keepAcco(data));
      } catch (fail) {
        console.log(fail.message);
        dispatch(keepExpt(fail.message));
      } finally {
        dispatch(hideLoad());
      }
    };

    if (slugdata) {
      makeUnitData();
    }
  }, [dispatch, slugdata]);

  if (expt) {
    return <Mistaken />;
  }

  return !load ? (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2">
          <Card.Img variant="top" src={acco.image} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate mb-1">{acco.name}</Card.Title>
            <Card.Text className="small mb-2">{acco.description}</Card.Text>
            <Stack direction="horizontal" gap={2}>
              {acco.tags &&
                acco.tags.map((name) => (
                  <Badge
                    as={Link}
                    to={`/category/${name}`}
                    key={CryptoJS.SHA256(name).toString()}
                    bg="secondary"
                    className="monoelem text-capitalize text-decoration-none"
                  >
                    {name}
                  </Badge>
                ))}
            </Stack>
          </Card.Body>
        </Card>
        <Card className="mb-2">
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">First awarded</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <GiveItem
                key={acco.assertions[0].name}
                name={acco.assertions[0].name}
                mail={acco.assertions[0].mail}
                rank={acco.assertions[0].rank}
                body={`On ${formatTime(acco.assertions[0].date)}`}
              />
            </ListGroup>
          </Card.Body>
        </Card>
        <Card className="mb-2">
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Last awarded</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <GiveItem
                key={acco.assertions[acco.assertions.length - 1].name}
                name={acco.assertions[acco.assertions.length - 1].name}
                mail={acco.assertions[acco.assertions.length - 1].mail}
                rank={acco.assertions[acco.assertions.length - 1].rank}
                body={`On ${formatTime(acco.assertions[acco.assertions.length - 1].date)}`}
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
        <Button as={Link} to="/discover/accolade" variant="secondary" className="d-grid" size="sm">
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
                acco.assertions.map((assertion) => (
                  <GiveItem
                    key={assertion.name}
                    name={assertion.name}
                    mail={assertion.mail}
                    rank={assertion.rank}
                    body={`Awarded on ${formatTime(assertion.date)}`}
                  />
                ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  ) : null;
}
