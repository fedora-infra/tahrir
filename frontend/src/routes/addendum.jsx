import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import Markdown from "react-markdown";
import { useDispatch, useSelector } from "react-redux";

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
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3 d-flex flex-column gap-2">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Fedora Badges</Card.Title>
            <Card.Text className="small">
              Fedora Badges is an application built to recognize contributors to the Fedora Project, help budding and
              existing Fedora Project members discover different ways to get involved, and encourage the general
              improvement to free and open source software.
            </Card.Text>
            <Card.Text className="small">
              Running on{" "}
              <span className="fw-bold">
                {import.meta.env.VITE_HASH ? (
                  <a
                    href={`https://github.com/fedora-infra/tahrir/commit/${import.meta.env.VITE_HASH}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-decoration-none"
                  >
                    Tahrir v3.0.0-{import.meta.env.VITE_HASH}
                  </a>
                ) : (
                  "Tahrir v3.0.0-platform"
                )}
              </span>
            </Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
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
                    img: ({ src, alt }) => <img src={src} alt={alt} className="img-fluid d-block mx-auto" />,
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
