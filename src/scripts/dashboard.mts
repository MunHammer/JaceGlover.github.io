import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";

function main() {
  const firebaseConfig = {
    apiKey: "AIzaSyA3PF0jklshcBZLm4Tm_-K10RUok15Mu3U",
    authDomain: "aceblocks.firebaseapp.com",
    projectId: "aceblocks",
    storageBucket: "aceblocks.firebasestorage.app",
    messagingSenderId: "295224865929",
    appId: "1:295224865929:web:d82a392b52d2c856c58258",
    measurementId: "G-J0N2L9FGD9",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  onAuthStateChanged(auth, (user) => {
    if (user === null) {
      window.location.href = "login.html";
      return
    }

    // Name — prefer displayName, fall back to email prefix
    const name = user.displayName || user.email?.split("@")[0] || "Anon";
    const initials = name?.slice(0, 2).toUpperCase();

    // Avatar — use Google photo if available, else initials
    const avatarEl = document.getElementById("user-avatar");
    if (avatarEl === null || initials === undefined) throw new ReferenceError()
    if (user.photoURL) {
      avatarEl.innerHTML = `<img src="${user.photoURL}" alt="${initials}">`;
    } else {
      avatarEl.textContent = initials;
    }

    const welcome = document.getElementById("welcome-heading");
    const email = document.getElementById("user-email-display");
    if (welcome === null || email === null) throw new ReferenceError();

    welcome.textContent = `Welcome back, ${name}.`;
    email.textContent = user.email;

    // Pull lesson progress from localStorage (set by lessons.html)
    const lesson_num = localStorage.getItem("aceblocksLesson");
    if (lesson_num === null) throw new ReferenceError();
    const lessonNum =
      parseInt(lesson_num) || 1;
    const TOTAL = 12;
    const completed = Math.max(0, lessonNum - 1);
    const pct = Math.round((completed / TOTAL) * 100);
    const xp = completed * 50;

    const lessons = document.getElementById("stat-lessons");
    const stat_xp = document.getElementById("stat-xp");
    const progress = document.getElementById("course-progress-blocks");
    const label_blocks = document.getElementById("course-label-blocks");

    if (lessons === null || stat_xp === null || progress === null || label_blocks === null) throw new ReferenceError();

    lessons.textContent = completed.toString();
    stat_xp.textContent = xp.toString();

    progress.style.width = pct + "%";
    label_blocks.textContent =
      pct === 100
        ? "100% complete — Finished! 🎉"
        : pct === 0
          ? "0% complete — Start now"
          : pct + "% complete — Keep going!";

    // Unlock badges based on progress
    if (completed >= 1) {
      const first =
        document.getElementById("badge-first-lesson");
      if (first === null) throw new ReferenceError();
      first.classList.remove("locked");
    }
    if (completed >= TOTAL) {
      const complete =
        document.getElementById("badge-course-complete")
      if (complete === null) throw new ReferenceError;
      complete.classList.remove("locked");
    }
  });

  const logout = document.getElementById("btn-logout");
  if (logout === null) throw new ReferenceError();
  logout.addEventListener("click", async () => {
    await signOut(auth);
    window.location.href = "login.html";
  });

}
main();
