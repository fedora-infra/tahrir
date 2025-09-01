import { Col, Image, OverlayTrigger, Popover } from "react-bootstrap";
import { Link } from "react-router";

export default function AccoItem({ iden, name, body, foot, shot }) {
  return (
    <OverlayTrigger
      placement="auto"
      overlay={
        <Popover className="bodyelem">
          <Popover.Header className="p-2">{name}</Popover.Header>
          <Popover.Body className="p-2 small">
            <p>{body}</p>
            <p className="mb-0 text-secondary fst-italic">{foot}</p>
          </Popover.Body>
        </Popover>
      }
    >
      <Col xs={3} md={1} lg={1}>
        <Link to={`/accolade/${iden}`}>
          <Image src={shot} className="w-100 h-100" alt={name} />
        </Link>
      </Col>
    </OverlayTrigger>
  );
}
