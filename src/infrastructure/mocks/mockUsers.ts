import { User } from "../../core/models/User";

// Helper function to generate a random date within a range
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper function to generate a random number within a range
const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// Helper function to pick a random item from an array
const randomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper function to pick multiple random items from an array
const randomItems = <T>(items: T[], count: number): T[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Sample data for generating mock users
const firstNames = [
  "James",
  "Mary",
  "John",
  "Patricia",
  "Robert",
  "Jennifer",
  "Michael",
  "Linda",
  "William",
  "Elizabeth",
  "David",
  "Barbara",
  "Richard",
  "Susan",
  "Joseph",
  "Jessica",
  "Thomas",
  "Sarah",
  "Charles",
  "Karen",
  "Christopher",
  "Nancy",
  "Daniel",
  "Lisa",
  "Matthew",
  "Margaret",
  "Anthony",
  "Betty",
  "Mark",
  "Sandra",
  "Donald",
  "Ashley",
  "Steven",
  "Dorothy",
  "Paul",
  "Kimberly",
  "Andrew",
  "Emily",
  "Joshua",
  "Donna",
  "Kenneth",
  "Michelle",
  "Kevin",
  "Carol",
  "Brian",
  "Amanda",
  "George",
  "Melissa",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Hernandez",
  "Lopez",
  "Gonzalez",
  "Wilson",
  "Anderson",
  "Thomas",
  "Taylor",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Perez",
  "Thompson",
  "White",
  "Harris",
  "Sanchez",
  "Clark",
  "Ramirez",
  "Lewis",
  "Robinson",
  "Walker",
  "Young",
  "Allen",
  "King",
  "Wright",
  "Scott",
  "Torres",
  "Nguyen",
  "Hill",
  "Flores",
  "Green",
  "Adams",
  "Nelson",
  "Baker",
  "Hall",
  "Rivera",
  "Campbell",
  "Mitchell",
];

const countries = [
  "USA",
  "Canada",
  "UK",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Japan",
  "China",
  "India",
  "Brazil",
  "Mexico",
  "South Africa",
  "Russia",
  "Netherlands",
  "Sweden",
  "Norway",
  "Denmark",
  "Switzerland",
  "Singapore",
];

const cities = {
  USA: [
    "New York",
    "Los Angeles",
    "Chicago",
    "Houston",
    "Phoenix",
    "Philadelphia",
    "San Antonio",
    "San Diego",
    "Dallas",
    "San Jose",
  ],
  Canada: [
    "Toronto",
    "Montreal",
    "Vancouver",
    "Calgary",
    "Edmonton",
    "Ottawa",
    "Quebec City",
    "Winnipeg",
    "Hamilton",
    "Kitchener",
  ],
  UK: [
    "London",
    "Birmingham",
    "Manchester",
    "Glasgow",
    "Liverpool",
    "Bristol",
    "Edinburgh",
    "Leeds",
    "Sheffield",
    "Newcastle",
  ],
  Australia: [
    "Sydney",
    "Melbourne",
    "Brisbane",
    "Perth",
    "Adelaide",
    "Gold Coast",
    "Canberra",
    "Newcastle",
    "Wollongong",
    "Hobart",
  ],
  Germany: [
    "Berlin",
    "Hamburg",
    "Munich",
    "Cologne",
    "Frankfurt",
    "Stuttgart",
    "Düsseldorf",
    "Leipzig",
    "Dortmund",
    "Essen",
  ],
  France: [
    "Paris",
    "Marseille",
    "Lyon",
    "Toulouse",
    "Nice",
    "Nantes",
    "Strasbourg",
    "Montpellier",
    "Bordeaux",
    "Lille",
  ],
  Spain: [
    "Madrid",
    "Barcelona",
    "Valencia",
    "Seville",
    "Zaragoza",
    "Málaga",
    "Murcia",
    "Palma",
    "Las Palmas",
    "Bilbao",
  ],
  Italy: [
    "Rome",
    "Milan",
    "Naples",
    "Turin",
    "Palermo",
    "Genoa",
    "Bologna",
    "Florence",
    "Bari",
    "Catania",
  ],
  Japan: [
    "Tokyo",
    "Yokohama",
    "Osaka",
    "Nagoya",
    "Sapporo",
    "Fukuoka",
    "Kobe",
    "Kyoto",
    "Kawasaki",
    "Saitama",
  ],
  China: [
    "Shanghai",
    "Beijing",
    "Guangzhou",
    "Shenzhen",
    "Tianjin",
    "Chongqing",
    "Wuhan",
    "Chengdu",
    "Nanjing",
    "Xi'an",
  ],
  India: [
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Ahmedabad",
    "Pune",
    "Surat",
    "Jaipur",
  ],
  Brazil: [
    "São Paulo",
    "Rio de Janeiro",
    "Brasília",
    "Salvador",
    "Fortaleza",
    "Belo Horizonte",
    "Manaus",
    "Curitiba",
    "Recife",
    "Porto Alegre",
  ],
  Mexico: [
    "Mexico City",
    "Guadalajara",
    "Monterrey",
    "Puebla",
    "Tijuana",
    "León",
    "Juárez",
    "Zapopan",
    "Mérida",
    "Cancún",
  ],
  "South Africa": [
    "Johannesburg",
    "Cape Town",
    "Durban",
    "Pretoria",
    "Port Elizabeth",
    "Bloemfontein",
    "Nelspruit",
    "Kimberley",
    "Polokwane",
    "Rustenburg",
  ],
  Russia: [
    "Moscow",
    "Saint Petersburg",
    "Novosibirsk",
    "Yekaterinburg",
    "Kazan",
    "Chelyabinsk",
    "Omsk",
    "Samara",
    "Rostov-on-Don",
    "Ufa",
  ],
  Netherlands: [
    "Amsterdam",
    "Rotterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Tilburg",
    "Groningen",
    "Almere",
    "Breda",
    "Nijmegen",
  ],
  Sweden: [
    "Stockholm",
    "Gothenburg",
    "Malmö",
    "Uppsala",
    "Västerås",
    "Örebro",
    "Linköping",
    "Helsingborg",
    "Jönköping",
    "Norrköping",
  ],
  Norway: [
    "Oslo",
    "Bergen",
    "Trondheim",
    "Stavanger",
    "Drammen",
    "Fredrikstad",
    "Kristiansand",
    "Sandnes",
    "Tromsø",
    "Sarpsborg",
  ],
  Denmark: [
    "Copenhagen",
    "Aarhus",
    "Odense",
    "Aalborg",
    "Frederiksberg",
    "Esbjerg",
    "Randers",
    "Kolding",
    "Horsens",
    "Vejle",
  ],
  Switzerland: [
    "Zurich",
    "Geneva",
    "Basel",
    "Lausanne",
    "Bern",
    "Winterthur",
    "Lucerne",
    "St. Gallen",
    "Lugano",
    "Biel",
  ],
  Singapore: ["Singapore"],
};

const occupations = [
  "Software Engineer",
  "Teacher",
  "Doctor",
  "Nurse",
  "Accountant",
  "Lawyer",
  "Marketing Manager",
  "Sales Representative",
  "Graphic Designer",
  "Financial Analyst",
  "Project Manager",
  "HR Manager",
  "Chef",
  "Electrician",
  "Plumber",
  "Architect",
  "Civil Engineer",
  "Mechanical Engineer",
  "Pharmacist",
  "Dentist",
  "Veterinarian",
  "Police Officer",
  "Firefighter",
  "Pilot",
  "Flight Attendant",
  "Journalist",
  "Writer",
  "Editor",
  "Photographer",
  "Artist",
  "Actor",
  "Musician",
  "Dancer",
  "Athlete",
  "Coach",
  "Personal Trainer",
  "Nutritionist",
  "Psychologist",
  "Social Worker",
  "Librarian",
  "Professor",
  "Researcher",
  "Consultant",
  "Business Analyst",
  "Data Scientist",
  "UX Designer",
  "Product Manager",
  "CEO",
];

const interests = [
  "Reading",
  "Cooking",
  "Gardening",
  "Photography",
  "Hiking",
  "Traveling",
  "Painting",
  "Drawing",
  "Singing",
  "Dancing",
  "Playing Guitar",
  "Playing Piano",
  "Swimming",
  "Running",
  "Cycling",
  "Yoga",
  "Meditation",
  "Chess",
  "Board Games",
  "Video Games",
  "Movies",
  "TV Shows",
  "Theater",
  "Opera",
  "Ballet",
  "Concerts",
  "Museums",
  "Art Galleries",
  "History",
  "Science",
  "Technology",
  "Astronomy",
  "Bird Watching",
  "Fishing",
  "Hunting",
  "Camping",
  "Mountaineering",
  "Skiing",
  "Snowboarding",
  "Surfing",
  "Sailing",
  "Scuba Diving",
  "Knitting",
  "Sewing",
  "Woodworking",
  "Metalworking",
  "Pottery",
  "Jewelry Making",
  "Collecting Stamps",
  "Collecting Coins",
  "Collecting Antiques",
  "Wine Tasting",
  "Beer Brewing",
  "Coffee Roasting",
  "Baking",
  "Barbecuing",
  "Volunteering",
  "Politics",
  "Environmental Activism",
  "Animal Rights",
  "Fashion",
  "Interior Design",
  "Architecture",
  "Cars",
  "Motorcycles",
  "Drones",
  "Robotics",
  "Programming",
];

const browsers = [
  "Chrome",
  "Firefox",
  "Safari",
  "Edge",
  "Opera",
  "Brave",
  "Vivaldi",
];

const products = [
  { id: "p1", name: "Smartphone", price: 999 },
  { id: "p2", name: "Laptop", price: 1499 },
  { id: "p3", name: "Tablet", price: 599 },
  { id: "p4", name: "Smartwatch", price: 299 },
  { id: "p5", name: "Headphones", price: 199 },
  { id: "p6", name: "Bluetooth Speaker", price: 129 },
  { id: "p7", name: "Camera", price: 799 },
  { id: "p8", name: "TV", price: 1299 },
  { id: "p9", name: "Gaming Console", price: 499 },
  { id: "p10", name: "Fitness Tracker", price: 99 },
  { id: "p11", name: "Wireless Earbuds", price: 149 },
  { id: "p12", name: "External Hard Drive", price: 129 },
  { id: "p13", name: "Printer", price: 199 },
  { id: "p14", name: "Monitor", price: 349 },
  { id: "p15", name: "Keyboard", price: 79 },
  { id: "p16", name: "Mouse", price: 49 },
  { id: "p17", name: "Router", price: 89 },
  { id: "p18", name: "Smart Home Hub", price: 129 },
  { id: "p19", name: "Streaming Device", price: 69 },
  { id: "p20", name: "VR Headset", price: 399 },
];

const subscriptionTiers = ["Basic", "Standard", "Premium", "Ultimate"];

const tags = [
  "High Value",
  "New Customer",
  "Returning Customer",
  "Inactive",
  "Churned",
  "Promotion Responsive",
  "Email Subscriber",
  "Social Media Follower",
  "Mobile App User",
  "Desktop User",
  "International",
  "Local",
  "Frequent Buyer",
  "Seasonal Buyer",
  "Holiday Shopper",
  "Black Friday Shopper",
  "Cyber Monday Shopper",
  "Weekend Shopper",
  "Weekday Shopper",
  "Morning Shopper",
  "Evening Shopper",
  "Credit Card User",
  "PayPal User",
  "Apple Pay User",
  "Google Pay User",
  "Discount Seeker",
  "Full Price Buyer",
  "Luxury Buyer",
  "Budget Buyer",
  "Tech Enthusiast",
  "Early Adopter",
  "Late Adopter",
  "Brand Loyal",
  "Price Sensitive",
  "Quality Focused",
  "Feature Focused",
  "Design Focused",
  "Environmentally Conscious",
  "Socially Conscious",
  "Health Conscious",
  "Fitness Enthusiast",
  "Foodie",
  "Traveler",
  "Homebody",
  "Parent",
  "Student",
  "Professional",
  "Retiree",
  "Influencer",
];

// Generate a single mock user
const generateMockUser = (id: number): User => {
  const firstName = randomItem(firstNames);
  const lastName = randomItem(lastNames);
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomNumber(
    1,
    999
  )}@example.com`;
  const country = randomItem(countries);
  const city = randomItem(cities[country as keyof typeof cities]);
  const age = randomNumber(18, 80);
  const gender = randomItem(["Male", "Female", "Other", "Prefer not to say"]);
  const income = randomNumber(20000, 200000);
  const occupation = randomItem(occupations);
  const interestCount = randomNumber(2, 8);
  const userInterests = randomItems(interests, interestCount);

  const now = new Date();
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(now.getFullYear() - 2);

  const signupDate = randomDate(twoYearsAgo, now);
  const lastActive = randomDate(signupDate, now);

  const deviceType = randomItem(["Mobile", "Desktop", "Tablet"]);
  const browser = randomItem(browsers);

  // Generate purchase history
  const purchaseCount = randomNumber(0, 10);
  const purchaseHistory = [];
  let totalSpent = 0;

  for (let i = 0; i < purchaseCount; i++) {
    const product = randomItem(products);
    const purchaseDate = randomDate(signupDate, now);

    purchaseHistory.push({
      productId: product.id,
      productName: product.name,
      price: product.price,
      purchaseDate,
    });

    totalSpent += product.price;
  }

  // Determine loyalty tier based on total spent
  let loyaltyTier: "Bronze" | "Silver" | "Gold" | "Platinum";
  if (totalSpent < 500) {
    loyaltyTier = "Bronze";
  } else if (totalSpent < 1000) {
    loyaltyTier = "Silver";
  } else if (totalSpent < 2000) {
    loyaltyTier = "Gold";
  } else {
    loyaltyTier = "Platinum";
  }

  // Determine if user has subscription
  const hasSubscription = Math.random() > 0.7;
  const subscriptionTier = hasSubscription
    ? randomItem(subscriptionTiers)
    : undefined;

  // Generate tags
  const tagCount = randomNumber(1, 5);
  const userTags = randomItems(tags, tagCount);

  return {
    id: `user-${id}`,
    firstName,
    lastName,
    email,
    age,
    gender: gender as User["gender"],
    country,
    city,
    income,
    occupation,
    interests: userInterests,
    signupDate,
    lastActive,
    deviceType: deviceType as User["deviceType"],
    browser,
    purchaseHistory,
    totalSpent,
    loyaltyTier,
    hasSubscription,
    subscriptionTier,
    tags: userTags,
  };
};

// Generate a specified number of mock users
export const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    users.push(generateMockUser(i));
  }

  return users;
};

// Export a fixed set of mock users
export const mockUsers = generateMockUsers(1000);
