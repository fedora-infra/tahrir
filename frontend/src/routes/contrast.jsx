import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import { useRetrieveContrastQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Contrast() {
  const { slugdata: id_b } = useParams();
  const authUser = useSelector((data) => data.auth.user);
  const authStat = useSelector((data) => data.auth.status);
  const vibe = useSelector((data) => data.area.vibe);
  const id_a = authUser?.nickname;

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
  const user_peak = user_a.badges_count >= user_b.badges_count ? user_a : user_b;
  const user_base = user_a.badges_count >= user_b.badges_count ? user_b : user_a;
  const rank_peak = user_a.rank <= user_b.rank ? user_a : user_b;
  const rank_base = user_a.rank <= user_b.rank ? user_b : user_a;

  const only = [
    { title: `${user_a.nickname} only`, list: diff.user_a_unique_badges },
    { title: `${user_b.nickname} only`, list: diff.user_b_unique_badges },
  ];

  return (
    <>
      <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
        <Card.Body className="p-2">
          <Card.Title className="dataelem">Diff Stats</Card.Title>
          <ul className="mb-0 small">
            <li>
              {user_a.nickname} has {diff.user_a_unique_badges.length} badge(s) that {user_b.nickname} does not have.
            </li>
            <li>
              {user_b.nickname} has {diff.user_b_unique_badges.length} badge(s) that {user_a.nickname} does not have.
            </li>
            <li>
              {user_a.nickname} and {user_b.nickname} share {diff.shared_badges.length} award(s).
            </li>
            <li>
              {diff_poll === 0
                ? `${user_a.nickname} and ${user_b.nickname} have the same badge count.`
                : `${user_peak.nickname}'s badge count is ${diff_poll} higher than ${user_base.nickname}'s.`}
            </li>
            <li>
              {diff_rank === 0
                ? `${user_a.nickname} and ${user_b.nickname} have the same rank.`
                : `${rank_peak.nickname} (rank ${rank_peak.rank}, top ${parseFloat(rank_peak.percentile).toFixed(1)}%) is ranked ${diff_rank} higher than ${rank_base.nickname} (rank ${rank_base.rank}, top ${parseFloat(rank_base.percentile).toFixed(1)}%).`}
            </li>
          </ul>
        </Card.Body>
      </Card>
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
        {only.map(({ title, list }) => (
          <div key={title} className="col-12 col-lg-6">
            <Grouping name={title} wide={list.length}>
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
    </>
  );
}
