import { Stethoscope, Monitor, Layers, BookOpen, Hospital, Trophy } from 'lucide-react';

const experiences = [
  {
    icon: <Stethoscope size={20} />,
    title: 'Second Operator – Clinical Work',
    org: 'Egyptian Russian University – Faculty of Dentistry',
    type: 'Clinical',
    desc: 'Actively participated as second operator across multiple clinical disciplines including surgery, restorative, and prosthodontics.',
    color: 'bg-blue-100 text-blue-700',
    dot: 'bg-blue-500',
  },
  {
    icon: <Monitor size={20} />,
    title: 'Digital Guided Surgery Specialist',
    org: 'Turki Academy & Professional Training',
    type: 'Digital Surgery',
    desc: 'Acquired specialized training in full-arch digital implant workflows, surgical guide production, and guided placement protocols.',
    color: 'bg-indigo-100 text-indigo-700',
    dot: 'bg-indigo-500',
  },
  {
    icon: <Layers size={20} />,
    title: '1,000+ Surgical Guides Produced',
    org: 'RealGUIDE & Exocad Workflows',
    type: 'CAD/CAM',
    desc: 'Designed and produced over 1,000 tooth-supported and implant-supported surgical guides using RealGUIDE software.',
    color: 'bg-violet-100 text-violet-700',
    dot: 'bg-violet-500',
  },
  {
    icon: <BookOpen size={20} />,
    title: 'Implant Marathons & Intensive Training',
    org: 'Turki Academy',
    type: 'Training',
    desc: 'Participated in multiple implant marathon courses covering immediate loading, full-arch rehabilitation, and digital planning.',
    color: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-500',
  },
  {
    icon: <Hospital size={20} />,
    title: 'Clinical Rotation',
    org: 'El Ghandour Hospital',
    type: 'Hospital',
    desc: 'Gained hospital-based clinical experience across surgical and general dentistry departments.',
    color: 'bg-teal-100 text-teal-700',
    dot: 'bg-teal-500',
  },
];

export default function Experience() {
  return (
    <section id="experience" className="section-bg-white py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Professional Journey</p>
          <h2 className="text-4xl font-bold text-slate-900">Clinical & Professional Experience</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { value: '1,000+', label: 'Surgical Guides' },
            { value: '5+', label: 'Training Programs' },
            { value: '2', label: 'Institutions' },
            { value: '4+', label: 'Years Clinical' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="text-3xl font-bold text-blue-700 mb-1">{value}</div>
              <div className="text-slate-500 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500 via-indigo-500 to-transparent hidden md:block" />

          <div className="space-y-6">
            {experiences.map(({ icon, title, org, type, desc, color, dot }) => (
              <div
                key={title}
                className="relative md:pl-16 group"
              >
                <div className={`absolute left-4 top-6 w-5 h-5 rounded-full border-4 border-white ${dot} shadow-sm hidden md:block`} />

                <div className="bg-white rounded-2xl border border-slate-200 p-6 card-hover shadow-sm hover:border-blue-200">
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                      {icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${color}`}>{type}</span>
                      </div>
                      <p className="text-blue-600 text-sm font-medium mt-0.5">{org}</p>
                      <p className="text-slate-500 text-sm mt-2 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
