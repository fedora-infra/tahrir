import { Container } from "react-bootstrap";
import { Outlet } from "react-router";

import LoadNote from "../components/loadnote.jsx";
import Navigate from "../components/navigate.jsx";

export default function MainArea() {
  return (
    <div>
      <Navigate />
      <Container className="pt-2">
        <Outlet />
      </Container>
      <LoadNote />
    </div>
  );
}
