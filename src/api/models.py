from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import String, Boolean, DateTime
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone


db = SQLAlchemy()

class User(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False)
    password: Mapped[str] = mapped_column(nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True ,nullable=False)


    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            # do not serialize the password, its a security breach
        }


class BlackListToken(db.Model):
    id: Mapped[int] = mapped_column(primary_key=True)
    jti: Mapped[str]= mapped_column(String(40), nullable=False, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)