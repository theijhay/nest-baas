#!/bin/bash

set -e

echo "💡 Checking prerequisites..."

# 1. Install Docker (if not installed)
if ! command -v docker &> /dev/null; then
  echo "🚀 Installing Docker..."
  sudo apt update
  sudo apt install -y docker.io
  sudo systemctl start docker
  sudo systemctl enable docker
  sudo usermod -aG docker $USER
else
  echo "✅ Docker already installed"
fi

# 2. Install Docker Compose
if ! command -v docker-compose &> /dev/null; then
  echo "🚀 Installing Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.5/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
else
  echo "✅ Docker Compose already installed"
fi

# 3. Install Minikube
if ! command -v minikube &> /dev/null; then
  echo "🚀 Installing Minikube..."
  curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  sudo install minikube-linux-amd64 /usr/local/bin/minikube
else
  echo "✅ Minikube already installed"
fi

# 4. Install kubectl
if ! command -v kubectl &> /dev/null; then
  echo "🚀 Installing kubectl..."
  curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
  sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
else
  echo "✅ kubectl already installed"
fi

echo "🚦 Starting Minikube..."
minikube start --driver=docker

echo "✅ Kubernetes cluster running!"
echo "🔑 Enabling Ingress..."
minikube addons enable ingress

echo "📡 Verifying cluster:"
kubectl get nodes

echo "✅ Done! You are ready for local Kubernetes deployments 🎉"
