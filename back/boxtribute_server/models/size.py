from peewee import SQL, CharField, DateTimeField, ForeignKeyField, IntegerField

from ..db import db
from .size_range import SizeRange
from .user import User


class Size(db.Model):
    created = DateTimeField(null=True)
    created_by = ForeignKeyField(
        column_name="created_by",
        field="id",
        model=User,
        null=True,
        on_delete="SET NULL",
        on_update="CASCADE",
        constraints=[SQL("UNSIGNED")],
    )
    label = CharField()
    modified = DateTimeField(null=True)
    modified_by = ForeignKeyField(
        column_name="modified_by",
        field="id",
        model=User,
        null=True,
        on_delete="SET NULL",
        on_update="CASCADE",
        constraints=[SQL("UNSIGNED")],
    )
    seq = IntegerField(null=True)
    size_range = ForeignKeyField(
        column_name="sizegroup_id",
        field="id",
        model=SizeRange,
        null=True,
        on_update="CASCADE",
        constraints=[SQL("UNSIGNED")],
    )

    class Meta:
        table_name = "sizes"

    def __str__(self):
        return f"{self.id} {self.label}"