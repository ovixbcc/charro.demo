# Staging ও লাইভ

- `main` ব্রাঞ্চ = লাইভ (chaatro.com)। এটা ছোঁয়া হবে না যতক্ষণ না পরীক্ষা শেষ।
- `staging` ব্রাঞ্চ = টেস্ট কপি। পুশ করলে Vercel একই প্রজেক্টে আলাদা Preview ঠিকানা বানায়
  (Vercel → Deployments → ব্রাঞ্চ `staging` → Visit)। লাইভ ডোমেইন বদলাতে হয় না।
- স্টেজিংয়ে নিচে কমলা "STAGING" ব্যানার দেখায়; chaatro.com-এ দেখায় না।
- Vercel → Settings → Environment Variables-এ `EPS_*` কী দুই জায়গায় আলাদা দিন:
  Production = লাইভ কী (`EPS_SANDBOX=false`), Preview = স্যান্ডবক্স কী (`EPS_SANDBOX=true`)।

## লাইভে নেওয়ার নিয়ম
```
git checkout staging   # এখানে কাজ ও পরীক্ষা
git push
# ঠিক থাকলে:
git checkout main && git merge staging && git push
```
