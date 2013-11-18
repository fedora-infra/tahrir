import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()

requires = [
    'pyramid<1.5a1',
    'tahrir_api >= 0.2.0',
    'SQLAlchemy >= 0.8.0',
    'transaction',
    'pyramid_tm',
    'zope.sqlalchemy',
    "weberror",
    'velruse',
    "qrcode",
    "dogpile.cache",
    'docutils',
    "python-dateutil",
    "moksha.wsgi>=1.2.1",
    "webhelpers",
    "rdflib",

    # For qrcode to work from PyPI, you also need Pillow.
    # This is handled for us in Fedora because python-qrcode pulls in the
    # correct underlying imaging library.
    #"Pillow",

    # Optional -- used for scaling images to 256x256.
    # You also need "ImageMagick-devel" for this to build from pypi
    #"magickwand",
    ]

setup(name='tahrir',
      version='0.4.5',
      description='A pyramid app for issuing your own Open Badges',
      long_description=README,
      license="AGPLv3+ with additional permission",
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        "License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)",
        ],
      author='Ralph Bean',
      author_email='rbean@redhat.com',
      url='http://github.com/fedora-infra/tahrir',
      keywords='web wsgi bfg pylons pyramid badges open fedbadges',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      test_suite='tahrir',
      install_requires=requires,
      entry_points="""\
      [paste.app_factory]
      main = tahrir:main
      """,
      )
