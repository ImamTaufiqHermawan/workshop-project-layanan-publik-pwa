"use client";

import { useState } from "react";

export default function StatusCheckPage() {
  const [trackingCode, setTrackingCode] = useState("");
  const [submission, setSubmission] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!trackingCode.trim()) {
      setError("Masukkan tracking code");
      return;
    }

    setIsLoading(true);
    setError("");
    setSubmission(null);

    try {
      const response = await fetch(`/api/submissions/${trackingCode.trim()}`);
      const result = await response.json();

      if (response.ok) {
        setSubmission(result);
      } else {
        setError(result.message || "Tracking code tidak ditemukan");
      }
    } catch (error) {
      setError("Terjadi kesalahan jaringan");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENGAJUAN_BARU":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "DIPROSES":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "SELESAI":
        return "bg-green-100 text-green-800 border-green-200";
      case "DITOLAK":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PENGAJUAN_BARU":
        return "Pengajuan Baru";
      case "DIPROSES":
        return "Sedang Diproses";
      case "SELESAI":
        return "Selesai";
      case "DITOLAK":
        return "Ditolak";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Cek Status Pengajuan
            </h1>
            <p className="text-gray-600">
              Masukkan tracking code untuk melihat status pengajuan Anda
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex space-x-3">
              <input
                type="text"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                placeholder="Contoh: WS-1234567890-ABC123"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
              >
                {isLoading ? "Mencari..." : "Cek Status"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 border border-red-200 rounded-lg">
              {error}
            </div>
          )}

          {submission && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Detail Pengajuan
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tracking Code:</span>
                  <span className="font-mono font-semibold text-blue-600">
                    {submission.tracking_code}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Nama:</span>
                  <span className="font-medium">{submission.nama}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">NIK:</span>
                  <span className="font-mono">{submission.nik}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{submission.email}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">No. WhatsApp:</span>
                  <span className="font-medium">{submission.no_wa}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Jenis Layanan:</span>
                  <span className="font-medium">{submission.jenis_layanan}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(submission.status)}`}>
                    {getStatusText(submission.status)}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tanggal Pengajuan:</span>
                  <span className="font-medium">
                    {new Date(submission.created_at).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                {submission.updated_at !== submission.created_at && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Terakhir Diupdate:</span>
                    <span className="font-medium">
                      {new Date(submission.updated_at).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 text-center space-y-3">
            <a
              href="/public"
              className="block text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Buat Pengajuan Baru
            </a>
            <a
              href="/"
              className="block text-gray-600 hover:text-gray-800 text-sm"
            >
              ← Kembali ke Beranda
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
