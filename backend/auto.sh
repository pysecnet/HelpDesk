#!/bin/bash
# Run this command in your backend directory to create the complete training script

cd /home/saif/Desktop/qazi_fyp/university-helpdesk/backend

cat > trainKnowledgeBase.js << 'ENDOFFILE'
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.API_URL || "http://localhost:5000/api";
const TOKEN = process.env.ADMIN_TOKEN || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NjFmMWIyYWQ4ZGFlOTlkMjVlYzQ5NSIsImlhdCI6MTc2ODAyNjU1NCwiZXhwIjoxNzY4NjMxMzU0fQ.QUpZDRBTzkQ9tTCJCxUa9jrhDW-ScjCZg2plvUZ4XPk";

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

const FAQ_DATABASE = [
  // ==================== ADMISSIONS ====================
  {
    question: "What are the admission requirements for undergraduate programs?",
    answer: "Admission requirements include: (1) Completed high school education or equivalent, (2) Minimum GPA of 2.5 on a 4.0 scale, (3) Standardized test scores (SAT/ACT), (4) Two letters of recommendation, (5) Personal statement essay, (6) Official transcripts from all previous institutions. International students must also provide TOEFL/IELTS scores.",
  },
  {
    question: "When is the application deadline?",
    answer: "Application deadlines vary by program and semester. For Fall semester: Early Action deadline is November 1st, Regular Decision deadline is January 15th. For Spring semester: Application deadline is October 1st. Graduate program deadlines vary by department - check with specific departments for exact dates.",
  },
  {
    question: "How do I check my admission status?",
    answer: "You can check your admission status by logging into the applicant portal at portal.university.edu. Use your application ID and password. Status updates are typically posted within 6-8 weeks of submitting your complete application. You'll also receive email notifications for any status changes.",
  },
  {
    question: "Can I defer my admission to a later semester?",
    answer: "Yes, admitted students can request to defer their admission for up to one year. Submit a deferral request through the admissions portal within 2 weeks of receiving your acceptance letter. Deferrals are granted on a case-by-case basis. You must reconfirm your enrollment 60 days before your intended start date.",
  },

  // ==================== REGISTRATION ====================
  {
    question: "How do I register for classes?",
    answer: "To register for classes: (1) Log into the student portal, (2) Navigate to 'Course Registration', (3) Search for courses by subject, course number, or keyword, (4) Check course availability and prerequisites, (5) Add courses to your shopping cart, (6) Submit registration. Registration opens based on your class standing and credit hours completed.",
  },
  {
    question: "What is the add/drop deadline?",
    answer: "The add/drop period is the first two weeks of each semester. You can add courses during the first week without penalty. The drop deadline is at the end of the second week - courses dropped by this date won't appear on your transcript. After this deadline, you must withdraw from courses, which will show a 'W' grade on your transcript.",
  },
  {
    question: "How many credits can I take per semester?",
    answer: "Full-time undergraduate students can register for 12-18 credit hours per semester. To take more than 18 credits, you need dean's approval and must have a minimum GPA of 3.0. Part-time students can take up to 11 credits. Summer sessions have different credit limits - maximum 12 credits per summer term.",
  },
  {
    question: "What should I do if a class I need is full?",
    answer: "If a required class is full: (1) Join the waitlist through the registration portal, (2) Check regularly for openings as students may drop, (3) Attend the first class and ask the professor about overrides, (4) Contact your academic advisor for alternative options, (5) Consider taking the course in a different semester. Waitlist positions are processed automatically as seats become available.",
  },

  // ==================== FINANCIAL AID ====================
  {
    question: "How do I apply for financial aid?",
    answer: "To apply for financial aid: (1) Complete the FAFSA (Free Application for Federal Student Aid) at fafsa.gov, (2) List our school code: 123456, (3) Submit by the priority deadline of March 1st for fall semester, (4) Complete any additional forms requested by the financial aid office, (5) Review your award letter and accept/decline aid packages through the student portal.",
  },
  {
    question: "When will I receive my financial aid refund?",
    answer: "Financial aid refunds are processed 10-14 days after the semester begins, provided all financial aid has been disbursed and your account has a credit balance. Refunds are issued via direct deposit if you've enrolled, or by check if not. Set up direct deposit through the student portal under 'Financial Services' to receive funds faster.",
  },
  {
    question: "What scholarships are available?",
    answer: "The university offers various scholarships: (1) Merit-based scholarships (3.5+ GPA), (2) Need-based grants, (3) Department-specific scholarships, (4) Athletic scholarships, (5) Diversity scholarships, (6) Transfer student scholarships. Search available scholarships at scholarships.university.edu. Most require a separate application by February 15th. Some are automatically awarded based on admission application.",
  },
  {
    question: "How do I set up a payment plan?",
    answer: "To set up a payment plan: (1) Log into the student portal, (2) Go to 'Student Financial Services', (3) Select 'Payment Plan Enrollment', (4) Choose your plan (typically 4-5 monthly installments), (5) Pay the enrollment fee ($30), (6) Set up automatic payments. Payment plans must be established before the semester begins. A small interest rate may apply.",
  },

  // ==================== ACADEMIC SUPPORT ====================
  {
    question: "Where can I get tutoring help?",
    answer: "The Academic Success Center offers free tutoring in most subjects. Located in the Library, 2nd floor. Services include: (1) Drop-in tutoring (no appointment needed), (2) Scheduled one-on-one sessions, (3) Group study sessions, (4) Writing center assistance, (5) Math lab. Hours: Monday-Thursday 9am-8pm, Friday 9am-5pm, Sunday 2pm-8pm. Online tutoring also available through our virtual platform.",
  },
  {
    question: "How do I declare or change my major?",
    answer: "To declare or change your major: (1) Meet with an advisor in your intended department, (2) Discuss requirements and career paths, (3) Complete the 'Change of Major' form available at the Registrar's Office or online portal, (4) Obtain necessary signatures, (5) Submit to the Registrar. Most majors can be declared after completing 30 credits. Some competitive programs have additional requirements.",
  },
  {
    question: "What is the academic probation policy?",
    answer: "Students are placed on academic probation if their cumulative GPA falls below 2.0. While on probation: (1) You have one semester to raise your GPA above 2.0, (2) You must meet with an academic advisor, (3) You may be limited to 12-14 credit hours, (4) You must participate in academic success workshops. Failure to meet probation requirements may result in academic suspension.",
  },
  {
    question: "How do I request a transcript?",
    answer: "To request official transcripts: (1) Visit the Registrar's website and click 'Order Transcripts', (2) Create an account or log in, (3) Select delivery method (electronic or paper mail), (4) Pay the processing fee ($10 for electronic, $15 for paper), (5) Transcripts are processed within 2-3 business days. Unofficial transcripts are available instantly through the student portal at no cost.",
  },

  // ==================== CAMPUS LIFE ====================
  {
    question: "How do I apply for on-campus housing?",
    answer: "To apply for housing: (1) Complete the housing application at housing.university.edu, (2) Pay the $200 housing deposit, (3) Submit by May 1st for fall semester, (4) Complete the roommate preference survey, (5) Review and sign the housing contract. Room assignments are sent via email by July 1st. First-year students are required to live on campus. Housing is guaranteed for freshmen who apply by the deadline.",
  },
  {
    question: "What meal plan options are available?",
    answer: "Meal plan options include: (1) Unlimited Plan - unlimited dining hall access ($2,800/semester), (2) 19 Meals/Week - 19 meals plus $200 dining dollars ($2,500/semester), (3) 14 Meals/Week - 14 meals plus $300 dining dollars ($2,200/semester), (4) Block Plans - 150 or 100 meals per semester. All plans include dining dollars usable at campus cafes and restaurants. Plans can be changed during the first two weeks of the semester.",
  },
  {
    question: "How do I get a parking permit?",
    answer: "To get a parking permit: (1) Register your vehicle at parking.university.edu, (2) Upload proof of registration and insurance, (3) Select your parking zone based on residence/class standing, (4) Pay the semester fee ($150-$300 depending on zone), (5) Display the digital permit via the parking app or print physical permit. Permits are valid for the semester purchased. Overnight parking requires a separate permit.",
  },
  {
    question: "What student organizations are available?",
    answer: "The university has over 200 student organizations including: (1) Academic and professional clubs, (2) Cultural and diversity organizations, (3) Service and volunteer groups, (4) Sports clubs and recreation, (5) Arts and performance groups, (6) Religious and spiritual organizations, (7) Greek life. Browse all organizations at studentlife.university.edu. Most clubs hold interest meetings during the first two weeks of each semester.",
  },

  // ==================== TECHNOLOGY & IT ====================
  {
    question: "How do I access Wi-Fi on campus?",
    answer: "To connect to campus Wi-Fi: (1) Select 'University-WiFi' from available networks, (2) Open a browser - you'll be redirected to the login page, (3) Enter your university username and password, (4) Accept the terms of use, (5) You're connected! Your device will automatically connect in the future. For setup help, visit the IT Help Desk in the Library. Guest Wi-Fi (University-Guest) is available for visitors - no login required.",
  },
  {
    question: "How do I reset my university password?",
    answer: "To reset your password: (1) Go to password.university.edu, (2) Click 'Forgot Password', (3) Enter your username or university email, (4) Choose verification method (email, text, or security questions), (5) Follow the prompts to create a new password. Passwords must be at least 8 characters with uppercase, lowercase, number, and special character. For issues, contact IT Help Desk at 555-1234 or helpdesk@university.edu.",
  },
  {
    question: "What software is available for free to students?",
    answer: "Students get free access to: (1) Microsoft Office 365 (Word, Excel, PowerPoint, Teams), (2) Adobe Creative Cloud (Photoshop, Illustrator, Premiere), (3) MATLAB and other engineering software, (4) Antivirus protection, (5) Cloud storage (1TB OneDrive), (6) Statistical software (SPSS, R, SAS). Download from software.university.edu using your university login. Some software requires department approval.",
  },
  {
    question: "How do I access my university email?",
    answer: "Access your university email at email.university.edu or through Outlook/Gmail apps. Your email address is firstname.lastname@university.edu. Login with your university credentials. Email is automatically created when you're admitted. Storage limit is 50GB. You can forward university email to a personal account, but all official communication will be sent to your university email. Check it regularly!",
  },

  // ==================== LIBRARY SERVICES ====================
  {
    question: "What are the library hours?",
    answer: "Library hours vary by semester. During fall/spring: Monday-Thursday 7am-midnight, Friday 7am-8pm, Saturday 9am-8pm, Sunday 10am-midnight. During finals week: 24/7 access. Summer hours: Monday-Friday 8am-6pm, Saturday-Sunday 10am-6pm. Holiday and break hours vary - check library.university.edu for current hours. Your student ID grants 24/7 access during regular semester.",
  },
  {
    question: "How do I request books from other libraries?",
    answer: "Use Interlibrary Loan (ILL) service: (1) Log into the library catalog, (2) Search for the item, (3) Click 'Request via ILL' if not available locally, (4) Fill out the request form, (5) You'll receive an email when the item arrives (typically 5-7 business days), (6) Pick up at the circulation desk. Most items can be kept for 3 weeks. Service is free for students. Request articles, books, and media not in our collection.",
  },
  {
    question: "Can I reserve study rooms in the library?",
    answer: "Yes! Reserve group study rooms online: (1) Go to library.university.edu/rooms, (2) Select date and time (max 3 hours), (3) Choose room size (2-8 people), (4) Confirm reservation with your student ID, (5) Check in at the circulation desk within 15 minutes of reservation time. Rooms have whiteboards, screens for presentations, and power outlets. Reservations can be made up to 2 weeks in advance.",
  },

  // ==================== HEALTH & WELLNESS ====================
  {
    question: "What health services are available on campus?",
    answer: "The Student Health Center provides: (1) Primary care and sick visits, (2) Immunizations and vaccines, (3) Mental health counseling, (4) Women's health services, (5) Allergy shots, (6) COVID testing, (7) Pharmacy services. Located in the Wellness Building. Hours: Monday-Friday 8am-5pm. Appointments recommended but walk-ins accepted. Services are covered by the health fee included in tuition. Insurance filed for additional services.",
  },
  {
    question: "How do I schedule a counseling appointment?",
    answer: "To schedule counseling: (1) Call the Counseling Center at 555-HELP (4357), (2) Complete the initial intake form online at counseling.university.edu, (3) Attend your intake appointment (30 minutes), (4) You'll be matched with a counselor, (5) Schedule ongoing sessions. First 12 sessions are free. Crisis counseling available 24/7 through the campus hotline. All services are confidential.",
  },
  {
    question: "What should I do if I feel unsafe on campus?",
    answer: "If you feel unsafe: (1) Call Campus Police immediately at 911 or 555-1111, (2) Use emergency blue light phones located throughout campus, (3) Request a SafeWalk escort service (555-WALK) for walking to your car or dorm (available 7pm-3am), (4) Download the university safety app for one-touch emergency calling, (5) Report incidents to the Dean of Students Office. Campus police operate 24/7.",
  },

  // ==================== CAREER SERVICES ====================
  {
    question: "How can Career Services help me?",
    answer: "Career Services offers: (1) Resume and cover letter reviews, (2) Mock interviews and interview prep, (3) Career counseling and major exploration, (4) Job and internship search assistance, (5) Career fairs (Fall and Spring), (6) Networking events with alumni, (7) Graduate school application help. Services are free for all students and alumni. Schedule appointments through Handshake or visit the Career Center, Student Union 3rd floor.",
  },
  {
    question: "How do I find internships?",
    answer: "To find internships: (1) Create a Handshake account at university.joinhandshake.com, (2) Build your profile and upload resume, (3) Search internship postings filtered by major/interest, (4) Attend career fairs and networking events, (5) Connect with alumni in your field, (6) Check with your academic department for field-specific opportunities, (7) Apply early - many summer internships post in fall. Career Services offers internship search workshops.",
  },

  // ==================== GENERAL INFORMATION ====================
  {
    question: "Where can I print documents on campus?",
    answer: "Printing is available at: (1) Library - all floors (color and black/white), (2) Computer labs in academic buildings, (3) Student Union print center, (4) Residence hall computer lounges. Cost: $0.10/page black & white, $0.50/page color. Add funds to your print account through the student portal. Initial $5 print credit included with tuition. Use your student ID to release print jobs at any printer.",
  },
  {
    question: "How do I get a replacement student ID card?",
    answer: "To replace a lost/stolen ID: (1) Visit the ID Card Office in the Student Union, (2) Bring a photo ID (driver's license or passport), (3) Pay the replacement fee ($20), (4) Photo will be taken if needed, (5) Card printed while you wait. Report lost cards immediately to deactivate them. Temporary IDs available for dining/building access while waiting for replacement. First ID is free for new students.",
  },
  {
    question: "What is the academic calendar?",
    answer: "Key academic dates: Fall semester runs late August through mid-December. Spring semester runs mid-January through early May. Summer sessions: May-June (Session I), July-August (Session II). Important dates include: Add/drop period (first 2 weeks), Midterms (week 8), Thanksgiving break (last week November), Final exams (last week of semester). Complete calendar available at registrar.university.edu/calendar.",
  },
  {
    question: "How do I withdraw from the university?",
    answer: "To withdraw from the university: (1) Meet with your academic advisor to discuss options, (2) Meet with financial aid if receiving aid, (3) Complete the official withdrawal form at the Dean of Students Office, (4) Return residence hall keys if living on campus, (5) Settle any outstanding financial obligations. Withdrawing before 60% of semester may affect financial aid. Consider taking a leave of absence instead - easier to return later.",
  },
];

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.cyan}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${colors.blue}${msg}${colors.reset}\n`),
};

async function addFAQ(question, answer, index, total) {
  try {
    const response = await fetch(`${API_URL}/assistant/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ question, answer }),
    });

    const data = await response.json();

    if (response.ok) {
      log.success(`[${index + 1}/${total}] Added: "${question.substring(0, 50)}..."`);
      return { success: true, question };
    } else {
      log.error(`[${index + 1}/${total}] Failed: ${data.message || "Unknown error"}`);
      return { success: false, question, error: data.message };
    }
  } catch (error) {
    log.error(`[${index + 1}/${total}] Network error: ${error.message}`);
    return { success: false, question, error: error.message };
  }
}

