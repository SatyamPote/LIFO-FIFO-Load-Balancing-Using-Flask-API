# Concurrent API with Load Balancing and Request Queuing

> A project demonstrating concurrent request handling and load balancing strategies in REST APIs using Python (Flask), Go, and Node.js. This project aims to showcase the different approaches, compare performance characteristics (throughput, average response time, error rates), and understand the trade-offs involved in choosing these strategies.

## Project Structure

project_concurrency/
├── api/ # Common API code
│ ├── load_balancer.py # Load Balancer (Python)
│ ├── load_balancer.go # Load Balancer (Go)
│ └── ... # (Other API components, if any)
├── src/
│ ├── client.py # Python client
│ ├── client/
│ │ └── client.go # Go client
│ └── server.js # Node.js server (Load Balancer)
├── generate_client_commands.py # Generates client commands (Python)
├── generate_client_commands.go # Generates client commands (Go)
├── run_tests.sh
├── go.mod # (Go module definition)
├── package.json # (Node.js project config)
└── README.md # (This file)




## Technologies Used

*   **Python:**  Flask (web framework), threading.
*   **Go:**  Goroutines and channels.
*   **Node.js:** Express.js (web framework).
*   **Concurrency:** Threads (Python), Goroutines (Go), Asynchronous Operations (Node.js).
*   **Load Balancing:** Implemented using various techniques for example a dedicated load balancer.
*   **Request Queuing:** FIFO and LIFO queuing strategies.
*   **HTTP Clients:**  `requests` (Python), `net/http` (Go), `axios` (Node.js).
*   **Command-Line Argument Parsing:** `argparse` (Python), `flag` (Go), `commander` (Node.js).

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

*   **Important:**  Make sure to have the correct directory structure before running each set of commands.

### 1. Python (Flask) Implementation

1.  **Run the Flask API Server:**
    ```bash
    cd project_concurrency
    python -m api.app
    ```
    Keep this terminal open.
2.  **Generate Client Commands:**
    ```bash
    cd project_concurrency
    python generate_client_commands.py  # Generates the client commands
    ```
    *   Copy the output client commands.
3.  **Run the Python Clients (in separate terminals):** Paste each of the client commands into *separate* terminal windows, and run. This will send the requests.

### 2. Go Implementation

1.  **Build and Run the Go API Server:**

    ```bash
    cd project_concurrency
    go run api/main.go
    ```
    *   The `api/main.go` file must include the correct ports to listen on.
    *   Keep this terminal open.
2.  **Generate Client Commands:**
    ```bash
    cd project_concurrency
    go run generate_client_commands.go
    ```
    *   Copy the output client commands.
3.  **Run the Go Clients (in separate terminals):** Paste each of the client commands into *separate* terminal windows and run them.

### 3. Node.js Implementation

1.  **Run the Node.js API Server:**
    ```bash
    cd project_concurrency_node
    node src/server.js
    ```
    Keep this terminal open.

2.  **Run the Client Test:** The `run_test.sh` runs the command line arguments.
3.  **Alternatively:**
    *   **Run Client Directly:**

        ```bash
        cd project_concurrency_node
        node src/client.js --api_url http://localhost:3000/api/process_fifo --num_requests 1000 --concurrency 50
        ```

        ```bash
        node src/client.js --api_url http://localhost:3000/api/process_lifo --num_requests 1000 --concurrency 50
        ```

**Important Notes:**

*   **Concurrency:** When running client tests, run them in separate terminals for true concurrency.
*   **Correct Directory:** Make sure you are in the correct directory when you run each command (project root or the subdirectories as indicated).
*   **Adjust Ports:** The port numbers in the client commands (e.g., `http://localhost:5000`) *must* match the ports the API servers are listening on.
*   **Analyze the Output:** Examine the output from *each* client program to assess performance metrics. This is the most critical step.
*   **Testing with Correct Arguments:** Each time you test, make sure to run the test with the correct code.

## Analyzing Results

*   **Examine the Client Outputs:**  Each client program will output the performance metrics:
    *   `Successful Requests:`
    *   `Failed Requests:`
    *   `Total Time:`
    *   `Average Response Time:`
    *   `Throughput:`
    *   `Error Summary:`

*   **Compare the Results:**
    *   Compare the results for different queuing strategies (FIFO vs. LIFO).
    *   Compare the results across different concurrency levels.

## Further Development

*   Implement persistent storage (e.g., database) for request data.
*   Integrate a more sophisticated load balancing strategy.
*   Add more comprehensive performance monitoring and reporting.
*   Explore different queuing algorithms.
*   Enhance error handling.

## License

[Choose a license and add it here, e.g., MIT, Apache 2.0, etc.  Consider creating a LICENSE file as well.]
