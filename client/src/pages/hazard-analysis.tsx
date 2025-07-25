import { useState, useEffect } from "react";

interface RopeAccessData {
  appropriateEquipment: boolean;
  ropeTransfers: boolean;
  deviationReAnchor: boolean;
  walkingAidClimbing: boolean;
  suspendedAidClimbing: boolean;
}

interface RiggingData {
  riggingPlan: string;
  anchorageType: string;
  anchorage5000lbs: string;
  anchorSystem: string;
  deviationReAnchor: string;
  stopperKnots: string;
  sentryRequired: string;
  ropeHazards: string;
  removalOfHazard: {
    deEnergize: boolean;
    reSchedule: boolean;
    other: boolean;
    otherDetails: string;
  };
  avoidHazard: {
    barrier: boolean;
    reAnchor: boolean;
    deviation: boolean;
    yAnchor: boolean;
    other: boolean;
    otherDetails: string;
  };
  ropeHazardProtection: {
    iceTray: boolean;
    throughGrate: boolean;
    engineered: boolean;
    fabric: boolean;
    roller: boolean;
    other: boolean;
    otherDetails: string;
  };
  equipmentDropProof: {
    lanyard: boolean;
    separateRope: boolean;
    bagged: boolean;
    other: boolean;
    otherDetails: string;
  };
}

interface RescueData {
  appropriatePersonnel: string;
  communicationMethods: {
    verbal: boolean;
    radio: boolean;
    handSignal: boolean;
  };
  designatedSafeZone: string;
  simpleIntervention: string;
  remoteRescueComplex: string;
  complexIntervention: string;
  rescuePlan: string;
}

