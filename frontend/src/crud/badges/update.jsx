import { useEffect, useRef, useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";

import BadgeSearchDropdown from "../../components/BadgeSearchDropdown.jsx";
import { useRetrieveAccoladeQuery, useUpdationAccoladeMutation } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";
import { formatTime } from "../../features/util.js";

export default function BadgeUpdateForm() {
  const dispatch = useDispatch();
  const { slugdata: accolade } = useParams();
  const [updationAccolade, { isLoading: isUpdating }] = useUpdationAccoladeMutation();
  const badgeRef = useRef(null);

  const [form, makeForm] = useState({
    name: "",
    description: "",
    image: "",
    criteria: "",
    tags: "",
    created_on: "",
    id: "",
  });

  const {
    data: badge,
    isLoading: isFetching,
    error: fetchError,
  } = useRetrieveAccoladeQuery(accolade, {
    skip: !accolade,
  });

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
      });
      badgeRef.current?.setValue(badge.name || "");
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
    });
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
      const msg = getApiErrorMessage(error, "badge update", {
        404: "Badge not found",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
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
            <BadgeSearchDropdown
              ref={badgeRef}
              controlId="accoUpdateName"
              label="Name"
              placeholder="Name"
              onSelect={handleAccoladeSelect}
              onInputChange={(text) => {
                handleFormChange("name", text);
                if (text === "") {
                  makeForm({ name: "", description: "", image: "", criteria: "", tags: "", created_on: "", id: "" });
                }
              }}
            />
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
            <Button variant="outline-secondary" className="d-grid w-100 mb-2" size="sm" disabled>
              Deactivate
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}