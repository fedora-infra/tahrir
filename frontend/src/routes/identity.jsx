import { mdiFencing, mdiHistory, mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import { Button, Card } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity, portraitProvider } from "../features/util.js";
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
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Img variant="top" src={portraitProvider(user.mail, 512)} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">{user.user}</Card.Title>
            <Card.Text className="small">
              Rank #{user.rank}
              <br />
              Top {parseFloat(user.percentile).toFixed(2)}%
              <br />
              Collected {user.serialized.length} badge(s)
              <br />
              Has {parseFloat(user.percent_earned).toFixed(2)}%
            </Card.Text>
          </Card.Body>
        </Card>
        <div className="d-grid gap-2">
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
      </div>
      <div className="col-12 col-lg-9 d-grid gap-2">
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
