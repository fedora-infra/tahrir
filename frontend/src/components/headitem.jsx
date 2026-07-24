import Icon from "@mdi/react";
import { ListGroup } from "react-bootstrap";

export default function HeadItem({ icon, name, vibe, show = true }) {
  if (!show) return null;

  return (
    <ListGroup>
      <ListGroup.Item
        className="d-flex justify-content-between align-items-center ps-2 pe-2 vibe-border dataelem h5 mb-0"
        style={{ "--vibe": vibe }}
      >
        {name}
        <Icon path={icon} size={1} />
      </ListGroup.Item>
    </ListGroup>
  );
}
