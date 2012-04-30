import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
README = open(os.path.join(here, 'README.rst')).read()

requires = [
    'pyramid',
    'SQLAlchemy',
    'transaction',
    'pyramid_tm',
    'zope.sqlalchemy',
    "weberror",
    "tw2.sqla",
    "formencode",  # For file uploads
    ]

setup(name='tahrir',
      version='0.1.4',
      description='A pyramid app for issuing your own Open Badges',
      long_description=README,
      license="AGPLv3+",
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        "License :: OSI Approved :: GNU Affero General Public License v3 or later (AGPLv3+)",
        ],
      author='Ralph Bean',
      author_email='rbean@redhat.com',
      url='http://github.com/ralphbean/tahrir',
      keywords='web wsgi bfg pylons pyramid',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      test_suite='tahrir',
      install_requires=requires,
      entry_points="""\
      [paste.app_factory]
      main = tahrir:main
      [console_scripts]
      initialize_tahrir_db = tahrir.scripts.initializedb:main
      """,
      )

