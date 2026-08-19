import { useRef } from "react";
import { Spinner, Toast, ToastContainer } from "react-bootstrap";
import { useSelector } from "react-redux";

export default function LoadNote() {
  const load = useSelector((area) => area.area.load);
  const vibe = useSelector((data) => data.area.vibe);
  const list = [
    "Assembling",
    "Committing",
    "Validating",
    "Sanitizing",
    "Tokenizing",
    "Throttling",
    "Encrypting",
    "Decrypting",
    "Processing",
    "Optimizing",
    "Allocating",
    "Generating",
    "Inspecting",
    "Harvesting",
    "Journaling",
    "Networking",
    "Yakshaving",
    "Qualifying",
    "Monitoring",
    "Organizing",
  ];
  const slot = useRef("");
  const done = useRef(false);

  if (load && !done.current) {
    const time = Math.floor(Date.now() / 1000);
    slot.current = list[time % list.length];
  }
  done.current = load;

  const text = slot.current;

  return (
    <ToastContainer position="bottom-center" style={{ position: "fixed", zIndex: 2000 }}>
      <Toast className="d-inline-block m-2 vibe-border" show={load} style={{ "--vibe": vibe }}>
        <Toast.Body className="text-center p-1">
          <Spinner animation="border" size="sm" />
          &nbsp;&nbsp;{text}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
