#!/usr/bin/python3
import os
import sys
import subprocess
import env


def start_proxy():
    config_path = os.path.abspath(env.PROXY_CONFIG)
    process = subprocess.Popen(
        ["varnishd", "-a", f":{env.PROXY_PORT}", "-f", config_path,
         "-n", "/tmp/varnish_workdir"])
    return process


if __name__ == "__main__":
    process = start_proxy()
    if process.wait() != 0:
        print("Varnish no pudo ser inicializado exitosamente")
        sys.exit(-1)
    else:
        print(f"Proxy escuchando en puerto {env.PROXY_PORT}")
