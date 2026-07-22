import { mdiArrowLeft, mdiArrowRight, mdiLink, mdiViewGridPlus } from "@mdi/js";
import Icon from "@mdi/react";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams, useSearchParams } from "react-router";

import VertItem from "../components/vertitem.jsx";
import { useRetrieveAccoladeQuery, useRetrieveAvermentQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { formatTime, generateIdentity, portraitProvider, rarities, relativeImageUrl } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Accolade() {
  const { slugdata: accolade } = useParams();
  const vibe = useSelector((data) => data.area.vibe);
  const mode = useSelector((data) => data.area.mode);
  const isDark = mode === "dark" || (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // URL-based pagination and obtain page number called by user
  const [pageCall, setPageCall] = useSearchParams();
  const currPage = Math.max(0, parseInt(pageCall.get("page") || "1", 10) - 1);
  const [paginating, setPaginating] = useState(false);
  const pageSize = 100;

  const {
    data: acco,
    isLoading: mainLoad,
    error: mainFlaw,
  } = useRetrieveAccoladeQuery(accolade, {
    skip: !accolade,
  });

  const {
    data: averment,
    isLoading: averLoad,
    error: averFlaw,
  } = useRetrieveAvermentQuery(
    {
      accolade,
      begin: currPage * pageSize,
      limit: pageSize,
    },
    {
      skip: !accolade,
    }
  );

  // Transform averment data to match expected structure
  const averlist = useMemo(() => {
    if (!averment || !Array.isArray(averment)) return [];

    return averment.map((item) => ({
      name: item.person?.nickname,
      date: item.issued_on,
      mail: item.person?.mail,
      rank: item.person?.rank,
    }));
  }, [averment]);

  const progress = mainLoad || averLoad || paginating;
  const haveError = mainFlaw || averFlaw;

  // Pagination handlers
  const handleNextPage = () => {
    setPaginating(true);
    const nextPage = currPage + 2; // Convert back to 1-based for URL
    setPageCall({ page: nextPage.toString() });
  };

  const handlePrevPage = () => {
    setPaginating(true);
    if (currPage === 1) {
      setPageCall({}); // Remove page param for page 1
    } else {
      setPageCall({ page: currPage.toString() }); // currPage is 0-based, so this gives us the correct 1-based previous page
    }
  };

  const awardees = acco?.times_awarded || 0;
  const pagePoll = Math.ceil(awardees / pageSize);
  const haveNextPage = currPage + 1 < pagePoll;
  const havePrevPage = currPage > 0;

  // Reset paginating state when data changes
  useEffect(() => {
    setPaginating(false);
  }, [averlist]);

  // Validate page parameter and redirect if invalid
  useEffect(() => {
    const calledPage = pageCall.get("page");
    if (calledPage) {
      const pageIter = parseInt(calledPage, 10);
      if (isNaN(pageIter) || pageIter < 1) {
        setPageCall({}); // Redirect to page 1 (no param)
        return;
      }
      if (awardees > 0 && pagePoll > 0 && pageIter > pagePoll) {
        setPageCall({ page: pagePoll.toString() }); // Redirect to last valid page
      }
    }
  }, [pageCall, awardees, pagePoll, setPageCall]);

  useLoadingState(progress);

  if (haveError) {
    return <Mistaken />;
  }

  if (mainLoad || averLoad || !acco) {
    return null;
  }

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3 d-flex flex-column gap-2">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Img variant="top" src={relativeImageUrl(acco.image)} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate mb-1">{acco.name}</Card.Title>
            <Card.Text className="small mb-2">{acco.description}</Card.Text>
            <div>
              {acco.tags &&
                acco.tags.map((name) => (
                  <Badge
                    key={generateIdentity(name)}
                    as={Link}
                    to={`/category/${name}`}
                    className="monoelem vibe-badge text-capitalize text-decoration-none me-1"
                    style={{ "--vibe": vibe }}
                  >
                    {name}
                  </Badge>
                ))}
            </div>
          </Card.Body>
        </Card>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Tier</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <VertItem
                link={`/rarities/${acco.rarity}`}
                head={rarities[acco.rarity]}
                body={`${parseFloat(acco.percent_earned).toFixed(4)}% earned`}
                shot={`/imgs/rare_${acco.rarity.toLowerCase()}.png`}
              />
            </ListGroup>
          </Card.Body>
        </Card>
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem">Status</Card.Title>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              <VertItem
                link={acco.legacy ? "/deadlist" : "/livelist"}
                head={acco.legacy ? "Legacy" : "Modern"}
                body={acco.legacy ? "This badge is currently deactivated" : "This badge is currently active"}
                shot={`/imgs/stat_${acco.legacy ? "legacy" : "modern"}_${isDark ? "dark" : "lite"}.svg`}
              />
            </ListGroup>
          </Card.Body>
        </Card>
        {acco.assertions && (
          <>
            {acco.assertions.origin.person && (
              <Card className="vibe-border" style={{ "--vibe": vibe }}>
                <Card.Body className="ps-0 pe-0 pt-2 pb-0">
                  <Card.Title className="mb-0 ps-2 dataelem">First awarded</Card.Title>
                  <hr className="mt-2 mb-0" />
                  <ListGroup variant="flush">
                    <VertItem
                      link={`/identity/${acco.assertions.origin.person.nickname}`}
                      head={acco.assertions.origin.person.nickname}
                      body={`On ${formatTime(acco.assertions.origin.issued_on)}`}
                      shot={portraitProvider(acco.assertions.origin.person.mail)}
                    />
                  </ListGroup>
                </Card.Body>
              </Card>
            )}
            {acco.assertions.recent.person && (
              <Card className="vibe-border" style={{ "--vibe": vibe }}>
                <Card.Body className="ps-0 pe-0 pt-2 pb-0">
                  <Card.Title className="mb-0 ps-2 dataelem">Last awarded</Card.Title>
                  <hr className="mt-2 mb-0" />
                  <ListGroup variant="flush">
                    <VertItem
                      link={`/identity/${acco.assertions.recent.person.nickname}`}
                      head={acco.assertions.recent.person.nickname}
                      body={`On ${formatTime(acco.assertions.recent.issued_on)}`}
                      shot={portraitProvider(acco.assertions.recent.person.mail)}
                    />
                  </ListGroup>
                </Card.Body>
              </Card>
            )}
          </>
        )}
        <Button
          as="a"
          href={acco.criteria}
          target="_blank"
          rel="noopener noreferrer"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiLink} size={0.875} className="me-1" />
          Criteria
        </Button>
        <Button
          as={Link}
          to="/assembly"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiViewGridPlus} size={0.875} className="me-1" />
          Collection
        </Button>
        {(havePrevPage || haveNextPage) && (
          <div className="d-flex justify-content-between align-items-center">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handlePrevPage}
              disabled={!havePrevPage || averLoad || paginating}
              className="vibe-border d-flex align-items-center justify-content-center"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiArrowLeft} size={0.875} />
            </Button>
            <span className="small text-muted">
              {pagePoll > 1 ? `${currPage + 1} of ${pagePoll}` : `Page ${currPage + 1}`}
            </span>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleNextPage}
              disabled={!haveNextPage || averLoad || paginating}
              className="vibe-border d-flex align-items-center justify-content-center"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiArrowRight} size={0.875} />
            </Button>
          </div>
        )}
      </div>
      <div className="col-12 col-lg-9">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              History
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">
              {awardees > 0 ? (
                <>
                  {awardees} total awards • Page {currPage + 1} of {pagePoll}
                  {averlist.length > 0 &&
                    ` • Showing ${currPage * pageSize + 1}-${currPage * pageSize + averlist.length}`}
                </>
              ) : (
                "Be the first one to earn the badge"
              )}
            </Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              {averlist && averlist.length > 0 ? (
                averlist.map((item) => (
                  <VertItem
                    key={generateIdentity(item.name)}
                    link={`/identity/${item.name}`}
                    head={item.name}
                    body={`On ${formatTime(item.date)}`}
                    shot={portraitProvider(item.mail)}
                    hand={
                      <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                        #{item.rank}
                      </Badge>
                    }
                  />
                ))
              ) : (
                <VertItem head="No awardees found" body="Be the first one to earn the badge" />
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
