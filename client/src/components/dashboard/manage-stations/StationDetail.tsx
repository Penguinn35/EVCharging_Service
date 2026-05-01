"use client";

import Link from "next/link";
import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiEdit2,
  FiImage,
  FiLoader,
  FiMapPin,
  FiTrash2,
  FiUpload,
  FiZap,
} from "react-icons/fi";
import { getStationById } from "@/services/stationService";
import {
  deleteBusinessStationImage,
  updateBusinessStationImage,
  uploadBusinessStationImage,
} from "@/services/enterpriseService";
import type { StationDetail as StationDetailType } from "@/type/station";

interface StationDetailProps {
  stationId: string;
  backHref: string;
}

type StationStatusLabel = "AVAILABLE" | "BUSY" | "FULL" | "OFF";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=1200&h=600&fit=crop";

const mapStationStatus = (status: number): StationStatusLabel => {
  switch (status) {
    case 1:
      return "AVAILABLE";
    case 2:
      return "BUSY";
    case 3:
      return "FULL";
    default:
      return "OFF";
  }
};

const statusColors: Record<StationStatusLabel, string> = {
  AVAILABLE: "bg-green-100 text-green-700",
  BUSY: "bg-yellow-100 text-yellow-700",
  FULL: "bg-orange-100 text-orange-700",
  OFF: "bg-gray-100 text-gray-700",
};

const connectorTypeLabels: Record<number, string> = {
  0: "Type 1",
  1: "Type 2",
  2: "CCS2",
  3: "CHAdeMO",
};

