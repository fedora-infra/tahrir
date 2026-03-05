import { useState } from "react";
import { Button, Card, Col, Dropdown, FloatingLabel, Form, Image, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import {
  useLookupIdentityQuery,
  useToggleIdentityOptOutMutation,
  useUpdationIdentityMutation,
} from "../../features/call.js";
import { showBaseNote } from "../../features/part.js";
import { useLoadingState } from "../../features/hooks.js";
import { formatTime, portraitProvider } from "../../features/util.js";

export default function UserUpdateForm() {
  const dispatch = useDispatch();
  const [updationIdentity, { isLoading: isUpdating }] = useUpdationIdentityMutation();
  const [toggleOptOut, { isLoading: isToggling }] = useToggleIdentityOptOutMutation();

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

  const [userLookup, setUserLookup] = useState("");
  const [userDropdownShow, setUserDropdownShow] = useState(false);

  const { data: searchResults } = useLookupIdentityQuery(userLookup, {
    skip: userLookup.length < 4,
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
    setUserLookup(user.nickname || "");
    setUserDropdownShow(false);
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
          expt = "User not found";
          break;
        case 500:
          expt = "Attempt update again later";
          break;
        default:
          expt = "Failed during user update";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
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
      let expt;
      switch (error?.status) {
        case 400:
          expt = "Verify the requested fields";
          break;
        case 401:
          expt = "Try authenticating before toggling";
          break;
        case 403:
          expt = "Ensure permissions are available";
          break;
        case 404:
          expt = "User not found";
          break;
        case 500:
          expt = "Attempt toggling again later";
          break;
        default:
          expt = "Failed during user toggling";
      }
      dispatch(showBaseNote({ pass: false, data: expt }));
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
            <div className="position-relative">
              <FloatingLabel controlId="userUpdateName" label="Nickname">
                <Form.Control
                  type="text"
                  value={userLookup}
                  onChange={(e) => {
                    setUserLookup(e.target.value);
                    setUserDropdownShow(e.target.value.length >= 4);
                    if (e.target.value === "") {
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
                  onFocus={() => userLookup.length >= 4 && setUserDropdownShow(true)}
                  onBlur={() => setTimeout(() => setUserDropdownShow(false), 150)}
                  placeholder="Nickname"
                  autoComplete="off"
                />
              </FloatingLabel>
              {userLookup.length >= 4 &&
                searchResults &&
                searchResults.users &&
                searchResults.users.length > 0 &&
                userDropdownShow && (
                  <Dropdown.Menu show className="position-absolute w-100 mt-1" style={{ zIndex: 1050 }}>
                    <Dropdown.Header className="small p-1">Users</Dropdown.Header>
                    {searchResults.users.slice(0, 8).map((user) => (
                      <Dropdown.Item
                        key={user.id}
                        onClick={() => handleUserSelect(user)}
                        className="small d-flex align-items-center p-1"
                      >
                        <Image
                          rounded={true}
                          src={portraitProvider(user.email, 40)}
                          width="40"
                          height="40"
                          className="me-2"
                        />
                        <div className="flex-grow-1 overflow-hidden">
                          <div className="fw-bold text-truncate">{user.nickname}</div>
                          <div className="small text-muted text-truncate">{user.email}</div>
                        </div>
                      </Dropdown.Item>
                    ))}
                    {searchResults.users.length > 8 && (
                      <Dropdown.Item disabled className="small text-muted p-1">
                        +{searchResults.users.length - 8} more users
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                )}
            </div>
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
