import { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Category from "../components/category.jsx";
import { hideLoad, keepExpt, keepList, showLoad, wipeExpt } from "../features/part.js";
import { formatTime, httpCall } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Recently() {
  const dispatch = useDispatch();
  const list = useSelector((area) => area.area.list);
  const load = useSelector((area) => area.area.load);
  const expt = useSelector((area) => area.area.expt);

  useEffect(() => {
    const makeUnitData = async () => {
      try {
        dispatch(showLoad());
        dispatch(wipeExpt());
        const data = await httpCall("GET", `/json/discover/accolade`);
        dispatch(keepList(data));
      } catch (fail) {
        console.log(fail.message);
        dispatch(keepExpt(fail.message));
      } finally {
        dispatch(hideLoad());
      }
    };

    makeUnitData();
  }, [dispatch]);

  if (expt) {
    return <Mistaken />;
  }

  return !load ? (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2">
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Recently included</Card.Title>
            <Card.Text className="small">{list.disordered.newest.length} badge(s)</Card.Text>
          </Card.Body>
        </Card>
        <Button as={Link} to={`/discover/accolade`} variant="secondary" className="d-grid" size="sm">
          Entire
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        {list.classified.newest &&
          Object.entries(list.classified.newest).map(
            ([category, iterlist]) =>
              iterlist.length > 0 && (
                <Category key={category} name={category} wide={iterlist.length}>
                  {iterlist.map((indx) => {
                    const item = list.disordered.newest[indx];
                    return item ? (
                      <AccoItem
                        key={item.id}
                        iden={item.id}
                        name={item.name}
                        body={item.description}
                        foot={`Created on ${formatTime(item.created_on)}`}
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
