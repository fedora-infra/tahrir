import { Home, MilitaryTech, Fingerprint, Settings, GpsFixed, Person, Public, Storage } from "@mui/icons-material";

import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import SideItem from "./side.jsx";

export default function DrawList({ vibe }) {
  return (
    <div>
      <Toolbar variant="dense" sx={{ color: vibe }}>
        <Typography fontWeight="bold">Fedora Badges</Typography>
      </Toolbar>
      <Divider />
      <List>
        <SideItem dest="/" icon={<Home />} name="Home" />
        <SideItem dest="/discover" icon={<Public />} name="Discover" />
        <SideItem dest="/rankings" icon={<MilitaryTech />} name="Rankings" />
        <SideItem dest="/profiles" icon={<Person />} name="Profiles" />
      </List>
      <Divider />
      <List>
        <SideItem dest="/userdata" icon={<Fingerprint />} name="Userdata" />
        <SideItem dest="/operator" icon={<GpsFixed />} name="Operator" />
        <SideItem dest="/database" icon={<Storage />} name="Database" />
        <SideItem dest="/settings" icon={<Settings />} name="Settings" />
      </List>
    </div>
  );
}
