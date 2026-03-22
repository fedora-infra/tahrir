# Contributing to Tahrir

Welcome! Thank you for contributing to Tahrir — the Fedora Badges platform. This guide walks you through everything you need to get set up, make your changes, and submit a pull request.

Please read this guide fully before you start.

---

## Table of Contents

- [Before You Start](#before-you-start)
- [1. Prerequisites](#1-prerequisites)
- [2. Getting the Code](#2-getting-the-code)
- [3. Setting Up Locally](#3-setting-up-locally)
- [4. Making Changes](#4-making-changes)
- [5. Writing Tests](#5-writing-tests)
- [6. Verifying Your Work](#6-verifying-your-work)
- [7. Committing and Pushing](#7-committing-and-pushing)
- [8. Opening a Pull Request](#8-opening-a-pull-request)
- [9. Codebase Structure](#9-codebase-structure)
- [10. Getting Help](#10-getting-help)

---

## Before You Start

- Find or open an [issue](https://github.com/fedora-infra/tahrir/issues) for the bug or feature you want to work on. This avoids duplicate work and lets maintainers know what you're planning.
- Make sure you have a [GitHub account](https://github.com).
- Read through this guide fully before running any commands.

---

## 1. Prerequisites

Install the following tools before you do anything else.

---

### Python 3.10+

**macOS**

macOS comes with Python pre-installed. Check your version:
```bash
python3 --version
```

If it's below 3.10, upgrade using [Homebrew](https://brew.sh):
```bash
brew install python@3.12
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt update && sudo apt install python3 python3-pip
```

**Linux (Fedora/RHEL)**
```bash
sudo dnf install python3 python3-pip
```

**Windows**

Download and run the installer from https://www.python.org/downloads/windows/.
During installation, check **"Add Python to PATH"**.

---

### Git

**macOS**
```bash
brew install git
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt install git
```

**Linux (Fedora/RHEL)**
```bash
sudo dnf install git
```

**Windows**

Download from https://git-scm.com/download/win and run the installer.

Configure your name and email after installing — GitHub uses these to identify your commits:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

---

### Poetry

Tahrir uses [Poetry](https://python-poetry.org/) to manage dependencies and virtual environments.

**macOS/Linux**
```bash
pip3 install poetry
```

After installing, add Poetry to your PATH. Check your install output for the exact path — on most macOS setups it will be:
```bash
echo 'export PATH="$HOME/Library/Python/3.12/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

> **macOS SSL error?** If the install fails with a certificate error:
> ```bash
> open /Applications/Python\ 3.12/Install\ Certificates.command
> ```
> If that file doesn't exist, `pip3 install poetry` is still the correct command — just proceed.

**Windows**
```powershell
pip install poetry
```

Verify:
```bash
poetry --version
```

---

### tox

[tox](https://tox.wiki/) runs the full test suite, linter, and formatter in one command — the same way CI does.

**macOS/Linux**
```bash
python3 -m pip install --user tox
```

Add tox to your PATH on macOS if you see a "not on PATH" warning. Check the install output for the exact path — on most setups:
```bash
echo 'export PATH="$HOME/Library/Python/3.12/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

**Windows**
```powershell
pip install tox
```

Verify:
```bash
tox --version
```

**macOS — required compiler fix**

On macOS, tox needs to compile `psycopg2` (the PostgreSQL driver) from source. Without this fix it will fail with a `stdlib.h not found` error. Add these three lines to your `~/.zshrc` so they are set permanently:

```bash
echo 'export CC=/usr/bin/clang' >> ~/.zshrc
echo 'export CXX=/usr/bin/clang++' >> ~/.zshrc
echo 'export SDKROOT=/Library/Developer/CommandLineTools/SDKs/MacOSX12.3.sdk' >> ~/.zshrc
source ~/.zshrc
```

If you have a different macOS version, check what SDKs are available on your machine:
```bash
ls /Library/Developer/CommandLineTools/SDKs/
```

Use the SDK that matches your macOS version.

---

## 2. Getting the Code

**2a. Fork the repository**

Go to https://github.com/fedora-infra/tahrir and click **Fork**.

**2b. Clone your fork**
```bash
git clone https://github.com/YOUR_USERNAME/tahrir.git
cd tahrir
```

**2c. Add the upstream remote**

This lets you keep your fork up to date with the original repository:
```bash
git remote add upstream https://github.com/fedora-infra/tahrir.git
```

Verify both remotes exist:
```bash
git remote -v
```

You should see `origin` (your fork) and `upstream` (the original repo).

**2d. Create a branch**

Never work directly on `develop` or `main`. Always create a new branch.

First, make sure your local `develop` is up to date:
```bash
git checkout develop
git pull upstream develop
```

Then create your branch:
```bash
git checkout -b your-branch-name
```

Use a clear, descriptive name — for example `fix-badge-display` or `update-contributing-guide`.

---

## 3. Setting Up Locally

**3a. Install dependencies**
```bash
poetry install
```

This creates an isolated virtual environment and installs everything from `poetry.lock`. You should see it finish with:
```
Installing the current project: tahrir (2.1.0)
```

**3b. Create the dev config file**

In the root of the repo, create a new file called `tahrir-dev.cfg` and paste in the following:

```python
SECRET_KEY = "dev-secret-key-not-for-production"
SQLALCHEMY_DATABASE_URI = "sqlite:///tahrir-dev.db"
TAHRIR_PNGS_PATH = "/tmp/tahrir-pngs"
TAHRIR_ADMIN_GROUPS = ["admins"]
TAHRIR_TITLE = "Tahrir Dev"
SESSION_COOKIE_SECURE = False
CACHE = {
    "backend": "dogpile.cache.null",
    "expiration_time": 100,
}
TAHRIR_USE_FEDMSG = False
```

> **Windows users:** Set `TAHRIR_PNGS_PATH = "C:\\tmp\\tahrir-pngs"` instead.

**3c. Create the badge images directory**

macOS/Linux:
```bash
mkdir -p /tmp/tahrir-pngs
```

Windows — create the folder `C:\tmp\tahrir-pngs` using File Explorer or run:
```powershell
New-Item -ItemType Directory -Force -Path "C:\tmp\tahrir-pngs"
```

**3d. Create the OIDC secrets file**

In the root of the repo, create a new file called `client_secrets.json` and paste in the following:

```json
{
  "web": {
    "issuer": "https://id.fedoraproject.org/openidc",
    "client_id": "tahrir-dev",
    "client_secret": "dev-secret",
    "auth_uri": "https://id.fedoraproject.org/openidc/Authorization",
    "token_uri": "https://id.fedoraproject.org/openidc/Token",
    "userinfo_uri": "https://id.fedoraproject.org/openidc/UserInfo",
    "redirect_uris": ["http://127.0.0.1:5000/oidc/callback"]
  }
}
```

> Login via Fedora Accounts won't work with this dummy file. That's expected — public pages render fine for local development.

**3e. Protect your config files**

These files must never be committed. Open `.gitignore` in your editor and add these lines at the bottom:

```
# Local development config
tahrir-dev.cfg

# OIDC credentials
client_secrets.json

# Compiled translation files
*.mo
```

**3f. Set environment variables**

macOS/Linux:
```bash
export FLASK_CONFIG=$(pwd)/tahrir-dev.cfg
export FLASK_APP=tahrir.app:create_app
export FLASK_DEBUG=1
```

Windows (PowerShell):
```powershell
$env:FLASK_CONFIG = "$PWD\tahrir-dev.cfg"
$env:FLASK_APP = "tahrir.app:create_app"
$env:FLASK_DEBUG = "1"
```

> These only last for your current terminal session. Re-run them each time you open a new terminal, or add them to your shell profile.

**3g. Initialize the database**
```bash
poetry run flask tahrir sync-db
```

This creates the local SQLite database with all required tables. Only needs to be run once.

**3h. Run the development server**
```bash
poetry run flask run
```

Open **http://127.0.0.1:5000** in your browser. You'll see an empty Tahrir instance — no badges or users yet, which is expected. The real Fedora Badges instance has years of community data; locally you start fresh.

Press `Ctrl+C` to stop the server.

---

> **Note on Vagrant:** The repository includes a Vagrant + Ansible setup in `devel/ansible/` designed to mirror the Fedora production environment. It is currently not usable on macOS or Windows for two reasons — the Vagrantfile uses the `libvirt` provider which is Linux-only, and the Fedora 38 box it references has reached end of life and returns a 404. A fix is being tracked in [this issue](https://github.com/fedora-infra/tahrir/issues). Until it is resolved, macOS and Windows contributors should use the Poetry-based setup described in this guide, which covers everything needed for local development and contributing.

---

## 4. Making Changes

- Keep changes focused — one issue per pull request
- Write clear, readable code
- Follow the existing code style — the linter will catch issues
- Update documentation if your change affects how the app is configured or used
- Add tests for any new functionality or bug fix you introduce — see [Writing Tests](#5-writing-tests) below

---

## 5. Writing Tests

Tests live in the `tests/` directory. The project uses [pytest](https://pytest.org/).

The existing tests are a good reference for how to write new ones:

```
tests/
├── conftest.py                  # Shared fixtures (app instance, database)
├── test_cache.py                # Tests for cache utilities
├── test_dbadmin.py              # Tests for database admin functions
└── test_utils_date_time.py      # Tests for date/time utilities
```

### Running a single test file
```bash
poetry run pytest tests/test_cache.py -v
```

### Running a single test by name
```bash
poetry run pytest tests/test_cache.py::test_str_to_bytes_str -v
```

### Example test

Here is an example from the existing test suite showing the pattern to follow:

```python
from tahrir.cache import str_to_bytes


def test_str_to_bytes_str():
    """Test that a string input is converted to bytes."""
    result = str_to_bytes("hello")
    assert result == b"hello"


def test_str_to_bytes_bytes():
    """Test that a bytes input is returned unchanged."""
    result = str_to_bytes(b"hello")
    assert result == b"hello"
```

Each test should:
- Have a clear, descriptive name starting with `test_`
- Test one thing only
- Include a docstring describing what it tests
- Use `assert` statements to verify the expected result

---

## 6. Verifying Your Work

**Always run these checks before committing.** All checks must pass before you submit a pull request.

### Run the full suite with tox (recommended)

tox runs tests, linting, and formatting in one command — exactly as CI does:

```bash
tox
```

tox environments defined in `tox.ini`:

| Environment | What it does |
|---|---|
| `py310`, `py311`, `py312`, `py313` | Runs pytest with coverage |
| `lint` | Runs Ruff to check for code issues |
| `format` | Runs Black to check code formatting |
| `docs` | Builds the Sphinx documentation |

Run a specific environment:
```bash
tox -e py312     # tests on Python 3.12 only
tox -e lint      # linter only
tox -e format    # formatter only
tox -e docs      # build docs only
```

Expected output when everything passes:
```
py312: OK
lint:  OK
format: OK
congratulations :)
```

### Run checks individually (alternative)

If you prefer to run things step by step:

**Tests:**
```bash
poetry run pytest tests/ -v
```

**Tests with coverage:**
```bash
poetry run pytest tests/ -v --cov=tahrir --cov-report=term-missing
```

**Linter:**
```bash
poetry run ruff check tahrir/
```

**Formatter check:**
```bash
poetry run black --check tahrir/
```

**Auto-fix formatting:**
```bash
poetry run black tahrir/
```

---

## 7. Committing and Pushing

**7a. Check what you're about to commit**
```bash
git status
```

Make sure `tahrir-dev.cfg` and `client_secrets.json` are **not** in the list. If they are, remove them from staging:
```bash
git reset HEAD tahrir-dev.cfg
git reset HEAD client_secrets.json
```

**7b. Stage your changes**
```bash
git add .
```

**7c. Run the tests one final time before committing**
```bash
tox -e py312
```

Only commit if tests pass.

**7d. Commit**
```bash
git commit -m "Brief description of what you changed"
```

Write a clear, specific commit message. Good examples:
- `Fix badge image not loading on user profile`
- `Add test for date singularization edge case`
- `Update contributing guide with local setup steps`

**7e. Push your branch**
```bash
git push origin your-branch-name
```

---

## 8. Opening a Pull Request

1. Go to your fork on GitHub and click **"Compare & pull request"**
2. Make sure the base branch is set to **`develop`** on the upstream repo — not `main`
3. Fill in the PR description:
   - What does this change do?
   - Which issue does it fix? (e.g. `Closes #123`)
   - How did you test it?
4. Submit the pull request

A maintainer will review your PR and may request changes. While waiting, keep your branch up to date with:
```bash
git fetch upstream
git rebase upstream/develop
git push origin your-branch-name --force-with-lease
```

---

## 9. Codebase Structure

```
tahrir/
├── app.py              # App factory — create_app() wires everything together
├── defaults.py         # Default configuration values
├── database.py         # Database extension and per-request session management
├── admin.py            # Flask-Admin setup
├── cli.py              # CLI commands (flask tahrir sync-db, load-badges)
├── cache.py            # Caching configuration
├── notifications.py    # Fedora Messaging integration
├── l10n.py             # Internationalisation (Flask-Babel)
├── views/              # Route handlers, one file per section
│   ├── root.py         # Home page
│   ├── badge.py        # Badge detail pages
│   ├── user.py         # User profile pages
│   ├── leaderboard.py  # Leaderboard
│   ├── explore.py      # Explore and search
│   ├── admin.py        # Admin views
│   ├── assertion.py    # Badge assertion views
│   ├── invitation.py   # Invitation views
│   └── report.py       # Report views
├── utils/              # Shared helper functions
├── templates/          # Jinja2 HTML templates
├── static/             # CSS, JS, and image assets
└── sitedocs/           # RST content for About and Footer pages

tests/
├── conftest.py                  # Shared pytest fixtures
├── test_cache.py                # Cache utility tests
├── test_dbadmin.py              # Database admin tests
└── test_utils_date_time.py      # Date/time utility tests

devel/
└── ansible/            # Vagrant + Ansible provisioning scripts
```

> **Note on Vagrant:** The `devel/ansible/` directory contains a Vagrant + Ansible setup for running a full Fedora infrastructure environment. It currently only works on Linux — the Vagrantfile uses the `libvirt` provider which is not supported on macOS or Windows, and the Fedora 38 box it references has reached end of life. A fix is being tracked separately. macOS and Windows contributors should use the Poetry-based setup in this guide.

The main entry point is `tahrir/app.py`. The `create_app()` factory function wires together all Flask extensions, blueprints, CLI commands, and configuration. Database access throughout the app goes through `g.tahrirdb`, a `TahrirDatabase` instance set up per request in `tahrir/database.py`.

---

## 10. Getting Help

If you're stuck or have questions:

- **Chat:** Join the Fedora Badges room at https://chat.fedoraproject.org/#/room/#badges:fedoraproject.org
- **Issues:** Open an [issue on GitHub](https://github.com/fedora-infra/tahrir/issues)
- **Mailing list:** [Fedora Infrastructure mailing list](https://lists.fedoraproject.org/archives/list/infrastructure@lists.fedoraproject.org/)

Thank you for contributing to Tahrir and the Fedora community! 