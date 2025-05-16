# TinyCompressor - Image Compression Web App

A powerful image compression web application powered by the TinyPNG API. This application provides a beautiful UI built with React, TypeScript, Tailwind CSS, and Framer Motion animations. It allows users to compress images to specific target file sizes with just a few clicks.

![TinyCompressor Screenshot](screenshot.png)

## Features

- Beautiful, responsive UI with animations
- Drag-and-drop image upload
- Compress to predefined target sizes (20KB, 50KB, 100KB, 150KB, 250KB, 500KB)
- Secure API key handling via Netlify serverless functions
- Progress indicators and detailed compression stats
- Download individual images or all at once
- Toggle between original and compressed preview
- Detailed error handling and user feedback
- Mobile-responsive design

## Technology Stack

- React & TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- react-dropzone for file uploads
- Netlify Functions for serverless backend
- TinyPNG API for image compression

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- TinyPNG API key (get one for free at [tinypng.com/developers](https://tinypng.com/developers))
- Netlify account (for deployment)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/tinycompressor.git
   cd tinycompressor
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory with your TinyPNG API key:
   ```
   REACT_APP_TINYPNG_API_KEY="your_tinypng_api_key_here"
   TINYPNG_API_KEY="your_tinypng_api_key_here"
   ```

4. Start the development server:
   ```bash
   npm run netlify-dev
   # or
   yarn netlify-dev
   ```

5. Open your browser and navigate to `http://localhost:8888`

### Building for Production

```bash
npm run build
# or
yarn build
```

### Deployment to Netlify

1. Push your code to a GitHub repository
2. Log in to Netlify and create a new site from your GitHub repository
3. In the site settings, add your TinyPNG API key as an environment variable:
   - Key: `TINYPNG_API_KEY`
   - Value: `your_tinypng_api_key_here`
4. Trigger a new deploy

Alternatively, you can use the Netlify CLI:

```bash
netlify login
netlify deploy --prod
```

## Project Structure

```
resize-app/
├── functions/              # Netlify serverless functions
│   └── compress.js         # TinyPNG image compression function
├── public/                 # Static assets
│   └── index.html
├── src/
│   ├── components/         # React components
│   │   ├── CompressionControls.tsx
│   │   ├── CompressionOptions.tsx
│   │   ├── CompressionStats.tsx
│   │   ├── FileUploader.tsx
│   │   ├── Header.tsx
│   │   └── ImagePreview.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useImageFiles.ts
│   │   └── useToggle.ts
│   ├── services/           # API services
│   │   └── tinypngService.ts
│   ├── types/              # TypeScript definitions
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   └── index.tsx           # Application entry point
├── .env                    # Environment variables
├── netlify.toml            # Netlify configuration
├── package.json            # Project dependencies
├── setup-netlify-env.ps1   # Setup script for Netlify env variables
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json           # TypeScript configuration
```

## Technical Details

### TinyPNG Service

The application uses TinyPNG's API to compress images. The compression process is handled by a Netlify serverless function to keep the API key secure.

The service supports two main methods:
- Basic image compression
- Compression to a target file size

For target file size compression, the application uses a binary search algorithm to find the optimal scale factor that meets the size requirement while maintaining the best possible image quality.

### Security Considerations

- The TinyPNG API key is stored as an environment variable and never exposed to the client
- All API communication happens through secure serverless functions
- Form validation ensures only valid image files are processed

### Error Handling

The application includes comprehensive error handling for:
- API connection issues
- Invalid API keys
- Rate limiting/quota exceeded
- Failed compression operations
- Network failures

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [TinyPNG](https://tinypng.com/) for their excellent image compression API
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Netlify](https://www.netlify.com/) for serverless function hosting
- Netlify Functions for secure API integration
- TinyPNG API for powerful compression

## Setup & Installation

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
