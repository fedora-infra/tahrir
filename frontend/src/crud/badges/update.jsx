import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";

export default function BadgeUpdateForm() {
  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Update badges</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Update badges that have been handed</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateName" label="Name">
              <Form.Control type="text" />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateDesc" label="Description">
              <Form.Control type="text" />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateShot" label="Image">
              <Form.Control type="url" />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateCrit" label="Criteria">
              <Form.Control type="url" />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateAuth" label="Issuer">
              <Form.Control type="text" value="Fedora Project" />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateTags" label="Tags">
              <Form.Control type="text" />
            </FloatingLabel>
          </Col>
        </Row>
        <hr className="mt-2 mb-2" />
        <p className="small ps-2 pe-2 m-0">
          Item identified by <span className="fw-bold">identity</span>
        </p>
        <p className="small ps-2 pe-2 m-0">
          Item created on <span className="fw-bold">December 12, 2025 at 00:00 AM GMT+5:30</span>
        </p>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-0 ms-1 me-1 g-2">
          <Col lg="6">
            <Button variant="outline-secondary" className="d-grid w-100" size="sm">
              Update
            </Button>
          </Col>
          <Col lg="6">
            <Button variant="outline-secondary" className="d-grid w-100 mb-2" size="sm">
              Deactivate
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
