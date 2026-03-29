import { mdiAccountMultiple, mdiHome } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect } from "react";
import { Badge, Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import { useRetrieveDiffQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Diff() {
  const dispatch = useDispatch();
  const vibe = useSelector((data) => data.area.vibe);
  const { id_a, id_b } = useParams();

  const { data: diff, isLoading, error } = useRetrieveDiffQuery({ id_a, id_b }, { skip: !id_a || !id_b });

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

  if (isLoading || !diff) {
    return null;
  }

  const { user_a, user_b, user_a_unique_badges, user_b_unique_badges, shared_badges } = diff;

  const rankWinner =
    (user_a?.rank ?? 0) <= (user_b?.rank ?? 0) ? user_a?.nickname || "Unknown" : user_b?.nickname || "Unknown";

  const badgeWinner =
    (user_a?.badges_count ?? 0) > (user_b?.badges_count ?? 0)
      ? user_a?.nickname
      : (user_a?.badges_count ?? 0) < (user_b?.badges_count ?? 0)
        ? user_b?.nickname
        : null;

  const renderBadgeList = (badges) => (
    <ListGroup variant="flush">
      {badges && badges.length > 0 ? (
        badges.map((badge) => (
          <ListGroup.Item key={generateIdentity(badge.id)} className="p-2">
            <div className="d-flex align-items-center gap-2">
              <img src={badge.image} alt={badge.name} style={{ width: 32, height: 32, objectFit: "contain" }} />
              <div>
                <Link to={`/accolade/${badge.id}`} className="text-decoration-none small fw-bold">
                  {badge.name}
                </Link>
                <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                  {badge.description}
                </div>
              </div>
            </div>
          </ListGroup.Item>
        ))
      ) : (
        <ListGroup.Item className="p-2 text-muted small">None</ListGroup.Item>
      )}
    </ListGroup>
  );

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Img variant="top" src={portraitProvider(user_a?.avatar, 512)} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">{user_a?.nickname || "Unknown"}</Card.Title>
            <Card.Text className="small">
              Rank #{user_a?.rank ?? "—"}
              <br />
              {user_a?.badges_count ?? 0} badge(s)
              <br />
              Has {parseFloat(user_a?.percent_earned || 0).toFixed(2)}%
            </Card.Text>
          </Card.Body>
        </Card>

        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Img variant="top" src={portraitProvider(user_b?.avatar, 512)} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">{user_b?.nickname || "Unknown"}</Card.Title>
            <Card.Text className="small">
              Rank #{user_b?.rank ?? "—"}
              <br />
              {user_b?.badges_count ?? 0} badge(s)
              <br />
              Has {parseFloat(user_b?.percent_earned || 0).toFixed(2)}%
            </Card.Text>
          </Card.Body>
        </Card>

        <div className="d-grid gap-2">
          <Button
            as={Link}
            to={`/identity/${user_a?.nickname || ""}`}
            variant="outline-secondary"
            size="sm"
            className="vibe-border"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiAccountMultiple} size={0.875} className="me-1" />
            {user_a?.nickname || "Unknown"}
          </Button>
          <Button
            as={Link}
            to={`/identity/${user_b?.nickname || ""}`}
            variant="outline-secondary"
            size="sm"
            className="vibe-border"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiAccountMultiple} size={0.875} className="me-1" />
            {user_b?.nickname || "Unknown"}
          </Button>
          <Button
            as={Link}
            to="/"
            variant="outline-secondary"
            size="sm"
            className="vibe-border"
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
            <Card.Title className="mb-0 ps-2 dataelem">Comparison summary</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <ListGroup.Item className="small">
                {user_a?.nickname || "User A"} has{" "}
                <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                  {user_a_unique_badges?.length || 0}
                </Badge>{" "}
                badge(s) that {user_b?.nickname || "User B"} does not have.
              </ListGroup.Item>
              <ListGroup.Item className="small">
                {user_b?.nickname || "User B"} has{" "}
                <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                  {user_b_unique_badges?.length || 0}
                </Badge>{" "}
                badge(s) that {user_a?.nickname || "User A"} does not have.
              </ListGroup.Item>
              <ListGroup.Item className="small">
                Both share{" "}
                <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                  {shared_badges?.length || 0}
                </Badge>{" "}
                badge(s).
              </ListGroup.Item>
              <ListGroup.Item className="small">
                {badgeWinner
                  ? `${badgeWinner} has a higher badge count.`
                  : `${user_a?.nickname || "User A"} and ${user_b?.nickname || "User B"} have the same number of badges.`}
              </ListGroup.Item>
              <ListGroup.Item className="small">
                {rankWinner} is ranked higher — rank #{Math.min(user_a?.rank ?? 0, user_b?.rank ?? 0)}.
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>

        <Row className="g-2">
          <Col xs={12} lg={4}>
            <Card className="vibe-border" style={{ "--vibe": vibe }}>
              <Card.Body className="ps-0 pe-0 pt-2 pb-0">
                <Card.Title className="mb-0 ps-2 dataelem text-truncate">
                  {user_a?.nickname || "User A"} only
                </Card.Title>
                <Card.Text className="mb-0 ps-2 small">{user_a_unique_badges?.length || 0} badge(s)</Card.Text>
                <hr className="mt-2 mb-0" />
                {renderBadgeList(user_a_unique_badges)}
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={4}>
            <Card className="vibe-border" style={{ "--vibe": vibe }}>
              <Card.Body className="ps-0 pe-0 pt-2 pb-0">
                <Card.Title className="mb-0 ps-2 dataelem">Shared</Card.Title>
                <Card.Text className="mb-0 ps-2 small">{shared_badges?.length || 0} badge(s)</Card.Text>
                <hr className="mt-2 mb-0" />
                {renderBadgeList(shared_badges)}
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} lg={4}>
            <Card className="vibe-border" style={{ "--vibe": vibe }}>
              <Card.Body className="ps-0 pe-0 pt-2 pb-0">
                <Card.Title className="mb-0 ps-2 dataelem text-truncate">
                  {user_b?.nickname || "User B"} only
                </Card.Title>
                <Card.Text className="mb-0 ps-2 small">{user_b_unique_badges?.length || 0} badge(s)</Card.Text>
                <hr className="mt-2 mb-0" />
                {renderBadgeList(user_b_unique_badges)}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}
