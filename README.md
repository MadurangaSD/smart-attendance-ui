# Smart Attendance System - Frontend (React + Vite + Tailwind)

**Project**: Smart Attendance System (Face Recognition) 👤  
**Frontend only**: React + Vite + Tailwind — includes plain CSS fallback. Mocked backend via localStorage / mock service.

## Quick start (already scaffolded)
1. Extract the zip and open in VS Code.
2. Install dependencies:
```bash
npm install
```
3. Run dev server:
```bash
npm run dev
```
Open the URL shown by Vite (usually http://localhost:5173).

## What is included
- React + Vite app with Tailwind CSS configured.
- React Router pages: Landing/Auth stub, Dashboard, Attendance (camera), Reports, Admin → Students.
- Mock API at `src/api/mock.js` (simulates network latency and endpoints).
- Camera-based UI using `getUserMedia` and `callFaceRecognitionAPI(imageBlob)` placeholder function for integration notes.
- Charts via `react-chartjs-2` + `chart.js`.
- Plain CSS fallback: `public/styles.css`. To disable Tailwind, remove Tailwind imports in `src/main.jsx` and include `/public/styles.css` in `index.html`.

## How to replace mock API with Flask + OpenCV
See `src/api/mock.js` for the client-side shapes. Example fetch for recognition (multipart/form-data):
```js
const form = new FormData();
form.append('image', fileBlob, 'capture.png');
const res = await fetch('http://localhost:5000/recognize', {
  method: 'POST',
  body: form
});
const json = await res.json();
/* expected response:
  { studentId: 's123', name: 'Alice', confidence: 0.87 }
  or { matched: false }
*/
```
Replace calls in `src/services/attendanceService.js` with real endpoints.

## File tree (top-level)
```
/src
  /api
    mock.js
  /components
    Header.jsx
    Sidebar.jsx
    Button.jsx
    Modal.jsx
    Table.jsx
    Toast.jsx
  /pages
    Landing.jsx
    Dashboard.jsx
    Attendance.jsx
    Reports.jsx
    AdminStudents.jsx
  /services
    attendanceService.js
  main.jsx
  App.jsx
  index.css
/public
  avatar-1.png
  styles.css
tailwind.config.js
postcss.config.cjs
package.json
README.md
```

## Testing checklist (first run)
- [ ] npm install && npm run dev
- [ ] Open app and toggle role (Admin / Instructor) in header
- [ ] Visit Admin → Students: Add a student, upload image; refresh page and confirm persistence
- [ ] Go to Attendance: Allow camera, capture image, simulate recognition — attendance should be recorded
- [ ] Check Reports: filter by dates, export CSV
- [ ] View Dashboard: charts and stats update

## Notes
- All backend calls are mocked; switch to real endpoints by editing `src/services/attendanceService.js`.
- Accessibility: form labels, keyboard-focusable buttons, alt text present.
- Dark/light theme toggle is included in header.

Enjoy — this is front-end only. Happy to expand or connect to your Flask + OpenCV backend with examples.
