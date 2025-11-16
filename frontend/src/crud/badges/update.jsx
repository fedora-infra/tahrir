import { useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import { useLookupAccoladeQuery, useRetrieveAccoladeQuery, useUpdationAccoladeMutation } from "../../features/call.js";
import { hideLoad, showBaseNote, showLoad } from "../../features/part.js";
import { formatTime } from "../../features/util.js";

export default function BadgeUpdateForm() {
  const dispatch = useDispatch();
  const { slugdata: accolade } = useParams();
  const [updationAccolade, { isLoading: isUpdating }] = useUpdationAccoladeMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    criteria: "",
    tags: "",
    created_on: "",
    id: "",
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

  const { data: accoladeResult } = useLookupAccoladeQuery(accoladeLookup, {
    skip: accoladeLookup.length < 4,
  });

  useEffect(() => {
    if (isFetching || isUpdating) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [isFetching, isUpdating, dispatch]);

  useEffect(() => {
    if (badge) {
      setForm({
        name: badge.name || "",
        description: badge.description || "",
        image: badge.image || "",
        criteria: badge.criteria || "",
        tags: Array.isArray(badge.tags) ? badge.tags.join(", ") : badge.tags || "",
        created_on: badge.created_on || "",
        id: badge.id || "",
      });
      setAccoladeLookup(badge.name || "");
    }
  }, [badge]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAccoladeSelect = (accolade) => {
    setForm({
      name: accolade.name || "",
      description: accolade.description || "",
      image: accolade.image || "",
      criteria: accolade.criteria || "",
      tags: Array.isArray(accolade.tags) ? accolade.tags.join(", ") : accolade.tags || "",
      created_on: accolade.created_on || "",
      id: accolade.id || "",
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
      dispatch(showBaseNote({ pass: true, data: "Badge updated successfully" }));
    } catch (error) {
      let expt;
      switch (error?.status) {
        case 400:
          expt = "Invalid field names or values provided";
          break;
        case 401:
          expt = "Authentication required";
          break;
        case 403:
          expt = "Admin permissions required";
          break;
        case 404:
          expt = "Badge not found";
          break;
        case 500:
          expt = "Server error - try again later";
          break;
        default:
          expt = "Failed to update badge";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
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
    <Card className="mb-2">
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
                  }}
                  onFocus={() => accoladeLookup.length >= 4 && setAccoladeDropdownShow(true)}
                  onBlur={() => setTimeout(() => setAccoladeDropdownShow(false), 150)}
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
            <FloatingLabel controlId="accoUpdateDesc" label="Description">
              <Form.Control
                type="text"
                value={form.description}
                onChange={(e) => handleFormChange("description", e.target.value)}
                placeholder="Badge description"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateShot" label="Image">
              <Form.Control
                type="url"
                value={form.image}
                onChange={(e) => handleFormChange("image", e.target.value)}
                placeholder="Badge image URL"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateCrit" label="Criteria">
              <Form.Control
                type="url"
                value={form.criteria}
                onChange={(e) => handleFormChange("criteria", e.target.value)}
                placeholder="Badge criteria URL"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateAuth" label="Issuer">
              <Form.Control type="text" value="Fedora Project" disabled />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="accoUpdateTags" label="Tags">
              <Form.Control
                type="text"
                value={form.tags}
                onChange={(e) => handleFormChange("tags", e.target.value)}
                placeholder="Badge tags (comma-separated)"
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
            <Button variant="outline-secondary" className="d-grid w-100 mb-2" size="sm" disabled>
              Deactivate
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
