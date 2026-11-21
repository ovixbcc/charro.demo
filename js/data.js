/* ছাত্র.com — নমুনা ডেটা (ডেমো)। পরে অ্যাডমিন প্যানেল/ডেটাবেজ থেকে আসবে।
   Sample data. Later this will come from the admin panel / database. */

const PROGRAMS = [
  { id: 'cadet', code: 'CC', bn: 'ক্যাডেট কলেজ ভর্তি', en: 'Cadet College Admission',
    s: { bn: 'ক্যাডেট', en: 'Cadet' },
    d: { bn: 'সপ্তম শ্রেণিতে ভর্তির প্রস্তুতি: বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান।', en: 'Prepare for Class 7 entry: Bangla, English, Math and General Knowledge.' } },
  { id: 'du-ka', code: 'ক', bn: 'ঢাকা বিশ্ববিদ্যালয় — ক ইউনিট', en: 'Dhaka University — Unit Ka',
    s: { bn: 'ঢাবি ক', en: 'DU Ka' },
    d: { bn: 'ক ইউনিটের জন্য আলাদা ক্র্যাশ কোর্স, সপ্তাহে ১–২ দিন মডেল টেস্ট।', en: 'A separate crash course for Unit Ka with 1–2 model tests a week.' } },
  { id: 'du-kha', code: 'খ', bn: 'ঢাকা বিশ্ববিদ্যালয় — খ ইউনিট', en: 'Dhaka University — Unit Kha',
    s: { bn: 'ঢাবি খ', en: 'DU Kha' },
    d: { bn: 'খ ইউনিটের জন্য আলাদা ক্র্যাশ কোর্স, সপ্তাহে ১–২ দিন মডেল টেস্ট।', en: 'A separate crash course for Unit Kha with 1–2 model tests a week.' } },
  { id: 'du-ga', code: 'গ', bn: 'ঢাকা বিশ্ববিদ্যালয় — গ ইউনিট', en: 'Dhaka University — Unit Ga',
    s: { bn: 'ঢাবি গ', en: 'DU Ga' },
    d: { bn: 'গ ইউনিটের জন্য আলাদা ক্র্যাশ কোর্স, সপ্তাহে ১–২ দিন মডেল টেস্ট।', en: 'A separate crash course for Unit Ga with 1–2 model tests a week.' } },
  { id: 'du-gha', code: 'ঘ', bn: 'ঢাকা বিশ্ববিদ্যালয় — ঘ ইউনিট', en: 'Dhaka University — Unit Gha',
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
  { id: 'bangla', code: 'বা', bn: 'বাংলা', en: 'Bangla' },
  { id: 'english', code: 'En', bn: 'ইংরেজি', en: 'English' },
  { id: 'gk', code: 'GK', bn: 'সাধারণ জ্ঞান', en: 'General Knowledge' },
  { id: 'math', code: 'গ', bn: 'গণিত', en: 'Mathematics' },
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

const TEACHERS = [
  { id: 't01', ik: 'buet', color: '#8C52FF', n: { bn: 'তানভীর আহমেদ', en: 'Tanvir Ahmed' },
    inst: { bn: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)', en: 'BUET' }, feat: { bn: 'বুয়েট', en: 'BUET' },
    dept: { bn: 'কম্পিউটার সায়েন্স ও ইঞ্জিনিয়ারিং', en: 'Computer Science & Engineering' }, yr: { bn: '৪র্থ বর্ষ', en: '4th year' },
    exp: 3, stu: 412, rating: 4.9, subs: ['math'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'ঢাকা বোর্ড, জিপিএ ৫.০০', en: 'Dhaka Board, GPA 5.00' }, hsc: { bn: 'নটর ডেম কলেজ, জিপিএ ৫.০০', en: 'Notre Dame College, GPA 5.00' },
    certs: [{ bn: 'জাতীয় গণিত অলিম্পিয়াড — বিভাগীয় পর্যায়ে সেরা দশ', en: 'National Math Olympiad — top ten at divisional level' }, { bn: 'বুয়েট ভর্তি পরীক্ষায় মেধাতালিকায় স্থান', en: 'Merit list place, BUET admission test' }],
    co: [{ bn: 'বুয়েট ম্যাথ ক্লাব', en: 'BUET Math Club' }, { bn: 'ডিবেটিং সোসাইটি', en: 'Debating Society' }],
    bio: { bn: 'কঠিন গণিতকে ছোট ছোট ধাপে ভেঙে বোঝাতে ভালোবাসি। মানসাংক ও শর্টকাট থেকে শুরু করে বুয়েট স্তরের সমস্যা পর্যন্ত একই ধারায় শেখাই।', en: 'I like to break hard maths into small steps, from mental arithmetic and shortcuts up to BUET-level problems.' } },
  { id: 't02', ik: 'du', color: '#0E0B16', n: { bn: 'ফারহানা ইসলাম', en: 'Farhana Islam' },
    inst: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' }, feat: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' },
    dept: { bn: 'বাংলা বিভাগ', en: 'Department of Bangla' }, yr: { bn: 'মাস্টার্স', en: 'Masters' },
    exp: 4, stu: 365, rating: 4.8, subs: ['bangla'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'রাজশাহী বোর্ড, জিপিএ ৫.০০', en: 'Rajshahi Board, GPA 5.00' }, hsc: { bn: 'রাজশাহী কলেজ, জিপিএ ৫.০০', en: 'Rajshahi College, GPA 5.00' },
    certs: [{ bn: 'আন্তঃবিশ্ববিদ্যালয় বাংলা বিতর্ক প্রতিযোগিতায় চ্যাম্পিয়ন দলের সদস্য', en: 'Member of champion team, inter-university Bangla debate' }],
    co: [{ bn: 'আবৃত্তি সংগঠন', en: 'Recitation group' }, { bn: 'বিশ্ববিদ্যালয় পত্রিকার সম্পাদনা দল', en: 'University magazine editorial team' }],
    bio: { bn: 'ব্যাকরণ মুখস্থ নয়, নিয়ম বুঝিয়ে শেখাই। বানান, বাগ্ধারা আর সাহিত্য অংশ গল্পের মতো করে সাজানো।', en: 'I teach grammar through rules, not rote. Spelling, idioms and literature are taught like stories.' } },
  { id: 't03', ik: 'du', color: '#6B34E0', n: { bn: 'সাদমান সাকিব', en: 'Sadman Sakib' },
    inst: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' }, feat: { bn: 'IBA, ঢাকা বিশ্ববিদ্যালয়', en: 'IBA, University of Dhaka' },
    dept: { bn: 'ব্যবসায় প্রশাসন ইনস্টিটিউট (IBA)', en: 'Institute of Business Administration (IBA)' }, yr: { bn: '৩য় বর্ষ', en: '3rd year' },
    exp: 2, stu: 198, rating: 4.7, subs: ['english', 'gk'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'ঢাকা বোর্ড, জিপিএ ৫.০০', en: 'Dhaka Board, GPA 5.00' }, hsc: { bn: 'ঢাকা কলেজ, জিপিএ ৫.০০', en: 'Dhaka College, GPA 5.00' },
    certs: [{ bn: 'IELTS ব্যান্ড ৮.০', en: 'IELTS band 8.0' }],
    co: [{ bn: 'মডেল ইউনাইটেড নেশনস (MUN) ক্লাব', en: 'Model United Nations (MUN) club' }],
    bio: { bn: 'ভোকাবুলারি আর সাম্প্রতিক বিষয় নিয়ে প্রতিদিনের ছোট অভ্যাস তৈরি করাই আমার শেখানোর পদ্ধতি।', en: 'My method is a small daily habit around vocabulary and current affairs.' } },
  { id: 't04', ik: 'dmc', color: '#B794FF', n: { bn: 'নুসরাত জাহান', en: 'Nusrat Jahan' },
    inst: { bn: 'ঢাকা মেডিকেল কলেজ', en: 'Dhaka Medical College' }, feat: { bn: 'ঢাকা মেডিকেল কলেজ', en: 'Dhaka Medical College' },
    dept: { bn: 'এমবিবিএস', en: 'MBBS' }, yr: { bn: '৩য় বর্ষ', en: '3rd year' },
    exp: 3, stu: 287, rating: 4.8, subs: ['gk'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'কুমিল্লা বোর্ড, জিপিএ ৫.০০', en: 'Cumilla Board, GPA 5.00' }, hsc: { bn: 'ভিকারুননিসা নূন স্কুল এন্ড কলেজ, জিপিএ ৫.০০', en: 'Viqarunnisa Noon School & College, GPA 5.00' },
    certs: [{ bn: 'জাতীয় বিজ্ঞান ও প্রযুক্তি সপ্তাহ — পুরস্কারপ্রাপ্ত', en: 'National Science & Technology Week — award winner' }],
    co: [{ bn: 'রক্তদান সংগঠন', en: 'Blood donation group' }],
    bio: { bn: 'বিজ্ঞান ও সাধারণ জ্ঞানকে দৈনন্দিন জীবনের উদাহরণ দিয়ে শেখাই, যাতে মনে থাকে।', en: 'I teach science and general knowledge with everyday examples, so it sticks.' } },
  { id: 't05', ik: 'buet', color: '#0E0B16', n: { bn: 'রাকিবুল হাসান', en: 'Rakibul Hasan' },
    inst: { bn: 'বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয় (বুয়েট)', en: 'BUET' }, feat: { bn: 'বুয়েট', en: 'BUET' },
    dept: { bn: 'ইলেকট্রিক্যাল ও ইলেকট্রনিক ইঞ্জিনিয়ারিং', en: 'Electrical & Electronic Engineering' }, yr: { bn: '৩য় বর্ষ', en: '3rd year' },
    exp: 3, stu: 336, rating: 4.9, subs: ['combined', 'math'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'চট্টগ্রাম বোর্ড, জিপিএ ৫.০০', en: 'Chattogram Board, GPA 5.00' }, hsc: { bn: 'চট্টগ্রাম কলেজ, জিপিএ ৫.০০', en: 'Chattogram College, GPA 5.00' },
    certs: [{ bn: 'জাতীয় পদার্থবিজ্ঞান অলিম্পিয়াডে জাতীয় পর্যায়ে অংশগ্রহণ', en: 'National Physics Olympiad — national round' }],
    co: [{ bn: 'রোবোটিক্স দল', en: 'Robotics team' }],
    bio: { bn: 'বুয়েট ভর্তি পরীক্ষার প্রশ্নের ধরন বিশ্লেষণ করে প্রতিটি মডেল টেস্ট সাজাই।', en: 'I design every model test by analysing the pattern of BUET admission questions.' } },
  { id: 't06', ik: 'ju', color: '#8C52FF', n: { bn: 'মেহজাবিন রহমান', en: 'Mehjabin Rahman' },
    inst: { bn: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', en: 'Jahangirnagar University' }, feat: { bn: 'জাহাঙ্গীরনগর বিশ্ববিদ্যালয়', en: 'Jahangirnagar University' },
    dept: { bn: 'ইংরেজি বিভাগ', en: 'Department of English' }, yr: { bn: '৪র্থ বর্ষ', en: '4th year' },
    exp: 3, stu: 244, rating: 4.7, subs: ['english'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'ময়মনসিংহ বোর্ড, জিপিএ ৫.০০', en: 'Mymensingh Board, GPA 5.00' }, hsc: { bn: 'ময়মনসিংহ গার্লস ক্যাডেট কলেজ, জিপিএ ৫.০০', en: 'Mymensingh Girls Cadet College, GPA 5.00' },
    certs: [{ bn: 'ইংলিশ ল্যাঙ্গুয়েজ টিচিং ওয়ার্কশপ সনদ', en: 'English language teaching workshop certificate' }],
    co: [{ bn: 'ইংলিশ ড্রামা ক্লাব', en: 'English Drama Club' }],
    bio: { bn: 'নিজে ক্যাডেট কলেজে পড়েছি, তাই ভর্তি পরীক্ষার ইংরেজির ধরন ভালো জানি। গ্রামার আর কম্প্রিহেনশন নিয়ে ছোট ছোট প্র্যাকটিস করাই।', en: 'I studied at a cadet college myself, so I know the admission English paper well. We practise grammar and comprehension in small sets.' } },
  { id: 't07', ik: 'bup', color: '#6B34E0', n: { bn: 'আরিফুল ইসলাম', en: 'Ariful Islam' },
    inst: { bn: 'বাংলাদেশ ইউনিভার্সিটি অফ প্রফেশনালস', en: 'Bangladesh University of Professionals' }, feat: { bn: 'BUP', en: 'BUP' },
    dept: { bn: 'আন্তর্জাতিক সম্পর্ক', en: 'International Relations' }, yr: { bn: '৩য় বর্ষ', en: '3rd year' },
    exp: 2, stu: 221, rating: 4.8, subs: ['combined', 'gk'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'কুমিল্লা বোর্ড, জিপিএ ৫.০০', en: 'Cumilla Board, GPA 5.00' }, hsc: { bn: 'কুমিল্লা ভিক্টোরিয়া সরকারি কলেজ, জিপিএ ৫.০০', en: 'Cumilla Victoria Govt. College, GPA 5.00' },
    certs: [{ bn: 'BUP ভর্তি পরীক্ষায় মেধাতালিকায় স্থান', en: 'Merit list place, BUP admission test' }],
    co: [{ bn: 'রোভার স্কাউট', en: 'Rover Scouts' }, { bn: 'বিতর্ক ক্লাব', en: 'Debate club' }],
    bio: { bn: 'ক্যাডেট ও BUP ভর্তির জন্য ধাপে ধাপে প্রস্তুতির পরিকল্পনা তৈরি করে দিই, সঙ্গে নিয়মিত মডেল টেস্ট।', en: 'I give a step-by-step preparation plan for cadet and BUP admission, with regular model tests.' } },
  { id: 't08', ik: 'du', color: '#B794FF', n: { bn: 'সুমাইয়া আক্তার', en: 'Sumaiya Akter' },
    inst: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' }, feat: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' },
    dept: { bn: 'পদার্থবিজ্ঞান বিভাগ', en: 'Department of Physics' }, yr: { bn: '৪র্থ বর্ষ', en: '4th year' },
    exp: 4, stu: 390, rating: 4.9, subs: ['combined'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'বরিশাল বোর্ড, জিপিএ ৫.০০', en: 'Barishal Board, GPA 5.00' }, hsc: { bn: 'বরিশাল সরকারি ব্রজমোহন কলেজ, জিপিএ ৫.০০', en: 'Barishal Govt. Brojomohun College, GPA 5.00' },
    certs: [{ bn: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় মেধাতালিকায় স্থান', en: 'Merit list place, DU admission test' }],
    co: [{ bn: 'বিজ্ঞান ক্লাব', en: 'Science club' }],
    bio: { bn: 'ক ইউনিটের সিলেবাস ধরে সাপ্তাহিক মডেল টেস্ট আর প্রশ্ন ব্যাখ্যা ক্লাস করাই।', en: 'I run weekly model tests and solution-review classes on the Unit Ka syllabus.' } },
  { id: 't09', ik: 'du', color: '#8C52FF', n: { bn: 'তাহমিদ হোসেন', en: 'Tahmid Hossain' },
    inst: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' }, feat: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' },
    dept: { bn: 'ফাইন্যান্স বিভাগ', en: 'Department of Finance' }, yr: { bn: '৩য় বর্ষ', en: '3rd year' },
    exp: 2, stu: 176, rating: 4.7, subs: ['combined'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'সিলেট বোর্ড, জিপিএ ৫.০০', en: 'Sylhet Board, GPA 5.00' }, hsc: { bn: 'এম সি কলেজ, সিলেট, জিপিএ ৫.০০', en: 'M C College, Sylhet, GPA 5.00' },
    certs: [{ bn: 'বিজনেস কেস কম্পিটিশনে রানার-আপ', en: 'Runner-up, business case competition' }],
    co: [{ bn: 'বিজনেস ক্লাব', en: 'Business club' }],
    bio: { bn: 'গ ইউনিটের হিসাববিজ্ঞান ও ব্যবসায় পরিচিতির কঠিন অংশগুলো উদাহরণ দিয়ে সহজ করি।', en: 'I make the hard parts of Unit Ga accounting and business studies easy with worked examples.' } },
  { id: 't10', ik: 'du', color: '#0E0B16', n: { bn: 'ইশরাত জাহান', en: 'Ishrat Jahan' },
    inst: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' }, feat: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' },
    dept: { bn: 'সমাজবিজ্ঞান বিভাগ', en: 'Department of Sociology' }, yr: { bn: '৪র্থ বর্ষ', en: '4th year' },
    exp: 3, stu: 203, rating: 4.8, subs: ['combined'], badges: { id: true, pay: true, doc: true },
    ssc: { bn: 'যশোর বোর্ড, জিপিএ ৫.০০', en: 'Jashore Board, GPA 5.00' }, hsc: { bn: 'যশোর সরকারি মহিলা কলেজ, জিপিএ ৫.০০', en: 'Jashore Govt. Womens College, GPA 5.00' },
    certs: [{ bn: 'ঢাকা বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় মেধাতালিকায় স্থান', en: 'Merit list place, DU admission test' }],
    co: [{ bn: 'সাংস্কৃতিক সংগঠন', en: 'Cultural organisation' }],
    bio: { bn: 'খ ইউনিটের বিষয়ভিত্তিক নোট আর টপিকভিত্তিক মডেল টেস্ট দিয়ে প্রস্তুতি গোছানো আমার কাজ।', en: 'I organise Unit Kha preparation with subject notes and topic-wise model tests.' } },
  { id: 't11', ik: 'du', color: '#6B34E0', n: { bn: 'নাফিস ইকবাল', en: 'Nafis Iqbal' },
    inst: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' }, feat: { bn: 'ঢাকা বিশ্ববিদ্যালয়', en: 'University of Dhaka' },
    dept: { bn: 'অর্থনীতি বিভাগ', en: 'Department of Economics' }, yr: { bn: '৪র্থ বর্ষ', en: '4th year' },
    exp: 2, stu: 142, rating: 4.6, subs: ['combined'], badges: { id: true, pay: true, doc: false },
    ssc: { bn: 'রংপুর বোর্ড, জিপিএ ৫.০০', en: 'Rangpur Board, GPA 5.00' }, hsc: { bn: 'কারমাইকেল কলেজ, রংপুর, জিপিএ ৫.০০', en: 'Carmichael College, Rangpur, GPA 5.00' },
    certs: [{ bn: 'জাতীয় অর্থনীতি অলিম্পিয়াডে অংশগ্রহণ', en: 'National Economics Olympiad participant' }],
    co: [{ bn: 'অর্থনীতি ক্লাব', en: 'Economics club' }],
    bio: { bn: 'ঘ ইউনিটের জন্য সময় ধরে মডেল টেস্ট আর ভুল বিশ্লেষণে জোর দিই।', en: 'For Unit Gha, I focus on timed model tests and mistake analysis.' } },
];

/* kind: regular | crash — formats: one (১-টু-১), group (১-টু-৭) */
const COURSES = [
  { id: 'c01', program: 'cadet', subject: 'combined', kind: 'regular', teacher: 't07', base: 7200, months: 6, cpw: 3, weeks: 24, start: '2026-12-05', seats: 3, formats: ['one', 'group'], rating: 4.8, reviews: 96, enrolled: 184, featured: true,
    days: ['sat', 'mon', 'wed'], time: { bn: 'রাত ৮:৩০', en: '8:30 PM' },
    title: { bn: 'ক্যাডেট কলেজ ভর্তি — কম্বাইন্ড (৪ বিষয়)', en: 'Cadet College Admission — Combined (4 subjects)' },
    short: { bn: 'বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান, চারটি বিষয় একসঙ্গে, সাপ্তাহিক পরীক্ষাসহ।', en: 'Bangla, English, Math and General Knowledge together, with weekly tests.' } },
  { id: 'c02', program: 'cadet', subject: 'bangla', kind: 'regular', teacher: 't02', base: 2400, months: 3, cpw: 3, weeks: 12, start: '2026-12-06', seats: 5, formats: ['one', 'group'], rating: 4.8, reviews: 74, enrolled: 128, featured: false,
    days: ['sun', 'tue', 'thu'], time: { bn: 'সন্ধ্যা ৭:০০', en: '7:00 PM' },
    title: { bn: 'ক্যাডেট ভর্তি — বাংলা', en: 'Cadet Admission — Bangla' },
    short: { bn: 'ব্যাকরণ, বানান, বাগ্ধারা ও সাহিত্য, নিয়ম বুঝিয়ে।', en: 'Grammar, spelling, idioms and literature, taught through the rules.' } },
  { id: 'c03', program: 'cadet', subject: 'english', kind: 'regular', teacher: 't06', base: 2400, months: 3, cpw: 3, weeks: 12, start: '2026-12-06', seats: 2, formats: ['one', 'group'], rating: 4.7, reviews: 58, enrolled: 112, featured: false,
    days: ['sun', 'tue', 'thu'], time: { bn: 'রাত ৮:০০', en: '8:00 PM' },
    title: { bn: 'ক্যাডেট ভর্তি — ইংরেজি', en: 'Cadet Admission — English' },
    short: { bn: 'গ্রামার, ভোকাবুলারি, কম্প্রিহেনশন ও অনুবাদ।', en: 'Grammar, vocabulary, comprehension and translation.' } },
  { id: 'c04', program: 'cadet', subject: 'math', kind: 'regular', teacher: 't01', base: 2800, months: 3, cpw: 3, weeks: 12, start: '2026-12-07', seats: 4, formats: ['one', 'group'], rating: 4.9, reviews: 102, enrolled: 156, featured: true,
    days: ['sat', 'mon', 'wed'], time: { bn: 'সন্ধ্যা ৬:৩০', en: '6:30 PM' },
    title: { bn: 'ক্যাডেট ভর্তি — গণিত', en: 'Cadet Admission — Mathematics' },
    short: { bn: 'পাটিগণিত, বীজগণিত, জ্যামিতি ও মানসাংক, ট্রিকসহ।', en: 'Arithmetic, algebra, geometry and mental maths, with tricks.' } },
  { id: 'c05', program: 'cadet', subject: 'gk', kind: 'regular', teacher: 't04', base: 2200, months: 3, cpw: 2, weeks: 12, start: '2026-12-08', seats: 6, formats: ['one', 'group'], rating: 4.8, reviews: 61, enrolled: 97, featured: false,
    days: ['sun', 'wed'], time: { bn: 'রাত ৯:০০', en: '9:00 PM' },
    title: { bn: 'ক্যাডেট ভর্তি — সাধারণ জ্ঞান', en: 'Cadet Admission — General Knowledge' },
    short: { bn: 'বাংলাদেশ, বিশ্ব, সাধারণ বিজ্ঞান ও চলতি ঘটনা।', en: 'Bangladesh, the world, general science and current affairs.' } },
  { id: 'c14', program: 'cadet', subject: 'combined', kind: 'crash', teacher: 't07', base: 3600, months: 2, cpw: 2, weeks: 8, start: '2026-12-12', seats: 5, formats: ['group'], rating: 4.7, reviews: 33, enrolled: 71, featured: false,
    days: ['fri', 'sun'], time: { bn: 'সকাল ১০:০০', en: '10:00 AM' },
    title: { bn: 'ক্যাডেট ভর্তি — মডেল টেস্ট ক্র্যাশ কোর্স', en: 'Cadet Admission — Model Test Crash Course' },
    short: { bn: 'সপ্তাহে ১–২ দিন মডেল টেস্ট ও প্রশ্ন ব্যাখ্যা। পরীক্ষার আগের শেষ প্রস্তুতি।', en: '1–2 model tests a week with solution review. Final preparation before the exam.' } },
  { id: 'c06', program: 'du-ka', subject: 'combined', kind: 'crash', teacher: 't08', base: 4800, months: 2, cpw: 2, weeks: 8, start: '2026-12-11', seats: 2, formats: ['one', 'group'], rating: 4.9, reviews: 88, enrolled: 143, featured: true,
    days: ['fri', 'tue'], time: { bn: 'সকাল ১০:০০', en: '10:00 AM' },
    title: { bn: 'ঢাবি ক ইউনিট — ক্র্যাশ কোর্স', en: 'DU Unit Ka — Crash Course' },
    short: { bn: 'ক ইউনিটের জন্য আলাদা ব্যাচ। সপ্তাহে ১–২ দিন মডেল টেস্ট, পরদিন প্রশ্ন ব্যাখ্যা।', en: 'A separate Unit Ka batch. 1–2 model tests a week, solutions reviewed the next day.' } },
  { id: 'c07', program: 'du-kha', subject: 'combined', kind: 'crash', teacher: 't10', base: 4200, months: 2, cpw: 2, weeks: 8, start: '2026-12-12', seats: 4, formats: ['one', 'group'], rating: 4.8, reviews: 64, enrolled: 109, featured: false,
    days: ['sat', 'wed'], time: { bn: 'সকাল ১১:০০', en: '11:00 AM' },
    title: { bn: 'ঢাবি খ ইউনিট — ক্র্যাশ কোর্স', en: 'DU Unit Kha — Crash Course' },
    short: { bn: 'খ ইউনিটের জন্য আলাদা ব্যাচ। বিষয়ভিত্তিক নোট ও সাপ্তাহিক মডেল টেস্ট।', en: 'A separate Unit Kha batch with subject notes and weekly model tests.' } },
  { id: 'c08', program: 'du-ga', subject: 'combined', kind: 'crash', teacher: 't09', base: 4200, months: 2, cpw: 2, weeks: 8, start: '2026-12-13', seats: 3, formats: ['one', 'group'], rating: 4.7, reviews: 52, enrolled: 91, featured: false,
    days: ['sun', 'thu'], time: { bn: 'সকাল ১১:০০', en: '11:00 AM' },
    title: { bn: 'ঢাবি গ ইউনিট — ক্র্যাশ কোর্স', en: 'DU Unit Ga — Crash Course' },
    short: { bn: 'গ ইউনিটের জন্য আলাদা ব্যাচ। হিসাববিজ্ঞান ও ব্যবসায় বিষয়ে জোর।', en: 'A separate Unit Ga batch with a focus on accounting and business studies.' } },
  { id: 'c09', program: 'du-gha', subject: 'combined', kind: 'crash', teacher: 't11', base: 4200, months: 2, cpw: 2, weeks: 8, start: '2026-12-13', seats: 6, formats: ['group'], rating: 4.6, reviews: 29, enrolled: 66, featured: false,
    days: ['sat', 'tue'], time: { bn: 'দুপুর ১২:০০', en: '12:00 PM' },
    title: { bn: 'ঢাবি ঘ ইউনিট — ক্র্যাশ কোর্স', en: 'DU Unit Gha — Crash Course' },
    short: { bn: 'ঘ ইউনিটের জন্য আলাদা ব্যাচ। সময় ধরে মডেল টেস্ট ও ভুল বিশ্লেষণ।', en: 'A separate Unit Gha batch with timed model tests and mistake analysis.' } },
  { id: 'c10', program: 'bup', subject: 'combined', kind: 'crash', teacher: 't07', base: 4500, months: 2, cpw: 2, weeks: 8, start: '2026-12-14', seats: 4, formats: ['one', 'group'], rating: 4.8, reviews: 47, enrolled: 83, featured: true,
    days: ['mon', 'thu'], time: { bn: 'রাত ৮:৩০', en: '8:30 PM' },
    title: { bn: 'BUP ভর্তি — ক্র্যাশ কোর্স', en: 'BUP Admission — Crash Course' },
    short: { bn: 'BUP ভর্তি পরীক্ষার ধরন ধরে মডেল টেস্ট ও রিভিশন।', en: 'Model tests and revision built around the BUP admission pattern.' } },
  { id: 'c13', program: 'bup', subject: 'english', kind: 'regular', teacher: 't03', base: 3600, months: 2, cpw: 2, weeks: 8, start: '2026-12-15', seats: 5, formats: ['group'], rating: 4.7, reviews: 26, enrolled: 52, featured: false,
    days: ['sat', 'tue'], time: { bn: 'রাত ৯:০০', en: '9:00 PM' },
    title: { bn: 'BUP ভর্তি — ইংরেজি ও সাধারণ জ্ঞান ফোকাস', en: 'BUP Admission — English & GK Focus' },
    short: { bn: 'ভাষা ও সাধারণ জ্ঞান অংশের জন্য আলাদা ব্যাচ।', en: 'A separate batch for the language and general knowledge sections.' } },
  { id: 'c11', program: 'buet', subject: 'combined', kind: 'crash', teacher: 't05', base: 6800, months: 3, cpw: 2, weeks: 12, start: '2026-12-10', seats: 2, formats: ['one', 'group'], rating: 4.9, reviews: 81, enrolled: 118, featured: true,
    days: ['thu', 'sat'], time: { bn: 'রাত ৮:০০', en: '8:00 PM' },
    title: { bn: 'বুয়েট ভর্তি — ক্র্যাশ কোর্স', en: 'BUET Admission — Crash Course' },
    short: { bn: 'বুয়েটের টিচারদের সঙ্গে সাপ্তাহিক মডেল টেস্ট ও চ্যালেঞ্জিং সমস্যা সমাধান।', en: 'Weekly model tests and challenging problem solving with BUET teachers.' } },
  { id: 'c12', program: 'buet', subject: 'math', kind: 'regular', teacher: 't01', base: 5200, months: 3, cpw: 3, weeks: 12, start: '2026-12-09', seats: 5, formats: ['one', 'group'], rating: 4.9, reviews: 55, enrolled: 79, featured: false,
    days: ['sun', 'tue', 'thu'], time: { bn: 'রাত ৯:৩০', en: '9:30 PM' },
    title: { bn: 'বুয়েট ভর্তি — গণিত ফোকাস', en: 'BUET Admission — Mathematics Focus' },
    short: { bn: 'ক্যালকুলাস, ত্রিকোণমিতি ও বীজগণিতের কঠিন অংশ ধাপে ধাপে।', en: 'Calculus, trigonometry and the harder parts of algebra, step by step.' } },
];

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

const REVIEWS = [
  { name: { bn: 'নাজমুল হক', en: 'Nazmul Haque' }, from: { bn: 'অভিভাবক, কুড়িগ্রাম', en: 'Parent, Kurigram' }, course: 'c04', rating: 5,
    text: { bn: 'আমাদের এলাকায় ভালো গণিত টিচার পাওয়া কঠিন ছিল। বুয়েটের ভাইয়ার ক্লাস করে আমার ছেলের আত্মবিশ্বাস অনেক বেড়েছে।', en: 'Good maths teachers are hard to find where we live. My son’s confidence has grown a lot after his BUET teacher’s classes.' } },
  { name: { bn: 'তাসনিম জাহান', en: 'Tasnim Jahan' }, from: { bn: 'শিক্ষার্থী, নেত্রকোণা', en: 'Student, Netrokona' }, course: 'c06', rating: 5,
    text: { bn: 'সপ্তাহে দুই দিন মডেল টেস্ট, পরদিন ব্যাখ্যা। কোথায় ভুল হচ্ছে সেটা পরিষ্কার বুঝতে পারছি।', en: 'Two model tests a week and a review the next day. I can see exactly where I go wrong.' } },
  { name: { bn: 'শামীমা আক্তার', en: 'Shamima Akter' }, from: { bn: 'অভিভাবক, বরিশাল', en: 'Parent, Barishal' }, course: 'c02', rating: 5,
    text: { bn: 'গ্রুপে অন্য স্কুলের বাচ্চাদের সঙ্গে পড়ে আমার মেয়ের মধ্যে প্রতিযোগিতার মনোভাব এসেছে।', en: 'Studying in a group with children from other schools has given my daughter a healthy competitive spirit.' } },
  { name: { bn: 'ফাহিম রেজা', en: 'Fahim Reza' }, from: { bn: 'শিক্ষার্থী, রংপুর', en: 'Student, Rangpur' }, course: 'c11', rating: 5,
    text: { bn: 'বুয়েটের প্রশ্নের ধরন বুঝতে পারাটাই সবচেয়ে বড় পাওয়া। মডেল টেস্টগুলো সত্যিকারের পরীক্ষার মতো।', en: 'Understanding the BUET question pattern was the biggest gain. The model tests feel like the real exam.' } },
  { name: { bn: 'রুবাইয়া সুলতানা', en: 'Rubaiya Sultana' }, from: { bn: 'শিক্ষার্থী, সিলেট', en: 'Student, Sylhet' }, course: 'c08', rating: 4,
    text: { bn: 'রেকর্ডিং ২৪ ঘণ্টা থাকে, তাই কোনো ক্লাস মিস হলেও সমস্যা হয় না।', en: 'Recordings stay for 24 hours, so missing a class is never a problem.' } },
  { name: { bn: 'আব্দুল্লাহ আল মামুন', en: 'Abdullah Al Mamun' }, from: { bn: 'অভিভাবক, কক্সবাজার', en: 'Parent, Cox’s Bazar' }, course: 'c01', rating: 5,
    text: { bn: 'একই কোর্সে চার বিষয়, সঙ্গে সাপ্তাহিক পরীক্ষা। আলাদা আলাদা টিউটর খুঁজতে হয়নি।', en: 'Four subjects in one course with weekly tests. No need to hunt for separate tutors.' } },
  { name: { bn: 'নুসরাত সুমি', en: 'Nusrat Sumi' }, from: { bn: 'শিক্ষার্থী, রাজশাহী', en: 'Student, Rajshahi' }, course: 'c10', rating: 5,
    text: { bn: 'BUP-এর জন্য এত গোছানো প্রস্তুতি আগে পাইনি। টিচার সবসময় প্রশ্নের উত্তর দেন।', en: 'I had never found such organised BUP preparation. The teacher always answers questions.' } },
  { name: { bn: 'মেহেদী হাসান', en: 'Mehedi Hasan' }, from: { bn: 'শিক্ষার্থী, ময়মনসিংহ', en: 'Student, Mymensingh' }, course: 'c03', rating: 4,
    text: { bn: 'ইংরেজি কম্প্রিহেনশনে ভয় ছিল। এখন সময় ধরে সমাধান করতে পারি।', en: 'I used to fear English comprehension. Now I can solve it within time.' } },
];

const COUPONS = {
  CHAATRO10: { type: 'pct', v: 10, bn: '১০% ছাড়', en: '10% off' },
  FIRST200: { type: 'flat', v: 200, bn: '৳২০০ ছাড়', en: '৳200 off' },
};

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

/* ---------- হিসাব / helpers ---------- */
const round50 = x => Math.round(x / 50) * 50;

function pricingFor(c) {
  const mk = (mult, off) => {
    const fullA = round50(c.base * mult), fullD = round50(c.base * mult * off);
    return { fullA, fullD, months: c.months, perA: round50(fullA * 1.1 / c.months), perD: round50(fullD * 1.1 / c.months), seats: mult === 1 ? 7 : 1 };
  };
  const r = { group: mk(1, 0.88), one: mk(2.8, 0.9) };
  if (c.plans) ['group', 'one'].forEach(f => { if (c.plans[f] && c.plans[f].length) r[f] = fromPlans(c, c.plans[f], r[f].seats); });
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
/* নমুনা কাস্টম প্ল্যান (টিচারের সেট করা) */
COURSES.find(c => c.id === 'c01').plans = {
  group: [{ key: 'full', m: 0, actual: 7200, disc: 6350 }, { key: 'm1', m: 1, actual: 1400, disc: 1250, first: 900 }, { key: 'm3', m: 3, actual: 3900, disc: 3500 }, { key: 'm6', m: 6, actual: 7400, disc: 6700 }],
  one: [{ key: 'full', m: 0, actual: 20200, disc: 18200 }, { key: 'm3', m: 3, actual: 10500, disc: 9500 }],
};
COURSES.find(c => c.id === 'c12').plans = {
  group: [{ key: 'full', m: 0, actual: 5200, disc: 4550 }, { key: 'm1', m: 1, actual: 1900, disc: 1700, first: 1200 }, { key: 'm3', m: 3, actual: 5000, disc: 4400 }],
  one: [{ key: 'full', m: 0, actual: 14500, disc: 13000 }, { key: 'm1', m: 1, actual: 5200, disc: 4700 }, { key: 'm12', m: 12, actual: 14500, disc: 13000 }],
};

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
  const out = [], sfx = { one: [' · ১-টু-১', ' · 1-to-1'], group: [' · গ্রুপ (১-টু-৭)', ' · Group (1-to-7)'] };
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
const BUNDLES = [
  { id: 'b01', courses: ['c02', 'c03', 'c04', 'c05'], disc: 12, active: true, by: 'admin',
    title: { bn: 'ক্যাডেট কলেজ কমপ্লিট প্যাক (৪ বিষয়)', en: 'Cadet College Complete Pack (4 subjects)' },
    desc: { bn: 'বাংলা, ইংরেজি, গণিত ও সাধারণ জ্ঞান, চারটি কোর্স একসাথে নিলে বিশেষ ছাড়।', en: 'Bangla, English, Math and GK together at a special bundle price.' } },
  { id: 'b02', courses: ['c11', 'c12'], disc: 10, active: true, by: 'admin',
    title: { bn: 'বুয়েট প্রস্তুতি ডাবল প্যাক', en: 'BUET Preparation Double Pack' },
    desc: { bn: 'বুয়েট ক্র্যাশ কোর্স ও গণিত কোর্স একসাথে।', en: 'The BUET crash course and the maths course together.' } },
];
const bundleCourses = b => b.courses.map(id => COURSES.find(c => c.id === id)).filter(Boolean);
function bundleCalc(b) {
  const cs = bundleCourses(b), total = cs.reduce((s, c) => s + pricingFor(c)[c.formats[0]].fullD, 0), price = round50(total * (100 - b.disc) / 100);
  return { cs, total, price, save: total - price };
}

/* ইউনিক আইডি: টিচার ৪ অঙ্ক (1001–), কোর্স ৪ অঙ্ক (3001–), স্টুডেন্ট ৫ অঙ্ক (20001–); ফোন নম্বরও সাজানো */
TEACHERS.forEach((t, i) => { t.pid = 1001 + i; t.phone = '0171100' + t.pid; });
COURSES.forEach((c, i) => { c.pid = 3001 + i; });
const nextCoursePid = () => Math.max(3000, ...COURSES.map(c => c.pid || 0)) + 1;
