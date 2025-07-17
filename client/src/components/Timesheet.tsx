import { useState, useEffect, useCallback } from "react";

interface Technician {
  id: string;
  name: string;
  hours: {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
  };
  total: number;
}

interface JobDetail {
  id: string;
  workDescription: string;
  equipment: string;
  materials: string;
  quantity: number;
}

interface TravelHours {
  mon: number;
  tue: number;
  wed: number;
  thu: number;
  fri: number;
  sat: number;
  sun: number;
}

interface TimesheetData {
  date: string;
  jobNumber: string;
  woNumber: string;
  coNumber: string;
  client: string;
  billingAddress: string;
  location: string;
  contact: string;
  contactPhone: string;
  jobDescription: string;
  notes: string;
}

export default function Timesheet() {
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [jobDetails, setJobDetails] = useState<JobDetail[]>([]);
  const [travelHours, setTravelHours] = useState<TravelHours>({
    mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0
  });
  const [timesheetData, setTimesheetData] = useState<TimesheetData>({
    date: new Date().toISOString().slice(0, 10),
    jobNumber: '',
    woNumber: '',
    coNumber: '',
    client: '',
    billingAddress: '',
    location: '',
    contact: '',
    contactPhone: '',
    jobDescription: '',
    notes: ''
  });

  const [techCounter, setTechCounter] = useState(0);
  const [jobCounter, setJobCounter] = useState(0);

  // Initialize with one technician and job detail
  useEffect(() => {
    addTechnician();
    addJobDetail();
    loadSavedData();
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      const data = {
        technicians,
        jobDetails,
        travelHours,
        timesheetData
      };
      localStorage.setItem('timesheetData', JSON.stringify(data));
    };

    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [technicians, jobDetails, travelHours, timesheetData]);

  const loadSavedData = () => {
    const savedData = localStorage.getItem('timesheetData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.technicians) setTechnicians(data.technicians);
        if (data.jobDetails) setJobDetails(data.jobDetails);
        if (data.travelHours) setTravelHours(data.travelHours);
        if (data.timesheetData) setTimesheetData(data.timesheetData);
        if (data.technicians) setTechCounter(data.technicians.length);
        if (data.jobDetails) setJobCounter(data.jobDetails.length);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  };

  const addTechnician = () => {
    const newId = `tech-${techCounter + 1}`;
    const newTech: Technician = {
      id: newId,
      name: '',
      hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
      total: 0
    };
    setTechnicians(prev => [...prev, newTech]);
    setTechCounter(prev => prev + 1);
  };

  const removeTechnician = (id: string) => {
    if (technicians.length <= 1) {
      alert('You must have at least one technician.');
      return;
    }
    if (confirm('Are you sure you want to remove this technician?')) {
      setTechnicians(prev => prev.filter(tech => tech.id !== id));
    }
  };

  const updateTechnicianName = (id: string, name: string) => {
    setTechnicians(prev => prev.map(tech => 
      tech.id === id ? { ...tech, name } : tech
    ));
  };

  const updateTechnicianHours = (id: string, day: keyof TravelHours, hours: number) => {
    setTechnicians(prev => prev.map(tech => {
      if (tech.id === id) {
        const newHours = { ...tech.hours, [day]: hours };
        const total = Object.values(newHours).reduce((sum, h) => sum + h, 0);
        return { ...tech, hours: newHours, total };
      }
      return tech;
    }));
  };

  const updateTravelHours = (day: keyof TravelHours, hours: number) => {
    setTravelHours(prev => ({ ...prev, [day]: hours }));
  };

  const addJobDetail = () => {
    const newId = `job-${jobCounter + 1}`;
    const newJob: JobDetail = {
      id: newId,
      workDescription: '',
      equipment: '',
      materials: '',
      quantity: 0
    };
    setJobDetails(prev => [...prev, newJob]);
    setJobCounter(prev => prev + 1);
  };

  const removeJobDetail = (id: string) => {
    setJobDetails(prev => prev.filter(job => job.id !== id));
  };

  const updateJobDetail = (id: string, field: keyof JobDetail, value: string | number) => {
    setJobDetails(prev => prev.map(job =>
      job.id === id ? { ...job, [field]: value } : job
    ));
  };

  const updateTimesheetData = (field: keyof TimesheetData, value: string) => {
    setTimesheetData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const totalRegularHours = technicians.reduce((sum, tech) => sum + tech.total, 0);
  const totalTravelHours = Object.values(travelHours).reduce((sum, hours) => sum + hours, 0);
  const grandTotalHours = totalRegularHours + totalTravelHours;
  const totalTechnicians = technicians.filter(tech => tech.total > 0).length;

  const saveCopy = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5).replace(':', '');
    const jobNum = timesheetData.jobNumber || 'NoJob';
    const filename = `Timesheet_${jobNum}_${dateStr}_${timeStr}.json`;

    const data = {
      technicians,
      jobDetails,
      travelHours,
      timesheetData,
      totals: {
        totalRegularHours,
        totalTravelHours,
        grandTotalHours,
        totalTechnicians
      }
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Timesheet saved as: ${filename}`);
  };

  const clearForm = () => {
    if (confirm('Are you sure you want to clear all data and start a new timesheet?')) {
      setTechnicians([]);
      setJobDetails([]);
      setTravelHours({ mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 });
      setTimesheetData({
        date: new Date().toISOString().slice(0, 10),
        jobNumber: '',
        woNumber: '',
        coNumber: '',
        client: '',
        billingAddress: '',
        location: '',
        contact: '',
        contactPhone: '',
        jobDescription: '',
        notes: ''
      });
      setTechCounter(0);
      setJobCounter(0);
      localStorage.removeItem('timesheetData');
      
      // Re-add initial items
      setTimeout(() => {
        addTechnician();
        addJobDetail();
      }, 100);
    }
  };

  const printTimesheet = () => {
    window.print();
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: '#f5f7fa', padding: '20px', lineHeight: '1.6' }}>
      <div className="timesheet-container">
        {/* Header */}
        <div className="timesheet-header">
          <h1>CORDA VERTICAL TRAVELER</h1>
          <div className="timesheet-header-info">
            <div className="timesheet-info-card">
              <label className="timesheet-label">Date:</label>
              <input
                type="date"
                className="timesheet-input"
                value={timesheetData.date}
                onChange={(e) => updateTimesheetData('date', e.target.value)}
              />
            </div>
            <div className="timesheet-info-card">
              <label className="timesheet-label">Job Number:</label>
              <input
                type="text"
                className="timesheet-input"
                value={timesheetData.jobNumber}
                onChange={(e) => updateTimesheetData('jobNumber', e.target.value)}
              />
            </div>
            <div className="timesheet-info-card">
              <label className="timesheet-label">WO Number:</label>
              <input
                type="text"
                className="timesheet-input"
                value={timesheetData.woNumber}
                onChange={(e) => updateTimesheetData('woNumber', e.target.value)}
              />
            </div>
            <div className="timesheet-info-card">
              <label className="timesheet-label">CO Number:</label>
              <input
                type="text"
                className="timesheet-input"
                value={timesheetData.coNumber}
                onChange={(e) => updateTimesheetData('coNumber', e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="timesheet-content">
          {/* Client & Location Information */}
          <div className="timesheet-section">
            <div className="timesheet-section-title">Client & Location Information</div>
            <div className="timesheet-form-grid">
              <div className="timesheet-form-group">
                <label className="timesheet-label">Client:</label>
                <input
                  type="text"
                  className="timesheet-input"
                  value={timesheetData.client}
                  onChange={(e) => updateTimesheetData('client', e.target.value)}
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Billing Address:</label>
                <textarea
                  className="timesheet-textarea"
                  value={timesheetData.billingAddress}
                  onChange={(e) => updateTimesheetData('billingAddress', e.target.value)}
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Location:</label>
                <textarea
                  className="timesheet-textarea"
                  value={timesheetData.location}
                  onChange={(e) => updateTimesheetData('location', e.target.value)}
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Contact:</label>
                <input
                  type="text"
                  className="timesheet-input"
                  value={timesheetData.contact}
                  onChange={(e) => updateTimesheetData('contact', e.target.value)}
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Contact Phone:</label>
                <input
                  type="tel"
                  className="timesheet-input"
                  value={timesheetData.contactPhone}
                  onChange={(e) => updateTimesheetData('contactPhone', e.target.value)}
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Job Description:</label>
                <input
                  type="text"
                  className="timesheet-input"
                  value={timesheetData.jobDescription}
                  onChange={(e) => updateTimesheetData('jobDescription', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Time Tracking */}
          <div className="timesheet-section">
            <div className="timesheet-section-title">Time Tracking</div>
            
            {/* Header Row */}
            <div className="timesheet-time-grid">
              <div className="timesheet-time-header">Technician</div>
              <div className="timesheet-time-header">Mon</div>
              <div className="timesheet-time-header">Tue</div>
              <div className="timesheet-time-header">Wed</div>
              <div className="timesheet-time-header">Thu</div>
              <div className="timesheet-time-header">Fri</div>
              <div className="timesheet-time-header">Sat</div>
              <div className="timesheet-time-header">Sun</div>
              <div className="timesheet-time-header">Total</div>
            </div>

            {/* Technician Rows */}
            {technicians.map((tech) => (
              <div key={tech.id} className="timesheet-time-grid">
                <div className="timesheet-tech-name">
                  <input
                    type="text"
                    placeholder="Technician Name"
                    value={tech.name}
                    onChange={(e) => updateTechnicianName(tech.id, e.target.value)}
                    style={{ border: 'none', background: 'transparent', fontWeight: '600', color: 'var(--timesheet-primary)', width: '100%' }}
                  />
                  {technicians.length > 1 && (
                    <button
                      onClick={() => removeTechnician(tech.id)}
                      className="timesheet-remove-btn"
                      style={{ marginTop: '5px' }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                  <input
                    key={day}
                    type="number"
                    step="0.5"
                    min="0"
                    className="timesheet-time-input"
                    value={tech.hours[day] || ''}
                    onChange={(e) => updateTechnicianHours(tech.id, day, parseFloat(e.target.value) || 0)}
                  />
                ))}
                <div className="timesheet-total-cell">{tech.total.toFixed(1)}</div>
              </div>
            ))}
            
            <div style={{ marginTop: '15px', textAlign: 'center' }}>
              <button className="timesheet-add-btn" onClick={addTechnician}>
                + Add Technician
              </button>
            </div>

            {/* Travel Time Section */}
            <div className="timesheet-travel-section">
              <h4 style={{ marginBottom: '15px', color: '#92400e' }}>Travel Time</h4>
              <div className="timesheet-travel-grid">
                <div style={{ fontWeight: '600', color: '#92400e' }}>Travel Hours</div>
                {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                  <input
                    key={day}
                    type="number"
                    step="0.5"
                    min="0"
                    className="timesheet-time-input"
                    value={travelHours[day] || ''}
                    onChange={(e) => updateTravelHours(day, parseFloat(e.target.value) || 0)}
                  />
                ))}
              </div>
              <div style={{ marginTop: '10px', textAlign: 'right', fontWeight: '600', color: '#92400e' }}>
                Total Travel: {totalTravelHours.toFixed(1)} hours
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="timesheet-section">
            <div className="timesheet-section-title">Job Details & Equipment</div>
            <div className="timesheet-job-details">
              <table className="timesheet-job-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Equipment ID</th>
                    <th>Equipment Description</th>
                    <th>Pipe Size</th>
                    <th>Quantity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {jobDetails.map((job) => (
                    <tr key={job.id}>
                      <td>
                        <input
                          type="date"
                          style={{ width: '100%', border: 'none', padding: '5px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="ID#"
                          value={job.equipment}
                          onChange={(e) => updateJobDetail(job.id, 'equipment', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '5px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Equipment description"
                          value={job.workDescription}
                          onChange={(e) => updateJobDetail(job.id, 'workDescription', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '5px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Size"
                          value={job.materials}
                          onChange={(e) => updateJobDetail(job.id, 'materials', e.target.value)}
                          style={{ width: '100%', border: 'none', padding: '5px' }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={job.quantity || ''}
                          onChange={(e) => updateJobDetail(job.id, 'quantity', parseInt(e.target.value) || 0)}
                          style={{ width: '100%', border: 'none', padding: '5px' }}
                        />
                      </td>
                      <td>
                        <button
                          className="timesheet-remove-btn"
                          onClick={() => removeJobDetail(job.id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="timesheet-add-btn" onClick={addJobDetail}>
                + Add Equipment Entry
              </button>
              <button 
                className="timesheet-add-btn" 
                onClick={saveCopy}
                style={{ background: '#059669', marginLeft: '10px' }}
              >
                💾 Save Copy
              </button>
              <button 
                className="timesheet-add-btn" 
                onClick={printTimesheet}
                style={{ background: '#3b82f6', marginLeft: '10px' }}
              >
                📄 Print/Export
              </button>
            </div>
          </div>

          {/* Notes & Comments */}
          <div className="timesheet-section">
            <div className="timesheet-section-title">Notes & Comments</div>
            <div className="timesheet-notes-section">
              <textarea
                className="timesheet-textarea"
                placeholder="Enter any additional notes, comments, or special instructions..."
                value={timesheetData.notes}
                onChange={(e) => updateTimesheetData('notes', e.target.value)}
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="timesheet-summary-cards">
            <div className="timesheet-summary-card">
              <h3>{totalRegularHours.toFixed(1)}</h3>
              <p>Total Regular Hours</p>
            </div>
            <div className="timesheet-summary-card">
              <h3>{totalTravelHours.toFixed(1)}</h3>
              <p>Total Travel Hours</p>
            </div>
            <div className="timesheet-summary-card">
              <h3>{grandTotalHours.toFixed(1)}</h3>
              <p>Grand Total Hours</p>
            </div>
          </div>

          {/* Signature Section */}
          <div className="timesheet-signature-section">
            <div className="timesheet-signature-box">
              <h4>Technician Signature</h4>
              <div style={{ margin: '20px 0' }}>
                <input type="text" placeholder="Print Name" className="timesheet-input" style={{ marginBottom: '10px' }} />
                <input type="date" className="timesheet-input" />
              </div>
            </div>
            <div className="timesheet-signature-box">
              <h4>Client Representative</h4>
              <div style={{ margin: '20px 0' }}>
                <input type="text" placeholder="Print Name" className="timesheet-input" style={{ marginBottom: '10px' }} />
                <input type="date" className="timesheet-input" />
              </div>
            </div>
            <div className="timesheet-signature-box">
              <h4>Management Review</h4>
              <div style={{ margin: '20px 0' }}>
                <input type="text" placeholder="Print Name" className="timesheet-input" style={{ marginBottom: '10px' }} />
                <input type="date" className="timesheet-input" />
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '2px solid #e5e7eb' }}>
            <button 
              className="timesheet-add-btn" 
              onClick={clearForm}
              style={{ background: '#ef4444', color: 'white' }}
            >
              🗑️ Clear Form & Start New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
