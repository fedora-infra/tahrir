import { useRef, useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import BadgeSearchDropdown from "../../components/BadgeSearchDropdown.jsx";
import UserSearchDropdown from "../../components/UserSearchDropdown.jsx";
import { useCreationQRInviteMutation } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";

export default function InvitationCreationForm() {
  const dispatch = useDispatch();
  const [creationQRInvite, { isLoading }] = useCreationQRInviteMutation();
  const badgeRef = useRef(null);
  const userRef = useRef(null);

  const [form, makeForm] = useState({
    badge_id: "",
    issuer_email: "",
    created_on: "",
    expires_on: "",
  });

  useLoadingState(isLoading);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTask = async () => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const data = {
        ...form,
        created_on: form.created_on ? Math.floor(new Date(form.created_on).getTime() / 1000) : now,
        expires_on: form.expires_on ? Math.floor(new Date(form.expires_on).getTime() / 1000) : now + 2 * 60 * 60,
      };
      await creationQRInvite(data).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Invitation was created successfully" }));
      makeForm({ badge_id: "", issuer_email: "", created_on: "", expires_on: "" });
      badgeRef.current?.reset();
      userRef.current?.reset();
    } catch (error) {
      const msg = getApiErrorMessage(error, "invitation creation", {
        404: "Badge or user unavailable",
        409: "Invitation entry already exists",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Create invitations</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Create granting link with QR code</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <BadgeSearchDropdown
              ref={badgeRef}
              controlId="inviCreateBadge"
              label="Badge*"
              onSelect={(badge) => makeForm((prev) => ({ ...prev, badge_id: badge.id }))}
              required
            />
          </Col>
          <Col lg="6">
            <UserSearchDropdown
              ref={userRef}
              controlId="inviCreateOwner"
              label="Owner*"
              onSelect={(user) => makeForm((prev) => ({ ...prev, issuer_email: user.nickname }))}
              required
            />
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="inviCreateFrom" label="Valid from">
              <Form.Control
                type="datetime-local"
                value={form.created_on}
                onChange={(e) => handleFormChange("created_on", e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="inviCreateThru" label="Valid thru">
              <Form.Control
                type="datetime-local"
                value={form.expires_on}
                onChange={(e) => handleFormChange("expires_on", e.target.value)}
              />
            </FloatingLabel>
          </Col>
        </Row>
        <hr className="mt-2 mb-2" />
        <p className="small ps-2 pe-2 m-0">
          Valid from defaults to <span className="fw-bold">current time</span> unless provided
        </p>
        <p className="small ps-2 pe-2 m-0">
          Valid thru defaults to <span className="fw-bold">two hours</span> from now unless provided
        </p>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-0 ms-1 me-1 g-2">
          <Col lg="12">
            <Button
              variant="outline-secondary"
              className="d-grid w-100 mb-2"
              size="sm"
              onClick={handleTask}
              disabled={!form.badge_id.trim() || !form.issuer_email.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}