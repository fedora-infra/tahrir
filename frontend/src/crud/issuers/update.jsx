import { useEffect, useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { useUpdationIssuerMutation } from "../../features/call.js";
import { hideLoad, showBaseNote, showLoad } from "../../features/part.js";

export default function IssuerUpdateForm() {
  const dispatch = useDispatch();
  const [updationIssuer, { isLoading }] = useUpdationIssuerMutation();

  const [form, makeForm] = useState({
    id: "",
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

  const handleUpdate = async () => {
    if (!form.id) {
      dispatch(showBaseNote({ pass: false, data: "No issuer ID provided" }));
      return;
    }

    try {
      const filldata = {
        name: form.name.trim(),
        origin: form.origin.trim(),
        org: form.org.trim(),
        contact: form.contact.trim(),
      };

      const updateData = Object.fromEntries(
        Object.entries(filldata).filter(([, value]) => value !== "")
      );

      await updationIssuer({
        issuer_id: form.id,
        filldata: updateData,
      }).unwrap();

      dispatch(showBaseNote({ pass: true, data: "Issuer updated successfully" }));
    } catch (error) {
      let expt;
      switch (error?.status) {
        case 400:
          expt = "Verify the requested fields";
          break;
        case 401:
          expt = "Try authenticating before updating";
          break;
        case 403:
          expt = "Ensure permissions are available";
          break;
        case 404:
          expt = "Issuer not found";
          break;
        case 500:
          expt = "Attempt update again later";
          break;
        default:
          expt = "Failed during issuer update";
      }

      dispatch(showBaseNote({ pass: false, data: expt }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Update issuers</Card.Title>
        <Card.Text className="mb-0 ps-2 small">
          Update issuer information
        </Card.Text>

        <hr className="mt-2 mb-0" />

        <Row className="mt-0 mb-2 ms-1 me-1 g-2">

          <Col lg="6">
            <FloatingLabel controlId="issuerId" label="Issuer ID">
              <Form.Control
                type="number"
                value={form.id}
                onChange={(e) => handleFormChange("id", e.target.value)}
                placeholder="Issuer ID"
              />
            </FloatingLabel>
          </Col>

          <Col lg="6">
            <FloatingLabel controlId="issuerName" label="Name">
              <Form.Control
                type="text"
                value={form.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                placeholder="Name"
              />
            </FloatingLabel>
          </Col>

          <Col lg="6">
            <FloatingLabel controlId="issuerOrigin" label="Origin">
              <Form.Control
                type="text"
                value={form.origin}
                onChange={(e) => handleFormChange("origin", e.target.value)}
                placeholder="Origin"
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
              />
            </FloatingLabel>
          </Col>

          <Col lg="12">
            <FloatingLabel controlId="issuerContact" label="Contact">
              <Form.Control
                type="text"
                value={form.contact}
                onChange={(e) => handleFormChange("contact", e.target.value)}
                placeholder="Contact"
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
              onClick={handleUpdate}
              disabled={!form.id || isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </Col>
        </Row>

      </Card.Body>
    </Card>
  );
}