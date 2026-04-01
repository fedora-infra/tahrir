import { mdiHistory } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import { useRetrieveAccoListQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function AccoList() {
  const { data: list, isLoading, error } = useRetrieveAccoListQuery();
  const vibe = useSelector((data) => data.area.vibe);

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !list) {
    return null;
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Complete collection</Card.Title>
            <Card.Text className="small">{list.disordered.full.length} badge(s)</Card.Text>
          </Card.Body>
        </Card>
        <div className="d-grid gap-2">
          <Button
            as={Link}
            to={`/recently`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiHistory} size={0.875} className="me-1" />
            Recently introduced
          </Button>
        </div>
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
