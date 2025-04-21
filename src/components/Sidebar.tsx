
import { 
  Map, FileText, Building, DollarSign, Users, 
  CalendarClock, ChevronRight
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar = ({ activeTab, onTabChange }: SidebarProps) => {
  const tabs = [
    { id: "location", label: "Location", icon: <Map size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-6">
        <div className="flex items-center p-2 mb-2">
          <span className="text-sm font-medium text-gray-500">Deal #DC-2025-042</span>
        </div>
        {/* <div className="bg-gray-100 rounded-md p-3">
          <h2 className="text-lg font-medium text-gray-800">Oakridge Business Park</h2>
          <p className="text-sm text-gray-500">Portland, OR</p>
        </div> */}
      </div>

      <nav>
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.id}>
              <button
                className={`w-full flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onTabChange(tab.id)}
              >
                <div className="flex items-center">
                  <span className="mr-3">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </div>
                {activeTab === tab.id && <ChevronRight size={16} />}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
