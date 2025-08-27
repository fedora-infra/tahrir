import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import CryptoJS from "crypto-js";
import Col from "react-bootstrap/Col";
import { Link } from "react-router";
import Image from "react-bootstrap/Image";

export default function AccoItem({ iden, name, body, foot, shot }) {
  return (
    <OverlayTrigger
      placement="auto"
      overlay={
        <Popover id={CryptoJS.SHA256(`over-${iden}`).toString()} className="bodyelem">
          <Popover.Header className="p-2">{name}</Popover.Header>
          <Popover.Body className="p-2 small">
            <p>{body}</p>
            <p className="mb-0 text-secondary fst-italic">{foot}</p>
          </Popover.Body>
        </Popover>
      }
    >
      <Col key={CryptoJS.SHA256(iden).toString()} xs={3} md={1} lg={1}>
        <Link to={`/discover/accolade/${iden}`}>
          <Image src={shot} className="w-100 h-100" alt={name} />
        </Link>
      </Col>
    </OverlayTrigger>
  );
}
