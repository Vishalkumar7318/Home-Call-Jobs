import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'hi' | 'en';

export interface Translations {
  // Navigation
  nav: {
    home: string;
    about: string;
    whyUs: string;
    contact: string;
    employeeLogin: string;
    employeeDashboard: string;
    adminLogin: string;
    adminPanel: string;
    signOut: string;
    jobPortal: string;
    portalSwitch: string;
    publicSwitch: string;
    subBrand: string;
  };
  // Hero
  hero: {
    badge: string;
    titlePart1: string;
    titlePart2: string;
    subtitle: string;
    aboutBtn: string;
    whatsappBtn: string;
    stat1Title: string;
    stat1Sub: string;
    stat2Title: string;
    stat2Sub: string;
    stat3Title: string;
    stat3Sub: string;
    stat4Title: string;
    stat4Sub: string;
    whatsappMessage: string;
  };
  // About Us
  about: {
    badge: string;
    title: string;
    subtitle: string;
    missionTitle: string;
    missionPara1: string;
    missionPara2: string;
    termsTitle: string;
    mandatoryStatement: string;
    termsNote: string;
    bullet1: string;
    bullet2: string;
    bullet3: string;
    bullet4: string;
    cardTitle: string;
    cardDesc: string;
    service1Title: string;
    service1Desc: string;
    service2Title: string;
    service2Desc: string;
    service3Title: string;
    service3Desc: string;
  };
  // Why Choose Us
  whyUs: {
    badge: string;
    title: string;
    subtitle: string;
    guaranteedVerification: string;
    b1Title: string;
    b1Desc: string;
    b1Badge: string;
    b2Title: string;
    b2Desc: string;
    b2Badge: string;
    b3Title: string;
    b3Desc: string;
    b3Badge: string;
    b4Title: string;
    b4Desc: string;
    b4Badge: string;
    b5Title: string;
    b5Desc: string;
    b5Badge: string;
    b6Title: string;
    b6Desc: string;
    b6Badge: string;
    salaryFeeHeadline: string;
    salaryFeeSubtext: string;
  };
  // Contact
  contact: {
    badge: string;
    title: string;
    subtitle: string;
    cardTitle: string;
    cardSubtitle: string;
    instantWhatsapp: string;
    chatNow: string;
    emailLabel: string;
    supportPhoneLabel: string;
    officeLabel: string;
    hoursLabel: string;
    formTitle: string;
    formSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    nameError: string;
    phoneLabel: string;
    phonePlaceholder: string;
    phoneError: string;
    messageLabel: string;
    messagePlaceholder: string;
    messageError: string;
    galatBadge: string;
    sendBtn: string;
    successTitle: string;
    successDesc: string;
    sendAnotherBtn: string;
  };
  // Footer
  footer: {
    desc: string;
    verifiedPartner: string;
    quickNav: string;
    staffPortals: string;
    staffPortalsDesc: string;
    employeeAttendance: string;
    adminControl: string;
    contactSupport: string;
    disclosureLabel: string;
    disclosureText: string;
    copyright: string;
  };
  // Auth & Portals
  auth: {
    employeePortal: string;
    employeeSubtitle: string;
    empIdLabel: string;
    empIdPlaceholder: string;
    empIdError: string;
    empIdAssigned: string;
    passwordLabel: string;
    passwordError: string;
    signInBtn: string;
    adminAccessText: string;
    backToJobs: string;
    adminPortal: string;
    adminLoginTitle: string;
    adminLoginSubtitle: string;
  };
  // Policy & Working Hours
  policy: {
    workingHoursTitle: string;
    workingHoursVal: string;
    allDaysNoHoliday: string;
    absentRuleTitle: string;
    absentRuleDesc: string;
    absentDeductionRate: string;
    absentDeductionStat: string;
    absentPerDay: string;
    totalDeduction: string;
    policyBanner: string;
    deductionBadge: string;
  };
}

