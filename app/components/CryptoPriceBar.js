"use client";
import { useState, useEffect, useCallback } from "react";

export default function CryptoPriceBar() {
  const [showBar, setShowBar] = useState(false);
  const [cryptoData, setCryptoData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("uiSettings");
    if (saved) {
      const uiSettings = JSON.parse(saved);
      if (uiSettings.showCryptoBar) {
        setShowBar(true);
      }
    }
  }, []);

  const fetchData = useCallback(() => {
    fetch("https://api.coincap.io/v2/assets?limit=5")
      .then((response) => response.json())
      .then((data) => {
        setCryptoData(data.data);
      })
      .catch((error) => {
        console.error("Error fetching crypto data:", error);
      });
  }, []);

  useEffect(() => {
    if (!showBar) return;
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [showBar, fetchData]);

  if (!showBar) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#252422] text-[#fffcf2] p-2 text-sm z-50">
      <div className="container mx-auto flex justify-center space-x-4">
        {cryptoData.map((asset) => (
          <div key={asset.id}>
            <span className="font-bold">{asset.name}:</span> ${parseFloat(asset.priceUsd).toFixed(2)}
          </div>
        ))}
      </div>
    </div>
  );
}
