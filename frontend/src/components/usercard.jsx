import { Card } from "react-bootstrap";
import { useSelector } from "react-redux";

import { portraitProvider } from "../features/util.js";

export default function UserCard({ mail, name, rank, perc, poll, earn }) {
  const vibe = useSelector((data) => data.area.vibe);

  return (
    <Card className="vibe-border" style={{ "--vibe": vibe }}>
      <Card.Img variant="top" src={portraitProvider(mail, 512)} />
      <Card.Body className="p-2">
        <Card.Title className="dataelem text-truncate">{name}</Card.Title>
        <Card.Text className="small">
          Rank #{rank}
          <br />
          Top {parseFloat(perc).toFixed(2)}%
          <br />
          Collected {poll} badge(s)
          <br />
          Has {parseFloat(earn).toFixed(2)}%
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
