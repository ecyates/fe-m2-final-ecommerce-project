# Front-End Specialization - Module 2 - Implementing CI/CD Pipeline for React E-Commerce App
**Author**: Elizabeth Yates

## Project Overview

This e-commerce project features a streamlined Continuous Integration and Continuous Deployment (CI/CD) pipeline to ensure optimal performance and reliability. The pipeline automates the process of building, testing, and deploying the application to Vercel using GitHub Actions. Key components include:

- A robust CI/CD workflow with automated unit and integration testing.
- Firebase for authentication and Firestore as the database.
- Redux for state management, including cart, orders, and products.
- React Router for navigation between different pages.

## Technologies Used

- **React**: Front-end framework
- **Redux Toolkit**: State management
- **React Router**: Navigation between application views
- **Firebase**: Authentication and Firestore database
- **Jest & React Testing Library**: Unit and integration testing
- **GitHub Actions**: CI/CD automation
- **Vercel**: Hosting and deployment

## Application Structure

### Features
- **User Authentication**: 
  - Firebase authentication with user sign in and out.
- **Product Management**:
  - Product catalog display
  - Individual product details
  - Add/Remove items from the cart
  - Add/Edit product functionality when signed in
- **Shopping Cart**:
  - View, add, and remove items
  - View total price and items
  - Checkout process
- **Order History**:
  - Store user order history
  - Retrieve past orders

### Component Breakdown

#### **Shopping Cart Component**
- Handles adding and removing items and displaying total price and quantity.

#### **Product Components**
- **ProductCatalog**: Displays all available products.
- **ProductCard**: Child component of ProductCatalog, showing individual product details.
- **ProductDetail**: Displays full details for a selected product.
- **ProductForm**: Allows adding or editing a product.

#### **User Components**
- **UsersList**: Displays a list of users.
- **UserCard**: Child component of UsersList, showing individual user details, including email, name, phone, address, and order history.
- **UserProfileForm**: Child component of UsersList, allowing user profile editing.

#### **Order Components**
- **OrdersList**: Child component of UsersCard, displaying a list of user orders.
- **OrderDetails**: Shows details of an individual order.

#### **Other Components**
- **HomePage**: Contains an introduction and the ProductCatalog.
- **NavBar**: Appears on all pages for navigation.
- **NoAccess**: Displays when users attempt to access restricted pages.
- **NotFound**: Displays for unknown routes.

### Context
- **AuthContext**: Manages authentication state.

### Features
- **cartSlice**: Manages cart state.
- **ordersSlice**: Manages order state.
- **productsSlice**: Manages product list state.

### Utilities
- **objectUtilities**: Contains type declarations for different objects.
- **sessionStorageUtilities**: Handles saving and loading the cart from session storage.

### Unit and Integration Testing Features
- Utilized Jest and React Testing Library
- Tests component rendering, state changes, and user interactions

- **Login.test.tsx**
  1. Tests Login Component renders correctly
  2. Tests filling out the form and clicking the sign in button
  3. Tests filling out the form and clicking the register button
  4. Tests clicking the sign out button

- **ProductCard.test.tsx**
  1. Tests ProductCard Component renders correctly

- **ShoppingCart.test.tsx**
  1. Tests clicking the add item button
  2. Tests clicking the remove item button

## Continuous Integration (CI) Flow of Build and Test in GitHub Actions (.github/workflows)

- **CI Workflow:** Located in `.github/workflows/master.yml`.
- **Triggers:** Runs automatically on code pushes to the `master` branch.
- **Tasks:**
  - Install dependencies
  - Build the project
  - Run Jest unit tests
  - Fail the workflow if any test fails

## Continuous Deployment (CD) Flow in GitHub Actions with Deployment to Vercel

- **Deployment Workflow:** Extends the existing GitHub Actions pipeline.
- **Deployment Triggers:** Occurs only after passing CI tests.
- **Hosting:** Application is deployed to Vercel.

## CI/CD Workflow
### Continuous Integration (CI) in GitHub Actions
- **CI Workflow:** Located in `.github/workflows/master.yml`.
- **Triggers:** Runs automatically on code pushes to the `master` branch.
- **Tasks:**
  - Install dependencies
  - Build the project
  - Run Jest unit tests
  - Fail the workflow if any test fails

### Continuous Deployment (CD) to Vercel
- **Deployment Workflow:** Extends the existing GitHub Actions pipeline.
- **Deployment Triggers:** Occurs only after passing CI tests.
- **Hosting:** Application is deployed to Vercel.

## Installation & Setup
### Prerequisites
- Node.js & npm installed
- Firebase account & Firestore setup
- GitHub repository cloned locally

### Steps to Run Locally
1. Clone the repository:
    git clone https://github.com/ecyates/fe-m2-final-ecommerce-project
    cd <project-directory>
    npm install

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Firebase:
   - Add Firebase configuration in firebaseConfig.ts

4. Start the application and open [http://localhost:5173](http://localhost:5173/) in your browser:
   ```bash
   npm run dev
   ```

5. Run tests:
   ```bash
   npm test
   ```

## Future Enhancements
- Implement Stripe for secure payments
- Improve UI with animations and additional styling
- Add product search and filtering functionality