"use client";

import React, { useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  FileSpreadsheet,
  Download,
  MessageSquare,
  Clock,
  Building2,
  Mail,
  Phone,
  MapPin,
  Check,
  AlertCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Input";
import { getWhatsAppUrl } from "@/lib/utils";

interface RfqRequest {
  id: string;
  rfqNumber: string;
  customerName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  requestType: string;
  targetItem: string;
  quantity: string;
  specifications: string;
  deliveryLocation: string;
  targetDate: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  status: string;
  internalNotes: string | null;
  createdAt: string;
}

interface RfqManagerProps {
  initialRfqs: RfqRequest[];
}

export function RfqManager({ initialRfqs }: RfqManagerProps) {
  const [rfqs, setRfqs] = useState<RfqRequest[]>(initialRfqs);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [viewingRfq, setViewingRfq] = useState<RfqRequest | null>(null);

  // Status & Notes form inside modal
  const [currentStatus, setCurrentStatus] = useState("NEW");
  const [internalNotes, setInternalNotes] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  const filteredRfqs = rfqs.filter((r) => {
    const matchStatus = selectedStatus === "ALL" ? true : r.status === selectedStatus;
    const matchSearch =
      r.rfqNumber.toLowerCase().includes(search.toLowerCase()) ||
      r.customerName.toLowerCase().includes(search.toLowerCase()) ||
      r.companyName.toLowerCase().includes(search.toLowerCase()) ||
      r.targetItem.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const openDetailModal = (rfq: RfqRequest) => {
    setViewingRfq(rfq);
    setCurrentStatus(rfq.status);
    setInternalNotes(rfq.internalNotes || "");
    setUpdateMsg("");
  };

  const handleUpdateRfq = async () => {
    if (!viewingRfq) return;
    setIsUpdating(true);
    setUpdateMsg("");

    try {
      const res = await fetch("/api/admin/rfq", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: viewingRfq.id,
          status: currentStatus,
          internalNotes,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal memperbarui status RFQ");
      }

      // Update local state
      setRfqs(
        rfqs.map((r) =>
          r.id === viewingRfq.id
            ? { ...r, status: currentStatus, internalNotes }
            : r
        )
      );
      setViewingRfq({
        ...viewingRfq,
        status: currentStatus,
        internalNotes,
      });
      setUpdateMsg("Status dan catatan internal berhasil disimpan!");
    } catch (err: any) {
      alert(err.message || "Gagal update");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRfq = async (id: string) => {
    if (!confirm("Hapus data permohonan RFQ ini?")) return;

    try {
      const res = await fetch(`/api/admin/rfq?id=${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.message);

      setRfqs(rfqs.filter((r) => r.id !== id));
      if (viewingRfq?.id === id) setViewingRfq(null);
    } catch (err: any) {
      alert(err.message || "Gagal menghapus");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "NEW":
        return <Badge variant="warning">BARU (NEW)</Badge>;
      case "REVIEWED":
        return <Badge variant="blue">REVIEWED</Badge>;
      case "QUOTATION_PREPARED":
        return <Badge variant="gold">SPH DISIAPKAN</Badge>;
      case "SENT":
        return <Badge variant="outline">TERKIRIM</Badge>;
      case "APPROVED":
        return <Badge variant="success">DISETUJUI</Badge>;
      case "REJECTED":
        return <Badge variant="danger">DITOLAK</Badge>;
      case "COMPLETED":
        return <Badge variant="success">SELESAI</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-corporate-navy">
          Manajemen Permintaan Penawaran (RFQ)
        </h1>
        <p className="text-xs text-gray-500">
          Pantau alur tender dan penerbitan Surat Penawaran Harga (SPH) dari calon pelanggan korporasi
        </p>
      </div>

      {/* Filter and Search */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari Nomor RFQ, Nama, atau Perusahaan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-corporate-blue/20"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {[
            { label: "Semua", value: "ALL" },
            { label: "Baru", value: "NEW" },
            { label: "Reviewed", value: "REVIEWED" },
            { label: "SPH Siap", value: "QUOTATION_PREPARED" },
            { label: "Terkirim", value: "SENT" },
            { label: "Disetujui", value: "APPROVED" },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedStatus === tab.value
                  ? "bg-corporate-navy text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* RFQ Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-corporate-light-gray text-corporate-navy font-semibold uppercase text-[10px] tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Nomor Tiket</th>
                <th className="py-3 px-4">Perusahaan & Kontak</th>
                <th className="py-3 px-4">Item Kebutuhan</th>
                <th className="py-3 px-4">Volume & Tanggal</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRfqs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    Tidak ada permintaan RFQ pada kriteria ini.
                  </td>
                </tr>
              ) : (
                filteredRfqs.map((rfq) => (
                  <tr key={rfq.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-corporate-blue">
                      {rfq.rfqNumber}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-corporate-navy">{rfq.companyName}</p>
                      <p className="text-[11px] text-gray-500">
                        {rfq.customerName} &bull; {rfq.whatsapp}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-800 line-clamp-1">{rfq.targetItem}</p>
                      <span className="text-[10px] text-gray-400 uppercase font-semibold">
                        Tipe: {rfq.requestType}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-gray-700">{rfq.quantity}</p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(rfq.createdAt).toLocaleDateString("id-ID")}
                      </p>
                    </td>
                    <td className="py-3 px-4">{getStatusBadge(rfq.status)}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetailModal(rfq)}
                          className="text-[11px] py-1 px-2.5 font-semibold text-corporate-blue"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Detail
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteRfq(rfq.id)}
                          className="p-1.5 h-auto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* RFQ Detail Modal */}
      {viewingRfq && (
        <Modal
          isOpen={!!viewingRfq}
          onClose={() => setViewingRfq(null)}
          title={`Detail RFQ: ${viewingRfq.rfqNumber}`}
          description={`Diajukan pada ${new Date(viewingRfq.createdAt).toLocaleString("id-ID")}`}
          maxWidth="3xl"
        >
          <div className="space-y-6 text-xs">
            {updateMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{updateMsg}</span>
              </div>
            )}

            {/* Customer & Company Details */}
            <div className="p-4 rounded-xl bg-corporate-light-gray border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-semibold text-gray-400 uppercase">Nama Perusahaan</p>
                <p className="font-bold text-sm text-corporate-navy mt-0.5">{viewingRfq.companyName}</p>
                <p className="text-gray-500 mt-1">PIC: {viewingRfq.customerName}</p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-corporate-blue" />
                  <a href={`mailto:${viewingRfq.email}`} className="text-corporate-blue hover:underline">
                    {viewingRfq.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <a
                    href={getWhatsAppUrl(
                      viewingRfq.whatsapp,
                      `Halo Bapak/Ibu ${viewingRfq.customerName} dari ${viewingRfq.companyName}, kami dari PT Mitra Karya Pratama ingin mengonfirmasi permintaan penawaran harga Anda (No: ${viewingRfq.rfqNumber}) untuk item *${viewingRfq.targetItem}*.`
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    +{viewingRfq.whatsapp} (Hubungi WhatsApp)
                  </a>
                </div>
              </div>
            </div>

            {/* Item & Specifications */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-corporate-navy uppercase tracking-wider border-b border-gray-100 pb-2">
                Rincian Kebutuhan
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase">Jenis Kebutuhan:</span>
                  <p className="font-bold text-corporate-navy">{viewingRfq.requestType}</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase">Volume / Kuantitas:</span>
                  <p className="font-bold text-corporate-navy">{viewingRfq.quantity}</p>
                </div>
                <div className="p-3 rounded-lg bg-white border border-gray-200">
                  <span className="text-[10px] text-gray-400 uppercase">Target Waktu:</span>
                  <p className="font-bold text-corporate-navy">{viewingRfq.targetDate || "-"}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-gray-200 space-y-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Barang / Pekerjaan:</p>
                <p className="font-bold text-sm text-corporate-navy">{viewingRfq.targetItem}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase pt-2">Spesifikasi Lengkap:</p>
                <div className="p-3 rounded-lg bg-gray-50 text-gray-800 whitespace-pre-line leading-relaxed font-mono text-[11px]">
                  {viewingRfq.specifications}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase pt-1">Lokasi Pengiriman:</p>
                <p className="text-gray-700">{viewingRfq.deliveryLocation}</p>
              </div>

              {/* Attachment Download */}
              {viewingRfq.attachmentUrl && (
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-corporate-light-gray border border-gray-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-corporate-blue" />
                    <div>
                      <p className="font-bold text-corporate-navy">
                        {viewingRfq.attachmentName || "Dokumen Pendukung BoQ / ToR"}
                      </p>
                      <p className="text-[10px] text-gray-400">Lampiran file dari pemohon</p>
                    </div>
                  </div>
                  <a
                    href={viewingRfq.attachmentUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" className="text-xs">
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                      Download Berkas
                    </Button>
                  </a>
                </div>
              )}
            </div>

            {/* Workflow Status & Internal Notes */}
            <div className="space-y-3 pt-2 border-t border-gray-200">
              <h4 className="font-bold text-sm text-corporate-navy uppercase tracking-wider">
                Pengelolaan Status & Catatan Internal Admin
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-corporate-navy">Ubah Status RFQ:</label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-corporate-blue"
                  >
                    <option value="NEW">NEW (Permintaan Baru)</option>
                    <option value="REVIEWED">REVIEWED (Telah Ditinjau)</option>
                    <option value="QUOTATION_PREPARED">QUOTATION_PREPARED (SPH Sedang Dibuat)</option>
                    <option value="SENT">SENT (Penawaran Sudah Dikirim)</option>
                    <option value="APPROVED">APPROVED (Klien Setuju / PO Terbit)</option>
                    <option value="REJECTED">REJECTED (Batal / Tidak Sesuai)</option>
                    <option value="COMPLETED">COMPLETED (Pekerjaan Selesai)</option>
                  </select>
                </div>
              </div>

              <Textarea
                label="Catatan Internal / Riwayat Penawaran Harga"
                rows={3}
                placeholder="Tuliskan nomor SPH resmi yang dikirimkan, nilai penawaran, tanggal follow-up, atau kontak prinsipal..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="gold"
                  size="sm"
                  isLoading={isUpdating}
                  onClick={handleUpdateRfq}
                  className="font-bold uppercase tracking-wider text-xs shadow-gold"
                >
                  Simpan Perubahan Status
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
