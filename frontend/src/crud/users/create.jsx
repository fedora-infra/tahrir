import { useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { useCreationIdentityMutation } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";

export default function UserCreationForm() {
  const dispatch = useDispatch();
  const [creationIdentity, { isLoading }] = useCreationIdentityMutation();

  const [form, makeForm] = useState({
    nickname: "",
    email: "",
    website: "",
    bio: "",
    avatar: "",
  });

  useLoadingState(isLoading);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTask = async () => {
    try {
      await creationIdentity(form).unwrap();
      dispatch(showBaseNote({ pass: true, data: "User was created successfully" }));
      makeForm({ nickname: "", email: "", website: "", bio: "", avatar: "" });
    } catch (error) {
      const msg = getApiErrorMessage(error, "user creation", {
        409: "Conflicting with existing user",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Create users</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Create accounts that will obtain felicitation</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <FloatingLabel controlId="userCreateName" label="Nickname">
              <Form.Control
                type="text"
                value={form.nickname}
                onChange={(e) => handleFormChange("nickname", e.target.value)}
                autoComplete="off"
                placeholder="Nickname"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="userCreateMail" label="Email">
              <Form.Control
                type="email"
                value={form.email}
                onChange={(e) => handleFormChange("email", e.target.value)}
                autoComplete="off"
                placeholder="Email"
                required
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="userCreateWebsite" label="Website">
              <Form.Control
                type="text"
                value={form.website}
                onChange={(e) => handleFormChange("website", e.target.value)}
                placeholder="Website"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="userCreateAvatar" label="Avatar URL">
              <Form.Control
                type="text"
                value={form.avatar}
                onChange={(e) => handleFormChange("avatar", e.target.value)}
                placeholder="Avatar URL"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="12">
            <FloatingLabel controlId="userCreateBio" label="Biography">
              <Form.Control
                type="text"
                value={form.bio}
                onChange={(e) => handleFormChange("bio", e.target.value)}
                placeholder="Biography"
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
              disabled={!form.nickname.trim() || !form.email.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}