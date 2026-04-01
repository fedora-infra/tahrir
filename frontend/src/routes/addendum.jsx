import { mdiHome } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import Markdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import { hideLoad, showLoad } from "../features/part.js";

export default function Addendum() {
  const dispatch = useDispatch();
  const vibe = useSelector((data) => data.area.vibe);
  const [content, setContent] = useState(null);

  useEffect(() => {
    dispatch(showLoad());
    fetch("/docs/addendum.md")
      .then((resp) => resp.text())
      .then((text) => {
        setContent(text);
        dispatch(hideLoad());
      })
      .catch(() => {
        setContent("Failed to load about page content.");
        dispatch(hideLoad());
      });
  }, [dispatch]);

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Fedora Badges</Card.Title>
            <Card.Text className="small">
              Fedora Badges is an application built to recognize contributors to the Fedora Project, help budding and
              existing Fedora Project members discover different ways to get involved, and encourage the general
              improvement to free and open source software.
            </Card.Text>
          </Card.Body>
        </Card>
        <div className="d-grid gap-2">
          <Button
            as={Link}
            to="/"
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiHome} size={0.875} className="me-1" />
            Return home
          </Button>
        </div>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">About this project</Card.Title>
            <hr className="mt-2 mb-0" />
            <div className="p-2">
              {content ? (
                <Markdown
                  components={{
                    h1: ({ children }) => <h5 className="dataelem fw-bold">{children}</h5>,
                    h2: ({ children }) => <h5 className="dataelem fw-bold">{children}</h5>,
                    p: ({ children }) => (
                      <p className="small" style={{ textAlign: "justify" }}>
                        {children}
                      </p>
                    ),
                    li: ({ children }) => <li className="small">{children}</li>,
                    img: ({ src, alt }) => (
                      <div className="text-center">
                        <img src={src} alt={alt} className="img-fluid" />
                      </div>
                    ),
                    a: ({ href, children }) => (
                      <a href={href} target="_blank" rel="noopener noreferrer">
                        {children}
                      </a>
                    ),
                  }}
                >
                  {content}
                </Markdown>
              ) : null}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
