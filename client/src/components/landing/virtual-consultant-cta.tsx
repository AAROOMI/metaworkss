import { ArrowUpRight } from 'lucide-react';
import { Link } from 'wouter';

export default function VirtualConsultantCTA() {
  return (
    <div className="bg-gradient-to-r from-indigo-950 to-slate-900 p-8 rounded-xl shadow-xl">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Meet Our Virtual Cybersecurity Consultant
          </h2>
          <p className="text-slate-300">
            Get real-time guidance and answers to your cybersecurity compliance questions
            with our advanced AI-powered virtual consultant.
          </p>
          <div className="pt-4">
            <button
              onClick={() => window.location.href = '/virtual-consultant'}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl"
            >
              Try Virtual Consultant
              <ArrowUpRight size={18} />
            </button>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden w-full md:w-1/2 h-[200px] md:h-[250px] shadow-2xl border border-slate-700">
          <div className="h-full w-full bg-gradient-to-br from-blue-900/30 to-slate-900/50 flex items-center justify-center">
            <div className="text-center p-6">
              <div className="animate-pulse mb-3">
                <span className="inline-block h-16 w-16 rounded-full bg-blue-600/30"></span>
              </div>
              <p className="text-slate-300 text-sm">Interactive AI Consultant</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}