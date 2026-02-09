import { Image, ListGroup } from "react-bootstrap";
import { Link } from "react-router";

export default function VertItem({ link, head, body, shot, hand, onClick }) {
  if (shot) {
    shot = shot.toString().replace("https://badges.fedoraproject.org", "");
  }

  return (
    <ListGroup.Item
      className="p-2"
      action={!!link || !!onClick}
      as={link ? Link : undefined}
      to={link}
      onClick={onClick}
    >
      <div className="d-flex w-100" style={{ gap: "0.5rem" }}>
        {shot ? (
          <div style={{ aspectRatio: "1/1", height: "45px" }}>
            <Image src={shot} className="w-100 h-100 circle-border" />
          </div>
        ) : null}
        <div className="d-flex flex-column flex-grow-1 text-truncate m-0">
          <div className="d-flex justify-content-between align-items-start">
            <span className="m-0 text-truncate">{head}</span>
            {hand ? hand : null}
          </div>
          <span className="small text-truncate">{body}</span>
        </div>
      </div>
    </ListGroup.Item>
  );
}
