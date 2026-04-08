import argparse
import sys

from agent import AgentRunner


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Agent Mode MVP")
    parser.add_argument("task", help="Task to execute")
    parser.add_argument("--model", default="gpt-4.1", help="Responses API model")
    parser.add_argument("--max-turns", type=int, default=12, help="Max tool/model loop turns")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    runner = AgentRunner(model=args.model, max_turns=args.max_turns)
    result = runner.run(args.task)
    print(result)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
