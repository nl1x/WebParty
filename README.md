# 🎉 WebParty  
### A web application made for parties  

---

## 🛠️ Backend Structure  

The backend is organized into four main directories:

### 1. **📦 `models`**  
This directory contains all the database models.  
Examples:  
- 👤 User model  
- 📝 Post model  

---

### 2. **🛡️ `middlewares`**  
This directory houses all the middlewares responsible for intercepting and processing requests.  
Examples:  
- 🔑 Authentication middleware for managing private routes  

---

### 3. **🌐 `routes`**  
This directory defines all the API routes. The logic for each route is not included here but is instead located in the `services` directory.  
Examples:  
- 🚪 A `/login` route file can be found here, but its corresponding logic will reside in `services/login.ts`.  

---

### 4. **🧩 `controllers`**  
This directory contains the logic and functionality for each route.  
Examples:  
- ✏️ To create a user, the file `controllers/users/post.ts` would include a `postUser(...)` function to validate the incoming data and create the user.  
