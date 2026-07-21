import { useState } from "react";
import { Col, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";

import { obtainRarityBack, obtainRarityEdge, obtainRarityText, relativeImageUrl } from "../features/util.js";

export default function AccoItem({ iden, name, body, foot, shot, rare, diff }) {
  const [show, makeShow] = useState(false);

  if (shot) {
    shot = relativeImageUrl(shot);
  }

  return (
    <OverlayTrigger
      placement="auto"
      show={show}
      onToggle={makeShow}
      overlay={
        <Popover
          className={`bodyelem ${obtainRarityEdge(rare)}`}
          onMouseEnter={() => makeShow(true)}
          onMouseLeave={() => makeShow(false)}
        >
          <Popover.Header
            className={`p-2 fw-bold text-truncate ${obtainRarityBack(rare) || "bg-secondary text-white"}`}
          >
            {name}
          </Popover.Header>
          <Popover.Body className="p-2 small" style={{ userSelect: "text" }}>
            <p>{body}</p>
            <p className="mb-0 text-secondary fst-italic">
              <Link
                to={`/rarities/${rare}`}
                className={`text-truncate fw-bold text-decoration-none ${obtainRarityText(rare)}`}
              >
                Rarity {rare}
              </Link>{" "}
              • Created on {foot}
            </p>
          </Popover.Body>
        </Popover>
      }
    >
      <Col
        xs={3}
        md={diff ? 2 : 1}
        lg={diff ? 2 : 1}
        onMouseEnter={() => makeShow(true)}
        onMouseLeave={() => makeShow(false)}
      >
        <Link to={`/accolade/${iden}`} tabIndex="0">
          <Image src={shot} className="w-100 h-100" alt={name} />
        </Link>
      </Col>
    </OverlayTrigger>
  );
}
