import { useRef, useState } from "react";
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import UserSearchDropdown from "../../components/UserSearchDropdown.jsx";
import { useDeletionQRInviteMutation, useRetrieveQRInviteQuery } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";
import { relativeImageUrl } from "../../features/util.js";

export default function InvitationDeletionForm() {
  const dispatch = useDispatch();
  const [deletionQRInvite, { isLoading }] = useDeletionQRInviteMutation();
  const userRef = useRef(null);
  const [invitationDropdownShow, makeInvitationDropdownShow] = useState(false);

  const [form, makeForm] = useState({
    username: "",
    invitation_id: "",
  });

  // Fetch invitations for the selected user
  const { data: userInvitations } = useRetrieveQRInviteQuery(form.username, {
    skip: !form.username.trim(),
  });

  useLoadingState(isLoading);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInvitationSelect = (invitation) => {
    makeForm((prev) => ({ ...prev, invitation_id: invitation.invitation_id }));
    makeInvitationDropdownShow(false);
  };

  const handleTask = async () => {
    try {
      await deletionQRInvite(form.invitation_id.trim()).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Invitation deleted successfully" }));
      makeForm({ username: "", invitation_id: "" });
      userRef.current?.reset();
      makeInvitationDropdownShow(false);
    } catch (error) {
      const msg = getApiErrorMessage(error, "invitation deletion", {
        404: "Invitation not found",
        410: "Invitation already expired or deleted",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  const hasInvitations =
    userInvitations &&
    Object.values(userInvitations).some((badge) => badge.invitations && badge.invitations.length > 0);

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Remove invitations</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Remove granting link with QR code</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <UserSearchDropdown
              ref={userRef}
              controlId="codeRemoveOwner"
              label="Owner*"
              onSelect={(user) =>
                makeForm((prev) => ({
                  ...prev,
                  username: user.nickname,
                  invitation_id: "",
                }))
              }
              required
            />
          </Col>
          <Col lg="6">
            <div className="position-relative">
              <FloatingLabel controlId="codeRemoveInvitation" label="Invitation ID*">
                <Form.Control
                  type="text"
                  value={
                    !form.username
                      ? "Select the owner first"
                      : !hasInvitations
                        ? "No invitations were found"
                        : form.invitation_id
                  }
                  onChange={(e) => {
                    if (hasInvitations) {
                      handleFormChange("invitation_id", e.target.value);
                      makeInvitationDropdownShow(true);
                    }
                  }}
                  onFocus={() => hasInvitations && makeInvitationDropdownShow(true)}
                  onBlur={() => setTimeout(() => makeInvitationDropdownShow(false), 150)}
                  disabled={!form.username || !hasInvitations}
                  readOnly={!form.username || !hasInvitations}
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
              {hasInvitations && invitationDropdownShow && (
                <Dropdown.Menu
                  show
                  className="position-absolute w-100 mt-1"
                  style={{ zIndex: 1050, maxHeight: "240px", overflowY: "auto" }}
                >
                  <Dropdown.Header className="small p-1">Invitations</Dropdown.Header>
                  {Object.entries(userInvitations).flatMap(([, badgeData]) =>
                    badgeData.invitations.map((invitation) => (
                      <Dropdown.Item
                        key={invitation.invitation_id}
                        onClick={() => handleInvitationSelect(invitation)}
                        className="small d-flex align-items-center p-1"
                      >
                        <Image
                          rounded={true}
                          src={relativeImageUrl(badgeData.image)}
                          width="40"
                          height="40"
                          className="me-2"
                        />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-bold text-truncate">{badgeData.name}</div>
                          <div className="small text-muted text-truncate">
                            {new Date(invitation.created_on * 1000).toLocaleString()} -{" "}
                            {new Date(invitation.expires_on * 1000).toLocaleString()}
                            {invitation.expired && <span className="text-danger ms-1">(Expired)</span>}
                          </div>
                        </div>
                      </Dropdown.Item>
                    ))
                  )}
                </Dropdown.Menu>
              )}
            </div>
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
              disabled={!form.username.trim() || !form.invitation_id.trim() || isLoading}
            >
              {isLoading ? "Removing..." : "Remove"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}