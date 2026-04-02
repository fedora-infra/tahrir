import { mdiArrowLeft, mdiArrowRight } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useState } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
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
  const [badgePaginating, setBadgePaginating] = useState(false);
  const [userPage, setUserPage] = useState(1);
  const [userPaginating, setUserPaginating] = useState(false);
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

  // Badge Pagination handlers
  const handleNextBadgePage = () => {
    setBadgePaginating(true);
    setBadgePage((prev) => prev + 1);
  };

  const handlePrevBadgePage = () => {
    setBadgePaginating(true);
    if (badgePage > 1) {
      setBadgePage(badgePage - 1);
    }
  };

  // User Pagination handlers
  const handleNextUserPage = () => {
    setUserPaginating(true);
    setUserPage((prev) => prev + 1);
  };

  const handlePrevUserPage = () => {
    setUserPaginating(true);
    if (userPage > 1) {
      setUserPage(userPage - 1);
    }
  };

  const haveNextBadgePage = dict?.pagination?.badges?.has_next;
  const havePrevBadgePage = dict?.pagination?.badges?.has_prev;
  const haveNextUserPage = dict?.pagination?.users?.has_next;
  const havePrevUserPage = dict?.pagination?.users?.has_prev;

  useEffect(() => {
    setBadgePaginating(false);
  }, [dict?.badges]);

  useEffect(() => {
    setUserPaginating(false);
  }, [dict?.users]);

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
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handlePrevBadgePage}
                disabled={!havePrevBadgePage || badgePaginating}
                className="vibe-border d-flex align-items-center justify-content-center"
                style={{ "--vibe": vibe }}
              >
                <Icon path={mdiArrowLeft} size={0.875} />
              </Button>
              <span className="small text-muted">
                {dict?.pagination?.badges?.page} of {dict?.pagination?.badges?.pages}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleNextBadgePage}
                disabled={!haveNextBadgePage || badgePaginating}
                className="vibe-border d-flex align-items-center justify-content-center"
                style={{ "--vibe": vibe }}
              >
                <Icon path={mdiArrowRight} size={0.875} />
              </Button>
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
            <div className="d-flex justify-content-between align-items-center mt-2">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handlePrevUserPage}
                disabled={!havePrevUserPage || userPaginating}
                className="vibe-border d-flex align-items-center justify-content-center"
                style={{ "--vibe": vibe }}
              >
                <Icon path={mdiArrowLeft} size={0.875} />
              </Button>
              <span className="small text-muted">
                {dict?.pagination?.users?.page} of {dict?.pagination?.users?.pages}
              </span>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleNextUserPage}
                disabled={!haveNextUserPage || userPaginating}
                className="vibe-border d-flex align-items-center justify-content-center"
                style={{ "--vibe": vibe }}
              >
                <Icon path={mdiArrowRight} size={0.875} />
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
