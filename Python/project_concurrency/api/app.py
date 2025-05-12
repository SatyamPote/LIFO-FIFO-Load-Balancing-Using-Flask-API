# api/app.py
from flask import Flask, jsonify, request
from .load_balancer import LoadBalancer, RequestQueueingType
import threading
import time

app = Flask(__name__)
load_balancer_fifo = LoadBalancer(num_workers=2, request_queueing=RequestQueueingType.FIFO)
load_balancer_lifo = LoadBalancer(num_workers=2, request_queueing=RequestQueueingType.LIFO)

@app.route('/api/process_fifo', methods=['POST'])
def process_fifo():
    load_balancer_fifo.add_request(request.get_json())
    return jsonify({"message": "Request added to FIFO queue"}), 202

@app.route('/api/process_lifo', methods=['POST'])
def process_lifo():
    load_balancer_lifo.add_request(request.get_json())
    return jsonify({"message": "Request added to LIFO queue"}), 202

@app.route('/api/metrics_fifo', methods=['GET'])
def get_metrics_fifo():
    metrics = load_balancer_fifo.get_metrics()
    return jsonify(metrics)

@app.route('/api/metrics_lifo', methods=['GET'])
def get_metrics_lifo():
    metrics = load_balancer_lifo.get_metrics()
    return jsonify(metrics)

def run_flask_app(port):
    app.run(debug=False, host='0.0.0.0', port=port, use_reloader=False)

def shutdown_flask():
    load_balancer_fifo.stop()
    load_balancer_lifo.stop()
    print("Flask app stopped.")

if __name__ == '__main__':
    flask_threads = []
    for port in range(5000, 5011):  # Listen on ports 5000-5010 inclusive
        flask_thread = threading.Thread(target=run_flask_app, args=(port,), daemon=True)
        flask_threads.append(flask_thread)
        flask_thread.start()

    try:
        time.sleep(60)  # Run for 60 seconds
    finally:
        for thread in flask_threads:
            thread.join()
        shutdown_flask()
        print("All threads stopped.")