# Tahrir
> fedora-badges https://badges.fedoraproject.org/

Tahrir is an application used by the Fedora Project for issuing [Open
Badges][open-badges].  As per the [about][ob-about] page:

> The concept of Open Badges originated among those working at the Mozilla and
> MacArthur foundations, and out of the research of Erin Knight, founding
> director of the Open Badges project at Mozilla.

Originally, information was hosted on the [Mozilla Wiki][moz-badges].

Tahrir is [Arabic for Liberation][wikipedia-tahrir]

## Contributing

Welcome! Thank you for taking the time to contribute. This project relies on an active and involved community, and we really appreciate your support.

### Quickstart

1. Look for an [existing issue](https://github.com/fedora-infra/tahrir/issues)
   about the bug or feature you're interested in. If you can't find an existing issue, create a [new one](https://github.com/fedora-infra/tahrir/issues/new).

2. Fork the [repository on GitHub](https://github.com/fedora-infra/tahrir).

3. Fix the bug or add the feature, and then write one or more tests which show the bug is fixed or the feature works.

4. Submit a pull request and wait for a maintainer to review it.

More detailed guidelines to help ensure your submission goes smoothly are below.

### Guidelines

#### Tests

The test suites can be run using [tox](http://tox.readthedocs.io/) by simply
running ``tox`` from the repository root. We aim for all code to have test coverage or be explicitly marked as not covered using the ``# no-qa`` comment. We encourage the [Test Driven Development Practice](http://www.extremeprogramming.org/rules/testfirst.html)

Your pull request should contain tests for your new feature or bug fix. If you're not certain how to write tests, we will be happy to help you.

#### Setup a local development environment

To quickly start hacking on Tahrir, we provide a vagrant setup.

1. Set up tinystage (if you haven't already) and ensure the base boxes are running.

   https://github.com/fedora-infra/tiny-stage

   This sets up the infrastructure to use things like authentication and Fedora Messaging when developing on Tahrir

2. Clone the repository to your local storage and run

   ```
   vagrant up
   ```

3. Tahrir frontend should now be available on https://badges.tinystage.test.

[open-badges]: https://openbadges.org
[ob-about]: https://openbadges.org/about/
[moz-badges]: https://wiki.mozilla.org/index.php?title=Badges&oldid=1170927
[wikipedia-tahrir]: http://en.wikipedia.org/wiki/Tahrir_Square
[contributing]: https://github.com/fedora-infra/tahrir/blob/develop/CONTRIBUTING.md
[developing]: https://github.com/fedora-infra/tahrir/blob/develop/DEVELOPING.md
