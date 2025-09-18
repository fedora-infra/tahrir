import { mdiCircleOutline, mdiCircleSlice4, mdiCircleSlice8, mdiPalette } from "@mdi/js";
import Icon from "@mdi/react";
import { Container, Form, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { keepMode, keepVibe } from "../features/part.js";
import { mainColors } from "../features/util.js";
import Discover from "./discover.jsx";

export default function Navigate() {
  const dispatch = useDispatch();
  const mode = useSelector((data) => data.area.mode);
  const vibe = useSelector((data) => data.area.vibe);

  return (
    <Navbar bg={`${vibe}`} className="shadow-sm sticky-top p-0" style={{ background: `${vibe}` }}>
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
              className="p-0 pe-2 vibe-dropdown"
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
              <NavDropdown.Divider className="mt-1 mb-1 ms-0 me-0" />
              {Object.entries(mainColors).map(([name, color]) => (
                <NavDropdown.Item
                  key={name}
                  onClick={() => dispatch(keepVibe(color))}
                  className="small d-flex align-items-center p-1"
                >
                  <Icon className="me-1" size={0.75} path={mdiPalette} style={{ color: color }} />
                  {name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
