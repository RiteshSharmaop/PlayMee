# PlayMee 🎮🎵  

**PlayMee** is an innovative platform combining the Video & Tweet. Where users can upload and share videos, tweet, like, and comment on content, create playlists, and follow channels. The application follows the MERN stack (MongoDB, Express, React, Node.js) and is structured with a microservices architecture.

---

## 📦It's Contain  
- 🎵 **Music Integration:** Play, pause, and queue your favorite songs.  
- 🎥 **Video:** Watch trending videos, stream favorite shows, and  Play, pause, and queue your favorite songs.  
- 🚀 **Modern UI:** Inspired by the DevUI YouTube [Template](https://devuiv2.vercel.app/templates/youtube) for an intuitive and visually appealing user interface.    
- 💾 **Efficient Data Management:** Seamless database integration for storing user preferences and activity logs. [Model](https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj)

---
## ✨Features
- **User Authentication**: Register, log in, and manage user profiles.
- **Tweeting**: Create, update, and delete tweets.
- **Video Upload**: Upload videos, manage their details (e.g., thumbnail, publishing status), and like/dislike them.
- **Commenting**: Add, edit, and delete comments on videos.
- **Subscriptions**: Subscribe to channels and manage subscriptions.
- **Playlists**: Create and manage playlists, add or remove videos.
- **Like/Dislike**: Like videos, tweets, or comments.

---

## 🛠️Technologies Used
- **Node.js**: Backend API server.
- **Express.js**: Web framework for routing.
- **MongoDB**: Database for storing user, video, tweet, comment, and subscription data..
- **JWT Authentication**: Secure access to user routes.
- **Multer**: Handling file uploads (avatars, cover images, videos, thumbnails).
- **Cloudinary**: Cloud-based platform for uploading photos and videos.

---


## 🚀Getting Started  
Follow the steps below to set up the project on your local machine.

### Prerequisites  
- [**Node.js**](https://nodejs.org/) (Version 16 or above recommended)  
- [**Git**](https://git-scm.com/)  
- [**Postman**](https://www.postman.com/) (optional, for testing APIs)  
- **Pipleines** (for CI/CD automation)

### Installation  

1. **Clone the repository**:  
   ```bash
    git clone https://github.com/RiteshSharmaop/PlayMee/tree/master
    cd PlayMee
    ```

2. **Install Dependencies**
    ```bash
    npm install
    ```
---
## API Endpoints
### 👤 User Authentication API Endpoints

#### Registration

```
POST /api/v1/users/register
```
**Description:** Register a new user  
**Body:**
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "password": "securePassword123",
    "avatar": "optional-avatar-url"
}
```
**Response:** User registration confirmation and access token
```json
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "userId": "user-uuid",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "avatar": "avatar-url",
        "accessToken": "jwt-token-here",
        "refreshToken": "refresh-token-here"
    }
}
```

#### Login

```
POST /api/v1/users/login
```
**Description:** Authenticate user and get access token  
**Body:**
```json
{
    "email": "john@example.com",
    "password": "securePassword123"
}
```
**Response:** Authentication tokens and user details
```json
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "userId": "user-uuid",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "avatar": "avatar-url",
        "accessToken": "jwt-token-here",
        "refreshToken": "refresh-token-here"
    }
}
```

#### Refresh Token

```
POST /api/v1/users/refresh-token
```
**Description:** Get new access token using refresh token  
**Headers:** Authorization: Bearer refresh-token-here  
**Response:** New access token
```json
{
    "status": "success",
    "message": "Token refreshed successfully",
    "data": {
        "accessToken": "new-jwt-token-here"
    }
}
```

#### Logout

```
POST /api/v1/users/logout
```
**Description:** Invalidate user tokens and logout  
**Headers:** Authorization: Bearer access-token-here  
**Response:** Logout confirmation
```json
{
    "status": "success",
    "message": "Logged out successfully"
}
```

#### Change Password

```
POST /api/v1/users/change-password
```
**Description:** Change user password  
**Headers:** Authorization: Bearer access-token-here  
**Body:**
```json
{
    "oldPassword": "currentPassword123",
    "newPassword": "newSecurePassword123"
}
```
**Response:** Password change confirmation
```json
{
    "status": "success",
    "message": "Password changed successfully"
}
```

#### Forgot Password

```
POST /api/v1/users/forgot-password
```
**Description:** Request password reset link  
**Body:**
```json
{
    "email": "john@example.com"
}
```
**Response:** Reset link confirmation
```json
{
    "status": "success",
    "message": "Password reset link sent to email"
}
```

#### Reset Password

```
POST /api/v1/users/reset-password
```
**Description:** Reset password using reset token  
**Body:**
```json
{
    "resetToken": "reset-token-from-email",
    "newPassword": "newSecurePassword123"
}
```
**Response:** Password reset confirmation
```json
{
    "status": "success",
    "message": "Password reset successful"
}
```

#### **Get Current User**

```
GET /api/v1/users/me
```
**Description:** Get current user details  
**Headers:** Authorization: Bearer access-token-here  
**Response:** User details
```json
{
    "status": "success",
    "data": {
        "userId": "user-uuid",
        "username": "johndoe",
        "email": "john@example.com",
        "fullName": "John Doe",
        "avatar": "avatar-url",
        "createdAt": "2024-01-01T00:00:00Z",
        "updatedAt": "2024-01-01T00:00:00Z"
    }
}
```
### **🗨️ Comment API Endpoints**

***All routes require Authentication👤***

```
GET /api/v1/comments/
```
**Description:** Fetch all comments for a specific video  
**Path Parameters:** videoId (string) - ID of the video  
**Response:** List of comments

```
POST /api/v1/comments/
```
**Description:** Add a comment to a specific video  
**Path Parameters:** videoId (string) - ID of the video  
**Body:**
```json
{
    "text": "Your comment here"
}
```
**Response:** Details of the created comment

```
DELETE /api/v1/comments/c/
```
**Description:** Delete a specific comment  
**Path Parameters:** commentId (string) - ID of the comment to be deleted  
**Response:** Deletion confirmation

```
PATCH /api/v1/comments/c/
```
**Description:** Update a specific comment  
**Path Parameters:** commentId (string) - ID of the comment to be updated  
**Body:**
```json
{
    "text": "Updated comment text"
}
```
**Response:** Updated comment details

### **📊 Dashboard API Endpoints**

```
GET /api/v1/dashboard/stats/
```
**Description:** Get statistics for a specific channel  
**Path Parameters:** channelId (string) - ID of the channel  
**Response:** Channel statistics data

```
GET /api/v1/dashboard/video/
```
**Description:** Fetch all videos of a specific channel  
**Path Parameters:** channelId (string) - ID of the channel  
**Response:** List of videos

### **🩺 Healthcheck API Endpoint**

```
GET /api/v1/healthcheck
```
**Description:** Checks if the server is up and running  
**Response:**
```json
{
    "status": "OK",
    "message": "Server is healthy"
}
```

### 👍 Like API Endpoints

***All routes require Authentication👤***

```
POST /api/v1/likes/toggle/v/
```
**Description:** Like or unlike a specific video  
**Path Parameters:** videoId (string) - ID of the video  
**Response:** Liking status (liked or unliked)

```
POST /api/v1/likes/toggle/c/
```
**Description:** Like or unlike a specific comment  
**Path Parameters:** commentId (string) - ID of the comment  
**Response:** Liking status (liked or unliked)

```
POST /api/v1/likes/toggle/t/
```
**Description:** Like or unlike a specific tweet  
**Path Parameters:** tweetId (string) - ID of the tweet  
**Response:** Liking status (liked or unliked)

```
GET /api/v1/likes/videos
```
**Description:** Get all liked videos by the user  
**Response:** List of liked videos

### 📚 Playlist API Endpoints

***All routes require Authentication👤***

```
POST /api/v1/playlist/
```
**Description:** Create a new playlist  
**Body:**
```json
{
    "title": "My Playlist",
    "description": "Description of the playlist"
}
```
**Response:** Playlist creation confirmation

```
GET /api/v1/playlist/
```
**Description:** Get details of a specific playlist  
**Path Parameters:** playlistId (string) - ID of the playlist  
**Response:** Playlist details

```
PATCH /api/v1/playlist/
```
**Description:** Update a specific playlist  
**Path Parameters:** playlistId (string) - ID of the playlist  
**Body:**
```json
{
    "title": "Updated Playlist Title",
    "description": "Updated description"
}
```
**Response:** Updated playlist details

```
DELETE /api/v1/playlist/
```
**Description:** Delete a specific playlist  
**Path Parameters:** playlistId (string) - ID of the playlist to be deleted  
**Response:** Playlist deletion confirmation

```
PATCH /api/v1/playlist/add/{videoId}/{playlistId}
```
**Description:** Add a video to a specific playlist  
**Path Parameters:** 
- videoId (string) - ID of the video
- playlistId (string) - ID of the playlist  
**Response:** Video added to the playlist

```
PATCH /api/v1/playlist/remove/{videoId}/{playlistId}
```
**Description:** Remove a video from a specific playlist  
**Path Parameters:**
- videoId (string) - ID of the video
- playlistId (string) - ID of the playlist  
**Response:** Video removed from the playlist

```
GET /api/v1/playlist/user/
```
**Description:** Get all playlists of a user  
**Path Parameters:** userId (string) - ID of the user  
**Response:** List of user playlists

### 🔔 Subscription API Endpoints

***All routes require Authentication👤***

```
GET /api/v1/subscriptions/c/
```
**Description:** Get subscribers of a specific channel  
**Path Parameters:** channelId (string) - ID of the channel  
**Response:** List of subscribers

```
POST /api/v1/subscriptions/c/
```
**Description:** Subscribe or unsubscribe from a specific channel  
**Path Parameters:** channelId (string) - ID of the channel  
**Response:** Subscription status

```
GET /api/v1/subscriptions/u/
```
**Description:** Get all subscriptions of a user  
**Path Parameters:** subscriberId (string) - ID of the subscriber  
**Response:** List of subscribed channels

### 📜 Tweet API Endpoints

***All routes require Authentication👤***

```
POST /api/v1/tweets/
```
**Description:** Create a new tweet  
**Body:**
```json
{
    "content": "This is a tweet"
}
```
**Response:** Tweet creation confirmation

```
GET /api/v1/tweets/user/
```
**Description:** Get all tweets from a specific user  
**Path Parameters:** userId (string) - ID of the user  
**Response:** List of tweets

```
GET /api/v1/tweets/
```
**Description:** Get details of a specific tweet  
**Path Parameters:** tweetId (string) - ID of the tweet  
**Response:** Tweet details

```
PATCH /api/v1/tweets/
```
**Description:** Update a specific tweet  
**Path Parameters:** tweetId (string) - ID of the tweet  
**Body:**
```json
{
    "content": "Updated tweet content"
}
```
**Response:** Updated tweet details

```
DELETE /api/v1/tweets/
```
**Description:** Delete a specific tweet  
**Path Parameters:** tweetId (string) - ID of the tweet  
**Response:** Tweet deletion confirmation
