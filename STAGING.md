# Staging test steps (auth + EPS identity)

Branch: `staging` only (staging.chaatro.com). Production (`main`) is untouched. No env vars or SQL changes.

1. Google login: open staging.chaatro.com -> Log in -> "Continue with Google". After Google you land on `/#s-home` (student portal) with your real name/email. Failed sign-in shows a red message on the login page.
2. Refresh the page: still logged in. Header shows your first name + "Log out". Going to Home does not log you out. Opening `#login` while logged in redirects to the portal.
3. Log out (header button or portal sidebar): calls Supabase signOut; refresh -> "Log in" again.
4. Roles: a Google user is student-only. `#t-home`, `#a-home`, `#i-home` show "No access". Demo logins and the "Demo logins"/"Demo portals" boxes are REMOVED: no credentials exist in the front-end, and `#a-home`/`#t-home`/`#i-home`/`#s-home` redirect to `#login` when not signed in. Teacher/admin/institution portals are closed to everyone until server-side roles exist.
5. Logged-in sandbox payment: checkout prefills name/email; request carries `Authorization: Bearer <token>`; the server verifies it and stores `orders.user_id`. Check in Supabase: `select order_id, user_id, amount from orders order by created_at desc limit 5;`
6. Guest sandbox payment: log out, pay -> order saved with `user_id` NULL.
7. Prices are computed on the server (`api/_price.js` from `js/data.js`); the browser `amount` is ignored for course/subscription/bundle. P2P amounts are only range-checked (no catalog yet) and are flagged "[price not verified]".

New real students see an empty dashboard (no sample courses, payments, tickets, referrals, P2P posts). Public catalog (courses, coupons) is not student data.

Known limits: portal data (courses, payments) is still in-memory demo data; bundle checkout is still cash-only (server pricing for bundles exists but the page does not call EPS yet).
