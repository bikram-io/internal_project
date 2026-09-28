import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Database, Activity, RefreshCw, Server, Cloud, Layers } from 'lucide-react';
import './DataPage.css';

const DATA_MODULES = [
  { id: 'etl', name: 'ETL Pipeline', desc: 'Extract, transform, and load batch data at scale across enterprise warehouses.', icon: RefreshCw, color: '#4cc9f0' },
  { id: 'cdc', name: 'CDC Stream', desc: 'Change Data Capture for real-time, low-latency database replication.', icon: Activity, color: '#f72585' },
  { id: 'kafka', name: 'Kafka Event Mesh', desc: 'High-throughput event streaming platform for distributed microservices.', icon: Layers, color: '#7209b7' },
  { id: 'dw', name: 'Data Warehouse', desc: 'Structured data storage and complex analytical processing architectures.', icon: Database, color: '#3a0ca3' },
  { id: 'dl', name: 'Data Lake', desc: 'Unstructured and semi-structured data storage and exploration.', icon: Cloud, color: '#4361ee' },
  { id: 'api', name: 'Data API Gateway', desc: 'REST and GraphQL data endpoints for unified secure access.', icon: Server, color: '#4cc9f0' },
];

export default function DataPage() {
  const navigate = useNavigate();

  return (
    <div className="data-page">
      <header className="data-header">
        <h1>Data Architecture Modules</h1>
        <p>Select a specialized data infrastructure module to configure and assess.</p>
      </header>

      <div className="module-grid">
        {DATA_MODULES.map(mod => {
          const Icon = mod.icon;
          return (
            <div key={mod.id} className="module-card" style={{ '--mod-color': mod.color }}>
              <div className="mod-icon-wrapper">
                <Icon size={24} />
              </div>
              <h3>{mod.name}</h3>
              <p>{mod.desc}</p>
              <button 
                className="mod-select-btn"
                onClick={() => {
                  if (mod.id === 'kafka') navigate('/data/kafka');
                }}
              >
                Select Module
              </button>
            </div>
          )
        })}
      </div>
    </div>
  );
}
