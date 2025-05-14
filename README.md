# Concurrent API with Load Balancing and Request Queuing

![Image](https://github.com/user-attachments/assets/7be16cee-97e2-49de-91a2-d309485d57dc)

> A project demonstrating concurrent request handling and load balancing strategies in REST APIs using Python (Flask), Go, and Node.js. This project showcases different concurrency approaches, compares performance characteristics (throughput, average response time, error rates), and examines the trade-offs involved in choosing these strategies.

## Technologies Used

*   **Python:** Flask (web framework), threading.
*   **Go:** Goroutines and channels.
*   **Node.js:** Express.js (web framework).
*   **Concurrency:** Threads (Python), Goroutines (Go), Asynchronous Operations (Node.js).
*   **Load Balancing:** Implemented using various techniques including a dedicated load balancer.
*   **Request Queuing:** FIFO and LIFO queuing strategies.
*   **HTTP Clients:** `requests` (Python), `net/http` (Go), `axios` (Node.js).
*   **Command-Line Argument Parsing:** `argparse` (Python), `flag` (Go), `commander` (Node.js).
*   **Performance Measurement:** `time`, `perf_hooks`.

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone [YOUR_REPO_URL]  # Replace with your repository URL
    cd project_concurrency
    ```

2.  **Install Dependencies:**

    *   **Python (Flask):**
        ```bash
        cd project_concurrency
        python -m venv venv
        # On Windows:
        .\venv\Scripts\activate
        # On macOS/Linux:
        source venv/bin/activate
        pip install -r requirements.txt
        ```
        *   Create a `requirements.txt` in the `project_concurrency` root with:
            ```
            Flask
            requests
            ```

    *   **Go:**
        ```bash
        cd project_concurrency
        # (Assuming you have Go installed and configured)
        go mod init project_concurrency  # Replace with your module path if needed
        ```

    *   **Node.js:**
        ```bash
        cd project_concurrency
        npm install
        ```
        *   (If you are missing dependencies, you will need to install them.)
            ```bash
            cd project_concurrency/
            npm install express body-parser commander axios
            ```

## Running the Projects

*   **Important:**  Make sure to have the correct directory structure before running each set of commands.  Ensure the correct code is used to run the test.

### 1. Python (Flask) Implementation

1.  **Run the Flask API Server:**
    ```bash
    cd project_concurrency
    python -m api.app
    ```
    Keep this terminal open.
2.  **Run the Python Clients (in separate terminals):**
    ```bash
    # Example, adjust parameters as needed
    python src/client.py --api_url http://localhost:5000/api/process_fifo --num_requests 1000 --concurrency 10
    python src/client.py --api_url http://localhost:5000/api/process_lifo --num_requests 1000 --concurrency 10
    #Run test for each process with different request count and concurrency.
    ```

### 2. Go Implementation

1.  **Build and Run the Go API Server:**

    ```bash
    cd project_concurrency
    go run api/main.go
    ```
    *   The `api/main.go` file must include the correct ports to listen on.
    *   Keep this terminal open.
2.  **Run the Go Clients (in separate terminals):**
    ```bash
    # Example, adjust parameters as needed
    go run src/client/client.go --api_url http://localhost:5001/api/process_fifo --num_requests 1000 --concurrency 10
    go run src/client/client.go --api_url http://localhost:5001/api/process_lifo --num_requests 1000 --concurrency 10
    #Run test for each process with different request count and concurrency.
    ```

### 3. Node.js Implementation

1.  **Run the Node.js API Server:**
    ```bash
    cd project_concurrency
    node src/server.js
    ```
    Keep this terminal open.

2.  **Run the Client Test:**
    ```bash
     # Example, adjust parameters as needed
    node src/client.js --api_url http://localhost:3000/api/process_fifo --num_requests 1000 --concurrency 10
    node src/client.js --api_url http://localhost:3000/api/process_lifo --num_requests 1000 --concurrency 10
    #Run test for each process with different request count and concurrency.
    ```

**Important Notes:**

*   **Concurrency:** When running client tests, run them in separate terminals for true concurrency.
*   **Correct Directory:** Make sure you are in the correct directory when you run each command (project root or the subdirectories as indicated).
*   **Adjust Ports:** The port numbers in the client commands (e.g., `http://localhost:5000`) *must* match the ports the API servers are listening on.
*   **Analyze the Output:** Examine the output from *each* client program to assess performance metrics. This is the most critical step.
*   **Testing with Correct Arguments:** Each time you test, make sure to run the test with the correct code.

## Analyzing Results and Performance

The performance metrics can be gathered from the logs of the clients and then displayed in a table and chart.

### Performance Metrics

*   **Throughput:** Requests per second (RPS).
*   **Average Response Time:** Mean time to respond (ms).
*   **Error Rates:** Failed request percentage.

### Results (Illustrative)

![Results Table](https://github.com/user-attachments/assets/9acf2bfb-5090-400e-9b4e-f72359d0f144)

### Bar Graph (Example)

![Performance Comparison Graph](https://github.com/user-attachments/assets/ea0ca9e1-2b8a-4191-bb30-91c4a9e67999)
