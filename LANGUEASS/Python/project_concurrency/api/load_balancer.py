# api/load_balancer.py
import threading
import time
from collections import deque
from enum import Enum

class RequestQueueingType(Enum):
    FIFO = 1
    LIFO = 2

class LoadBalancer:
    def __init__(self, num_workers=2, request_queueing=RequestQueueingType.FIFO):
        self.num_workers = num_workers
        self.request_queueing = request_queueing
        self.workers = []
        self.request_queue = deque()  # Use deque for efficient append/pop
        self.queue_lock = threading.Lock()
        self.worker_available = threading.Semaphore(num_workers)
        self.stop_event = threading.Event()

        self.total_requests_processed = 0
        self.start_time = time.time()
        self.processed_data = [] # Store processed data

        self.create_workers()

    def create_workers(self):
        for i in range(self.num_workers):
            worker = threading.Thread(target=self.worker_thread, args=(i,), daemon=True)
            self.workers.append(worker)
            worker.start()

    def add_request(self, request_data):
        with self.queue_lock:
            if self.request_queueing == RequestQueueingType.FIFO:
                self.request_queue.append(request_data)
            elif self.request_queueing == RequestQueueingType.LIFO:
                self.request_queue.appendleft(request_data)
            else:
                raise ValueError("Invalid request queueing type.")
            self.worker_available.release()

    def worker_thread(self, worker_id):
        while not self.stop_event.is_set():
            self.worker_available.acquire()
            if self.stop_event.is_set():
                break

            with self.queue_lock:
                if self.request_queue:
                    request_data = self.request_queue.popleft()
                    start_time = time.time()
                    data = request_data.get("data")
                    self.processed_data.append({"data": data, "timestamp": start_time})
                    time.sleep(0.01)  # Simulate work
                    end_time = time.time()
                    self.total_requests_processed += 1
                    response_time = end_time - start_time
                else:
                    self.worker_available.release()  # Release semaphore if queue is empty

        print(f"Worker {worker_id} exiting.")

    def get_metrics(self):
        elapsed_time = time.time() - self.start_time
        if elapsed_time > 0:
            throughput = self.total_requests_processed / elapsed_time
        else:
            throughput = 0

        return {
            "total_requests_processed": self.total_requests_processed,
            "elapsed_time": elapsed_time,
            "throughput": throughput,
            "processed_data_count": len(self.processed_data),
            "processed_data": self.processed_data[-5:]  # Return the last 5 processed
        }

    def stop(self):
        self.stop_event.set()
        for _ in range(self.num_workers):
            self.worker_available.release()
        for worker in self.workers:
            worker.join()
        print("Load Balancer stopped.")