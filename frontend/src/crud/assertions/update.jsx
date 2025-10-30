import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { Link } from "react-router";

export default function AssertionUpdateForm() {
  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Remove assertions</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Remedy mistaken awards made toward contributors</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <FloatingLabel controlId="feliRemoveAcco" label="Badge">
              <Form.Control type="text" />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="feliRemoveUser" label="User">
              <Form.Control type="text" />
            </FloatingLabel>
          </Col>
        </Row>
        <hr className="mt-2 mb-0" />
        <Button as={Link} to="" variant="outline-secondary" className="d-grid m-2" size="sm">
          Remove
        </Button>
      </Card.Body>
    </Card>
  );
}
