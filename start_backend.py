#!/usr/bin/python3
import subprocess
import env


def run_backend():
    backend_1 = subprocess.Popen(
        ["serve", "-s", "build", "-l", str(env.BACKEND_PORT_1)])
    backend_2 = subprocess.Popen(
        ["serve", "-s", "build", "-l", str(env.BACKEND_PORT_2)])
    print(
        f"Backends ejecutándose en {env.BACKEND_PORT_1} y {env.BACKEND_PORT_2}")
    return (backend_1, backend_2)


if __name__ == "__main__":
    try:
        backend_1, backend_2 = run_backend()
        backend_1.wait()
        backend_2.wait()
    except KeyboardInterrupt:
        print("Shutting down backends")
        backend_1.kill()
        backend_2.kill()
