import { useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { useCreationAccoladeMutation } from "../../features/call.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";

export default function BadgeCreationForm() {
  const dispatch = useDispatch();
  const [creationAccolade, { isLoading }] = useCreationAccoladeMutation();

  const [form, makeForm] = useState({
    name: "",
    description: "",
    image: "",
    criteria: "",
    issuer_id: 1, // Default to issuer ID 1
    tags: "",
  });

  useLoadingState(isLoading);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTask = async () => {
    try {
      await creationAccolade(form).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Badge was created successfully" }));
      makeForm({
        name: "",
        description: "",
        image: "",
        criteria: "",
        issuer_id: 1,
        tags: "",
      });
    } catch (error) {
      let expt;
      switch (error?.status) {
        case 400:
          expt = "Verify the requested fields";
          break;
        case 401:
          expt = "Try authenticating before creating";
          break;
        case 403:
          expt = "Ensure permissions are available";
          break;
        case 409:
          expt = "Conflicting with existing badge";
          break;
        case 500:
          expt = "Attempt creation again later";
          break;
        default:
          expt = "Failed during badge creation";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Create badges</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Create badges that will be handed</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <FloatingLabel controlId="accoCreateName" label="Name">
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Name"
                autoComplete="off"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoCreateDesc" label="Description">
              <Form.Control
                type="text"
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Description"
                autoComplete="off"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoCreateShot" label="Image URL">
              <Form.Control
                type="url"
                value={form.image}
                onChange={(e) => handleFormChange("image", e.target.value)}
                placeholder="Image URL"
                autoComplete="off"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoCreateCrit" label="Criteria URL">
              <Form.Control
                type="text"
                value={form.criteria}
                onChange={(e) => handleFormChange("criteria", e.target.value)}
                placeholder="Criteria URL"
                autoComplete="off"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoCreateAuth" label="Issuer">
              <Form.Control type="text" value="Fedora Project" readOnly />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoCreateTags" label="Comma Separated Tags">
              <Form.Control
                type="text"
                value={form.tags}
                onChange={(e) => handleFormChange("tags", e.target.value)}
                placeholder="Comma Separated Tags"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-0 ms-1 me-1 g-2">
          <Col lg="12">
            <Button
              variant="outline-secondary"
              className="d-grid w-100 mb-2"
              size="sm"
              onClick={handleTask}
              disabled={
                !form.name.trim() ||
                !form.description.trim() ||
                !form.image.trim() ||
                !form.criteria.trim() ||
                isLoading
              }
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
