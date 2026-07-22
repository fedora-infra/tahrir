import { mdiViewGridPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import { useRetrieveCategoryQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Category() {
  const { slugdata: category } = useParams();
  const { data: list, isLoading, error } = useRetrieveCategoryQuery(category);
  const vibe = useSelector((data) => data.area.vibe);

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !list) {
    return null;
  }

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Category</Card.Title>
            <Card.Text className="small">Find badges using the associated labels</Card.Text>
          </Card.Body>
        </Card>
        <div className="d-grid gap-2">
          <Button
            as={Link}
            to="/assembly"
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiViewGridPlus} size={0.875} className="me-1" />
            Complete collection
          </Button>
        </div>
      </div>
      <div className="col-12 col-lg-9 d-grid gap-2">
        <Grouping name={category} wide={list.length} head={true}>
          {list.map((item) => (
            <AccoItem
              key={generateIdentity(item.id)}
              iden={item.id}
              name={item.name}
              body={item.description}
              foot={formatTime(item.created_on)}
              shot={item.image}
              rare={item.rarity}
            />
          ))}
        </Grouping>
      </div>
    </div>
  );
}
