# Staging test steps (auth + EPS identity)

Branch: `staging` only (staging.chaatro.com). Production (`main`) is untouched. No env vars or SQL changes.

1. Google login: open staging.chaatro.com -> Log in -> "Continue with Google". After Google you land on `/#s-home` (student portal) with your real name/email. Failed sign-in shows a red message on the login page.
2. Refresh the page: still logged in. Header shows your first name + "Log out". Going to Home does not log you out. Opening `#login` while logged in redirects to the portal.
3. Log out (header button or portal sidebar): calls Supabase signOut; refresh -> "Log in" again.
4. Roles: a Google user is student-only. `#t-home`, `#a-home`, `#i-home` show "No access". Demo logins and the "Demo logins"/"Demo portals" boxes are REMOVED: no credentials exist in the front-end, and `#a-home`/`#t-home`/`#i-home`/`#s-home` redirect to `#login` when not signed in. Teacher/admin/institution portals are closed to everyone until server-side roles exist.
5. Logged-in sandbox payment: checkout prefills name/email; request carries `Authorization: Bearer <token>`; the server verifies it and stores `orders.user_id`. Check in Supabase: `select order_id, user_id, amount from orders order by created_at desc limit 5;`
6. Guest sandbox payment: log out, pay -> order saved with `user_id` NULL.
7. Prices are computed on the server (`api/_price.js` from `js/data.js`); the browser `amount` is ignored for course, subscription and bundle.
8. Bundle sandbox payment: log in -> `#bundles` -> open a bundle -> Enrol -> choose EPS -> pay in the sandbox. The result page has "View my courses"; `#s-courses` lists every course of the bundle and `#s-pay` shows one payment row with the bundle name. A guest can also pay (user_id NULL) but the courses do not appear in any account automatically. Cash is still offered and, as before, is not stored.
9. P2P is closed: `js/portal-p2p.js` is not loaded and `/api/eps/init` answers `P2P_CLOSED` for `kind: p2p`.

New real students see an empty dashboard (no sample courses, payments, tickets, referrals). Public catalog (courses, coupons) is not student data.

Known limits: class schedule, notices, quizzes and chats are not published for real students yet; "My courses" and payment history are built from paid orders.
