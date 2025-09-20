#!/bin/bash

echo "Starting Market Sentiment Dashboard..."
echo

echo "Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing backend dependencies"
    exit 1
fi

echo "Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Error installing frontend dependencies"
    exit 1
fi

echo
echo "Starting backend server..."
cd ../backend
npm start &
BACKEND_PID=$!

sleep 3

echo "Starting frontend development server..."
cd ../frontend
npm start &
FRONTEND_PID=$!

echo
echo "Market Sentiment Dashboard is starting up!"
echo "- Backend: http://localhost:5000"
echo "- Frontend: http://localhost:3000"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
