
import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface HazardAnalysisData {
  // Rope Access Methods
  appropriateEquipment: boolean;
  ropeTransfers: boolean;
  deviationReAnchor: boolean;
  walkingAidClimbing: boolean;
  suspendedAidClimbing: boolean;
  
  // Comments for methods
  fallArrestComments: string;
  horizontalLinesComments: string;
  leadClimbingComments: string;
  alternateAccessComments: string;
  
  // Rigging Plan
  riggingPlan: string;
  anchorageType: string;
  anchorage5000lbs: string;
  anchorSystem: string;
  deviationReAnchorRigging: string;
  stopperKnots: string;
  sentryRequired: string;
  ropeHazards: string;
  
  // Hazard removal options
  deEnergize: boolean;
  reSchedule: boolean;
  otherRemoval: boolean;
  otherRemovalDetails: string;
  
  // Avoid hazard options
  barrier: boolean;
  reAnchor: boolean;
  deviation: boolean;
  yAnchor: boolean;
  otherAvoid: boolean;
  otherAvoidDetails: string;
  
  // Rope hazard protection
  iceTray: boolean;
  throughGrate: boolean;
  engineered: boolean;
  fabric: boolean;
  roller: boolean;
  otherProtection: boolean;
  otherProtectionDetails: string;
  
  // Equipment drop-proof
  lanyard: boolean;
  separateRope: boolean;
  bagged: boolean;
  otherDropProof: boolean;
  otherDropProofDetails: string;
  
  // Rescue section
  personnelEquipment: string;
  verbal: boolean;
  radio: boolean;
  handSignal: boolean;
  commentsComm: string;
  designatedSafeZone: string;
  designatedSafeZoneComments: string;
  simpleIntervention: string;
  simpleInterventionComments: string;
  remoteRescueComplex: string;
  remoteRescueComplexComments: string;
  complexIntervention: string;
  complexInterventionComments: string;
  rescuePlan: string;
}

