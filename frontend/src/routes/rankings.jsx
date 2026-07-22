import { mdiCalendarCheck, mdiCalendarHeart, mdiCalendarMonth, mdiCalendarRange, mdiCalendarWeek } from "@mdi/js";
import Icon from "@mdi/react";
import { Badge, Button, Card, Form, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router";

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
  const pickdate = useSelector((state) => state.area.date);
  const vibe = useSelector((data) => data.area.vibe);

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

  const params = {
    ...(y && { y: parseInt(y) }),
    ...(m && { m: parseInt(m) }),
    ...(d && { d: parseInt(d) }),
    ...(isweekly && { w: true }),
  };

  const { data: dict, isLoading, error } = useRetrieveRankingsQuery(params, { skip: false });

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !dict) {
    return null;
  }

  const showDate = () => {
    if (Object.keys(params).length === 0) return "All time";

    const date = new Date();
    if (params.y) date.setFullYear(params.y);
    if (params.m) date.setMonth(params.m - 1);
    if (params.d) date.setDate(params.d);

    const option = {};
    if (params.y) option.year = "numeric";
    if (params.m) option.month = "long";
    if (params.d) option.day = "numeric";

    return date.toLocaleDateString("en-US", option);
  };

  const showHead = () => {
    let name = "";
    if (params.w) name = "Weekly";
    else if (params.d) name = "Daily";
    else if (params.m) name = "Monthly";
    else if (params.y) name = "Yearly";
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
        params.y &&
        params.m &&
        params.d &&
        (params.y !== thisdate.getFullYear() ||
          params.m !== thisdate.getMonth() + 1 ||
          params.d !== thisdate.getDate()) &&
        isweekly
      );
    else if (conf === "w")
      return (
        params.y &&
        params.m &&
        params.d &&
        (params.y !== thisdate.getFullYear() ||
          params.m !== thisdate.getMonth() + 1 ||
          params.d !== thisdate.getDate()) &&
        !isweekly
      );
    else if (conf === "m")
      return params.y && params.m && (params.y !== thisdate.getFullYear() || params.m !== thisdate.getMonth() + 1);
    else if (conf === "y") return params.y && params.y !== thisdate.getFullYear();
    return false;
  };

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3 d-flex flex-column gap-2">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">Rankings</Card.Title>
            <Card.Text className="small">{showDate()}</Card.Text>
            <Card.Text>
              <Form.Control type="date" value={readDate()} onChange={handleChange} size="sm" autoComplete="off" />
            </Card.Text>
          </Card.Body>
        </Card>
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
        {scanDate("y") || scanDate("m") || scanDate("w") || scanDate("d") ? <hr className="m-0" /> : null}
        {scanDate("w") ? (
          <Button
            as={Link}
            to={`/rankings/y/${params.y}/m/${params.m}/d/${params.d}/week`}
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
            to={`/rankings/y/${params.y}/m/${params.m}/d/${params.d}`}
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
            to={`/rankings/y/${params.y}/m/${params.m}`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarMonth} size={0.875} className="me-1" />
            For {new Date(params.y, params.m - 1).toLocaleDateString("en-US", { month: "long" })}
          </Button>
        ) : null}
        {scanDate("y") ? (
          <Button
            as={Link}
            to={`/rankings/y/${params.y}`}
            variant="outline-secondary"
            className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
            size="sm"
            style={{ "--vibe": vibe }}
          >
            <Icon path={mdiCalendarCheck} size={0.875} className="me-1" />
            For {params.y}
          </Button>
        ) : null}
      </div>
      <div className="col-12 col-lg-9">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
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
                    body={`Collected ${item.badges} badge(s) ${y || m || d || isweekly ? `during this period • Global rank #${item.rank.global}` : ""}`}
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