export const translations: Record<Language, Translations> = {
  hi: {
    nav: {
      home: 'होम',
      about: 'हमारे बारे में',
      whyUs: 'हमारा चयन क्यों करें',
      contact: 'संपर्क करें',
      employeeLogin: 'कर्मचारी लॉगिन',
      employeeDashboard: 'कर्मचारी डैशबोर्ड',
      adminLogin: 'एडमिन लॉगिन',
      adminPanel: 'एडमिन पैनल',
      signOut: 'लॉग आउट',
      jobPortal: 'जॉब पोर्टल',
      portalSwitch: 'पोर्टल',
      publicSwitch: 'मुख्य पृष्ठ',
      subBrand: 'भर्ती एवं कर्मचारी पोर्टल',
    },
    hero: {
      badge: 'विशेष टेलीकॉलिंग एवं वॉइस भर्ती नेटवर्क',
      titlePart1: 'Home Call Jobs के साथ पाएं अपनी',
      titlePart2: 'कॉलिंग जॉब',
      subtitle: 'शीर्ष कंपनियों के साथ सत्यापित घरेलू और अंतरराष्ट्रीय टेलीकॉलिंग, इनबाउंड कस्टमर सर्विस, आउटबाउंड सेल्स और वर्क-फ्रॉम-होम वॉइस करियर के लिए आपका विश्वसनीय मंच।',
      aboutBtn: 'हमारे बारे में जानें',
      whatsappBtn: 'व्हाट्सएप पर संपर्क करें',
      stat1Title: '100% कॉलिंग',
      stat1Sub: 'समर्पित वॉइस जॉब्स',
      stat2Title: 'सत्यापित अवसर',
      stat2Sub: 'सीधा HR से संपर्क',
      stat3Title: 'घर या ऑफिस से',
      stat3Sub: 'लचीली शिफ्ट्स',
      stat4Title: 'फ्रेशर्स का स्वागत',
      stat4Sub: 'सशुल्क ट्रेनिंग शामिल',
      whatsappMessage: 'नमस्ते Home Call Jobs टीम, मैं टेलीकॉलिंग / कॉलिंग जॉब के अवसरों की तलाश में हूँ। कृपया वर्तमान रिक्तियों के साथ मेरा मार्गदर्शन करें।',
    },
    about: {
      badge: 'Home Call Jobs के बारे में',
      title: 'प्रतिभा को प्रमुख कॉलिंग करियर से जोड़ना',
      subtitle: 'पूरे भारत में टेलीकॉलर्स, कस्टमर रिलेशनशिप प्रबंधन, सेल्स वॉइस प्रोसेस और रिमोट सपोर्ट प्रोफेशनल्स के लिए समर्पित भर्ती मंच।',
      missionTitle: 'हमारा लक्ष्य: वॉइस और टेलीकॉलिंग रोजगार को सरल बनाना',
      missionPara1: 'Home Call Jobs में, हमारा मानना है कि अच्छे संचार कौशल और समर्पण वाले प्रत्येक व्यक्ति को वैध और अच्छे वेतन वाले करियर तक सीधी पहुंच मिलनी चाहिए। आम जॉब पोर्टल्स वॉइस जॉब्स को अन्य आईटी जॉब्स के साथ मिला देते हैं, जबकि Home Call Jobs को विशेष रूप से टेलीकॉलर्स, टेली-सेल्स एग्जीक्यूटिव्स, कस्टमर केयर और BPO विशेषज्ञों के लिए बनाया गया है।',
      missionPara2: 'हम सत्यापित कॉर्पोरेट नियोक्ताओं, वित्तीय संस्थानों, बीमा प्रदाताओं और अंतरराष्ट्रीय BPO कंपनियों के साथ साझेदारी करते हैं ताकि नौकरी चाहने वालों तक सत्यापित अवसर सीधे पहुँच सकें। चाहे आप प्रमुख शहरों में पूर्णकालिक ऑफिस जॉब ढूंढ रहे हों या वर्क-फ्रॉम-होम (WFH) कॉलिंग असाइनमेंट, हम उम्मीदवारों और भर्ती प्रबंधकों के बीच सीधा संपर्क स्थापित करते हैं।',
      termsTitle: 'सेवा की शर्तें एवं पहुंच मॉडल',
      mandatoryStatement: 'Home Call Jobs operates on a paid-access basis. Access to certain website services and resources is provided under paid-access conditions.',
      termsNote: 'हमारा मंच दोनों पक्षों—उम्मीदवारों और भर्ती करने वाली कंपनियों के लिए उत्कृष्ट परिणाम सुनिश्चित करने हेतु सख्त नियोक्ता सत्यापन, गुणवत्ता नियंत्रण और समर्पित भर्ती समन्वयक बनाए रखता है।',
      bullet1: '100% सत्यापित कॉर्पोरेट नियोक्ता',
      bullet2: 'समर्पित व्यक्तिगत उम्मीदवार मार्गदर्शन',
      bullet3: 'शून्य फर्जी कंसल्टेंसी लिस्टिंग',
      bullet4: 'फ्रेशर्स एवं अनुभवी दोनों का स्वागत',
      cardTitle: 'कॉलिंग नौकरियों में विशेषज्ञता',
      cardDesc: 'हम विशेष रूप से वॉइस और ग्राहक संवाद के व्यवसायों पर ध्यान केंद्रित करते हैं, जिससे उम्मीदवारों को प्रासंगिक इंटरव्यू और प्रतिस्पर्धी सैलरी पैकेज मिल सके।',
      service1Title: 'इनबाउंड कस्टमर सपोर्ट',
      service1Desc: 'सत्यापित ग्राहकों को पूछताछ और तकनीकी सहायता प्रदान करना',
      service2Title: 'हाई-इंसेंटिव टेली-सेल्स',
      service2Desc: 'बैंकिंग, क्रेडिट कार्ड्स और लोन में आकर्षक कमीशन संरचना',
      service3Title: 'घरेलू और ग्लोबल BPOs',
      service3Desc: 'डे शिफ्ट, नाइट शिफ्ट और लचीले वर्क फ्रॉम होम विकल्प',
    },
    whyUs: {
      badge: 'हमारी विशेषताएं',
      title: 'Home Call Jobs ही क्यों चुनें?',
      subtitle: 'कॉलिंग और टेली-सेल्स उम्मीदवारों द्वारा झेली जाने वाली आम समस्याओं को समाप्त करने के लिए तैयार किया गया मंच।',
      guaranteedVerification: '100% प्रामाणिक सत्यापन',
      b1Title: 'सीधा HR व्हाट्सएप संपर्क',
      b1Desc: 'बिचौलिया कंसल्टेंसियों और ईमेल के लंबे इंतज़ार से बचें। व्हाट्सएप के माध्यम से अधिकृत HR प्रतिनिधियों से सीधा संवाद करें।',
      b1Badge: 'फास्ट ट्रैक',
      b2Title: 'पारदर्शी और सत्यापित वेतन',
      b2Desc: 'स्पष्ट वेतन विवरण—जिसमें निश्चित मूल वेतन, प्रदर्शन प्रोत्साहन (इंसेंटिव), ओवरटाइम और शिफ्ट भत्ते शामिल हैं।',
      b2Badge: 'शानदार वेतन',
      b3Title: '48 घंटे में इंटरव्यू शेड्यूलिंग',
      b3Desc: 'हमारे हायरिंग पार्टनर्स Home Call Jobs के आवेदकों को प्राथमिकता देते हैं और 48 व्यावसायिक घंटों में वॉइस स्क्रीनिंग तय करते हैं।',
      b3Badge: 'त्वरित जॉइनिंग',
      b4Title: 'फ्रेशर्स का पूरा स्वागत',
      b4Desc: 'कॉलिंग का कोई पूर्व अनुभव नहीं? कई पार्टनर कंपनियां लाइव कॉलिंग से पहले 7-15 दिनों की सशुल्क वॉइस और CRM ट्रेनिंग देती हैं।',
      b4Badge: 'सशुल्क ट्रेनिंग',
      b5Title: 'लचीली शिफ्ट्स और WFH विकल्प',
      b5Desc: 'अपनी सुविधानुसार सामान्य डे शिफ्ट, नाइट अलाउंस वाली नाइट शिफ्ट या घर से काम (Work From Home) चुनें।',
      b5Badge: 'फ्लेक्सिबिलिटी',
      b6Title: 'वास्तविक करियर प्रगति',
      b6Desc: 'लगातार अच्छे प्रदर्शन से एसोसिएट टेलीकॉलर से क्वालिटी एनालिस्ट, टीम कोच और टीम लीडर के पद तक 12-18 महीनों में तरक्की।',
      b6Badge: 'करियर ग्रोथ',
      salaryFeeHeadline: 'आपको हर महीने ₹3,000 (तीन हज़ार रुपये) देना पड़ेगा सैलरी आने के बाद काम करने के लिए।',
      salaryFeeSubtext: 'सैलरी आने के बाद ही शुल्क देय है • कोई अग्रिम (एडवांस) भुगतान नहीं • 100% पारदर्शी और विश्वसनीय व्यवस्था',
    },
    contact: {
      badge: 'संपर्क करें',
      title: 'Home Call Jobs से संपर्क करें',
      subtitle: 'टेलीकॉलिंग पदों, भर्ती आवश्यकताओं या आवेदन की स्थिति के बारे में कोई सवाल है? हमारी सपोर्ट टीम आपकी मदद के लिए तैयार है।',
      cardTitle: 'उम्मीदवार सहायता केंद्र',
      cardSubtitle: 'हमारी करियर सलाहकार टीम से व्हाट्सएप या फोन के माध्यम से सीधे संपर्क करें।',
      instantWhatsapp: 'तुरंत HR व्हाट्सएप',
      chatNow: 'अभी चैट करें →',
      emailLabel: 'ईमेल पता',
      supportPhoneLabel: 'सपोर्ट फोन',
      officeLabel: 'पंजीकृत कार्यालय',
      hoursLabel: 'कार्य समय',
      formTitle: 'हमें तुरंत संदेश भेजें',
      formSubtitle: 'नीचे अपना विवरण भरें और हमारी टीम से सीधे व्हाट्सएप पर जुड़ने के लिए बटन दबाएं।',
      nameLabel: 'पूरा नाम *',
      namePlaceholder: 'अपना पूरा नाम लिखें',
      nameError: 'नाम दर्ज करें (कम से कम 2 अक्षर)',
      phoneLabel: 'फोन / व्हाट्सएप नंबर *',
      phonePlaceholder: '10 अंकों का मोबाइल नंबर (उदा. 7238087918)',
      phoneError: '10 अंकों का नंबर (गलत)',
      messageLabel: 'आपका संदेश / कार्य समय उपलब्धता *',
      messagePlaceholder: 'अपनी योग्यता, शहर और पसंदीदा शिफ्ट्स के बारे में लिखें...',
      messageError: 'कृपया अपना संदेश लिखें (कम से कम 3 अक्षर)',
      galatBadge: 'गलत',
      sendBtn: 'व्हाट्सएप पर संदेश भेजें',
      successTitle: 'संदेश व्हाट्सएप पर भेजा गया!',
      successDesc: 'धन्यवाद। हमारे भर्ती समन्वयक आपके संदेश की समीक्षा करेंगे और जल्द ही आपसे संपर्क करेंगे।',
      sendAnotherBtn: 'दूसरा संदेश भेजें',
    },
    footer: {
      desc: 'भारत का विशिष्ट भर्ती मंच जो कुशल उम्मीदवारों को शीर्ष टेलीकॉलिंग, इनबाउंड कस्टमर सपोर्ट, आउटबाउंड सेल्स और वॉइस प्रोसेस अवसरों से जोड़ता है।',
      verifiedPartner: 'सत्यापित भर्ती पार्टनर',
      quickNav: 'त्वरित नेविगेशन',
      staffPortals: 'स्टाफ पोर्टल',
      staffPortalsDesc: 'सत्यापित स्टाफ और व्यवस्थापक के लिए दैनिक उपस्थिति और भर्ती प्रक्रिया प्रबंधन।',
      employeeAttendance: 'कर्मचारी उपस्थिति एवं डैशबोर्ड',
      adminControl: 'एडमिन कंट्रोल सेंटर',
      contactSupport: 'संपर्क एवं सहायता',
      disclosureLabel: 'अधिसूचना:',
      disclosureText: 'Home Call Jobs operates on a paid-access basis. Access to certain website services and resources is provided under paid-access conditions.',
      copyright: 'Home Call Jobs. सर्वाधिकार सुरक्षित।',
    },
    auth: {
      employeePortal: 'कर्मचारी पोर्टल',
      employeeSubtitle: 'अपनी दैनिक उपस्थिति और रिपोर्ट देखने के लिए अपने दिए गए Employee ID और पासवर्ड से लॉगिन करें।',
      empIdLabel: 'Employee ID *',
      empIdPlaceholder: 'उदा. HCJ-101',
      empIdError: 'गलत ID',
      empIdAssigned: 'एडमिन द्वारा आवंटित ID',
      passwordLabel: 'पासवर्ड *',
      passwordError: 'गलत पासवर्ड',
      signInBtn: 'डैशबोर्ड में लॉगिन करें',
      adminAccessText: 'एडमिन: एडमिन पैनल से सभी कर्मचारियों का पोर्टल एक्सेस करें →',
      backToJobs: '← मुख्य पृष्ठ पर वापस जाएं',
      adminPortal: 'एडमिन पोर्टल',
      adminLoginTitle: 'एडमिन कंट्रोल पोर्टल',
      adminLoginSubtitle: 'कर्मचारियों, उपस्थिति और सेटिंग्स को प्रबंधित करने के लिए अपने एडमिन क्रेडेंशियल से लॉगिन करें।',
    },
    policy: {
      workingHoursTitle: 'कार्य समय (Operating Hours)',
      workingHoursVal: '11:50 AM से 8:00 PM (प्रतिदिन - कोई अवकाश नहीं)',
      allDaysNoHoliday: 'प्रतिदिन - कोई अवकाश नहीं (All Days / No Holiday)',
      absentRuleTitle: 'अनुपस्थिति कटौती नीति (Absent Penalty)',
      absentRuleDesc: 'यदि कोई 1 दिन काम नहीं करता है तो उसका ₹500 कम हो जाएगा (वेतन में से ₹500 काटा जाएगा)।',
      absentDeductionRate: '₹500 प्रति अनुपस्थित दिन',
      absentDeductionStat: 'अनुपस्थिति कटौती',
      absentPerDay: '₹500 / दिन कटौती',
      totalDeduction: 'कुल अनुपस्थिति कटौती',
      policyBanner: 'कार्य समय: 11:50 AM से 8:00 PM (प्रतिदिन - कोई अवकाश नहीं) • नियम: यदि कोई 1 दिन काम नहीं करता है तो उसका ₹500 कम हो जाएगा।',
      deductionBadge: 'कटौती: ₹500',
    },
  },
  en: {
    nav: {
      home: 'Home',
      about: 'About Us',
      whyUs: 'Why Choose Us',
      contact: 'Contact',
      employeeLogin: 'Employee Login',
      employeeDashboard: 'Employee Dashboard',
      adminLogin: 'Admin Login',
      adminPanel: 'Admin Panel',
      signOut: 'Sign Out',
      jobPortal: 'Job Portal',
      portalSwitch: 'Portals',
      publicSwitch: 'Public',
      subBrand: 'Recruitment & Employee Portal',
    },
    hero: {
      badge: 'Specialized Telecalling & Voice Recruitment Network',
      titlePart1: 'Find Your Calling Job With',
      titlePart2: 'Home Call Jobs',
      subtitle: 'Your trusted gateway to verified domestic and international telecalling, inbound customer service, outbound sales, and work-from-home voice careers with top hiring companies.',
      aboutBtn: 'About Home Call Jobs',
      whatsappBtn: 'Connect on WhatsApp',
      stat1Title: '100% Calling',
      stat1Sub: 'Focused Voice Jobs',
      stat2Title: 'Verified',
      stat2Sub: 'Direct HR Connections',
      stat3Title: 'WFH & Office',
      stat3Sub: 'Flexible Shifts',
      stat4Title: 'Freshers OK',
      stat4Sub: 'Paid Training Included',
      whatsappMessage: 'Hello Home Call Jobs Team, I am looking for calling / telecalling job opportunities. Please assist me with current openings.',
    },
    about: {
      badge: 'About Home Call Jobs',
      title: 'Connecting Talent With Leading Calling Careers',
      subtitle: 'Specialized recruitment platform engineered solely for telecalling, customer relationship management, sales voice processes, and remote support professionals across India.',
      missionTitle: 'Our Mission: Democratizing Voice & Telecalling Employment',
      missionPara1: 'At Home Call Jobs, we believe every individual with strong communication skills and dedication deserves access to legitimate, high-paying career paths. While traditional job portals lump voice roles together with unrelated IT listings, Home Call Jobs is built from the ground up specifically for telecallers, tele-sales executives, customer care representatives, and BPO specialists.',
      missionPara2: 'We partner with verified corporate employers, financial institutions, insurance providers, and international BPOs to bring verified opportunities directly to job seekers. Whether you seek a full-time office position in major metropolitan hubs or flexible Work From Home (WFH) calling assignments, we facilitate direct lines of communication between candidates and hiring managers.',
      termsTitle: 'Terms of Service & Access Model',
      mandatoryStatement: 'Home Call Jobs operates on a paid-access basis. Access to certain website services and resources is provided under paid-access conditions.',
      termsNote: 'Our platform maintains stringent employer verification, quality control, and dedicated recruitment coordinators to deliver exceptional outcomes for both candidates and hiring firms.',
      bullet1: '100% Verified Corporate Employers',
      bullet2: 'Dedicated Candidate Guidance',
      bullet3: 'Zero Fake Consultancy Listings',
      bullet4: 'Freshers & Experienced Welcomed',
      cardTitle: 'Specialized In Calling Positions',
      cardDesc: 'We focus exclusively on voice and customer engagement professions, ensuring candidates receive relevant interviews and competitive salary packages.',
      service1Title: 'Inbound Customer Support',
      service1Desc: 'Assisting verified customers with inquiries & technical help',
      service2Title: 'High-Incentive Tele-Sales',
      service2Desc: 'Lucrative commission structures in banking, credit & loans',
      service3Title: 'Domestic & Global BPOs',
      service3Desc: 'Day shifts, night shifts, and flexible remote assignments',
    },
    whyUs: {
      badge: 'Competitive Advantages',
      title: 'Why Choose Home Call Jobs',
      subtitle: 'Built specifically to solve the common hurdles faced by calling and tele-sales job candidates across the industry.',
      guaranteedVerification: 'Guaranteed Verification',
      b1Title: 'Direct HR WhatsApp Connect',
      b1Desc: 'Bypass intermediary consultancies and endless email wait times. Communicate directly with authorized HR representatives via WhatsApp.',
      b1Badge: 'Fast Track',
      b2Title: 'Transparent & Verified Salaries',
      b2Desc: 'Clear compensation breakdown upfront, including fixed base pay, performance incentives, overtime allowances, and shift bonuses.',
      b2Badge: 'High Pay',
      b3Title: '48-Hour Interview Scheduling',
      b3Desc: 'Our hiring partners prioritize Home Call Jobs applicants, scheduling virtual or in-person voice screening within 48 business hours.',
      b3Badge: 'Quick Joining',
      b4Title: 'Freshers Fully Welcomed',
      b4Desc: 'No prior voice experience? Many partner companies offer 7-15 days of paid voice, accent, and CRM product training before live calling.',
      b4Badge: 'Paid Training',
      b5Title: 'Flexible Shifts & WFH Options',
      b5Desc: 'Choose between standard day shifts, lucrative night allowances, or flexible remote Work From Home arrangements suited to your lifestyle.',
      b5Badge: 'Flexibility',
      b6Title: 'Real Career Progression',
      b6Desc: 'Progress from Associate Telecaller to Quality Analyst, Team Coach, and Operations Team Leader within 12-18 months of consistent performance.',
      b6Badge: 'Growth Path',
      salaryFeeHeadline: 'You will have to pay ₹3,000 (three thousand rupees) every month after receiving your salary to continue working.',
      salaryFeeSubtext: 'Service fee payable strictly after your salary is received • Zero advance payment required • Verified & transparent process',
    },
    contact: {
      badge: 'Get in Touch',
      title: 'Contact Home Call Jobs',
      subtitle: 'Have questions about telecalling positions, hiring requirements, or application status? Our candidate support team is here to assist.',
      cardTitle: 'Candidate Support Center',
      cardSubtitle: 'Connect with our career advisory team directly via WhatsApp or phone.',
      instantWhatsapp: 'Instant HR WhatsApp',
      chatNow: 'Chat Now →',
      emailLabel: 'Email Address',
      supportPhoneLabel: 'Support Phone',
      officeLabel: 'Registered Office',
      hoursLabel: 'Operations Hours',
      formTitle: 'Send Us a Quick Message',
      formSubtitle: 'Fill out your details below and click Send to connect directly on WhatsApp with our team.',
      nameLabel: 'Full Name *',
      namePlaceholder: 'Enter your full name',
      nameError: 'Please enter your name (min 2 letters)',
      phoneLabel: 'Phone / WhatsApp Number *',
      phonePlaceholder: '10-digit mobile number (e.g. 7238087918)',
      phoneError: '10-digit number required (Invalid)',
      messageLabel: 'Your Message / Availability *',
      messagePlaceholder: 'Mention your qualification, city, and preferred shifts...',
      messageError: 'Please write your message (min 3 letters)',
      galatBadge: 'Invalid',
      sendBtn: 'Send Message via WhatsApp',
      successTitle: 'Inquiry Sent via WhatsApp!',
      successDesc: 'Thank you! Our recruitment coordinator will review your inquiry and connect with you promptly.',
      sendAnotherBtn: 'Send Another Message',
    },
    footer: {
      desc: "India's specialized recruitment platform connecting skilled professionals with top telecalling, inbound customer support, outbound tele-sales, and voice process opportunities.",
      verifiedPartner: 'Verified Recruitment Partner',
      quickNav: 'Quick Navigation',
      staffPortals: 'Staff Portals',
      staffPortalsDesc: 'Dedicated systems for verified staff and administrators to log attendance and oversee recruitment workflows.',
      employeeAttendance: 'Employee Attendance & Dashboard',
      adminControl: 'Administrative Control Center',
      contactSupport: 'Contact & Support',
      disclosureLabel: 'Disclosure:',
      disclosureText: 'Home Call Jobs operates on a paid-access basis. Access to certain website services and resources is provided under paid-access conditions.',
      copyright: 'Home Call Jobs. All rights reserved.',
    },
    auth: {
      employeePortal: 'Employee Portal',
      employeeSubtitle: 'Sign in with your assigned Employee ID and password to access your daily attendance and reports.',
      empIdLabel: 'Employee ID *',
      empIdPlaceholder: 'e.g. HCJ-101',
      empIdError: 'Invalid ID',
      empIdAssigned: 'Assigned by Admin',
      passwordLabel: 'Password *',
      passwordError: 'Invalid Password',
      signInBtn: 'Sign In to Dashboard',
      adminAccessText: 'Admin: Access All Employee Portals from Admin Panel →',
      backToJobs: '← Back to Job Portal',
      adminPortal: 'Admin Portal',
      adminLoginTitle: 'Admin Control Portal',
      adminLoginSubtitle: 'Sign in with your administrator credentials to manage staff, attendance records, and platform settings.',
    },
    policy: {
      workingHoursTitle: 'Working Hours',
      workingHoursVal: '11:50 AM to 8:00 PM (All Days / No Holiday)',
      allDaysNoHoliday: 'All Days / No Holiday',
      absentRuleTitle: 'Absent Deduction Policy',
      absentRuleDesc: 'If an employee does not work for 1 day, ₹500 will be deducted from their payout.',
      absentDeductionRate: '₹500 per absent day',
      absentDeductionStat: 'Absent Deduction',
      absentPerDay: '₹500 / day penalty',
      totalDeduction: 'Total Absent Deduction',
      policyBanner: 'Working Hours: 11:50 AM to 8:00 PM (All Days / No Holiday) • Rule: If someone misses work for 1 day, ₹500 will be deducted.',
      deductionBadge: 'Deduction: ₹500',
    },
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('hcj_language');
      if (saved === 'en' || saved === 'hi') {
        return saved;
      }
    } catch {
      // fallback
    }
    // Default to Hindi as per user's preference or Hindi/English bilingual target
    return 'hi';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('hcj_language', lang);
    } catch {
      // Ignore localStorage errors
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'hi' ? 'en' : 'hi');
  };

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t: translations[language],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
