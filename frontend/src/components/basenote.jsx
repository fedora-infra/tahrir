import { mdiAlertCircleOutline, mdiCheckCircleOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { Toast, ToastContainer } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { hideBaseNote } from "../features/part.js";

export default function BaseNote() {
  const dispatch = useDispatch();
  const baseNote = useSelector((area) => area.area.baseNote);
  const load = useSelector((area) => area.area.load);

  return (
    <ToastContainer position="bottom-center" style={{ position: "fixed", zIndex: 2000 }}>
      <Toast
        className={`d-inline-block m-2 border-${baseNote.pass ? "success" : "danger"}`}
        show={baseNote.show && !load}
        autohide
        delay={4000}
        onClose={() => dispatch(hideBaseNote())}
      >
        <Toast.Body
          className={`d-flex align-items-center justify-content-center p-1 ${baseNote.pass ? "text-success" : "text-danger"}`}
        >
          <Icon path={baseNote.pass ? mdiCheckCircleOutline : mdiAlertCircleOutline} size={0.75} />
          &nbsp;&nbsp;{baseNote.data}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
