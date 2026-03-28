"""Test tahrir.views.admin.builder"""


def test_builder_get(client):
    """Test that the badge builder page loads successfully."""
    response = client.get("/builder")
    assert response.status_code == 200


def test_builder_get_contains_form(client):
    """Test that the builder page renders the WTForms form fields."""
    response = client.get("/builder")
    html = response.get_data(as_text=True)
    assert "Badge Name" in html
    assert "Badge Description" in html
    assert "Condition" in html
    assert "Trigger Topic" in html


def test_builder_get_condition_is_dropdown(client):
    """Test that the Condition field renders as a select dropdown."""
    response = client.get("/builder")
    html = response.get_data(as_text=True)
    assert "<select" in html
    assert "greater than or equal to" in html


def test_builder_post_generates_yaml(client):
    """Test that submitting the form generates YAML output."""
    response = client.post(
        "/builder",
        data={
            "badge_name": "Test Badge",
            "badge_description": "A test badge",
            "badge_creator": "tester",
            "discussion": "",
            "image": "",
            "issuer": "fedora-project",
            "trigger_topic": "org.fedora.test",
            "condition": "greater than or equal to: 1",
            "previous": "",
            "generate": "Generate",
        },
    )
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Test Badge" in html
    assert "%YAML 1.2" in html


def test_builder_post_empty_shows_placeholder(client):
    """Test that submitting without a badge name shows placeholder text."""
    response = client.post(
        "/builder",
        data={
            "badge_name": "",
            "generate": "Generate",
        },
    )
    assert response.status_code == 200
    html = response.get_data(as_text=True)
    assert "Badge YAML will appear here" in html
