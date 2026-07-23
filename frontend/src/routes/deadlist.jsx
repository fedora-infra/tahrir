import { mdiCheckCircleOutline, mdiHistory, mdiViewGridPlus } from "@mdi/js";

import ItemPage from "../components/itempage.jsx";
import { useRetrieveDeadListQuery } from "../features/call.js";

export default function DeadList() {
  return (
    <ItemPage
      query={useRetrieveDeadListQuery()}
      title="Formerly functional"
      dataKey="full"
      buttons={[
        { to: "/livelist", icon: mdiCheckCircleOutline, name: "Actively functional" },
        { to: "/recently", icon: mdiHistory, name: "Recently introduced" },
        { to: "/assembly", icon: mdiViewGridPlus, name: "Complete collection" },
      ]}
    />
  );
}
