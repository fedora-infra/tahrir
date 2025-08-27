import ToastContainer from "react-bootstrap/ToastContainer";
import Toast from "react-bootstrap/Toast";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";

export default function LoadNote() {
  const load = useSelector((area) => area.area.load);
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
    "Versioning",
    "Qualifying",
    "Monitoring",
    "Organizing",
  ];
  const time = Math.floor(Date.now() / 1000);
  const text = list[time % list.length];

  return (
    <ToastContainer position="bottom-center" style={{ position: "fixed", zIndex: 2000 }}>
      <Toast className="d-inline-block m-2" show={load}>
        <Toast.Body className="text-center p-1">
          <Spinner animation="border" size="sm" />
          &nbsp;&nbsp;{text}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
