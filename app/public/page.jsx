"use client";

import { useState } from "react";
import { formatPhoneForInput, ensurePlus62Format } from "@/lib/phone";
import PWAInstallButton from "../components/PWAInstallButton";
import PhoneInput from "../components/PhoneInput";

export default function PublicPage() {
  const [formData, setFormData] = useState({
    nama: "",
    nik: "",
    email: "",
    no_wa: "+62",
    jenis_layanan: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      // Ensure phone number is in +62 format before sending
      const submissionData = {
        ...formData,
        no_wa: ensurePlus62Format(formData.no_wa)
      };

      console.log("Original phone:", formData.no_wa);
      console.log("Converted phone:", submissionData.no_wa);
      console.log("Submitting with phone:", submissionData.no_wa);

      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(`Pengajuan berhasil! Tracking Code: ${result.tracking_code}`);
        setFormData({
          nama: "",
          nik: "",
          email: "",
          no_wa: "+62",
          jenis_layanan: "",
          consent: false,
        });
      } else {
        setMessage(result.message || "Terjadi kesalahan");
      }
    } catch (error) {
      setMessage("Terjadi kesalahan jaringan");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Layanan Masyarakat
            </h1>
            <p className="text-gray-600">
              Silakan ajukan layanan yang Anda butuhkan
            </p>
          </div>

          {/* PWA Install Button */}
          <PWAInstallButton />

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes("berhasil") 
                ? "bg-green-100 text-green-800 border border-green-200" 
                : "bg-red-100 text-red-800 border border-red-200"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap *
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan nama lengkap"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIK *
              </label>
              <input
                type="text"
                required
                maxLength={16}
                value={formData.nik}
                onChange={(e) => setFormData(prev => ({ ...prev, nik: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan 16 digit NIK"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="contoh@email.com"
              />
            </div>

            <PhoneInput
              value={formData.no_wa}
              onChange={(value) => setFormData(prev => ({ ...prev, no_wa: value }))}
              required
              label="Nomor WhatsApp"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Layanan *
              </label>
              <select
                required
                value={formData.jenis_layanan}
                onChange={(e) => setFormData(prev => ({ ...prev, jenis_layanan: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih jenis layanan</option>
                <option value="KTP">Pembuatan KTP</option>
                <option value="KK">Pembuatan Kartu Keluarga</option>
                <option value="AKTA">Pembuatan Akta Kelahiran</option>
                <option value="SKCK">Pembuatan SKCK</option>
                <option value="IZIN_USAHA">Izin Usaha</option>
                <option value="LAINNYA">Lainnya</option>
              </select>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={(e) => setFormData(prev => ({ ...prev, consent: e.target.checked }))}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">
                Saya setuju dengan syarat dan ketentuan yang berlaku *
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mengirim...
                </>
              ) : (
                "Ajukan Layanan"
              )}
            </button>
          </form>

          <div className="mt-8 text-center space-y-3">
            <a
              href="/public/status"
              className="block text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Cek Status Pengajuan →
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
