""" Utilities for generating FOAF.

Adapted from this example by Leah Culver:
    http://blog.leahculver.com/2008/02/python-foaf-generator.html

"""

import rdflib as r


def generate_foaf_file(user):
    """ Return a string representing a FOAF RDF file """
    graph = r.ConjunctiveGraph()
    FOAF = r.Namespace("http://xmlns.com/foaf/0.1/")
    RDFS = r.Namespace("http://www.w3.org/2000/01/rdf-schema#")

    # bind the namespaces
    graph.bind('foaf', FOAF)
    graph.bind('rdfs', RDFS)

    # add the user
    person = create_foaf_node(graph, FOAF, user)

    return graph.serialize(format="pretty-xml")


def create_foaf_node(graph, FOAF, user):
    """ Generate an individual FOAF node """
    node = r.BNode()

    # add the user data
    graph.add((node, r.RDF.type, FOAF['Person']))
    graph.add((node, FOAF['nick'], r.Literal(user.nickname)))
    graph.add((node, FOAF['img'], r.URIRef(user.avatar_url(512))))
    graph.add((node, FOAF['mbox_sha1sum'], r.Literal(user.email_sha1)))

    if user.website:
        graph.add((node, FOAF['homepage'], r.Literal(user.website)))

    graph.add((node, FOAF['account'], r.Literal(user.openid_identifier)))

    return node
