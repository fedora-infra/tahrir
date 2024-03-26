import requests
import json

from typing import List
from urllib.parse import urlencode
from oic import rndstr
from oic.oic import Client
from oic.oauth2 import AuthorizationResponse
from oic.oic.message import ProviderConfigurationResponse
from oic.oic.message import RegistrationResponse
from oic.oic.message import AuthorizationResponse
from oic.oic.message import OpenIDSchema, AccessTokenResponse
from oic.utils.http_util import Redirect
from oic.utils.authn.client import ClientSecretBasic, ClientSecretPost

"""

+--------+                                   +--------+
|        |                                   |        |
|        |---------(1) AuthN Request-------->|        |
|        |                                   |        |
|        |  +--------+                       |        |
|        |  |        |                       |        |
|        |  |  End-  |<--(2) AuthN & AuthZ-->|        |
|        |  |  User  |                       |        |
|   RP   |  |        |                       |   OP   |
|        |  +--------+                       |        |
|        |                                   |        |
|        |<--------(3) AuthN Response--------|        |
|        |                                   |        |
|        |---------(4) UserInfo Request----->|        |
|        |                                   |        |
|        |<--------(5) UserInfo Response-----|        |
|        |                                   |        |
+--------+                                   +--------+

"""

# Vars
OP_URL='https://iddev.fedorainfracloud.org/openidc'
CLIENT_ID='D-c23e2381-61dc-4dc2-8af6-9a91b74b7d80'
CLIENT_SECRET='bcSgmX_pDj1WaQfZTi1tuDhtLE2n7DO2'

# RP Metadata
RP = Client(client_authn_method={        
    'client_secret_post': ClientSecretPost,
    'client_secret_basic': ClientSecretBasic
})
RP.provider_config(OP_URL)
RP.client_id = CLIENT_ID
RP.client_secret = CLIENT_SECRET
RP.verify_ssl = True

# OP
op_info = RP.provider_config(OP_URL)

# Callback URL
callback_url = {"redirect_uris": ["https://badges.fedora.com/cb"]}

# Endpoint URL
endpoint_url = RP.register(op_info["registration_endpoint"], **callback_url)

# Args obligatoires
args = {
    "redirect_uri": RP.registration_response["redirect_uris"][0],
    "client_id": RP.client_id, 
    "scope": "openid", 
    "response_type": "code", 
}

# Build AuthN
build_authn_req = RP.construct_AuthorizationRequest(request_args=args)

# AuthN Request (1)
authn_req = build_authn_req.request(RP.authorization_endpoint)

# AuthN & AuthZ (2)

# AuthN Response (3)


# UserInfo Request (4)

