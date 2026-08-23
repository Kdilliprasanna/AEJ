import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, MapPin, Briefcase, Award, Sparkles, CheckCircle2 } from 'lucide-react';

const salaryData = {
  'Software Engineer': { min: 80000, median: 125000, max: 185000, growth: '+15% YoY', topSkills: ['React', 'Node.js', 'System Design', 'TypeScript', 'AWS'] },
  'Frontend Developer': { min: 70000, median: 110000, max: 160000, growth: '+12% YoY', topSkills: ['React', 'Vue', 'CSS/Tailwind', 'JavaScript', 'Performance'] },
  'Backend Engineer': { min: 85000, median: 130000, max: 190000, growth: '+14% YoY', topSkills: ['Node.js', 'Python', 'PostgreSQL', 'Docker', 'Microservices'] },
  'Full Stack Developer': { min: 90000, median: 135000, max: 195000, growth: '+18% YoY', topSkills: ['React', 'Node.js', 'GraphQL', 'MongoDB', 'Cloud Infrastructure'] },
  'Data Scientist': { min: 95000, median: 140000, max: 200000, growth: '+22% YoY', topSkills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'TensorFlow'] },
  'DevOps Engineer': { min: 95000, median: 138000, max: 190000, growth: '+16% YoY', topSkills: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'AWS/GCP'] },
  'UI/UX Designer': { min: 65000, median: 105000, max: 150000, growth: '+10% YoY', topSkills: ['Figma', 'Prototyping', 'User Research', 'Design Systems', 'Wireframing'] },
  'AI / ML Engineer': { min: 105000, median: 155000, max: 230000, growth: '+35% YoY', topSkills: ['PyTorch', 'LLMs', 'Python', 'Vector DBs', 'Deep Learning'] },
};

const locations = ['Remote', 'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Seattle, WA', 'London, UK', 'Bengaluru, India', 'Toronto, Canada'];
const experienceLevels = ['Entry Level (0-2 yrs)', 'Mid Level (2-5 yrs)', 'Senior (5-8 yrs)', 'Lead / Staff (8+ yrs)'];

export default function SalaryInsightsCalculator() {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [selectedLocation, setSelectedLocation] = useState('Remote');
  const [selectedExp, setSelectedExp] = useState('Mid Level (2-5 yrs)');

  const roleInfo = salaryData[selectedRole] || salaryData['Software Engineer'];

  // Adjust multipliers
  let expMultiplier = 1;
  if (selectedExp.includes('Entry')) expMultiplier = 0.75;
  if (selectedExp.includes('Senior')) expMultiplier = 1.35;
  if (selectedExp.includes('Lead')) expMultiplier = 1.65;

  let locMultiplier = 1;
  if (selectedLocation.includes('San Francisco') || selectedLocation.includes('New York')) locMultiplier = 1.25;
  if (selectedLocation.includes('Bengaluru')) locMultiplier = 0.45;
  if (selectedLocation.includes('London')) locMultiplier = 0.85;

  const estMin = Math.round(roleInfo.min * expMultiplier * locMultiplier);
  const estMed = Math.round(roleInfo.median * expMultiplier * locMultiplier);
  const estMax = Math.round(roleInfo.max * expMultiplier * locMultiplier);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="card card-gradient">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-600/20 text-blue-400 rounded-xl">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">AI Salary Insights & Compensation Calculator</h2>
            <p className="text-sm text-gray-400">Explore market compensation trends, experience scaling, and target role salary benchmarks.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-400" /> Target Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          >
            {Object.keys(salaryData).map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="card space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" /> Location
          </label>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div className="card space-y-2">
          <label className="text-xs font-semibold text-gray-400 uppercase flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> Experience Level
          </label>
          <select
            value={selectedExp}
            onChange={(e) => setSelectedExp(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white"
          >
            {experienceLevels.map((exp) => (
              <option key={exp} value={exp}>{exp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Salary Overview Card */}
      <div className="card bg-slate-900/90 border border-slate-800 p-6 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="badge badge-primary mb-1 inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Market Demand: {roleInfo.growth}
            </span>
            <h3 className="text-xl font-bold text-white">{selectedRole} Compensation Range</h3>
            <p className="text-xs text-gray-400">{selectedLocation} • {selectedExp}</p>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400 uppercase block">Estimated Median</span>
            <span className="text-3xl font-extrabold text-emerald-400">${estMed.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ yr</span></span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <span className="text-xs text-gray-400 uppercase block mb-1">25th Percentile</span>
            <span className="text-lg font-bold text-gray-200">${estMin.toLocaleString()}</span>
          </div>
          <div className="p-4 bg-emerald-950/40 rounded-xl border border-emerald-800/40">
            <span className="text-xs text-emerald-400 uppercase block mb-1">50th Percentile (Median)</span>
            <span className="text-xl font-extrabold text-emerald-400">${estMed.toLocaleString()}</span>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
            <span className="text-xs text-gray-400 uppercase block mb-1">75th Percentile</span>
            <span className="text-lg font-bold text-gray-200">${estMax.toLocaleString()}</span>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-gray-300 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-blue-400" /> Most Valuable Skills to Boost Salary
          </h4>
          <div className="flex flex-wrap gap-2">
            {roleInfo.topSkills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 bg-blue-950/60 text-blue-300 border border-blue-800/40 rounded-lg text-xs font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
