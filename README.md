<div align="center">
  <img src="public/assets/icons/docjam-logo.svg" alt="DocJam Logo" width="200"/>
  <h1>DocJam</h1>
  <p><strong>Real-Time Collaborative Document Editing Platform</strong></p>
  <p>A powerful online tool that allows multiple users to edit documents simultaneously in real-time. Perfect for teams, remote workers, and anyone who needs to collaborate on projects efficiently.</p>
</div>

---

## 🌟 Features

- **Real-Time Collaboration** - Multiple users can edit the same document simultaneously with live cursor tracking
- **Rich Text Editing** - Full-featured text editor powered by Lexical with formatting options
- **User Authentication** - Secure sign-in/sign-up with Clerk authentication
- **Access Control** - Granular permissions system with editor and viewer roles
- **Document Management** - Create, view, edit, and delete documents with ease
- **Active Collaborators** - See who's currently working on the document
- **Smart Notifications** - Stay updated with document activities
- **@Mentions** - Tag and notify collaborators within documents
- **Share & Invite** - Share documents with team members and control their access levels
- **Dark Theme** - Beautiful dark-themed interface for comfortable editing
- **Responsive Design** - Works seamlessly across desktop and mobile devices

## 🚀 Tech Stack

### Frontend
- **[Next.js 14](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety and better DX
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible UI components

### Backend & Services
- **[Clerk](https://clerk.com/)** - Authentication and user management
- **[Liveblocks](https://liveblocks.io/)** - Real-time collaboration infrastructure
- **[Lexical](https://lexical.dev/)** - Extensible text editor framework

### Additional Tools
- **[jsm-editor](https://www.npmjs.com/package/jsm-editor)** - Enhanced editor components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[nanoid](https://github.com/ai/nanoid)** - Unique ID generator

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- A **Clerk** account ([Sign up here](https://clerk.com/))
- A **Liveblocks** account ([Sign up here](https://liveblocks.io/))

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Dev-muse/doc-jam.git
cd doc-jam
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Liveblocks
LIVEBLOCKS_SECRET_KEY=your_liveblocks_secret_key
```

#### Getting API Keys:

**Clerk:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application
3. Navigate to API Keys section
4. Copy the Publishable Key and Secret Key

**Liveblocks:**
1. Go to [Liveblocks Dashboard](https://liveblocks.io/dashboard)
2. Create a new project
3. Navigate to API Keys section
4. Copy the Secret Key

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
doc-jam/
├── app/
│   ├── (auth)/                 # Authentication routes
│   │   ├── sign-in/           # Sign-in page
│   │   └── sign-up/           # Sign-up page
│   ├── (root)/                # Main application routes
│   │   ├── documents/[id]/    # Individual document page
│   │   └── page.tsx           # Home page with document list
│   ├── api/
│   │   └── liveblocks-auth/   # Liveblocks authentication endpoint
│   ├── Provider.tsx           # Liveblocks provider wrapper
│   ├── layout.tsx             # Root layout with Clerk provider
│   └── globals.css            # Global styles
├── components/
│   ├── editor/                # Editor components
│   ├── ui/                    # Reusable UI components
│   ├── ActiveCollaborators.tsx
│   ├── CollaborativeRoom.tsx  # Main collaborative workspace
│   ├── Collaborator.tsx
│   ├── DeleteModal.tsx
│   ├── Header.tsx
│   ├── Notifications.tsx
│   ├── ShareModal.tsx
│   └── UserTypeSelector.tsx
├── lib/
│   ├── actions/
│   │   ├── room.actions.ts    # Document/room server actions
│   │   └── user.actions.ts    # User-related server actions
│   ├── liveblocks.ts          # Liveblocks client configuration
│   └── utils.ts               # Utility functions
├── public/
│   └── assets/                # Static assets (icons, images)
├── styles/                     # Theme styles
├── middleware.ts              # Clerk middleware for auth
├── liveblocks.config.ts       # Liveblocks type definitions
├── tailwind.config.ts         # Tailwind configuration
└── package.json
```

## 🎯 Usage

### Creating a Document
1. Sign in to your account
2. Click the "Create a document" button on the home page
3. Start editing your new document

### Collaborating in Real-Time
1. Open a document
2. Click the "Share" button in the header
3. Add collaborators by email
4. Choose their access level (Editor or Viewer)
5. Collaborators can now edit simultaneously

### Managing Documents
- **View all documents**: Navigate to the home page
- **Edit a document**: Click on any document from the list
- **Delete a document**: Click the delete icon next to a document
- **Update document title**: Click on the title in the document editor

### Access Levels
- **Editor**: Can read, write, and edit the document
- **Viewer**: Can only read the document and see live changes

## 🔐 Security Features

- **Secure Authentication**: Industry-standard authentication with Clerk
- **Email Verification**: Ensures user identity
- **Access Control**: Granular permissions for each document
- **Secure API Routes**: Protected with Clerk middleware
- **Environment Variables**: Sensitive data stored securely

## 🚢 Deployment

### Deploy on Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/new)
3. Add environment variables in Vercel project settings
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Dev-muse/doc-jam)

### Build for Production

```bash
npm run build
npm run start
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Dev-muse**
- GitHub: [@Dev-muse](https://github.com/Dev-muse)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Clerk](https://clerk.com/) for authentication
- [Liveblocks](https://liveblocks.io/) for real-time collaboration infrastructure
- [Lexical](https://lexical.dev/) for the text editor
- [Vercel](https://vercel.com/) for hosting

## 📧 Support

For support, email dev-muse@example.com or open an issue in the GitHub repository.

---

<div align="center">
  <p>Made with ❤️ by Dev-muse</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
