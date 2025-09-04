import { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import { useRetrieveAccoListQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function AccoList() {
  const dispatch = useDispatch();

  const { data: list, isLoading, error } = useRetrieveAccoListQuery();

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

  if (isLoading || !list) {
    return null;
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2">
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Complete collection</Card.Title>
            <Card.Text className="small">{list.disordered.full.length} badge(s)</Card.Text>
          </Card.Body>
        </Card>
        <Button as={Link} to={`/recently`} variant="secondary" className="d-grid" size="sm">
          Recent
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        {list.classified.full &&
          Object.entries(list.classified.full).map(
            ([category, iterlist]) =>
              iterlist.length > 0 && (
                <Grouping key={generateIdentity(category)} name={category} wide={iterlist.length}>
                  {iterlist.map((indx) => {
                    const item = list.disordered.full[indx];
                    return item ? (
                      <AccoItem
                        key={generateIdentity(item.id)}
                        iden={item.id}
                        name={item.name}
                        body={item.description}
                        foot={formatTime(item.created_on)}
                        shot={item.image}
                        rare={item.rarity}
                      />
                    ) : null;
                  })}
                </Grouping>
              )
          )}
      </div>
    </div>
  );
}
