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
        { to: "/assembly", icon: mdiViewGridPlus, label: "Complete collection" },
        { to: "/livelist", icon: mdiCheckCircleOutline, label: "Actively functioning" },
        { to: "/deadlist", icon: mdiAlertCircleOutline, label: "Currently unattainable" },
      ]}
    />
  );
}
