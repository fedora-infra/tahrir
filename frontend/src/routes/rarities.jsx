import { Button, Card, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

import AccoItem from "../components/accoitem.jsx";
import Grouping from "../components/grouping.jsx";
import SideArea from "../components/sidearea.jsx";
import { useRetrieveRaritiesQuery } from "../features/call.js";
import { useLoadingState } from "../features/hook.js";
import { formatTime, generateIdentity, obtainRarityText, rareColors, rarities } from "../features/util.js";
import Mistaken from "./mistaken.jsx";

export default function Rarities() {
  const { slugdata: rareunit } = useParams();
  const { data: list, isLoading, error } = useRetrieveRaritiesQuery(rareunit);
  const vibe = useSelector((data) => data.area.vibe);

  useLoadingState(isLoading);

  if (error) {
    return <Mistaken />;
  }

  if (isLoading || !list) {
    return null;
  }

  const page = [...list].sort((a, b) => a.rate - b.rate);

  return (
    <div className="row g-2 mb-2">
      <SideArea>
        <Card className="vibe-border" style={{ "--vibe": rareColors[rareunit.toUpperCase()] }}>
          <Card.Img variant="top" src={`/imgs/rare_${rareunit.toLowerCase()}.png`} />
          <Card.Body className="p-2">
            <Card.Title className="dataelem text-truncate">{rarities[rareunit.toUpperCase()]}</Card.Title>
            <Card.Text className="small">
              {`${parseFloat(page[0].rate).toFixed(4)}% - ${parseFloat(page[page.length - 1].rate).toFixed(4)}% collectorship`}
            </Card.Text>
          </Card.Body>
        </Card>
        {Object.keys(rarities)
          .filter((unit) => unit !== rareunit?.toUpperCase())
          .map((item) => (
            <Button
              key={generateIdentity(item)}
              as={Link}
              to={`/rarities/${item}`}
              variant="outline-secondary"
              className="d-grid d-inline-flex align-items-center ps-1 vibe-border"
              size="sm"
              style={{ "--vibe": vibe }}
            >
              <Image className="rarity-icon circle-border" src={`/imgs/rare_${item.toLowerCase()}.png`} />
              &nbsp;&nbsp;
              <span>
                Tier {item}
                &nbsp;•&nbsp;
                <span className={`fw-bold ${obtainRarityText(item)}`}>{rarities[item]}</span>
              </span>
            </Button>
          ))}
      </SideArea>
      <div className="col-12 col-lg-9">
        <Grouping name={`Tier ${rareunit}`} wide={page.length} head={true}>
          {page.map((item) => (
            <AccoItem
              key={generateIdentity(item.id)}
              iden={item.id}
              name={item.name}
              body={item.desc}
              foot={formatTime(item.date)}
              shot={item.shot}
              rare={item.rare}
            />
          ))}
        </Grouping>
      </div>
    </div>
  );
}
