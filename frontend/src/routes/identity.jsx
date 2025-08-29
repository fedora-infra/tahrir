import { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Category from "../components/category.jsx";
import { hideLoad, keepExpt, keepUser, showLoad, wipeExpt } from "../features/part.js";
import { formatTime, httpCall, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Identity() {
  const { slugdata } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((area) => area.area.user);
  const load = useSelector((area) => area.area.load);
  const expt = useSelector((area) => area.area.expt);

  useEffect(() => {
    const makeUnitData = async () => {
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
        <Button as={Link} to={`/discover/userpast/${slugdata}`} variant="secondary" className="d-grid" size="sm">
          History
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        {user.classified &&
          Object.entries(user.classified).map(
            ([category, iterlist]) =>
              iterlist.length > 0 && (
                <Category key={category} name={category} wide={iterlist.length}>
                  {iterlist.map((indx) => {
                    const item = user.serialized[indx];
                    return item ? (
                      <AccoItem
                        key={item.id}
                        iden={item.id}
                        name={item.name}
                        body={item.description}
                        foot={`Awarded on ${formatTime(item.issued)}`}
                        shot={item.image}
                      />
                    ) : null;
                  })}
                </Category>
              )
          )}
      </div>
    </div>
  ) : null;
}
