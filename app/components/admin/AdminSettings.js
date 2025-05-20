import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState({
      siteName: "Scope App",
      maintenanceMode: false,
      allowRegister: true
    });
  
    useEffect(() => {
      const storedSettings = JSON.parse(localStorage.getItem("settings"));
      if (storedSettings) {
        setSettings(storedSettings);
      }
    }, []);
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setSettings((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    };
  
    const handleSave = () => {
      localStorage.setItem("settings", JSON.stringify(settings));
      alert("Ustawienia zapisane!");
    };
  
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">
          Ustawienia sieci społecznościowej
        </h2>
        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="block mb-1">Nazwa strony:</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="maintenanceMode"
                checked={settings.maintenanceMode}
                onChange={handleChange}
                className="mr-2"
              />
              Tryb konserwacji
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="allowRegister"
                checked={settings.allowRegister}
                onChange={handleChange}
                className="mr-2"
              />
              Zezwalaj na rejestrację nowych użytkowników
            </label>
          </div>
          <button
            onClick={handleSave}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Zapisz ustawienia
          </button>
        </div>
      </div>
    );
  }

