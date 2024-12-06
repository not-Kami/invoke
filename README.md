# **Invoke/Summon**

## **Overview**
**Invoke/Summon** is a platform connecting **players** and **Game Masters (GMs)** in the realm of role-playing games (RPGs). It allows players to find RPG sessions quickly and enables GMs to create and manage sessions with ease, whether for leisure or monetization.

---

## **Features**

### **Core Features (MVP)**
1. **User Management**:
   - Registration, login, and profile customization (players and GMs).
   - Player profiles include game preferences and experience levels.

2. **Session Management**:
   - **GMs** can create sessions with:
     - Titles
     - Descriptions
     - Formats (online/in-person)
     - Dates and times.
   - **Players** can search sessions using filters like:
     - Game type
     - Date
     - Format
     - Experience level.

3. **Request Custom/Private Sessions**:
   - Players can directly request a GM to organize a **custom or private session** tailored to their preferences.

4. **Ratings and Reviews**:
   - Players rate GMs after sessions.
   - Reviews are visible on GM profiles.

5. **Interactive Calendar**:
   - View upcoming sessions.
   - Notifications and reminders for registered sessions.

---

## **Future Features**
1. **Integrated Messaging**: Direct communication between players and GMs for better session organization and custom session requests.
2. **Payment System**: Secure payment for GM services, including private sessions.
3. **Campaign Tools**: Share and manage game materials like character sheets and maps.
4. **External Integration**: Sync sessions with external calendars like Google Calendar.

---

## **Technical Stack**

### **Frontend**
- **React.js**: For a fast and responsive user interface.

### **Backend**
- **Node.js with Express.js**: API management and session handling.

### **Database**
- **MongoDB**: Flexible and suited for semi-structured data.

### **Hosting**
- Local deployment on a **Proxmox** virtualized environment.

---

## **Setup**

### **Prerequisites**
- **Node.js** (v16+)
- **MongoDB**
- Proxmox (for deployment)
