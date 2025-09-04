import { useEffect } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import { useRetrieveIdentityQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { formatTime, generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Identity() {
  const dispatch = useDispatch();
  const { slugdata: identity } = useParams();

  const {
    data: user,
    isLoading,
    error,
  } = useRetrieveIdentityQuery(identity, {
    skip: !identity,
  });

  // Show or Hide LoadNote
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

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2">
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
        <Button as={Link} to={`/userpast/${identity}`} variant="secondary" className="d-grid" size="sm">
          History
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        {user.classified &&
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
