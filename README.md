# 🎭 Memeify It

**Memeify It** is a fun and interactive web application that allows users to explore trending memes, search and download GIFs and stickers, and even generate their own memes using templates. Built with **Next.js** and **TypeScript**, it integrates multiple APIs to deliver a smooth, meme-tastic experience.

---

## 🚀 Features

- 🏠 **Homepage**
  - Displays **Trending Memes** and **Latest Memes** from Reddit and Imgflip.
- 🎨 **Meme Generator**
  - Choose meme templates and add custom top and bottom text to create memes.
- 🔍 **Search GIFs**
  - Search and download your favorite GIFs using the Giphy API.
- ✨ **Trending Stickers**
  - View and download trending stickers from Giphy.

---

## ⚙️ Implementation Process

1. **Frontend Development**
   - Built with **Next.js App Router** and **TypeScript**.
   - Styled with **Tailwind CSS** for a modern and responsive UI.
   - Components like meme generator, GIF search, and download buttons were built using functional React components.

2. **Backend API Routes**
   - Custom **API routes** were created inside `app/api/` to handle external API communication securely:
     - `/api/giphy` handles fetching trending/search/sticker data from Giphy.
     - `/api/memes` fetches trending/latest memes from Reddit.
     - `/api/generate-meme` handles POST requests to the Imgflip API for custom meme generation.
   - This keeps all external API logic encapsulated and allows us to use `.env` variables for credentials.

3. **GIF & Sticker Downloads**
   - Users can click a download button to fetch and save GIFs/stickers using the `fetch` + `Blob` approach.

4. **User Feedback & Loading**
   - Toasts via **React Toastify** give instant feedback (e.g. on download or meme generation).
   - Loaders via **React Spinners** show loading state during API calls.

5. **Project Quality & Maintenance**
   - Code quality is ensured with **ESLint**.
   - Sensitive API keys are managed with `.env.local` and not committed.

---

## 📦 Packages & Tools Used

- **Next.js**
- **TypeScript**
- **Tailwind CSS**
- **Axios**
- **React Spinners**
- **React Toastify**
- **React Icons**
- **NextAuth**
- **ESLint**
- **.env**

---

## 🌐 APIs Used

- **Giphy API** – for GIF and sticker content.
- **Imgflip API** – for meme templates and meme generation.
- **Reddit API** – to fetch trending and latest memes from meme subreddits.

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/memeify-it.git
cd memeify-it
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Create .env.local File
In the root of your project, create a .env.local file and add your API credentials:
```env
GIPHY_API_KEY=yourGiphyApiKey
IMGFLIP_USERNAME=yourImgflipUsername
IMGFLIP_PASSWORD=yourImgflipPassword
GITHUB_ID=yourGithubOauthClentId
GITHUB_SECRET=yourGithubOauthClientSecret
```

### 4. Run the Development Server
```bash
npm run dev
```
### 5. Open in Browser
Visit http://localhost:3000 to see the application running.
