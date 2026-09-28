import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Target, AlertTriangle, Clock, Activity } from 'lucide-react';
import './Questionnaire.css'; 

export default function BusinessReq() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    useCase: 'Microservices Communication',
    criticality: 'Tier 1 - Mission Critical',
    rpo: 'Zero data loss',
    rto: '< 15 mins'
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handleSubmit = (e) => {
    e.preventDefault();
    // Route to the next page: Questionnaire - Architecture (KRaft)
    navigate('/data/kafka/assessment/architecture');
  };

  return (
    <div className="questionnaire-page">
      <div className="progress-bar-container">
        <div className="progress-steps">
          <div className="step active">1. Business</div>
          <div className="step">2. Architecture</div>
          <div className="step">3. Workload</div>
          <div className="step">4. Storage</div>
          <div className="step">5. Network</div>
        </div>
        <div className="progress-bar"><div className="progress-fill" style={{width: '20%'}}></div></div>
      </div>

      <div className="questionnaire-header">
        <h1>Business Requirements</h1>
        <p>Define the business goals, criticality, and recovery objectives for this Kafka cluster.</p>
      </div>

      <form className="questionnaire-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label><Target size={16} /> Primary Use Case</label>
          <select name="useCase" value={formData.useCase} onChange={handleChange}>
            <option>Microservices Communication</option>
            <option>Log Aggregation</option>
            <option>Change Data Capture (CDC)</option>
            <option>Real-time Analytics / Streaming</option>
            <option>IoT Telemetry</option>
          </select>
        </div>

        <div className="form-group">
          <label><AlertTriangle size={16} /> Data Criticality</label>
          <div className="radio-group">
            <label className={`radio-card ${formData.criticality === 'Tier 1 - Mission Critical' ? 'selected' : ''}`}>
              <input type="radio" name="criticality" value="Tier 1 - Mission Critical" checked={formData.criticality === 'Tier 1 - Mission Critical'} onChange={handleChange}/>
              <span className="radio-content">
                <strong>Tier 1 - Mission Critical</strong>
                <span>Any downtime severely impacts revenue or operations.</span>
              </span>
            </label>
            <label className={`radio-card ${formData.criticality === 'Tier 2 - Important' ? 'selected' : ''}`}>
              <input type="radio" name="criticality" value="Tier 2 - Important" checked={formData.criticality === 'Tier 2 - Important'} onChange={handleChange}/>
              <span className="radio-content">
                <strong>Tier 2 - Important</strong>
                <span>Downtime is problematic but workarounds exist temporarily.</span>
              </span>
            </label>
            <label className={`radio-card ${formData.criticality === 'Tier 3 - Best Effort' ? 'selected' : ''}`}>
              <input type="radio" name="criticality" value="Tier 3 - Best Effort" checked={formData.criticality === 'Tier 3 - Best Effort'} onChange={handleChange}/>
              <span className="radio-content">
                <strong>Tier 3 - Best Effort</strong>
                <span>Non-critical data (e.g., development or minor logs).</span>
              </span>
            </label>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label><Activity size={16} /> Recovery Point Objective (RPO)</label>
            <select name="rpo" value={formData.rpo} onChange={handleChange}>
              <option>Zero data loss</option>
              <option>&lt; 1 minute</option>
              <option>&lt; 5 minutes</option>
              <option>&lt; 1 hour</option>
            </select>
            <p className="help-text">Maximum acceptable amount of data loss during a disaster.</p>
          </div>
          
          <div className="form-group half">
            <label><Clock size={16} /> Recovery Time Objective (RTO)</label>
            <select name="rto" value={formData.rto} onChange={handleChange}>
              <option>Near real-time</option>
              <option>&lt; 15 mins</option>
              <option>&lt; 1 hour</option>
              <option>&lt; 4 hours</option>
            </select>
            <p className="help-text">Maximum acceptable downtime during a disaster.</p>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={() => navigate('/data/kafka/assessment')}>
            <ArrowLeft size={18} /> Back
          </button>
          <button type="submit" className="btn-primary">
            Next: Architecture <ArrowRight size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
