import { Dropdown, Image } from "react-bootstrap";
import { Link } from "react-router";

import { generateIdentity, portraitProvider } from "../features/util.js";

export default function FindList({ type, list, hide }) {
  return (
    <>
      <Dropdown.Header className="small p-1">{type === "accolade" ? "Badges" : "Users"}</Dropdown.Header>
      {list.slice(0, 4).map((unit) => (
        <Dropdown.Item
          key={generateIdentity(type === "accolade" ? unit.id : unit.nickname)}
          onClick={() => hide()}
          className="small d-flex align-items-center p-1"
          as={Link}
          to={`/discover/${type}/${type === "accolade" ? unit.id : unit.nickname}`}
        >
          <Image
            rounded={true}
            src={type === "accolade" ? unit.image : portraitProvider(unit.email, 40)}
            width="40"
            height="40"
            className="me-2"
          />
          <div className="flex-grow-1 overflow-hidden">
            <div className="fw-bold text-truncate">{type === "accolade" ? unit.name : unit.nickname}</div>
            <div className="small text-muted text-truncate">
              {type === "accolade" ? unit.description : `#${unit.rank}`}
            </div>
          </div>
        </Dropdown.Item>
      ))}
      {list.length > 4 && (
        <Dropdown.Item disabled className="small text-muted p-1">
          +{list.length - 4} more {type === "accolade" ? "badges" : "users"}
        </Dropdown.Item>
      )}
    </>
  );
}
