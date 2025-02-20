# Front-End Specialization - Module 2 - Implementing CI/CD Pipeline for React E-Commerce App
**Author**: Elizabeth Yates

Our e-commerce project requires a streamlined Continuous Integration and Continuous Deployment (CI/CD) pipeline for optimal performance. This pipeline should automate the process of building, testing, and deploying the application to Vercel, a cloud platform. Key components include setting up a robust CI/CD workflow using GitHub Actions and implementing unit tests for application reliability. 

## Test-Driven Development (TDD) in React

### Unit Testing:
- Write at least two unit tests (separate components)
- Test component rendering, state changes, and user interactions.
- Ensure tests are focused, independent, and deterministic.

### Integration Testing:
- Conduct an integration test to ensure the Cart gets updated when adding a product 
- Simulate user interactions and assert resulting changes using React Testing Library.

## Continuous Integration (CI) Flow of Build and Test in GitHub Actions

- Create a main.yml file within the .github/workflows directory to define the CI workflow.
- Configure the workflow to automatically trigger code pushes to the main branch.
- Use GitHub Actions to build the project and run unit tests using Jest.
- Ensure that the workflow fails if any tests fail, preventing the deployment of faulty code.

## Continuous Deployment (CD) Flow in GitHub Actions with Deployment to Vercel:

- Extend the existing GitHub Actions workflow to include a deployment stage.
- Define deployment jobs to deploy the application to Vercel.
- Ensure that the deployment only occurs after the CI tests have passed successfully.
