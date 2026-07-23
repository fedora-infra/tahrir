import { mdiAlertCircleOutline, mdiCheckCircleOutline, mdiViewGridPlus } from "@mdi/js";

import ItemPage from "../components/itempage.jsx";
import { useRetrieveAccoListQuery } from "../features/call.js";

export default function Recently() {
  return (
    <ItemPage
      query={useRetrieveAccoListQuery()}
      title="Recently introduced"
      dataKey="newest"
      buttons={[
        { to: "/assembly", icon: mdiViewGridPlus, name: "Complete collection" },
        { to: "/livelist", icon: mdiCheckCircleOutline, name: "Actively functional" },
        { to: "/deadlist", icon: mdiAlertCircleOutline, name: "Formerly functional" },
      ]}
    />
  );
}
