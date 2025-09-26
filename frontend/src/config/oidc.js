import { UserManager, WebStorageStateStore } from "oidc-client";

const hostname = "badges.gridhead.net";

const oidcSettings = {
  authority: "https://id.stg.fedoraproject.org/openidc",
  client_id: "gridhead_badges",
  loadUserInfo: true,
  monitorSession: true,
  post_logout_redirect_uri: `https://${hostname}/`,
  redirect_uri: `https://${hostname}/callback`,
  response_type: "code",
  scope: "openid email profile https://id.fedoraproject.org/scope/groups https://id.fedoraproject.org/scope/agreements",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcSettings);
