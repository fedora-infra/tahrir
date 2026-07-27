import { mdiBookAccount, mdiCrown, mdiFencing, mdiHistory, mdiSend } from "@mdi/js";
import Icon from "@mdi/react";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router";

export default function UserSide({ identity, authUser }) {
  const vibe = useSelector((data) => data.area.vibe);
  const page = useLocation().pathname.split("/")[1];
  const self = authUser && authUser.nickname === identity;

  return (
    <>
      {page !== "authlist" && self && (
        <Button
          as={Link}
          to="/authlist"
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiCrown} size={0.875} className="me-1" />
          Approval
        </Button>
      )}
      {page !== "campaign" && self && (
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
      {page !== "identity" && (
        <Button
          as={Link}
          to={`/identity/${identity}`}
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiBookAccount} size={0.875} className="me-1" />
          Collection
        </Button>
      )}
      {page !== "contrast" && authUser && !self && (
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
      {page !== "userpast" && (
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
      )}
    </>
  );
}
