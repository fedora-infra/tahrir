import { useEffect } from "react";
import { Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { useRetrieveAboutQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import Mistaken from "./mistaken.jsx";

export default function About() {
  const dispatch = useDispatch();
  const vibe = useSelector((data) => data.area.vibe);
  const { data: about, isLoading, error } = useRetrieveAboutQuery();

  useEffect(() => {
    if (isLoading) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [isLoading, dispatch]);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !about) {
    return null;
  }

  return (
    <div className="row g-2 justify-content-center">
      <div className="col-12 col-lg-8">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body>
            <div
              dangerouslySetInnerHTML={{ __html: about.content }}
            />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}