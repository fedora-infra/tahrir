import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { MenuItem } from "@mui/material";

export default function PickButton({ icon, func, name }) {
  return (
    <MenuItem onClick={func} sx={{ padding: "5px 7.5px" }}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{name}</ListItemText>
    </MenuItem>
  );
}
