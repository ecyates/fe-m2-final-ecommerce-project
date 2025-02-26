# Front-End Specialization - Module 2 - Implementing CI/CD Pipeline for React E-Commerce App
**Author**: Elizabeth Yates

## 📌 Project Overview

This project implements a Continuous Integration and Continuous Deployment (CI/CD) pipeline for a React-based e-commerce application. The goal is to automate building, testing, and deploying the app to Vercel using GitHub Actions while ensuring reliability through Test-Driven Development (TDD). This React-based e-commerce application features the following:

- User authentication via Firebase Auth
- Real-time database with Firestore
- Redux for state management (cart, products, orders)
- React Router for navigation
- Jest & React Testing Library for testing
- Unsplash images for the background and dummy product images

## 🚀 Getting Started

### Prerequisites

- Node.js (recommended: v18+)
- npm or yarn
- A GitHub repository set up with GitHub Actions enabled
- A Vercel account for deployment

### Installation

Clone the repository and install dependencies:

    git clone <repository-url>
    cd <project-directory>
    npm install

### Running the Application Locally

Start the development server:

    npm run dev

Open [http://localhost:3000](http://localhost:5173/) in your browser.

## Test-Driven Development (TDD) in React (./src/__tests__)

### Unit and Integration Testing Features
- Utilized Jest and React Testing Library
- Tests component rendering, state changes, and user interactions

### Login.test.tsx
1. Test Login Component renders correctly
2. Test filling out the form and clicking the sign in button
3. Test filling out the form and clicking the register button
4. Test clicking the sign out button

### ProductCard.test.tsx
1. Test ProductCard Component renders correctly

### ShoppingCart.test.tsx
1. Test clicking the add item button
2. Test clicking the remove item button

## Continuous Integration (CI) Flow of Build and Test in GitHub Actions (.github/workflows)

- Created a master.yml file to define the CI workflow.
- Configured the workflow to automatically trigger code pushes to the master branch.
- Used GitHub Actions to build the project and run unit tests using Jest.
- Ensured that the workflow fails if any tests fail, preventing the deployment of faulty code.

## Continuous Deployment (CD) Flow in GitHub Actions with Deployment to Vercel

- Extended the existing GitHub Actions workflow to include a deployment stage.
- Defined deployment jobs to deploy the application to Vercel.
- Ensured that the deployment only occurs after the CI tests have passed successfully.

