import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";

export default function CustomListLink({ logo, head, body, side, href }) {
  return (
    <ListItemButton component={Link} to={href} disableGutters={true} dense={true} sx={{ padding: "0px" }}>
      <ListItemIcon>{logo}</ListItemIcon>
      <ListItemText primary={head} secondary={body} />
      <IconButton edge="end" disabled={true}>
        <span className="dataelem">{side}</span>
      </IconButton>
    </ListItemButton>
  );
}
