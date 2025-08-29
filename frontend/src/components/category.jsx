import { Card, Row } from "react-bootstrap";

export default function Category({ name, wide, children }) {
  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
          {name}
        </Card.Title>
        <Card.Text className="mb-0 ps-2 small">{wide} badge(s)</Card.Text>
        <hr className="mt-2 mb-2" />
        <Row className="g-0 ps-2 pe-2 pb-2">{children}</Row>
      </Card.Body>
    </Card>
  );
}
