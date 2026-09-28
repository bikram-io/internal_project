import React from 'react';
import { Database, Sparkles, Brain, Shield, Plus, MoreVertical, Play, Server, Workflow } from 'lucide-react';
import './MainDashboard.css';

const SOLUTION_CARDS = [
  {
    title: 'Data',
    description: 'ETL, CDC, Kafka',
    icon: Database,
    color: '#3B82F6', // Blue
  },
  {
    title: 'GenAI',
    description: 'LLM, RAG, Model Serving',
    icon: Sparkles,
    color: '#8B5CF6', // Purple
  },
  {
    title: 'ML',
    description: 'Training, Inference, MLOps',
    icon: Brain,
    color: '#10B981', // Green
  },
  {
    title: 'Data Governance',
    description: 'Catalog, Quality, Lineage',
    icon: Shield,
    color: '#F59E0B', // Yellow
  },
];

const RECENT_ASSESSMENTS = [
  {
    id: 1,
    name: 'APB Kafka Prod',
    module: 'Data',
    technology: 'Kafka',
    environment: 'Production',
    createdOn: '12 Mar 2024',
    status: 'Completed',
  },
  {
    id: 2,
    name: 'MySQL CDC POC',
    module: 'Data',
    technology: 'CDC',
    environment: 'SIT',
    createdOn: '10 Mar 2024',
    status: 'In Progress',
  },
  {
    id: 3,
    name: 'GenAI Platform',
    module: 'GenAI',
    technology: 'RAG',
    environment: 'Production',
    createdOn: '08 Mar 2024',
    status: 'Completed',
  },
];

export default function MainDashboard() {
  return (
    <div className="main-dashboard">
      <div className="welcome-section">
        <h1 className="welcome-title">Welcome, Anuj</h1>
        <p className="welcome-subtitle">Choose a solution to start a new assessment</p>
      </div>

      <div className="solution-cards">
        {SOLUTION_CARDS.map((card) => (
          <div key={card.title} className="solution-card">
            <div className="icon-wrapper" style={{ backgroundColor: `${card.color}15`, color: card.color }}>
              <card.icon size={28} />
            </div>
            <h3 className="card-title">{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <button className="start-assessment-btn">
              Start Assessment <span className="arrow">→</span>
            </button>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="recent-header">
          <h2 className="recent-title">Recent Assessments</h2>
          <button className="new-assessment-btn">
            <Plus size={16} />
            New Assessment
          </button>
        </div>

        <div className="table-container">
          <table className="assessments-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Module</th>
                <th>Technology</th>
                <th>Environment</th>
                <th>Created On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ASSESSMENTS.map((assessment) => (
                <tr key={assessment.id}>
                  <td className="font-medium">{assessment.name}</td>
                  <td>{assessment.module}</td>
                  <td>{assessment.technology}</td>
                  <td>{assessment.environment}</td>
                  <td>{assessment.createdOn}</td>
                  <td>
                    <span className={`status-badge ${assessment.status.toLowerCase().replace(' ', '-')}`}>
                      {assessment.status}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="action-btn" title="Run">
                        <Play size={16} />
                      </button>
                      <button className="action-btn" title="More">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
