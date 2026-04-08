import { useRef, useState } from "react";
import { Button, Card, Col, FloatingLabel, Form, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import UserSearchDropdown from "../../components/UserSearchDropdown.jsx";
import { useToggleIdentityOptOutMutation, useUpdationIdentityMutation } from "../../features/call.js";
import { getApiErrorMessage } from "../../features/errors.js";
import { useLoadingState } from "../../features/hooks.js";
import { showBaseNote } from "../../features/part.js";
import { formatTime } from "../../features/util.js";

export default function UserUpdateForm() {
  const dispatch = useDispatch();
  const [updationIdentity, { isLoading: isUpdating }] = useUpdationIdentityMutation();
  const [toggleOptOut, { isLoading: isToggling }] = useToggleIdentityOptOutMutation();
  const userRef = useRef(null);

  const [form, makeForm] = useState({
    nickname: "",
    email: "",
    website: "",
    bio: "",
    avatar: "",
    id: "",
    created_on: "",
    last_login: "",
    opt_out: false,
  });

  useLoadingState(isUpdating, isToggling);

  const handleFormChange = (field, value) => {
    makeForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUserSelect = (user) => {
    makeForm({
      nickname: user.nickname || "",
      email: user.email || "",
      website: user.website || "",
      bio: user.bio || "",
      avatar: user.email || "",
      id: user.id || "",
      created_on: user.created_on || "",
      last_login: user.last_login || "",
      opt_out: user.opt_out || false,
    });
  };

  const handleUpdate = async () => {
    if (!form.id) {
      dispatch(showBaseNote({ pass: false, data: "No user selected" }));
      return;
    }

    try {
      const filldata = {
        website: form.website.trim(),
        bio: form.bio.trim(),
        avatar: form.avatar.trim(),
      };
      const updateData = Object.fromEntries(Object.entries(filldata).filter(([, value]) => value !== ""));
      await updationIdentity({
        user_id: form.nickname,
        filldata: updateData,
      }).unwrap();
      dispatch(showBaseNote({ pass: true, data: "User was updated successfully" }));
    } catch (error) {
      const msg = getApiErrorMessage(error, "user update", {
        404: "User not found",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  const handleToggleOptOut = async () => {
    if (!form.id) {
      dispatch(showBaseNote({ pass: false, data: "No user selected" }));
      return;
    }

    try {
      const newOptOutStatus = !form.opt_out;
      await toggleOptOut({
        user_id: form.nickname,
        opt_out: newOptOutStatus,
      }).unwrap();
      makeForm((prev) => ({ ...prev, opt_out: newOptOutStatus }));
      const action = newOptOutStatus ? "deactivated" : "activated";
      dispatch(showBaseNote({ pass: true, data: `User ${action} successfully` }));
    } catch (error) {
      const msg = getApiErrorMessage(error, "user toggling", {
        404: "User not found",
      });
      dispatch(showBaseNote({ pass: false, data: msg }));
    }
  };

  return (
    <Card className="mb-2">
      <Card.Body className="ps-0 pe-0 pt-2 pb-0">
        <Card.Title className="mb-0 ps-2 dataelem">Update users</Card.Title>
        <Card.Text className="mb-0 ps-2 small">Update accounts that will obtain felicitation</Card.Text>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-2 ms-1 me-1 g-2">
          <Col lg="6">
            <UserSearchDropdown
              ref={userRef}
              controlId="userUpdateName"
              label="Nickname"
              placeholder="Nickname"
              onSelect={handleUserSelect}
              onInputChange={(text) => {
                if (text === "") {
                  makeForm({
                    nickname: "",
                    email: "",
                    website: "",
                    bio: "",
                    avatar: "",
                    id: "",
                    created_on: "",
                    last_login: "",
                    opt_out: false,
                  });
                }
              }}
              renderSubtitle={(user) => user.email}
            />
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="userUpdateMail" label="Email">
              <Form.Control type="email" value={form.email} placeholder="Email" autoComplete="off" readOnly />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="userUpdateSite" label="Website">
              <Form.Control
                type="url"
                value={form.website}
                onChange={(e) => handleFormChange("website", e.target.value)}
                placeholder="Website"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="6">
            <FloatingLabel controlId="userUpdateAvatar" label="Avatar URL">
              <Form.Control
                type="url"
                value={form.avatar}
                onChange={(e) => handleFormChange("avatar", e.target.value)}
                placeholder="Avatar URL"
                autoComplete="off"
              />
            </FloatingLabel>
          </Col>
          <Col lg="12">
            <FloatingLabel controlId="userUpdateInfo" label="Biography">
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
        <hr className="mt-2 mb-2" />
        <p className="small ps-2 pe-2 m-0">
          Last seen on <span className="fw-bold">{form.last_login ? formatTime(form.last_login) : "Never"}</span>
        </p>
        <p className="small ps-2 pe-2 m-0">
          Account created on{" "}
          <span className="fw-bold">{form.created_on ? formatTime(form.created_on) : "Unknown"}</span>
        </p>
        <hr className="mt-2 mb-0" />
        <Row className="mt-0 mb-0 ms-1 me-1 g-2">
          <Col lg="6">
            <Button
              variant="outline-secondary"
              className="d-grid w-100"
              size="sm"
              onClick={handleUpdate}
              disabled={!form.id || isUpdating}
            >
              {isUpdating ? "Updating..." : "Update"}
            </Button>
          </Col>
          <Col lg="6">
            <Button
              variant="outline-secondary"
              className="d-grid w-100 mb-2"
              size="sm"
              onClick={handleToggleOptOut}
              disabled={!form.id || isToggling}
            >
              {isToggling ? "Processing..." : form.opt_out ? "Activate" : "Deactivate"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}