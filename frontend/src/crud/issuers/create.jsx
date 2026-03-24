import { useEffect, useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { useCreationIssuerMutation } from "../../features/call.js";
import { hideLoad, showBaseNote, showLoad } from "../../features/part.js";

export default function IssuerCreationForm() {
  const dispatch = useDispatch();
  const [creationIssuer, { isLoading }] = useCreationIssuerMutation();

  const [form, makeForm] = useState({
    name: "",
    origin: "",
    org: "",
    contact: "",
  });

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [isLoading, dispatch]);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTask = async () => {
    try {
      await creationIssuer(form).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Issuer was created successfully" }));
      makeForm({
        name: "",
        origin: "",
        org: "",
        contact: "",
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
          expt = "Conflicting with existing issuer";
          break;
        case 500:
          expt = "Attempt creation again later";
          break;
        default:
          expt = "Failed during user creation";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Create issuers</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Create issuers that issue badges</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <FloatingLabel controlId="issuerName" label="Name">
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                autoComplete="off"
                placeholder="Issuer Name"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="issuerOrigin" label="Origin URL">
              <Form.Control
                type="text"
                value={form.origin}
                onChange={(e) => handleFormChange("origin", e.target.value)}
                autoComplete="off"
                placeholder="Origin"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="issuerOrg" label="Organization">
              <Form.Control
                type="text"
                value={form.org}
                onChange={(e) => handleFormChange("org", e.target.value)}
                placeholder="Organization"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="issuerContact" label="Contact">
              <Form.Control
                type="text"
                value={form.contact}
                onChange={(e) => handleFormChange("contact", e.target.value)}
                placeholder="Contact"
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
              disabled={!form.name.trim() || !form.origin.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
