import { useEffect } from "react";
import { Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { hideLoad, keepList, showLoad, wipeExpt, keepExpt } from "../features/part.js";
import { formatTime, httpCall } from "../features/util.js";
import Mistaken from "./mistaken.jsx";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Category from "./category.jsx";
import AccoItem from "./accoitem.jsx";

export default function AccoList() {
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
            <Card.Title className="dataelem text-truncate">Complete collection</Card.Title>
            <Card.Text className="small">{list.disordered.full.length} badge(s)</Card.Text>
          </Card.Body>
        </Card>
        <Button as={Link} to={`/discover/recently`} variant="secondary" className="d-grid" size="sm">
          Recent
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        {list.classified.full &&
          Object.entries(list.classified.full).map(
            ([category, iterlist]) =>
              iterlist.length > 0 && (
                <Category key={category} name={category} wide={iterlist.length}>
                  {iterlist.map((indx) => {
                    const item = list.disordered.full[indx];
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
