import { UserManager, WebStorageStateStore } from "oidc-client";

const redirectUri = new URL(`${import.meta.env.BASE_URL}callback`, window.location.href).href;
const oidcSettings = {
  authority: import.meta.env.VITE_OIDC_PROVIDER_URL,
  client_id: import.meta.env.VITE_OIDC_CLIENT_ID,
  loadUserInfo: true,
  monitorSession: true,
  post_logout_redirect_uri: URL.parse("/", window.location.href).href,
  redirect_uri: redirectUri,
  response_type: "code",
  scope: "openid email profile https://id.fedoraproject.org/scope/groups https://id.fedoraproject.org/scope/agreements",
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

export const userManager = new UserManager(oidcSettings);
