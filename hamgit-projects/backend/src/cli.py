from os import getenv

import typer
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.orm import Session

from account.domain.entities import User
from account.domain.enums import UserRole
from core.database import SESSION_FACTORY
from core.helpers import validate_mobile_number
from core.settings import BASE_DIR

app = typer.Typer()

load_dotenv(BASE_DIR / ".env")

CLI_PASSWORD = getenv("CLI_PASSWORD", None)


def get_session() -> Session:
    try:
        session = SESSION_FACTORY()
        return session
    finally:
        session.close()


@app.command()
def create_superuser(mobile: str, cli_password: str) -> None:
    typer.echo(f"Creating superuser with mobile: {mobile} and password: {cli_password}")

    if cli_password != CLI_PASSWORD:
        typer.secho("Invalid CLI password", fg="red")
        raise typer.Abort()

    mobile = validate_mobile_number(mobile)

    session = get_session()
    user_exists = session.execute(
        text("SELECT id, roles, deleted_at FROM account.users WHERE mobile = :mobile"),
        {"mobile": mobile},
    ).fetchone()

    if user_exists:
        user_exists_dict = user_exists._asdict()
        if user_exists_dict["deleted_at"] and "SUPERUSER" in user_exists_dict["roles"]:
            session.execute(
                text("UPDATE account.users SET deleted_at = NULL WHERE mobile = :mobile AND deleted_at IS NOT NULL"),
                {"mobile": mobile},
            )
            session.commit()
            typer.secho("User restored successfully", fg="green")
            return

        elif user_exists_dict["deleted_at"] and "SUPERUSER" not in user_exists_dict["roles"]:
            session.execute(
                text(
                    "UPDATE account.users SET deleted_at = NULL, roles = array_append(roles, 'SUPERUSER') WHERE mobile = :mobile AND deleted_at IS NOT NULL"  # noqa
                ),
                {"mobile": mobile},
            )
            session.commit()
            typer.secho("User restored successfully", fg="green")
            return
        elif not user_exists_dict["deleted_at"] and "SUPERUSER" in user_exists_dict["roles"]:
            typer.secho("User already exists and is a superuser", fg="yellow")
            return

        else:
            session.execute(
                text("UPDATE account.users SET roles = array_append(roles, 'SUPERUSER') WHERE mobile = :mobile"),
                {"mobile": mobile},
            )
            session.commit()
            typer.secho("User updated successfully", fg="green")

    else:
        user = User(mobile=mobile, roles=[UserRole.SUPERUSER])  # need for generate id

        session.execute(
            text("INSERT INTO account.users (id, mobile, roles) VALUES (:id, :mobile, :roles)"),
            {
                "id": user.id,
                "mobile": mobile,
                "roles": user.roles,
            },
        )
        session.commit()
        typer.secho("Superuser created successfully", fg="green")


if __name__ == "__main__":
    app()
