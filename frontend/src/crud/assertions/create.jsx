import { useRef, useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import BadgeSearchDropdown from "../../components/BadgeSearchDropdown.jsx";
import UserSearchDropdown from "../../components/UserSearchDropdown.jsx";
import { useCreationAvermentMutation } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";

import { showBaseNote } from "../../features/part.js";

export default function AssertionCreationForm() {
  const dispatch = useDispatch();
  const [creationAverment, { isLoading }] = useCreationAvermentMutation();
  const badgeRef = useRef(null);
  const userRef = useRef(null);

  const [form, makeForm] = useState({
    badge_id: "",
    username: "",
    issued_on: "",
    issued_for: "",
  });

  useLoadingState(isLoading);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTask = async () => {
    try {
      const data = {
        ...form,
        issued_on: form.issued_on ? new Date(form.issued_on).getTime() / 1000 : Math.floor(Date.now() / 1000),
        issued_for: form.issued_for || "",
      };
      await creationAverment(data).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Badge awarded successfully" }));
      makeForm({ badge_id: "", username: "", issued_on: "", issued_for: "" });
      badgeRef.current?.reset();
      userRef.current?.reset();
    } catch (error) {
      const msg = getApiErrorMessage(error, "awarding", {
        404: "Badge or user unavailable",
        409: "Badge already awarded to this user",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Create assertions</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Felicitate participants on performing contributing activities</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <BadgeSearchDropdown
              ref={badgeRef}
              controlId="assertCreateBadge"
              label="Badge*"
              onSelect={(badge) => makeForm((prev) => ({ ...prev, badge_id: badge.id }))}
              required
            />
          </Col>
          <Col lg="6">
            <UserSearchDropdown
              ref={userRef}
              controlId="assertCreateUser"
              label="User*"
              onSelect={(user) => makeForm((prev) => ({ ...prev, username: user.nickname }))}
              required
            />
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="assertCreateDate" label="Date">
              <Form.Control
                type="datetime-local"
                value={form.issued_on}
                onChange={(e) => handleFormChange("issued_on", e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="assertCreateGoal" label="Reason">
              <Form.Control
                type="text"
                value={form.issued_for}
                onChange={(e) => handleFormChange("issued_for", e.target.value)}
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
              disabled={!form.badge_id.trim() || !form.username.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
