/* ছাত্র.com — নমুনা ডেটা (ডেমো)। পরে অ্যাডমিন প্যানেল/ডেটাবেজ থেকে আসবে।
   Sample data. Later this will come from the admin panel / database. */

const PROGRAMS = [
  { id: 'cadet', code: 'CC', bn: 'ক্যাডেট কলেজ ভর্তি', en: 'Cadet College Admission',
    s: { bn: 'ক্যাডেট', en: 'Cadet' },
    d: { bn: 'সপ্তম শ্রেণিতে ভর্তির প্রস্তুতি: বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান।', en: 'Prepare for Class 7 entry: Bangla, English, Math and General Knowledge.' } },
  { id: 'du-ka', code: 'KA', bn: 'ঢাকা বিশ্ববিদ্যালয় — ক ইউনিট', en: 'Dhaka University — Unit Ka',
    s: { bn: 'ঢাবি ক', en: 'DU Ka' },
    d: { bn: 'ক ইউনিটের জন্য আলাদা ক্র্যাশ কোর্স, সপ্তাহে ১–২ দিন মডেল টেস্ট।', en: 'A separate crash course for Unit Ka with 1–2 model tests a week.' } },
  { id: 'du-kha', code: 'KHA', bn: 'ঢাকা বিশ্ববিদ্যালয় — খ ইউনিট', en: 'Dhaka University — Unit Kha',
    s: { bn: 'ঢাবি খ', en: 'DU Kha' },
    d: { bn: 'খ ইউনিটের জন্য আলাদা ক্র্যাশ কোর্স, সপ্তাহে ১–২ দিন মডেল টেস্ট।', en: 'A separate crash course for Unit Kha with 1–2 model tests a week.' } },
  { id: 'du-ga', code: 'GA', bn: 'ঢাকা বিশ্ববিদ্যালয় — গ ইউনিট', en: 'Dhaka University — Unit Ga',
    s: { bn: 'ঢাবি গ', en: 'DU Ga' },
    d: { bn: 'গ ইউনিটের জন্য আলাদা ক্র্যাশ কোর্স, সপ্তাহে ১–২ দিন মডেল টেস্ট।', en: 'A separate crash course for Unit Ga with 1–2 model tests a week.' } },
  { id: 'du-gha', code: 'GHA', bn: 'ঢাকা বিশ্ববিদ্যালয় — ঘ ইউনিট', en: 'Dhaka University — Unit Gha',
    s: { bn: 'ঢাবি ঘ', en: 'DU Gha' },
    d: { bn: 'ঘ ইউনিটের জন্য আলাদা ক্র্যাশ কোর্স, সপ্তাহে ১–২ দিন মডেল টেস্ট।', en: 'A separate crash course for Unit Gha with 1–2 model tests a week.' } },
  { id: 'bup', code: 'BUP', bn: 'বাংলাদেশ ইউনিভার্সিটি অফ প্রফেশনালস (BUP)', en: 'Bangladesh University of Professionals (BUP)',
    s: { bn: 'BUP', en: 'BUP' },
    d: { bn: 'BUP ভর্তি পরীক্ষার ক্র্যাশ কোর্স ও মডেল টেস্ট।', en: 'Crash course and model tests for the BUP admission test.' } },
  { id: 'buet', code: 'BUET', bn: 'বুয়েট ভর্তি পরীক্ষা', en: 'BUET Admission',
    s: { bn: 'বুয়েট', en: 'BUET' },
    d: { bn: 'বুয়েট ভর্তি পরীক্ষার জন্য ক্র্যাশ কোর্স ও মডেল টেস্ট।', en: 'Crash course and model tests for the BUET admission test.' } },
];

const SUBJECTS = [
  { id: 'bangla', code: 'Bn', bn: 'বাংলা', en: 'Bangla' },
  { id: 'english', code: 'En', bn: 'ইংরেজি', en: 'English' },
  { id: 'gk', code: 'GK', bn: 'সাধারণ জ্ঞান', en: 'General Knowledge' },
  { id: 'math', code: 'Mt', bn: 'গণিত', en: 'Mathematics' },
  { id: 'combined', code: '∑', bn: 'কম্বাইন্ড (সব বিষয়)', en: 'Combined (all subjects)' },
];