export default function HazardAnalysisPage() {
  const [ropeAccessData, setRopeAccessData] = useState<RopeAccessData>({
    appropriateEquipment: false,
    ropeTransfers: false,
    deviationReAnchor: false,
    walkingAidClimbing: false,
    suspendedAidClimbing: false,
  });

  const [riggingData, setRiggingData] = useState<RiggingData>({
    riggingPlan: '',
    anchorageType: '',
    anchorage5000lbs: '',
    anchorSystem: '',
    deviationReAnchor: '',
    stopperKnots: '',
    sentryRequired: '',
    ropeHazards: '',
    removalOfHazard: {
      deEnergize: false,
      reSchedule: false,
      other: false,
      otherDetails: '',
    },
    avoidHazard: {
      barrier: false,
      reAnchor: false,
      deviation: false,
      yAnchor: false,
      other: false,
      otherDetails: '',
    },
    ropeHazardProtection: {
      iceTray: false,
      throughGrate: false,
      engineered: false,
      fabric: false,
      roller: false,
      other: false,
      otherDetails: '',
    },
    equipmentDropProof: {
      lanyard: false,
      separateRope: false,
      bagged: false,
      other: false,
      otherDetails: '',
    },
  });

  const [rescueData, setRescueData] = useState<RescueData>({
    appropriatePersonnel: '',
    communicationMethods: {
      verbal: false,
      radio: false,
      handSignal: false,
    },
    designatedSafeZone: '',
    simpleIntervention: '',
    remoteRescueComplex: '',
    complexIntervention: '',
    rescuePlan: '',
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSave = () => {
      const data = {
        ropeAccessData,
        riggingData,
        rescueData,
      };
      localStorage.setItem('ropeAccessHazardAnalysis', JSON.stringify(data));
    };

    const interval = setInterval(autoSave, 30000);
    return () => clearInterval(interval);
  }, [ropeAccessData, riggingData, rescueData]);

  // Load saved data
  useEffect(() => {
    const savedData = localStorage.getItem('ropeAccessHazardAnalysis');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        if (data.ropeAccessData) setRopeAccessData(data.ropeAccessData);
        if (data.riggingData) setRiggingData(data.riggingData);
        if (data.rescueData) setRescueData(data.rescueData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const exportToPDF = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Export Controls */}
      <div className="fixed top-20 right-4 bg-white p-3 rounded-lg shadow-lg z-10 print:hidden">
        <button
          onClick={exportToPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded mr-2 hover:bg-blue-700"
        >
          Export PDF
        </button>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print
        </button>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-800 text-white text-center py-5">
          <h1 className="text-2xl font-bold">
            LeNDT<br />
            Rope Access Hazard Analysis
          </h1>
        </div>

        {/* Rope Access Section */}
        <div className="border-2 border-blue-800">
          <div className="bg-blue-800 text-white text-center py-2 font-bold text-lg">
            ROPE ACCESS
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold text-center w-1/4">
                    Methods of Access
                  </th>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold text-center w-1/6">
                    Comments
                  </th>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold text-center w-2/5">
                    Item
                  </th>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold text-center w-1/6">
                    Comments:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Appropriate equipment</td>
                  <td className="border border-blue-800 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={ropeAccessData.appropriateEquipment}
                      onChange={(e) =>
                        setRopeAccessData(prev => ({ ...prev, appropriateEquipment: e.target.checked }))
                      }
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Fall arrest/ Restraint/ Protection</td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Rope transfers</td>
                  <td className="border border-blue-800 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={ropeAccessData.ropeTransfers}
                      onChange={(e) =>
                        setRopeAccessData(prev => ({ ...prev, ropeTransfers: e.target.checked }))
                      }
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Horizontal lines</td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Deviation/Re-Anchor/Passing-Knots</td>
                  <td className="border border-blue-800 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={ropeAccessData.deviationReAnchor}
                      onChange={(e) =>
                        setRopeAccessData(prev => ({ ...prev, deviationReAnchor: e.target.checked }))
                      }
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Lead Climbing (specific access plan required)</td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Walking Aid Climbing / Pipe Rack</td>
                  <td className="border border-blue-800 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={ropeAccessData.walkingAidClimbing}
                      onChange={(e) =>
                        setRopeAccessData(prev => ({ ...prev, walkingAidClimbing: e.target.checked }))
                      }
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Alternate access method</td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold">Suspended Aid Climbing</td>
                  <td className="border border-blue-800 p-3 text-center">
                    <input
                      type="checkbox"
                      checked={ropeAccessData.suspendedAidClimbing}
                      onChange={(e) =>
                        setRopeAccessData(prev => ({ ...prev, suspendedAidClimbing: e.target.checked }))
                      }
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold"></td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Rigging Section */}
        <div className="border-2 border-blue-800 mt-0">
          <div className="bg-blue-800 text-white text-center py-2 font-bold text-lg">
            RIGGING
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold w-1/3">
                    Rigging Plan – Written or Diagram
                  </th>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold w-1/4">
                    Consideration
                  </th>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold w-5/12">
                    Comments:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={11} className="border border-blue-800 p-3 align-top">
                    <textarea
                      value={riggingData.riggingPlan}
                      onChange={(e) =>
                        setRiggingData(prev => ({ ...prev, riggingPlan: e.target.value }))
                      }
                      className="w-full border border-gray-300 p-2 rounded resize-vertical min-h-32"
                      placeholder="Describe rigging plan or attach diagram"
                      rows={8}
                    />
                  </td>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold text-center">Anchorage Type(s)</td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      value={riggingData.anchorageType}
                      onChange={(e) =>
                        setRiggingData(prev => ({ ...prev, anchorageType: e.target.value }))
                      }
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold text-center">Anchorage 5000lbs</td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      value={riggingData.anchorage5000lbs}
                      onChange={(e) =>
                        setRiggingData(prev => ({ ...prev, anchorage5000lbs: e.target.value }))
                      }
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
                {/* Continue with other rigging rows... */}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rescue Section */}
        <div className="border-2 border-blue-800 mt-0">
          <div className="bg-blue-800 text-white text-center py-2 font-bold text-lg">
            ROPE ACCESS RIGGING & RESCUE
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold w-1/4">
                    Appropriate Personnel / Rescue Equipment
                  </th>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold w-2/4" colSpan={2}>
                    Simple Remote Rescue- Rig for Rescue
                  </th>
                  <th className="bg-blue-800 text-white border border-blue-800 p-3 font-bold w-1/4">
                    Comments:
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={5} className="border border-blue-800 p-3 align-top">
                    <textarea
                      value={rescueData.appropriatePersonnel}
                      onChange={(e) =>
                        setRescueData(prev => ({ ...prev, appropriatePersonnel: e.target.value }))
                      }
                      className="w-full border border-gray-300 p-2 rounded resize-vertical min-h-32"
                      placeholder="List personnel and rescue equipment"
                      rows={8}
                    />
                  </td>
                  <td className="bg-gray-50 border border-blue-800 p-3 font-bold text-center">Communication Methods</td>
                  <td className="border border-blue-800 p-3">
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rescueData.communicationMethods.verbal}
                          onChange={(e) =>
                            setRescueData(prev => ({
                              ...prev,
                              communicationMethods: { ...prev.communicationMethods, verbal: e.target.checked }
                            }))
                          }
                          className="w-4 h-4"
                        />
                        Verbal
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rescueData.communicationMethods.radio}
                          onChange={(e) =>
                            setRescueData(prev => ({
                              ...prev,
                              communicationMethods: { ...prev.communicationMethods, radio: e.target.checked }
                            }))
                          }
                          className="w-4 h-4"
                        />
                        Radio
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={rescueData.communicationMethods.handSignal}
                          onChange={(e) =>
                            setRescueData(prev => ({
                              ...prev,
                              communicationMethods: { ...prev.communicationMethods, handSignal: e.target.checked }
                            }))
                          }
                          className="w-4 h-4"
                        />
                        Hand Signal
                      </label>
                    </div>
                  </td>
                  <td className="border border-blue-800 p-3">
                    <textarea
                      className="w-full border border-gray-300 p-2 rounded min-h-12 resize-vertical"
                      rows={2}
                    />
                  </td>
                </tr>
                {/* More rescue rows... */}
                <tr>
                  <td colSpan={4} className="bg-blue-800 text-white font-bold text-center p-3 text-lg">
                    Rescue Plan - Diagram or Written
                  </td>
                </tr>
                <tr>
                  <td colSpan={4} className="border border-blue-800 p-3">
                    <textarea
                      value={rescueData.rescuePlan}
                      onChange={(e) =>
                        setRescueData(prev => ({ ...prev, rescuePlan: e.target.value }))
                      }
                      className="w-full border border-gray-300 p-2 rounded resize-vertical"
                      style={{ height: '300px' }}
                      placeholder="Describe rescue plan or attach diagram"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}