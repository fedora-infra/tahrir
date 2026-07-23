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
        { to: "/recently", icon: mdiHistory, name: "Recently introduced" },
        { to: "/livelist", icon: mdiCheckCircleOutline, name: "Actively functional" },
        { to: "/deadlist", icon: mdiAlertCircleOutline, name: "Formerly functional" },
      ]}
    />
  );
}
