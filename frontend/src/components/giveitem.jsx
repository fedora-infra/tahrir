import { Badge, ListGroup } from "react-bootstrap";
import { Link } from "react-router";

import { portraitProvider } from "../features/util.js";

export default function GiveItem({ name, mail, rank, body }) {
  return (
    <ListGroup.Item className="p-2" action as={Link} to={`/discover/identity/${name}`}>
      <div className="d-flex w-100" style={{ gap: "0.5rem" }}>
        <div style={{ aspectRatio: "1/1", height: "45px" }}>
          <img src={portraitProvider(mail, 45)} className="w-100 h-100" alt={name} />
        </div>
        <div className="d-flex flex-column flex-grow-1 text-truncate m-0">
          <div className="d-flex justify-content-between align-items-start">
            <span className="m-0 text-truncate">@{name}</span>
            <Badge bg="secondary" className="monoelem">
              #{rank}
            </Badge>
          </div>
          <span className="small text-truncate">{body}</span>
        </div>
      </div>
    </ListGroup.Item>
  );
}
