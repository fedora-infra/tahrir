import { useState } from "react";
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { useDeletionQRInviteMutation, useLookupIdentityQuery, useRetrieveQRInviteQuery } from "../../features/call.js";
import { showBaseNote } from "../../features/part.js";
import { useLoadingState } from "../../features/hooks.js";
import { portraitProvider, relativeImageUrl } from "../../features/util.js";

export default function InvitationDeletionForm() {
  const dispatch = useDispatch();
  const [deletionQRInvite, { isLoading }] = useDeletionQRInviteMutation();
  const [identitySearch, makeIdentitySearch] = useState("");
  const [identityDropdownShow, makeIdentityDropdownShow] = useState(false);
  const [invitationDropdownShow, makeInvitationDropdownShow] = useState(false);

  const { data: identityResult } = useLookupIdentityQuery(identitySearch, {
    skip: identitySearch.length < 4,
  });

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

  const handleIdentitySelect = (identity) => {
    makeIdentitySearch(identity.nickname);
    makeForm((prev) => ({
      ...prev,
      username: identity.nickname,
      invitation_id: "", // Reset invitation selection when user changes
    }));
    makeIdentityDropdownShow(false);
  };

  const handleInvitationSelect = (invitation) => {
    makeForm((prev) => ({ ...prev, invitation_id: invitation.invitation_id }));
    makeInvitationDropdownShow(false);
  };

  const handleTask = async () => {
    try {
      // Use the specific invitation ID for deletion
      await deletionQRInvite(form.invitation_id.trim()).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Invitation deleted successfully" }));
      makeForm({
        username: "",
        invitation_id: "",
      });
      makeIdentitySearch("");
      makeIdentityDropdownShow(false);
      makeInvitationDropdownShow(false);
    } catch (error) {
      let expt;
      switch (error?.status) {
        case 400:
          expt = "Verify the requested fields";
          break;
        case 401:
          expt = "Try authenticating before deleting invitation";
          break;
        case 403:
          expt = "Ensure permissions are available";
          break;
        case 404:
          expt = "Invitation not found";
          break;
        case 410:
          expt = "Invitation already expired or deleted";
          break;
        case 500:
          expt = "Attempt deleting again later";
          break;
        default:
          expt = "Failed during invitation deletion";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Remove invitations</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Remove granting link with QR code</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <div className="position-relative">
              <FloatingLabel controlId="codeRemoveOwner" label="Owner*">
                <Form.Control
                  type="text"
                  value={identitySearch}
                  onChange={(e) => {
                    makeIdentitySearch(e.target.value);
                    makeIdentityDropdownShow(e.target.value.length >= 4);
                  }}
                  onFocus={() => identitySearch.length >= 4 && makeIdentityDropdownShow(true)}
                  onBlur={() => setTimeout(() => makeIdentityDropdownShow(false), 150)}
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
              {identitySearch.length >= 4 &&
                identityResult &&
                identityResult.users &&
                identityResult.users.length > 0 &&
                identityDropdownShow && (
                  <Dropdown.Menu show className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
                    <Dropdown.Header className="small p-1">Users</Dropdown.Header>
                    {identityResult.users.slice(0, 8).map((identity) => (
                      <Dropdown.Item
                        key={identity.id}
                        onClick={() => handleIdentitySelect(identity)}
                        className="small d-flex align-items-center p-1"
                      >
                        <Image
                          rounded={true}
                          src={portraitProvider(identity.email, 40)}
                          width="40"
                          height="40"
                          className="me-2"
                        />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-bold text-truncate">{identity.nickname}</div>
                          <div className="small text-muted text-truncate">#{identity.rank}</div>
                        </div>
                      </Dropdown.Item>
                    ))}
                    {identityResult.users.length > 8 && (
                      <Dropdown.Item disabled className="small text-muted p-1">
                        +{identityResult.users.length - 8} more users
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                )}
            </div>
          </Col>
          <Col lg="6">
            <div className="position-relative">
              <FloatingLabel controlId="codeRemoveInvitation" label="Invitation ID*">
                <Form.Control
                  type="text"
                  value={
                    !form.username
                      ? "Select the owner first"
                      : !userInvitations ||
                          !Object.values(userInvitations).some(
                            (badge) => badge.invitations && badge.invitations.length > 0
                          )
                        ? "No invitations were found"
                        : form.invitation_id
                  }
                  onChange={(e) => {
                    const hasInvitations =
                      userInvitations &&
                      Object.values(userInvitations).some((badge) => badge.invitations && badge.invitations.length > 0);
                    if (hasInvitations) {
                      handleFormChange("invitation_id", e.target.value);
                      makeInvitationDropdownShow(true);
                    }
                  }}
                  onFocus={() => {
                    const hasInvitations =
                      userInvitations &&
                      Object.values(userInvitations).some((badge) => badge.invitations && badge.invitations.length > 0);
                    hasInvitations && makeInvitationDropdownShow(true);
                  }}
                  onBlur={() => setTimeout(() => makeInvitationDropdownShow(false), 150)}
                  disabled={
                    !form.username ||
                    !userInvitations ||
                    !Object.values(userInvitations).some((badge) => badge.invitations && badge.invitations.length > 0)
                  }
                  readOnly={
                    !form.username ||
                    !userInvitations ||
                    !Object.values(userInvitations).some((badge) => badge.invitations && badge.invitations.length > 0)
                  }
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
              {userInvitations &&
                Object.values(userInvitations).some((badge) => badge.invitations && badge.invitations.length > 0) &&
                invitationDropdownShow && (
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
