import { GraduationCap, Award, Calendar } from 'lucide-react';

const education = [
  {
    icon: <GraduationCap size={22} />,
    degree: "Bachelor's Degree of Oral & Dental Surgery Program",
    institution: 'Faculty of Dentistry – Egyptian Russian University',
    period: '2020 – 2025',
    detail: null,
    gpa: null,
    color: 'from-blue-600 to-indigo-700',
    highlight: true,
  },
  {
    icon: <Award size={22} />,
    degree: 'High School Diploma – STEM',
    institution: 'Menofia STEM School',
    period: 'Graduated 2020',
    detail: 'Science, Technology, Engineering & Mathematics (STEM)',
    gpa: null,
    color: 'from-slate-500 to-slate-700',
    highlight: false,
  },
];

export default function Education() {
  return (
    <section id="education" className="section-bg-gray py-24">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-widest uppercase mb-3">Academic Background</p>
          <h2 className="text-4xl font-bold text-slate-900">Education</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        <div className="space-y-6">
          {education.map(({ icon, degree, institution, period, detail, gpa, color, highlight }) => (
            <div
              key={degree}
              className={`rounded-2xl overflow-hidden shadow-sm border transition-all duration-300 hover:shadow-lg ${
                highlight
                  ? 'border-blue-200 bg-white'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row">
                {/* Color bar */}
                <div className={`bg-gradient-to-br ${color} sm:w-2 h-2 sm:h-auto w-full`} />

                <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-start w-full">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg shrink-0`}>
                    {icon}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{degree}</h3>
                        <p className="text-blue-600 font-semibold mt-1">{institution}</p>
                        {detail && <p className="text-slate-500 text-sm mt-1">{detail}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                          <Calendar size={14} />
                          {period}
                        </div>
                        {gpa && (
                          <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-bold rounded-lg border border-blue-100">
                            {gpa}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
