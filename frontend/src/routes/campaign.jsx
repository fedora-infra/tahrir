import { mdiBookAccount, mdiCrown, mdiHistory } from "@mdi/js";
import Icon from "@mdi/react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge, Button, Card, ListGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router";

import BaseNote from "../components/basenote.jsx";
import UserCard from "../components/usercard.jsx";
import VertItem from "../components/vertitem.jsx";
import { loadUserData } from "../features/auth.js";
import { useRetrieveCampaignQuery, useRetrieveIdentityQuery } from "../features/call.js";
import { hideLoad, showBaseNote, showLoad } from "../features/part.js";
import { formatTime, generateIdentity } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Campaign() {
  const dispatch = useDispatch();
  const authUser = useSelector((data) => data.auth.user);
  const authStat = useSelector((data) => data.auth.status);
  const vibe = useSelector((data) => data.area.vibe);
  const mode = useSelector((data) => data.area.mode);

  const isDark = mode === "dark" || (mode === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const { data: profile, isLoading: isProfileLoading } = useRetrieveIdentityQuery(authUser?.nickname, {
    skip: !authUser?.nickname,
  });

  const {
    data: invitations,
    isLoading: isCampaignLoading,
    error,
  } = useRetrieveCampaignQuery(authUser?.nickname, {
    skip: !authUser?.nickname,
  });

  const [selectedInvite, makeSelectedInvite] = useState(null);
  const downloadLink = useRef(null);

  const handleDownload = useCallback(() => {
    const canvas = downloadLink.current?.querySelector("canvas");
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `campaign-${selectedInvite.invitation_id.substring(0, 8)}.png`;
    link.href = url;
    link.click();
  }, [selectedInvite]);

  const handleCopyLink = useCallback(() => {
    const claimUrl = `${window.location.origin}/api/invitations/${selectedInvite.invitation_id}/claim`;
    navigator.clipboard.writeText(claimUrl).then(() => {
      dispatch(showBaseNote({ pass: true, data: "Link copied to clipboard" }));
    });
  }, [selectedInvite, dispatch]);

  const isLoading = isProfileLoading || isCampaignLoading;

  useEffect(() => {
    if (authStat === "idle") {
      dispatch(showLoad());
      dispatch(loadUserData());
      return;
    }
    if (authStat === "load" || isLoading) {
      dispatch(showLoad());
    } else {
      dispatch(hideLoad());
    }
  }, [authStat, isLoading, dispatch]);

  if ((authStat === "pass" || authStat === "fail") && !authUser) {
    return <Mistaken />;
  }

  if (isLoading || !profile) {
    return null;
  }

  return (
    <div className="row g-2 mb-2">
      <div className="col-12 col-lg-3 d-flex flex-column gap-2">
        <UserCard
          mail={profile.user.mail}
          name={profile.user.nickname}
          rank={profile.rank}
          perc={profile.percentile}
          poll={profile.badges.length}
          earn={profile.percent_earned}
        />
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
        <Button
          as={Link}
          to={`/identity/${authUser.nickname}`}
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiBookAccount} size={0.875} className="me-1" />
          Collection
        </Button>
        <Button
          as={Link}
          to={`/userpast/${authUser.nickname}`}
          variant="outline-secondary"
          className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
          size="sm"
          style={{ "--vibe": vibe }}
        >
          <Icon path={mdiHistory} size={0.875} className="me-1" />
          History
        </Button>
      </div>
      <div className="col-12 col-lg-9">
        <Card className="vibe-border" style={{ "--vibe": vibe }}>
          <Card.Body className="ps-0 pe-0 pt-2 pb-0">
            <Card.Title className="mb-0 ps-2 dataelem" style={{ textTransform: "capitalize" }}>
              Campaign
            </Card.Title>
            <Card.Text className="mb-0 ps-2 small">
              {error || !invitations || Object.keys(invitations).length === 0
                ? "No invitations available"
                : `${Object.values(invitations).reduce((sum, b) => sum + b.invitations.length, 0)} invitation(s)`}
            </Card.Text>
            <hr className="mt-2 mb-0" />
            <ListGroup variant="flush" className="mb-0">
              {error || !invitations || Object.keys(invitations).length === 0 ? (
                <VertItem head="No invitations found" body="Create invitations from the governor page" />
              ) : (
                Object.entries(invitations)
                  .flatMap(([accoId, accoData]) =>
                    accoData.invitations.map((invite) => ({
                      ...invite,
                      accoId,
                      accoName: accoData.name,
                      accoImage: accoData.image,
                    }))
                  )
                  .sort((a, b) => (b.created_on || 0) - (a.created_on || 0))
                  .map((invite) => (
                    <VertItem
                      key={generateIdentity(invite.invitation_id)}
                      onClick={() => makeSelectedInvite(invite)}
                      style={{ cursor: "pointer" }}
                      head={invite.accoName}
                      body={invite.expired ? "Inactive" : "Active"}
                      shot={invite.accoImage}
                      hand={
                        <Badge bg="" className="monoelem" style={{ background: vibe }}>
                          {invite.invitation_id.substring(0, 8).toUpperCase()}
                        </Badge>
                      }
                    />
                  ))
              )}
            </ListGroup>
          </Card.Body>
        </Card>
      </div>

      <Modal
        show={!!selectedInvite}
        onHide={() => makeSelectedInvite(null)}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header className="p-2" closeButton>
          <Modal.Title className="dataelem">{selectedInvite?.accoName}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          {selectedInvite && (
            <>
              <QRCodeSVG
                value={`${window.location.origin}/api/invitations/${selectedInvite.invitation_id}/claim`}
                size={256}
                fgColor={isDark ? "#ffffff" : "#000000"}
                bgColor="transparent"
              />
              <div ref={downloadLink} style={{ display: "none" }}>
                <QRCodeCanvas
                  value={`${window.location.origin}/api/invitations/${selectedInvite.invitation_id}/claim`}
                  size={512}
                  fgColor="#000000"
                  bgColor="transparent"
                />
              </div>
              <dl className="row small w-100 mt-3 mb-0">
                <dt className="col-sm-4">Status</dt>
                <dd className="col-sm-8">
                  {selectedInvite.expired ? (
                    <span className="text-danger fw-bold">INACTIVE</span>
                  ) : (
                    <span className="text-success fw-bold">ACTIVE</span>
                  )}
                </dd>
                <dt className="col-sm-4">Invitation</dt>
                <dd className="col-sm-8 monoelem">{selectedInvite.invitation_id}</dd>
                <dt className="col-sm-4">Created on</dt>
                <dd className="col-sm-8">{formatTime(selectedInvite.created_on)}</dd>
                <dt className="col-sm-4">Expires on</dt>
                <dd className="col-sm-8">{formatTime(selectedInvite.expires_on)}</dd>
              </dl>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between p-2">
          <Button variant="outline-secondary" size="sm" onClick={handleCopyLink}>
            Copy Link
          </Button>
          <Button as={Link} to={`/accolade/${selectedInvite?.accoId}`} variant="outline-secondary" size="sm">
            View Badge
          </Button>
          <Button variant="outline-secondary" size="sm" onClick={handleDownload}>
            Download PNG
          </Button>
        </Modal.Footer>
      </Modal>
      <BaseNote />
    </div>
  );
}
