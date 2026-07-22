import { mdiBookAccount, mdiHistory } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import UserCard from "../components/usercard.jsx";
import VertItem from "../components/vertitem.jsx";
import { useRetrieveContrastQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Contrast() {
  const { slugdata: id_b } = useParams();
  const authUser = useSelector((data) => data.auth.user);
  const authStat = useSelector((data) => data.auth.status);
  const vibe = useSelector((data) => data.area.vibe);
  const mode = useSelector((data) => data.area.mode);
  const id_a = authUser?.nickname;

  const isDark = mode === "dark" || (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const {
    data: diff,
    isLoading,
    error,
  } = useRetrieveContrastQuery(
    { id_a, id_b },
    {
      skip: !id_a || !id_b,
    }
  );

  useLoadingState(isLoading);

  if ((authStat === "pass" || authStat === "fail") && !authUser) {
    return <Mistaken />;
  }

  if (error || id_a === id_b) {
    return <Mistaken />;
  }

  if (isLoading || !diff) {
    return null;
  }

  const user_a = diff.user_a;
  const user_b = diff.user_b;
  const diff_poll = Math.abs(user_a.badges_count - user_b.badges_count);
  const diff_rank = Math.abs(user_a.rank - user_b.rank);

  const icTint = isDark ? "dark" : "lite";

  const stat = [
    { self: user_a, peer: user_b, selfUnique: diff.user_a_unique_badges, peerUnique: diff.user_b_unique_badges },
    { self: user_b, peer: user_a, selfUnique: diff.user_b_unique_badges, peerUnique: diff.user_a_unique_badges },
  ];

  const only = [
    { head: `Only ${user_a.nickname}`, list: diff.user_a_unique_badges },
    { head: `Only ${user_b.nickname}`, list: diff.user_b_unique_badges },
  ];

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3">
        <UserCard
          mail={user_b.avatar}
          name={user_b.nickname}
          rank={user_b.rank}
          perc={user_b.percentile}
          poll={user_b.badges_count}
          earn={user_b.percent_earned}
        />
        <div className="d-grid gap-2">
          <Button
            as={Link}
            to={`/identity/${id_b}`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiBookAccount} size={0.875} className="me-1" />
            Collection
          </Button>
          <Button
            as={Link}
            to={`/userpast/${id_b}`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiHistory} size={0.875} className="me-1" />
            History
          </Button>
        </div>
      </div>
      <div className="col-12 col-lg-9 d-grid gap-2">
        <div className="row g-2">
          {stat.map(({ self, peer, selfUnique, peerUnique }) => (
            <div key={self.nickname} className="col-12 col-lg-6">
              <Card className="vibe-border" style={{ "--vibe": vibe }}>
                <Card.Body className="ps-0 pe-0 pt-2 pb-0">
                  <Card.Title className="mb-0 ps-2 dataelem">{self.nickname}</Card.Title>
                  <hr className="mt-2 mb-0" />
                  <ListGroup variant="flush">
                    <VertItem
                      head={`#${self.rank} (Top ${parseFloat(self.percentile).toFixed(2)}%)`}
                      body={`Ranked ${diff_rank} ${diff_rank > 1 ? "positions" : "position"} ${self.rank < peer.rank ? "above" : "below"} ${peer.nickname}`}
                      shot={`/imgs/diff_rank_${icTint}.svg`}
                    />
                    <VertItem
                      head={`${self.badges_count} (Has ${self.percent_earned}%)`}
                      body={`Having ${diff_poll} ${self.badges_count > peer.badges_count ? "more" : "less"} badges than ${peer.nickname}`}
                      shot={`/imgs/diff_${self.badges_count > peer.badges_count ? "peak" : "base"}_${icTint}.svg`}
                    />
                    <VertItem
                      head={selfUnique.length}
                      body={`badges that ${peer.nickname} does not have`}
                      shot={`/imgs/diff_${selfUnique.length > peerUnique.length ? "peak" : "base"}_${icTint}.svg`}
                    />
                  </ListGroup>
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
        <Grouping name="Both" wide={diff.shared_badges.length}>
          {diff.shared_badges.map((item) => (
            <AccoItem
              key={generateIdentity(item.id)}
              iden={item.id}
              name={item.name}
              body={item.description}
              foot={formatTime(item.created_on)}
              shot={item.image}
              rare={item.rarity}
            />
          ))}
        </Grouping>
        <div className="row g-2">
          {only.map(({ head, list }) => (
            <div key={head} className="col-12 col-lg-6">
              <Grouping name={head} wide={list.length}>
                {list.map((item) => (
                  <AccoItem
                    key={generateIdentity(item.id)}
                    iden={item.id}
                    name={item.name}
                    body={item.description}
                    foot={formatTime(item.created_on)}
                    shot={item.image}
                    rare={item.rarity}
                    diff={true}
                  />
                ))}
              </Grouping>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
