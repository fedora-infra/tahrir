import { useRef, useState } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import BadgeSearchDropdown from "../../components/BadgeSearchDropdown.jsx";
import UserSearchDropdown from "../../components/UserSearchDropdown.jsx";
import { useDeletionSanctionMutation } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";

export default function AuthorizationDeletionForm() {
  const dispatch = useDispatch();
  const [deletionSanction, { isLoading }] = useDeletionSanctionMutation();
  const badgeRef = useRef(null);
  const userRef = useRef(null);

  const [form, makeForm] = useState({
    badge_id: "",
    user: "",
  });

  useLoadingState(isLoading);

  const handleTask = async () => {
    try {
      await deletionSanction(form).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Authorization was revoked successfully" }));
      makeForm({ badge_id: "", user: "" });
      badgeRef.current?.reset();
      userRef.current?.reset();
    } catch (error) {
      const msg = getApiErrorMessage(error, "authorization removal", {
        404: "Authorization not found or failed to remove",
        410: "Authorization has expired or been deleted",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Remove authorizations</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Revoke badge administration permissions from contributors</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <BadgeSearchDropdown
              ref={badgeRef}
              controlId="authRemoveBadge"
              label="Badge*"
              onSelect={(badge) => makeForm((prev) => ({ ...prev, badge_id: badge.id }))}
              required
            />
          </Col>
          <Col lg="6">
            <UserSearchDropdown
              ref={userRef}
              controlId="authRemoveUser"
              label="User*"
              onSelect={(user) => makeForm((prev) => ({ ...prev, user: user.nickname }))}
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
              disabled={!form.badge_id.trim() || !form.user.trim() || isLoading}
            >
              {isLoading ? "Removing..." : "Remove"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}