import { BookOpen, ExternalLink, Award } from 'lucide-react';

const courses = [
  {
    title: 'Kaizen Dental Academy Internship',
    provider: 'Kaizen Dental Academy',
    category: 'Restorative & Aesthetic',
    color: 'from-blue-600 to-blue-800',
  },
  {
    title: 'GenAI for Dentists',
    provider: 'Online – Continuing Education',
    category: 'Technology & AI',
    color: 'from-violet-600 to-violet-800',
  },
  {
    title: 'Implant Dentistry',
    provider: 'University of Hong Kong / Coursera',
    category: 'Implantology',
    color: 'from-indigo-600 to-indigo-800',
  },
  {
    title: 'Modern Prep Design and Margination',
    provider: 'Advanced Prosthodontics Course',
    category: 'Prosthodontics',
    color: 'from-sky-600 to-sky-800',
  },
  {
    title: '3Shape Webinars',
    provider: '3Shape Official',
    category: 'CAD/CAM & Digital',
    color: 'from-teal-600 to-teal-800',
  },
  {
    title: '3D Printing & Guided Implant Surgery',
    provider: 'Specialized Implant Training',
    category: 'Digital Surgery',
    color: 'from-cyan-600 to-cyan-800',
  },
  {
    title: 'Efficiency & Accuracy in Full-Arch Implant Restorations',
    provider: 'Advanced Implant Training',
    category: 'Full-Arch',
    color: 'from-blue-700 to-indigo-800',
  },
];

export default function Courses() {
  return (
    <section id="courses" className="section-bg-gray py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Continuing Education</p>
          <h2 className="text-4xl font-bold text-slate-900">Courses & Training</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map(({ title, provider, category, color }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden card-hover shadow-sm group"
            >
              <div className={`h-1.5 bg-gradient-to-r ${color}`} />
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shrink-0 shadow-md`}>
                    <BookOpen size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-md mb-2">
                      {category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{title}</h3>
                    <p className="text-slate-500 text-xs mt-1">{provider}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4 pt-4 border-t border-slate-100 text-slate-400 text-xs">
                  <Award size={12} />
                  <span>Certificate of Completion</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
