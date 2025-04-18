# Audience Segmentation Tool

A scalable audience segmentation tool built with React and Tailwind CSS, following clean architecture principles, SOLID design principles, and modern software design patterns.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Design Patterns](#design-patterns)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture Decision Records (ADRs)](#architecture-decision-records-adrs)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)

## Overview

This application provides a comprehensive solution for audience segmentation, allowing users to create, manage, and visualize audience segments based on various criteria. The tool is designed with scalability in mind, using clean architecture principles to ensure maintainability and extensibility.

## Architecture

The application follows a clean architecture approach with vertical slice organization, separating concerns into distinct layers:

### 1. Core Domain Layer

Contains the business logic and domain models that represent the core concepts of the application:

- **Models**: Implements domain entities like `Segment` and `Filter`
- **Interfaces**: Defines contracts for repositories and services
- **Services**: Contains domain-specific business logic

### 2. Infrastructure Layer

Handles external concerns and provides implementations for interfaces defined in the core layer:

- **Repositories**: Implements data access patterns with circuit breaker for resilience
- **API Clients**: Manages communication with external services
- **Mock Services**: Provides development data for testing and development

### 3. UI Components Layer

Implements the presentation layer using a composite component pattern:

- **Common Components**: Reusable UI elements like buttons, cards, etc.
- **Feature-specific Components**: Specialized components for filters, visualization, etc.
- **Hooks**: Custom React hooks for shared functionality

### 4. Application Layer

Orchestrates the flow of data between the UI and domain layers:

- **Use Cases**: Implements application-specific business logic
- **State Management**: Manages application state
- **Event Bus**: Facilitates event-driven communication between components

### 5. Features Layer (Vertical Slices)

Organizes the application by features, each containing its own UI, application logic, and infrastructure concerns:

- **Dashboard**: Overview of audience segments and metrics
- **Segment Builder**: Interface for creating and managing segments
- **Visualization**: Tools for analyzing segment data

## Design Patterns

The application implements several software design patterns:

### 1. Composite Pattern

Used in the UI layer to create a hierarchical structure of components that can be treated uniformly. This allows for complex UI compositions while maintaining a clean component API.

Example: The `Card` component can contain various child components and layouts while providing a consistent API.

### 2. Repository Pattern

Abstracts the data access layer, providing a collection-like interface for domain objects. This decouples the application from specific data sources or APIs.

Example: `SegmentRepository` provides methods for CRUD operations on segments without exposing the underlying data source.

### 3. Factory Pattern

Encapsulates object creation logic, allowing for flexible instantiation of objects based on specific criteria.

Example: `Filter` class provides factory methods for creating different types of filters (demographic, behavioral, etc.).

### 4. Circuit Breaker Pattern

Prevents cascading failures by detecting failures and preventing operation when the system is not functioning correctly.

Example: `ApiClient` implements circuit breaking to handle API failures gracefully.

### 5. Event-Driven Design

Components communicate through events rather than direct method calls, reducing coupling and improving maintainability.

Example: `EventBus` facilitates communication between components through publish/subscribe mechanisms.

## Features

- **Dashboard**: Overview of audience metrics and segment performance
- **Segment Builder**: Create and manage audience segments with various filter criteria
- **Visualization**: Analyze segment data with charts and tables
- **Export**: Export segment data in various formats
- **Actions**: Trigger actions based on segments (e.g., ad campaigns)

## Technology Stack

- **Frontend Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Data Fetching**: React Query
- **Virtualization**: react-window for performance
- **Visualization**: Recharts for data visualization

## Architecture Decision Records (ADRs)

### ADR 1: React with TypeScript over JavaScript

**Context**: We needed to choose a programming language for the frontend application.

**Decision**: We chose TypeScript over plain JavaScript.

**Rationale**:

- Type safety helps catch errors at compile time rather than runtime
- Improved developer experience with better IDE support and autocompletion
- Self-documenting code through interfaces and type definitions
- Better maintainability for large-scale applications

**Consequences**:

- Slight learning curve for developers not familiar with TypeScript
- Additional build step for transpilation
- Improved code quality and reduced runtime errors

### ADR 2: Clean Architecture with Vertical Slice Organization

**Context**: We needed an architectural approach that would scale well and maintain separation of concerns.

**Decision**: We implemented Clean Architecture with vertical slice organization.

**Rationale**:

- Clear separation of concerns between domain logic, application logic, and infrastructure
- Domain models remain pure and free from framework dependencies
- Vertical slices allow for feature-based organization, making it easier to understand and modify specific features
- Improved testability by allowing domain logic to be tested in isolation

**Consequences**:

- More initial boilerplate code
- Clearer boundaries between layers
- Easier to maintain and extend in the long term
- Better alignment with domain-driven design principles

### ADR 3: React Query over Redux

**Context**: We needed a solution for state management and data fetching.

**Decision**: We chose React Query over Redux for data fetching and server state management.

**Rationale**:

- React Query is specifically designed for server state, while Redux is more general-purpose
- Built-in caching, refetching, and invalidation strategies
- Automatic loading and error states
- Reduced boilerplate compared to Redux for API calls
- Context API handles UI state adequately for this application

**Consequences**:

- Separation between server state (React Query) and UI state (Context API)
- Simplified data fetching logic
- Improved performance through automatic caching
- Less control over the exact caching behavior compared to a custom Redux implementation

### ADR 4: Tailwind CSS over Material UI

**Context**: We needed a styling solution that would allow for rapid development and customization.

**Decision**: We chose Tailwind CSS over Material UI.

**Rationale**:

- Utility-first approach allows for rapid UI development
- No component library lock-in, giving more flexibility in design
- Smaller bundle size compared to full component libraries
- Better performance due to reduced JavaScript overhead
- Highly customizable to match specific design requirements

**Consequences**:

- More HTML classes in components
- Need to build custom components rather than using pre-built ones
- More consistent design system through configuration
- Better performance and smaller bundle size

### ADR 5: Event-Driven Communication

**Context**: We needed a way for components to communicate without tight coupling.

**Decision**: We implemented an event-driven architecture using an EventBus.

**Rationale**:

- Reduces coupling between components
- Allows for more flexible component composition
- Simplifies complex interactions between different parts of the application
- Makes it easier to add new features without modifying existing code

**Consequences**:

- More difficult to trace the flow of data
- Potential for "event spaghetti" if not managed carefully
- Improved modularity and extensibility
- Easier to implement cross-cutting concerns like logging or analytics

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd audience-segmentation

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Project Structure

```text
src/
├── core/                  # Domain layer
│   ├── interfaces/        # Domain interfaces
│   ├── models/            # Domain models
│   └── services/          # Domain services
├── infrastructure/        # Infrastructure layer
│   ├── api/               # API clients
│   ├── repositories/      # Data repositories
│   └── mocks/             # Mock data services
├── ui/                    # UI components layer
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom React hooks
│   └── utils/             # UI utilities
├── application/           # Application layer
│   ├── useCases/          # Application use cases
│   ├── events/            # Event system
│   └── state/             # State management
├── features/              # Feature modules
│   ├── dashboard/         # Dashboard feature
│   ├── segmentBuilder/    # Segment builder feature
│   └── visualization/     # Visualization feature
├── App.tsx               # Main application component
└── main.tsx              # Application entry point
```
