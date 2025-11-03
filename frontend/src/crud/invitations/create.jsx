import { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { useCreationQRInviteMutation, useLookupAccoladeQuery, useLookupIdentityQuery } from "../../features/call.js";
import { hideLoad, showBaseNote, showLoad } from "../../features/part.js";
import { portraitProvider } from "../../features/util.js";

export default function InvitationCreationForm() {
  const dispatch = useDispatch();
  const [creationQRInvite, { isLoading }] = useCreationQRInviteMutation();
  const [accoladeLookup, makeAccoladeLookup] = useState("");
  const [identityLookup, makeIdentityLookup] = useState("");
  const [accoladeDropdownShow, makeAccoladeDropdownShow] = useState(false);
  const [identityDropdownShow, makeIdentityDropdownShow] = useState(false);

  const { data: accoladeResult } = useLookupAccoladeQuery(accoladeLookup, {
    skip: accoladeLookup.length < 4,
  });
  const { data: identityResult } = useLookupIdentityQuery(identityLookup, {
    skip: identityLookup.length < 4,
  });

  const [form, makeForm] = useState({
    badge_id: "",
    issuer_email: "",
    created_on: "",
    expires_on: "",
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

  const handleAccoladeSelect = (accolade) => {
    makeAccoladeLookup(accolade.name);
    makeForm((prev) => ({ ...prev, badge_id: accolade.id }));
    makeAccoladeDropdownShow(false);
  };

  const handleIdentitySelect = (identity) => {
    makeIdentityLookup(identity.nickname);
    makeForm((prev) => ({ ...prev, issuer_email: identity.nickname }));
    makeIdentityDropdownShow(false);
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
      makeForm({
        badge_id: "",
        issuer_email: "",
        created_on: "",
        expires_on: "",
      });
      makeAccoladeLookup("");
      makeIdentityLookup("");
      makeAccoladeDropdownShow(false);
      makeIdentityDropdownShow(false);
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
        case 404:
          expt = "Badge or user unavailable";
          break;
        case 409:
          expt = "Invitation entry already exists";
          break;
        case 500:
          expt = "Attempt creating again later";
          break;
        default:
          expt = "Failed during invitation creation";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
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
            <div className="position-relative">
              <FloatingLabel controlId="inviCreateBadge" label="Badge*">
                <Form.Control
                  type="text"
                  value={accoladeLookup}
                  onChange={(e) => {
                    makeAccoladeLookup(e.target.value);
                    makeAccoladeDropdownShow(e.target.value.length >= 4);
                  }}
                  onFocus={() => accoladeLookup.length >= 4 && makeAccoladeDropdownShow(true)}
                  onBlur={() => setTimeout(() => makeAccoladeDropdownShow(false), 150)}
                  required
                />
              </FloatingLabel>
              {accoladeLookup.length >= 4 &&
                accoladeResult &&
                accoladeResult.badges &&
                accoladeResult.badges.length > 0 &&
                accoladeDropdownShow && (
                  <Dropdown.Menu show className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
                    <Dropdown.Header className="small p-1">Badges</Dropdown.Header>
                    {accoladeResult.badges.slice(0, 8).map((accolade) => (
                      <Dropdown.Item
                        key={accolade.id}
                        onClick={() => handleAccoladeSelect(accolade)}
                        className="small d-flex align-items-center p-1"
                      >
                        <Image
                          rounded={true}
                          src={accolade.image.toString().replace("https://badges.fedoraproject.org", "")}
                          width="40"
                          height="40"
                          className="me-2"
                        />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-bold text-truncate">{accolade.name}</div>
                          <div className="small text-muted text-truncate">{accolade.description}</div>
                        </div>
                      </Dropdown.Item>
                    ))}
                    {accoladeResult.badges.length > 8 && (
                      <Dropdown.Item disabled className="small text-muted p-1">
                        +{accoladeResult.badges.length - 8} more badges
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                )}
            </div>
          </Col>
          <Col lg="6">
            <div className="position-relative">
              <FloatingLabel controlId="inviCreateOwner" label="Owner*">
                <Form.Control
                  type="text"
                  value={identityLookup}
                  onChange={(e) => {
                    makeIdentityLookup(e.target.value);
                    makeIdentityDropdownShow(e.target.value.length >= 4);
                  }}
                  onFocus={() => identityLookup.length >= 4 && makeIdentityDropdownShow(true)}
                  onBlur={() => setTimeout(() => makeIdentityDropdownShow(false), 150)}
                  required
                />
              </FloatingLabel>
              {identityLookup.length >= 4 &&
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
