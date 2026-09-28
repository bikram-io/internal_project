import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Settings, Server, Cloud, Users, FileText } from 'lucide-react';
import './AssessmentSetup.css';

export default function AssessmentSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    projectName: '',
    environment: 'Production',
    cloud: 'AWS',
    team: '',
    description: ''
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Route to the next page: Questionnaire - Business Requirements
    navigate('/data/kafka/assessment/business-req');
  };

  return (
    <div className="assessment-setup-page">
      <div className="setup-header">
        <h1>Assessment Setup</h1>
        <p>Define the foundational details for your Kafka Event Mesh assessment.</p>
      </div>

      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label><FileText size={16} /> Project Name</label>
          <input 
            type="text" 
            name="projectName" 
            value={formData.projectName} 
            onChange={handleChange} 
            placeholder="e.g. Core Banking Event Streaming" 
            required 
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label><Server size={16} /> Target Environment</label>
            <select name="environment" value={formData.environment} onChange={handleChange}>
              <option>Development</option>
              <option>UAT / Staging</option>
              <option>Production</option>
            </select>
          </div>
          
          <div className="form-group half">
            <label><Cloud size={16} /> Cloud Provider</label>
            <select name="cloud" value={formData.cloud} onChange={handleChange}>
              <option>AWS</option>
              <option>Azure</option>
              <option>GCP</option>
              <option>On-Premise</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label><Users size={16} /> Team / Department</label>
          <input 
            type="text" 
            name="team" 
            value={formData.team} 
            onChange={handleChange} 
            placeholder="e.g. Data Platform Team" 
            required 
          />
        </div>

        <div className="form-group">
          <label><Settings size={16} /> Brief Description (Optional)</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Describe the primary use case..." 
            rows="4"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/data/kafka')}>
            Cancel
          </button>
          <button type="submit" className="btn-primary">
            Continue to Business Requirements <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
