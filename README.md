
## Prerequisites

*   Python 3.6 or higher
*   `pip` (Python package installer)

## Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone [YOUR_REPO_URL]  # Replace with your repository URL
    cd project_concurrency
    ```
2.  **Create a Virtual Environment (Recommended):**
    ```bash
    python -m venv venv
    # On Windows:
    .\venv\Scripts\activate
    # On macOS/Linux:
    source venv/bin/activate
    ```
3.  **Install Dependencies:**
    ```bash
    pip install -r requirements.txt  # Create a requirements.txt in the project dir
    ```

    *   Create a `requirements.txt` file with the following content in the project root (if you haven't already):
        ```
        Flask
        requests
        ```

## Running the Project

1.  **Run the Flask API:**
    ```bash
    python -m api.app
    ```
    Leave this terminal window open.
2.  **Run the Client(s):**
    *   Use the `generate_api_urls.py` script to create client commands, which will use ports 5000 to 5010 inclusive. Run:
        ```bash
        python generate_api_urls.py
        ```
    *   The script will output commands, which should be copied and pasted into individual terminal windows. Make sure to run the flask application first before running the clients.

## Generating Client Commands

1.  **Create `generate_api_urls.py`:**

    ```python
    # generate_api_urls.py
    start_port = 5000
    end_port = 5010
    api_path_fifo = "/api/process_fifo"  # Define FIFO path
    api_path_lifo = "/api/process_lifo"  # Define LIFO path
    request_data = '{"data": "hello satyam"}'
    num_requests = 1000  # Exactly 1000 requests per port
    concurrency = 50
    command_list = []

    # Header
    print("Id     Name            PSJobTypeName   State         HasMoreData     Location             Command")
    print("--     ----            -------------   -----         -----------     --------             -------")

    job_id_counter = 23
    for port in range(start_port, end_port + 1):
        # FIFO Command
        api_url_fifo = f"http://localhost:{port}{api_path_fifo}"
        command_fifo = f"python -m src.client --api_url {api_url_fifo} --num_requests {num_requests} --concurrency {concurrency} --request_data '{request_data}'"
        command_list.append(command_fifo)
        print(f"{job_id_counter:<5} Job{job_id_counter:<2}          BackgroundJob   Running       True            localhost            {command_fifo[:40]}...")
        job_id_counter += 2

        # LIFO Command
        api_url_lifo = f"http://localhost:{port}{api_path_lifo}"
        command_lifo = f"python -m src.client --api_url {api_url_lifo} --num_requests {num_requests} --concurrency {concurrency} --request_data '{request_data}'"
        command_list.append(command_lifo)
        print(f"{job_id_counter:<5} Job{job_id_counter:<2}          BackgroundJob   Running       True            localhost            {command_lifo[:40]}...")
        job_id_counter += 2
    ```
2.  **Run the script:** `python generate_api_urls.py`
3.  **Copy and run the commands:** Copy the output commands from the script. *Paste one command per terminal window.*

## Analyzing Results

*   Examine the output from each client program to assess performance metrics: throughput, average response time, and any errors.
*   Check the `/api/metrics_fifo` and `/api/metrics_lifo` endpoints (in your browser) to confirm that the requests are being processed and the data is stored in the load balancer's in-memory queues.

## Further Development

*   Implement persistent storage (e.g., database) for request data.
*   Integrate a more sophisticated load balancing strategy.
*   Add comprehensive performance monitoring and reporting.
*   Explore more client tests.
*   Add more features to the API.

## License

[Choose a license and add it here, e.g., MIT, Apache 2.0, etc.  Consider creating a LICENSE file as well.]
