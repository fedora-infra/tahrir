import { mdiFencing, mdiHistory, mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import StarData from "../components/stardata.jsx";
import UserCard from "../components/usercard.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { useLoadingState } from "../features/hook.js";
import { formatTime, generateIdentity } from "../features/util.js";
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

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3 d-flex flex-column gap-2">
        <UserCard
          mail={user.mail}
          name={user.user}
          rank={user.rank}
          perc={user.percentile}
          poll={user.serialized.length}
          earn={user.percent_earned}
        />
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
        {authUser && authUser.nickname !== identity && (
          <Button
            as={Link}
            to={`/contrast/${identity}`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiFencing} size={0.875} className="me-1" />
            Compare
          </Button>
        )}
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
      </div>
      <div className="col-12 col-lg-9 d-flex flex-column gap-2">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2 justify-content-between">
            <div className="row g-2 w-100">
              <div className="col-12 col-lg-6">
                <Card.Title className="dataelem">Statistics</Card.Title>
                <Card.Text as="div" className="small">
                  <ul className="list-unstyled mb-0">
                    {Object.entries(user.classified).map(([category, list]) => (
                      <li key={category}>
                        <span className="text-capitalize fw-bold">{category}:</span> {list.length} badge(s) (
                        {((list.length / user.serialized.length) * 100).toFixed(2)}%)
                      </li>
                    ))}
                  </ul>
                </Card.Text>
              </div>
              <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-end">
                <StarData sections={user.classified} />
              </div>
            </div>
          </Card.Body>
        </Card>
        {user.classified &&
          Object.entries(user.classified).map(
            ([category, iterlist]) =>
              iterlist.length > 0 && (
                <Grouping key={generateIdentity(category)} name={category} wide={iterlist.length} head={true}>
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
                      />
                    ) : null;
                  })}
                </Grouping>
              )
          )}
      </div>
    </div>
  );
}
