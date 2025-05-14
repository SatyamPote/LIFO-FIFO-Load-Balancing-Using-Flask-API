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