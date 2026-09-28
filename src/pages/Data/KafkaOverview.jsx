import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Layers, ShieldCheck, Zap, Activity, ArrowRight } from 'lucide-react';
import './KafkaOverview.css';

export default function KafkaOverview() {
  const navigate = useNavigate();

  return (
    <div className="kafka-overview-page">
      <div className="overview-header">
        <div className="header-icon">
          <Layers size={40} color="#7209b7" />
        </div>
        <div className="header-content">
          <h1>Kafka Event Mesh</h1>
          <p>Distributed event streaming platform capable of handling trillions of events a day.</p>
        </div>
        <button className="start-btn" onClick={() => navigate('/data/kafka/assessment')}>
          <Play size={18} />
          Start Assessment
        </button>
      </div>

      <div className="overview-content">
        <div className="feature-grid">
          <div className="feature-card">
            <Zap size={24} color="#f72585" />
            <h3>High Throughput</h3>
            <p>Deliver messages at network limited throughput using a cluster of machines with latencies as low as 2ms.</p>
          </div>
          <div className="feature-card">
            <Layers size={24} color="#4cc9f0" />
            <h3>Scalable</h3>
            <p>Scale production clusters up to a thousand brokers, trillions of messages per day, and hundreds of thousands of partitions.</p>
          </div>
          <div className="feature-card">
            <Activity size={24} color="#3a0ca3" />
            <h3>Permanent Storage</h3>
            <p>Store streams of data safely in a distributed, durable, fault-tolerant cluster.</p>
          </div>
          <div className="feature-card">
            <ShieldCheck size={24} color="#4361ee" />
            <h3>High Availability</h3>
            <p>Stretch clusters efficiently over availability zones or connect separate clusters across geographic regions.</p>
          </div>
        </div>

        <div className="architecture-preview">
          <h2>Standard Architecture</h2>
          <div className="arch-diagram">
            <div className="arch-node">Producers</div>
            <div className="arch-arrow"><ArrowRight size={24} /></div>
            <div className="arch-node center">Kafka Brokers (KRaft)</div>
            <div className="arch-arrow"><ArrowRight size={24} /></div>
            <div className="arch-node">Consumers</div>
          </div>
        </div>
      </div>
    </div>
  );
}
