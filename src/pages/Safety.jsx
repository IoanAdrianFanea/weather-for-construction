import { useState } from 'react';

const faqs = [ // List of frequently asked questions and answers
  {
    question: "What do I do if it rains heavily on site?",
    answer: "Heavy rain makes surfaces slippery, reduces visibility, and can destabilize ground and structures. Stop high-risk work if conditions worsen, especially during storms or flooding. Workers should move slowly, wear slip-resistant boots, and avoid unsafe areas like muddy trenches or unstable scaffolding."
  },
  {
    question: "How can workers avoid slipping on wet surfaces?",
    answer: "Use proper PPE like non-slip footwear with strong tread, walk carefully, and keep work areas as dry as possible with drainage or platforms."
  },
  {
    question: "Is it safe to use electrical tools in the rain?",
    answer: "No — electricity becomes far more dangerous in wet conditions. Avoid using electrical tools in standing water and ensure all equipment is properly rated for outdoor use."
  },
  {
    question: "What should workers wear in rainy weather?",
    answer: "Wear waterproof clothing, high-visibility gear, gloves, and slip-resistant boots to stay safe and visible on site."
  },
  {
    question: "When should construction work stop due to weather?",
    answer: "Stop work during lightning, severe storms, or flood risks. Workers should move to safe shelter immediately and await the all-clear from a site supervisor."
  },
  {
    question: "What are the dangers of muddy construction sites?",
    answer: "Mud increases the risk of slips, trips, falls, and equipment instability. Restrict access to affected areas if conditions are unsafe."
  },
  {
    question: "How does rain affect trenches and excavations?",
    answer: "Rain can weaken soil and cause trench collapses or flooding. Always inspect excavations after rainfall before allowing workers to re-enter."
  },
  {
    question: "How can workers stay safe in cold and wet conditions?",
    answer: "Wet conditions can lead to hypothermia or fatigue. Workers should stay dry, take regular breaks in warm areas, and monitor each other for symptoms."
  },
  {
    question: "What visibility precautions should be taken in rain?",
    answer: "Wear reflective clothing and ensure eye protection is clear. Reduced visibility increases the risk of accidents involving vehicles and machinery."
  },
  {
    question: "How should construction teams prepare for bad weather?",
    answer: "Have a weather safety plan in place, train workers on emergency procedures, monitor forecasts daily, and designate safe shelter locations on site."
  },
];

const links = [
  {
    label: "OSHA — Construction Safety",
    url: "https://www.osha.gov/construction",
    description: "Official US standards for construction site safety"
  },
  {
    label: "OSHA — Electrical Safety in Construction",
    url: "https://www.osha.gov/electrical/construction",
    description: "Guidance on electrical hazards on site"
  },
  {
    label: "OSHA — Winter Weather Preparedness",
    url: "https://www.osha.gov/winter-weather/preparedness",
    description: "Cold and wet weather safety for workers"
  },
  {
    label: "OSHA — Emergency Preparedness",
    url: "https://www.osha.gov/emergency-preparedness",
    description: "Planning for severe weather and emergencies"
  },
  {
    label: "NASP — Rain Safety on Job Sites",
    url: "https://www.naspweb.com/blog/precautions-for-job-site-safety-hazards-in-the-rain/",
    description: "Practical precautions for working in the rain"
  },
  {
    label: "Citadel EHS — Cal/OSHA Rain Guidelines",
    url: "https://citadelehs.com/2023/11/15/cal-osha-rain-safety-guidelines/",
    description: "State-level rain safety regulations"
  },
];

const FAQItem = ({ question, answer }) => { // Each FAQ item with toggleable answer
  const [open, setOpen] = useState(false); // State to track if the answer is visible

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span className="text-sm font-semibold text-black dark:text-white pr-4">{question}</span>
        <span className={`text-gray-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-5 pb-4 pt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700">
          {answer}
        </div>
      )}
    </div>
  );
};

const Safety = () => { // Safety guide page layout
  return (
    <div className="p-4 space-y-4">

      {/* Title */}
      <h1 className="page-title text-2xl font-bold text-black dark:text-white">Safety Guide</h1>
      <p className="page-title-legend text-sm text-gray-500 -mt-6">Weather-related safety for construction sites</p>

      {/* FAQ - centered and wider on desktop */}
      <div className="max-w-5xl mx-auto space-y-4">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Frequently Asked Questions</h2>
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.question} answer={faq.answer} />
        ))}
      </div>

      {/* External Links - horizontal grid */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">External Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col justify-between bg-white dark:bg-gray-800 rounded-2xl px-5 py-4 border border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 shadow-sm transition-colors group"
            >
              <div>
                <p className="text-sm font-semibold text-black dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{link.label}</p>
                <p className="text-xs text-gray-500 mt-1">{link.description}</p>
              </div>
              <svg className="w-4 h-4 text-gray-300 group-hover:text-blue-500 mt-3 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Safety;