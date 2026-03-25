import { useEffect,useState } from "react";
import { Badge, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

import VertItem from "../components/vertitem.jsx";
import { useRetrieveDiscoverQuery } from "../features/call.js";
import { hideLoad, showLoad } from "../features/part.js";
import { formatTime, generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function FindPage() {
  const dispatch = useDispatch();
  const { slugdata: findtext } = useParams();
  const [badgePage, setBadgePage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const { data: dict, isLoading, error } = useRetrieveDiscoverQuery({
    discover: findtext,
    page_badges: badgePage,
    page_users: userPage,
    per_page: 10,
  },
    {skip: false}
  );
  useEffect(() => {
    setBadgePage(1);
    setUserPage(1);
  }, [findtext]);
  const vibe = useSelector((data) => data.area.vibe);

  // Show or Hide LoadNote
  useEffect(() => {
    if (isLoading) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [isLoading, dispatch]);

  if (findtext.length < 4) {
    return <Mistaken />;
  }

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !dict) {
    return null;
  }

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Search result</Card.Title>
            <Card.Text className="small">For "{findtext}"</Card.Text>
          </Card.Body>
        </Card>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              Badges
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Found {dict.pagination?.badges_total} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              {dict.badges.length > 0 ? (
                dict.badges.map((item) => (
                  <VertItem
                    key={generateIdentity(item.id)}
                    link={`/accolade/${item.id}`}
                    head={item.name}
                    body={item.description}
                    shot={item.image}
                    hand={
                      <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                        BADGE
                      </Badge>
                    }
                  />
                ))
              ) : (
                <VertItem head="No badges found" body="Try refining your search" />
              )}
            </ListGroup>
            <div className="d-flex justify-content-between p-2">
              <button
                disabled={!dict?.pagination?.badges?.has_prev}
                onClick={() => setBadgePage((prev) => prev - 1)}
              >
                Previous
              </button>

              <button
                disabled={!dict?.pagination?.badges?.has_next}
                onClick={() => setBadgePage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </Card.Body>
        </Card>
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              Users
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Found {dict.users.length} badge(s)</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              {dict.users.length > 0 ? (
                dict.users.map((item) => (
                  <VertItem
                    key={generateIdentity(item.nickname)}
                    link={`/identity/${item.nickname}`}
                    head={item.nickname}
                    body={`Last seen on ${formatTime(item.last_login)}`}
                    shot={portraitProvider(item.email)}
                    hand={
                      <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                        #{item.rank}
                      </Badge>
                    }
                  />
                ))
              ) : (
                <VertItem head="No users found" body="Try refining your search" />
              )}
            </ListGroup>
            <div className="d-flex justify-content-between p-2">
              <button
                disabled={!dict?.pagination?.users?.has_prev}
                onClick={() => setUserPage((prev) => prev - 1)}
              >
                Previous
              </button>

              <button
                disabled={!dict?.pagination?.users?.has_next}
                onClick={() => setUserPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
