import { mdiCalendarCheck, mdiCalendarHeart, mdiCalendarMonth, mdiCalendarRange, mdiCalendarWeek } from "@mdi/js";
import Icon from "@mdi/react";
import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Form, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams, useSearchParams } from "react-router";

import VertItem from "../components/vertitem.jsx";
import { useRetrieveRankingsQuery } from "../features/call.js";
import { useLoadingState } from "../features/hooks.js";
import { keepDate } from "../features/part.js";
import { generateIdentity, portraitProvider } from "../features/util.js";
import Mistaken from "./mistaken.jsx";


export default function Rankings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const thisdate = new Date();
  const { y, m, d } = useParams();
  const isweekly = location.pathname.endsWith("/week");
  const isCustomRange = location.pathname === "/rankings/range";
  const [searchParams, setSearchParams] = useSearchParams();
  const rangeStart = searchParams.get("start");
  const rangeEnd = searchParams.get("end");
  const [startField, setStartField] = useState(rangeStart || "");
  const [endField, setEndField] = useState(rangeEnd || "");
  const pickdate = useSelector((state) => state.area.date);
  const vibe = useSelector((data) => data.area.vibe);

  useEffect(() => {
    setStartField(rangeStart || "");
    setEndField(rangeEnd || "");
  }, [rangeStart, rangeEnd]);

  const readDate = () => {
    if (y && m && d) {
      return `${y}-${m.toString().padStart(2, "0")}-${d.toString().padStart(2, "0")}`;
    }
    return pickdate || "";
  };

  const handleChange = (event) => {
    const date = event.target.value;
    dispatch(keepDate(date));

    if (date) {
      const [year, month, day] = date.split("-");
      const weekSuffix = isweekly ? "/week" : "";
      navigate(`/rankings/y/${year}/m/${parseInt(month)}/d/${parseInt(day)}${weekSuffix}`);
    } else {
      navigate("/rankings");
    }
  };

  const stdParams = {
    ...(y && { y: parseInt(y) }),
    ...(m && { m: parseInt(m) }),
    ...(d && { d: parseInt(d) }),
    ...(isweekly && { w: true }),
  };

  const apiParams =
    isCustomRange && rangeStart && rangeEnd
      ? { start: rangeStart, end: rangeEnd }
      : stdParams;

  const skipRetrieve = isCustomRange && (!rangeStart || !rangeEnd);

  const { data: dict, isLoading, error } = useRetrieveRankingsQuery(apiParams, { skip: skipRetrieve });

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  const loadingBlocked =
    (!isCustomRange && (isLoading || !dict)) ||
    (isCustomRange && rangeStart && rangeEnd && (isLoading || !dict));

  if (loadingBlocked) {
    return null;
  }

  const showDate = () => {
    if (isCustomRange) {
      if (rangeStart && rangeEnd) return `${rangeStart} to ${rangeEnd}`;
      return "Pick start and end dates";
    }
    if (Object.keys(stdParams).length === 0) return "All time";

    const date = new Date();
    if (stdParams.y) date.setFullYear(stdParams.y);
    if (stdParams.m) date.setMonth(stdParams.m - 1);
    if (stdParams.d) date.setDate(stdParams.d);

    const option = {};
    if (stdParams.y) option.year = "numeric";
    if (stdParams.m) option.month = "long";
    if (stdParams.d) option.day = "numeric";

    return date.toLocaleDateString("en-US", option);
  };

  const showHead = () => {
    if (isCustomRange) return "Custom range";
    let name = "";
    if (stdParams.w) name = "Weekly";
    else if (stdParams.d) name = "Daily";
    else if (stdParams.m) name = "Monthly";
    else if (stdParams.y) name = "Yearly";
    else name = "All time";
    return name;
  };

  const readLink = (conf = "") => {
    let link = "";
    if (conf === "d")
      link = `/rankings/y/${thisdate.getFullYear()}/m/${thisdate.getMonth() + 1}/d/${thisdate.getDate()}`;
    else if (conf === "w")
      link = `/rankings/y/${thisdate.getFullYear()}/m/${thisdate.getMonth() + 1}/d/${thisdate.getDate()}/week`;
    else if (conf === "m") link = `/rankings/y/${thisdate.getFullYear()}/m/${thisdate.getMonth() + 1}`;
    else if (conf === "y") link = `/rankings/y/${thisdate.getFullYear()}`;
    else link = `/rankings`;
    return link;
  };

  const scanDate = (conf = "") => {
    if (conf === "d")
      return (
        stdParams.y &&
        stdParams.m &&
        stdParams.d &&
        (stdParams.y !== thisdate.getFullYear() ||
          stdParams.m !== thisdate.getMonth() + 1 ||
          stdParams.d !== thisdate.getDate()) &&
        isweekly
      );
    else if (conf === "w")
      return (
        stdParams.y &&
        stdParams.m &&
        stdParams.d &&
        (stdParams.y !== thisdate.getFullYear() ||
          stdParams.m !== thisdate.getMonth() + 1 ||
          stdParams.d !== thisdate.getDate()) &&
        !isweekly
      );
    else if (conf === "m")
      return stdParams.y && stdParams.m && (stdParams.y !== thisdate.getFullYear() || stdParams.m !== thisdate.getMonth() + 1);
    else if (conf === "y") return stdParams.y && stdParams.y !== thisdate.getFullYear();
    return false;
  };

  return (
    <div className="row g-2">
      <div className="col-12 col-lg-3">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Rankings</Card.Title>
            <Card.Text className="small">{showDate()}</Card.Text>
            {isCustomRange ? (
              <Card.Text>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!startField || !endField) return;
                    setSearchParams({ start: startField, end: endField });
                  }}
                >
                  <Form.Label className="small mb-0">Start</Form.Label>
                  <Form.Control
                    type="date"
                    value={startField}
                    onChange={(e) => setStartField(e.target.value)}
                    className="mb-2"
                    size="sm"
                    autoComplete="off"
                  />
                  <Form.Label className="small mb-0">End</Form.Label>
                  <Form.Control
                    type="date"
                    value={endField}
                    onChange={(e) => setEndField(e.target.value)}
                    className="mb-2"
                    size="sm"
                    autoComplete="off"
                  />
                  <Button type="submit" size="sm" variant="outline-secondary" className="w-100 vibe-border" style={{ "--vibe": vibe }}>
                    Show rankings
                  </Button>
                </Form>
              </Card.Text>
            ) : (
              <Card.Text>
                <Form.Control type="date" value={readDate()} onChange={handleChange} size="sm" autoComplete="off" />
              </Card.Text>
            )}
          </Card.Body>
        </Card>
        <div className="d-grid gap-2">
          <Button
            as={Link}
            to={readLink("d")}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarRange} size={0.875} className="me-1" />
            For today
          </Button>
          <Button
            as={Link}
            to={readLink("w")}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarWeek} size={0.875} className="me-1" />
            This week
          </Button>
          <Button
            as={Link}
            to={readLink("m")}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarMonth} size={0.875} className="me-1" />
            This month
          </Button>
          <Button
            as={Link}
            to={readLink("y")}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarCheck} size={0.875} className="me-1" />
            This year
          </Button>
          <Button
            as={Link}
            to={readLink()}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarHeart} size={0.875} className="me-1" />
            All time
          </Button>
          <Button
            as={Link}
            to="/rankings/range"
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarRange} size={0.875} className="me-1" />
            Custom date range
          </Button>
          {scanDate("y") || scanDate("m") || scanDate("w") || scanDate("d") ? <hr className="m-0" /> : null}
          {scanDate("w") ? (
            <Button
              as={Link}
              to={`/rankings/y/${stdParams.y}/m/${stdParams.m}/d/${stdParams.d}/week`}
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiCalendarWeek} size={0.875} className="me-1" />
              That week
            </Button>
          ) : null}
          {scanDate("d") ? (
            <Button
              as={Link}
              to={`/rankings/y/${stdParams.y}/m/${stdParams.m}/d/${stdParams.d}`}
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiCalendarRange} size={0.875} className="me-1" />
              That date
            </Button>
          ) : null}
          {scanDate("m") ? (
            <Button
              as={Link}
              to={`/rankings/y/${stdParams.y}/m/${stdParams.m}`}
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiCalendarMonth} size={0.875} className="me-1" />
              For {new Date(stdParams.y, stdParams.m - 1).toLocaleDateString("en-US", { month: "long" })}
            </Button>
          ) : null}
          {scanDate("y") ? (
            <Button
              as={Link}
              to={`/rankings/y/${stdParams.y}`}
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
            >
              <Icon path={mdiCalendarCheck} size={0.875} className="me-1" />
              For {stdParams.y}
            </Button>
          ) : null}
        </div>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="mb-2 vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              {showHead()}
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">Showing top performers</Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush">
              {dict && dict.length > 0 ? (
                dict.map((item) => (
                  <VertItem
                    key={generateIdentity(item.nickname)}
                    link={`/identity/${item.nickname}`}
                    shot={portraitProvider(item.mail)}
                    head={item.nickname}
                    body={`Collected ${item.badges} badge(s) ${y || m || d || isweekly || (isCustomRange && rangeStart && rangeEnd) ? `during this period • Global rank #${item.rank.global}` : ""}`}
                    hand={
                      <Badge className="monoelem vibe-badge" style={{ "--vibe": vibe }}>
                        #{item.rank.period}
                      </Badge>
                    }
                  />
                ))
              ) : (
                <VertItem head="No rankings available" body="No awarding found for this period" />
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
