#!/usr/bin/env python3
"""سینک سریع فایل‌های تغییر یافته به سرور و ریستارت سرویس‌ها. از کلید SSH یا رمز استفاده می‌کند."""
import os
import sys

SERVER_IP = os.environ.get("SERVER_IP") or "37.152.186.151"
SERVER_PASSWORD = os.environ.get("SERVER_PASSWORD")
if not SERVER_PASSWORD:
    pw_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "arvan_server_password.txt")
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
    ("deployment/nginx/error.html", "/opt/agentos/deployment/nginx/error.html"),
    ("deployment/docker/docker-compose.yml", "/opt/agentos/deployment/docker/docker-compose.yml"),
    ("deployment/scripts/verify_deployment.py", "/opt/agentos/deployment/scripts/verify_deployment.py"),
    ("deployment/docs/AGENT_ONBOARDING.md", "/opt/agentos/deployment/docs/AGENT_ONBOARDING.md"),
    ("deployment/docs/AGENT_ONBOARDING.md", "/opt/agentos/AGENT_ONBOARDING.md"),
]

def main():
    c = paramiko.SSHClient()
    c.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    connected = False

    for user in ["ubuntu", "root", "admin"]:
        for key_path in SSH_KEY_PATHS:
            if os.path.exists(key_path):
                try:
                    c.connect(SERVER_IP, username=user, key_filename=key_path, timeout=20, allow_agent=False, look_for_keys=False)
                    print(f"Connected as {user} (SSH key: {key_path})")
                    connected = True
                    break
                except Exception:
                    pass
        if connected:
            break

    if not connected and SERVER_PASSWORD:
        pw = SERVER_PASSWORD.strip()
        for user in ["root", "ubuntu", "admin"]:
            try:
                c.connect(SERVER_IP, username=user, password=pw, timeout=30, allow_agent=False, look_for_keys=False)
                print(f"Connected as {user} (password)")
                connected = True
                break
            except Exception:
                continue

    if not connected:
        print("SSH failed. Try: 1) Add SSH key in Arvan panel 2) Set SERVER_PASSWORD or arvan_server_password.txt")
        sys.exit(1)

    staging = "/home/ubuntu/agentos_sync"
    stdin, out, err = c.exec_command(f"mkdir -p {staging}")
    out.channel.recv_exit_status()
    with SCPClient(c.get_transport()) as scp:
        for local, remote in FILES:
            path = os.path.join(PROJECT, local)
            if os.path.exists(path):
                fname = os.path.basename(local)
                scp.put(path, f"{staging}/{fname}")
                stdin, out, err = c.exec_command(f"sudo mkdir -p $(dirname {remote}) && sudo cp {staging}/{fname} {remote}")
                out.channel.recv_exit_status()
                print(f"Synced {local} -> {remote}")

    print("Restarting agentos-orchestrator and nginx...")
    compose_cmd = "docker-compose"
    compose_file = "deployment/docker/docker-compose.yml"
    # بدون rebuild (سرور آفلاین) — فایل‌ها از volume mount خوانده می‌شوند
    stdin, out, err = c.exec_command(f"cd /opt/agentos && sudo {compose_cmd} -f {compose_file} up -d agentos-orchestrator nginx --force-recreate 2>&1")
    for line in out:
        print(line, end="")
    out.channel.recv_exit_status()
    c.close()
    print("Done. Visit https://agentos.amline.ir")

if __name__ == "__main__":
    main()
