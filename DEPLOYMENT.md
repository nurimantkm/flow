# Deployment Guide for EnTalk Questions Tool

This guide will walk you through deploying the EnTalk Questions Tool to Render using GitHub.

## Prerequisites

- A GitHub account
- A Render account
- An OpenAI API key

## Step 1: Create a GitHub Repository

1. Log in to your GitHub account
2. Create a new repository (e.g., "entalk-questions-tool")
3. Make the repository public or private according to your preference

## Step 2: Upload the Code to GitHub

You can either use the GitHub web interface or Git commands to upload the code:

### Using GitHub Web Interface:
1. Navigate to your repository on GitHub
2. Click on "Add file" > "Upload files"
3. Drag and drop all the files from the entalk-github-ready folder
4. Click "Commit changes"

### Using Git Commands:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/entalk-questions-tool.git
git push -u origin main
```

## Step 3: Set Up Render Deployment

1. Log in to your Render account
2. Click on "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the following settings:
   - **Name**: entalk-questions-tool (or your preferred name)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (or select a paid plan for better performance)

## Step 4: Configure Environment Variables

In the Render dashboard, add the following environment variables:

- `PORT`: 10000
- `NODE_ENV`: production
- `JWT_SECRET`: [Generate a secure random string]
- `OPENAI_API_KEY`: [Your OpenAI API key]
- `CORS_ORIGIN`: * (or specify your frontend domain if applicable)
- `MONGODB_URI`: [Your MongoDB connection string] (optional)

## Step 5: Deploy the Application

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Once deployment is complete, you can access your application at the provided URL

## Step 6: Verify Deployment

1. Visit the deployed URL to ensure the application is running correctly
2. Test the login functionality with the default credentials:
   - Email: admin@entalk.com
   - Password: Entalk123!

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Render logs for error messages
2. Verify that all environment variables are correctly set
3. Ensure your OpenAI API key is valid
4. Check that your MongoDB URI is correct (if using MongoDB)

## Updating the Application

To update the application:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and redeploy the application

## Additional Resources

- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)
- [Environment Variables on Render](https://render.com/docs/environment-variables)
