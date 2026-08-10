import {
  mdiCrosshairsGps,
  mdiHeart,
  mdiInformationOutline,
  mdiStarFourPoints,
  mdiTrophy,
  mdiViewGridPlus,
} from "@mdi/js";
import Icon from "@mdi/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Button, Card, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";

import SideArea from "../components/sidearea.jsx";
import VertItem from "../components/vertitem.jsx";
import { useRetrieveAccoListQuery, useRetrieveGrantingQuery } from "../features/call.js";
import { useLoadingState } from "../features/hook.js";
import { generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

dayjs.extend(relativeTime);

export default function Homepage() {
  const navigate = useNavigate();
  const { data: granting, isLoading: isGrantingLoading, error: grantingError } = useRetrieveGrantingQuery();
  const { data: accolade, isLoading: isAccoladeLoading, error: accoladeError } = useRetrieveAccoListQuery();
  const vibe = useSelector((data) => data.area.vibe);
  const isLoading = isGrantingLoading || isAccoladeLoading;
  const error = grantingError || accoladeError;
  const handleRandomAccolade = () => {
    const accoladeList = accolade?.disordered?.full || [];
    if (accoladeList.length > 0) {
      const randomSequence = Math.floor(Math.random() * accoladeList.length);
      const randomAccolade = accoladeList[randomSequence];
      navigate(`/accolade/${randomAccolade.id}`);
    }
  };

  // Using onClick instead of link to avoid nested <a> tags (hydration error).
  // Trade-off: right-click "Open in new tab" will not work on award items.
  const handleAwardsClick = (e, path) => {
    if (!e.target.closest("a")) {
      navigate(path);
    }
  };

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !granting) {
    return null;
  }

  const recentGranting = Array.isArray(granting) ? granting : [];
  const recentAccolade = accolade?.disordered?.newest || [];
  const formatOption = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return (
    <div className="row g-2 mb-2">
      <SideArea>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Fedora Badges</Card.Title>
            <Card.Text className="small">
              Fedora Badges is an application built to recognize contributors to the Fedora Project, help budding and
              existing Fedora Project members discover different ways to get involved, and encourage the general
              improvement to free and open source software.
            </Card.Text>
          </Card.Body>
        </Card>
        <Button
          as={Link}
          to="/assembly"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiViewGridPlus} size={0.875} className="me-1" />
          Complete collection
        </Button>
        <Button
          as={Link}
          to="/rankings"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiTrophy} size={0.875} className="me-1" />
          Platform rankings
        </Button>
        <Button
          as={Link}
          to="/rarities/X"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiStarFourPoints} size={0.875} className="me-1" />
          Discover rarities
        </Button>
        <Button
          onClick={handleRandomAccolade}
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiCrosshairsGps} size={0.875} className="me-1" />
          Explore badges
        </Button>
        <Button
          as={Link}
          to="/addendum"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiInformationOutline} size={0.875} className="me-1" />
          Service information
        </Button>
        <Button
          as="a"
          href="https://chat.fedoraproject.org/#/room/#badges:fedoraproject.org"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiHeart} size={0.875} className="me-1" />
          Contribute now
        </Button>
      </SideArea>
      <div className="col-12 col-lg-5">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Recent awards</Card.Title>
            <Card.Text className="mb-0 ps-2 small">{recentGranting.length} award(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush" className="mb-0">
              {recentGranting.map((item, indx) => (
                <VertItem
                  key={generateIdentity(`${item.recipient || item.salt || ""}-${indx}`)}
                  head={<>{item.person?.nickname || "Unknown User"}</>}
                  body={
                    <>
                      received{" "}
                      <Link to={`/accolade/${item.badge?.id || ""}`} className="text-decoration-none">
                        {item.badge?.name || "Unknown Badge"}
                      </Link>{" "}
                      about{" "}
                      {item.issued_on ? (
                        <OverlayTrigger
                          placement="bottom"
                          overlay={
                            <Tooltip>{new Date(item.issued_on * 1000).toLocaleString("en-US", formatOption)}</Tooltip>
                          }
                        >
                          <span style={{ cursor: "pointer" }}>{dayjs.unix(item.issued_on).fromNow()}</span>
                        </OverlayTrigger>
                      ) : (
                        "recently"
                      )}
                    </>
                  }
                  shot={item.person?.mail ? portraitProvider(item.person.mail, 45) : null}
                  onClick={(e) => {
                    handleAwardsClick(e, `/identity/${item.person?.nickname || ""}`);
                  }}
                />
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
      <div className="col-12 col-lg-4">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Recent badges</Card.Title>
            <Card.Text className="mb-0 ps-2 small">{recentAccolade.length} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush" className="mb-0">
              {recentAccolade.map((item, indx) => (
                <VertItem
                  key={generateIdentity(item.id || item.name || indx)}
                  head={item.name || "Unknown Badge"}
                  body={<>created {item.created_on ? dayjs.unix(item.created_on).fromNow() : "recently"}</>}
                  shot={item.image || null}
                  link={`/accolade/${item.id || ""}`}
                />
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
