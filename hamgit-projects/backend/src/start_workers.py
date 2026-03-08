from multiprocessing import Process

from core.logger import Logger
from workers.msg_worker import messaging_worker

logger = Logger("workers")


def start_all_mappers() -> None:
    from account.adapters.orm.mappers import start_mappers as start_account_mappers
    from advertisement.adapters.orm.mappers import start_mappers as start_ads_mappers
    from contract.adapters.orm.mappers import start_mappers as start_contract_mappers
    from financial.adapters.orm.mappers import start_mappers as start_financial_mappers
    from shared.adapters.orm.mappers import start_mappers as start_storage_mappers

    start_ads_mappers()
    start_account_mappers()
    start_storage_mappers()
    start_contract_mappers()
    start_financial_mappers()


def run_worker(worker_func):
    try:
        worker_func()
    except Exception as e:
        logger.error(f"Worker {worker_func.__name__} failed with error: {e}")
        raise


if __name__ == "__main__":
    print("Worker Initiated")
    start_all_mappers()

    workers = [
        messaging_worker,
    ]

    processes = []

    for worker in workers:
        p = Process(target=run_worker, args=(worker,))
        p.start()
        processes.append(p)

    for p in processes:
        p.join()
