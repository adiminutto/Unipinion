// ---- Unipinion mock data ----------------------------------------------
// All data is static / stored in localStorage. No backend required.

const CATEGORIES = {
  Food:    ["Breakfast", "Lunch", "Dinner"],
  Events:  ["Academic", "Social", "Career"],
  Clubs:   ["Cultural", "Academic", "Sports", "Arts"],
  Classes: ["Engineering", "Health Sciences", "Social Sciences"]
};

const SUBJECTS = ["Engineering", "Health Sciences", "Social Sciences", "Science", "Business", "Humanities"];

const SEED_ITEMS = [
  {
    id: "jimbos", name: "Jimbo's", category: "Food", subcategory: "Breakfast",
    location: "Student Centre, Main Floor",
    description: "Campus classic for breakfast sandwiches, melts and pancakes. Famous for the Jimbo Reuben.",
    trending: true, isNew: false,
    details: { "Menu items": "Jimbo Reuben, Jimbo BLT, Jimbo Egg & Cheese, Jimbo Cinnamon Toast, Chicken Melt", "Price range": "$6 – $12", "Accepts": "Meal card, debit, credit" },
    reviews: [
      { user: "Jerome P", rating: 3, text: "Fast service, but they can't cook an egg!", date: "2026-02-11" },
      { user: "Andre", rating: 4, text: "Jimbo chicken melt 🔥", date: "2026-02-09" },
      { user: "Jackie", rating: 1, text: "I gave Jimbo's a second chance. I told them I don't like eggs and somehow an egg ended up between my pancakes. Never again.", date: "2026-01-28" },
      { user: "Priya S", rating: 5, text: "Best breakfast on campus, period. Get there before 9 to beat the line.", date: "2026-01-20" }
    ]
  },
  {
    id: "tim-hortons", name: "Tim Horton's", category: "Food", subcategory: "Breakfast",
    location: "Library Atrium",
    description: "Coffee, donuts and breakfast wraps. The longest line on campus every morning.",
    trending: false, isNew: false,
    details: { "Menu items": "Coffee, donuts, bagels, breakfast wraps", "Price range": "$2 – $8", "Accepts": "Meal card, debit, credit, cash" },
    reviews: [
      { user: "Marcus L", rating: 3, text: "It's Tim's. You know what you're getting.", date: "2026-02-10" },
      { user: "Sofia R", rating: 3, text: "Line moves faster than it looks but they ran out of bagels twice this week.", date: "2026-02-05" }
    ]
  },
  {
    id: "bistro", name: "Bistro", category: "Food", subcategory: "Breakfast",
    location: "West Hall, Ground Floor",
    description: "Made-to-order omelettes and fresh pastries. Quieter alternative to the main food court.",
    trending: false, isNew: false,
    details: { "Menu items": "Omelettes, croissants, fruit bowls, espresso", "Price range": "$7 – $14", "Accepts": "Meal card, debit, credit" },
    reviews: [
      { user: "Dana K", rating: 4, text: "Hidden gem. The omelette station is worth the walk.", date: "2026-02-02" },
      { user: "Omar H", rating: 4, text: "Great coffee, slightly pricey.", date: "2026-01-25" }
    ]
  },
  {
    id: "noodle-nation", name: "Noodle Nation", category: "Food", subcategory: "Lunch",
    location: "Student Centre, Food Court",
    description: "Build-your-own noodle bowls with a rotating broth of the week.",
    trending: true, isNew: true,
    details: { "Menu items": "Ramen bowls, pho, stir-fry noodles", "Price range": "$9 – $15", "Accepts": "Meal card, debit, credit" },
    reviews: [
      { user: "Liam T", rating: 5, text: "New spot, already my go-to. Spicy miso broth is unreal.", date: "2026-02-12" },
      { user: "Grace W", rating: 4, text: "Portions are generous. Line gets long at noon.", date: "2026-02-11" }
    ]
  },
  {
    id: "the-grill", name: "The Grill", category: "Food", subcategory: "Dinner",
    location: "East Residence Commons",
    description: "Burgers, wings and late-night comfort food. Open until 11pm.",
    trending: false, isNew: false,
    details: { "Menu items": "Burgers, wings, poutine, milkshakes", "Price range": "$8 – $16", "Accepts": "Meal card, debit, credit" },
    reviews: [
      { user: "Nate B", rating: 4, text: "Solid burgers, great for after practice.", date: "2026-01-30" },
      { user: "Ella M", rating: 2, text: "Waited 35 minutes for wings on a Tuesday.", date: "2026-01-22" }
    ]
  },
  {
    id: "career-expo", name: "Winter Career Expo", category: "Events", subcategory: "Career",
    location: "Convocation Hall",
    description: "Annual career fair with 80+ employers across engineering, health and business.",
    trending: true, isNew: false,
    details: { "Date / Time": "March 4, 2026 · 10:00 – 16:00", "Restrictions": "Business casual dress code", "Sponsors": "Student Success Centre", "Special guests": "Alumni panel at 13:00" },
    reviews: [
      { user: "Priya S", rating: 4, text: "Got two interviews out of last year's expo. Go early, lines get long.", date: "2026-02-01" },
      { user: "Marcus L", rating: 3, text: "Good employers but very crowded after 11.", date: "2026-01-29" }
    ]
  },
  {
    id: "trivia-night", name: "Campus Trivia Night", category: "Events", subcategory: "Social",
    location: "The Phoenix Pub",
    description: "Weekly trivia with prizes. Teams of up to six.",
    trending: false, isNew: true,
    details: { "Date / Time": "Every Thursday · 19:00", "Restrictions": "None", "Sponsors": "Student Union", "Special guests": "Rotating host each week" },
    reviews: [
      { user: "Grace W", rating: 5, text: "Best weekly event on campus. Questions are actually fun.", date: "2026-02-08" }
    ]
  },
  {
    id: "research-symposium", name: "Undergrad Research Symposium", category: "Events", subcategory: "Academic",
    location: "Science Building, Atrium",
    description: "Poster presentations and lightning talks from undergraduate researchers.",
    trending: false, isNew: false,
    details: { "Date / Time": "March 20, 2026 · 12:00 – 17:00", "Restrictions": "None", "Sponsors": "Faculty of Science", "Special guests": "Keynote: Dr. A. Osei" },
    reviews: [
      { user: "Dana K", rating: 4, text: "Presented last year — great low-pressure environment.", date: "2026-01-18" }
    ]
  },
  {
    id: "soccer-club", name: "Soccer Club", category: "Clubs", subcategory: "Sports",
    location: "Athletics Fieldhouse",
    description: "Intramural and drop-in soccer for all skill levels. Indoor in winter, outdoor in fall.",
    trending: false, isNew: false,
    details: { "Meetings": "Tuesdays & Fridays · 18:00", "Membership cost": "$20 / term", "Application": "Open — sign up at first session" },
    reviews: [
      { user: "Nate B", rating: 4, text: "Welcoming group, good mix of skill levels.", date: "2026-02-03" },
      { user: "Omar H", rating: 3, text: "Fun but indoor sessions get overcrowded.", date: "2026-01-27" },
      { user: "Liam T", rating: 4, text: "Great way to stay active in winter.", date: "2026-01-15" }
    ]
  },
  {
    id: "anime-society", name: "Anime Society", category: "Clubs", subcategory: "Cultural",
    location: "Arts Building, Room 204",
    description: "Weekly screenings, manga library and an annual mini-convention.",
    trending: true, isNew: false,
    details: { "Meetings": "Wednesdays · 19:00", "Membership cost": "$10 / year", "Application": "Open membership" },
    reviews: [
      { user: "Jackie", rating: 5, text: "The mini-con last term was amazing. Super friendly execs.", date: "2026-02-06" },
      { user: "Sofia R", rating: 4, text: "Nice library, wish meetings were longer.", date: "2026-01-31" }
    ]
  },
  {
    id: "debate-club", name: "Debate Club", category: "Clubs", subcategory: "Academic",
    location: "Humanities Hall, Room 110",
    description: "Competitive and casual debate. Travels to two tournaments per term.",
    trending: false, isNew: false,
    details: { "Meetings": "Mondays · 17:30", "Membership cost": "$15 / term", "Application": "Short interest form" },
    reviews: [
      { user: "Ella M", rating: 4, text: "Really sharpened my public speaking. Tournaments are a blast.", date: "2026-01-21" }
    ]
  },
  {
    id: "photo-collective", name: "Photography Collective", category: "Clubs", subcategory: "Arts",
    location: "Media Lab, Basement",
    description: "Photo walks, darkroom access and a juried end-of-year exhibition.",
    trending: false, isNew: true,
    details: { "Meetings": "Saturdays · 14:00", "Membership cost": "$25 / year (includes darkroom)", "Application": "Portfolio optional" },
    reviews: [
      { user: "Dana K", rating: 5, text: "Darkroom access alone is worth it. Lovely community.", date: "2026-02-09" }
    ]
  },
  {
    id: "eng-1p13", name: "ENG 1P13 — Integrated Engineering Design", category: "Classes", subcategory: "Engineering",
    location: "Engineering Complex",
    description: "First-year cornerstone design course with team projects.",
    trending: false, isNew: false, restricted: true,
    details: { "Lecturer": "Dr. H. Nakamura", "Subject": "Engineering" },
    reviews: [
      { user: "Liam T", rating: 3, text: "Heavy workload but the projects are genuinely interesting.", date: "2026-01-19" },
      { user: "Priya S", rating: 4, text: "Dr. Nakamura actually cares. Go to office hours.", date: "2026-01-12" }
    ]
  },
  {
    id: "hs-2ap3", name: "HS 2AP3 — Anatomy & Physiology", category: "Classes", subcategory: "Health Sciences",
    location: "Health Sciences Centre",
    description: "Core second-year anatomy course with weekly labs.",
    trending: false, isNew: false, restricted: true,
    details: { "Lecturer": "Dr. M. Castellano", "Subject": "Health Sciences" },
    reviews: [
      { user: "Grace W", rating: 5, text: "Labs are incredible. Best course I've taken.", date: "2026-02-04" }
    ]
  },
  {
    id: "ss-1a03", name: "SS 1A03 — Intro to Sociology", category: "Classes", subcategory: "Social Sciences",
    location: "Social Sciences Building",
    description: "Popular first-year elective covering foundations of sociology.",
    trending: true, isNew: false, restricted: true,
    details: { "Lecturer": "Dr. R. Okafor", "Subject": "Social Sciences" },
    reviews: [
      { user: "Marcus L", rating: 4, text: "Engaging lectures, fair grading. Easy recommend as an elective.", date: "2026-01-26" },
      { user: "Jackie", rating: 3, text: "Interesting but the readings pile up fast.", date: "2026-01-17" }
    ]
  }
];
