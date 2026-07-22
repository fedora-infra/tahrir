import { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { LookSpin } from "../../components/lookspin.jsx";
import { useLookupAccoladeQuery, useRetrieveAccoladeQuery, useUpdationAccoladeMutation } from "../../features/call.js";
import { useLoadingState, useMinFetching } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";
import { formatTime, relativeImageUrl } from "../../features/util.js";

export default function BadgeUpdateForm() {
  const dispatch = useDispatch();
  const { slugdata: accolade } = useParams();
  const [updationAccolade, { isLoading: isUpdating }] = useUpdationAccoladeMutation();

  const [form, makeForm] = useState({
    name: "",
    description: "",
    image: "",
    criteria: "",
    tags: "",
    created_on: "",
    id: "",
    legacy: false,
  });

  const [accoladeLookup, setAccoladeLookup] = useState("");
  const [accoladeDropdownShow, setAccoladeDropdownShow] = useState(false);

  const {
    data: badge,
    isLoading: isFetching,
    error: fetchError,
  } = useRetrieveAccoladeQuery(accolade, {
    skip: !accolade,
  });

  const { data: accoladeResult, isFetching: isAccoladeFetching } = useLookupAccoladeQuery(accoladeLookup, {
    skip: accoladeLookup.length < 4,
  });

  const showAccoladeSpinner = useMinFetching(isAccoladeFetching);

  useLoadingState(isFetching, isUpdating);

  useEffect(() => {
    if (badge) {
      makeForm({
        name: badge.name || "",
        description: badge.description || "",
        image: badge.image || "",
        criteria: badge.criteria || "",
        tags: Array.isArray(badge.tags) ? badge.tags.join(", ") : badge.tags || "",
        created_on: badge.created_on || "",
        id: badge.id || "",
        legacy: badge.legacy || false,
      });
      setAccoladeLookup(badge.name || "");
    }
  }, [badge]);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccoladeSelect = (accolade) => {
    makeForm({
      name: accolade.name || "",
      description: accolade.description || "",
      image: accolade.image || "",
      criteria: accolade.criteria || "",
      tags: Array.isArray(accolade.tags) ? accolade.tags.join(", ") : accolade.tags || "",
      created_on: accolade.created_on || "",
      id: accolade.id || "",
      legacy: accolade.legacy || false,
    });
    setAccoladeLookup(accolade.name || "");
    setAccoladeDropdownShow(false);
  };

  const handleUpdate = async () => {
    if (!form.id) {
      dispatch(showBaseNote({ pass: false, data: "No badge selected" }));
      return;
    }

    try {
      const filldata = {
        name: form.name.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        criteria: form.criteria.trim(),
        tags: form.tags.trim(),
      };
      const updateData = Object.fromEntries(Object.entries(filldata).filter(([, value]) => value !== ""));
      await updationAccolade({ accolade: form.id, filldata: updateData }).unwrap();
      dispatch(showBaseNote({ pass: true, data: "Badge was updated successfully" }));
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
          expt = "Badge not found";
          break;
        case 500:
          expt = "Attempt update again later";
          break;
        default:
          expt = "Failed during badge update";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
    }
  };

  const handleToggleLegacy = async () => {
    try {
      const swapLegacy = !form.legacy;
      await updationAccolade({ accolade: form.id, filldata: { legacy: swapLegacy } }).unwrap();
      makeForm((prev) => ({ ...prev, legacy: swapLegacy }));
      dispatch(
        showBaseNote({ pass: true, data: `Badge status ${swapLegacy ? "deactivated" : "activated"} successfully` })
      );
    } catch {
      dispatch(showBaseNote({ pass: false, data: "Failed during status change" }));
    }
  };

  if (fetchError) {
    return (
      <Card className="mb-2">
        <Card.Body className="ps-2 pe-2 pt-2 pb-2">
          <Card.Title className="text-danger">Error</Card.Title>
          <Card.Text>
            Failed to load badge data. Badge may not exist or you may not have permission to view it.
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Update badges</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Update badges that have been handed</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <div className="position-relative">
              <FloatingLabel controlId="accoUpdateName" label="Name">
                <Form.Control
                  type="text"
                  value={accoladeLookup}
                  onChange={(e) => {
                    setAccoladeLookup(e.target.value);
                    handleFormChange("name", e.target.value);
                    setAccoladeDropdownShow(e.target.value.length >= 4);
                    if (e.target.value === "") {
                      makeForm({
                        name: "",
                        description: "",
                        image: "",
                        criteria: "",
                        tags: "",
                        created_on: "",
                        id: "",
                        legacy: false,
                      });
                    }
                  }}
                  onFocus={() => accoladeLookup.length >= 4 && setAccoladeDropdownShow(true)}
                  onBlur={() => setTimeout(() => setAccoladeDropdownShow(false), 150)}
                  placeholder="Name"
                  autoComplete="off"
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
            <FloatingLabel controlId="accoUpdateDesc" label="Description">
              <Form.Control
                type="text"
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Description"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateShot" label="Image URL">
              <Form.Control
                type="url"
                value={form.image}
                onChange={(e) => handleFormChange("image", e.target.value)}
                placeholder="Image URL"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateCrit" label="Criteria URL">
              <Form.Control
                type="url"
                value={form.criteria}
                onChange={(e) => handleFormChange("criteria", e.target.value)}
                placeholder="Criteria URL"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateAuth" label="Issuer">
              <Form.Control type="text" value="Fedora Project" readOnly />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateTags" label="Comma Separated Tags">
              <Form.Control
                type="text"
                value={form.tags}
                onChange={(e) => handleFormChange("tags", e.target.value)}
                placeholder="Comma Separated Tags"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
        </Row>
        <hr className="mt-2 mb-2" />
        <p className="small ps-2 pe-2 m-0">
          Item identified by <span className="fw-bold">{form.id || "ABSENT"}</span>
        </p>
        <p className="small ps-2 pe-2 m-0">
          Item created on <span className="fw-bold">{form.created_on ? formatTime(form.created_on) : "ABSENT"}</span>
        </p>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-0 ms-1 me-1 g-2">
          <Col lg="6">
            <Button
              variant="outline-secondary"
              className="d-grid w-100"
              size="sm"
              onClick={handleUpdate}
              disabled={isUpdating || isFetching || !form.id}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </Col>
          <Col lg="6">
            <Button
              variant="outline-secondary"
              className="d-grid w-100 mb-2"
              size="sm"
              onClick={handleToggleLegacy}
              disabled={isUpdating || !form.id}
            >
              {isUpdating ? "Processing..." : form.legacy ? "Activate" : "Deactivate"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
