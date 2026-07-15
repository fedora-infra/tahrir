import { mdiCheckCircleOutline, mdiHistory, mdiViewGridPlus } from "@mdi/js";

import ItemPage from "../components/itempage.jsx";
import { useRetrieveDeadListQuery } from "../features/call.js";

export default function DeadList() {
  return (
    <ItemPage
      query={useRetrieveDeadListQuery()}
      title="Currently unattainable"
      dataKey="full"
      buttons={[
        { to: "/livelist", icon: mdiCheckCircleOutline, label: "Actively functioning" },
        { to: "/recently", icon: mdiHistory, label: "Recently introduced" },
        { to: "/assembly", icon: mdiViewGridPlus, label: "Complete collection" },
      ]}
    />
  );
}