export default function HazardAnalysis() {
  const [formData, setFormData] = useState<HazardAnalysisData>({
    appropriateEquipment: false,
    ropeTransfers: false,
    deviationReAnchor: false,
    walkingAidClimbing: false,
    suspendedAidClimbing: false,
    fallArrestComments: '',
    horizontalLinesComments: '',
    leadClimbingComments: '',
    alternateAccessComments: '',
    riggingPlan: '',
    anchorageType: '',
    anchorage5000lbs: '',
    anchorSystem: '',
    deviationReAnchorRigging: '',
    stopperKnots: '',
    sentryRequired: '',
    ropeHazards: '',
    deEnergize: false,
    reSchedule: false,
    otherRemoval: false,
    otherRemovalDetails: '',
    barrier: false,
    reAnchor: false,
    deviation: false,
    yAnchor: false,
    otherAvoid: false,
    otherAvoidDetails: '',
    iceTray: false,
    throughGrate: false,
    engineered: false,
    fabric: false,
    roller: false,
    otherProtection: false,
    otherProtectionDetails: '',
    lanyard: false,
    separateRope: false,
    bagged: false,
    otherDropProof: false,
    otherDropProofDetails: '',
    personnelEquipment: '',
    verbal: false,
    radio: false,
    handSignal: false,
    commentsComm: '',
    designatedSafeZone: '',
    designatedSafeZoneComments: '',
    simpleIntervention: '',
    simpleInterventionComments: '',
    remoteRescueComplex: '',
    remoteRescueComplexComments: '',
    complexIntervention: '',
    complexInterventionComments: '',
    rescuePlan: '',
  });

  // Auto-save functionality
  useEffect(() => {
    const savedData = localStorage.getItem('hazardAnalysisData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('hazardAnalysisData', JSON.stringify(formData));
  }, [formData]);

  const updateField = (field: keyof HazardAnalysisData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const exportToPDF = () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 6;
    let currentY = margin;

    // Helper function to add text with automatic line wrapping
    const addText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
      pdf.setFontSize(fontSize);
      const lines = pdf.splitTextToSize(text, maxWidth);
      pdf.text(lines, x, y);
      return y + (lines.length * lineHeight);
    };

    // Helper function to get checkbox symbol
    const getCheckbox = (checked: boolean) => checked ? '☑' : '☐';

    // Header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    currentY = addText('LeNDT - Rope Access Hazard Analysis', margin, currentY, pageWidth - 2 * margin, 16);
    currentY += 10;

    // ROPE ACCESS Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    currentY = addText('ROPE ACCESS', margin, currentY, pageWidth - 2 * margin, 12);
    currentY += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    // Rope Access items
    const ropeAccessItems = [
      {
        checkbox: formData.appropriateEquipment,
        method: 'Appropriate equipment',
        item: 'Fall arrest/Restraint/Protection',
        comment: formData.fallArrestComments
      },
      {
        checkbox: formData.ropeTransfers,
        method: 'Rope transfers',
        item: 'Horizontal lines',
        comment: formData.horizontalLinesComments
      },
      {
        checkbox: formData.deviationReAnchor,
        method: 'Deviation/Re-Anchor/Passing-Knots',
        item: 'Lead Climbing (specific access plan required)',
        comment: formData.leadClimbingComments
      },
      {
        checkbox: formData.walkingAidClimbing,
        method: 'Walking Aid Climbing / Pipe Rack',
        item: 'Alternate access method',
        comment: formData.alternateAccessComments
      },
      {
        checkbox: formData.suspendedAidClimbing,
        method: 'Suspended Aid Climbing',
        item: '',
        comment: ''
      }
    ];

    ropeAccessItems.forEach(item => {
      const commentText = item.comment || 'N/A';
      const text = `${getCheckbox(item.checkbox)} ${item.method} | ${item.item}: ${commentText}`;
      currentY = addText(text, margin, currentY, pageWidth - 2 * margin);
      currentY += 2;
    });

    currentY += 10;

    // RIGGING Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    currentY = addText('RIGGING', margin, currentY, pageWidth - 2 * margin, 12);
    currentY += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const riggingItems = [
      { label: 'Rigging Plan', value: formData.riggingPlan },
      { label: 'Anchorage Type', value: formData.anchorageType },
      { label: 'Anchorage 5000lbs', value: formData.anchorage5000lbs },
      { label: 'Anchor System', value: formData.anchorSystem },
      { label: 'Deviation/Re-Anchor', value: formData.deviationReAnchorRigging },
      { label: 'Stopper Knots', value: formData.stopperKnots },
      { label: 'Sentry Required', value: formData.sentryRequired },
      { label: 'Rope Hazards', value: formData.ropeHazards }
    ];

    riggingItems.forEach(item => {
      const value = item.value || 'N/A';
      const text = `• ${item.label}: ${value}`;
      currentY = addText(text, margin, currentY, pageWidth - 2 * margin);
      currentY += 2;
    });

    currentY += 10;

    // Hazard Management Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    currentY = addText('HAZARD MANAGEMENT', margin, currentY, pageWidth - 2 * margin, 12);
    currentY += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    // Removal options
    currentY = addText('Remove Hazard:', margin, currentY, pageWidth - 2 * margin);
    currentY += 2;
    const removalItems = [
      { checkbox: formData.deEnergize, label: 'De-energize' },
      { checkbox: formData.reSchedule, label: 'Re-schedule' },
      { checkbox: formData.otherRemoval, label: `Other: ${formData.otherRemovalDetails || 'N/A'}` }
    ];

    removalItems.forEach(item => {
      currentY = addText(`  ${getCheckbox(item.checkbox)} ${item.label}`, margin, currentY, pageWidth - 2 * margin);
      currentY += 2;
    });

    currentY += 5;

    // Avoid hazard options
    currentY = addText('Avoid Hazard:', margin, currentY, pageWidth - 2 * margin);
    currentY += 2;
    const avoidItems = [
      { checkbox: formData.barrier, label: 'Barrier' },
      { checkbox: formData.reAnchor, label: 'Re-anchor' },
      { checkbox: formData.deviation, label: 'Deviation' },
      { checkbox: formData.yAnchor, label: 'Y-Anchor' },
      { checkbox: formData.otherAvoid, label: `Other: ${formData.otherAvoidDetails || 'N/A'}` }
    ];

    avoidItems.forEach(item => {
      currentY = addText(`  ${getCheckbox(item.checkbox)} ${item.label}`, margin, currentY, pageWidth - 2 * margin);
      currentY += 2;
    });

    currentY += 5;

    // Protection options
    currentY = addText('Rope Hazard Protection:', margin, currentY, pageWidth - 2 * margin);
    currentY += 2;
    const protectionItems = [
      { checkbox: formData.iceTray, label: 'Ice Tray' },
      { checkbox: formData.throughGrate, label: 'Through Grate' },
      { checkbox: formData.engineered, label: 'Engineered' },
      { checkbox: formData.fabric, label: 'Fabric' },
      { checkbox: formData.roller, label: 'Roller' },
      { checkbox: formData.otherProtection, label: `Other: ${formData.otherProtectionDetails || 'N/A'}` }
    ];

    protectionItems.forEach(item => {
      currentY = addText(`  ${getCheckbox(item.checkbox)} ${item.label}`, margin, currentY, pageWidth - 2 * margin);
      currentY += 2;
    });

    currentY += 5;

    // Equipment drop-proof
    currentY = addText('Equipment Drop-proof:', margin, currentY, pageWidth - 2 * margin);
    currentY += 2;
    const dropProofItems = [
      { checkbox: formData.lanyard, label: 'Lanyard' },
      { checkbox: formData.separateRope, label: 'Separate Rope' },
      { checkbox: formData.bagged, label: 'Bagged' },
      { checkbox: formData.otherDropProof, label: `Other: ${formData.otherDropProofDetails || 'N/A'}` }
    ];

    dropProofItems.forEach(item => {
      currentY = addText(`  ${getCheckbox(item.checkbox)} ${item.label}`, margin, currentY, pageWidth - 2 * margin);
      currentY += 2;
    });

    currentY += 10;

    // Check if we need a new page
    if (currentY > pageHeight - 40) {
      pdf.addPage();
      currentY = margin;
    }

    // ROPE ACCESS RIGGING & RESCUE Section
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    currentY = addText('ROPE ACCESS RIGGING & RESCUE', margin, currentY, pageWidth - 2 * margin, 12);
    currentY += 5;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const rescueItems = [
      { label: 'Personnel/Equipment', value: formData.personnelEquipment },
      { label: 'Communication - Verbal', checkbox: formData.verbal },
      { label: 'Communication - Radio', checkbox: formData.radio },
      { label: 'Communication - Hand Signal', checkbox: formData.handSignal },
      { label: 'Communication Comments', value: formData.commentsComm },
      { label: 'Designated Safe Zone', value: formData.designatedSafeZone },
      { label: 'Safe Zone Comments', value: formData.designatedSafeZoneComments },
      { label: 'Simple Intervention', value: formData.simpleIntervention },
      { label: 'Simple Intervention Comments', value: formData.simpleInterventionComments },
      { label: 'Remote Rescue Complex', value: formData.remoteRescueComplex },
      { label: 'Remote Rescue Comments', value: formData.remoteRescueComplexComments },
      { label: 'Complex Intervention', value: formData.complexIntervention },
      { label: 'Complex Intervention Comments', value: formData.complexInterventionComments },
      { label: 'Rescue Plan', value: formData.rescuePlan }
    ];

    rescueItems.forEach(item => {
      if ('checkbox' in item && item.checkbox !== undefined) {
        const text = `${getCheckbox(item.checkbox)} ${item.label}`;
        currentY = addText(text, margin, currentY, pageWidth - 2 * margin);
      } else if ('value' in item) {
        const value = item.value || 'N/A';
        const text = `• ${item.label}: ${value}`;
        currentY = addText(text, margin, currentY, pageWidth - 2 * margin);
      }
      currentY += 2;
    });

    // Add timestamp
    currentY += 10;
    const timestamp = new Date().toLocaleString();
    pdf.setFontSize(8);
    currentY = addText(`Generated: ${timestamp}`, margin, currentY, pageWidth - 2 * margin, 8);

    // Save the PDF
    const filename = `Hazard_Analysis_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(filename);
  };

  const clearForm = () => {
    if (confirm('Are you sure you want to clear all form data?')) {
      setFormData({
        appropriateEquipment: false,
        ropeTransfers: false,
        deviationReAnchor: false,
        walkingAidClimbing: false,
        suspendedAidClimbing: false,
        fallArrestComments: '',
        horizontalLinesComments: '',
        leadClimbingComments: '',
        alternateAccessComments: '',
        riggingPlan: '',
        anchorageType: '',
        anchorage5000lbs: '',
        anchorSystem: '',
        deviationReAnchorRigging: '',
        stopperKnots: '',
        sentryRequired: '',
        ropeHazards: '',
        deEnergize: false,
        reSchedule: false,
        otherRemoval: false,
        otherRemovalDetails: '',
        barrier: false,
        reAnchor: false,
        deviation: false,
        yAnchor: false,
        otherAvoid: false,
        otherAvoidDetails: '',
        iceTray: false,
        throughGrate: false,
        engineered: false,
        fabric: false,
        roller: false,
        otherProtection: false,
        otherProtectionDetails: '',
        lanyard: false,
        separateRope: false,
        bagged: false,
        otherDropProof: false,
        otherDropProofDetails: '',
        personnelEquipment: '',
        verbal: false,
        radio: false,
        handSignal: false,
        commentsComm: '',
        designatedSafeZone: '',
        designatedSafeZoneComments: '',
        simpleIntervention: '',
        simpleInterventionComments: '',
        remoteRescueComplex: '',
        remoteRescueComplexComments: '',
        complexIntervention: '',
        complexInterventionComments: '',
        rescuePlan: '',
      });
      localStorage.removeItem('hazardAnalysisData');
    }
  };

  return (
    <div style={{ background: '#f5f7fa', padding: '10px', minHeight: '100vh' }}>
      <style>{`
        .hazard-container {
          max-width: 1200px;
          margin: 0 auto;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .hazard-header {
          background: #2c5aa0;
          color: white;
          padding: 20px;
          text-align: center;
          font-size: 1.5rem;
          font-weight: bold;
        }
        
        .hazard-form-section {
          border: 2px solid #2c5aa0;
          margin: 0;
          background: white;
        }
        
        .hazard-section-header {
          background: #2c5aa0;
          color: white;
          padding: 8px 15px;
          font-weight: bold;
          font-size: 1.1rem;
          text-align: center;
        }
        
        .hazard-form-table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        
        .hazard-form-table td, .hazard-form-table th {
          border: 1px solid #2c5aa0;
          padding: 8px;
          vertical-align: top;
        }
        
        .hazard-form-table th {
          background: #2c5aa0;
          color: white;
          font-weight: bold;
          text-align: center;
        }
        
        .hazard-methods-column {
          width: 30%;
          background: #f8f9fa;
          font-weight: bold;
        }
        
        .hazard-comments-column {
          width: 15%;
          text-align: center;
        }
        
        .hazard-items-column {
          width: 40%;
          background: #f8f9fa;
          font-weight: bold;
        }
        
        .hazard-comments-cell {
          width: 75%;
        }
        
        .hazard-consideration-cell {
          width: 25%;
          background: #f8f9fa;
          font-weight: bold;
          text-align: center;
        }
        
        .hazard-checkbox-group {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }
        
        .hazard-checkbox-item {
          display: flex;
          align-items: center;
          gap: 4px;
          white-space: nowrap;
        }
        
        .hazard-checkbox-item input[type="checkbox"] {
          width: 18px;
          height: 18px;
          margin: 0;
          cursor: pointer;
        }
        
        .hazard-text-input {
          width: 100%;
          border: 1px solid #ccc;
          padding: 8px;
          font-size: 16px;
          border-radius: 4px;
          min-height: 44px;
          resize: vertical;
        }
        
        .hazard-text-input:focus {
          outline: none;
          border-color: #2c5aa0;
          box-shadow: 0 0 0 2px rgba(44, 90, 160, 0.2);
        }
        
        .hazard-large-text-area {
          min-height: 120px;
          resize: vertical;
        }
        
        .hazard-export-controls {
          position: fixed;
          top: 80px;
          right: 20px;
          background: white;
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1000;
        }
        
        .hazard-export-btn {
          background: #2c5aa0;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-left: 5px;
        }
        
        .hazard-export-btn:hover {
          background: #1e4080;
        }
        
        .hazard-export-btn.danger {
          background: #ef4444;
        }
        
        .hazard-export-btn.danger:hover {
          background: #dc2626;
        }
        
        @media print {
          .hazard-export-controls {
            display: none !important;
          }
          
          * {
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box !important;
          }
          
          body {
            background: white !important;
            padding: 0 !important;
            font-size: 8px !important;
            font-family: Arial, sans-serif !important;
          }
          
          .hazard-container {
            box-shadow: none !important;
            border-radius: 0 !important;
            max-width: none !important;
            margin: 0 !important;
            width: 100% !important;
            height: 100vh !important;
            display: flex !important;
            flex-direction: column !important;
          }
          
          .hazard-header {
            background: white !important;
            color: black !important;
            border: 2px solid black !important;
            padding: 8px !important;
            text-align: center !important;
            font-size: 14px !important;
            font-weight: bold !important;
            margin-bottom: 2px !important;
          }
          
          .hazard-form-section {
            border: 1px solid black !important;
            margin: 0 !important;
            margin-bottom: 2px !important;
            background: white !important;
            flex: 1 !important;
          }
          
          .hazard-section-header {
            background: black !important;
            color: white !important;
            padding: 2px 8px !important;
            font-weight: bold !important;
            font-size: 9px !important;
            text-align: center !important;
          }
          
          .hazard-form-table {
            width: 100% !important;
            border-collapse: collapse !important;
            background: white !important;
            height: 100% !important;
          }
          
          .hazard-form-table td, .hazard-form-table th {
            border: 1px solid black !important;
            padding: 2px !important;
            vertical-align: top !important;
            font-size: 7px !important;
            line-height: 1.1 !important;
          }
          
          .hazard-form-table th {
            background: #f0f0f0 !important;
            color: black !important;
            font-weight: bold !important;
            text-align: center !important;
            font-size: 7px !important;
          }
          
          .hazard-methods-column {
            width: 25% !important;
            background: #f8f8f8 !important;
            font-weight: bold !important;
            font-size: 6px !important;
          }
          
          .hazard-comments-column {
            width: 8% !important;
            text-align: center !important;
          }
          
          .hazard-items-column {
            width: 35% !important;
            background: #f8f8f8 !important;
            font-weight: bold !important;
            font-size: 6px !important;
          }
          
          .hazard-comments-cell {
            width: 32% !important;
          }
          
          .hazard-consideration-cell {
            width: 20% !important;
            background: #f8f8f8 !important;
            font-weight: bold !important;
            text-align: center !important;
            font-size: 6px !important;
          }
          
          .hazard-checkbox-group {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 2px !important;
            align-items: center !important;
          }
          
          .hazard-checkbox-item {
            display: flex !important;
            align-items: center !important;
            gap: 1px !important;
            white-space: nowrap !important;
            font-size: 6px !important;
          }
          
          .hazard-checkbox-item input[type="checkbox"] {
            width: 8px !important;
            height: 8px !important;
            margin: 0 !important;
            cursor: pointer !important;
          }
          
          .hazard-checkbox-item label {
            font-size: 6px !important;
          }
          
          .hazard-text-input {
            border: 1px solid black !important;
            background: white !important;
            color: black !important;
            font-size: 6px !important;
            min-height: auto !important;
            padding: 1px !important;
            width: 100% !important;
            resize: none !important;
            font-family: Arial, sans-serif !important;
            line-height: 1.1 !important;
          }
          
          .hazard-large-text-area {
            min-height: 60px !important;
            max-height: 60px !important;
          }
          
          /* Compact layout for print */
          .print-compact-row {
            height: 25px !important;
          }
          
          .print-compact-rigging {
            height: 180px !important;
          }
          
          .print-compact-rescue {
            height: 160px !important;
          }
          
          /* Hide overflow content for print */
          .hazard-text-input {
            overflow: hidden !important;
          }
          
          /* Ensure single page */
          @page {
            size: letter !important;
            margin: 0.25in !important;
          }
          
          .hazard-container {
            page-break-inside: avoid !important;
          }
          
          .hazard-form-section:last-child {
            margin-bottom: 0 !important;
          }
        }
      `}</style>
      
      <div className="hazard-export-controls">
        <button className="hazard-export-btn" onClick={exportToPDF}>
          📄 Export PDF
        </button>
        <button className="hazard-export-btn" onClick={() => window.print()}>
          🖨️ Print
        </button>
        <button className="hazard-export-btn danger" onClick={clearForm}>
          🗑️ Clear Form
        </button>
      </div>

      <div className="hazard-container">
        <div className="hazard-header">
          LeNDT<br />
          Rope Access Hazard Analysis
        </div>

        {/* Rope Access Section */}
        <div className="hazard-form-section">
          <div className="hazard-section-header">ROPE ACCESS</div>
          <table className="hazard-form-table">
            <thead>
              <tr>
                <th className="hazard-methods-column">Methods of Access</th>
                <th className="hazard-comments-column">Comments</th>
                <th className="hazard-items-column">Item</th>
                <th className="hazard-comments-column">Comments:</th>
              </tr>
            </thead>
            <tbody>
              <tr className="print-compact-row">
                <td className="hazard-methods-column">Appropriate equipment</td>
                <td className="hazard-comments-column">
                  <input
                    type="checkbox"
                    checked={formData.appropriateEquipment}
                    onChange={(e) => updateField('appropriateEquipment', e.target.checked)}
                  />
                </td>
                <td className="hazard-items-column">Fall arrest/ Restraint/ Protection</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.fallArrestComments}
                    onChange={(e) => updateField('fallArrestComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr className="print-compact-row">
                <td className="hazard-methods-column">Rope transfers</td>
                <td className="hazard-comments-column">
                  <input
                    type="checkbox"
                    checked={formData.ropeTransfers}
                    onChange={(e) => updateField('ropeTransfers', e.target.checked)}
                  />
                </td>
                <td className="hazard-items-column">Horizontal lines</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.horizontalLinesComments}
                    onChange={(e) => updateField('horizontalLinesComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr className="print-compact-row">
                <td className="hazard-methods-column">Deviation/Re-Anchor/Passing-Knots</td>
                <td className="hazard-comments-column">
                  <input
                    type="checkbox"
                    checked={formData.deviationReAnchor}
                    onChange={(e) => updateField('deviationReAnchor', e.target.checked)}
                  />
                </td>
                <td className="hazard-items-column">Lead Climbing (specific access plan required)</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.leadClimbingComments}
                    onChange={(e) => updateField('leadClimbingComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr className="print-compact-row">
                <td className="hazard-methods-column">Walking Aid Climbing / Pipe Rack</td>
                <td className="hazard-comments-column">
                  <input
                    type="checkbox"
                    checked={formData.walkingAidClimbing}
                    onChange={(e) => updateField('walkingAidClimbing', e.target.checked)}
                  />
                </td>
                <td className="hazard-items-column">Alternate access method</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.alternateAccessComments}
                    onChange={(e) => updateField('alternateAccessComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr className="print-compact-row">
                <td className="hazard-methods-column">Suspended Aid Climbing</td>
                <td className="hazard-comments-column">
                  <input
                    type="checkbox"
                    checked={formData.suspendedAidClimbing}
                    onChange={(e) => updateField('suspendedAidClimbing', e.target.checked)}
                  />
                </td>
                <td className="hazard-items-column"></td>
                <td className="hazard-comments-cell">
                  <textarea className="hazard-text-input" rows={2} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Rigging Section */}
        <div className="hazard-form-section print-compact-rigging">
          <div className="hazard-section-header">RIGGING</div>
          <table className="hazard-form-table">
            <thead>
              <tr>
                <th style={{ width: '30%' }}>Rigging Plan – Written or Diagram</th>
                <th className="hazard-consideration-cell">Consideration</th>
                <th className="hazard-comments-cell">Comments:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={11} style={{ verticalAlign: 'top' }}>
                  <textarea
                    className="hazard-text-input hazard-large-text-area"
                    placeholder="Describe rigging plan or attach diagram"
                    value={formData.riggingPlan}
                    onChange={(e) => updateField('riggingPlan', e.target.value)}
                  />
                </td>
                <td className="hazard-consideration-cell">Anchorage Type(s)</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.anchorageType}
                    onChange={(e) => updateField('anchorageType', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Anchorage 5000lbs</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.anchorage5000lbs}
                    onChange={(e) => updateField('anchorage5000lbs', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Anchor system</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.anchorSystem}
                    onChange={(e) => updateField('anchorSystem', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Deviation / Re-Anchor / Passing Knots</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.deviationReAnchorRigging}
                    onChange={(e) => updateField('deviationReAnchorRigging', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Stopper Knots/ Ropes Bagged</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.stopperKnots}
                    onChange={(e) => updateField('stopperKnots', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Sentry Required</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.sentryRequired}
                    onChange={(e) => updateField('sentryRequired', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Rope Hazard(s)</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.ropeHazards}
                    onChange={(e) => updateField('ropeHazards', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Removal of Hazard Available</td>
                <td className="hazard-comments-cell">
                  <div className="hazard-checkbox-group">
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.deEnergize}
                        onChange={(e) => updateField('deEnergize', e.target.checked)}
                      />
                      <label>De-Energize</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.reSchedule}
                        onChange={(e) => updateField('reSchedule', e.target.checked)}
                      />
                      <label>Re-Schedule</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.otherRemoval}
                        onChange={(e) => updateField('otherRemoval', e.target.checked)}
                      />
                      <label>Other</label>
                    </div>
                  </div>
                  <textarea
                    className="hazard-text-input"
                    rows={1}
                    placeholder="Other details"
                    value={formData.otherRemovalDetails}
                    onChange={(e) => updateField('otherRemovalDetails', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Avoid Hazard</td>
                <td className="hazard-comments-cell">
                  <div className="hazard-checkbox-group">
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.barrier}
                        onChange={(e) => updateField('barrier', e.target.checked)}
                      />
                      <label>Barrier</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.reAnchor}
                        onChange={(e) => updateField('reAnchor', e.target.checked)}
                      />
                      <label>Re-Anchor</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.deviation}
                        onChange={(e) => updateField('deviation', e.target.checked)}
                      />
                      <label>Deviation</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.yAnchor}
                        onChange={(e) => updateField('yAnchor', e.target.checked)}
                      />
                      <label>Y-Anchor</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.otherAvoid}
                        onChange={(e) => updateField('otherAvoid', e.target.checked)}
                      />
                      <label>Other</label>
                    </div>
                  </div>
                  <textarea
                    className="hazard-text-input"
                    rows={1}
                    placeholder="Other details"
                    value={formData.otherAvoidDetails}
                    onChange={(e) => updateField('otherAvoidDetails', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Rope Hazard Protection</td>
                <td className="hazard-comments-cell">
                  <div className="hazard-checkbox-group">
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.iceTray}
                        onChange={(e) => updateField('iceTray', e.target.checked)}
                      />
                      <label>Ice-Tray</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.throughGrate}
                        onChange={(e) => updateField('throughGrate', e.target.checked)}
                      />
                      <label>Through-Grate</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.engineered}
                        onChange={(e) => updateField('engineered', e.target.checked)}
                      />
                      <label>Engineered</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.fabric}
                        onChange={(e) => updateField('fabric', e.target.checked)}
                      />
                      <label>Fabric</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.roller}
                        onChange={(e) => updateField('roller', e.target.checked)}
                      />
                      <label>Roller</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.otherProtection}
                        onChange={(e) => updateField('otherProtection', e.target.checked)}
                      />
                      <label>Other</label>
                    </div>
                  </div>
                  <textarea
                    className="hazard-text-input"
                    rows={1}
                    placeholder="Other details"
                    value={formData.otherProtectionDetails}
                    onChange={(e) => updateField('otherProtectionDetails', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Equipment Drop-Proof</td>
                <td className="hazard-comments-cell">
                  <div className="hazard-checkbox-group">
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.lanyard}
                        onChange={(e) => updateField('lanyard', e.target.checked)}
                      />
                      <label>Lanyard</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.separateRope}
                        onChange={(e) => updateField('separateRope', e.target.checked)}
                      />
                      <label>Separate Rope</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.bagged}
                        onChange={(e) => updateField('bagged', e.target.checked)}
                      />
                      <label>Bagged</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.otherDropProof}
                        onChange={(e) => updateField('otherDropProof', e.target.checked)}
                      />
                      <label>Other</label>
                    </div>
                  </div>
                  <textarea
                    className="hazard-text-input"
                    rows={1}
                    placeholder="Other details"
                    value={formData.otherDropProofDetails}
                    onChange={(e) => updateField('otherDropProofDetails', e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Rescue Section */}
        <div className="hazard-form-section print-compact-rescue">
          <div className="hazard-section-header">ROPE ACCESS RIGGING & RESCUE</div>
          <table className="hazard-form-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Appropriate Personnel / Rescue Equipment</th>
                <th colSpan={2} style={{ width: '50%' }}>Simple Remote Rescue- Rig for Rescue</th>
                <th style={{ width: '25%' }}>Comments:</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td rowSpan={5} style={{ verticalAlign: 'top' }}>
                  <textarea
                    className="hazard-text-input hazard-large-text-area"
                    placeholder="List personnel and rescue equipment"
                    value={formData.personnelEquipment}
                    onChange={(e) => updateField('personnelEquipment', e.target.value)}
                  />
                </td>
                <td className="hazard-consideration-cell">Communication Methods</td>
                <td className="hazard-comments-cell">
                  <div className="hazard-checkbox-group">
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.verbal}
                        onChange={(e) => updateField('verbal', e.target.checked)}
                      />
                      <label>Verbal</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.radio}
                        onChange={(e) => updateField('radio', e.target.checked)}
                      />
                      <label>Radio</label>
                    </div>
                    <div className="hazard-checkbox-item">
                      <input
                        type="checkbox"
                        checked={formData.handSignal}
                        onChange={(e) => updateField('handSignal', e.target.checked)}
                      />
                      <label>Hand Signal</label>
                    </div>
                  </div>
                </td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.commentsComm}
                    onChange={(e) => updateField('commentsComm', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Designated Safe Zone</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.designatedSafeZone}
                    onChange={(e) => updateField('designatedSafeZone', e.target.value)}
                  />
                </td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.designatedSafeZoneComments}
                    onChange={(e) => updateField('designatedSafeZoneComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Simple Intervention Rescue– Pick, Snatch</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.simpleIntervention}
                    onChange={(e) => updateField('simpleIntervention', e.target.value)}
                  />
                </td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.simpleInterventionComments}
                    onChange={(e) => updateField('simpleInterventionComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Remote Rescue Complex– Winch, MEWP, etc</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.remoteRescueComplex}
                    onChange={(e) => updateField('remoteRescueComplex', e.target.value)}
                  />
                </td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.remoteRescueComplexComments}
                    onChange={(e) => updateField('remoteRescueComplexComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td className="hazard-consideration-cell">Complex Intervention– Rope to Rope, Aid, etc</td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.complexIntervention}
                    onChange={(e) => updateField('complexIntervention', e.target.value)}
                  />
                </td>
                <td className="hazard-comments-cell">
                  <textarea
                    className="hazard-text-input"
                    rows={2}
                    value={formData.complexInterventionComments}
                    onChange={(e) => updateField('complexInterventionComments', e.target.value)}
                  />
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={{ background: '#2c5aa0', color: 'white', fontWeight: 'bold', textAlign: 'center', padding: '10px' }}>
                  Rescue Plan - Diagram or Written
                </td>
              </tr>
              <tr>
                <td colSpan={4} style={{ height: '100px', verticalAlign: 'top' }}>
                  <textarea
                    className="hazard-text-input hazard-large-text-area"
                    style={{ height: '90px' }}
                    placeholder="Describe rescue plan or attach diagram"
                    value={formData.rescuePlan}
                    onChange={(e) => updateField('rescuePlan', e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
