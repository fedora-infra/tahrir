import { useEffect } from "react";
import { Link, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { hideLoad, keepUser, showLoad, wipeExpt, keepExpt } from "../features/part.js";
import { httpCall, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import Button from "react-bootstrap/Button";
import PastItem from "./pastitem.jsx";

export default function UserPast() {
  const { slugdata } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((area) => area.area.user);
  const load = useSelector((area) => area.area.load);
  const expt = useSelector((area) => area.area.expt);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoad());
        dispatch(wipeExpt());
        const data = await httpCall("GET", `/json/user/${slugdata}`);
        dispatch(keepUser(data));
      } catch (fail) {
        console.log(fail.message);
        dispatch(keepExpt(fail.message));
      } finally {
        dispatch(hideLoad());
      }
    };

    if (slugdata) {
      fetchUserData();
    }
  }, [dispatch, slugdata]);

  if (expt) {
    return <Mistaken />;
  }

  return !load ? (
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
        <Button as={Link} to={`/discover/identity/${slugdata}`} variant="secondary" className="d-grid" size="sm">
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
                    key={item.id}
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
  ) : null;
}
