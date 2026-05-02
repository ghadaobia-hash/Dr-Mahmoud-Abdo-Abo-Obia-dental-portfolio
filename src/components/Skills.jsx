import {
  Wrench, Monitor, Camera, Smile, BarChart2, Layers,
  Settings, Image, FileText, Globe, Cpu, Printer,
  Users, Clock, Lightbulb, RefreshCw, Eye, MessageCircle, Presentation, BookOpen
} from 'lucide-react';

const softSkills = [
  { icon: <MessageCircle size={18} />, label: 'Communication Skills' },
  { icon: <Users size={18} />, label: 'Teamwork & Collaboration' },
  { icon: <Clock size={18} />, label: 'Time Management' },
  { icon: <Lightbulb size={18} />, label: 'Problem Solving' },
  { icon: <RefreshCw size={18} />, label: 'Adaptability' },
  { icon: <Eye size={18} />, label: 'Attention to Detail' },
  { icon: <Smile size={18} />, label: 'Patient-Centered Communication' },
  { icon: <Presentation size={18} />, label: 'Presentation Skills' },
  { icon: <BookOpen size={18} />, label: 'Research-Oriented Mindset' },
];

const clinicalSkills = [
  { icon: <Wrench size={18} />, label: 'Operative Dentistry' },
  { icon: <Settings size={18} />, label: 'Endodontics' },
  { icon: <Layers size={18} />, label: 'Fixed Prosthodontics' },
  { icon: <Globe size={18} />, label: 'Implantology' },
  { icon: <Camera size={18} />, label: 'Dental Photography' },
  { icon: <Smile size={18} />, label: 'Aesthetic Dentistry' },
  { icon: <BarChart2 size={18} />, label: 'Occlusion' },
  { icon: <Image size={18} />, label: 'Biomimetic Restorative Dentistry' },
  { icon: <FileText size={18} />, label: 'Dental Case Documentation' },
];

const techSkills = [
  { icon: <Monitor size={18} />, label: 'RealGUIDE', level: 100 },
  { icon: <Cpu size={18} />, label: 'Exocad', level: 100 },
  { icon: <Settings size={18} />, label: 'CAD/CAM', level: 100 },
  { icon: <Smile size={18} />, label: 'Digital Smile Design', level: 100 },
  { icon: <Printer size={18} />, label: '3D Printing', level: 100 },
  { icon: <Globe size={18} />, label: 'Implant Planning', level: 100 },
  { icon: <Layers size={18} />, label: 'Full-Arch Guided Surgery', level: 100 },
  { icon: <Image size={18} />, label: 'Canva', level: 100 },
  { icon: <FileText size={18} />, label: 'CapCut', level: 100 },
  { icon: <FileText size={18} />, label: 'MS Word & PowerPoint', level: 100 },
];

export default function Skills() {
  return (
    <section id="skills" className="section-bg-dark-navy py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Expertise</p>
          <h2 className="text-4xl font-bold text-white">Skills & Competencies</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full mx-auto mt-4" />
        </div>

        {/* Soft Skills */}
        <div className="mb-14">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <Users size={16} className="text-white" />
            </div>
            Soft Skills
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {softSkills.map(({ icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-4 rounded-xl glass border border-violet-500/15 group hover:border-violet-500/40 transition-all duration-300 cursor-default"
              >
                <div className="w-8 h-8 rounded-lg bg-violet-500/15 text-violet-400 flex items-center justify-center shrink-0 group-hover:bg-violet-600 group-hover:text-white transition-all">
                  {icon}
                </div>
                <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors leading-tight">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Clinical Skills */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Wrench size={16} className="text-white" />
              </div>
              Clinical Skills
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clinicalSkills.map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 p-4 rounded-xl glass border border-blue-500/15 group hover:border-blue-500/40 transition-all duration-300 cursor-default"
                >
                  <div className="w-9 h-9 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {icon}
                  </div>
                  <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Cpu size={16} className="text-white" />
              </div>
              Technical & Digital Skills
            </h3>
            <div className="space-y-4">
              {techSkills.map(({ icon, label, level }) => (
                <div key={label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                      <span className="text-blue-400">{icon}</span>
                      {label}
                    </div>
                    <span className="text-blue-400 text-xs font-bold">{level}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000"
                      style={{ width: `${level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
