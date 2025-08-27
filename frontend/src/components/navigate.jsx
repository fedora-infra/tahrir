import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { useSelector, useDispatch } from "react-redux";
import NavDropdown from "react-bootstrap/NavDropdown";
import Icon from "@mdi/react";
import { mdiWeatherSunny, mdiWeatherNight, mdiMemory } from "@mdi/js";
import { keepMode } from "../features/part.js";

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
          <Navbar.Text className="p-0">
            <NavDropdown
              title={
                <Icon
                  path={mode === "lite" ? mdiWeatherSunny : mode === "dark" ? mdiWeatherNight : mdiMemory}
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
                <Icon className="me-1" size={0.75} path={mdiMemory} />
                System
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(keepMode("lite"));
                  document.body.setAttribute("data-bs-theme", "light");
                }}
                className="small d-flex align-items-center p-1"
              >
                <Icon className="me-1" size={0.75} path={mdiWeatherSunny} />
                Light
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  dispatch(keepMode("dark"));
                  document.body.setAttribute("data-bs-theme", "dark");
                }}
                className="small d-flex align-items-center p-1"
              >
                <Icon className="me-1" size={0.75} path={mdiWeatherNight} />
                Dark
              </NavDropdown.Item>
            </NavDropdown>
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
