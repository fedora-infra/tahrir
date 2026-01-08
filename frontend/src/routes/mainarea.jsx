import { Container } from "react-bootstrap";
import { Outlet } from "react-router";

import FootNote from "../components/footnote.jsx";
import LoadNote from "../components/loadnote.jsx";
import Navigate from "../components/navigate.jsx";

export default function MainArea() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navigate />
      <Container className="pt-2 flex-grow-1">
        <Outlet />
      </Container>
      <FootNote />
      <LoadNote />
    </div>
  );
}