const DAYS = {
  sat: { bn: 'শনি', en: 'Sat' }, sun: { bn: 'রবি', en: 'Sun' }, mon: { bn: 'সোম', en: 'Mon' },
  tue: { bn: 'মঙ্গল', en: 'Tue' }, wed: { bn: 'বুধ', en: 'Wed' }, thu: { bn: 'বৃহ', en: 'Thu' }, fri: { bn: 'শুক্র', en: 'Fri' },
};

const INSTITUTIONS = [
  { id: 'buet', bn: 'বুয়েট', en: 'BUET' },
  { id: 'du', bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' },
  { id: 'dmc', bn: 'ঢাকা মেডিকেল কলেজ', en: 'Dhaka Medical College' },
  { id: 'ju', bn: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', en: 'Jahangirnagar University' },
  { id: 'bup', bn: 'BUP', en: 'BUP' },
];

/* বাংলাদেশের বিশ্ববিদ্যালয় (UGC তালিকা থেকে, টিচার আবেদনের ড্রপডাউনের জন্য) */
const UNIVERSITIES = {
 "public": [
  "University of Dhaka",
  "University of Rajshahi",
  "Bangladesh Agricultural University",
  "Bangladesh University of Engineering and Technology (BUET)",
  "University of Chittagong",
  "Jahangirnagar University",
  "Islamic University, Kushtia",
  "Khulna University",
  "Shahjalal University of Science and Technology",
  "Hajee Mohammad Danesh Science and Technology University",
  "Patuakhali Science and Technology University",
  "Sher-e-Bangla Agricultural University",
  "Chittagong University of Engineering and Technology (CUET)",
  "Rajshahi University of Engineering and Technology (RUET)",
  "Khulna University of Engineering and Technology (KUET)",
  "Dhaka University of Engineering and Technology (DUET), Gazipur",
  "Mawlana Bhashani Science and Technology University",
  "Bangladesh University of Professionals (BUP)",
  "Noakhali Science and Technology University",
  "Jagannath University",
  "Comilla University",
  "Jatiya Kabi Kazi Nazrul Islam University",
  "Chittagong Veterinary and Animal Sciences University",
  "Sylhet Agricultural University",
  "Jashore University of Science and Technology",
  "Pabna University of Science and Technology",
  "Begum Rokeya University, Rangpur",
  "Bangladesh University of Textiles",
  "Bangabandhu Sheikh Mujibur Rahman Agricultural University",
  "Bangabandhu Sheikh Mujibur Rahman Science and Technology University, Gopalganj",
  "Bangabandhu Sheikh Mujib Medical University",
  "Rangamati Science and Technology University",
  "Khulna Agricultural University",
  "Barishal University",
  "Islamic Arabic University",
  "Rajshahi Science and Technology University",
  "Bangamata Sheikh Fojilatunnesa Mujib Science and Technology University",
  "Bangabandhu Sheikh Mujibur Rahman Digital University",
  "Bangabandhu Sheikh Mujibur Rahman Maritime University",
  "Chittagong Medical University",
  "Rajshahi Medical University",
  "Khulna Medical University",
  "Sylhet Medical University",
  "Bangladesh Open University",
  "National University, Bangladesh",
  "Bangabandhu Sheikh Mujibur Rahman Aviation and Aerospace University",
  "Bangladesh Army University of Engineering and Technology",
  "Bangladesh Army University of Science and Technology",
  "Bangladesh Army International University of Science and Technology",
  "Netrokona University",
  "Kishoreganj University",
  "Sunamganj Science and Technology University",
  "Lakshmipur Science and Technology University",
  "Naogaon University",
  "Sheikh Hasina University, Netrokona"
 ],
 "private": [
  "Ahsanullah University of Science and Technology (AUST)",
  "American International University-Bangladesh (AIUB)",
  "Asian University of Bangladesh",
  "Atish Dipankar University of Science and Technology",
  "BGC Trust University Bangladesh",
  "BRAC University",
  "Bangladesh Islami University",
  "Bangladesh University",
  "Bangladesh University of Business and Technology (BUBT)",
  "Britannia University",
  "Canadian University of Bangladesh",
  "Central Women's University",
  "Chittagong Independent University",
  "City University",
  "Cox's Bazar International University",
  "Daffodil International University",
  "Dhaka International University",
  "East Delta University",
  "East West University",
  "Eastern University",
  "European University of Bangladesh",
  "Exim Bank Agricultural University Bangladesh",
  "Fareast International University",
  "Feni University",
  "First Capital University of Bangladesh",
  "Gono Bishwabidyalay",
  "Green University of Bangladesh",
  "Hamdard University Bangladesh",
  "Independent University, Bangladesh (IUB)",
  "International Islamic University Chittagong (IIUC)",
  "International University of Business Agriculture and Technology (IUBAT)",
  "Ishakha International University",
  "Khwaja Yunus Ali University",
  "Leading University, Sylhet",
  "Manarat International University",
  "Metropolitan University, Sylhet",
  "North Bengal International University",
  "North East University Bangladesh",
  "North South University",
  "North Western University, Khulna",
  "Northern University Bangladesh",
  "Northern University of Business and Technology Khulna",
  "Notre Dame University Bangladesh",
  "Port City International University",
  "Premier University, Chittagong",
  "Presidency University",
  "Prime University",
  "Primeasia University",
  "Pundra University of Science and Technology",
  "Rabindra Maitree University",
  "Ranada Prasad Shaha University",
  "Royal University of Dhaka",
  "Shanto-Mariam University of Creative Technology",
  "Sonargaon University",
  "Southeast University",
  "Southern University Bangladesh",
  "Stamford University Bangladesh",
  "State University of Bangladesh",
  "Sylhet International University",
  "Tagore University of Creative Technology",
  "United International University (UIU)",
  "University of Asia Pacific",
  "University of Development Alternative (UODA)",
  "University of Information Technology and Sciences (UITS)",
  "University of Liberal Arts Bangladesh (ULAB)",
  "University of Science and Technology Chittagong (USTC)",
  "Uttara University",
  "Varendra University",
  "Victoria University of Bangladesh",
  "World University of Bangladesh",
  "Z. H. Sikder University of Science and Technology"
 ],
 "intl": [
  "Islamic University of Technology (IUT)",
  "Asian University for Women",
  "University of South Asia"
 ]
};

const TEACHERS = [];

/* kind: regular | crash — formats: one (১-টু-১), group (১-টু-৭) */
const COURSES = [];

const TOPICS = {
  bangla: [
    { t: { bn: 'ব্যাকরণ', en: 'Grammar' }, p: { bn: 'সন্ধি, সমাস, কারক-বিভক্তি, বাক্যশুদ্ধি', en: 'Sandhi, samas, karak-bibhokti, sentence correction' } },
    { t: { bn: 'বানান ও বাগ্ধারা', en: 'Spelling & idioms' }, p: { bn: 'প্রমিত বানান, বাগ্ধারা, প্রবাদ-প্রবচন', en: 'Standard spelling, idioms, proverbs' } },
    { t: { bn: 'সাহিত্য', en: 'Literature' }, p: { bn: 'লেখক পরিচিতি, গ্রন্থ ও রচনা', en: 'Authors, books and works' } },
    { t: { bn: 'নমুনা প্রশ্ন সমাধান', en: 'Sample question solving' }, p: { bn: 'আগের বছরের প্রশ্ন ও সময় ধরে অনুশীলন', en: 'Past questions and timed practice' } },
  ],
  english: [
    { t: { bn: 'গ্রামার', en: 'Grammar' }, p: { bn: 'Tense, voice, narration, right form of verbs', en: 'Tense, voice, narration, right form of verbs' } },
    { t: { bn: 'ভোকাবুলারি', en: 'Vocabulary' }, p: { bn: 'Synonyms, antonyms, one-word substitution', en: 'Synonyms, antonyms, one-word substitution' } },
    { t: { bn: 'কম্প্রিহেনশন', en: 'Comprehension' }, p: { bn: 'Reading passages ও প্রশ্নের উত্তর', en: 'Reading passages and answering questions' } },
    { t: { bn: 'অনুবাদ ও রচনা', en: 'Translation & composition' }, p: { bn: 'বাংলা থেকে ইংরেজি ও paragraph writing', en: 'Bangla to English and paragraph writing' } },
  ],
  gk: [
    { t: { bn: 'বাংলাদেশ', en: 'Bangladesh' }, p: { bn: 'ইতিহাস, মুক্তিযুদ্ধ, ভূগোল, সংবিধান', en: 'History, Liberation War, geography, constitution' } },
    { t: { bn: 'বিশ্ব পরিচিতি', en: 'The world' }, p: { bn: 'দেশ, রাজধানী, আন্তর্জাতিক সংস্থা', en: 'Countries, capitals, international organisations' } },
    { t: { bn: 'সাধারণ বিজ্ঞান', en: 'General science' }, p: { bn: 'দৈনন্দিন জীবনের বিজ্ঞান ও আবিষ্কার', en: 'Everyday science and inventions' } },
    { t: { bn: 'চলতি ঘটনা', en: 'Current affairs' }, p: { bn: 'সাম্প্রতিক খবর ও সাপ্তাহিক কুইজ', en: 'Recent news and weekly quizzes' } },
  ],
  math: [
    { t: { bn: 'পাটিগণিত', en: 'Arithmetic' }, p: { bn: 'অনুপাত, শতকরা, লাভ-ক্ষতি, সময় ও কাজ', en: 'Ratio, percentage, profit-loss, time and work' } },
    { t: { bn: 'বীজগণিত', en: 'Algebra' }, p: { bn: 'সূত্র, উৎপাদক, সমীকরণ', en: 'Formulas, factors, equations' } },
    { t: { bn: 'জ্যামিতি ও ত্রিকোণমিতি', en: 'Geometry & trigonometry' }, p: { bn: 'ক্ষেত্রফল, ত্রিভুজ, বৃত্ত, অনুপাত', en: 'Area, triangles, circles, ratios' } },
    { t: { bn: 'মানসাংক ও ট্রিকস', en: 'Mental maths & tricks' }, p: { bn: 'দ্রুত হিসাবের কৌশল', en: 'Techniques for fast calculation' } },
  ],
  combined: [
    { t: { bn: 'বাংলা', en: 'Bangla' }, p: { bn: 'ব্যাকরণ, বানান, সাহিত্য', en: 'Grammar, spelling, literature' } },
    { t: { bn: 'ইংরেজি', en: 'English' }, p: { bn: 'গ্রামার, ভোকাবুলারি, কম্প্রিহেনশন', en: 'Grammar, vocabulary, comprehension' } },
    { t: { bn: 'গণিত', en: 'Mathematics' }, p: { bn: 'পাটিগণিত, বীজগণিত, জ্যামিতি', en: 'Arithmetic, algebra, geometry' } },
    { t: { bn: 'সাধারণ জ্ঞান', en: 'General Knowledge' }, p: { bn: 'বাংলাদেশ, বিশ্ব ও চলতি ঘটনা', en: 'Bangladesh, the world and current affairs' } },
  ],
  crash: [
    { t: { bn: 'সপ্তাহ ১–২: রিভিশন', en: 'Weeks 1–2: Revision' }, p: { bn: 'দ্রুত রিভিশন ক্লাস ও দুর্বল টপিক চিহ্নিত করা', en: 'Fast revision classes and spotting weak topics' } },
    { t: { bn: 'সাপ্তাহিক মডেল টেস্ট', en: 'Weekly model tests' }, p: { bn: 'সপ্তাহে ১–২ দিন, পরীক্ষার মতো সময় ও নিয়মে', en: '1–2 days a week, under real exam timing and rules' } },
    { t: { bn: 'প্রশ্ন ব্যাখ্যা', en: 'Solution review' }, p: { bn: 'টেস্টের পরদিন লাইভ ব্যাখ্যা ও ভুল বিশ্লেষণ', en: 'Live solutions and mistake analysis the next day' } },
    { t: { bn: 'শেষ সপ্তাহ: বুস্ট', en: 'Final week: Boost' }, p: { bn: 'সম্ভাব্য প্রশ্ন, টাইম ম্যানেজমেন্ট ও মানসিক প্রস্তুতি', en: 'Likely questions, time management and mindset' } },
  ],
};

const REVIEWS = [];

const COUPONS = {};

const FAQS = [
  { q: { bn: '১-টু-১ আর গ্রুপ ক্লাসের পার্থক্য কী?', en: 'What is the difference between 1-to-1 and group classes?' },
    a: { bn: '১-টু-১ ক্লাসে একজন টিচার একজন শিক্ষার্থীকে পড়ান। খরচ বেশি, পুরো মনোযোগ পাওয়া যায়। গ্রুপ ক্লাসে একজন টিচার ৭ জনের একটি ব্যাচ পড়ান। খরচ কম, আর ভিন্ন স্কুলের শিক্ষার্থীদের সঙ্গে প্রতিযোগিতা ও সহযোগিতার সুযোগ থাকে।', en: 'In a 1-to-1 class one teacher teaches one student: higher cost, full attention. In a group class one teacher teaches a batch of 7: lower cost, with healthy competition and collaboration among students from different schools.' } },
  { q: { bn: 'ক্লাস কোথায় হয়?', en: 'Where do classes take place?' },
    a: { bn: 'সব ক্লাস লাইভ ও অনলাইনে হয়। শুরুতে ক্লাস Zoom-এ নেওয়া হবে। ছাত্র.com টিম ক্লাসের সময়সূচি ঠিক করে দেয় এবং ড্যাশবোর্ডে জয়েন লিংক দেখা যায়।', en: 'All classes are live and online, on Zoom at launch. The Chaatro.com team schedules each class and the join link appears on your dashboard.' } },
  { q: { bn: 'ক্লাস মিস করলে কী হবে?', en: 'What if I miss a class?' },
    a: { bn: 'প্রতিটি ক্লাসের রেকর্ডিং ক্লাসের পর ২৪ ঘণ্টা পর্যন্ত দেখা যায়।', en: 'The recording of each class is available for 24 hours after the class.' } },
  { q: { bn: 'দূরের এলাকা থেকে পড়া যাবে?', en: 'Can I study from a remote area?' },
    a: { bn: 'হ্যাঁ। জেলা, উপজেলা, থানা বা ইউনিয়ন, যেখান থেকেই হোক, ইন্টারনেট থাকলে ক্লাস করা যায়। মোবাইলেও সুন্দরভাবে চলে।', en: 'Yes. From district, upazila, thana or union, anywhere with an internet connection. It works well on a phone too.' } },
  { q: { bn: 'পেমেন্ট কীভাবে করব?', en: 'How do I pay?' },
    a: { bn: 'একবারে পুরো কোর্সের টাকা অথবা মাসিক কিস্তিতে দেওয়া যায়। বিকাশ, SSLCommerz ও ক্যাশের মতো চ্যানেল থাকবে। অ্যাডমিন চ্যানেলগুলো চালু বা বন্ধ করতে পারেন।', en: 'Pay the full course at once or in monthly instalments. Channels such as bKash, SSLCommerz and cash will be available, and admins can switch each on or off.' } },
  { q: { bn: 'আমি কীভাবে টিচার হতে পারি?', en: 'How can I become a teacher?' },
    a: { bn: '“বিকাম এ টিচার” পেজে ফর্ম পূরণ করে CV ও প্রয়োজনীয় ডকুমেন্ট আপলোড করুন। আমাদের টিম যাচাই করে অনুমোদন দিলে আপনি কোর্স চালু করতে পারবেন।', en: 'Fill in the form on the Become a Teacher page and upload your CV and documents. Once our team verifies and approves you, you can launch courses.' } },
];

/* ---------- ক্লাসের ধরন (কোর্স টাইপ): অ্যাডমিন সিট-লিমিট বদলাতে ও নতুন ধরন বানাতে পারে ---------- */
const CTYPES = [
  { id: 'one', bn: '১-টু-১', en: '1-to-1', seats: 1, on: true, base: true },
  { id: 'group', bn: 'গ্রুপ অফ ৭', en: 'Group of 7', seats: 7, on: true, base: true },
];
const ctype = id => CTYPES.find(x => x.id === id) || CTYPES[1];
const ctSeats = id => ctype(id).seats;
const progOn = id => { const p = PROGRAMS.find(x => x.id === id); return !p || !p.hidden; };
const liveCourses = () => COURSES.filter(c => progOn(c.program));

/* ---------- হিসাব / helpers ---------- */
const round50 = x => Math.round(x / 50) * 50;

function pricingFor(c) {
  const mk = (mult, off, seats) => {
    const fullA = round50(c.base * mult), fullD = round50(c.base * mult * off);
    return { fullA, fullD, months: c.months, perA: round50(fullA * 1.1 / c.months), perD: round50(fullD * 1.1 / c.months), seats };
  };
  const r = { group: mk(1, 0.88, ctSeats('group')), one: mk(2.8, 0.9, 1) };
  CTYPES.forEach(x => { if (!r[x.id]) r[x.id] = mk(1, 0.88, x.seats); });
  if (c.plans) Object.keys(c.plans).forEach(f => { if (r[f] && c.plans[f] && c.plans[f].length) r[f] = fromPlans(c, c.plans[f], r[f].seats); });
  return r;
}
/* পেমেন্ট প্ল্যান: m = কত মাস পর পর (০ = একবারে), actual/disc = প্রতিবারের দাম, first = প্রথমবারের আলাদা দাম (ঐচ্ছিক) */
function planTotal(c, o) {
  if (o.m === 0) return { a: o.actual, d: o.disc };
  const cy = Math.max(1, Math.ceil(c.months / o.m));
  return { a: cy * o.actual, d: o.first != null ? o.first + (cy - 1) * o.disc : cy * o.disc };
}
function fromPlans(c, opts, seats) {
  const tot = opts.map(o => ({ o, t: planTotal(c, o) }));
  const one = tot.find(x => x.o.m === 0) || tot.slice().sort((a, b) => a.t.d - b.t.d)[0];
  const per = tot.filter(x => x.o.m > 0).sort((a, b) => a.o.m - b.o.m)[0];
  return { fullA: one.t.a, fullD: one.t.d, months: c.months, perA: per ? per.o.actual : round50(one.t.a / c.months), perD: per ? per.o.disc : round50(one.t.d / c.months), seats };
}
/* ব্লগ — নমুনা লেখা (ছাত্র.com টিম) */
const BLOG = [
  { id: 'b1', date: '2026-11-18', color: '#8C52FF', min: 4, tag: { bn: 'ক্যাডেট ভর্তি', en: 'Cadet admission' },
    title: { bn: 'ক্যাডেট কলেজ ভর্তির প্রস্তুতি শুরু করবেন কীভাবে', en: 'How to start preparing for cadet college admission' },
    ex: { bn: 'চার বিষয় একসঙ্গে সামলানোর একটি সহজ সাপ্তাহিক রুটিন।', en: 'A simple weekly routine for handling four subjects together.' },
    body: [
      { bn: 'শুরুতেই চারটি বিষয় (বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান) একসঙ্গে ভারী মনে হতে পারে। সমাধান হলো প্রতিদিনের সময়কে ছোট ছোট ভাগে ভাগ করা: একদিনে এক বিষয়ে গভীর পড়া, আর বাকি তিন বিষয়ে ১৫–২০ মিনিটের হালকা অনুশীলন।', en: 'Four subjects (Bangla, English, Math and General Knowledge) can feel heavy at the start. The fix is to split each day into small blocks: one subject in depth, and 15–20 minutes of light practice for the other three.' },
      { bn: 'গণিত আর ইংরেজি দৈনিক অভ্যাস দাবি করে। প্রতিদিন কয়েকটি অঙ্ক আর কিছু নতুন শব্দ শেখার নিয়ম করলে কয়েক সপ্তাহেই পার্থক্য বোঝা যায়। সাধারণ জ্ঞানের জন্য সপ্তাহে একবার ছোট কুইজ ভালো কাজ করে।', en: 'Math and English reward daily habit. A few sums and a few new words every day make a visible difference within weeks. For General Knowledge, a short weekly quiz works well.' },
      { bn: 'প্রতি সপ্তাহের শেষে একটি সময় ধরে পরীক্ষা দিন। কোথায় আটকে যাচ্ছেন, সেটাই পরের সপ্তাহের পড়ার তালিকা ঠিক করে দেয়।', en: 'At the end of each week, sit one timed test. Where you get stuck decides next week’s study list.' },
    ] },
  { id: 'b2', date: '2026-11-15', color: '#0E0B16', min: 4, tag: { bn: 'ক্র্যাশ কোর্স', en: 'Crash course' },
    title: { bn: 'পরীক্ষার আগের কয়েক সপ্তাহে মডেল টেস্ট কেন কাজে লাগে', en: 'Why model tests help in the last weeks before the exam' },
    ex: { bn: 'পড়া শেষ করা আর পরীক্ষা দিতে পারা এক জিনিস নয়।', en: 'Finishing the syllabus and performing in an exam are not the same thing.' },
    body: [
      { bn: 'অনেকে সিলেবাস শেষ করেও পরীক্ষার হলে সময়ের চাপে ভুল করে। মডেল টেস্ট সেই চাপের অভ্যাস তৈরি করে, কারণ এতে সময় ও নিয়ম পরীক্ষার মতোই থাকে।', en: 'Many students finish the syllabus yet slip under time pressure in the hall. Model tests build that habit because time and rules mirror the real exam.' },
      { bn: 'টেস্টের পরের ব্যাখ্যা ক্লাসই আসল কাজ। কোন প্রশ্নে সময় গেল, কোনটা অনুমানে হলো, কোনটা ভুল বোঝা থেকে হলো, এটা আলাদা করে লিখে রাখুন।', en: 'The review class after the test is the real work. Note which questions ate time, which were guesses and which came from misunderstanding.' },
      { bn: 'সপ্তাহে একটি বা দুটি টেস্টই যথেষ্ট, যদি প্রতিটির পর ভুলগুলো সত্যিই ঠিক করা হয়।', en: 'One or two tests a week are enough, provided you actually fix the mistakes after each.' },
    ] },
  { id: 'b3', date: '2026-11-12', color: '#6B34E0', min: 3, tag: { bn: 'ক্লাসের ধরন', en: 'Class types' },
    title: { bn: '১-টু-১ নাকি গ্রুপ ক্লাস: কোনটা আপনার জন্য', en: '1-to-1 or group class: which is right for you' },
    ex: { bn: 'খরচ, মনোযোগ আর প্রতিযোগিতা, তিনটি দিক থেকে তুলনা।', en: 'A comparison on three counts: cost, attention and competition.' },
    body: [
      { bn: '১-টু-১ ক্লাসে পুরো সময় শুধু আপনার প্রশ্ন ও গতির ওপর চলে। যার নির্দিষ্ট কোনো বিষয়ে দুর্বলতা আছে, তার জন্য এটি ভালো। খরচ তুলনামূলক বেশি।', en: 'A 1-to-1 class runs entirely on your questions and pace. It suits someone with a specific weak subject. The cost is higher.' },
      { bn: 'গ্রুপ ক্লাসে সাতজনের ব্যাচ। খরচ কম, আর ভিন্ন স্কুলের সহপাঠীদের সঙ্গে সুস্থ প্রতিযোগিতা তৈরি হয়। যারা অন্যদের দেখে অনুপ্রেরণা পান, তাদের জন্য ভালো।', en: 'A group class has seven students. It costs less and brings healthy competition with classmates from other schools. It suits students who are motivated by seeing others.' },
      { bn: 'অনেকে বেশি দুর্বল বিষয়ে ১-টু-১, বাকি বিষয়ে গ্রুপ বেছে নেন। দুটি মিলিয়ে নেওয়াও সম্ভব।', en: 'Many pick 1-to-1 for their weakest subject and group for the rest. Mixing both is possible.' },
    ] },
  { id: 'b4', date: '2026-11-09', color: '#4A2BA8', min: 3, tag: { bn: 'অনলাইন শেখা', en: 'Learning online' },
    title: { bn: 'অনলাইন ক্লাসে মনোযোগ ধরে রাখার ছয়টি উপায়', en: 'Six ways to stay focused in online classes' },
    ex: { bn: 'ফোনে ক্লাস করলেও মনোযোগ ধরে রাখা যায়, কয়েকটি ছোট অভ্যাসে।', en: 'You can stay focused even on a phone, with a few small habits.' },
    body: [
      { bn: 'ক্লাসের আগে নোটখাতা, কলম আর পানি হাতের কাছে রাখুন। ফোনের অন্য নোটিফিকেশন বন্ধ করে দিন।', en: 'Keep your notebook, pen and water ready before class. Turn off other phone notifications.' },
      { bn: 'টিচার যা বোঝান, নিজের ভাষায় দুই লাইনে লিখে নিন। প্রশ্ন থাকলে সঙ্গে সঙ্গে চ্যাটে লিখুন, জমিয়ে রাখবেন না।', en: 'Write what the teacher explains in two lines of your own words. If you have a question, type it in the chat right away.' },
      { bn: 'ক্লাস মিস হলে রেকর্ডিং ২৪ ঘণ্টা পর্যন্ত দেখা যায়, তাই সেদিনই দেখে নিন।', en: 'If you miss a class, the recording stays for 24 hours, so watch it the same day.' },
    ] },
  { id: 'b5', date: '2026-11-06', color: '#17102B', min: 3, tag: { bn: 'পড়ার কৌশল', en: 'Study tips' },
    title: { bn: 'ভুল থেকে শেখার সহজ নিয়ম', en: 'A simple method for learning from mistakes' },
    ex: { bn: 'একটি ভুলের খাতা কীভাবে নম্বর বাড়ায়।', en: 'How a mistake notebook raises your score.' },
    body: [
      { bn: 'প্রতিটি ভুল প্রশ্ন একটি খাতায় তুলুন, সঙ্গে সঠিক উত্তর আর ভুলের কারণ: জানতাম না, তাড়াহুড়ো, নাকি ভুল বুঝেছি।', en: 'Copy every wrong question into a notebook with the right answer and the reason: did not know, rushed, or misunderstood.' },
      { bn: 'সপ্তাহে একবার শুধু এই খাতাটি দেখুন। একই ধরনের ভুল বারবার হলে সেই টপিক টিচারকে জানান।', en: 'Once a week, review just this notebook. If the same kind of mistake repeats, tell your teacher about that topic.' },
    ] },
];

/* প্রতিটি কোর্স একটি মাত্র ক্লাস-ধরনের: ১-টু-১ ও গ্রুপ আলাদা কোর্স */
(function () {
  const out = [], sfx = { one: [' · ১-টু-১', ' · 1-to-1'], group: [' · গ্রুপ অফ ৭', ' · Group of 7'] };
  const tag = (c, f) => { c.title = { bn: c.title.bn + sfx[f][0], en: c.title.en + sfx[f][1] }; return c; };
  COURSES.forEach(c => {
    const fs = c.formats.slice();
    fs.forEach(f => {
      const n = Object.assign({}, c, { formats: [f] });
      if (c.plans && c.plans[f]) n.plans = { [f]: c.plans[f] }; else delete n.plans;
      if (f === 'one') { n.id = c.id + '-1on1'; n.seats = 1; n.featured = false; n.enrolled = Math.max(8, Math.round(c.enrolled * 0.2)); n.reviews = Math.max(3, Math.round(c.reviews * 0.25)); n.days = c.days.slice(0, Math.max(2, c.days.length - 1)); }
      out.push(tag(n, f));
    });
  });
  COURSES.length = 0; out.forEach(c => COURSES.push(c));
})();

/* বান্ডেল কোর্স: অ্যাডমিন একাধিক কোর্স বেছে ছাড়ে একসাথে বিক্রি করে */
const BUNDLES = [];
const bundleCourses = b => b.courses.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
function bundleCalc(b) {
  const cs = bundleCourses(b), total = cs.reduce((s, c) => s + pricingFor(c)[c.formats[0]].fullD, 0), price = round50(total * (100 - b.disc) / 100);
  return { cs, total, price, save: total - price };
}

/* ইউনিক আইডি: টিচার ৪ অঙ্ক (1001–), কোর্স ৪ অঙ্ক (3001–), স্টুডেন্ট ৫ অঙ্ক (20001–); ফোন নম্বরও সাজানো */
TEACHERS.forEach((t, i) => { t.pid = 1001 + i; t.phone = '0171100' + t.pid; });
COURSES.forEach((c, i) => { c.pid = 3001 + i; });
const nextCoursePid = () => Math.max(3000, ...COURSES.map(c => c.pid || 0)) + 1;

/* ডামি ডেটা সবসময় ইংরেজিতে: নমুনা টিচার, কোর্স, রিভিউ, ব্লগ ও বান্ডেলের বাংলা ভাগ ইংরেজি দিয়ে বদলানো হয়।
   (প্রোগ্রাম, বিষয় ও দিনের নামের মতো ক্যাটালগ বাংলা/ইংরেজি দুটোই থাকে।) */
(function enDummy(roots) {
  const walk = o => {
    if (!o || typeof o !== 'object') return;
    if (typeof o.bn === 'string' && typeof o.en === 'string') o.bn = o.en;
    Object.keys(o).forEach(k => walk(o[k]));
  };
  roots.forEach(walk);
})([TEACHERS, COURSES, TOPICS, REVIEWS, BLOG, BUNDLES]);
