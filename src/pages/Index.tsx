
import { useState } from "react";
import LocationAnalysisTab from "@/components/location-analysis/LocationAnalysisTab";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const Index = () => {
  const [activeTab, setActiveTab] = useState("location");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <Header /> */}
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
        <main className="flex-1 p-6">
          {activeTab === "location" && <LocationAnalysisTab />}
          {activeTab !== "location" && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <h2 className="text-xl font-medium text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Tab
              </h2>
              <p className="mt-2 text-gray-600">
                This tab is under construction.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
