import { mdiAccountCircle, mdiCrown, mdiCubeScan, mdiMedal, mdiShieldStarOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect } from "react";
import { Button, Card, Col, FloatingLabel, Form, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import BaseNote from "../components/basenote.jsx";
import AssertionCreationForm from "../crud/assertions/create.jsx";
import AssertionUpdateForm from "../crud/assertions/delete.jsx";
import AuthorizationCreationForm from "../crud/authorizations/create.jsx";
import AuthorizationDeletionForm from "../crud/authorizations/delete.jsx";
import BadgeCreationForm from "../crud/badges/create.jsx";
import BadgeUpdateForm from "../crud/badges/update.jsx";
import InvitationCreationForm from "../crud/invitations/create.jsx";
import InvitationDeletionForm from "../crud/invitations/delete.jsx";
import { loadUserData } from "../features/auth.js";
import { hideLoad, showLoad } from "../features/part.js";
import { owners } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Governor() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((data) => data.auth.user);
  const authStat = useSelector((data) => data.auth.status);
  const vibe = useSelector((data) => data.area.vibe);

  useEffect(() => {
    if (authStat === "idle") {
      dispatch(showLoad());
      dispatch(loadUserData());
      return;
    }

    // Show or Hide LoadNote
    if (authStat === "load") {
      dispatch(showLoad());
      return;
    }

    // Show or Hide LoadNote
    if (authStat === "pass" || authStat === "fail") {
      dispatch(hideLoad());
    }
  }, [user, authStat, navigate, dispatch]);

  // Show mistaken page if user is unauthorized (after auth is complete)
  if ((authStat === "pass" || authStat === "fail") && (!user || !user.groups || !user.groups.includes(owners))) {
    return <Mistaken />;
  }

  return (
    <>
      <div className="row g-2">
        <div className="col-12 col-lg-3">
          <Card className="vibe-border" style={{ "--vibe": vibe }}>
            <Card.Body className="p-2">
              <Card.Title className="dataelem text-truncate">Governor</Card.Title>
              <Card.Text className="small">
                <div>
                  You have access to administrative functions because you belong to the{" "}
                  <span className="fw-bold">{owners}</span> group.
                </div>
                <div className="mt-2">
                  Please be extremely careful about the changes you make as there are zero protections whatsoever to
                  mishaps.
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 col-lg-9">
          <ListGroup className="mb-2">
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center ps-2 pe-2 vibe-border dataelem h5 mb-0"
              style={{ "--vibe": vibe }}
            >
              Assertions
              <Icon path={mdiMedal} size={1} />
            </ListGroup.Item>
          </ListGroup>
          <AssertionCreationForm />
          <AssertionUpdateForm />
          <hr className="mt-2 mb-2" />
          <ListGroup className="mb-2">
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center ps-2 pe-2 vibe-border dataelem h5 mb-0"
              style={{ "--vibe": vibe }}
            >
              Authorizations
              <Icon path={mdiCrown} size={1} />
            </ListGroup.Item>
          </ListGroup>
          <AuthorizationCreationForm />
          <AuthorizationDeletionForm />
          <hr className="mt-2 mb-2" />
          <ListGroup className="mb-2">
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center ps-2 pe-2 vibe-border dataelem h5 mb-0"
              style={{ "--vibe": vibe }}
            >
              Invitations
              <Icon path={mdiCubeScan} size={1} />
            </ListGroup.Item>
          </ListGroup>
          <InvitationCreationForm />
          <InvitationDeletionForm />
          <hr className="mt-2 mb-2" />
          <ListGroup className="mb-2">
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center ps-2 pe-2 vibe-border dataelem h5 mb-0"
              style={{ "--vibe": vibe }}
            >
              Users
              <Icon path={mdiAccountCircle} size={1} />
            </ListGroup.Item>
          </ListGroup>
          <Card className="mb-2">
            <Card.Body className="ps-0 pe-0 pt-2 pb-0">
              <Card.Title className="mb-0 ps-2 dataelem">Create users</Card.Title>
              <Card.Text className="mb-0 ps-2 small">Create accounts that will obtain felicitation</Card.Text>
              <hr className="mt-2 mb-0" />
              <Row className="mt-0 mb-2 ms-1 me-1 g-2">
                <Col lg="6">
                  <FloatingLabel controlId="userCreateName" label="Nickname">
                    <Form.Control type="text" />
                  </FloatingLabel>
                </Col>
                <Col lg="6">
                  <FloatingLabel controlId="userCreateMail" label="Email">
                    <Form.Control type="email" />
                  </FloatingLabel>
                </Col>
              </Row>
              <hr className="mt-2 mb-0" />
              <Button as={Link} to="" variant="outline-secondary" className="d-grid m-2" size="sm">
                Create
              </Button>
            </Card.Body>
          </Card>
          <Card className="mb-2">
            <Card.Body className="ps-0 pe-0 pt-2 pb-0">
              <Card.Title className="mb-0 ps-2 dataelem">Update users</Card.Title>
              <Card.Text className="mb-0 ps-2 small">Update accounts that will obtain felicitation</Card.Text>
              <hr className="mt-2 mb-0" />
              <Row className="mt-0 mb-2 ms-1 me-1 g-2">
                <Col lg="6">
                  <FloatingLabel controlId="userUpdateName" label="Nickname">
                    <Form.Control type="text" />
                  </FloatingLabel>
                </Col>
                <Col lg="6">
                  <FloatingLabel controlId="userUpdateMail" label="Email">
                    <Form.Control type="email" />
                  </FloatingLabel>
                </Col>
                <Col lg="6">
                  <FloatingLabel controlId="userUpdateSite" label="Website">
                    <Form.Control type="url" />
                  </FloatingLabel>
                </Col>
                <Col lg="6">
                  <FloatingLabel controlId="userUpdateInfo" label="Bio">
                    <Form.Control type="text" />
                  </FloatingLabel>
                </Col>
              </Row>
              <hr className="mt-2 mb-2" />
              <p className="small ps-2 pe-2 m-0">
                Last seen on <span className="fw-bold">December 12, 2025 at 00:00 AM GMT+5:30</span>
              </p>
              <p className="small ps-2 pe-2 m-0">
                Account created on <span className="fw-bold">December 12, 2025 at 00:00 AM GMT+5:30</span>
              </p>
              <hr className="mt-2 mb-0" />
              <Row className="mt-0 mb-0 ms-1 me-1 g-2">
                <Col lg="6">
                  <Button as={Link} to="" variant="outline-secondary" className="d-grid" size="sm">
                    Update
                  </Button>
                </Col>
                <Col lg="6">
                  <Button as={Link} to="" variant="outline-secondary" className="d-grid mb-2" size="sm">
                    Deactivate
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <hr className="mt-2 mb-2" />
          <ListGroup className="mb-2">
            <ListGroup.Item
              className="d-flex justify-content-between align-items-center ps-2 pe-2 vibe-border dataelem h5 mb-0"
              style={{ "--vibe": vibe }}
            >
              Badges
              <Icon path={mdiShieldStarOutline} size={1} />
            </ListGroup.Item>
          </ListGroup>
          <BadgeCreationForm />
          <BadgeUpdateForm />
        </div>
      </div>
      <BaseNote />
    </>
  );
}
