import { mdiChartLine, mdiHistory, mdiMedal, mdiPercent, mdiPodium, mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import { useMemo } from "react";
import { Badge, Button, Card, ListGroup, ProgressBar } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity, portraitProvider, rareColors, rarities } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Identity() {
  const { slugdata: identity } = useParams();
  const vibe = useSelector((data) => data.area.vibe);
  const authUser = useSelector((data) => data.auth.user);

  const {
    data: user,
    isLoading,
    error,
  } = useRetrieveIdentityQuery(identity, {
    skip: !identity,
  });

  const rarityBreakdown = useMemo(() => {
    if (!user || !user.serialized) return {};
    const counts = {};
    for (const badge of user.serialized) {
      const r = badge.rarity || "D";
      counts[r] = (counts[r] || 0) + 1;
    }
    return counts;
  }, [user]);

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Img variant="top" src={portraitProvider(user.mail, 512)} className="p-2" />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate mb-0">{user.user}</Card.Title>
          </Card.Body>
        </Card>
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Statistics</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <ListGroup.Item className="p-2">
                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                  <Icon path={mdiPodium} size={0.875} />
                  <div className="d-flex flex-column flex-grow-1">
                    <span className="small">Rank</span>
                    <span className="fw-bold">
                      #{user.rank}
                      <Badge className="ms-2 monoelem vibe-badge" style={{ "--vibe": vibe }}>
                        Top {parseFloat(user.percentile).toFixed(2)}%
                      </Badge>
                    </span>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="p-2">
                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                  <Icon path={mdiMedal} size={0.875} />
                  <div className="d-flex flex-column flex-grow-1">
                    <span className="small">Collected</span>
                    <span className="fw-bold">{user.serialized.length} badge(s)</span>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item className="p-2">
                <div className="d-flex align-items-center" style={{ gap: "0.5rem" }}>
                  <Icon path={mdiPercent} size={0.875} />
                  <div className="d-flex flex-column flex-grow-1">
                    <span className="small">Earned</span>
                    <span className="fw-bold">{parseFloat(user.percent_earned).toFixed(2)}% of all badges</span>
                  </div>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
        {user.serialized.length > 0 && Object.keys(rarityBreakdown).length > 0 && (
          <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
            <Card.Body className="ps-0 pe-0 pt-2 pb-0">
              <Card.Title className="mb-0 ps-2 dataelem">Rarity</Card.Title>
              <hr className="mt-2 mb-0" />
              <ListGroup variant="flush">
                {Object.entries(rarities).map(([tier, label]) => {
                  const count = rarityBreakdown[tier] || 0;
                  if (count === 0) return null;
                  return (
                    <ListGroup.Item key={tier} as={Link} to={`/rarities/${tier}`} action className="p-2 text-decoration-none">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small fw-bold" style={{ color: rareColors[tier] }}>{label}</span>
                        <Badge className="monoelem" style={{ backgroundColor: rareColors[tier] }}>
                          {count}
                        </Badge>
                      </div>
                      <ProgressBar
                        now={(count / user.serialized.length) * 100}
                        style={{ height: "4px", backgroundColor: "var(--bs-border-color)" }}
                      >
                        <ProgressBar now={(count / user.serialized.length) * 100} style={{ backgroundColor: rareColors[tier] }} />
                      </ProgressBar>
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
        <div className="d-grid gap-2">
          <Button
            as={Link}
            to={`/userpast/${identity}`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiHistory} size={0.875} className="me-1" />
            History
          </Button>
          <Button
            as={Link}
            to={`/rankings`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiChartLine} size={0.875} className="me-1" />
            Rankings
          </Button>
          {authUser && authUser.nickname === identity && (
            <Button
              as={Link}
              to="/campaign"
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiSend} size={0.875} className="me-1" />
              Campaign
            </Button>
          )}
        </div>
      </div>
      <div className="col-12 col-lg-9">
        {user.serialized.length === 0 ? (
          <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
            <Card.Body className="text-center p-4">
              <Icon path={mdiMedal} size={2} className="mb-2 text-secondary" />
              <Card.Title className="dataelem">No badges yet</Card.Title>
              <Card.Text className="small text-secondary">
                {authUser && authUser.nickname === identity
                  ? "Start contributing to the Fedora community to earn your first badge!"
                  : `${user.user} hasn't earned any badges yet. Check back later!`}
              </Card.Text>
              <Button
                as={Link}
                to="/assembly"
                variant="outline-secondary"
                className="vibe-border"
                size="sm"
                style={{ "--vibe": vibe }}
              >
                Browse all badges
              </Button>
            </Card.Body>
          </Card>
        ) : (
          user.classified &&
          Object.entries(user.classified).map(
            ([category, iterlist]) =>
              iterlist.length > 0 && (
                <Grouping key={generateIdentity(category)} name={category} wide={iterlist.length}>
                  {iterlist.map((indx) => {
                    const item = user.serialized[indx];
                    return item ? (
                      <AccoItem
                        key={generateIdentity(item.id)}
                        iden={item.id}
                        name={item.name}
                        body={item.description}
                        foot={formatTime(item.issued)}
                        shot={item.image}
                        rare={item.rarity}
                        size="md"
                      />
                    ) : null;
                  })}
                </Grouping>
              )
          )
        )}
      </div>
    </div>
  );
}
