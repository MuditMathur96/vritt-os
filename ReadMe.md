# Vritt-OS

A web-based operating system with a modern interface and powerful developer tools.

Check this here: https://vritt-client-837515568960.asia-south1.run.app

## Overview

Vritt-OS is an open-source web-based operating system that brings desktop-like functionality to your browser. It features a multi-window environment, terminal access, and various productivity tools, creating a seamless development experience directly in your web browser.

## Features

### Core Features

* **Working Terminal** : Full TTY implementation using WebSockets
* **Multi-Window Management** : Drag-drop, minimize, and maximize windows
* **Calculator** : Perform quick calculations without leaving your workspace

### In Progress

* **Code Editor** : Write and edit code with syntax highlighting and advanced features
* **Cloud Storage** : Securely store and access your files from anywhere
* **Theme Configuration** : Personalize your experience with customizable themes
* **Live Code Compilation** : Compile and run code directly in the browser
* **Workspace Management** : Organize your projects and development environments

## Technology Stack

Vritt-OS is built with a modern, robust tech stack:

* **Frontend** :
* Next.js
* TypeScript
* Tailwind CSS
* Shadcn UI components
* **Backend & Infrastructure** :
* WebSockets for real-time communication
* TTY for terminal emulation
* Docker for containerization
* Clean Architecture for maintainable code structure
* **Development Workflow** :
* Monorepo structure using pnpm
* TypeScript for type safety

## Installation

### Using pnpm (Development)

```bash
# Clone the repository
git clone https://github.com/yourusername/vritt-os.git

# Navigate to the project directory
cd vritt-os

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Using Docker Compose

```bash
# Clone the repository
git clone https://github.com/yourusername/vritt-os.git

# Navigate to the project directory
cd vritt-os

# Build and start the containers
docker-compose build
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

To stop the containers:

```bash
docker-compose down
```

## Usage

After starting the application, open your browser and navigate to:

* `http://localhost:3000` when using pnpm dev
* `http://localhost:8080` when using Docker Compose

### Basic Controls

* Click and drag window headers to move windows
* Use window control buttons to minimize/maximize/close windows
* Open the terminal by clicking the terminal icon in the dock

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

* Thanks to all contributors who have helped shape Vritt-OS
* Special thanks to the open-source community for providing the tools and libraries that make this project possible
