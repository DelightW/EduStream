# 🎓 EduStream Enterprise

An enterprise-grade Learning Management System (LMS) designed to deliver seamless, high-performance digital education experiences. Built with a focus on modern web optimization, state management, and real-time analytics.

---

## 🧐 What is EduStream?

Think of **EduStream** as a private, high-speed Netflix mixed with a digital university campus. It is a comprehensive Learning Management System built for modern institutions and businesses to host, track, and stream educational content.

* **The Student Experience:** Students get an ultra-fast, smooth interface where they can browse courses, track their learning progress, and watch educational videos without lagging or long buffering delays.
* **The Instructor & Admin Dashboard:** Instructors gain access to data-driven dashboards displaying student engagement metrics, course performance analytics, and enrollment statistics at a glance.
* **Under the Hood Optimization:** Unlike traditional bulky websites that load slowly, EduStream uses advanced "smart-loading" techniques. It only loads the exact page or feature the user is looking at, ensuring the application remains blazing fast even on slower internet connections or mobile data.

---

## 🛠️ The Tech Stack & Architecture

* **Framework:** Built using **Angular** (Enterprise-grade web framework) for a structured, scalable modular architecture.
* **State Management:** Utilizes **NgRx** to handle complex user data, course streams, and application data states predictably and instantly across pages.
* **Performance Optimization:** Implements **Lazy Loading** (on-demand page delivery) and route guard security architectures to keep performance high and student data secure.
* **Testing Engine:** Engineered using **Vitest** for lightning-fast unit testing and continuous code quality insurance.

---

## 🚀 Setting Up the Project (For Developers)

### 1. Prerequisites

Ensure you have the latest version of Node.js installed on your machine.

### 2. Development Server

To launch the application locally for testing and development:

```bash
ng serve

```

Once the compilation finishes, open your browser and navigate to `http://localhost:4200/`. The platform will automatically refresh whenever you save modifications to the source files.

---

## 🏗️ Code Scaffolding

This project utilizes the Angular CLI to enforce strict design patterns. To generate a new component or module ecosystem, use the standard schematics:

```bash
ng generate component component-name

```

For a comprehensive breakdown of all structural blueprints (components, directives, services, or pipes), execute:

```bash
ng generate --help

```

---

## 📦 Build & Deployment

To compile and optimize the entire platform for a live production environment, run:

```bash
ng build

```

The compiler will optimize the code for speed, strip out development tools, and output the deployable production artifacts inside the `dist/` directory.

---

## 🧪 Testing Suites

### Unit Testing

To run comprehensive unit tests across components and state architecture via the Vitest engine:

```bash
ng test

```

### End-to-End (E2E) Testing

To execute real-world browser simulation tests:

```bash
ng e2e

```
