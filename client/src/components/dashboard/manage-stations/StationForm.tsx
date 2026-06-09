"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { StationPayload, saveBusinessStation } from "@/services/enterpriseService";
import { FiPlus, FiTrash2, FiSave, FiArrowLeft, FiZap } from "react-icons/fi";

const CONNECTOR_TYPES = [
  { value: 0, label: "Type 1" },
  { value: 1, label: "Type 2" },
  { value: 2, label: "CCS2" },
  { value: 3, label: "CHAdeMO" },
];

export function StationForm({ initialData }: { initialData?: StationPayload }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  
  const [formData, setFormData] = useState<StationPayload>(
    initialData ?? {
      id: "", 
      name: "",
      address: "",
      district: "",
      position: { latitude: 10.762622, longitude: 106.660172 },
      chargingPoints: [],
    }
  );

  const handleAddChargingPoint = () => {
    const newPoint = {
      id: "", // Trống để người dùng tự nhập
      status: 1,
      connectors: [],
    };
    setFormData({ ...formData, chargingPoints: [...formData.chargingPoints, newPoint] });
  };

  const handleRemoveChargingPoint = (pointIndex: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa điểm sạc này cùng toàn bộ đầu sạc bên trong?")) return;
    const newPoints = [...formData.chargingPoints];
    newPoints.splice(pointIndex, 1);
    setFormData({ ...formData, chargingPoints: newPoints });
  };

  const handleAddConnector = (pointIndex: number) => {
    const newConnectors = [...formData.chargingPoints];
    newConnectors[pointIndex].connectors.push({
      id: "", // Trống để người dùng tự nhập
      type: 1, 
      price: 0,
      voltage: 220,
      maxPower: 22,
      available: true,
    });
    setFormData({ ...formData, chargingPoints: newConnectors });
  };

  const handleRemoveConnector = (pointIndex: number, connectorIndex: number) => {
    const newPoints = [...formData.chargingPoints];
    newPoints[pointIndex].connectors.splice(connectorIndex, 1);
    setFormData({ ...formData, chargingPoints: newPoints });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await saveBusinessStation(formData, images);
      alert("Lưu trạm sạc thành công!");
      router.push("/dashboard/manage-stations");
    } catch (error) {
      alert("Lưu thất bại, vui lòng kiểm tra lại dữ liệu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header (Đã bỏ sticky) */}
      <div className="flex justify-between items-center bg-white px-6 py-5 rounded-xl border border-gray-200 shadow-sm">
        <button 
          type="button" 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors font-medium"
        >
          <FiArrowLeft /> Quay lại
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {initialData ? "Chỉnh sửa trạm sạc" : "Tạo trạm sạc mới"}
        </h2>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm font-medium"
        >
          {isSubmitting ? "Đang lưu..." : <><FiSave className="w-5 h-5" /> Lưu trạm</>}
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-8">
        {/* Thông tin cơ bản */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
            Thông tin cơ bản
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mã trạm (ID) <span className="text-red-500">*</span></label>
              <input 
                required 
                readOnly={!!initialData} // Khóa lại nếu đang Edit
                value={formData.id} 
                onChange={e => setFormData({...formData, id: e.target.value})} 
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all ${initialData ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : 'bg-white'}`} 
                placeholder="VD: cs-vn-1283" 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tên trạm <span className="text-red-500">*</span></label>
              <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" placeholder="VD: Trạm sạc Vincom..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Quận/Huyện <span className="text-red-500">*</span></label>
              <input required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" placeholder="VD: Quận 1" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Địa chỉ chi tiết <span className="text-red-500">*</span></label>
              <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" placeholder="VD: 72 Lê Thánh Tôn, Bến Nghé..." />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Hình ảnh trạm sạc</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => document.getElementById('file-upload')?.click()}>
                <div className="space-y-1 text-center">
                  <FiZap className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 justify-center">
                    <span className="relative rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500">
                      Tải ảnh lên
                    </span>
                    <input id="file-upload" type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []))} className="sr-only" />
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF tối đa 10MB</p>
                  {images.length > 0 && <p className="text-sm font-semibold text-green-600 mt-2">Đã chọn {images.length} tệp</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cấu hình Điểm Sạc */}
        <div>
          <div className="flex items-center justify-between mb-4 border-b pb-2">
            <h3 className="text-lg font-bold text-gray-900">Danh sách Điểm Sạc</h3>
            <button type="button" onClick={handleAddChargingPoint} className="flex items-center gap-1.5 text-sm font-medium bg-blue-50 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors shadow-sm border border-blue-200">
              <FiPlus className="w-4 h-4" /> Thêm điểm sạc
            </button>
          </div>

          <div className="space-y-6">
            {formData.chargingPoints.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-500">Chưa có điểm sạc nào được cấu hình.</p>
              </div>
            ) : formData.chargingPoints.map((point, pIndex) => (
              <div key={pIndex} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Point Header */}
                <div className="bg-gray-100 px-5 py-3 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-bold text-gray-800 whitespace-nowrap">Điểm sạc #{pIndex + 1}</h4>
                    <input 
                      required 
                      value={point.id} 
                      onChange={e => {
                        const newPts = [...formData.chargingPoints];
                        newPts[pIndex].id = e.target.value;
                        setFormData({...formData, chargingPoints: newPts});
                      }} 
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none w-48 font-mono" 
                      placeholder="Mã điểm sạc (ID)..." 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveChargingPoint(pIndex)} 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors flex items-center gap-1 text-sm font-medium"
                  >
                    <FiTrash2 /> Xóa điểm
                  </button>
                </div>
                
                {/* Connectors Area */}
                <div className="p-5 space-y-4">
                  {point.connectors.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Chưa có đầu sạc. Hãy thêm đầu sạc mới.</p>
                  ) : point.connectors.map((conn, cIndex) => (
                    <div key={cIndex} className="flex flex-wrap lg:flex-nowrap lg:items-end gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative group">
                      
                      {/* Cột: Mã Đầu Sạc */}
                      <div className="flex-1 min-w-[140px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Mã Đầu Sạc (ID)</label>
                        <input 
                          required
                          value={conn.id} 
                          onChange={e => {
                            const newPts = [...formData.chargingPoints];
                            newPts[pIndex].connectors[cIndex].id = e.target.value;
                            setFormData({...formData, chargingPoints: newPts});
                          }} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm font-mono"
                          placeholder="VD: cn-vn-1283-01..."
                        />
                      </div>

                      {/* Cột: Loại đầu sạc */}
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Loại Cổng</label>
                        <select 
                          value={conn.type} 
                          onChange={e => {
                            const newPts = [...formData.chargingPoints];
                            newPts[pIndex].connectors[cIndex].type = Number(e.target.value);
                            setFormData({...formData, chargingPoints: newPts});
                          }} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm bg-white"
                        >
                          {CONNECTOR_TYPES.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Cột: Công suất */}
                      <div className="flex-1 min-w-[100px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">CS (kW)</label>
                        <input 
                          type="number" 
                          required
                          value={conn.maxPower} 
                          onChange={e => {
                            const newPts = [...formData.chargingPoints];
                            newPts[pIndex].connectors[cIndex].maxPower = Number(e.target.value);
                            setFormData({...formData, chargingPoints: newPts});
                          }} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" 
                        />
                      </div>

                      {/* Cột: Điện áp */}
                      <div className="flex-1 min-w-[100px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Áp (V)</label>
                        <input 
                          type="number" 
                          required
                          value={conn.voltage} 
                          onChange={e => {
                            const newPts = [...formData.chargingPoints];
                            newPts[pIndex].connectors[cIndex].voltage = Number(e.target.value);
                            setFormData({...formData, chargingPoints: newPts});
                          }} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" 
                        />
                      </div>

                      {/* Cột: Giá */}
                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Giá (VND)</label>
                        <input 
                          type="number" 
                          required
                          value={conn.price} 
                          onChange={e => {
                            const newPts = [...formData.chargingPoints];
                            newPts[pIndex].connectors[cIndex].price = Number(e.target.value);
                            setFormData({...formData, chargingPoints: newPts});
                          }} 
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none text-sm" 
                        />
                      </div>

                      {/* Nút xóa Đầu sạc */}
                      <div className="pt-2 lg:pt-0 w-full lg:w-auto flex justify-end">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveConnector(pIndex, cIndex)} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md border border-transparent hover:border-red-100 transition-colors flex justify-center items-center"
                          title="Xóa cổng sạc"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    type="button" 
                    onClick={() => handleAddConnector(pIndex)} 
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 px-3 py-2 rounded-md transition-colors mt-2"
                  >
                    <FiPlus /> Thêm đầu sạc vào điểm này
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}