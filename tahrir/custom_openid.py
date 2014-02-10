import velruse.api
import velruse.providers.openid as vr

from pyramid.security import NO_PERMISSION_REQUIRED


def add_openid_login(config, realm, identity_provider):
    provider = SingleOpenIDConsumer(
        'openid', 'openid',
        realm=realm,
        identity_provider=identity_provider,
        storage=None,
    )
    login_path='/login/openid'
    callback_path='/login/openid/callback'
    config.add_route(provider.login_route, login_path)
    config.add_view(provider, attr='login', route_name=provider.login_route,
                    permission=NO_PERMISSION_REQUIRED)
    config.add_route(provider.callback_route, callback_path,
                     use_global_views=True,
                     factory=provider.callback)
    velruse.api.register_provider(config, 'openid', provider)


class SingleOpenIDConsumer(vr.OpenIDConsumer):
    def __init__(self,
                 name,
                 _type,
                 realm=None,
                 identity_provider=None,
                 storage=None,
                 context=vr.OpenIDAuthenticationComplete):
        super(SingleOpenIDConsumer, self).__init__(
            name, _type, realm, storage, context)
        self.identity_provider = identity_provider

    def _lookup_identifier(self, request, url):
        return self.identity_provider
