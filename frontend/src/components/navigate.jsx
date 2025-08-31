import { mdiCircleOutline, mdiCircleSlice4, mdiCircleSlice8 } from "@mdi/js";
import Icon from "@mdi/react";
import { Container, Form, Navbar, NavDropdown, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { keepMode } from "../features/part.js";
import Discover from "./discover.jsx";

export default function Navigate() {
  const dispatch = useDispatch();
  const mode = useSelector((data) => data.area.mode);

  return (
    <Navbar bg="body-secondary" className="shadow-sm sticky-top p-0">
      <Container>
        <Navbar.Brand className="d-flex align-items-center flex-grow-1">
          <img
            alt=""
            src={`${import.meta.env.BASE_URL}fedora.svg`}
            width="30"
            height="30"
            className="d-inline-block align-top p-0 logo"
          />
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Form className="me-2">
            <Discover />
          </Form>
          <Navbar.Text className="p-0">
            <NavDropdown
              title={
                <Icon
                  path={mode === "light" ? mdiCircleSlice8 : mode === "dark" ? mdiCircleOutline : mdiCircleSlice4}
                  size={1}
                />
              }
              drop="down"
              align="end"
              className="p-0 pe-2"
            >
              <NavDropdown.Item
                onClick={() => dispatch(keepMode("auto"))}
                className="small d-flex align-items-center p-1"
              >
                <Icon className="me-1" size={0.75} path={mdiCircleSlice4} />
                System
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => dispatch(keepMode("light"))}
                className="small d-flex align-items-center p-1"
              >
                <Icon className="me-1" size={0.75} path={mdiCircleSlice8} />
                Light
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => dispatch(keepMode("dark"))}
                className="small d-flex align-items-center p-1"
              >
                <Icon className="me-1" size={0.75} path={mdiCircleOutline} />
                Dark
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
