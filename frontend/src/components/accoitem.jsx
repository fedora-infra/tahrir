import { Col, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";

import { obtainRarityBack, obtainRarityEdge, obtainRarityText } from "../features/util.js";

export default function AccoItem({ iden, name, body, foot, shot, rare }) {
  if (shot) {
    shot = shot.toString().replace("https://badges.fedoraproject.org", "");
  }

  return (
    <OverlayTrigger
      placement="auto"
      overlay={
        <Popover className={`bodyelem ${obtainRarityEdge(rare)}`}>
          <Popover.Header
            className={`p-2 fw-bold text-truncate ${obtainRarityBack(rare) || "bg-secondary text-white"}`}
          >
            {name}
          </Popover.Header>
          <Popover.Body className="p-2 small">
            <p>{body}</p>
            <p className="mb-0 text-secondary fst-italic">
              <span className={`text-truncate fw-bold ${obtainRarityText(rare)}`}>Rarity {rare}</span> • Created on{" "}
              {foot}
            </p>
          </Popover.Body>
        </Popover>
      }
    >
      <Col xs={3} md={1} lg={1}>
        <Link to={`/accolade/${iden}`} tabIndex="0">
          <Image src={shot} className="w-100 h-100" alt={name} />
        </Link>
      </Col>
    </OverlayTrigger>
  );
}
