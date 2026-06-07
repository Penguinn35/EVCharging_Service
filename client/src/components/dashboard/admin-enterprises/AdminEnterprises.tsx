"use client";

import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import {
  disableAdminEnterprise,
  getAdminEnterprises,
  verifyAdminEnterprise,
  type AdminEnterprise,
} from "@/services/adminService";

export function AdminEnterprises() {
  const [enterprises, setEnterprises] = useState<AdminEnterprise[]>([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedEnterprise = useMemo(
    () => enterprises.find((enterprise) => enterprise.companyId === selectedEnterpriseId) ?? null,
    [enterprises, selectedEnterpriseId],
  );

  const loadEnterprises = async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const response = await getAdminEnterprises();
      setEnterprises(response);

      if (!response.length) {
        setSelectedEnterpriseId("");
      } else if (!selectedEnterpriseId || !response.some((item) => item.companyId === selectedEnterpriseId)) {
        setSelectedEnterpriseId(response[0].companyId);
      }
    } catch {
      setError("Khong the tai danh sach doanh nghiep.");
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEnterprises();
  }, []);

  const handleToggleVerification = async () => {
    if (!selectedEnterprise) return;

    setIsToggling(true);
    setError(null);

    try {
      const success = selectedEnterprise.isVerified
        ? await disableAdminEnterprise(selectedEnterprise.companyId)
        : await verifyAdminEnterprise(selectedEnterprise.companyId);

      if (!success) {
        throw new Error("Toggle failed");
      }

      setEnterprises((prev) =>
        prev.map((enterprise) =>
          enterprise.companyId === selectedEnterprise.companyId
            ? {
                ...enterprise,
                isVerified: !enterprise.isVerified,
              }
            : enterprise,
        ),
      );
    } catch {
      setError("Khong the cap nhat trang thai xac minh doanh nghiep.");
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý doanh nghiệp</h2>
        </div>
        <button
          onClick={() => void loadEnterprises()}
          disabled={isRefreshing}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <FiRefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Dang tai danh sach doanh nghiep...
        </div>
      ) : enterprises.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
          Chua co doanh nghiep nao.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 lg:col-span-1">
            <h3 className="mb-3 text-base font-semibold text-gray-900">Danh sách doanh nghiệp</h3>
            <div className="space-y-2">
              {enterprises.map((enterprise) => {
                const isSelected = enterprise.companyId === selectedEnterpriseId;
                const isVerified = enterprise.isVerified;

                return (
                  <button
                    key={enterprise.companyId}
                    onClick={() => setSelectedEnterpriseId(enterprise.companyId)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 bg-white hover:border-green-200 hover:bg-green-50"
                    }`}
                  >
                    <p className="truncate text-sm font-semibold text-gray-900">{enterprise.companyName}</p>
                    <p className="mt-1 truncate text-xs text-gray-500">{enterprise.managerFullName}</p>
                    <span
                      className={`mt-2 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        isVerified ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {isVerified ? "Verified" : "Pending"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 lg:col-span-2">
            {selectedEnterprise ? (
              <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedEnterprise.companyName}</h3>
                    <p className="mt-1 text-sm text-gray-500">{selectedEnterprise.companyId}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${
                      selectedEnterprise.isVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {selectedEnterprise.isVerified ? "Đã xác minh" : "Chưa xác minh"}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <InfoItem label="Mã doanh nghiệp" value={selectedEnterprise.companyId} />
                  <InfoItem label="Mã số thuế" value={selectedEnterprise.taxCode} />
                  <InfoItem label="Email quản lý" value={selectedEnterprise.managerEmail} />
                  <InfoItem label="Tên quản lý" value={selectedEnterprise.managerFullName} />
                </div>

                <InfoItem label="Địa chỉ công ty" value={selectedEnterprise.companyAddress} />
                <InfoItem label="Địa chỉ quản lý" value={selectedEnterprise.managerAddress} />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => void handleToggleVerification()}
                    disabled={isToggling}
                    className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      selectedEnterprise.isVerified
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {isToggling
                      ? "Đang xử lý..."
                      : selectedEnterprise.isVerified
                        ? "Bỏ xác minh"
                        : "Xác minh"}
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Sync
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Chọn một doanh nghiệp để xem thông tin chi tiết.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-sm text-gray-900">{value && value.trim() ? value : "-"}</p>
    </div>
  );
}
