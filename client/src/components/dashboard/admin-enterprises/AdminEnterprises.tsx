"use client";

import { useEffect, useMemo, useState } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { toast } from "react-toastify";
import { Modal } from "@/components/Modal";
import {
  deleteAdminEnterprise,
  disableAdminEnterprise,
  getAdminEnterprises,
  verifyAdminEnterprise,
  type AdminEnterprise,
} from "@/services/adminService";

type ConfirmAction = {
  title: string;
  description: string;
  confirmText: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: () => Promise<void>;
};

export function AdminEnterprises() {
  const [enterprises, setEnterprises] = useState<AdminEnterprise[]>([]);
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [confirmCountdown, setConfirmCountdown] = useState(5);
  const [isConfirmSubmitting, setIsConfirmSubmitting] = useState(false);

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

      return true;
    } catch {
      setError("Không thể tải danh sách doanh nghiệp.");
      return false;
    } finally {
      setIsRefreshing(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEnterprises();
  }, []);

  useEffect(() => {
    if (!confirmAction) {
      return;
    }

    setConfirmCountdown(5);
    const interval = window.setInterval(() => {
      setConfirmCountdown((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [confirmAction]);

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
      toast.success(
        selectedEnterprise.isVerified
          ? "Bỏ xác minh doanh nghiệp thành công."
          : "Xác minh doanh nghiệp thành công.",
      );
    } catch {
      setError("Không thể cập nhật trạng thái xác minh doanh nghiệp.");
      toast.error("Không thể cập nhật trạng thái xác minh doanh nghiệp.");
    } finally {
      setIsToggling(false);
    }
  };

  const handleDeleteEnterprise = async (enterpriseId: string) => {
    setIsDeleting(true);
    setError(null);

    try {
      const isDeleted = await deleteAdminEnterprise(enterpriseId);

      if (!isDeleted) {
        throw new Error("Delete failed");
      }

      setEnterprises((prev) => {
        const updated = prev.filter((enterprise) => enterprise.companyId !== enterpriseId);

        if (updated.length === 0) {
          setSelectedEnterpriseId("");
        } else {
          setSelectedEnterpriseId((currentSelectedId) =>
            currentSelectedId === enterpriseId ? updated[0].companyId : currentSelectedId,
          );
        }

        return updated;
      });

      toast.success("Xóa doanh nghiệp thành công.");
    } catch {
      setError("Không thể xóa doanh nghiệp.");
      toast.error("Không thể xóa doanh nghiệp.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSyncEnterprise = async () => {
    setIsSyncing(true);
    const success = await loadEnterprises();

    if (success) {
      toast.success("Đồng bộ dữ liệu doanh nghiệp thành công.");
    } else {
      toast.error("Đồng bộ dữ liệu doanh nghiệp thất bại.");
    }

    setIsSyncing(false);
  };

  const handleRefresh = async () => {
    const success = await loadEnterprises();

    if (success) {
      toast.success("Tải lại danh sách doanh nghiệp thành công.");
    } else {
      toast.error("Tải lại danh sách doanh nghiệp thất bại.");
    }
  };

  const openConfirm = (action: ConfirmAction) => {
    setConfirmAction(action);
  };

  const closeConfirm = () => {
    if (isConfirmSubmitting) {
      return;
    }

    setConfirmAction(null);
    setConfirmCountdown(5);
  };

  const handleConfirm = async () => {
    if (!confirmAction || confirmCountdown > 0 || isConfirmSubmitting) {
      return;
    }

    setIsConfirmSubmitting(true);
    try {
      await confirmAction.onConfirm();
      setConfirmAction(null);
      setConfirmCountdown(5);
    } finally {
      setIsConfirmSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý doanh nghiệp</h2>
        </div>
        <button
          onClick={() =>
            openConfirm({
              title: "Xác nhận tải lại",
              description: "Bạn có chắc chắn muốn tải lại danh sách doanh nghiệp?",
              confirmText: "Refresh",
              onConfirm: handleRefresh,
            })
          }
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
                    onClick={() =>
                      openConfirm({
                        title: selectedEnterprise.isVerified
                          ? "Xác nhận bỏ xác minh"
                          : "Xác nhận xác minh",
                        description: selectedEnterprise.isVerified
                          ? "Bạn có chắc chắn muốn bỏ xác minh doanh nghiệp này?"
                          : "Bạn có chắc chắn muốn xác minh doanh nghiệp này?",
                        confirmText: selectedEnterprise.isVerified ? "Bỏ xác minh" : "Xác minh",
                        onConfirm: handleToggleVerification,
                      })
                    }
                    disabled={isToggling || isDeleting || isSyncing}
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
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận đồng bộ",
                        description: "Bạn có chắc chắn muốn đồng bộ danh sách doanh nghiệp?",
                        confirmText: "Sync",
                        onConfirm: handleSyncEnterprise,
                      })
                    }
                    disabled={isToggling || isDeleting || isSyncing}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSyncing ? "Dang sync..." : "Sync"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      openConfirm({
                        title: "Xác nhận xóa doanh nghiệp",
                        description: `Bạn có chắc chắn muốn xóa doanh nghiệp ${selectedEnterprise.companyName}?`,
                        confirmText: "Xóa",
                        confirmVariant: "danger",
                        onConfirm: async () =>
                          handleDeleteEnterprise(selectedEnterprise.companyId),
                      })
                    }
                    disabled={isToggling || isDeleting || isSyncing}
                    className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDeleting ? "Đang xóa..." : "Delete"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Chọn một doanh nghiệp để xem thông tin chi tiết.</div>
            )}
          </div>
        </div>
      )}

      <Modal open={Boolean(confirmAction)} onClose={closeConfirm} panelClassName="max-w-lg">
        {confirmAction ? (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">{confirmAction.title}</h3>
            <p className="text-sm text-gray-600">{confirmAction.description}</p>
            <p className="text-xs text-amber-700">
              Vui lòng chờ {confirmCountdown}s để bật nút xác nhận.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeConfirm}
                disabled={isConfirmSubmitting}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => void handleConfirm()}
                disabled={confirmCountdown > 0 || isConfirmSubmitting}
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  confirmAction.confirmVariant === "danger"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isConfirmSubmitting
                  ? "Đang xử lý..."
                  : confirmCountdown > 0
                    ? `${confirmAction.confirmText} (${confirmCountdown}s)`
                    : confirmAction.confirmText}
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
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
