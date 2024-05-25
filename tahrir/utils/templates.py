import importlib.metadata

from tahrir.utils.docs import load_docs


def templates_context():
    return dict(
        tahrir_version=importlib.metadata.version("tahrir"),
        tahrir_api_version=importlib.metadata.version("tahrir-api"),
        footer=load_docs("footer"),
    )
