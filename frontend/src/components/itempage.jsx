import Icon from "@mdi/react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link } from "react-router";

import { useLoadingState } from "../features/hook.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "../routes/mistaken.jsx";
import AccoItem from "./accoitem.jsx";
import Grouping from "./grouping.jsx";
import SideArea from "./sidearea.jsx";

export default function ItemPage({ query, title, dataKey, buttons }) {
  const { data: list, isLoading, error } = query;
  const vibe = useSelector((data) => data.area.vibe);

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !list) {
    return null;
  }

  const itemlist = list.disordered[dataKey];
  const typelist = list.classified[dataKey];

  return (
    <div className="row g-2 mb-2">
      <SideArea>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">{title}</Card.Title>
            <Card.Text className="small">{itemlist.length} badge(s)</Card.Text>
          </Card.Body>
        </Card>
        {buttons.map(({ to, icon, name }) => (
          <Button
            key={generateIdentity(to)}
            as={Link}
            to={to}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={icon} size={0.875} className="me-1" />
            {name}
          </Button>
        ))}
      </SideArea>
      <div className="col-12 col-lg-9 d-flex flex-column gap-2">
        {typelist &&
          Object.entries(typelist).map(
            ([category, iterlist]) =>
              iterlist.length > 0 && (
                <Grouping key={generateIdentity(category)} name={category} wide={iterlist.length} head={true}>
                  {iterlist.map((indx) => {
                    const item = itemlist[indx];
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
