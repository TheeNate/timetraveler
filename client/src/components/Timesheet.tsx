import { useState, useEffect, useCallback } from "react";
import jsPDF from "jspdf";

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
  travelHours: {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
  };
  total: number;
  travelTotal: number;
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
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  });
  const [timesheetData, setTimesheetData] = useState<TimesheetData>({
    date: new Date().toISOString().slice(0, 10),
    jobNumber: "",
    woNumber: "",
    coNumber: "",
    client: "",
    billingAddress: "",
    location: "",
    contact: "",
    contactPhone: "",
    jobDescription: "",
    notes: "",
  });

  const [techCounter, setTechCounter] = useState(0);
  const [jobCounter, setJobCounter] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Initialize with one technician and job detail
  useEffect(() => {
    // Clear old data that might not have the new structure
    if (localStorage.getItem("timesheetData")) {
      const savedData = localStorage.getItem("timesheetData");
      try {
        const data = JSON.parse(savedData!);
        if (
          data.technicians &&
          data.technicians[0] &&
          !data.technicians[0].travelHours
        ) {
          localStorage.removeItem("timesheetData");
        }
      } catch (e) {
        localStorage.removeItem("timesheetData");
      }
    }

    addTechnician();
    addJobDetail();
    loadSavedData();

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Listen for PWA install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      const data = {
        technicians,
        jobDetails,
        travelHours,
        timesheetData,
      };
      localStorage.setItem("timesheetData", JSON.stringify(data));
    };

    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [technicians, jobDetails, travelHours, timesheetData]);

  const loadSavedData = () => {
    const savedData = localStorage.getItem("timesheetData");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);

        // Migrate old technician data to include travelHours if missing
        if (data.technicians) {
          const migratedTechnicians = data.technicians.map((tech: any) => ({
            ...tech,
            travelHours: tech.travelHours || {
              mon: 0,
              tue: 0,
              wed: 0,
              thu: 0,
              fri: 0,
              sat: 0,
              sun: 0,
            },
            travelTotal: tech.travelTotal || 0,
          }));
          setTechnicians(migratedTechnicians);
          setTechCounter(migratedTechnicians.length);
        }

        if (data.jobDetails) {
          setJobDetails(data.jobDetails);
          setJobCounter(data.jobDetails.length);
        }
        if (data.travelHours) setTravelHours(data.travelHours);
        if (data.timesheetData) setTimesheetData(data.timesheetData);
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    }
  };

  const addTechnician = () => {
    const newId = `tech-${techCounter + 1}`;
    const newTech: Technician = {
      id: newId,
      name: "",
      hours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
      travelHours: { mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0, sun: 0 },
      total: 0,
      travelTotal: 0,
    };
    setTechnicians((prev) => [...prev, newTech]);
    setTechCounter((prev) => prev + 1);
  };

  const removeTechnician = (id: string) => {
    if (technicians.length <= 1) {
      alert("You must have at least one technician.");
      return;
    }
    if (confirm("Are you sure you want to remove this technician?")) {
      setTechnicians((prev) => prev.filter((tech) => tech.id !== id));
    }
  };

  const updateTechnicianName = (id: string, name: string) => {
    setTechnicians((prev) =>
      prev.map((tech) => (tech.id === id ? { ...tech, name } : tech)),
    );
  };

  const updateTechnicianHours = (
    id: string,
    day: keyof TravelHours,
    hours: number,
  ) => {
    setTechnicians((prev) =>
      prev.map((tech) => {
        if (tech.id === id) {
          const newHours = { ...tech.hours, [day]: hours };
          const total = Object.values(newHours).reduce((sum, h) => sum + h, 0);
          return { ...tech, hours: newHours, total };
        }
        return tech;
      }),
    );
  };

  const updateTechnicianTravelHours = (
    id: string,
    day: keyof TravelHours,
    hours: number,
  ) => {
    setTechnicians((prev) =>
      prev.map((tech) => {
        if (tech.id === id) {
          const newTravelHours = { ...tech.travelHours, [day]: hours };
          const travelTotal = Object.values(newTravelHours).reduce(
            (sum, h) => sum + h,
            0,
          );
          return { ...tech, travelHours: newTravelHours, travelTotal };
        }
        return tech;
      }),
    );
  };

  const updateTravelHours = (day: keyof TravelHours, hours: number) => {
    setTravelHours((prev) => ({ ...prev, [day]: hours }));
  };

  const addJobDetail = () => {
    const newId = `job-${jobCounter + 1}`;
    const newJob: JobDetail = {
      id: newId,
      workDescription: "",
      equipment: "",
      materials: "",
      quantity: 0,
    };
    setJobDetails((prev) => [...prev, newJob]);
    setJobCounter((prev) => prev + 1);
  };

  const removeJobDetail = (id: string) => {
    setJobDetails((prev) => prev.filter((job) => job.id !== id));
  };

  const updateJobDetail = (
    id: string,
    field: keyof JobDetail,
    value: string | number,
  ) => {
    setJobDetails((prev) =>
      prev.map((job) => (job.id === id ? { ...job, [field]: value } : job)),
    );
  };

  const updateTimesheetData = (field: keyof TimesheetData, value: string) => {
    setTimesheetData((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate totals
  const totalRegularHours = technicians.reduce(
    (sum, tech) => sum + tech.total,
    0,
  );
  const totalTravelHours = technicians.reduce(
    (sum, tech) => sum + tech.travelTotal,
    0,
  );
  const grandTotalHours = totalRegularHours + totalTravelHours;
  const totalTechnicians = technicians.filter((tech) => tech.total > 0).length;

  const saveCopy = () => {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const timeStr = now.toTimeString().slice(0, 5).replace(":", "");
    const jobNum = timesheetData.jobNumber || "NoJob";
    const filename = `Timesheet_${jobNum}_${dateStr}_${timeStr}.html`;

    // Create a complete HTML document with inline styles
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Corda Vertical Traveler Timesheet - ${timesheetData.jobNumber || "Job"} - ${timesheetData.date}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f7fa; padding: 20px; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden; }
        .header { background: linear-gradient(135deg, #2c5aa0, #1e4080); color: white; padding: 30px; text-align: center; }
        .header h1 { font-size: 2rem; margin-bottom: 10px; }
        .header-info { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
        .info-card { background: rgba(255,255,255,0.1); padding: 15px; border-radius: 8px; }
        .info-card label { font-weight: 600; display: block; margin-bottom: 5px; }
        .info-value { background: white; color: black; padding: 8px; border-radius: 4px; }
        .content { padding: 30px; }
        .section { margin-bottom: 40px; background: #f8fafc; padding: 25px; border-radius: 10px; border-left: 4px solid #2c5aa0; }
        .section-title { font-size: 1.3rem; color: #2c5aa0; margin-bottom: 20px; font-weight: 600; }
        .form-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .form-group label { font-weight: 600; color: #374151; margin-bottom: 8px; display: block; }
        .form-value { background: white; padding: 12px; border: 2px solid #e5e7eb; border-radius: 8px; min-height: 44px; }
        .time-grid { display: grid; grid-template-columns: 200px repeat(7, 1fr) auto; gap: 10px; align-items: center; margin-bottom: 15px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .time-header { font-weight: 600; color: #374151; text-align: center; padding: 10px; background: #f3f4f6; border-radius: 6px; }
        .tech-name { font-weight: 600; color: #2c5aa0; padding: 10px; background: #f0f4f8; border-radius: 6px; }
        .time-cell { text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px; }
        .total-cell { font-weight: 600; color: #059669; text-align: center; padding: 8px; background: #ecfdf5; border-radius: 6px; }
        .travel-section { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; }
        .travel-header { font-weight: 600; color: #92400e; margin-bottom: 15px; }
        .job-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
        .job-table th, .job-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .job-table th { background: #f9fafb; font-weight: 600; color: #374151; }
        .summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 30px; }
        .summary-card { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .summary-card h3 { font-size: 2rem; margin-bottom: 5px; }
        .signature-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 30px; margin-top: 30px; padding-top: 30px; border-top: 2px solid #e5e7eb; }
        .signature-box { text-align: center; padding: 20px; border: 2px dashed #d1d5db; border-radius: 8px; background: #fafafa; min-height: 100px; }
        @media print { body { background: white !important; padding: 10px !important; } .container { box-shadow: none !important; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>CORDA VERTICAL TRAVELER</h1>
            <div class="header-info">
                <div class="info-card">
                    <label>Date:</label>
                    <div class="info-value">${timesheetData.date}</div>
                </div>
                <div class="info-card">
                    <label>Job Number:</label>
                    <div class="info-value">${timesheetData.jobNumber}</div>
                </div>
                <div class="info-card">
                    <label>WO Number:</label>
                    <div class="info-value">${timesheetData.woNumber}</div>
                </div>
                <div class="info-card">
                    <label>CO Number:</label>
                    <div class="info-value">${timesheetData.coNumber}</div>
                </div>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <div class="section-title">Client & Location Information</div>
                <div class="form-grid">
                    <div class="form-group">
                        <label>Client:</label>
                        <div class="form-value">${timesheetData.client}</div>
                    </div>
                    <div class="form-group">
                        <label>Billing Address:</label>
                        <div class="form-value">${timesheetData.billingAddress.replace(/\n/g, "<br>")}</div>
                    </div>
                    <div class="form-group">
                        <label>Location:</label>
                        <div class="form-value">${timesheetData.location.replace(/\n/g, "<br>")}</div>
                    </div>
                    <div class="form-group">
                        <label>Contact:</label>
                        <div class="form-value">${timesheetData.contact}</div>
                    </div>
                    <div class="form-group">
                        <label>Contact Phone:</label>
                        <div class="form-value">${timesheetData.contactPhone}</div>
                    </div>
                    <div class="form-group">
                        <label>Job Description:</label>
                        <div class="form-value">${timesheetData.jobDescription}</div>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Time Tracking</div>

                <div class="time-grid">
                    <div class="time-header">Technician</div>
                    <div class="time-header">Mon</div>
                    <div class="time-header">Tue</div>
                    <div class="time-header">Wed</div>
                    <div class="time-header">Thu</div>
                    <div class="time-header">Fri</div>
                    <div class="time-header">Sat</div>
                    <div class="time-header">Sun</div>
                    <div class="time-header">Total</div>
                </div>

                ${technicians
                  .map(
                    (tech) => `
                <div class="time-grid">
                    <div class="tech-name">${tech.name || "Unnamed Technician"}</div>
                    <div class="time-cell">${tech.hours.mon || "0"}</div>
                    <div class="time-cell">${tech.hours.tue || "0"}</div>
                    <div class="time-cell">${tech.hours.wed || "0"}</div>
                    <div class="time-cell">${tech.hours.thu || "0"}</div>
                    <div class="time-cell">${tech.hours.fri || "0"}</div>
                    <div class="time-cell">${tech.hours.sat || "0"}</div>
                    <div class="time-cell">${tech.hours.sun || "0"}</div>
                    <div class="total-cell">${tech.total.toFixed(1)}</div>
                </div>
                `,
                  )
                  .join("")}

                <div class="travel-section">
                    <div class="travel-header">Travel Time</div>
                    ${technicians
                      .map(
                        (tech) => `
                    <div class="time-grid">
                        <div style="font-weight: 600; color: #92400e;">${tech.name || "Unnamed"} (Travel)</div>
                        <div class="time-cell" style="color: #92400e;">${tech.travelHours.mon || "0"}</div>
                        <div class="time-cell" style="color: #92400e;">${tech.travelHours.tue || "0"}</div>
                        <div class="time-cell" style="color: #92400e;">${tech.travelHours.wed || "0"}</div>
                        <div class="time-cell" style="color: #92400e;">${tech.travelHours.thu || "0"}</div>
                        <div class="time-cell" style="color: #92400e;">${tech.travelHours.fri || "0"}</div>
                        <div class="time-cell" style="color: #92400e;">${tech.travelHours.sat || "0"}</div>
                        <div class="time-cell" style="color: #92400e;">${tech.travelHours.sun || "0"}</div>
                        <div class="total-cell" style="color: #92400e;">${tech.travelTotal.toFixed(1)}</div>
                    </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            ${
              jobDetails.length > 0
                ? `
            <div class="section">
                <div class="section-title">Job Details & Equipment</div>
                <table class="job-table">
                    <thead>
                        <tr>
                            <th>Work Description</th>
                            <th>Equipment</th>
                            <th>Materials</th>
                            <th>Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${jobDetails
                          .map(
                            (job) => `
                        <tr>
                            <td>${job.workDescription}</td>
                            <td>${job.equipment}</td>
                            <td>${job.materials}</td>
                            <td>${job.quantity}</td>
                        </tr>
                        `,
                          )
                          .join("")}
                    </tbody>
                </table>
            </div>
            `
                : ""
            }

            <div class="summary-cards">
                <div class="summary-card">
                    <h3>${totalRegularHours.toFixed(1)}</h3>
                    <p>Regular Hours</p>
                </div>
                <div class="summary-card">
                    <h3>${totalTravelHours.toFixed(1)}</h3>
                    <p>Travel Hours</p>
                </div>
                <div class="summary-card">
                    <h3>${grandTotalHours.toFixed(1)}</h3>
                    <p>Total Hours</p>
                </div>
                <div class="summary-card">
                    <h3>${totalTechnicians}</h3>
                    <p>Technicians</p>
                </div>
            </div>

            ${
              timesheetData.notes
                ? `
            <div class="section">
                <div class="section-title">Notes</div>
                <div class="form-value">${timesheetData.notes.replace(/\n/g, "<br>")}</div>
            </div>
            `
                : ""
            }

            <div class="signature-section">
                <div class="signature-box">
                    <h4>Technician Signature</h4>
                    <p style="margin-top: 60px;">Date: ________________</p>
                </div>
                <div class="signature-box">
                    <h4>Supervisor Signature</h4>
                    <p style="margin-top: 60px;">Date: ________________</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    alert(`Timesheet saved as: ${filename}`);
  };

  const clearForm = () => {
    if (
      confirm(
        "Are you sure you want to clear all data and start a new timesheet?",
      )
    ) {
      setTechnicians([]);
      setJobDetails([]);
      setTravelHours({
        mon: 0,
        tue: 0,
        wed: 0,
        thu: 0,
        fri: 0,
        sat: 0,
        sun: 0,
      });
      setTimesheetData({
        date: new Date().toISOString().slice(0, 10),
        jobNumber: "",
        woNumber: "",
        coNumber: "",
        client: "",
        billingAddress: "",
        location: "",
        contact: "",
        contactPhone: "",
        jobDescription: "",
        notes: "",
      });
      setTechCounter(0);
      setJobCounter(0);
      localStorage.removeItem("timesheetData");

      // Re-add initial items
      setTimeout(() => {
        addTechnician();
        addJobDetail();
      }, 100);
    }
  };

  const installPWA = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowInstallButton(false);
        setDeferredPrompt(null);
      }
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("CORDA VERTICAL TRAVELER", pageWidth / 2, yPosition, {
      align: "center",
    });
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("TIMESHEET", pageWidth / 2, yPosition, { align: "center" });
    yPosition += 15;

    // Job Information
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("JOB INFORMATION", margin, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    const jobInfo = [
      [`Date: ${timesheetData.date}`, `Job #: ${timesheetData.jobNumber}`],
      [`WO #: ${timesheetData.woNumber}`, `CO #: ${timesheetData.coNumber}`],
      [`Client: ${timesheetData.client}`, `Contact: ${timesheetData.contact}`],
      [
        `Location: ${timesheetData.location}`,
        `Phone: ${timesheetData.contactPhone}`,
      ],
    ];

    jobInfo.forEach(([left, right]) => {
      doc.text(left, margin, yPosition);
      doc.text(right, pageWidth / 2, yPosition);
      yPosition += 6;
    });

    yPosition += 5;

    // Time Tracking Table
    doc.setFont("helvetica", "bold");
    doc.text("TIME TRACKING", margin, yPosition);
    yPosition += 8;

    // Table headers
    const colWidth = contentWidth / 9;
    const headers = [
      "Technician",
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Sat",
      "Sun",
      "Total",
    ];

    doc.setFontSize(8);
    headers.forEach((header, index) => {
      doc.text(header, margin + index * colWidth, yPosition);
    });
    yPosition += 5;

    // Draw header line
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 3;

    // Technician rows
    doc.setFont("helvetica", "normal");
    technicians.forEach((tech, techIndex) => {
      const rowData = [
        tech.name || "Unnamed",
        tech.hours.mon.toString(),
        tech.hours.tue.toString(),
        tech.hours.wed.toString(),
        tech.hours.thu.toString(),
        tech.hours.fri.toString(),
        tech.hours.sat.toString(),
        tech.hours.sun.toString(),
        tech.total.toFixed(1),
      ];

      rowData.forEach((data, index) => {
        doc.text(data, margin + index * colWidth, yPosition);
      });
      yPosition += 5;

      // Add border line between workers (except after the last one)
      if (techIndex < technicians.length - 1) {
        doc.setDrawColor(200, 200, 200); // Light gray color
        doc.line(margin, yPosition - 8, pageWidth - margin, yPosition - 8);
      }
    });

    // Travel time
    yPosition += 8;
    doc.setFont("helvetica", "bold");
    doc.text("TRAVEL TIME", margin, yPosition);
    yPosition += 8;

    // Travel time headers
    doc.setFontSize(8);
    headers.forEach((header, index) => {
      doc.text(header, margin + index * colWidth, yPosition);
    });
    yPosition += 5;

    // Draw travel header line
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // Travel time rows for each technician
    doc.setFont("helvetica", "normal");
    technicians.forEach((tech, techIndex) => {
      const travelData = [
        (tech.name || "Unnamed") + " (Travel)",
        tech.travelHours.mon.toString(),
        tech.travelHours.tue.toString(),
        tech.travelHours.wed.toString(),
        tech.travelHours.thu.toString(),
        tech.travelHours.fri.toString(),
        tech.travelHours.sat.toString(),
        tech.travelHours.sun.toString(),
        tech.travelTotal.toFixed(1),
      ];

      travelData.forEach((data, index) => {
        doc.text(data, margin + index * colWidth, yPosition);
      });
      yPosition += 5;

      // Add border line between workers (except after the last one)

      doc.setDrawColor(200, 200, 200); // Light gray color
      doc.line(margin, yPosition - 8, pageWidth - margin, yPosition - 8);
    });
    yPosition += 8;

    // Summary
    doc.setFont("helvetica", "bold");
    doc.text("SUMMARY", margin, yPosition);
    yPosition += 8;

    doc.setFont("helvetica", "normal");
    doc.text(
      `Regular Hours: ${totalRegularHours.toFixed(1)}`,
      margin,
      yPosition,
    );
    doc.text(
      `Travel Hours: ${totalTravelHours.toFixed(1)}`,
      pageWidth / 2,
      yPosition,
    );
    yPosition += 6;
    doc.text(`Total Hours: ${grandTotalHours.toFixed(1)}`, margin, yPosition);
    doc.text(`Technicians: ${totalTechnicians}`, pageWidth / 2, yPosition);
    yPosition += 10;

    // Equipment/Job Details (if any)
    if (jobDetails.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("EQUIPMENT & MATERIALS", margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      jobDetails.forEach((job, index) => {
        if (yPosition > pageHeight - 30) return; // Stop if near page bottom

        const details = [
          job.equipment ? `Equipment: ${job.equipment}` : "",
          job.workDescription ? `Description: ${job.workDescription}` : "",
          job.materials ? `Materials: ${job.materials}` : "",
          job.quantity ? `Quantity: ${job.quantity}` : "",
        ]
          .filter(Boolean)
          .join(" | ");

        if (details) {
          doc.text(`${index + 1}. ${details}`, margin, yPosition);
          yPosition += 5;
        }
      });
      yPosition += 5;
    }

    // Notes
    if (timesheetData.notes && yPosition < pageHeight - 30) {
      doc.setFont("helvetica", "bold");
      doc.text("NOTES", margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      const notes = timesheetData.notes.split("\n");
      notes.forEach((note) => {
        if (yPosition > pageHeight - 20) return;
        doc.text(note, margin, yPosition);
        yPosition += 5;
      });
    }

    // Signature lines at bottom
    const signatureY = pageHeight - 40;
    doc.line(margin, signatureY, margin + 80, signatureY);
    doc.line(
      pageWidth - margin - 80,
      signatureY,
      pageWidth - margin,
      signatureY,
    );

    doc.setFontSize(8);
    doc.text("Technician Signature", margin, signatureY + 5);
    doc.text("Date: ___________", margin, signatureY + 10);
    doc.text("Supervisor Signature", pageWidth - margin - 80, signatureY + 5);
    doc.text("Date: ___________", pageWidth - margin - 80, signatureY + 10);

    // Save the PDF
    const filename = `Timesheet_${timesheetData.jobNumber || "NoJob"}_${timesheetData.date}.pdf`;
    doc.save(filename);
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        background: "#f5f7fa",
        padding: "20px",
        lineHeight: "1.6",
      }}
    >
      <div className="timesheet-container">
        {/* Header */}
        <div className="timesheet-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h1>CORDA VERTICAL TRAVELER</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {showInstallButton && (
                <button
                  onClick={installPWA}
                  style={{
                    background: "#3b82f6",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  📱 Install App
                </button>
              )}
              {!isOnline && (
                <span
                  style={{
                    background: "#ef4444",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  📶 OFFLINE
                </span>
              )}
              {isOnline && (
                <span
                  style={{
                    background: "#10b981",
                    color: "white",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  ✓ ONLINE
                </span>
              )}
            </div>
          </div>
          <div className="timesheet-header-info">
            <div className="timesheet-info-card">
              <label className="timesheet-label">Date:</label>
              <input
                type="date"
                className="timesheet-input"
                value={timesheetData.date}
                onChange={(e) => updateTimesheetData("date", e.target.value)}
              />
            </div>
            <div className="timesheet-info-card">
              <label className="timesheet-label">Job Number:</label>
              <input
                type="text"
                className="timesheet-input"
                value={timesheetData.jobNumber}
                onChange={(e) =>
                  updateTimesheetData("jobNumber", e.target.value)
                }
              />
            </div>
            <div className="timesheet-info-card">
              <label className="timesheet-label">WO Number:</label>
              <input
                type="text"
                className="timesheet-input"
                value={timesheetData.woNumber}
                onChange={(e) =>
                  updateTimesheetData("woNumber", e.target.value)
                }
              />
            </div>
            <div className="timesheet-info-card">
              <label className="timesheet-label">CO Number:</label>
              <input
                type="text"
                className="timesheet-input"
                value={timesheetData.coNumber}
                onChange={(e) =>
                  updateTimesheetData("coNumber", e.target.value)
                }
              />
            </div>
          </div>
        </div>

        <div className="timesheet-content">
          {/* Client & Location Information */}
          <div className="timesheet-section">
            <div className="timesheet-section-title">
              Client & Location Information
            </div>
            <div className="timesheet-form-grid">
              <div className="timesheet-form-group">
                <label className="timesheet-label">Client:</label>
                <input
                  type="text"
                  className="timesheet-input"
                  value={timesheetData.client}
                  onChange={(e) =>
                    updateTimesheetData("client", e.target.value)
                  }
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Billing Address:</label>
                <textarea
                  className="timesheet-textarea"
                  value={timesheetData.billingAddress}
                  onChange={(e) =>
                    updateTimesheetData("billingAddress", e.target.value)
                  }
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Location:</label>
                <textarea
                  className="timesheet-textarea"
                  value={timesheetData.location}
                  onChange={(e) =>
                    updateTimesheetData("location", e.target.value)
                  }
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Contact:</label>
                <input
                  type="text"
                  className="timesheet-input"
                  value={timesheetData.contact}
                  onChange={(e) =>
                    updateTimesheetData("contact", e.target.value)
                  }
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Contact Phone:</label>
                <input
                  type="tel"
                  className="timesheet-input"
                  value={timesheetData.contactPhone}
                  onChange={(e) =>
                    updateTimesheetData("contactPhone", e.target.value)
                  }
                />
              </div>
              <div className="timesheet-form-group">
                <label className="timesheet-label">Job Description:</label>
                <input
                  type="text"
                  className="timesheet-input"
                  value={timesheetData.jobDescription}
                  onChange={(e) =>
                    updateTimesheetData("jobDescription", e.target.value)
                  }
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
                    onChange={(e) =>
                      updateTechnicianName(tech.id, e.target.value)
                    }
                    style={{
                      border: "none",
                      background: "transparent",
                      fontWeight: "600",
                      color: "var(--timesheet-primary)",
                      width: "100%",
                    }}
                  />
                  {technicians.length > 1 && (
                    <button
                      onClick={() => removeTechnician(tech.id)}
                      className="timesheet-remove-btn"
                      style={{ marginTop: "5px" }}
                    >
                      Remove
                    </button>
                  )}
                </div>
                {(
                  ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
                ).map((day) => (
                  <input
                    key={day}
                    type="number"
                    step="0.5"
                    min="0"
                    className="timesheet-time-input"
                    value={tech.hours[day] || ""}
                    onChange={(e) =>
                      updateTechnicianHours(
                        tech.id,
                        day,
                        parseFloat(e.target.value) || 0,
                      )
                    }
                  />
                ))}
                <div className="timesheet-total-cell">
                  {tech.total.toFixed(1)}
                </div>
              </div>
            ))}

            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <button className="timesheet-add-btn" onClick={addTechnician}>
                + Add Technician
              </button>
            </div>

            {/* Travel Time Section */}
            <div className="timesheet-travel-section">
              <h4 style={{ marginBottom: "15px", color: "#92400e" }}>
                Travel Time
              </h4>

              {/* Travel Header Row */}
              <div className="timesheet-time-grid">
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Technician
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Mon
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Tue
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Wed
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Thu
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Fri
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Sat
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Sun
                </div>
                <div
                  className="timesheet-time-header"
                  style={{ color: "#92400e" }}
                >
                  Total
                </div>
              </div>

              {/* Travel Time Rows - one for each technician */}
              {technicians.map((tech) => (
                <div key={`travel-${tech.id}`} className="timesheet-time-grid">
                  <div
                    className="timesheet-tech-name"
                    style={{ color: "#92400e", fontWeight: "600" }}
                  >
                    {tech.name || "Unnamed"} (Travel)
                  </div>
                  {(
                    ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const
                  ).map((day) => (
                    <input
                      key={day}
                      type="number"
                      step="0.5"
                      min="0"
                      className="timesheet-time-input"
                      style={{ borderColor: "#92400e" }}
                      value={tech.travelHours[day] || ""}
                      onChange={(e) =>
                        updateTechnicianTravelHours(
                          tech.id,
                          day,
                          parseFloat(e.target.value) || 0,
                        )
                      }
                    />
                  ))}
                  <div
                    className="timesheet-total-cell"
                    style={{ color: "#92400e" }}
                  >
                    {tech.travelTotal.toFixed(1)}
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: "10px",
                  textAlign: "right",
                  fontWeight: "600",
                  color: "#92400e",
                }}
              >
                Total Travel:{" "}
                {technicians
                  .reduce((sum, tech) => sum + tech.travelTotal, 0)
                  .toFixed(1)}{" "}
                hours
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="timesheet-section">
            <div className="timesheet-section-title">
              Job Details & Equipment
            </div>
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
                          style={{
                            width: "100%",
                            border: "none",
                            padding: "5px",
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="ID#"
                          value={job.equipment}
                          onChange={(e) =>
                            updateJobDetail(job.id, "equipment", e.target.value)
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            padding: "5px",
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Equipment description"
                          value={job.workDescription}
                          onChange={(e) =>
                            updateJobDetail(
                              job.id,
                              "workDescription",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            padding: "5px",
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Size"
                          value={job.materials}
                          onChange={(e) =>
                            updateJobDetail(job.id, "materials", e.target.value)
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            padding: "5px",
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          placeholder="Qty"
                          value={job.quantity || ""}
                          onChange={(e) =>
                            updateJobDetail(
                              job.id,
                              "quantity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          style={{
                            width: "100%",
                            border: "none",
                            padding: "5px",
                          }}
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
                style={{ background: "#059669", marginLeft: "10px" }}
              >
                💾 Save Copy
              </button>
              <button
                className="timesheet-add-btn"
                onClick={exportToPDF}
                style={{ background: "#3b82f6", marginLeft: "10px" }}
              >
                📄 Export PDF
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
                onChange={(e) => updateTimesheetData("notes", e.target.value)}
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
              <div style={{ margin: "20px 0" }}>
                <input
                  type="text"
                  placeholder="Print Name"
                  className="timesheet-input"
                  style={{ marginBottom: "10px" }}
                />
                <input type="date" className="timesheet-input" />
              </div>
            </div>
            <div className="timesheet-signature-box">
              <h4>Client Representative</h4>
              <div style={{ margin: "20px 0" }}>
                <input
                  type="text"
                  placeholder="Print Name"
                  className="timesheet-input"
                  style={{ marginBottom: "10px" }}
                />
                <input type="date" className="timesheet-input" />
              </div>
            </div>
            <div className="timesheet-signature-box">
              <h4>Management Review</h4>
              <div style={{ margin: "20px 0" }}>
                <input
                  type="text"
                  placeholder="Print Name"
                  className="timesheet-input"
                  style={{ marginBottom: "10px" }}
                />
                <input type="date" className="timesheet-input" />
              </div>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "30px",
              paddingTop: "20px",
              borderTop: "2px solid #e5e7eb",
            }}
          >
            <button
              className="timesheet-add-btn"
              onClick={clearForm}
              style={{ background: "#ef4444", color: "white" }}
            >
              🗑️ Clear Form & Start New
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
