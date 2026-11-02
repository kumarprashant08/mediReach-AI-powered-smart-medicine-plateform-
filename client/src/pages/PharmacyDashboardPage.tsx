import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  XCircle,
  Clock,
  Edit,
  Plus,
  Minus,
  RefreshCw,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { InventoryItem } from '../types';
import { useSocket } from '../context/SocketContext';
import { useNotification } from '../context/NotificationContext';

export const PharmacyDashboardPage: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [addingMedicine, setAddingMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '', genericName: '', brand: '', strength: '', form: 'Tablet',
    category: 'General Healthcare', commonUse: '', prescriptionRequired: false,
    price: 0, quantity: 0, sku: '',
  });

  const { isConnected, lastInventoryUpdate } = useSocket();
  const { showToast } = useNotification();

  const loadInventory = async () => {
    setLoading(true);
    try {
      const data = await api.getInventory();
      setInventory(data || []);
    } catch {
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
    const interval = window.setInterval(loadInventory, 30000);
    return () => window.clearInterval(interval);
  }, [lastInventoryUpdate]);

  const handleStockAdjust = async (item: InventoryItem, delta: number) => {
    const newQty = Math.max(0, item.quantity + delta);
    try {
      const updated = await api.updateInventoryItem(item._id, { quantity: newQty });
      setInventory((prev) => prev.map((i) => (i._id === item._id ? updated : i)));
      showToast('Stock Updated', `${(item.medicineId as any)?.name} stock set to ${newQty} units.`, 'success');
    } catch {
      showToast('Update Failed', 'Unable to adjust stock level.', 'error');
    }
  };

  const handleSaveInlineEdit = async (item: InventoryItem) => {
    try {
      const updated = await api.updateInventoryItem(item._id, { quantity: editQty, price: editPrice });
      setInventory((prev) => prev.map((i) => (i._id === item._id ? updated : i)));
      setEditingId(null);
      showToast('Inventory Updated', 'Stock and price changes saved.', 'success');
    } catch {
      showToast('Update Error', 'Could not save inventory item.', 'error');
    }
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingMedicine(true);
    try {
      await api.addPharmacyMedicine(newMedicine);
      showToast('Medicine Added', `${newMedicine.name} is now listed in your pharmacy inventory.`, 'success');
      setShowAddMedicine(false);
      setNewMedicine({
        name: '', genericName: '', brand: '', strength: '', form: 'Tablet',
        category: 'General Healthcare', commonUse: '', prescriptionRequired: false,
        price: 0, quantity: 0, sku: '',
      });
      await loadInventory();
    } catch (err: any) {
      showToast('Add Failed', err.message || 'Unable to add medicine.', 'error');
    } finally {
      setAddingMedicine(false);
    }
  };

  const totalMedicines = inventory.length;
  const lowStockCount = inventory.filter((i) => i.quantity > 0 && i.quantity <= 10).length;
  const outOfStockCount = inventory.filter((i) => i.quantity === 0).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
              Pharmacy Admin Portal
            </span>
            {isConnected && (
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span> Live Socket Sync
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">Pharmacy Inventory Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Stock updates broadcast in real-time to patient availability dashboards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/pharmacy/analytics"
            className="bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
          >
            <TrendingUp className="w-4 h-4 text-cyan-400" /> Demand Analytics
          </Link>
          <button
            onClick={() => setShowAddMedicine(true)}
            className="bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-md transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Medicine
          </button>
          <button
            onClick={loadInventory}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Total Managed Items</span>
          <span className="text-3xl font-black text-navy-900">{totalMedicines}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-amber-200 bg-amber-50/40 shadow-sm">
          <span className="text-xs text-amber-700 font-semibold block">Low Stock Alert (≤10)</span>
          <span className="text-3xl font-black text-amber-900">{lowStockCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-red-200 bg-red-50/40 shadow-sm">
          <span className="text-xs text-red-700 font-semibold block">Out of Stock</span>
          <span className="text-3xl font-black text-red-900">{outOfStockCount}</span>
        </div>
        <div className="glass-card p-5 rounded-2xl border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <span className="text-xs text-emerald-700 font-semibold block">Today's Reservations</span>
          <span className="text-3xl font-black text-emerald-900">8</span>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="glass-card rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-navy-900 text-lg">Inventory Stock Table</h3>
          <span className="text-xs text-slate-400">Click stock counters for instant adjustments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-100/80 text-navy-900 font-bold uppercase tracking-wider border-b border-slate-200 text-[10px]">
              <tr>
                <th className="p-4">Medicine Name</th>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4">Stock Level</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">Loading inventory records...</td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">No inventory items found.</td>
                </tr>
              ) : (
                inventory.map((item) => {
                  const med = item.medicineId as any;
                  const isEditing = editingId === item._id;

                  return (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4 font-bold text-navy-900">
                        {med?.name || 'Unknown Medicine'}
                        <span className="block text-[10px] text-slate-400 font-normal">{med?.brand} • {med?.strength}</span>
                      </td>
                      <td className="p-4 font-mono text-[11px] text-slate-500">{item.sku || 'SKU-8821'}</td>
                      <td className="p-4 font-bold text-navy-900">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(parseFloat(e.target.value))}
                            className="w-16 p-1 border rounded text-xs"
                          />
                        ) : (
                          `₹${item.price}`
                        )}
                      </td>
                      <td className="p-4">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editQty}
                            onChange={(e) => setEditQty(parseInt(e.target.value, 10))}
                            className="w-16 p-1 border rounded text-xs"
                          />
                        ) : (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleStockAdjust(item, -1)}
                              className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 font-bold flex items-center justify-center text-navy-900"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-extrabold text-sm min-w-[24px] text-center">{item.quantity}</span>
                            <button
                              onClick={() => handleStockAdjust(item, 1)}
                              className="w-6 h-6 rounded bg-slate-200 hover:bg-slate-300 font-bold flex items-center justify-center text-navy-900"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-4">
                        {item.quantity > 10 ? (
                          <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                            In Stock
                          </span>
                        ) : item.quantity > 0 ? (
                          <span className="bg-amber-100 text-amber-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                            Low Stock ({item.quantity})
                          </span>
                        ) : (
                          <span className="bg-red-100 text-red-800 font-bold text-[10px] px-2 py-0.5 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-[11px] text-slate-400">
                        {new Date(item.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-4 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveInlineEdit(item)}
                            className="bg-brand-500 text-white font-bold text-xs px-3 py-1 rounded-lg"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(item._id);
                              setEditQty(item.quantity);
                              setEditPrice(item.price);
                            }}
                            className="text-brand-600 font-bold text-xs hover:underline flex items-center gap-1 justify-end"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showAddMedicine && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleAddMedicine} className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-navy-900">Add Medicine to Inventory</h2>
                <p className="text-xs text-slate-500 mt-1">Add a new medicine manually. It becomes searchable immediately.</p>
              </div>
              <button type="button" onClick={() => setShowAddMedicine(false)} className="text-slate-400 hover:text-slate-700 text-xl">✕</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ['name', 'Medicine Name'], ['genericName', 'Generic Name'], ['brand', 'Brand / Manufacturer'],
                ['strength', 'Strength'], ['category', 'Category'], ['commonUse', 'Common Use'],
                ['sku', 'SKU (optional)']
              ].map(([key, label]) => (
                <label key={key} className="text-xs font-bold text-slate-700">
                  {label}
                  <input
                    required={['name','genericName','brand','strength'].includes(key)}
                    value={(newMedicine as any)[key]}
                    onChange={(e) => setNewMedicine(prev => ({ ...prev, [key]: e.target.value }))}
                    className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 font-normal focus:outline-none focus:ring-2 focus:ring-brand-200"
                  />
                </label>
              ))}
              <label className="text-xs font-bold text-slate-700">
                Dosage Form
                <select value={newMedicine.form} onChange={e => setNewMedicine(p => ({...p, form:e.target.value}))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5">
                  {['Tablet','Capsule','Syrup','Injection','Sachet','Ointment','Drops','Inhaler'].map(v => <option key={v}>{v}</option>)}
                </select>
              </label>
              <label className="text-xs font-bold text-slate-700 flex items-center gap-2 pt-6">
                <input type="checkbox" checked={newMedicine.prescriptionRequired} onChange={e => setNewMedicine(p => ({...p, prescriptionRequired:e.target.checked}))} />
                Prescription required
              </label>
              <label className="text-xs font-bold text-slate-700">
                Price (₹)
                <input type="number" min="0" step="0.01" value={newMedicine.price} onChange={e => setNewMedicine(p => ({...p, price:Number(e.target.value)}))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 font-normal" />
              </label>
              <label className="text-xs font-bold text-slate-700">
                Opening Stock
                <input type="number" min="0" value={newMedicine.quantity} onChange={e => setNewMedicine(p => ({...p, quantity:Number(e.target.value)}))} className="mt-1 w-full border border-slate-200 rounded-xl px-3 py-2.5 font-normal" />
              </label>
            </div>

            <button disabled={addingMedicine} className="w-full bg-brand-500 hover:bg-brand-600 disabled:opacity-60 text-white font-extrabold py-3 rounded-full">
              {addingMedicine ? 'Adding Medicine…' : 'Add & Publish to Inventory'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
