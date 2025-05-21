import React from "react";

export default function AdminReports({ reports }) {
    return (
      <div>
        <h2 className="text-xl font-bold mb-2">Przegląd zgłoszeń</h2>
        {reports.length === 0 ? (
          <p>Brak zgłoszeń.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">ID zgłoszenia</th>
                <th className="border px-4 py-2">Typ treści</th>
                <th className="border px-4 py-2">ID treści</th>
                <th className="border px-4 py-2">ID zgłaszającego</th>
                <th className="border px-4 py-2">Powód</th>
                <th className="border px-4 py-2">Data zgłoszenia</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.id}>
                  <td className="border px-4 py-2">{report.id}</td>
                  <td className="border px-4 py-2">{report.contentType}</td>
                  <td className="border px-4 py-2">{report.contentId}</td>
                  <td className="border px-4 py-2">{report.reporterId}</td>
                  <td className="border px-4 py-2">{report.reason}</td>
                  <td className="border px-4 py-2">
                    {new Date(report.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
