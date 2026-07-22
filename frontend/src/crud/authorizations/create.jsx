import { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { LookSpin } from "../../components/lookspin.jsx";
import { useCreationSanctionMutation, useLookupAccoladeQuery, useLookupIdentityQuery } from "../../features/call.js";
import { useLoadingState, useMinFetching } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";
import { portraitProvider, relativeImageUrl } from "../../features/util.js";

export default function AuthorizationCreationForm() {
  const dispatch = useDispatch();
  const [creationSanction, { isLoading }] = useCreationSanctionMutation();

  const [form, makeForm] = useState({
    badge_id: "",
    user: "",
  });

  const [accoladeLookup, setAccoladeLookup] = useState("");
  const [identityLookup, setIdentityLookup] = useState("");
  const [accoladeDropdownShow, setAccoladeDropdownShow] = useState(false);
  const [identityDropdownShow, setIdentityDropdownShow] = useState(false);

  const { data: accoladeResult, isFetching: isAccoladeFetching } = useLookupAccoladeQuery(accoladeLookup, {
    skip: accoladeLookup.length < 4,
  });
  const { data: identityResult, isFetching: isIdentityFetching } = useLookupIdentityQuery(identityLookup, {
    skip: identityLookup.length < 4,
  });

  const showAccoladeSpinner = useMinFetching(isAccoladeFetching);
  const showIdentitySpinner = useMinFetching(isIdentityFetching);

  // Debug logging for search results
  useEffect(() => {
    if (accoladeResult) {
      console.log("Badge search results for '" + accoladeLookup + "':", JSON.stringify(accoladeResult, null, 2));
    }
  }, [accoladeResult, accoladeLookup]);

  useEffect(() => {
    if (identityResult) {
      console.log("User search results for '" + identityLookup + "':", JSON.stringify(identityResult, null, 2));
    }
  }, [identityResult, identityLookup]);

  useLoadingState(isLoading);

  const handleAccoladeSelect = (accolade) => {
    console.log("Selected badge:", JSON.stringify(accolade, null, 2));
    setAccoladeLookup(accolade.name);
    makeForm((prev) => ({ ...prev, badge_id: accolade.id }));
    setAccoladeDropdownShow(false);
  };

  const handleIdentitySelect = (identity) => {
    console.log("Selected user:", JSON.stringify(identity, null, 2));
    setIdentityLookup(identity.nickname);
    makeForm((prev) => ({ ...prev, user: identity.nickname }));
    setIdentityDropdownShow(false);
  };

  const handleTask = async () => {
    try {
      console.log("Submitting authorization data:", JSON.stringify(form, null, 2));
      await creationSanction(form).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Authorization was created successfully" }));
      makeForm({
        badge_id: "",
        user: "",
      });
      setAccoladeLookup("");
      setIdentityLookup("");
      setAccoladeDropdownShow(false);
      setIdentityDropdownShow(false);
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
          expt = "Conflicting with existing authorization";
          break;
        case 500:
          expt = "Attempt creation again later";
          break;
        default:
          expt = "Failed during authorization creation";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
    }
  };

  return (
    <Card>
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Create authorizations</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Permit contributors to felicitate fellow participants</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <div className="position-relative">
              <FloatingLabel controlId="authCreateBadge" label="Badge*">
                <Form.Control
                  type="text"
                  value={accoladeLookup}
                  onChange={(e) => {
                    setAccoladeLookup(e.target.value);
                    setAccoladeDropdownShow(e.target.value.length >= 4);
                  }}
                  onFocus={() => accoladeLookup.length >= 4 && setAccoladeDropdownShow(true)}
                  onBlur={() => setTimeout(() => setAccoladeDropdownShow(false), 150)}
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
              {showAccoladeSpinner && <LookSpin />}
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
                          src={relativeImageUrl(accolade.image)}
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
              <FloatingLabel controlId="authCreateUser" label="User*">
                <Form.Control
                  type="text"
                  value={identityLookup}
                  onChange={(e) => {
                    setIdentityLookup(e.target.value);
                    setIdentityDropdownShow(e.target.value.length >= 4);
                  }}
                  onFocus={() => identityLookup.length >= 4 && setIdentityDropdownShow(true)}
                  onBlur={() => setTimeout(() => setIdentityDropdownShow(false), 150)}
                  autoComplete="off"
                  required
                />
              </FloatingLabel>
              {showIdentitySpinner && <LookSpin />}
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
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
