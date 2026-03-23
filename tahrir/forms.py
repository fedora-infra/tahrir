from flask_wtf import FlaskForm
from wtforms import SelectField, StringField, TextAreaField
from wtforms.validators import Optional


DEFAULT_PREVIOUS = """\
filter:
  topics:
    - message.topic
  users:
    - recipient
  rows_per_page: 0
operation: count"""

CONDITION_CHOICES = [
    ("", "-- Select a condition --"),
    ("greater than or equal to: 1", "≥ 1"),
    ("greater than or equal to: 5", "≥ 5"),
    ("greater than or equal to: 10", "≥ 10"),
    ("greater than or equal to: 25", "≥ 25"),
    ("greater than or equal to: 50", "≥ 50"),
    ("greater than or equal to: 100", "≥ 100"),
]


class BadgeBuilderForm(FlaskForm):
    badge_name = StringField("Badge Name", validators=[Optional()])
    badge_description = StringField("Badge Description", validators=[Optional()])
    badge_creator = StringField("Badge Creator", validators=[Optional()])
    discussion = StringField("Discussion URL", validators=[Optional()])
    image = StringField("Image URL", validators=[Optional()])
    issuer = StringField("Issuer ID", validators=[Optional()])
    trigger_topic = StringField("Trigger Topic", validators=[Optional()])
    condition = SelectField(
        "Condition",
        choices=CONDITION_CHOICES,
        validators=[Optional()],
    )
    previous = TextAreaField(
        "Previous Value",
        validators=[Optional()],
        default=DEFAULT_PREVIOUS,
    )
