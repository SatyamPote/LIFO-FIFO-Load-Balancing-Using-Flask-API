# src/client.py
import requests
import threading
import time
import argparse
import traceback

def send_request(api_endpoint, num_requests, concurrency_level, request_data, report_interval=5):
    """
    Sends concurrent requests to an API endpoint and reports performance metrics.

    Args:
        api_endpoint (str): The URL of the API endpoint.
        num_requests (int): The total number of requests to send.
        concurrency_level (int): The number of concurrent threads to use.
        request_data (dict): The JSON data to send with each request.
        report_interval (int, optional): The interval (in seconds) at which to print progress reports. Defaults to 5.
    """
    successful_requests = 0
    failed_requests = 0
    start_time = time.time()
    request_times = []
    errors = {}  # To track different types of errors


    def worker():
        nonlocal successful_requests, failed_requests, request_times, errors
        for _ in range(num_requests // concurrency_level):
            try:
                start = time.time()
                response = requests.post(api_endpoint, json=request_data, timeout=10)
                response.raise_for_status()  # Raise HTTPError for bad responses (4xx or 5xx)
                end = time.time()
                request_times.append(end - start)
                successful_requests += 1
            except requests.exceptions.RequestException as e:
                failed_requests += 1
                error_type = type(e).__name__
                errors[error_type] = errors.get(error_type, 0) + 1
            except Exception as e:
                failed_requests += 1
                error_type = type(e).__name__
                errors[error_type] = errors.get(error_type, 0) + 1

    threads = []
    for _ in range(concurrency_level):
        thread = threading.Thread(target=worker, daemon=True)
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    end_time = time.time()
    total_time = end_time - start_time
    if successful_requests > 0:
        avg_response_time = sum(request_times) / len(request_times) / successful_requests
        throughput = successful_requests / total_time
    else:
        avg_response_time = 0
        throughput = 0

    print("-" * 40)  # Separator Line
    print(f"API Endpoint: {api_endpoint}")
    print("=" * 20)  # Title Separator
    print(f"  Successful Requests: {successful_requests}")
    print(f"  Failed Requests: {failed_requests}")
    print(f"  Total Time: {total_time:.2f} seconds")
    print(f"  Average Response Time: {avg_response_time:.4f} seconds")
    print(f"  Throughput: {throughput:.2f} requests/second")
    print(f"  Error Summary: {errors}")  # Print the error summary
    print("-" * 40)  # Separator Line


def main():
    parser = argparse.ArgumentParser(description="Concurrent API testing tool.")
    parser.add_argument("--api_url", type=str, required=True, help="The base URL of your API (e.g., http://localhost:5000)")
    parser.add_argument("--num_requests", type=int, default=1000, help="Total number of requests to send.")
    parser.add_argument("--concurrency", type=int, default=50, help="Concurrency level (number of threads).")
    parser.add_argument("--request_data", type=str, default='{"data": "test"}', help="JSON data for the request")

    args = parser.parse_args()

    # Basic validation (could be improved)
    if args.concurrency > args.num_requests:
        print("Concurrency level cannot be greater than the number of requests. Adjusting.")
        args.concurrency = args.num_requests
    send_request(args.api_url, args.num_requests, args.concurrency, eval(args.request_data))  # Run the test
    # Removed separate tests for FIFO/LIFO; API endpoint handles that.


if __name__ == "__main__":
    main()