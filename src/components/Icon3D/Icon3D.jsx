import React from 'react';
import './Icon3D.css';

const gradients = {
  data: 'linear-gradient(135deg, #22d3ee, #2563eb)',
  genai: 'linear-gradient(135deg, #d946ef, #9333ea)',
  ml: 'linear-gradient(135deg, #34d399, #0d9488)',
  governance: 'linear-gradient(135deg, #fb923c, #f43f5e)',
  reports: 'linear-gradient(135deg, #38bdf8, #4f46e5)',
  administration: 'linear-gradient(135deg, #94a3b8, #334155)',
  assessments: 'linear-gradient(135deg, #fbbf24, #ea580c)',
};

const glows = {
  data: 'rgba(34, 211, 238, 0.4)',
  genai: 'rgba(217, 70, 239, 0.4)',
  ml: 'rgba(52, 211, 153, 0.4)',
  governance: 'rgba(251, 146, 60, 0.4)',
  reports: 'rgba(56, 189, 248, 0.4)',
  administration: 'rgba(148, 163, 184, 0.4)',
  assessments: 'rgba(251, 191, 36, 0.4)',
};

export default function Icon3D({ icon: Icon, type, className = '' }) {
  const gradient = gradients[type];
  const glow = glows[type];

  return (
    <div 
      className={`icon-3d-wrapper ${className}`}
      style={{
        background: gradient,
        '--glow-color': glow
      }}
    >
      <Icon size={22} className="icon-3d-svg" />
    </div>
  );
}
