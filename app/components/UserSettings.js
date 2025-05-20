"use client";
import { useReducer, useEffect, useCallback } from "react";

const initialSettings = {
  primaryColor: "#eb5e28",
  notifications: {
    friend_request: true,
    new_message: true,
    comment: true,
    like: true,
    group_invite: true,
  },
  showCryptoBar: false,
};

function settingsReducer(state, action) {
  switch (action.type) {
    case "LOAD_SETTINGS":
      return action.payload;
    case "SET_PRIMARY_COLOR":
      return { ...state, primaryColor: action.payload };
    case "TOGGLE_NOTIFICATION":
      return {
        ...state,
        notifications: {
          ...state.notifications,
          [action.payload.name]: action.payload.checked,
        },
      };
    case "SET_CRYPTO_BAR":
      return { ...state, showCryptoBar: action.payload };
    default:
      return state;
  }
}

export default function UserSettings() {
  const [settings, dispatch] = useReducer(settingsReducer, initialSettings);

  useEffect(() => {
    const saved = localStorage.getItem("uiSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      dispatch({ type: "LOAD_SETTINGS", payload: parsed });
      document.documentElement.style.setProperty("--primary-color", parsed.primaryColor);
    }
  }, []);

  const handlePrimaryColorChange = useCallback((e) => {
    const newColor = e.target.value;
    dispatch({ type: "SET_PRIMARY_COLOR", payload: newColor });
    document.documentElement.style.setProperty("--primary-color", newColor);
  }, []);

  const handleNotificationChange = useCallback((e) => {
    const { name, checked } = e.target;
    dispatch({ type: "TOGGLE_NOTIFICATION", payload: { name, checked } });
  }, []);

  const handleCryptoBarChange = useCallback((e) => {
    const { checked } = e.target;
    dispatch({ type: "SET_CRYPTO_BAR", payload: checked });
  }, []);

  const handleSave = useCallback(() => {
    localStorage.setItem("uiSettings", JSON.stringify(settings));
    alert("Ustawienia zapisane!");
  }, [settings]);

  return (
    <div className="p-4 border rounded bg-[#403d39] text-white">
      <h2 className="text-xl font-bold mb-4">Personalizacja interfejsu</h2>
      <div className="mb-4">
        <label htmlFor="primaryColor" className="block mb-1">
          Główny kolor strony:
        </label>
        <input
          type="color"
          id="primaryColor"
          value={settings.primaryColor}
          onChange={handlePrimaryColorChange}
        />
      </div>
      <div className="mb-4">
        <h3 className="font-bold mb-2">Powiadomienia:</h3>
        {Object.keys(settings.notifications).map((type) => (
          <div key={type}>
            <label>
              <input
                type="checkbox"
                name={type}
                checked={settings.notifications[type]}
                onChange={handleNotificationChange}
              />{" "}
              {type.replace("_", " ")}
            </label>
          </div>
        ))}
      </div>
      <div className="mb-4">
        <label>
          <input
            type="checkbox"
            checked={settings.showCryptoBar}
            onChange={handleCryptoBarChange}
          />{" "}
          Pokaż pasek z cenami kryptowalut
        </label>
      </div>
      <button onClick={handleSave} className="px-4 py-2 bg-green-500 text-white rounded">
        Zapisz ustawienia
      </button>
    </div>
  );
}
