import Navigate from "./navigate.jsx";
import { Outlet } from "react-router";
import Container from "react-bootstrap/Container";
import LoadNote from "./loadnote.jsx";

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
