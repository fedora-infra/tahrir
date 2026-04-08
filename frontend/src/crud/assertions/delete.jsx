import { useRef, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import BadgeSearchDropdown from "../../components/BadgeSearchDropdown.jsx";
import UserSearchDropdown from "../../components/UserSearchDropdown.jsx";
import { useDeletionAvermentMutation } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";

export default function AssertionDeleteForm() {
  const dispatch = useDispatch();
  const [deletionAverment, { isLoading }] = useDeletionAvermentMutation();
  const badgeRef = useRef(null);
  const userRef = useRef(null);

  const [form, setForm] = useState({
    badge_id: "",
    username: "",
  });

  useLoadingState(isLoading);

  const handleTask = async () => {
    try {
      await deletionAverment({
        badge_id: form.badge_id.trim(),
        username: form.username.trim(),
      }).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Badge assertion removed successfully" }));
      setForm({ badge_id: "", username: "" });
      badgeRef.current?.reset();
      userRef.current?.reset();
    } catch (error) {
      const msg = getApiErrorMessage(error, "assertion removal", {
        404: "Badge, user, or assertion not found",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Remove assertions</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Remedy mistaken awards made toward contributors</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <BadgeSearchDropdown
              ref={badgeRef}
              controlId="feliRemoveAcco"
              label="Badge*"
              onSelect={(badge) => setForm((prev) => ({ ...prev, badge_id: badge.id }))}
              required
            />
          </Col>
          <Col lg="6">
            <UserSearchDropdown
              ref={userRef}
              controlId="feliRemoveUser"
              label="User*"
              onSelect={(user) => setForm((prev) => ({ ...prev, username: user.nickname }))}
              required
            />
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
              {isLoading ? "Removing..." : "Remove"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}