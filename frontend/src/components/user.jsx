import { useParams } from "react-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { hideLoad, keepUser, showLoad, wipeExpt, makeHead, keepExpt } from "../features/part.jsx";
import { Grid } from "@mui/material";
import { formatTime, HTTPCall, PortraitProvider } from "../features/util.js";
import CustomListLink from "./link.jsx";
import CustomListItem from "./item.jsx";
import List from "@mui/material/List";
import Avatar from "@mui/material/Avatar";
import { Tag, Report, MilitaryTech, Beenhere, History } from "@mui/icons-material";

import { CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

export default function Identity() {
  const { slugdata } = useParams();
  const dispatch = useDispatch();
  const vibe = useSelector((area) => area.area.vibe);
  const user = useSelector((area) => area.area.user);
  const expt = useSelector((area) => area.area.expt);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        dispatch(showLoad());
        dispatch(wipeExpt());
        const data = await HTTPCall("GET", `/json/user/${slugdata}`);
        dispatch(keepUser(data));
        dispatch(makeHead(data.name));
      } catch (fail) {
        dispatch(keepExpt(fail.message));
      } finally {
        dispatch(hideLoad());
      }
    };

    if (slugdata) {
      fetchUserData();
    }
  }, [dispatch, slugdata]);

  if (expt) {
    return <Mistaken />;
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 12, lg: 3 }}>
          <Card variant="outlined">
            <CardMedia component="img" image={PortraitProvider(user.mail, 512)} />
            <CardContent sx={{ padding: "10px" }}>
              <Typography gutterBottom variant="h4" component="div" className="dataelem">
                {user.user}
              </Typography>
              <List sx={{ padding: "0px" }}>
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <MilitaryTech />
                    </Avatar>
                  }
                  head="Rank"
                  body={`Top ${parseFloat(user.percentile).toFixed(2)}%`}
                  side={`#${user.rank}`}
                />
                <CustomListItem
                  logo={
                    <Avatar sx={{ bgcolor: vibe }}>
                      <Beenhere />
                    </Avatar>
                  }
                  head="Badges"
                  body={`${parseFloat(user.percent_earned).toFixed(2)}%`}
                  side={`${user.serialized.length}`}
                />
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 4.5 }}>
          <Stack spacing={3} sx={{ width: "100%" }}>
            {Object.entries(user.classified).map(([category, badgeIndices]) => (
              <Card key={category} variant="outlined" sx={{ width: "100%", marginTop: 0, padding: 0 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: vibe }} className="dataelem">
                      {category.charAt(0).toUpperCase()}
                    </Avatar>
                  }
                  action={
                    <IconButton disabled={true}>
                      <Avatar sx={{ bgcolor: vibe }}>
                        <Tag />
                      </Avatar>
                    </IconButton>
                  }
                  title={category.charAt(0).toUpperCase() + category.slice(1)}
                  subheader={`${badgeIndices.length} badge(s)`}
                  style={{ padding: "6px 10px 6px 10px" }}
                />
                <Divider />
                <CardContent style={{ padding: "6px 10px 6px 10px" }}>
                  <List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
                    {badgeIndices.length > 0 ? (
                      badgeIndices.map((index) => {
                        const badge = user.serialized[index];
                        return (
                          <CustomListLink
                            key={badge.id}
                            logo={<Avatar src={badge.image} sx={{ bgcolor: vibe }} />}
                            head={badge.name}
                            body={badge.description}
                            side={new Date(badge.issued * 1000).getFullYear()}
                            href={`/discover/accolade/${badge.id}`}
                          />
                        );
                      })
                    ) : (
                      <CustomListLink
                        logo={
                          <Avatar sx={{ bgcolor: vibe }}>
                            <Report />
                          </Avatar>
                        }
                        head="No badges"
                        body={`No ${category} badges available`}
                      />
                    )}
                  </List>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 12, lg: 4.5 }}>
          <Card variant="outlined" sx={{ width: "100%", marginTop: 0, padding: 0 }}>
            <CardHeader
              avatar={
                <Avatar sx={{ bgcolor: vibe }} className="dataelem">
                  <History />
                </Avatar>
              }
              action={
                <IconButton disabled={true}>
                  <Avatar sx={{ bgcolor: vibe }}>
                    <Tag />
                  </Avatar>
                </IconButton>
              }
              title="History"
              subheader={`${user.serialized.length} badge(s)`}
              style={{ padding: "6px 10px 6px 10px" }}
            />
            <Divider />
            <CardContent style={{ padding: "6px 10px 6px 10px" }}>
              <List sx={{ paddingTop: "0px", paddingBottom: "0px" }}>
                {user.serialized && user.serialized.length > 0 ? (
                  user.serialized.map((badge) => (
                    <CustomListLink
                      key={badge.id}
                      logo={<Avatar src={badge.image} sx={{ bgcolor: vibe }} />}
                      head={badge.name}
                      body={
                        <span>
                          <span>{`Earned on ${formatTime(badge.issued)}`}</span>
                          {badge.reason && (
                            <span>
                              &nbsp;for&nbsp;
                              <Link href={badge.reason} target="_blank" rel="noopener noreferrer" underline="none">
                                this activity
                              </Link>
                            </span>
                          )}
                        </span>
                      }
                      side=""
                      href={`/discover/accolade/${badge.id}`}
                    />
                  ))
                ) : (
                  <CustomListLink
                    logo={
                      <Avatar sx={{ bgcolor: vibe }}>
                        <Report />
                      </Avatar>
                    }
                    head="No history"
                    body="No badges earned yet"
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
