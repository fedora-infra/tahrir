import { Badge, ListGroup } from "react-bootstrap";
import { Link } from "react-router";

import { formatTime } from "../features/util.js";

export default function PastItem({ iden, name, shot, link, time }) {
  return (
    <ListGroup.Item className="p-2" action as={Link} to={`/discover/accolade/${iden}`}>
      <div className="d-flex w-100" style={{ gap: "0.5rem" }}>
        <div style={{ aspectRatio: "1/1", height: "45px" }}>
          <img src={shot} className="w-100 h-100" alt={name} />
        </div>
        <div className="d-flex flex-column flex-grow-1 text-truncate m-0">
          <div className="d-flex justify-content-between align-items-start">
            <span className="m-0 text-truncate">{name}</span>
            {link ? (
              <Badge
                as="a"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                bg="success"
                text="light"
                className="monoelem text-decoration-none"
                onClick={(e) => e.stopPropagation()}
              >
                AUTO
              </Badge>
            ) : (
              <Badge bg="warning" text="dark" className="monoelem">
                HAND
              </Badge>
            )}
          </div>
          <span className="small">Awarded on {formatTime(time)}</span>
        </div>
      </div>
    </ListGroup.Item>
  );
}
