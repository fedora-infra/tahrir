import codecs
import os

import docutils
import docutils.examples
import markupsafe
from flask import current_app


def modify_rst(rst):
    """Downgrade some of our rst directives if docutils is too old."""

    try:
        # The rst features we need were introduced in this version
        minimum = [0, 9]
        version = [int(elem) for elem in docutils.__version__.split(".")]

        # If we're at or later than that version, no need to downgrade
        if version >= minimum:
            return rst
    except Exception:
        # If there was some error parsing or comparing versions, run the
        # substitutions just to be safe.
        pass

    # Otherwise, make code-blocks into just literal blocks.
    substitutions = {
        ".. code-block:: javascript": "::",
    }
    for old, new in substitutions.items():
        rst = rst.replace(old, new)

    return rst


def modify_html(html):
    """Perform style substitutions where docutils doesn't do what we want."""

    substitutions = {
        '<tt class="docutils literal">': "<code>",
        "</tt>": "</code>",
    }
    for old, new in substitutions.items():
        html = html.replace(old, new)

    return html


def _load_docs(directory, endpoint):
    """Utility to load an RST file and turn it into fancy HTML."""

    fname = os.path.join(directory, endpoint + ".rst")
    with codecs.open(fname, "r", "utf-8") as f:
        rst = f.read()

    rst = modify_rst(rst)

    api_docs = docutils.examples.html_body(rst)

    api_docs = modify_html(api_docs)

    api_docs = markupsafe.Markup(api_docs)
    return api_docs


htmldocs = {}


def load_docs(key):
    possible_keys = ["about", "footer"]

    # Load from disk only once on first request.
    if not htmldocs:
        directory = os.path.join(
            current_app.root_path, current_app.config["TAHRIR_SITEDOCS_SUBDIR"]
        )
        for k in possible_keys:
            htmldocs[k] = _load_docs(directory, k)

    if key not in htmldocs:
        raise KeyError(f"{key!r} is not permitted.")

    return htmldocs[key]
