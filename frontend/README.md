# Online To-Do List Frontend

Modern React frontend for the Multi-User Online To-Do List API.

## Features

- ✨ User authentication (register/login)
- 📝 Create, read, update, delete tasks
- ✅ Mark tasks as complete/incomplete
- 🔒 Secure JWT token-based auth
- 📱 Responsive design
- 🎨 Modern UI with gradient colors
- ⚡ Real-time task management

## Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production

```bash
npm run build
```

## API Configuration

The frontend connects to the production API at:
```
https://online-to-do-list-multi-user.onrender.com
```

To change the API URL, edit [src/api.js](src/api.js):

```javascript
const API_URL = 'http://localhost:8000'; // For local development
```

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AuthPage.js      # Login/Register
│   │   ├── TasksPage.js     # Main tasks view
│   │   ├── TaskList.js      # Task list display
│   │   ├── TaskItem.js      # Individual task
│   │   └── TaskForm.js      # Create task form
│   ├── api.js              # API client
│   ├── App.js              # Main app component
│   └── index.js            # Entry point
└── package.json
```

## Usage

### Register
1. Click "Register here"
2. Enter email and password
3. Click "Register"

### Login
1. Enter your email and password
2. Click "Login"

### Create Task
1. Enter task title
2. Optionally add description
3. Click "+ Add Task"

### Update Task
1. Click ✏️ edit button
2. Modify title/description
3. Click "Save"

### Delete Task
1. Click 🗑️ delete button
2. Confirm deletion

### Mark Complete
1. Check the checkbox next to task
2. Task moves to "Completed" section

## Authentication

- Uses JWT token-based authentication
- Tokens stored in localStorage
- Auto-logout on token expiration
- Supports multiple concurrent users

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
