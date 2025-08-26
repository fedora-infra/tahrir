import { useParams } from "react-router";
import { useEffect } from "react";
import { Tag, AddCircle, PushPin, Room, CheckCircle, Sell, Lock, Report } from "@mui/icons-material";
import Avatar from "@mui/material/Avatar";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import { useDispatch, useSelector } from "react-redux";
import { CardHeader, Grid, Chip } from "@mui/material";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import { formatTime } from "../features/util.js";
import { PortraitProvider, HTTPCall } from "../features/util.js";
import CustomListItem from "./item.jsx";
import CustomListLink from "./link.jsx";
import Mistaken from "./flaw.jsx";

import { makeHead, keepAcco, showLoad, hideLoad, keepExpt, wipeExpt } from "../features/part.jsx";

export default function Accolade() {
  const { slugdata } = useParams();
  const dispatch = useDispatch();
  const vibe = useSelector((area) => area.area.vibe);
  const acco = useSelector((area) => area.area.acco);
  const expt = useSelector((area) => area.area.expt);

  useEffect(() => {
    const fetchBadgeData = async () => {
      try {
        dispatch(showLoad());
        dispatch(wipeExpt());
        const data = await HTTPCall("GET", `/badge/${slugdata}/json`);
        dispatch(keepAcco(data));
        dispatch(makeHead(data.name));
      } catch (fail) {
        dispatch(keepExpt(fail.message));
      } finally {
        dispatch(hideLoad());
      }
    };

    if (slugdata) {
      fetchBadgeData();
    }
  }, [dispatch, slugdata]);

  if (expt) {
    return <Mistaken />;
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <Card variant="outlined" sx={{ width: "100%", marginTop: 0, padding: 0 }}>
            <CardHeader
              avatar={<Avatar src={acco.image} />}
              action={
                <IconButton disabled={true}>
                  <Avatar sx={{ bgcolor: vibe }}>
                    <Tag />
                  </Avatar>
                </IconButton>
              }
              title={acco.name || slugdata}
              subheader={acco.description || slugdata}
              style={{ padding: "6px 10px 6px 10px" }}
            />
            <Divider />
            <CardContent style={{ padding: "6px 10px 6px 10px" }}>
              <List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <AddCircle />
                    </Avatar>
                  }
                  head="Awarded"
                  body={`${acco.times_awarded} time(s)`}
                  side={`${parseFloat(acco.percent_earned).toFixed(2)}%`}
                />
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <PushPin />
                    </Avatar>
                  }
                  head="First"
                  body={`Awarded on ${formatTime(acco.first_awarded)}`}
                  side={`@${acco.first_awarded_person}`}
                />
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <Room />
                    </Avatar>
                  }
                  head="Last"
                  body={`Awarded on ${formatTime(acco.last_awarded)}`}
                  side={`@${acco.last_awarded_person}`}
                />
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <CheckCircle />
                    </Avatar>
                  }
                  head="Issuer"
                  body={acco.issuer}
                />
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <Lock />
                    </Avatar>
                  }
                  head="Criteria"
                  body={acco.criteria}
                />
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <Sell />
                    </Avatar>
                  }
                  head="Tags"
                  body={
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                      {acco.tags &&
                        acco.tags
                          .split(",")
                          .map((tag) => tag.trim())
                          .filter((tag) => tag !== "")
                          .map((tag, index) => <Chip key={index} label={tag} size="small" />)}
                    </div>
                  }
                />
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 6, lg: 6 }}>
          <Card variant="outlined" sx={{ width: "100%", marginTop: 0, padding: 0 }}>
            <CardHeader
              avatar={<Avatar src={acco.image} />}
              action={
                <IconButton disabled={true}>
                  <Avatar sx={{ bgcolor: vibe }}>
                    <Tag />
                  </Avatar>
                </IconButton>
              }
              title="Recipients"
              subheader={`${acco.times_awarded} account(s)`}
              style={{ padding: "6px 10px 6px 10px" }}
            />
            <Divider />
            <CardContent style={{ padding: "6px 10px 6px 10px" }}>
              <List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
                {acco.assertions?.map((assertion, iter) => (
                  <CustomListLink
                    key={iter}
                    logo={<Avatar src={PortraitProvider(assertion.mail, 40)} />}
                    head={assertion.name}
                    body={`Awarded on ${formatTime(assertion.date)}`}
                    side={`#${assertion.rank}`}
                    href={`/discover/identity/${assertion.name}`}
                  />
                )) || (
                  <CustomListItem
                    logo={
                      <Avatar sx={{ bgcolor: vibe }}>
                        <Report />
                      </Avatar>
                    }
                    head="No assertions available"
                    body="No assertions available"
                  />
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