const formatConnectorType = (type: number) => connectorTypeLabels[type] ?? `Type ${type}`;
const formatPower = (value: number) => `${value} kW`;
const formatVoltage = (value: number) => `${value} V`;
const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export function StationDetail({ stationId, backHref }: StationDetailProps) {
  const [station, setStation] = useState<StationDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editingImageKey, setEditingImageKey] = useState<string | null>(null);
  const [deletingImageKey, setDeletingImageKey] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const uploadInputRef = useRef<HTMLInputElement | null>(null);
  const replaceInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadStationDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getStationById(stationId);
      setStation(response);
      setCurrentImageIndex((prev) => {
        const nextLength = response.images.length;
        if (nextLength === 0) {
          return 0;
        }
        return Math.min(prev, nextLength - 1);
      });
    } catch {
      setError("Failed to load station details.");
    } finally {
      setIsLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    void loadStationDetail();
  }, [loadStationDetail]);

  const images = station?.images ?? [];
  const displayImage = images[currentImageIndex]?.url ?? FALLBACK_IMAGE;
  const statusLabel = station ? mapStationStatus(station.status) : "OFF";

  const connectorTypes = useMemo(() => {
    if (!station) {
      return [];
    }
    return Array.from(
      new Set(station.connectors.map((connector) => formatConnectorType(connector.type))),
    );
  }, [station]);

  const maxPowers = useMemo(() => {
    if (!station) {
      return [];
    }
    return Array.from(new Set(station.connectors.map((connector) => connector.maxPower)));
  }, [station]);

  const availableConnectors = station?.connectors.filter((connector) => connector.available) ?? [];

  const showTemporaryMessage = (message: string) => {
    setActionMessage(message);
    window.setTimeout(() => {
      setActionMessage((current) => (current === message ? null : current));
    }, 2500);
  };

  const handleUploadImage = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !station) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const previousImageCount = station.images.length;
      const isSuccess = await uploadBusinessStationImage(station.id, file);
      if (!isSuccess) {
        throw new Error("Upload failed");
      }
      showTemporaryMessage("Image uploaded successfully.");
      await loadStationDetail();
      setCurrentImageIndex(previousImageCount);
    } catch {
      setError("Failed to upload image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  const handleReplaceImage = async (key: string, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !station) {
      return;
    }

    setEditingImageKey(key);
    setError(null);

    try {
      const isSuccess = await updateBusinessStationImage(station.id, key, file);
      if (!isSuccess) {
        throw new Error("Update failed");
      }
      showTemporaryMessage("Image updated successfully.");
      await loadStationDetail();
    } catch {
      setError("Failed to update image.");
    } finally {
      setEditingImageKey(null);
      event.target.value = "";
    }
  };

  const handleDeleteImage = async (key: string, index: number) => {
    setDeletingImageKey(key);
    setError(null);

    try {
      const isSuccess = await deleteBusinessStationImage(key);
      if (!isSuccess) {
        throw new Error("Delete failed");
      }
      showTemporaryMessage("Image deleted successfully.");
      await loadStationDetail();
      setCurrentImageIndex((prev) => Math.max(0, Math.min(prev, index - 1)));
      setIsImagePreviewOpen(false);
    } catch {
      setError("Failed to delete image.");
    } finally {
      setDeletingImageKey(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Stations
        </Link>
        <div className="rounded-lg border border-gray-200 bg-white px-4 py-16 text-center text-sm text-gray-500">
          Loading station details...
        </div>
      </div>
    );
  }

  if (error && !station) {
    return (
      <div className="space-y-6">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to Stations
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-8 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!station) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200"
      >
        <FiArrowLeft className="h-4 w-4" />
        Back to Stations
      </Link>

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {actionMessage ? (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {actionMessage}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="relative h-80 bg-gray-100">
          <button
            type="button"
            onClick={() => images.length > 0 && setIsImagePreviewOpen(true)}
            className="block h-full w-full cursor-zoom-in"
          >
            <img
              src={displayImage}
              alt={station.name}
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </button>

          {images.length > 1 ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
                }
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
              >
                <FiChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
                }
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white transition hover:bg-black/60"
              >
                <FiChevronRight className="h-5 w-5" />
              </button>
            </>
          ) : null}

          <div className="absolute bottom-4 right-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
            {images.length === 0 ? "No image" : `${currentImageIndex + 1} / ${images.length}`}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-gray-200 px-4 py-3">
          <input
            ref={uploadInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUploadImage}
          />
          <button
            type="button"
            onClick={() => uploadInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? <FiLoader className="h-4 w-4 animate-spin" /> : <FiUpload className="h-4 w-4" />}
            Add image
          </button>

          {images.length > 0 ? (
            <>
              <button
                type="button"
                onClick={() => replaceInputRefs.current[images[currentImageIndex].key]?.click()}
                disabled={editingImageKey === images[currentImageIndex].key}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingImageKey === images[currentImageIndex].key ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <FiEdit2 className="h-4 w-4" />
                )}
                Replace current
              </button>
              <button
                type="button"
                onClick={() => void handleDeleteImage(images[currentImageIndex].key, currentImageIndex)}
                disabled={deletingImageKey === images[currentImageIndex].key}
                className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingImageKey === images[currentImageIndex].key ? (
                  <FiLoader className="h-4 w-4 animate-spin" />
                ) : (
                  <FiTrash2 className="h-4 w-4" />
                )}
                Delete current
              </button>
            </>
          ) : null}
        </div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 px-4 py-4 sm:grid-cols-4 lg:grid-cols-6">
            {images.map((image, index) => (
              <div
                key={image.key}
                className={`group relative overflow-hidden rounded-lg border ${index === currentImageIndex ? "border-green-500 ring-2 ring-green-100" : "border-gray-200"}`}
              >
                <button
                  type="button"
                  onClick={() => setCurrentImageIndex(index)}
                  className="block h-24 w-full"
                >
                  <img
                    src={image.url}
                    alt={`${station.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_IMAGE;
                    }}
                  />
                </button>
                <input
                  ref={(element) => {
                    replaceInputRefs.current[image.key] = element;
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => void handleReplaceImage(image.key, event)}
                />
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/55 px-2 py-1 text-white opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => replaceInputRefs.current[image.key]?.click()}
                    className="inline-flex items-center gap-1 text-xs"
                  >
                    <FiEdit2 className="h-3 w-3" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDeleteImage(image.key, index)}
                    className="inline-flex items-center gap-1 text-xs"
                  >
                    <FiTrash2 className="h-3 w-3" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 border-t border-gray-200 px-4 py-8 text-sm text-gray-500">
            <FiImage className="h-5 w-5" />
            This station does not have any images yet.
          </div>
        )}
      </div>

      {isImagePreviewOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setIsImagePreviewOpen(false)}
        >
          <div
            className="relative max-h-[90vh] max-w-[90vw]"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={displayImage}
              alt={`${station.name} full preview`}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onError={(event) => {
                event.currentTarget.src = FALLBACK_IMAGE;
              }}
            />
          </div>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">{station.name}</h1>
          <div className="flex items-center gap-2 text-gray-600">
            <FiMapPin className="h-4 w-4" />
            <span>{station.address}</span>
          </div>
          <div className="text-sm text-gray-500">Manufacturer: {station.manufacturer}</div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">Status</div>
          <span className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${statusColors[statusLabel]}`}>
            {statusLabel}
          </span>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-600">District</div>
          <div className="font-semibold text-gray-900">{station.district}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">Connectors</div>
          <div className="text-2xl font-bold text-green-600">{station.connectors.length}</div>
          <div className="mt-1 text-xs text-gray-500">{availableConnectors.length} available</div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">Coordinates</div>
          <div className="break-all font-mono text-sm text-gray-900">
            {station.position.latitude.toFixed(4)}, {station.position.longitude.toFixed(4)}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">Connector Types</div>
          <div className="space-y-1">
            {connectorTypes.length > 0 ? (
              connectorTypes.map((type) => (
                <div key={type} className="text-sm font-medium text-gray-900">
                  {type}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No connectors</div>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-2 text-xs font-medium uppercase text-gray-600">Max Power</div>
          <div className="space-y-1">
            {maxPowers.length > 0 ? (
              maxPowers.map((power) => (
                <div key={power} className="text-sm font-medium text-gray-900">
                  {formatPower(power)}
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">No data</div>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Charging Points</h2>
        {station.connectors.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Connector ID</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Connector Type</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Voltage</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Max Power</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Availability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {station.connectors.map((connector) => (
                  <tr key={connector.id} className="transition-colors hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{connector.id}</td>
                    <td className="px-4 py-3 text-gray-700">{formatConnectorType(connector.type)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatVoltage(connector.voltage)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{formatPower(connector.maxPower)}</td>
                    <td className="px-4 py-3 text-gray-700">{formatPrice(connector.price)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${connector.available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                      >
                        {connector.available ? "Available" : "Busy"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-sm text-gray-500">No connector data available.</div>
        )}
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <FiZap className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold text-gray-900">Station Overview</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm font-medium text-gray-600">Full Address</div>
            <div className="mt-1 text-sm text-gray-900">{station.address}</div>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <div className="text-sm font-medium text-gray-600">Location</div>
            <div className="mt-1 text-sm text-gray-900">
              {station.position.latitude}, {station.position.longitude}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
