(() => {
  const getApiBaseUrl = () => {
    const localHosts = new Set(["localhost", "127.0.0.1", "::1"]);
    const separateLocalFrontend = localHosts.has(window.location.hostname) && window.location.port && window.location.port !== "5000";
    if (window.location.protocol === "file:" || separateLocalFrontend) return "http://localhost:5000/api";
    return `${window.location.origin}/api`;
  };

  const getStoredId = (key) => {
    try {
      let value = window.localStorage.getItem(key);
      if (!value) {
        value = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        window.localStorage.setItem(key, value);
      }
      return value;
    } catch {
      return "anonymous";
    }
  };

  const trackEvent = (eventName, metadata = {}) => {
    const payload = {
      eventName,
      pageUrl: `${window.location.pathname}${window.location.search}`,
      sessionId: getStoredId("albero-session-id"),
      anonymousId: getStoredId("albero-anonymous-id"),
      metadata
    };

    window.fetch(`${getApiBaseUrl()}/analytics/events`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(() => {});
  };

  const initAnalytics = () => {
    trackEvent("page_view");
    document.addEventListener("click", (event) => {
      const target = event.target instanceof Element ? event.target.closest("a, button") : null;
      if (!(target instanceof HTMLElement)) return;
      const label = (target.getAttribute("aria-label") || target.textContent || "").trim().slice(0, 120);
      if (label) trackEvent("interaction", { label, href: target.getAttribute("href") || "" });
    }, { passive: true });
  };

  const localeTranslations = {
    "Home": "হোম",
    "Company": "কোম্পানি",
    "Technology": "প্রযুক্তি",
    "Solutions": "সমাধান",
    "Products": "পণ্য",
    "Research": "গবেষণা",
    "Learning Zone": "লার্নিং জোন",
    "Careers": "ক্যারিয়ার",
    "Contact": "যোগাযোগ",
    "Quotation": "কোটেশন",
    "Client Portal": "ক্লায়েন্ট পোর্টাল",
    "Privacy Policy": "গোপনীয়তা নীতি",
    "Albero Studio | Secure Intelligence, Engineered in Bangladesh": "আলবেরো স্টুডিও | বাংলাদেশে নির্মিত নিরাপদ বুদ্ধিমত্তা",
    "Company | Albero Studio": "কোম্পানি | আলবেরো স্টুডিও",
    "Technology & Solutions | Albero Studio": "প্রযুক্তি ও সমাধান | আলবেরো স্টুডিও",
    "Products in Development | Albero Studio": "উন্নয়নাধীন পণ্য | আলবেরো স্টুডিও",
    "Research & Insights | Albero Studio": "গবেষণা ও অন্তর্দৃষ্টি | আলবেরো স্টুডিও",
    "Research Article | Albero Studio": "গবেষণা নিবন্ধ | আলবেরো স্টুডিও",
    "Capability Notes | Albero Studio": "সক্ষমতার নোট | আলবেরো স্টুডিও",
    "Capability Note | Albero Studio": "সক্ষমতার নোট | আলবেরো স্টুডিও",
    "Careers | Albero Studio": "ক্যারিয়ার | আলবেরো স্টুডিও",
    "Contact | Albero Studio": "যোগাযোগ | আলবেরো স্টুডিও",
    "Learning Zone | Albero Studio": "লার্নিং জোন | আলবেরো স্টুডিও",
    "Request a Quotation | Albero Studio": "কোটেশন অনুরোধ | আলবেরো স্টুডিও",
    "Client Portal | Albero Studio": "ক্লায়েন্ট পোর্টাল | আলবেরো স্টুডিও",
    "Privacy Policy | Albero Studio": "গোপনীয়তা নীতি | আলবেরো স্টুডিও",
    "Search": "খুঁজুন",
    "Search Albero Studio": "আলবেরো স্টুডিও খুঁজুন",
    "Open menu": "মেনু খুলুন",
    "Toggle menu": "মেনু টগল করুন",
    "Close search": "সার্চ বন্ধ করুন",
    "Switch to English": "ইংরেজিতে দেখুন",
    "বাংলা ভাষায় দেখুন": "বাংলায় দেখুন",
    "Search pages and topics": "পেজ ও বিষয় খুঁজুন",
    "Search pages, services, or topics...": "পেজ, সেবা বা বিষয় খুঁজুন...",
    "No matching page or topic found.": "মিলে যাওয়া কোনো পেজ বা বিষয় পাওয়া যায়নি।",
    "SEARCH ALBERO": "আলবেরো সার্চ",
    "What are you looking for?": "আপনি কী খুঁজছেন?",
    "Overview": "সংক্ষিপ্ত পরিচিতি",
    "About us": "আমাদের সম্পর্কে",
    "Capabilities": "সক্ষমতা",
    "In development": "উন্নয়নাধীন",
    "Insights": "চিন্তা ও গবেষণা",
    "Courses": "কোর্স",
    "Talent network": "ট্যালেন্ট নেটওয়ার্ক",
    "Start a conversation": "আলাপ শুরু করুন",
    "Project planning": "প্রজেক্ট পরিকল্পনা",
    "Workspace": "ওয়ার্কস্পেস",

    "About Albero Studio": "আলবেরো স্টুডিও সম্পর্কে",
    "Company Profile": "কোম্পানি প্রোফাইল",
    "Download Albero Studio company profile PDF": "আলবেরো স্টুডিও কোম্পানি প্রোফাইল PDF ডাউনলোড করুন",
    "Previous founder": "আগের প্রতিষ্ঠাতা",
    "Next founder": "পরের প্রতিষ্ঠাতা",
    "Choose a founder": "প্রতিষ্ঠাতা বেছে নিন",
    "Meet the founders.": "প্রতিষ্ঠাতাদের সঙ্গে পরিচিত হোন।",
    "THE PEOPLE BEHIND THE WORK": "কাজের পেছনের মানুষ",
    "Three people, one shared direction: clear thinking, responsible technology, and work that lasts.": "তিনজন মানুষ, একটি অভিন্ন দিকনির্দেশনা: পরিষ্কার চিন্তা, দায়িত্বশীল প্রযুক্তি এবং দীর্ঘস্থায়ী কাজ।",
    "We are building technological capability.": "আমরা প্রযুক্তিগত সক্ষমতা তৈরি করছি।",
    "Albero Studio is a Bangladesh-based technology company focused on Cybersecurity, Artificial Intelligence, Machine Learning, and advanced software engineering.": "আলবেরো স্টুডিও বাংলাদেশভিত্তিক একটি প্রযুক্তি প্রতিষ্ঠান, যার লক্ষ্য সাইবার সিকিউরিটি, কৃত্রিম বুদ্ধিমত্তা, মেশিন লার্নিং এবং উন্নত সফটওয়্যার ইঞ্জিনিয়ারিং।",
    "Security from the beginning": "শুরু থেকেই নিরাপত্তা",
    "Research before reinvention": "পুনরাবিষ্কারের আগে গবেষণা",
    "Building useful progress from Bangladesh.": "বাংলাদেশ থেকে কার্যকর অগ্রগতি তৈরি করছি।",
    "Lutful Khabir Raufu": "লুৎফুল কবির রাউফু",
    "MD Rounok Chowdhury": "এমডি রৌনক চৌধুরী",
    "Badrul Alam Leon": "বদরুল আলম লিওন",
    "Founder": "প্রতিষ্ঠাতা",
    "FOUNDER": "প্রতিষ্ঠাতা",
    "Co-Founder": "সহ-প্রতিষ্ঠাতা",
    "CO-FOUNDER": "সহ-প্রতিষ্ঠাতা",
    "Badrul Alam Leon · Co-Founder": "বদরুল আলম লিওন · সহ-প্রতিষ্ঠাতা",
    "Building useful progress from Bangladesh.": "বাংলাদেশ থেকে কার্যকর অগ্রগতি তৈরি করছি।",
    "Useful technology begins with a real problem, clear thinking, and the discipline to keep learning.": "কার্যকর প্রযুক্তির শুরু হয় বাস্তব সমস্যা, পরিষ্কার চিন্তা এবং শেখার ধারাবাহিকতা থেকে।",

    "Technology Stack": "প্রযুক্তির স্ট্যাক",
    "We choose tools according to the problem, with secure development practices and maintainable infrastructure as constants.": "সমস্যা অনুযায়ী আমরা প্রযুক্তি বেছে নিই—নিরাপদ ডেভেলপমেন্ট পদ্ধতি ও রক্ষণাবেক্ষণযোগ্য অবকাঠামো সবসময় অগ্রাধিকার পায়।",
    "Python": "পাইথন",
    "PyTorch": "পাইটর্চ",
    "FastAPI": "ফাস্টএপিআই",
    "PostgreSQL": "পোস্টগ্রিএসকিউএল",
    "Docker": "ডকার",
    "OWASP": "ওয়াস্প",
    "Technology for secure, useful progress.": "নিরাপদ ও কার্যকর অগ্রগতির জন্য প্রযুক্তি।",
    "TECHNOLOGY DOMAINS": "প্রযুক্তির ক্ষেত্রসমূহ",
    "Where We Engineer": "যেখানে আমরা ইঞ্জিনিয়ারিং করি",
    "Technology domains for serious systems": "গুরুত্বপূর্ণ সিস্টেমের জন্য প্রযুক্তির ক্ষেত্র",
    "Seven connected disciplines, brought together to build secure, intelligent, and useful systems.": "নিরাপদ, বুদ্ধিমান ও কার্যকর সিস্টেম তৈরি করতে সাতটি সংযুক্ত দক্ষতা একসঙ্গে কাজ করে।",
    "Cybersecurity": "সাইবার সিকিউরিটি",
    "Artificial Intelligence": "কৃত্রিম বুদ্ধিমত্তা",
    "Machine Learning": "মেশিন লার্নিং",
    "Data Engineering": "ডেটা ইঞ্জিনিয়ারিং",
    "Cloud and Data Systems": "ক্লাউড ও ডেটা সিস্টেম",
    "Secure Software Engineering": "নিরাপদ সফটওয়্যার ইঞ্জিনিয়ারিং",
    "Research & Development": "গবেষণা ও উন্নয়ন",
    "Application security, network and cloud security, assessment, threat intelligence, IAM, privacy engineering, and AI security.": "অ্যাপ্লিকেশন, নেটওয়ার্ক ও ক্লাউড নিরাপত্তা, মূল্যায়ন, থ্রেট ইন্টেলিজেন্স, IAM, প্রাইভেসি ইঞ্জিনিয়ারিং ও AI নিরাপত্তা।",
    "AI assistants, document intelligence, predictive systems, computer vision, NLP, and workflow automation.": "AI অ্যাসিস্ট্যান্ট, ডকুমেন্ট ইন্টেলিজেন্স, প্রেডিক্টিভ সিস্টেম, কম্পিউটার ভিশন, NLP ও ওয়ার্কফ্লো অটোমেশন।",
    "Predictive analytics, deep learning, natural language processing, computer vision, recommendations, and data intelligence.": "প্রেডিক্টিভ অ্যানালিটিক্স, ডিপ লার্নিং, ন্যাচারাল ল্যাঙ্গুয়েজ প্রসেসিং, কম্পিউটার ভিশন, রেকমেন্ডেশন ও ডেটা ইন্টেলিজেন্স।",
    "Network Security Essentials": "নেটওয়ার্ক সিকিউরিটির ভিত্তি",
    "Secure APIs, maintainable backend systems, data platforms, integrations, and cloud-based software foundations.": "নিরাপদ API, রক্ষণাবেক্ষণযোগ্য ব্যাকএন্ড সিস্টেম, ডেটা প্ল্যাটফর্ম, ইন্টিগ্রেশন ও ক্লাউডভিত্তিক সফটওয়্যার ভিত্তি।",
    "Automation": "অটোমেশন",
    "Intelligent Systems": "ইন্টেলিজেন্ট সিস্টেম",
    "Experimental technology, applied research, emerging computing, open-source learning, and intelligent systems.": "পরীক্ষামূলক প্রযুক্তি, প্রয়োগভিত্তিক গবেষণা, নতুন কম্পিউটিং, ওপেন-সোর্স শেখা ও বুদ্ধিমান সিস্টেম।",
    "PROTECT": "সুরক্ষা",
    "COMPUTE": "গণনা",
    "ENGINEER": "ইঞ্জিনিয়ারিং",
    "CREATE": "তৈরি",
    "Protect · Compute · Create": "সুরক্ষা · গণনা · তৈরি",

    "Products in Development": "উন্নয়নাধীন পণ্য",
    "FROM RESEARCH TO PRODUCT": "গবেষণা থেকে পণ্য",
    "A clear path from useful research to real products.": "কার্যকর গবেষণা থেকে বাস্তব পণ্যে যাওয়ার একটি পরিষ্কার পথ।",
    "PRODUCT PIPELINE": "পণ্য তৈরির ধাপ",
    "Follow the work as it develops.": "কাজের অগ্রগতি অনুসরণ করুন।",
    "Research": "গবেষণা",
    "Prototype": "প্রোটোটাইপ",
    "Product": "পণ্য",
    "Build what is ready": "যা প্রস্তুত, তা তৈরি করি",
    "Placeholders for future proprietary platforms shaped by research, engineering practice, and real-world learning.": "গবেষণা, ইঞ্জিনিয়ারিং অনুশীলন ও বাস্তব অভিজ্ঞতা থেকে তৈরি ভবিষ্যৎ নিজস্ব প্ল্যাটফর্মের প্রস্তুতি।",
    "Exploring practical tools for clearer security signals, safer systems, and better operational decisions.": "নিরাপত্তার সংকেত পরিষ্কার করা, সিস্টেমকে নিরাপদ করা এবং ভালো সিদ্ধান্ত নিতে ব্যবহারিক টুল নিয়ে কাজ করছি।",
    "Early work around AI-assisted workflows and domain-specific systems that help people do meaningful work.": "মানুষকে অর্থবহ কাজ করতে সহায়তা করে এমন AI-সহায়িত ওয়ার্কফ্লো ও নির্দিষ্ট ক্ষেত্রভিত্তিক সিস্টেমের প্রাথমিক কাজ।",
    "Coming Soon": "শীঘ্রই আসছে",
    "Coming soon": "শীঘ্রই আসছে",
    "PRIORITY": "অগ্রাধিকার",
    "FOCUS": "ফোকাস",
    "VISION": "ভিশন",
    "Long-term vision": "দীর্ঘমেয়াদি ভিশন",
    "We Are Building for the Next Decade.": "আমরা আগামী দশকের জন্য তৈরি করছি।",
    "Each phase creates the foundation for the next.": "প্রতিটি ধাপ পরের ধাপের ভিত্তি তৈরি করে।",

    "Research Desk": "গবেষণা ডেস্ক",
    "Research desk": "গবেষণা ডেস্ক",
    "Ideas, evidence, and useful technology": "আইডিয়া, প্রমাণ এবং কার্যকর প্রযুক্তি",
    "Updated weekly": "প্রতি সপ্তাহে আপডেট",
    "ALBERO STUDIO / INSIGHTS": "আলবেরো স্টুডিও / অন্তর্দৃষ্টি",
    "Ideas that make technology more useful.": "প্রযুক্তিকে আরও কার্যকর করে এমন আইডিয়া।",
    "Reporting, field notes, and practical perspectives on cybersecurity, AI, engineering, and the systems people depend on.": "সাইবার সিকিউরিটি, AI, ইঞ্জিনিয়ারিং এবং মানুষের নির্ভরশীল সিস্টেম নিয়ে প্রতিবেদন, মাঠ-নোট ও ব্যবহারিক দৃষ্টিভঙ্গি।",
    "All stories": "সব গল্প",
    "Recent dispatches": "সাম্প্রতিক প্রতিবেদন",
    "Browse by topic": "বিষয় অনুযায়ী দেখুন",
    "All research": "সব গবেষণা",
    "Digital safety": "ডিজিটাল নিরাপত্তা",
    "Digital Safety": "ডিজিটাল নিরাপত্তা",
    "Read More": "আরও পড়ুন",
    "03 Apr, 2026": "০৩ এপ্রিল, ২০২৬",
    "29 Mar, 2026": "২৯ মার্চ, ২০২৬",
    "22 Mar, 2026": "২২ মার্চ, ২০২৬",
    "12 Mar, 2026": "১২ মার্চ, ২০২৬",
    "05 Mar, 2026": "০৫ মার্চ, ২০২৬",
    "19 Feb, 2026": "১৯ ফেব্রুয়ারি, ২০২৬",
    "| By Albero Team": "| আলবেরো টিম",
    "Security as a design constraint, not a checklist": "চেকলিস্ট নয়, ডিজাইনের শর্ত হিসেবে নিরাপত্তা",
    "Why secure systems begin with architecture, assumptions, and the people who will operate them.": "নিরাপদ সিস্টেমের শুরু হয় আর্কিটেকচার, অনুমান এবং যারা এটি পরিচালনা করবেন তাদের বোঝাপড়া থেকে।",
    "What makes an AI system useful beyond the model": "মডেলের বাইরেও AI সিস্টেমকে কার্যকর করে কী",
    "Reliable AI depends on data, evaluation, integration, monitoring, and the decisions around it.": "নির্ভরযোগ্য AI নির্ভর করে ডেটা, মূল্যায়ন, ইন্টিগ্রেশন, মনিটরিং এবং সংশ্লিষ্ট সিদ্ধান্তের ওপর।",
    "From model training to reliable machine learning systems": "মডেল ট্রেনিং থেকে নির্ভরযোগ্য মেশিন লার্নিং সিস্টেম",
    "The engineering decisions that help models remain useful after they leave the notebook.": "নোটবুকের বাইরে যাওয়ার পরও মডেলকে কার্যকর রাখতে যে ইঞ্জিনিয়ারিং সিদ্ধান্তগুলো সাহায্য করে।",
    "Engineering for maintainability, not just launch day": "শুধু লঞ্চের দিন নয়, রক্ষণাবেক্ষণের জন্য ইঞ্জিনিয়ারিং",
    "Why architecture, testing, observability, and ownership matter long after the first release.": "প্রথম রিলিজের অনেক পরেও আর্কিটেকচার, টেস্টিং, অবজারভেবিলিটি ও মালিকানা কেন গুরুত্বপূর্ণ।",
    "How disciplined exploration helps teams choose better problems, technologies, and paths to build.": "শৃঙ্খলিত অনুসন্ধান কীভাবে টিমকে ভালো সমস্যা, প্রযুক্তি ও নির্মাণের পথ বেছে নিতে সাহায্য করে।",
    "Digital safety in an increasingly intelligent world": "ক্রমশ বুদ্ধিমান হয়ে ওঠা বিশ্বে ডিজিটাল নিরাপত্তা",
    "A practical look at the responsibilities that come with building systems people and organizations depend on.": "মানুষ ও প্রতিষ্ঠান যে সিস্টেমের ওপর নির্ভর করে, তা তৈরির দায়িত্বগুলোকে ব্যবহারিকভাবে দেখা।",

    "LEARN WITH ALBERO": "আলবেরোর সঙ্গে শিখুন",
    "Learning Zone": "লার্নিং জোন",
    "IT COURSES": "আইটি কোর্স",
    "Build practical skills for the digital world.": "ডিজিটাল বিশ্বের জন্য ব্যবহারিক দক্ষতা তৈরি করুন।",
    "Choose a focused learning path across cybersecurity, software, cloud, data, and intelligent systems. Each course is designed to move from clear foundations to practical work.": "সাইবার সিকিউরিটি, সফটওয়্যার, ক্লাউড, ডেটা ও ইন্টেলিজেন্ট সিস্টেমে মনোযোগী শেখার পথ বেছে নিন। প্রতিটি কোর্স পরিষ্কার ভিত্তি থেকে ব্যবহারিক কাজের দিকে এগোতে তৈরি।",
    "Cybersecurity Fundamentals": "সাইবার সিকিউরিটির ভিত্তি",
    "Python for Automation": "অটোমেশনের জন্য পাইথন",
    "Web Development Foundations": "ওয়েব ডেভেলপমেন্টের ভিত্তি",
    "Database & SQL Foundations": "ডেটাবেস ও SQL-এর ভিত্তি",
    "Cloud Computing Fundamentals": "ক্লাউড কম্পিউটিংয়ের ভিত্তি",
    "AI & Machine Learning Foundations": "AI ও মেশিন লার্নিংয়ের ভিত্তি",
    "Data Analytics with Python": "পাইথন দিয়ে ডেটা অ্যানালিটিক্স",
    "Ethical Hacking & Penetration Testing": "এথিক্যাল হ্যাকিং ও পেনিট্রেশন টেস্টিং",
    "Secure Software Engineering": "নিরাপদ সফটওয়্যার ইঞ্জিনিয়ারিং",
    "Network Security Essentials": "নেটওয়ার্ক সিকিউরিটির ভিত্তি",
    "Hands-on": "হাতে-কলমে",
    "Beginner friendly": "শুরুর জন্য উপযোগী",
    "Certificate path": "সার্টিফিকেট পথ",
    "Project based": "প্রজেক্টভিত্তিক",
    "Popular": "জনপ্রিয়",
    "Advanced": "অ্যাডভান্সড",
    "Free trial": "ফ্রি ট্রায়াল",
    "Job skills": "চাকরির দক্ষতা",
    "Skills you'll gain:": "আপনি যে দক্ষতাগুলো অর্জন করবেন:",
    "Python syntax, APIs, data handling, scripts, and workflow automation.": "পাইথন সিনট্যাক্স, API, ডেটা হ্যান্ডলিং, স্ক্রিপ্ট ও ওয়ার্কফ্লো অটোমেশন।",
    "HTML, CSS, JavaScript, accessibility, responsive layouts, and clean structure.": "HTML, CSS, JavaScript, অ্যাক্সেসিবিলিটি, রেসপনসিভ লেআউট ও পরিষ্কার কাঠামো।",
    "Queries, schemas, joins, relational data, and practical database design.": "কোয়েরি, স্কিমা, জয়েন, রিলেশনাল ডেটা ও ব্যবহারিক ডেটাবেস ডিজাইন।",
    "Cloud services, deployment, infrastructure, cost, and security decisions.": "ক্লাউড সার্ভিস, ডেপ্লয়মেন্ট, অবকাঠামো, খরচ ও নিরাপত্তা-সংক্রান্ত সিদ্ধান্ত।",
    "Data preparation, model thinking, evaluation, and responsible AI workflows.": "ডেটা প্রস্তুতি, মডেল নিয়ে চিন্তা, মূল্যায়ন ও দায়িত্বশীল AI ওয়ার্কফ্লো।",
    "Data cleaning, visualization, structured analysis, and clear reporting.": "ডেটা পরিষ্কার করা, ভিজ্যুয়ালাইজেশন, কাঠামোবদ্ধ বিশ্লেষণ ও পরিষ্কার রিপোর্টিং।",
    "Reconnaissance, testing methods, validation, reporting, and remediation.": "রিকনাইস্যান্স, টেস্টিং পদ্ধতি, যাচাই, রিপোর্টিং ও প্রতিকার।",
    "Secure architecture, coding, testing, deployment, and maintenance.": "নিরাপদ আর্কিটেকচার, কোডিং, টেস্টিং, ডেপ্লয়মেন্ট ও রক্ষণাবেক্ষণ।",

    "Build the Future With Us.": "আমাদের সঙ্গে ভবিষ্যৎ গড়ুন।",
    "THE TALENT NETWORK": "ট্যালেন্ট নেটওয়ার্ক",
    "Find your place in the network.": "এই নেটওয়ার্কে আপনার জায়গা খুঁজে নিন।",
    "We are growing deliberately. These roles are examples of the talent network we intend to build; they are placeholders until an opening is published.": "আমরা পরিকল্পিতভাবে এগোচ্ছি। নিচের ভূমিকা আমাদের গড়ে তুলতে চাওয়া ট্যালেন্ট নেটওয়ার্কের উদাহরণ; নির্দিষ্ট নিয়োগ প্রকাশ না হওয়া পর্যন্ত এগুলো সম্ভাব্য ভূমিকা হিসেবে থাকছে।",
    "Cybersecurity Engineer": "সাইবার সিকিউরিটি ইঞ্জিনিয়ার",
    "AI / Machine Learning Engineer": "AI / মেশিন লার্নিং ইঞ্জিনিয়ার",
    "Software Engineer": "সফটওয়্যার ইঞ্জিনিয়ার",
    "Research Intern": "রিসার্চ ইন্টার্ন",
    "Cybersecurity Intern": "সাইবার সিকিউরিটি ইন্টার্ন",
    "AI / ML Intern": "AI / ML ইন্টার্ন",
    "Secure systems, assessments, and practical security automation.": "নিরাপদ সিস্টেম, মূল্যায়ন ও ব্যবহারিক নিরাপত্তা অটোমেশন।",
    "Data, model development, evaluation, and reliable AI integration.": "ডেটা, মডেল তৈরি, মূল্যায়ন ও নির্ভরযোগ্য AI ইন্টিগ্রেশন।",
    "Maintainable APIs, platforms, tools, and product foundations.": "রক্ষণাবেক্ষণযোগ্য API, প্ল্যাটফর্ম, টুল ও পণ্যের ভিত্তি।",
    "Explore emerging technologies and turn questions into knowledge.": "উদীয়মান প্রযুক্তি অনুসন্ধান করে প্রশ্নকে জ্ঞানে রূপ দিন।",
    "Learn through investigation, documentation, testing, and experimentation.": "অনুসন্ধান, ডকুমেন্টেশন, টেস্টিং ও পরীক্ষার মাধ্যমে শিখুন।",
    "Build experience with data, experiments, evaluation, and applied systems.": "ডেটা, পরীক্ষা, মূল্যায়ন ও প্রয়োগভিত্তিক সিস্টেমে অভিজ্ঞতা তৈরি করুন।",
    "Eight divisions. One connected network.": "আটটি বিভাগ। একটি সংযুক্ত নেটওয়ার্ক।",
    "Our future talent network is open to curious people across Bangladesh.": "বাংলাদেশের যেকোনো প্রান্তের কৌতূহলী মানুষের জন্য আমাদের ভবিষ্যৎ ট্যালেন্ট নেটওয়ার্ক উন্মুক্ত।",
    "Dhaka": "ঢাকা",
    "Chattogram": "চট্টগ্রাম",
    "Rajshahi": "রাজশাহী",
    "Khulna": "খুলনা",
    "Barishal": "বরিশাল",
    "Sylhet": "সিলেট",
    "Rangpur": "রংপুর",
    "Mymensingh": "ময়মনসিংহ",
    "Talent network": "ট্যালেন্ট নেটওয়ার্ক",
    "Curious, thoughtful, and ready to build?": "কৌতূহলী, চিন্তাশীল এবং তৈরি করতে প্রস্তুত?",
    "Send a short introduction, your areas of interest, and links to work you are comfortable sharing.": "নিজের সংক্ষিপ্ত পরিচয়, আগ্রহের ক্ষেত্র এবং শেয়ার করতে স্বাচ্ছন্দ্যবোধ করেন এমন কাজের লিংক পাঠান।",
    "Join Our Talent Network": "আমাদের ট্যালেন্ট নেটওয়ার্কে যোগ দিন",

    "Let’s Build Something Meaningful.": "চলুন অর্থবহ কিছু তৈরি করি।",
    "Let’s build something meaningful.": "চলুন অর্থবহ কিছু তৈরি করি।",
    "Tell us what you are trying to understand, protect, automate, or build.": "আপনি কী বুঝতে, সুরক্ষিত করতে, অটোমেট করতে বা তৈরি করতে চাইছেন—আমাদের জানান।",
    "Book Your Appointment": "অ্যাপয়েন্টমেন্ট বুক করুন",
    "Book your appointment for a clear next step.": "পরবর্তী পরিষ্কার পদক্ষেপের জন্য আপনার অ্যাপয়েন্টমেন্ট বুক করুন।",
    "Start a Consultation": "কনসালটেশন শুরু করুন",
    "Start a focused conversation about your AI, data, security, or technology requirement.": "আপনার AI, ডেটা, নিরাপত্তা বা প্রযুক্তিগত প্রয়োজন নিয়ে একটি নির্দিষ্ট আলোচনা শুরু করুন।",
    "Name": "নাম",
    "Email": "ইমেইল",
    "Email*": "ইমেইল*",
    "Organization": "প্রতিষ্ঠান",
    "Subject": "বিষয়",
    "Message": "বার্তা",
    "Tell us about your problem, idea, or requirement.": "আপনার সমস্যা, আইডিয়া বা প্রয়োজনীয়তা সম্পর্কে জানান।",
    "Send Message": "বার্তা পাঠান",
    "Contact Details": "যোগাযোগের তথ্য",
    "Google Maps": "গুগল ম্যাপস",
    "Location": "ঠিকানা",
    "Company Email": "কোম্পানির ইমেইল",
    "Phone": "ফোন",
    "Bangladesh-based technology company.": "বাংলাদেশভিত্তিক প্রযুক্তি প্রতিষ্ঠান।",
    "Office details coming soon.": "অফিসের বিস্তারিত শীঘ্রই জানানো হবে।",
    "Open in Google Maps": "গুগল ম্যাপে খুলুন",
    "Online or in-person · By appointment": "অনলাইনে বা সরাসরি · অ্যাপয়েন্টমেন্টের মাধ্যমে",
    "30–45 minute discovery call": "৩০–৪৫ মিনিটের প্রাথমিক আলোচনা",
    "hello@alberostudio.com": "hello@alberostudio.com",
    "+880 1315 963305": "+৮৮০ ১৩১৫ ৯৬৩৩০৫",

    "Choose the capability that matches your challenge. We connect the right technical depth to the context around it.": "আপনার চ্যালেঞ্জের সঙ্গে মানানসই সক্ষমতা বেছে নিন। প্রেক্ষাপট অনুযায়ী সঠিক প্রযুক্তিগত গভীরতা আমরা যুক্ত করি।",
    "Solutions engineered around your context.": "আপনার প্রেক্ষাপটকে কেন্দ্র করে তৈরি সমাধান।",
    "Engineered for specific organizational requirements": "নির্দিষ্ট সাংগঠনিক প্রয়োজনের জন্য ইঞ্জিনিয়ার করা",
    "Cybersecurity Solutions": "সাইবার সিকিউরিটি সমাধান",
    "AI Solutions": "AI সমাধান",
    "Enterprise Technology": "এন্টারপ্রাইজ প্রযুক্তি",
    "Security assessment, architecture, application security, monitoring, automation, privacy, and data protection.": "নিরাপত্তা মূল্যায়ন, আর্কিটেকচার, অ্যাপ্লিকেশন নিরাপত্তা, মনিটরিং, অটোমেশন, প্রাইভেসি ও ডেটা সুরক্ষা।",
    "Custom software, data platforms, intelligent workflows, API and system integration, and cloud-based systems.": "কাস্টম সফটওয়্যার, ডেটা প্ল্যাটফর্ম, বুদ্ধিমান ওয়ার্কফ্লো, API ও সিস্টেম ইন্টিগ্রেশন এবং ক্লাউডভিত্তিক সিস্টেম।",
    "AI automation, assistants, intelligent document processing, predictive systems, computer vision, and NLP solutions.": "AI অটোমেশন, অ্যাসিস্ট্যান্ট, বুদ্ধিমান ডকুমেন্ট প্রসেসিং, প্রেডিক্টিভ সিস্টেম, কম্পিউটার ভিশন ও NLP সমাধান।",
    "Our approach is grounded in evidence, robust architecture, careful validation, and continuous learning.": "আমাদের পদ্ধতি প্রমাণ, শক্তিশালী আর্কিটেকচার, সতর্ক যাচাই ও ধারাবাহিক শেখার ওপর ভিত্তি করে।",
    "From Research to Reality": "গবেষণা থেকে বাস্তবতায়",
    "We think beyond short-term delivery: understand the context, research the options, engineer carefully, validate the result, and evolve the system with real-world feedback.": "আমরা শুধু স্বল্পমেয়াদি ডেলিভারির কথা ভাবি না: প্রেক্ষাপট বুঝি, বিকল্প নিয়ে গবেষণা করি, সতর্কভাবে ইঞ্জিনিয়ারিং করি, ফল যাচাই করি এবং বাস্তব অভিজ্ঞতার ভিত্তিতে সিস্টেম উন্নত করি।",
    "Understand": "বুঝুন",
    "Identify the problem, users, constraints, risks, and real-world context before making technical choices.": "প্রযুক্তিগত সিদ্ধান্তের আগে সমস্যা, ব্যবহারকারী, সীমাবদ্ধতা, ঝুঁকি ও বাস্তব প্রেক্ষাপট চিহ্নিত করুন।",
    "Research": "গবেষণা",
    "Study technologies, data, threats, constraints, and possible approaches before choosing what to build.": "কী তৈরি করবেন তা বেছে নেওয়ার আগে প্রযুক্তি, ডেটা, হুমকি, সীমাবদ্ধতা ও সম্ভাব্য পদ্ধতি নিয়ে গবেষণা করুন।",
    "Engineer": "ইঞ্জিনিয়ার করুন",
    "Design and develop a secure, maintainable system that can be understood and improved.": "বোঝা ও উন্নত করা যায় এমন নিরাপদ, রক্ষণাবেক্ষণযোগ্য সিস্টেম ডিজাইন ও তৈরি করুন।",
    "Validate": "যাচাই করুন",
    "Test performance, security, reliability, usability, and the assumptions behind the system.": "সিস্টেমের পারফরম্যান্স, নিরাপত্তা, নির্ভরযোগ্যতা, ব্যবহারযোগ্যতা ও পেছনের অনুমান পরীক্ষা করুন।",
    "Evolve": "উন্নত করুন",
    "Improve continuously using data, research, and feedback from the people who rely on the work.": "যারা এই কাজের ওপর নির্ভর করেন তাদের ডেটা, গবেষণা ও মতামত ব্যবহার করে ধারাবাহিকভাবে উন্নত করুন।",

    "Privacy Policy": "গোপনীয়তা নীতি",
    "Effective date: September 27, 2026": "কার্যকর তারিখ: ২৭ সেপ্টেম্বর, ২০২৬",
    "Information we collect": "আমরা যে তথ্য সংগ্রহ করি",
    "How we use information": "আমরা তথ্য কীভাবে ব্যবহার করি",
    "Sharing and retention": "তথ্য শেয়ার ও সংরক্ষণ",
    "Cookies and similar technologies": "কুকি ও অনুরূপ প্রযুক্তি",
    "Your choices and rights": "আপনার পছন্দ ও অধিকার",
    "Third-party links": "তৃতীয় পক্ষের লিংক",
    "Children’s privacy": "শিশুদের গোপনীয়তা",
    "Policy updates": "নীতির আপডেট",
    "Contact us": "যোগাযোগ করুন",
    "Information you provide": "আপনার দেওয়া তথ্য",
    "Information collected automatically": "স্বয়ংক্রিয়ভাবে সংগৃহীত তথ্য",
    "Your choices": "আপনার পছন্দ",
    "We believe responsible technology starts with clear communication about how information is collected, used, and protected.": "দায়িত্বশীল প্রযুক্তির শুরু হয় তথ্য কীভাবে সংগ্রহ, ব্যবহার ও সুরক্ষিত হয়—সে বিষয়ে পরিষ্কার যোগাযোগ থেকে।",
    "If you have a privacy question or want to exercise a privacy request, contact Albero Studio:": "গোপনীয়তা নিয়ে কোনো প্রশ্ন থাকলে বা কোনো অনুরোধ জানাতে চাইলে আলবেরো স্টুডিওর সঙ্গে যোগাযোগ করুন:",
    "Our services are intended for businesses, professionals, researchers, and adult users. We do not knowingly collect personal information from children.": "আমাদের সেবা ব্যবসা, পেশাজীবী, গবেষক ও প্রাপ্তবয়স্ক ব্যবহারকারীদের জন্য। আমরা জেনে-বুঝে শিশুদের ব্যক্তিগত তথ্য সংগ্রহ করি না।",
    "We may update this policy as our services, technology, or legal obligations change. The effective date at the top of this page indicates when the current version was published.": "আমাদের সেবা, প্রযুক্তি বা আইনি দায়বদ্ধতা পরিবর্তিত হলে আমরা এই নীতি আপডেট করতে পারি। পেজের ওপরের কার্যকর তারিখটি বর্তমান সংস্করণ প্রকাশের সময় নির্দেশ করে।",

    "OUR FOCUS": "আমাদের ফোকাস",
    "Secure intelligence": "নিরাপদ বুদ্ধিমত্তা",
    "Cybersecurity, AI, and engineering for useful progress.": "কার্যকর অগ্রগতির জন্য সাইবার সিকিউরিটি, AI ও ইঞ্জিনিয়ারিং।",
    "OUR 3C THEORY": "আমাদের ৩C তত্ত্ব",
    "Consistency · Clarity · Conscience": "ধারাবাহিকতা · স্বচ্ছতা · বিবেক",
    "A practical philosophy for responsible technology.": "দায়িত্বশীল প্রযুক্তির একটি ব্যবহারিক দর্শন।",
    "OUR ORIGIN": "আমাদের শিকড়",
    "Built in Bangladesh": "বাংলাদেশে তৈরি",
    "Designed for teams and possibilities around the world.": "বিশ্বের নানা টিম ও সম্ভাবনার জন্য তৈরি।",
    "All rights reserved.": "সর্বস্বত্ব সংরক্ষিত।",
    "Built in Bangladesh · Designed for the world": "বাংলাদেশে তৈরি · বিশ্বের জন্য ডিজাইন করা",
    "Built in Bangladesh. Designed for the World.": "বাংলাদেশে তৈরি। বিশ্বের জন্য ডিজাইন করা।",
    "Built with care, curiosity, and purpose.": "যত্ন, কৌতূহল ও উদ্দেশ্য নিয়ে তৈরি।",
    "Secure intelligence and useful technology from Bangladesh.": "বাংলাদেশ থেকে নিরাপদ বুদ্ধিমত্তা ও কার্যকর প্রযুক্তি।"
  };

  Object.assign(localeTranslations, {
    "| Albero Studio": "| আলবেরো স্টুডিও",
    "| By Albero Team": "| আলবেরো টিম",
    "★ 4.7 · Beginner · Course · 1 - 4 Weeks": "★ ৪.৭ · শিক্ষানবিস · কোর্স · ১–৪ সপ্তাহ",
    "★ 4.7 · Beginner · Course · 3 - 6 Months": "★ ৪.৭ · শিক্ষানবিস · কোর্স · ৩–৬ মাস",
    "★ 4.7 · Beginner · Course · 5 Weeks": "★ ৪.৭ · শিক্ষানবিস · কোর্স · ৫ সপ্তাহ",
    "★ 4.8 · Beginner · Course · 5 Weeks": "★ ৪.৮ · শিক্ষানবিস · কোর্স · ৫ সপ্তাহ",
    "★ 4.8 · Beginner · Course · 6 Weeks": "★ ৪.৮ · শিক্ষানবিস · কোর্স · ৬ সপ্তাহ",
    "★ 4.8 · Beginner · Course · 8 Weeks": "★ ৪.৮ · শিক্ষানবিস · কোর্স · ৮ সপ্তাহ",
    "★ 4.8 · Intermediate · Course · 5 Weeks": "★ ৪.৮ · মধ্যম · কোর্স · ৫ সপ্তাহ",
    "★ 4.8 · Intermediate · Course · 7 Weeks": "★ ৪.৮ · মধ্যম · কোর্স · ৭ সপ্তাহ",
    "★ 4.9 · Advanced · Course · 8 Weeks": "★ ৪.৯ · অ্যাডভান্সড · কোর্স · ৮ সপ্তাহ",
    "★ 4.9 · Beginner · Course · 6 Weeks": "★ ৪.৯ · শিক্ষানবিস · কোর্স · ৬ সপ্তাহ",
    "★ 4.9 · Intermediate · Course · 8 Weeks": "★ ৪.৯ · মধ্যম · কোর্স · ৮ সপ্তাহ",
    "01 — Understand": "০১ — বুঝুন",
    "02 — Research": "০২ — গবেষণা করুন",
    "03 — Engineer": "০৩ — ইঞ্জিনিয়ার করুন",
    "04 — Validate": "০৪ — যাচাই করুন",
    "05 — Evolve": "০৫ — উন্নত করুন",
    "01 / PROTECT": "০১ / সুরক্ষা",
    "02 / COMPUTE": "০২ / গণনা",
    "03 / CREATE": "০৩ / তৈরি",
    "1. Information we collect": "১. আমরা যে তথ্য সংগ্রহ করি",
    "2. How we use information": "২. আমরা তথ্য কীভাবে ব্যবহার করি",
    "3. Sharing and retention": "৩. তথ্য শেয়ার ও সংরক্ষণ",
    "4. Cookies and similar technologies": "৪. কুকি ও অনুরূপ প্রযুক্তি",
    "5. Your choices and rights": "৫. আপনার পছন্দ ও অধিকার",
    "6. Third-party links": "৬. তৃতীয় পক্ষের লিংক",
    "7. Children’s privacy": "৭. শিশুদের গোপনীয়তা",
    "8. Policy updates": "৮. নীতির আপডেট",
    "9. Contact us": "৯. যোগাযোগ করুন",
    "A HUMAN APPROACH TO TECHNOLOGY": "প্রযুক্তিতে মানবিক দৃষ্টিভঙ্গি",
    "ABOUT ALBERO STUDIO": "আলবেরো স্টুডিও সম্পর্কে",
    "Above BDT 1,500,000": "বিডিটি ১৫,০০,০০০-এর বেশি",
    "BDT 250,000–750,000": "বিডিটি ২,৫০,০০০–৭,৫০,০০০",
    "BDT 750,000–1,500,000": "বিডিটি ৭,৫০,০০০–১৫,০০,০০০",
    "Access your project workspace, quotations, and order updates.": "আপনার প্রজেক্ট ওয়ার্কস্পেস, কোটেশন ও অর্ডার আপডেট দেখুন।",
    "AI": "AI",
    "AI and Machine Learning": "AI ও মেশিন লার্নিং",
    "AI Engineering": "AI ইঞ্জিনিয়ারিং",
    "AI ENGINEERING": "AI ইঞ্জিনিয়ারিং",
    "AI assistants, intelligent document processing, decision support, and applied systems designed around real workflows.": "AI অ্যাসিস্ট্যান্ট, বুদ্ধিমান ডকুমেন্ট প্রসেসিং, সিদ্ধান্ত সহায়তা ও বাস্তব ওয়ার্কফ্লোকেন্দ্রিক প্রয়োগভিত্তিক সিস্টেম।",
    "Albero Studio. All rights reserved.": "আলবেরো স্টুডিও। সর্বস্বত্ব সংরক্ষিত।",
    "All statuses": "সব স্ট্যাটাস",
    "Application, network, cloud, identity, privacy, threat intelligence, and security research.": "অ্যাপ্লিকেশন, নেটওয়ার্ক, ক্লাউড, পরিচয়, প্রাইভেসি, থ্রেট ইন্টেলিজেন্স ও নিরাপত্তা গবেষণা।",
    "Applied AI and machine learning systems": "প্রয়োগভিত্তিক AI ও মেশিন লার্নিং সিস্টেম",
    "Applied AI systems that turn useful data and domain knowledge into better decisions.": "কার্যকর ডেটা ও ক্ষেত্রভিত্তিক জ্ঞানকে ভালো সিদ্ধান্তে রূপ দেয় এমন প্রয়োগভিত্তিক AI সিস্টেম।",
    "APPROACH": "পদ্ধতি",
    "Artificial intelligence": "কৃত্রিম বুদ্ধিমত্তা",
    "Ask better questions": "আরও ভালো প্রশ্ন করুন",
    "Assessment, architecture, application security, monitoring, automation, privacy, and data protection.": "মূল্যায়ন, আর্কিটেকচার, অ্যাপ্লিকেশন নিরাপত্তা, মনিটরিং, অটোমেশন, প্রাইভেসি ও ডেটা সুরক্ষা।",
    "Bangladesh": "বাংলাদেশ",
    "BANGLADESH ROOTED": "বাংলাদেশে শিকড়",
    "Bangladesh-based technology company · Office details coming soon.": "বাংলাদেশভিত্তিক প্রযুক্তি প্রতিষ্ঠান · অফিসের বিস্তারিত শীঘ্রই জানানো হবে।",
    "Bangladesh-rooted deep technology company": "বাংলাদেশে শিকড়-গাঁথা ডিপ টেকনোলজি প্রতিষ্ঠান",
    "Behind every alert, outage, and uncertain decision, real people carry the consequences. We build systems that make that work clearer, safer, and more manageable.": "প্রতিটি সতর্কতা, বিভ্রাট ও অনিশ্চিত সিদ্ধান্তের প্রভাব বাস্তব মানুষকে বহন করতে হয়। আমরা সেই কাজকে আরও পরিষ্কার, নিরাপদ ও পরিচালনাযোগ্য করে এমন সিস্টেম তৈরি করি।",
    "Build": "তৈরি করুন",
    "Build engineering capabilities.": "ইঞ্জিনিয়ারিং সক্ষমতা তৈরি করুন।",
    "Build proprietary products.": "নিজস্ব পণ্য তৈরি করুন।",
    "Build systems that last": "দীর্ঘস্থায়ী সিস্টেম তৈরি করুন",
    "Build trust into the technology.": "প্রযুক্তির মধ্যে আস্থা তৈরি করুন।",
    "Building Secure": "নিরাপদ নির্মাণ",
    "BUILT FROM HERE": "এখান থেকেই তৈরি",
    "BUILT IN BANGLADESH": "বাংলাদেশে তৈরি",
    "Capability": "সক্ষমতা",
    "Capability Notes": "সক্ষমতার নোট",
    "Capability notes": "সক্ষমতার নোট",
    "Capability that lasts": "দীর্ঘস্থায়ী সক্ষমতা",
    "Career skills": "ক্যারিয়ার দক্ষতা",
    "Clarity": "স্বচ্ছতা",
    "Clarity.": "স্বচ্ছতা।",
    "Clear engineering": "পরিষ্কার ইঞ্জিনিয়ারিং",
    "Client and account information": "ক্লায়েন্ট ও অ্যাকাউন্টের তথ্য",
    "Client portal": "ক্লায়েন্ট পোর্টাল",
    "client": "ক্লায়েন্ট",
    "CO-FOUNDER'S NOTE": "সহ-প্রতিষ্ঠাতার নোট",
    "COMING SOON": "শীঘ্রই আসছে",
    "Compute": "গণনা",
    "Conduct deeper AI and cybersecurity research.": "AI ও সাইবার সিকিউরিটি নিয়ে গভীর গবেষণা করুন।",
    "Conscience": "বিবেক",
    "Conscience.": "বিবেক।",
    "Consistency": "ধারাবাহিকতা",
    "Consistency.": "ধারাবাহিকতা।",
    "Create": "তৈরি করুন",
    "Curiosity turned into future capability.": "কৌতূহলকে ভবিষ্যতের সক্ষমতায় রূপ দেওয়া।",
    "Custom software, data platforms, system integration, APIs, and cloud-based operating systems.": "কাস্টম সফটওয়্যার, ডেটা প্ল্যাটফর্ম, সিস্টেম ইন্টিগ্রেশন, API ও ক্লাউডভিত্তিক অপারেটিং সিস্টেম।",
    "CYBERSECURITY": "সাইবার সিকিউরিটি",
    "Deep technology from Bangladesh": "বাংলাদেশের ডিপ টেকনোলজি",
    "Design and develop the technical solution with clear architecture, secure defaults, and maintainability in mind.": "পরিষ্কার আর্কিটেকচার, নিরাপদ ডিফল্ট ও রক্ষণাবেক্ষণযোগ্যতাকে সামনে রেখে প্রযুক্তিগত সমাধান ডিজাইন ও তৈরি করুন।",
    "Develop specialized technology solutions.": "বিশেষায়িত প্রযুক্তি সমাধান তৈরি করুন।",
    "Development": "উন্নয়ন",
    "Digital safety for intelligent systems": "ইন্টেলিজেন্ট সিস্টেমের ডিজিটাল নিরাপত্তা",
    "Discuss intelligence": "ইন্টেলিজেন্স নিয়ে আলোচনা করুন",
    "Discuss security": "নিরাপত্তা নিয়ে আলোচনা করুন",
    "Discuss the research": "গবেষণা নিয়ে আলোচনা করুন",
    "Discuss your system": "আপনার সিস্টেম নিয়ে আলোচনা করুন",
    "Email:": "ইমেইল:",
    "Engineering": "ইঞ্জিনিয়ারিং",
    "Estimated budget": "আনুমানিক বাজেট",
    "Expand from Bangladesh to international markets.": "বাংলাদেশ থেকে আন্তর্জাতিক বাজারে বিস্তৃত হোন।",
    "Experimental technology, open-source learning, and applied research for future capability.": "ভবিষ্যৎ সক্ষমতার জন্য পরীক্ষামূলক প্রযুক্তি, ওপেন-সোর্স শেখা ও প্রয়োগভিত্তিক গবেষণা।",
    "Explore": "অনুসন্ধান করুন",
    "Explore our services": "আমাদের সেবা দেখুন",
    "Explore Our Technology": "আমাদের প্রযুক্তি দেখুন",
    "Explore research": "গবেষণা দেখুন",
    "Explore the thinking": "চিন্তাগুলো দেখুন",
    "Explore what comes next": "পরবর্তী পদক্ষেপ দেখুন",
    "Exploring tools that help teams understand security signals, reduce uncertainty, and make safer decisions.": "টিমকে নিরাপত্তার সংকেত বুঝতে, অনিশ্চয়তা কমাতে ও নিরাপদ সিদ্ধান্ত নিতে সহায়তা করে এমন টুল নিয়ে অনুসন্ধান করছি।",
    "FIELD NOTE": "মাঠ-নোট",
    "Find the signal": "মূল সংকেত খুঁজুন",
    "Firewall": "ফায়ারওয়াল",
    "Focused exploration for teams that need to understand an emerging technology before committing to it.": "নতুন প্রযুক্তিতে বিনিয়োগের আগে তা বুঝতে চাওয়া টিমের জন্য মনোযোগী অনুসন্ধান।",
    "Foundations": "ভিত্তি",
    "FOUNDER'S NOTE": "প্রতিষ্ঠাতার নোট",
    "Frame the problem": "সমস্যাটিকে কাঠামোবদ্ধ করুন",
    "From secure foundations to intelligent systems, every service is shaped around the people and problems it needs to support.": "নিরাপদ ভিত্তি থেকে বুদ্ধিমান সিস্টেম পর্যন্ত, প্রতিটি সেবা যে মানুষ ও সমস্যাকে সহায়তা করবে তাকে কেন্দ্র করে তৈরি।",
    "Future Platforms": "ভবিষ্যতের প্ল্যাটফর্ম",
    "Good engineering gives people a clearer path through difficult systems, decisions, and change.": "ভালো ইঞ্জিনিয়ারিং মানুষকে জটিল সিস্টেম, সিদ্ধান্ত ও পরিবর্তনের মধ্য দিয়ে এগোনোর পরিষ্কার পথ দেয়।",
    "Ideas and working notes on cybersecurity, AI, machine learning, engineering, research, and digital safety.": "সাইবার সিকিউরিটি, AI, মেশিন লার্নিং, ইঞ্জিনিয়ারিং, গবেষণা ও ডিজিটাল নিরাপত্তা নিয়ে আইডিয়া ও কাজের নোট।",
    "Identify the problem, its real-world context, the people affected, and the conditions for meaningful progress.": "সমস্যা, তার বাস্তব প্রেক্ষাপট, প্রভাবিত মানুষ এবং অর্থবহ অগ্রগতির শর্তগুলো চিহ্নিত করুন।",
    "Illustrative capability note; no public client result is being claimed.": "উদাহরণভিত্তিক সক্ষমতার নোট; কোনো প্রকাশ্য ক্লায়েন্ট ফলাফল দাবি করা হচ্ছে না।",
    "INSIGHT": "অন্তর্দৃষ্টি",
    "INTELLIGENCE": "ইন্টেলিজেন্স",
    "Intelligence for the Future.": "ভবিষ্যতের জন্য ইন্টেলিজেন্স।",
    "Intelligent Automation": "ইন্টেলিজেন্ট অটোমেশন",
    "Join network": "নেটওয়ার্কে যোগ দিন",
    "Join our network": "আমাদের নেটওয়ার্কে যোগ দিন",
    "Keep it useful": "কার্যকর রাখুন",
    "Leadership profiles, company story, and future partnerships will be shared as they become ready.": "নেতৃত্বের প্রোফাইল, কোম্পানির গল্প ও ভবিষ্যৎ অংশীদারিত্ব প্রস্তুত হলে শেয়ার করা হবে।",
    "Learn": "শিখুন",
    "Learn · Build · Improve": "শিখুন · তৈরি করুন · উন্নত করুন",
    "LEGAL & TRUST": "আইন ও আস্থা",
    "Less repetition, more meaningful work.": "কম পুনরাবৃত্তি, আরও অর্থবহ কাজ।",
    "Loading article…": "নিবন্ধ লোড হচ্ছে…",
    "Loading capability note…": "সক্ষমতার নোট লোড হচ্ছে…",
    "LONG VIEW": "দীর্ঘ দৃষ্টিভঙ্গি",
    "LONG-TERM VISION": "দীর্ঘমেয়াদি ভিশন",
    "Maintainable systems, APIs, data platforms, and secure product foundations.": "রক্ষণাবেক্ষণযোগ্য সিস্টেম, API, ডেটা প্ল্যাটফর্ম ও নিরাপদ পণ্যের ভিত্তি।",
    "Make complexity easier to understand.": "জটিলতাকে বোঝা সহজ করুন।",
    "Make complexity useful": "জটিলতাকে কার্যকর করুন",
    "Make intelligence dependable": "ইন্টেলিজেন্সকে নির্ভরযোগ্য করুন",
    "Make it real": "বাস্তবে রূপ দিন",
    "Manage newsletter or network subscriptions and send relevant updates.": "নিউজলেটার বা নেটওয়ার্ক সাবস্ক্রিপশন পরিচালনা করুন এবং প্রাসঙ্গিক আপডেট পাঠান।",
    "Meaningful technology requires more than code.": "অর্থবহ প্রযুক্তির জন্য শুধু কোড যথেষ্ট নয়।",
    "Mission": "মিশন",
    "Model integration, evaluation, deployment, monitoring, and the engineering needed to make AI systems dependable.": "AI সিস্টেমকে নির্ভরযোগ্য করতে মডেল ইন্টিগ্রেশন, মূল্যায়ন, ডেপ্লয়মেন্ট, মনিটরিং ও প্রয়োজনীয় ইঞ্জিনিয়ারিং।",
    "Models and data pipelines for language, vision, prediction, recommendation, and risk.": "ভাষা, ভিশন, পূর্বাভাস, সুপারিশ ও ঝুঁকির জন্য মডেল ও ডেটা পাইপলাইন।",
    "Models that learn from real-world signals.": "বাস্তব জগতের সংকেত থেকে শেখে এমন মডেল।",
    "Network defense, access control, monitoring, secure protocols, and threat detection.": "নেটওয়ার্ক প্রতিরক্ষা, অ্যাক্সেস কন্ট্রোল, মনিটরিং, নিরাপদ প্রোটোকল ও থ্রেট শনাক্তকরণ।",
    "New": "নতুন",
    "On this page": "এই পেজে",
    "Operate, maintain, secure, and improve the website and client services.": "ওয়েবসাইট ও ক্লায়েন্ট সেবা পরিচালনা, রক্ষণাবেক্ষণ, সুরক্ষা ও উন্নত করা।",
    "Our Approach": "আমাদের পদ্ধতি",
    "OUR APPROACH": "আমাদের পদ্ধতি",
    "Our ideas start with real questions and grow through research, engineering, and learning.": "আমাদের আইডিয়া বাস্তব প্রশ্ন থেকে শুরু হয়ে গবেষণা, ইঞ্জিনিয়ারিং ও শেখার মাধ্যমে বিকশিত হয়।",
    "OUR MISSION & VISION": "আমাদের মিশন ও ভিশন",
    "Our roadmap is capability-led rather than date-led. Each phase creates the foundation for the next.": "আমাদের রোডম্যাপ তারিখ নয়, সক্ষমতাকে কেন্দ্র করে তৈরি। প্রতিটি ধাপ পরের ধাপের ভিত্তি গড়ে।",
    "Our work is guided by a simple technology philosophy: we build from Bangladesh with discipline, clear thinking, and a responsibility to create useful progress.": "আমাদের কাজ একটি সহজ প্রযুক্তি দর্শন দ্বারা পরিচালিত: শৃঙ্খলা, পরিষ্কার চিন্তা ও কার্যকর অগ্রগতি তৈরির দায়িত্ব নিয়ে আমরা বাংলাদেশ থেকে তৈরি করি।",
    "Password": "পাসওয়ার্ড",
    "PHASE 01": "ধাপ ০১",
    "PHASE 02": "ধাপ ০২",
    "PHASE 03": "ধাপ ০৩",
    "PHASE 04": "ধাপ ০৪",
    "PHASE 05": "ধাপ ০৫",
    "Phone:": "ফোন:",
    "Placeholders for products that will emerge from our research, engineering practice, and real-world learning.": "আমাদের গবেষণা, ইঞ্জিনিয়ারিং অনুশীলন ও বাস্তব শেখা থেকে তৈরি হতে যাওয়া পণ্যের প্রস্তুতি।",
    "Platform track": "প্ল্যাটফর্ম ট্র্যাক",
    "Practical": "ব্যবহারিক",
    "Prepare": "প্রস্তুত করুন",
    "Prevent misuse, investigate security events, and comply with applicable legal obligations.": "অপব্যবহার রোধ করুন, নিরাপত্তা-সংক্রান্ত ঘটনা অনুসন্ধান করুন এবং প্রযোজ্য আইনি দায়বদ্ধতা মেনে চলুন।",
    "PRINCIPLE": "নীতি",
    "Progress with purpose.": "উদ্দেশ্যপূর্ণ অগ্রগতি।",
    "Project brief": "প্রজেক্টের সংক্ষিপ্ত বিবরণ",
    "Protect": "সুরক্ষা দিন",
    "Protecting the systems people depend on.": "মানুষ যে সিস্টেমের ওপর নির্ভর করে তা সুরক্ষিত করা।",
    "PROTOTYPE": "প্রোটোটাইপ",
    "Prove the value": "মূল্য প্রমাণ করুন",
    "Publication pending": "প্রকাশনা অপেক্ষমাণ",
    "RC": "আরসি",
    "Ready for a consultation?": "কনসালটেশনের জন্য প্রস্তুত?",
    "Reliable model integration, evaluation, deployment, monitoring, and responsible iteration.": "নির্ভরযোগ্য মডেল ইন্টিগ্রেশন, মূল্যায়ন, ডেপ্লয়মেন্ট, মনিটরিং ও দায়িত্বশীল পুনরাবৃত্তি।",
    "Reliable systems from model to outcome.": "মডেল থেকে ফলাফল পর্যন্ত নির্ভরযোগ্য সিস্টেম।",
    "Reliable work, repeated with care.": "যত্নের সঙ্গে বারবার করা নির্ভরযোগ্য কাজ।",
    "Request quotation": "কোটেশন অনুরোধ করুন",
    "RESEARCH": "গবেষণা",
    "Research & Insights": "গবেষণা ও অন্তর্দৃষ্টি",
    "Research and engineering across Cybersecurity, Artificial Intelligence, Machine Learning, and intelligent systems.": "সাইবার সিকিউরিটি, কৃত্রিম বুদ্ধিমত্তা, মেশিন লার্নিং ও ইন্টেলিজেন্ট সিস্টেম নিয়ে গবেষণা ও ইঞ্জিনিয়ারিং।",
    "Research and Prototyping": "গবেষণা ও প্রোটোটাইপিং",
    "Research led": "গবেষণানির্ভর",
    "Research Partnerships": "গবেষণা অংশীদারিত্ব",
    "Research translated into useful work": "গবেষণাকে কার্যকর কাজে রূপ দেওয়া",
    "Research-led engineering practice": "গবেষণানির্ভর ইঞ্জিনিয়ারিং অনুশীলন",
    "Respond to questions, support requests, project enquiries, and quotation requests.": "প্রশ্ন, সাপোর্ট অনুরোধ, প্রজেক্ট অনুসন্ধান ও কোটেশন অনুরোধের উত্তর দিন।",
    "Responsible progress": "দায়িত্বশীল অগ্রগতি",
    "Rising of": "উত্থান",
    "Secure data and intelligent automation": "নিরাপদ ডেটা ও ইন্টেলিজেন্ট অটোমেশন",
    "Secure ideas. Human purpose.": "নিরাপদ আইডিয়া। মানবিক উদ্দেশ্য।",
    "Secure the foundation": "ভিত্তি সুরক্ষিত করুন",
    "Security": "নিরাপত্তা",
    "SECURITY": "নিরাপত্তা",
    "Security architecture and operating context": "নিরাপত্তা আর্কিটেকচার ও পরিচালনাগত প্রেক্ষাপট",
    "Security controls, cyber attacks, risk, incident response, and privacy.": "সিকিউরিটি কন্ট্রোল, সাইবার আক্রমণ, ঝুঁকি, ইনসিডেন্ট রেসপন্স ও প্রাইভেসি।",
    "Security for systems, people, and trust.": "সিস্টেম, মানুষ ও আস্থার জন্য নিরাপত্তা।",
    "Security Intelligence": "সিকিউরিটি ইন্টেলিজেন্স",
    "Security is a foundation, not a finishing step.": "নিরাপত্তা শেষ ধাপ নয়, এটি ভিত্তি।",
    "Security is considered throughout the system lifecycle, not added as a final layer.": "সিস্টেমের পুরো জীবনচক্রে নিরাপত্তা বিবেচনা করা হয়; শেষে আলাদা স্তর হিসেবে যোগ করা হয় না।",
    "Security track": "নিরাপত্তা ট্র্যাক",
    "See our process": "আমাদের প্রক্রিয়া দেখুন",
    "Select a range": "একটি সীমা বেছে নিন",
    "Select a service": "একটি সেবা বেছে নিন",
    "Service": "সেবা",
    "Share": "শেয়ার করুন",
    "Share your organization, data situation, security concerns, and business goals. We will respond with a practical path for the next conversation.": "আপনার প্রতিষ্ঠান, ডেটার অবস্থা, নিরাপত্তা-উদ্বেগ ও ব্যবসায়িক লক্ষ্য জানান। পরবর্তী আলোচনার জন্য আমরা ব্যবহারিক পথের পরামর্শ দেব।",
    "Sign in": "সাইন ইন",
    "Sign out": "সাইন আউট",
    "Simple choices in complex environments.": "জটিল পরিবেশে সহজ সিদ্ধান্ত।",
    "SOFTWARE": "সফটওয়্যার",
    "Software Engineering": "সফটওয়্যার ইঞ্জিনিয়ারিং",
    "Start with a clear brief.": "পরিষ্কার সংক্ষিপ্ত বিবরণ দিয়ে শুরু করুন।",
    "Stay connected": "সংযুক্ত থাকুন",
    "Steps from research to reality": "গবেষণা থেকে বাস্তবতায় যাওয়ার ধাপ",
    "Strong foundations for serious products.": "গুরুত্বপূর্ণ পণ্যের জন্য শক্ত ভিত্তি।",
    "Study": "অধ্যয়ন করুন",
    "Systems track": "সিস্টেম ট্র্যাক",
    "Talent Network": "ট্যালেন্ট নেটওয়ার্ক",
    "Technology shaped around human impact.": "মানবিক প্রভাবকে কেন্দ্র করে তৈরি প্রযুক্তি।",
    "Tell us what you are building, what needs to improve, and where you need support. Our team will review the request and respond with the right next step.": "আপনি কী তৈরি করছেন, কী উন্নত করা দরকার এবং কোথায় সহায়তা চান—আমাদের জানান। আমাদের টিম অনুরোধটি পর্যালোচনা করে সঠিক পরবর্তী পদক্ষেপ জানাবে।",
    "Test": "পরীক্ষা করুন",
    "Test useful ideas": "কার্যকর আইডিয়া পরীক্ষা করুন",
    "THE 3C METHOD": "৩C পদ্ধতি",
    "THE LATEST": "সাম্প্রতিক",
    "The work matters when it creates confidence for the people and teams who rely on it every day.": "যারা প্রতিদিন এই কাজের ওপর নির্ভর করেন, তাদের আস্থা তৈরি করতে পারলেই কাজটি গুরুত্বপূর্ণ হয়ে ওঠে।",
    "To build a globally recognized technology company from Bangladesh, driven by Cybersecurity, Artificial Intelligence, Machine Learning, and continuous research.": "সাইবার সিকিউরিটি, কৃত্রিম বুদ্ধিমত্তা, মেশিন লার্নিং ও ধারাবাহিক গবেষণার মাধ্যমে বাংলাদেশ থেকে বিশ্বস্বীকৃত প্রযুক্তি প্রতিষ্ঠান তৈরি করা।",
    "To engineer secure, intelligent, and meaningful technology while contributing to the growth of Bangladesh's technology ecosystem.": "বাংলাদেশের প্রযুক্তি ইকোসিস্টেমের বিকাশে অবদান রেখে নিরাপদ, বুদ্ধিমান ও অর্থবহ প্রযুক্তি ইঞ্জিনিয়ার করা।",
    "Trending": "ট্রেন্ডিং",
    "Turn data into direction": "ডেটাকে দিকনির্দেশনায় রূপ দিন",
    "Under BDT 250,000": "বিডিটি ২,৫০,০০০-এর নিচে",
    "Understand anonymous website usage and improve content, navigation, and performance.": "নাম প্রকাশ না করে ওয়েবসাইট ব্যবহারের তথ্য বুঝে কনটেন্ট, নেভিগেশন ও পারফরম্যান্স উন্নত করুন।",
    "Useful intelligence for better decisions.": "ভালো সিদ্ধান্তের জন্য কার্যকর ইন্টেলিজেন্স।",
    "Validation, observability, and continuous improvement": "যাচাই, অবজারভেবিলিটি ও ধারাবাহিক উন্নতি",
    "View by status": "স্ট্যাটাস অনুযায়ী দেখুন",
    "View capability map": "সক্ষমতার ম্যাপ দেখুন",
    "View status": "স্ট্যাটাস দেখুন",
    "Vision": "ভিশন",
    "We are not publishing invented client stories. Public case studies will be added when there is work that can be shared responsibly.": "আমরা বানানো ক্লায়েন্টের গল্প প্রকাশ করি না। দায়িত্বশীলভাবে শেয়ার করা যায় এমন কাজ হলে পাবলিক কেস স্টাডি যোগ করা হবে।",
    "We are researching and engineering proprietary technology. Public product announcements will follow validated progress, not speculation.": "আমরা নিজস্ব প্রযুক্তি নিয়ে গবেষণা ও ইঞ্জিনিয়ারিং করছি। অনুমানের ভিত্তিতে নয়, যাচাইকৃত অগ্রগতির পরই পাবলিক পণ্য ঘোষণা করা হবে।",
    "We bring security, intelligence, and engineering discipline together to build technology that works in the real world.": "বাস্তব জগতে কাজ করে এমন প্রযুক্তি তৈরিতে আমরা নিরাপত্তা, ইন্টেলিজেন্স ও ইঞ্জিনিয়ারিং শৃঙ্খলাকে একত্র করি।",
    "We build thoughtful technology that makes difficult work clearer, safer, and more manageable.": "আমরা চিন্তাশীল প্রযুক্তি তৈরি করি, যা কঠিন কাজকে আরও পরিষ্কার, নিরাপদ ও পরিচালনাযোগ্য করে।",
    "We connect research, security, engineering, and responsible innovation to build systems that can create lasting value in Bangladesh and beyond.": "বাংলাদেশ ও তার বাইরেও দীর্ঘস্থায়ী মূল্য তৈরি করতে আমরা গবেষণা, নিরাপত্তা, ইঞ্জিনিয়ারিং ও দায়িত্বশীল উদ্ভাবনকে একত্র করি।",
    "We do not publish invented products or unsupported claims. These tracks show the product architecture we are preparing as our research matures.": "আমরা বানানো পণ্য বা প্রমাণহীন দাবি প্রকাশ করি না। গবেষণা পরিণত হওয়ার সঙ্গে আমরা যে পণ্য আর্কিটেকচার প্রস্তুত করছি, এই ট্র্যাকগুলো তা দেখায়।",
    "We learn the problem, the technology, and the risk before choosing what to build.": "কী তৈরি করব তা বেছে নেওয়ার আগে আমরা সমস্যা, প্রযুক্তি ও ঝুঁকি বুঝে নিই।",
    "We start with the problem, the constraints, the data, and the risk profile — then choose the right technical path.": "আমরা সমস্যা, সীমাবদ্ধতা, ডেটা ও ঝুঁকির ধরন দিয়ে শুরু করি—তারপর সঠিক প্রযুক্তিগত পথ বেছে নিই।",
    "We want to contribute to the global technology ecosystem through engineering, knowledge sharing, product development, and security awareness.": "ইঞ্জিনিয়ারিং, জ্ঞান ভাগাভাগি, পণ্য উন্নয়ন ও নিরাপত্তা সচেতনতার মাধ্যমে আমরা বৈশ্বিক প্রযুক্তি ইকোসিস্টেমে অবদান রাখতে চাই।",
    "Welcome,": "স্বাগতম,",
    "What We Do": "আমরা কী করি",
    "Workflows and agents that reduce repetitive work without hiding important decisions.": "গুরুত্বপূর্ণ সিদ্ধান্ত আড়াল না করে পুনরাবৃত্ত কাজ কমায় এমন ওয়ার্কফ্লো ও এজেন্ট।",
    "WORKING NOTE": "কাজের নোট",
    "WORKING STYLE": "কাজের ধরন",
    "Your Albero Studio workspace.": "আপনার আলবেরো স্টুডিও ওয়ার্কস্পেস।",
    "Previous page": "আগের পেজ",
    "Next page": "পরের পেজ",
    "Open cart": "কার্ট খুলুন",
    "Open help chat": "সহায়তা চ্যাট খুলুন",
    "Scroll to top": "উপরে যান",
    "Save course": "কোর্স সংরক্ষণ করুন",
    "Work with Albero Studio": "আলবেরো স্টুডিওর সঙ্গে কাজ করুন",
    "Email address": "ইমেইল ঠিকানা",
    "Contact information": "যোগাযোগের তথ্য",
    "Contact details": "যোগাযোগের তথ্য",
    "SECURE WORKSPACE": "নিরাপদ ওয়ার্কস্পেস",
    "YOUR WORKSPACE": "আপনার ওয়ার্কস্পেস",
    "ACTIVE WORKSPACE": "সক্রিয় ওয়ার্কস্পেস",
    "Secure client access": "নিরাপদ ক্লায়েন্ট অ্যাক্সেস",
    "Private client access": "ব্যক্তিগত ক্লায়েন্ট অ্যাক্সেস",
    "Built for clear project progress.": "পরিষ্কার প্রজেক্ট অগ্রগতির জন্য তৈরি।",
    "Your project, all in one place.": "আপনার প্রজেক্ট, সবকিছু এক জায়গায়।",
    "Keep project updates, quotations, and order information close at hand while the work moves forward.": "কাজ এগিয়ে চলার সময় প্রজেক্ট আপডেট, কোটেশন ও অর্ডারের তথ্য এক জায়গায় রাখুন।",
    "Project updates": "প্রজেক্ট আপডেট",
    "See the latest progress and next steps.": "সর্বশেষ অগ্রগতি ও পরবর্তী পদক্ষেপ দেখুন।",
    "Quotations & orders": "কোটেশন ও অর্ডার",
    "Review the information connected to your work.": "আপনার কাজের সঙ্গে যুক্ত তথ্য পর্যালোচনা করুন।",
    "Clear communication": "পরিষ্কার যোগাযোগ",
    "Keep every important detail in context.": "গুরুত্বপূর্ণ প্রতিটি তথ্য প্রাসঙ্গিকভাবে সংরক্ষণ করুন।",
    "Need help?": "সহায়তা দরকার?",
    "Contact Albero Studio": "আলবেরো স্টুডিওতে যোগাযোগ করুন",
    "Albero Studio client access": "আলবেরো স্টুডিও ক্লায়েন্ট অ্যাক্সেস",
    "Sign in to your portal": "আপনার পোর্টালে সাইন ইন করুন",
    "Use your client credentials to access your project workspace.": "প্রজেক্ট ওয়ার্কস্পেসে প্রবেশ করতে আপনার ক্লায়েন্ট তথ্য ব্যবহার করুন।",
    "Workspace status": "ওয়ার্কস্পেসের স্ট্যাটাস",
    "Active": "সক্রিয়",
    "Support": "সাপোর্ট",
    "Available": "উপলব্ধ",
    "Primary": "প্রধান নেভিগেশন",
    "Breadcrumb": "পথনির্দেশ",
    "Mobile menu": "মোবাইল মেনু",
    "Footer navigation": "ফুটার নেভিগেশন",
    "Facebook": "ফেসবুক",
    "YouTube": "ইউটিউব",
    "Social links": "সামাজিক লিংক",
    "Floating actions": "ভাসমান অ্যাকশন",
    "Blog pagination": "ব্লগ পেজিনেশন",
    "Case study pagination": "কেস স্টাডি পেজিনেশন",
    "Research topics": "গবেষণার বিষয়",
    "Research desk status": "গবেষণা ডেস্কের স্ট্যাটাস",
    "What would you like to build or improve?": "আপনি কী তৈরি বা উন্নত করতে চান?",
    "Our technology domains": "আমাদের প্রযুক্তির ক্ষেত্র",
    "Our services": "আমাদের সেবা",
    "Our 3C principles": "আমাদের ৩C নীতি",
    "Albero Studio focus": "আলবেরো স্টুডিওর ফোকাস",
    "Albero Studio location in Bangladesh": "বাংলাদেশে আলবেরো স্টুডিওর অবস্থান"
  });

  const localeLabels = {
    Home: localeTranslations.Home,
    Company: localeTranslations.Company,
    Technology: localeTranslations.Technology,
    Solutions: localeTranslations.Solutions,
    Products: localeTranslations.Products,
    Research: localeTranslations.Research,
    "Learning Zone": localeTranslations["Learning Zone"],
    Careers: localeTranslations.Careers,
    Contact: localeTranslations.Contact,
    Quotation: localeTranslations.Quotation,
    "Client Portal": localeTranslations["Client Portal"],
    "Privacy Policy": localeTranslations["Privacy Policy"]
  };

  const originalTextNodes = new WeakMap();
  const originalAttributes = new WeakMap();
  let localeObserver = null;
  let isTranslating = false;

  const isLocaleExcluded = (node) => {
    const element = node.parentElement;
    return !element || ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(element.tagName) ||
      element.closest(".corp-main-nav, .corp-mobile-menu, .corp-footer__nav, [data-locale-exclude]");
  };

  const translateTextNode = (node, bangla) => {
    if (!originalTextNodes.has(node)) originalTextNodes.set(node, node.nodeValue || "");
    const original = originalTextNodes.get(node);
    const trimmed = original.trim();
    if (!trimmed) {
      if (!bangla) node.nodeValue = original;
      return;
    }
    const normalized = trimmed.replace(/\s+/g, " ");
    const translated = localeTranslations[normalized];
    if (bangla && translated) node.nodeValue = original.replace(trimmed, translated);
    else if (!bangla) node.nodeValue = original;
  };

  const translateAttributes = (bangla) => {
    const attributes = ["placeholder", "aria-label", "title", "alt"];
    document.querySelectorAll("input, textarea, select, option, button, a, img, [title], [aria-label]").forEach((element) => {
      attributes.forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        let originals = originalAttributes.get(element);
        if (!originals) {
          originals = new Map();
          originalAttributes.set(element, originals);
        }
        if (!originals.has(attribute)) originals.set(attribute, element.getAttribute(attribute) || "");
        const original = originals.get(attribute);
        const translated = localeTranslations[original.trim()];
        if (bangla && translated) element.setAttribute(attribute, translated);
        else if (!bangla) element.setAttribute(attribute, original);
      });
    });
  };

  const translatePage = (bangla) => {
    if (!(document.body instanceof HTMLElement)) return;
    isTranslating = true;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (!isLocaleExcluded(node)) translateTextNode(node, bangla);
      node = walker.nextNode();
    }
    translateAttributes(bangla);
    if (!document.documentElement.dataset.localeEnglishTitle) {
      document.documentElement.dataset.localeEnglishTitle = document.title;
    }
    const englishTitle = document.documentElement.dataset.localeEnglishTitle;
    const translatedTitle = localeTranslations[englishTitle];
    if (bangla && translatedTitle) document.title = translatedTitle;
    else if (!bangla) document.title = englishTitle;
    isTranslating = false;
  };

  const watchForDynamicContent = (bangla) => {
    localeObserver?.disconnect();
    localeObserver = null;
    if (!bangla || !(document.body instanceof HTMLElement)) return;
    localeObserver = new MutationObserver((mutations) => {
      if (isTranslating || !mutations.some((mutation) => mutation.addedNodes.length)) return;
      window.requestAnimationFrame(() => {
        if (!isTranslating) translatePage(true);
      });
    });
    localeObserver.observe(document.body, { childList: true, subtree: true });
  };

  const applyLocale = (locale) => {
    const bangla = locale === "bn";
    document.documentElement.lang = bangla ? "bn" : "en";
    document.body.classList.toggle("locale-bn", bangla);
    document.querySelectorAll(".corp-main-nav a, .corp-mobile-menu a, .corp-footer__nav a").forEach((link) => {
      const english = link.dataset.englishLabel || link.textContent.trim();
      link.dataset.englishLabel = english;
      link.textContent = bangla ? localeLabels[english] || english : english;
    });
    translatePage(bangla);
    document.querySelectorAll("[data-locale-toggle]").forEach((button) => {
      button.textContent = bangla ? "English" : "Bangla";
      button.setAttribute("aria-label", bangla ? "Switch to English" : "View in Bangla");
    });
    watchForDynamicContent(bangla);
    try { window.localStorage.setItem("albero-locale", locale); } catch {}
  };

  const initLocale = () => {
    const actions = document.querySelector(".corp-right-actions");
    const mobileMenu = document.querySelector(".corp-mobile-menu");
    if (!actions && !mobileMenu) return;

    const createToggle = () => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "locale-toggle";
      button.setAttribute("data-locale-toggle", "");
      button.addEventListener("click", () => {
        const next = document.documentElement.lang === "bn" ? "en" : "bn";
        applyLocale(next);
      });
      return button;
    };

    actions?.append(createToggle());
    let locale = "en";
    try { locale = window.localStorage.getItem("albero-locale") || "en"; } catch {}
    applyLocale(locale);
  };

  const loadAssistant = () => {
    if (!document.querySelector("link[data-assistant-style]")) {
      const style = document.createElement("link");
      style.rel = "stylesheet";
      style.href = "assistant.css";
      style.dataset.assistantStyle = "";
      document.head.append(style);
    }
    if (!document.querySelector("script[data-assistant-script]")) {
      const script = document.createElement("script");
      script.src = "assistant.js";
      script.dataset.assistantScript = "";
      document.head.append(script);
    }
  };

  const initGlobalSearch = () => {
    const actions = document.querySelector(".corp-right-actions");
    if (!actions || document.getElementById("siteSearchPanel")) return;

    const searchEntries = [
      { title: "Home", bnTitle: "হোম", type: "Overview", bnType: "সংক্ষিপ্ত পরিচিতি", description: "Secure intelligence and useful technology from Bangladesh.", bnDescription: "বাংলাদেশ থেকে নিরাপদ বুদ্ধিমত্তা ও কার্যকর প্রযুক্তি।", keywords: "home alberostudio technology", href: "index.html" },
      { title: "Company", bnTitle: "কোম্পানি", type: "About us", bnType: "আমাদের সম্পর্কে", description: "Our people, values, 3C theory, and long-term direction.", bnDescription: "আমাদের মানুষ, মূল্যবোধ, ৩C তত্ত্ব ও দীর্ঘমেয়াদি দিকনির্দেশনা।", keywords: "company founders values 3c bangladesh", href: "company.html" },
      { title: "Technology", bnTitle: "প্রযুক্তি", type: "Capabilities", bnType: "সক্ষমতা", description: "Cybersecurity, AI, machine learning, and software engineering.", bnDescription: "সাইবার সিকিউরিটি, AI, মেশিন লার্নিং ও সফটওয়্যার ইঞ্জিনিয়ারিং।", keywords: "technology cybersecurity artificial intelligence machine learning engineering", href: "services.html" },
      { title: "Products", bnTitle: "পণ্য", type: "In development", bnType: "উন্নয়নাধীন", description: "Products and capabilities we are researching and building.", bnDescription: "যেসব পণ্য ও সক্ষমতা নিয়ে আমরা গবেষণা ও নির্মাণ করছি।", keywords: "products development roadmap", href: "products.html" },
      { title: "Research Desk", bnTitle: "গবেষণা ডেস্ক", type: "Insights", bnType: "চিন্তা ও গবেষণা", description: "Research, field notes, and practical technology perspectives.", bnDescription: "গবেষণা, মাঠ-নোট ও প্রযুক্তি নিয়ে ব্যবহারিক দৃষ্টিভঙ্গি।", keywords: "research blog insights cybersecurity ai engineering", href: "blog.html" },
      { title: "Learning Zone", bnTitle: "লার্নিং জোন", type: "Courses", bnType: "কোর্স", description: "Practical IT courses across security, software, cloud, and data.", bnDescription: "সিকিউরিটি, সফটওয়্যার, ক্লাউড ও ডেটা নিয়ে ব্যবহারিক আইটি কোর্স।", keywords: "learning courses cybersecurity python cloud database ai", href: "learning-zone.html" },
      { title: "Careers", bnTitle: "ক্যারিয়ার", type: "Talent network", bnType: "ট্যালেন্ট নেটওয়ার্ক", description: "Find your place in Albero Studio's future talent network.", bnDescription: "আলবেরো স্টুডিওর ভবিষ্যৎ ট্যালেন্ট নেটওয়ার্কে আপনার জায়গা খুঁজুন।", keywords: "careers jobs internship talent network", href: "careers.html" },
      { title: "Contact", bnTitle: "যোগাযোগ", type: "Start a conversation", bnType: "আলাপ শুরু করুন", description: "Tell us what you are trying to understand, protect, or build.", bnDescription: "আপনি কী বুঝতে, সুরক্ষিত করতে বা তৈরি করতে চাইছেন—আমাদের জানান।", keywords: "contact email phone consultation", href: "contact.html" },
      { title: "Request a Quotation", bnTitle: "কোটেশন অনুরোধ", type: "Project planning", bnType: "প্রজেক্ট পরিকল্পনা", description: "Share your brief and request a tailored technology quotation.", bnDescription: "আপনার প্রয়োজন জানিয়ে উপযোগী প্রযুক্তি কোটেশন অনুরোধ করুন।", keywords: "quotation quote project budget brief", href: "quote.html" },
      { title: "Client Portal", bnTitle: "ক্লায়েন্ট পোর্টাল", type: "Workspace", bnType: "ওয়ার্কস্পেস", description: "Access project updates, quotations, and order information.", bnDescription: "প্রজেক্ট আপডেট, কোটেশন ও অর্ডারের তথ্য দেখুন।", keywords: "client portal login project", href: "client-portal.html" }
    ];

    let trigger = actions.querySelector(".hero-search-btn");
    if (!(trigger instanceof HTMLButtonElement)) {
      trigger = document.createElement("button");
      trigger.type = "button";
      trigger.className = "corp-icon-btn hero-search-btn";
      trigger.setAttribute("aria-label", "Search Albero Studio");
      trigger.innerHTML = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.9 18.2C14.93 18.2 18.2 14.93 18.2 10.9C18.2 6.87 14.93 3.6 10.9 3.6C6.87 3.6 3.6 6.87 3.6 10.9C3.6 14.93 6.87 18.2 10.9 18.2Z" stroke="currentColor" stroke-width="2"/><path d="M16.2 16.2L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;
      actions.prepend(trigger);
    }

    const scrim = document.createElement("div");
    scrim.className = "site-search-scrim";
    scrim.setAttribute("aria-hidden", "true");

    const panel = document.createElement("section");
    panel.className = "site-search-panel";
    panel.id = "siteSearchPanel";
    panel.setAttribute("aria-label", "Search Albero Studio");
    panel.innerHTML = `
      <div class="site-search-panel__head">
        <div>
          <p class="site-search-panel__eyebrow">SEARCH ALBERO</p>
          <h2>What are you looking for?</h2>
        </div>
        <button class="site-search-panel__close" type="button" aria-label="Close search">&times;</button>
      </div>
      <label class="site-search-input">
        <span class="sr-only">Search pages and topics</span>
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M10.9 18.2C14.93 18.2 18.2 14.93 18.2 10.9C18.2 6.87 14.93 3.6 10.9 3.6C6.87 3.6 3.6 6.87 3.6 10.9C3.6 14.93 6.87 18.2 10.9 18.2Z" stroke="currentColor" stroke-width="2"/><path d="M16.2 16.2L21 21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        <input id="siteSearchInput" type="search" placeholder="Search pages, services, or topics..." autocomplete="off" />
        <kbd>ESC</kbd>
      </label>
      <div class="site-search-results" id="siteSearchResults" aria-live="polite"></div>`;

    document.body.append(scrim, panel);
    trigger.setAttribute("aria-controls", panel.id);
    trigger.setAttribute("aria-expanded", "false");

    const input = panel.querySelector("#siteSearchInput");
    const results = panel.querySelector("#siteSearchResults");
    const closeButton = panel.querySelector(".site-search-panel__close");

    const renderResults = (value = "") => {
      if (!(results instanceof HTMLElement)) return;
      const bangla = document.documentElement.lang === "bn";
      const query = value.trim().toLowerCase();
      const matches = searchEntries.filter((entry) => !query || `${entry.title} ${entry.type} ${entry.description} ${entry.keywords} ${entry.bnTitle} ${entry.bnType} ${entry.bnDescription}`.toLowerCase().includes(query));
      results.innerHTML = "";

      if (matches.length === 0) {
        const empty = document.createElement("p");
        empty.className = "site-search-empty";
        empty.textContent = "No matching page or topic found.";
        results.append(empty);
        return;
      }

      matches.slice(0, 7).forEach((entry) => {
        const link = document.createElement("a");
        link.className = "site-search-result";
        link.href = entry.href;
        const title = bangla ? entry.bnTitle : entry.title;
        const type = bangla ? entry.bnType : entry.type;
        const description = bangla ? entry.bnDescription : entry.description;
        link.innerHTML = `<span class="site-search-result__icon" aria-hidden="true">↗</span><span><small>${type}</small><strong>${title}</strong><em>${description}</em></span>`;
        results.append(link);
      });
    };

    const close = () => {
      panel.classList.remove("is-open");
      scrim.classList.remove("is-open");
      document.body.classList.remove("search-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    const open = () => {
      panel.classList.add("is-open");
      scrim.classList.add("is-open");
      document.body.classList.add("search-open");
      trigger.setAttribute("aria-expanded", "true");
      renderResults(input instanceof HTMLInputElement ? input.value : "");
      window.setTimeout(() => input instanceof HTMLInputElement && input.focus(), 40);
    };

    trigger.addEventListener("click", () => {
      if (panel.classList.contains("is-open")) close();
      else open();
    });
    closeButton?.addEventListener("click", close);
    scrim.addEventListener("click", close);
    input?.addEventListener("input", () => renderResults(input.value));
    document.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open();
      }
      if (event.key === "Escape" && panel.classList.contains("is-open")) close();
    });

    renderResults();
  };

  const initFilters = () => {
    document.querySelectorAll("[data-filter-target]").forEach((filter) => {
      if (!(filter instanceof HTMLSelectElement)) return;

      const targetSelector = filter.getAttribute("data-filter-target");
      const getCards = () => (targetSelector ? document.querySelectorAll(targetSelector) : []);
      const emptyState = filter.getAttribute("data-filter-empty")
        ? document.querySelector(filter.getAttribute("data-filter-empty"))
        : null;

      const applyFilter = () => {
        const selected = filter.value.toLowerCase();
        let visibleCount = 0;

        const cards = getCards();
        cards.forEach((card) => {
          const category = (card.getAttribute("data-filter-value") || "").toLowerCase();
          const visible = selected === "all" || category === selected;
          card.toggleAttribute("hidden", !visible);
          if (visible) visibleCount += 1;
        });

        if (emptyState instanceof HTMLElement) {
          emptyState.toggleAttribute("hidden", visibleCount > 0);
        }
      };

      filter.addEventListener("change", applyFilter);
      applyFilter();
    });
  };

  const initCurrentYear = () => {
    document.querySelectorAll("[data-current-year]").forEach((element) => {
      element.textContent = String(new Date().getFullYear());
    });
  };

  const initHeaderState = () => {
    const header = document.getElementById("corpHeader");
    if (!header) return;

    const sync = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
  };

  const initActiveNav = () => {
    const aliases = {
      "blog-detail.html": "blog.html",
      "case-study-detail.html": "case-studies.html"
    };
    const currentFile = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
    const currentRoute = aliases[currentFile] || currentFile;

    document.querySelectorAll(".corp-main-nav a, .corp-mobile-menu a").forEach((link) => {
      const href = link.getAttribute("href") || "";
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const targetFile = (href.split("#")[0].split("?")[0].split("/").pop() || "index.html").toLowerCase();
      const active = (aliases[targetFile] || targetFile) === currentRoute;
      link.classList.toggle("is-current", active);
      if (active) link.setAttribute("aria-current", "page");
      else if (link.getAttribute("aria-current") === "page") link.removeAttribute("aria-current");
    });
  };

  const init = () => {
    initHeaderState();
    initActiveNav();
    initGlobalSearch();
    initFilters();
    initCurrentYear();
    initAnalytics();
    initLocale();
    loadAssistant();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
