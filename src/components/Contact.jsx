import { Phone, Mail, MapPin, Send } from 'lucide-react';

function LinkedInIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const contactItems = [
  {
    icon: <Phone size={20} />,
    label: 'Phone',
    value: '01111129338',
    href: 'tel:+201111129338',
    color: 'from-blue-600 to-blue-800',
  },
  {
    icon: <Mail size={20} />,
    label: 'Email',
    value: 'maboabia20@gmail.com',
    href: 'mailto:maboabia20@gmail.com',
    color: 'from-indigo-600 to-indigo-800',
  },
  {
    icon: <MapPin size={20} />,
    label: 'Location',
    value: '10th of Ramadan, El Sharqia, Egypt',
    href: null,
    color: 'from-violet-600 to-violet-800',
  },
];

export default function Contact() {
  return (
    <section id="contact" className="section-bg-dark-navy py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Get In Touch</p>
          <h2 className="text-4xl font-bold text-white">Contact Me</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
          <p className="text-slate-400 mt-6 max-w-xl mx-auto leading-relaxed">
            I'm open to collaborations, clinical training opportunities, and networking with
            dental professionals across specialties.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 mb-10">
          {contactItems.map(({ icon, label, value, href, color }) => (
            <div
              key={label}
              className="p-6 rounded-2xl glass border border-blue-500/15 card-hover group"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white mb-4 shadow-lg`}>
                {icon}
              </div>
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
              {href ? (
                <a href={href} className="text-white font-medium text-sm hover:text-blue-300 transition break-all">
                  {value}
                </a>
              ) : (
                <p className="text-white font-medium text-sm">{value}</p>
              )}
            </div>
          ))}
        </div>

        {/* LinkedIn */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <a
            href="https://www.linkedin.com/in/dr-mahmoud-abo-obiaa-b553412aa/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              window.open('https://www.linkedin.com/in/dr-mahmoud-abo-obiaa-b553412aa/', '_blank');
            }}
            className="flex items-center gap-3 px-8 py-4 rounded-xl bg-[#0A66C2] hover:bg-[#0958a8] text-white font-semibold shadow-lg shadow-blue-900/30 transition cursor-pointer"
          >
            <LinkedInIcon size={20} />
            Connect on LinkedIn
          </a>
          <a
            href="mailto:maboabia20@gmail.com"
            className="flex items-center gap-3 px-8 py-4 rounded-xl glass border border-blue-500/30 text-blue-300 hover:text-white hover:border-blue-400/50 font-semibold transition"
          >
            <Send size={18} />
            Send Email
          </a>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/5 mt-20 pt-8 text-center text-slate-600 text-sm px-6">
        <p>© {new Date().getFullYear()} Mahmoud Abdo Abo Obia · Dental Portfolio</p>
        <p className="mt-1 text-slate-700 text-xs">Built with passion for digital dentistry</p>
      </div>
    </section>
  );
}