async function trainKnowledgeBase() {
  log.header("🤖 AI Knowledge Base Auto-Training Script");

  if (TOKEN === "your_admin_token_here") {
    log.error("Please set ADMIN_TOKEN in your .env file!");
    log.info("Add this line to your .env file:");
    log.info("  ADMIN_TOKEN=your_actual_token_here");
    log.info("\nOr get your token by:");
    log.info("  1. Login as admin in the browser");
    log.info("  2. Open DevTools console (F12)");
    log.info("  3. Type: localStorage.getItem('token')");
    process.exit(1);
  }

  log.info(`API URL: ${API_URL}`);
  log.info(`Total FAQs to add: ${FAQ_DATABASE.length}`);
  log.info("Starting training process...\n");

  const results = {
    total: FAQ_DATABASE.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  for (let i = 0; i < FAQ_DATABASE.length; i++) {
    const { question, answer } = FAQ_DATABASE[i];
    const result = await addFAQ(question, answer, i, FAQ_DATABASE.length);

    if (result.success) {
      results.successful++;
    } else {
      results.failed++;
      results.errors.push({
        question: result.question,
        error: result.error,
      });
    }

    if (i < FAQ_DATABASE.length - 1) {
      await delay(500);
    }
  }

  log.header("📊 Training Summary");
  console.log(`Total FAQs:      ${results.total}`);
  console.log(`${colors.green}Successful:      ${results.successful}${colors.reset}`);
  console.log(`${colors.red}Failed:          ${results.failed}${colors.reset}`);

  if (results.errors.length > 0) {
    log.header("❌ Failed Items");
    results.errors.forEach((err, idx) => {
      console.log(`${idx + 1}. ${err.question.substring(0, 60)}...\n   Error: ${err.error}\n`);
    });
  }

  log.header("✅ Training Complete!");
  log.info("The AI assistant is now trained with 36 university FAQs!");
}

trainKnowledgeBase().catch((error) => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error.message);
  process.exit(1);
});

export { FAQ_DATABASE, trainKnowledgeBase };
ENDOFFILE

echo "✅ trainKnowledgeBase.js created successfully!"
echo "📝 Contains 36 comprehensive FAQs covering 10 categories"
echo ""
echo "Next steps:"
echo ""
echo "2. Run the training script:"
echo "   node trainKnowledgeBase.js"
