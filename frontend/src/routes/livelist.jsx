import { mdiAlertCircleOutline, mdiHistory, mdiViewGridPlus } from "@mdi/js";

import ItemPage from "../components/itempage.jsx";
import { useRetrieveLiveListQuery } from "../features/call.js";

export default function LiveList() {
  return (
    <ItemPage
      query={useRetrieveLiveListQuery()}
      title="Actively functioning"
      dataKey="full"
      buttons={[
        { to: "/deadlist", icon: mdiAlertCircleOutline, label: "Currently unattainable" },
        { to: "/recently", icon: mdiHistory, label: "Recently introduced" },
        { to: "/assembly", icon: mdiViewGridPlus, label: "Complete collection" },
      ]}
    />
  );
}
