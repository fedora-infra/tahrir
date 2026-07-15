import { mdiAlertCircleOutline, mdiCheckCircleOutline, mdiHistory } from "@mdi/js";

import ItemPage from "../components/itempage.jsx";
import { useRetrieveAccoListQuery } from "../features/call.js";

export default function AccoList() {
  return (
    <ItemPage
      query={useRetrieveAccoListQuery()}
      title="Complete collection"
      dataKey="full"
      buttons={[
        { to: "/recently", icon: mdiHistory, label: "Recently introduced" },
        { to: "/livelist", icon: mdiCheckCircleOutline, label: "Actively functioning" },
        { to: "/deadlist", icon: mdiAlertCircleOutline, label: "Currently unattainable" },
      ]}
    />
  );
}
