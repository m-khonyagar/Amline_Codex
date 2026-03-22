#!/usr/bin/env python3
"""دیپلوی به staging.agentos.amline.ir — تست قبل از production."""
import os
import sys

SERVER_IP = os.environ.get("SERVER_IP") or "37.152.186.151"
SERVER_PASSWORD = os.environ.get("SERVER_PASSWORD")
if not SERVER_PASSWORD:
    pw_file = os.path.join(
        os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))),
        "arvan_server_password.txt",
    )
    if os.path.exists(pw_file):
        with open(pw_file, "r", encoding="utf-8") as f:
            SERVER_PASSWORD = f.read().strip()

SSH_KEY_PATHS = [
    os.path.expanduser("~/.ssh/winfsurf20_ed25519"),
    os.path.expanduser("~/.ssh/id_ed25519"),
    os.path.expanduser("~/.ssh/id_rsa"),
]

try:
    import paramiko
    from scp import SCPClient
except ImportError:
    print("Run: pip install paramiko scp")
    sys.exit(1)

PROJECT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

FILES = [
    ("deployment/docker/agentos_api.py", "/opt/agentos/deployment/docker/agentos_api.py"),
    ("deployment/docker/notify.py", "/opt/agentos/deployment/docker/notify.py"),
    ("deployment/docker/ui_common.py", "/opt/agentos/deployment/docker/ui_common.py"),
    ("deployment/docker/auth_service.py", "/opt/agentos/deployment/docker/auth_service.py"),
    ("deployment/nginx/agentos.conf", "/opt/agentos/deployment/nginx/agentos.conf"),
    ("deployment/nginx/agentos-staging.conf", "/opt/agentos/deployment/nginx/agentos-staging.conf"),
    ("deployment/nginx/error.html", "/opt/agentos/deployment/nginx/error.html"),
    ("deployment/docker/docker-compose.yml", "/opt/agentos/deployment/docker/docker-compose.yml"),
    ("deployment/docker/docker-compose.staging.yml", "/opt/agentos/deployment/docker/docker-compose.staging.yml"),
    ("deployment/scripts/verify_deployment.py", "/opt/agentos/deployment/scripts/verify_deployment.py"),
    ("deployment/docs/AGENT_ONBOARDING.md", "/opt/agentos/deployment/docs/AGENT_ONBOARDING.md"),
    ("deployment/docs/AGENT_ONBOARDING.md", "/opt/agentos/AGENT_ONBOARDING.md"),
]


def connect():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    for user in ["ubuntu", "root", "admin"]:
        for key_path in SSH_KEY_PATHS:
            if os.path.exists(key_path):
                try:
                    c.connect(
                        SERVER_IP,
                        username=user,
                        key_filename=key_path,
                        timeout=20,
                        allow_agent=False,
                        look_for_keys=False,
                    )
                    print(f"Connected as {user}")
                    return c
                except Exception:
                    pass
    if SERVER_PASSWORD:
        for user in ["root", "ubuntu", "admin"]:
            try:
                c.connect(
                    SERVER_IP,
                    username=user,
                    password=SERVER_PASSWORD.strip(),
                    timeout=30,
                    allow_agent=False,
                    look_for_keys=False,
                )
                print(f"Connected as {user}")
                return c
            except Exception:
                continue
    return None


def main():
    c = connect()
    if not c:
        print("SSH failed")
        sys.exit(1)

    staging = "/home/ubuntu/agentos_sync"
    stdin, out, err = c.exec_command(f"mkdir -p {staging}")
    out.channel.recv_exit_status()

    with SCPClient(c.get_transport()) as scp:
        for local, remote in FILES:
            path = os.path.join(PROJECT, local)
            if not os.path.exists(path):
                print(f"Skip (not found): {local}")
                continue
            fname = os.path.basename(local)
            scp.put(path, f"{staging}/{fname}")
            stdin, out, err = c.exec_command(f"sudo mkdir -p $(dirname {remote}) && sudo cp {staging}/{fname} {remote}")
            out.channel.recv_exit_status()
            print(f"Synced {local} -> {remote}")

    compose_cmd = "docker-compose"
    compose_main = "deployment/docker/docker-compose.yml"
    compose_staging = "deployment/docker/docker-compose.staging.yml"

    print("Starting/updating staging services...")
    cmd = f"cd /opt/agentos && sudo {compose_cmd} -f {compose_main} -f {compose_staging} up -d agentos-orchestrator-staging open-webui-staging nginx --force-recreate 2>&1"
    stdin, out, err = c.exec_command(cmd)
    for line in out:
        print(line, end="")
    code = out.channel.recv_exit_status()
    c.close()

    if code != 0:
        print("\nStaging deploy had errors. Check logs: sudo docker logs agentos-orchestrator-staging")
        sys.exit(1)

    print("\nDone. Staging: https://staging.agentos.amline.ir")
    print("After tests pass, run: python deployment/scripts/sync_to_server.py")


if __name__ == "__main__":
    main()
