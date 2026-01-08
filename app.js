import React, { useState } from 'react';
import { Upload, Search, Mail, Calendar, CheckCircle, XCircle, Loader2, TrendingUp, Users, Target, Zap } from 'lucide-react';

export default function AISalesAgent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [emailTemplate, setEmailTemplate] = useState(`Hi {firstName},

I noticed {companyName} is {insight}. 

We help companies like yours {value_proposition}.

Would you be open to a 15-minute chat this week?

Best,
{yourName}`);

  const [settings, setSettings] = useState({
    yourName: 'Your Name',
    yourCompany: 'Your Company',
    valueProposition: 'increase sales by 40% using AI',
    targetRole: 'CEO, VP Sales, Head of Marketing',
    industryFocus: 'SaaS, E-commerce, Fintech'
  });

  const [stats, setStats] = useState({
    totalLeads: 0,
    qualified: 0,
    contacted: 0,
    responded: 0,
    meetings: 0
  });

  // Simulate AI lead qualification
  const qualifyLead = (lead) => {
    // AI checks: budget, authority, need, timeline
    const score = Math.random() * 100;
    const qualified = score > 60;
    
    const reasons = qualified ? [
      'Company size matches ICP',
      'Recent funding indicates budget',
      'Job title shows decision authority',
      'LinkedIn activity shows engagement'
    ] : [
      'Company too small for product fit',
      'Recent negative reviews',
      'No clear budget signals',
      'Out of target geography'
    ];

    return {
      qualified,
      score: score.toFixed(0),
      reasons: reasons.slice(0, 2)
    };
  };

  const processLeads = () => {
    if (!csvInput.trim()) {
      alert('Please paste CSV data');
      return;
    }

    setAnalyzing(true);

    // Simulate processing
    setTimeout(() => {
      const lines = csvInput.trim().split('\n');
      const headers = lines[0].split(',');
      
      const processedLeads = lines.slice(1).map((line, idx) => {
        const values = line.split(',');
        const leadData = {};
        headers.forEach((header, i) => {
          leadData[header.trim()] = values[i]?.trim() || '';
        });

        const qualification = qualifyLead(leadData);
        
        return {
          id: idx + 1,
          firstName: leadData.firstName || leadData.name?.split(' ')[0] || 'Unknown',
          lastName: leadData.lastName || leadData.name?.split(' ')[1] || '',
          company: leadData.company || 'Unknown Company',
          title: leadData.title || 'Unknown Title',
          email: leadData.email || 'no-email@example.com',
          linkedin: leadData.linkedin || '',
          ...qualification,
          status: qualification.qualified ? 'ready' : 'disqualified',
          contacted: false,
          responded: false,
          meetingBooked: false
        };
      });

      setLeads(processedLeads);
      
      const qualified = processedLeads.filter(l => l.qualified).length;
      setStats({
        totalLeads: processedLeads.length,
        qualified: qualified,
        contacted: 0,
        responded: 0,
        meetings: 0
      });

      setAnalyzing(false);
      setActiveTab('leads');
    }, 2000);
  };

  const sendCampaign = () => {
    const qualifiedLeads = leads.filter(l => l.qualified && !l.contacted);
    
    if (qualifiedLeads.length === 0) {
      alert('No qualified leads to contact');
      return;
    }

    // Simulate sending emails
    const updatedLeads = leads.map(lead => {
      if (lead.qualified && !lead.contacted) {
        return { ...lead, contacted: true, status: 'contacted' };
      }
      return lead;
    });

    setLeads(updatedLeads);
    
    // Simulate responses (30% response rate)
    setTimeout(() => {
      const withResponses = updatedLeads.map(lead => {
        if (lead.contacted && Math.random() > 0.7) {
          return { 
            ...lead, 
            responded: true, 
            status: 'responded',
            responseText: Math.random() > 0.5 
              ? 'Sounds interesting. When are you available?'
              : 'Tell me more. What does this cost?'
          };
        }
        return lead;
      });

      setLeads(withResponses);

      const contacted = withResponses.filter(l => l.contacted).length;
      const responded = withResponses.filter(l => l.responded).length;
      
      setStats(prev => ({
        ...prev,
        contacted,
        responded
      }));
    }, 3000);
  };

  const bookMeetings = () => {
    const respondedLeads = leads.filter(l => l.responded && !l.meetingBooked);
    
    if (respondedLeads.length === 0) {
      alert('No responses to book meetings from');
      return;
    }

    // Simulate booking meetings (80% booking rate from responses)
    const updatedLeads = leads.map(lead => {
      if (lead.responded && !lead.meetingBooked && Math.random() > 0.2) {
        return { 
          ...lead, 
          meetingBooked: true, 
          status: 'meeting_booked',
          meetingTime: 'Tomorrow at 2:00 PM'
        };
      }
      return lead;
    });

    setLeads(updatedLeads);
    
    const meetings = updatedLeads.filter(l => l.meetingBooked).length;
    setStats(prev => ({
      ...prev,
      meetings
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-black/30 rounded-2xl p-6 mb-6 backdrop-blur border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <Zap className="w-7 h-7" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Sales Agent</h1>
                <p className="text-sm text-purple-300">Automated Lead Gen → Qualification → Booking</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <div className="text-xs text-green-300">Status</div>
                <div className="font-bold text-green-400">Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-white/60">Total Leads</span>
            </div>
            <div className="text-3xl font-bold">{stats.totalLeads}</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-green-400" />
              <span className="text-sm text-white/60">Qualified</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{stats.qualified}</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-white/60">Contacted</span>
            </div>
            <div className="text-3xl font-bold text-purple-400">{stats.contacted}</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-white/60">Responded</span>
            </div>
            <div className="text-3xl font-bold text-yellow-400">{stats.responded}</div>
          </div>
          
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-pink-400" />
              <span className="text-sm text-white/60">Meetings</span>
            </div>
            <div className="text-3xl font-bold text-pink-400">{stats.meetings}</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'dashboard' ? 'bg-purple-600' : 'hover:bg-white/5'
            }`}
          >
            Upload Leads
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'leads' ? 'bg-purple-600' : 'hover:bg-white/5'
            }`}
          >
            Lead List
          </button>
          <button
            onClick={() => setActiveTab('campaign')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'campaign' ? 'bg-purple-600' : 'hover:bg-white/5'
            }`}
          >
            Campaign
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              activeTab === 'settings' ? 'bg-purple-600' : 'hover:bg-white/5'
            }`}
          >
            Settings
          </button>
        </div>

        {/* Upload Tab */}
        {activeTab === 'dashboard' && (
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-bold mb-4">Upload Lead Data</h2>
            <p className="text-white/60 mb-6">
              Paste CSV data with columns: firstName, lastName, company, title, email, linkedin
            </p>
            
            <textarea
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
              placeholder="firstName,lastName,company,title,email,linkedin
John,Doe,Acme Inc,CEO,john@acme.com,linkedin.com/in/johndoe
Jane,Smith,TechCo,VP Sales,jane@techco.com,linkedin.com/in/janesmith"
              className="w-full h-64 bg-black/30 border border-white/20 rounded-xl p-4 text-white font-mono text-sm"
            />
            
            <div className="mt-6 flex gap-4">
              <button
                onClick={processLeads}
                disabled={analyzing}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition disabled:opacity-50 flex items-center gap-2"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing & Qualifying...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Process & Qualify Leads
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setCsvInput(`firstName,lastName,company,title,email,linkedin
Sarah,Johnson,CloudScale,CEO,sarah@cloudscale.io,linkedin.com/in/sarahjohnson
Michael,Chen,DataFlow,CTO,michael@dataflow.com,linkedin.com/in/michaelchen
Emily,Rodriguez,SalesBoost,VP Sales,emily@salesboost.io,linkedin.com/in/emilyrodriguez
David,Kim,MarketAI,Head of Growth,david@marketai.com,linkedin.com/in/davidkim
Lisa,Patel,TechVentures,COO,lisa@techventures.com,linkedin.com/in/lisapatel`);
                }}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-medium transition"
              >
                Load Sample Data
              </button>
            </div>
          </div>
        )}

        {/* Leads Tab */}
        {activeTab === 'leads' && (
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Lead Pipeline</h2>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg text-sm">
                  Qualified: {leads.filter(l => l.qualified).length}
                </button>
                <button className="px-4 py-2 bg-red-600/20 text-red-400 rounded-lg text-sm">
                  Disqualified: {leads.filter(l => !l.qualified).length}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {leads.length === 0 ? (
                <div className="text-center py-12 text-white/40">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No leads uploaded yet. Go to Upload Leads tab.</p>
                </div>
              ) : (
                leads.map((lead) => (
                  <div
                    key={lead.id}
                    className={`bg-black/30 rounded-xl p-4 border ${
                      lead.qualified ? 'border-green-500/30' : 'border-red-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {lead.qualified ? (
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )}
                          <div>
                            <h3 className="font-semibold">
                              {lead.firstName} {lead.lastName}
                            </h3>
                            <p className="text-sm text-white/60">
                              {lead.title} at {lead.company}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm mt-3">
                          <span className="text-white/60">Score: {lead.score}/100</span>
                          <span className={`px-2 py-1 rounded ${
                            lead.status === 'meeting_booked' ? 'bg-pink-500/20 text-pink-400' :
                            lead.status === 'responded' ? 'bg-yellow-500/20 text-yellow-400' :
                            lead.status === 'contacted' ? 'bg-purple-500/20 text-purple-400' :
                            lead.status === 'ready' ? 'bg-green-500/20 text-green-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {lead.status.replace('_', ' ').toUpperCase()}
                          </span>
                          {lead.meetingBooked && (
                            <span className="text-pink-400">📅 {lead.meetingTime}</span>
                          )}
                        </div>

                        <div className="mt-3 space-y-1">
                          {lead.reasons.map((reason, idx) => (
                            <div key={idx} className="text-xs text-white/50">
                              • {reason}
                            </div>
                          ))}
                        </div>

                        {lead.responseText && (
                          <div className="mt-3 p-3 bg-white/5 rounded-lg text-sm">
                            <div className="text-white/60 mb-1">Response:</div>
                            <div className="italic">"{lead.responseText}"</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Campaign Tab */}
        {activeTab === 'campaign' && (
          <div className="space-y-6">
            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
              <h2 className="text-xl font-bold mb-4">Email Template</h2>
              <textarea
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className="w-full h-48 bg-black/30 border border-white/20 rounded-xl p-4 text-white"
              />
              <p className="text-sm text-white/60 mt-2">
                Variables: {'{firstName}'}, {'{companyName}'}, {'{insight}'}, {'{value_proposition}'}, {'{yourName}'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-purple-400" />
                  Send Campaign
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  AI will send personalized emails to all qualified leads
                </p>
                <button
                  onClick={sendCampaign}
                  disabled={leads.filter(l => l.qualified).length === 0}
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium transition disabled:opacity-50"
                >
                  Send to {leads.filter(l => l.qualified && !l.contacted).length} Qualified Leads
                </button>
              </div>

              <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-pink-400" />
                  Book Meetings
                </h3>
                <p className="text-sm text-white/60 mb-4">
                  AI will automatically book meetings with respondents
                </p>
                <button
                  onClick={bookMeetings}
                  disabled={leads.filter(l => l.responded).length === 0}
                  className="w-full px-6 py-3 bg-pink-600 hover:bg-pink-700 rounded-xl font-medium transition disabled:opacity-50"
                >
                  Book with {leads.filter(l => l.responded && !l.meetingBooked).length} Respondents
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
            <h2 className="text-xl font-bold mb-6">Campaign Settings</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Your Name</label>
                <input
                  type="text"
                  value={settings.yourName}
                  onChange={(e) => setSettings({...settings, yourName: e.target.value})}
                  className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Your Company</label>
                <input
                  type="text"
                  value={settings.yourCompany}
                  onChange={(e) => setSettings({...settings, yourCompany: e.target.value})}
                  className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Value Proposition</label>
                <input
                  type="text"
                  value={settings.valueProposition}
                  onChange={(e) => setSettings({...settings, valueProposition: e.target.value})}
                  className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Roles</label>
                <input
                  type="text"
                  value={settings.targetRole}
                  onChange={(e) => setSettings({...settings, targetRole: e.target.value})}
                  className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Industry Focus</label>
                <input
                  type="text"
                  value={settings.industryFocus}
                  onChange={(e) => setSettings({...settings, industryFocus: e.target.value})}
                  className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
                />
              </div>

              <button className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition mt-6">
                Save Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
