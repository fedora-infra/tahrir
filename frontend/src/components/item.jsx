import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import IconButton from "@mui/material/IconButton";

export default function CustomListItem({ logo, head, body, side }) {
  return (
    <ListItem disableGutters={true} disablePadding={true} dense={true}>
      <ListItemAvatar>{logo}</ListItemAvatar>
      <ListItemText primary={head} secondary={body} />
      <IconButton edge="end" disabled={true}>
        <span className="dataelem">{side}</span>
      </IconButton>
    </ListItem>
  );
}
