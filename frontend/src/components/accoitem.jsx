import { useState } from "react";
import { Col, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";

import { obtainRarityBack, obtainRarityEdge, obtainRarityText, relativeImageUrl } from "../features/util.js";

export default function AccoItem({ iden, name, body, foot, shot, rare }) {
   const [show, setShow] = useState(false);

  if (shot) {
    shot = relativeImageUrl(shot);
  }

  return (
    <OverlayTrigger
      placement="auto"
      show={show}
      onToggle={setShow}
      overlay={
        <Popover className={`bodyelem ${obtainRarityEdge(rare)}`} 
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        >
          <Popover.Header
            className={`p-2 fw-bold text-truncate ${obtainRarityBack(rare) || "bg-secondary text-white"}`}
          >
            {name}
          </Popover.Header>
          <Popover.Body className="p-2 small" style={{ userSelect: "text" }}>
            <p>{body}</p>
            <p className="mb-0 text-secondary fst-italic">
              <span className={`text-truncate fw-bold ${obtainRarityText(rare)}`}>Rarity {rare}</span> • Created on{" "}
              {foot}
            </p>
          </Popover.Body>
        </Popover>
      }
    >
      <Col xs={3} md={1} lg={1}  
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      >
        <Link to={`/accolade/${iden}`} tabIndex="0">
          <Image src={shot} className="w-100 h-100" alt={name} />
        </Link>
      </Col>
    </OverlayTrigger>
  );
}
