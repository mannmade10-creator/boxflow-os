'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type LoadStatus =
  | 'Unassigned'
  | 'Assigned'
  | 'Dispatched'
  | 'In Transit'
  | 'At Pickup'
  | 'At Delivery'
  | 'Delivered'
  | 'Cancelled';

type DriverStatus = 'Available' | 'Assigned' | 'Driving' | 'Off Duty';
type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

type Driver = {
  id: string;
  full_name: string;
  phone: string | null;
  email: string | null;
  truck_number: string | null;
  equipment_type: string | null;
  current_location: string | null;
  available: boolean;
  status: DriverStatus;
};

type Load = {
  id: string;
  load_number: string;
  broker_name: string | null;
  broker_email: string | null;
  broker_phone: string | null;
  customer_name: string | null;
  pickup_location: string;
  dropoff_location: string;
  pickup_date: string | null;
  delivery_date: string | null;
  equipment_type: string | null;
  weight_lbs: number | null;
  miles: number | null;
  rate: number | null;
  status: LoadStatus;
  priority: Priority;
  assigned_driver_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
  dispatch_drivers?: Driver | null;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

const demoDrivers: Driver[] = [
  {
    id: 'driver-1',
    full_name: 'Marcus Hill',
    phone: '405-555-1001',
    email: 'marcus@boxflowos.com',
    truck_number: 'BF-201',
    equipment_type: 'Dry Van',
    current_location: 'Oklahoma City, OK',
    available: true,
    status: 'Available',
  },
  {
    id: 'driver-2',
    full_name: 'Angela Brooks',
    phone: '405-555-1002',
    email: 'angela@boxflowos.com',
    truck_number: 'BF-305',
    equipment_type: 'Reefer',
    current_location: 'Tulsa, OK',
    available: true,
    status: 'Available',
  },
  {
    id: 'driver-3',
    full_name: 'Darnell Price',
    phone: '405-555-1003',
    email: 'darnell@boxflowos.com',
    truck_number: 'BF-412',
    equipment_type: 'Flatbed',
    current_location: 'Dallas, TX',
    available: false,
    status: 'Assigned',
  },
];

const demoLoads: Load[] = [
  {
    id: 'load-1',
    load_number: 'LD-1001',
    broker_name: 'DAT Broker Network',
    broker_email: 'broker1@datdemo.com',
    broker_phone: '800-555-0001',
    customer_name: 'Amazon Regional',
    pickup_location: 'Oklahoma City, OK',
    dropoff_location: 'Dallas, TX',
    pickup_date: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    delivery_date: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    equipment_type: 'Dry Van',
    weight_lbs: 22000,
    miles: 205,
    rate: 1350,
    status: 'Unassigned',
    priority: 'High',
    assigned_driver_id: null,
    notes: 'Priority retail shipment',
    created_at: new Date().toISOString(),
  },
  {
    id: 'load-2',
    load_number: 'LD-1002',
    broker_name: 'Navisphere Contract',
    broker_email: 'broker2@navispheredemo.com',
    broker_phone: '800-555-0002',
    customer_name: 'Lopez Foods',
    pickup_location: 'Tulsa, OK',
    dropoff_location: 'Kansas City, MO',
    pickup_date: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    delivery_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    equipment_type: 'Reefer',
    weight_lbs: 34000,
    miles: 270,
    rate: 1950,
    status: 'Assigned',
    priority: 'Medium',
    assigned_driver_id: 'driver-2',
    notes: 'Food-grade refrigerated load',
    created_at: new Date().toISOString(),
  },
  {
    id: 'load-3',
    load_number: 'LD-1003',
    broker_name: 'DAT Spot Market',
    broker_email: 'broker3@datdemo.com',
    broker_phone: '800-555-0003',
    customer_name: 'International Paper',
    pickup_location: 'Fort Worth, TX',
    dropoff_location: 'Houston, TX',
    pickup_date: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    delivery_date: new Date(Date.now() + 10 * 60 * 60 * 1000).toISOString(),
    equipment_type: 'Flatbed',
    weight_lbs: 41000,
    miles: 265,
    rate: 1800,
    status: 'In Transit',
    priority: 'Critical',
    assigned_driver_id: 'driver-3',
    notes: 'Late-sensitive manufacturing freight',
    created_at: new Date().toISOString(),
  },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function money(value?: number | null) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value || 0));
}

function shortDate(value?: string | null) {
  if (!value) return '—';
  return new Date(value).toLocaleString();
}

function statusClass(status: string) {
  switch (status) {
    case 'Unassigned':
      return 'border-red-400/30 bg-red-500/10 text-red-200';
    case 'Assigned':
      return 'border-yellow-400/30 bg-yellow-500/10 text-yellow-200';
    case 'Dispatched':
      return 'border-sky-400/30 bg-sky-500/10 text-sky-200';
    case 'In Transit':
      return 'border-blue-400/30 bg-blue-500/10 text-blue-200';
    case 'At Pickup':
      return 'border-purple-400/30 bg-purple-500/10 text-purple-200';
    case 'At Delivery':
      return 'border-indigo-400/30 bg-indigo-500/10 text-indigo-200';
    case 'Delivered':
      return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200';
    case 'Cancelled':
      return 'border-zinc-400/30 bg-zinc-500/10 text-zinc-200';
    case 'Available':
      return 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200';
    case 'Driving':
      return 'border-blue-400/30 bg-blue-500/10 text-blue-200';
    case 'Off Duty':
      return 'border-zinc-400/30 bg-zinc-500/10 text-zinc-200';
    default:
      return 'border-white/10 bg-white/5 text-white/70';
  }
}

function priorityClass(priority: Priority) {
  switch (priority) {
    case 'Low':
      return 'border-zinc-400/30 bg-zinc-500/10 text-zinc-200';
    case 'Medium':
      return 'border-sky-400/30 bg-sky-500/10 text-sky-200';
    case 'High':
      return 'border-yellow-400/30 bg-yellow-500/10 text-yellow-200';
    case 'Critical':
      return 'border-red-400/30 bg-red-500/10 text-red-200';
    default:
      return 'border-white/10 bg-white/5 text-white/70';
  }
}

export default function DispatchPage() {
  const [loads, setLoads] = useState<Load[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  async function fetchData() {
    setLoading(true);

    if (!supabase) {
      setDbReady(false);
      const joined = demoLoads.map((load) => ({
        ...load,
        dispatch_drivers:
          demoDrivers.find((d) => d.id === load.assigned_driver_id) || null,
      }));
      setDrivers(demoDrivers);
      setLoads(joined);
      setSelectedLoad(joined[0] || null);
      setLoading(false);
      return;
    }

    try {
      const [driversRes, loadsRes] = await Promise.all([
        supabase
          .from('dispatch_drivers')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('loads')
          .select(`
            *,
            dispatch_drivers:assigned_driver_id (
              id,
              full_name,
              phone,
              email,
              truck_number,
              equipment_type,
              current_location,
              available,
              status
            )
          `)
          .order('created_at', { ascending: false }),
      ]);

      if (driversRes.error) throw driversRes.error;
      if (loadsRes.error) throw loadsRes.error;

      const dbDrivers = (driversRes.data || []) as Driver[];
      const dbLoads = (loadsRes.data || []) as Load[];

      setDrivers(dbDrivers);
      setLoads(dbLoads);
      setSelectedLoad((current) => {
        if (!dbLoads.length) return null;
        if (!current) return dbLoads[0];
        return dbLoads.find((l) => l.id === current.id) || dbLoads[0];
      });
      setDbReady(true);
    } catch (error) {
      console.error('Dispatch fetch failed:', error);
      setDbReady(false);
      const joined = demoLoads.map((load) => ({
        ...load,
        dispatch_drivers:
          demoDrivers.find((d) => d.id === load.assigned_driver_id) || null,
      }));
      setDrivers(demoDrivers);
      setLoads(joined);
      setSelectedLoad(joined[0] || null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredLoads = useMemo(() => {
    return loads.filter((load) => {
      const haystack = [
        load.load_number,
        load.customer_name,
        load.broker_name,
        load.pickup_location,
        load.dropoff_location,
        load.equipment_type,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchSearch = haystack.includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' ? true : load.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [loads, search, statusFilter]);

  const totalRevenue = loads.reduce((sum, load) => sum + Number(load.rate || 0), 0);
  const activeLoads = loads.filter((l) =>
    ['Assigned', 'Dispatched', 'In Transit', 'At Pickup', 'At Delivery'].includes(l.status)
  ).length;
  const unassignedLoads = loads.filter((l) => l.status === 'Unassigned').length;
  const deliveredLoads = loads.filter((l) => l.status === 'Delivered').length;

  async function createQuickLoad() {
    const payload = {
      load_number: `LD-${Math.floor(1000 + Math.random() * 9000)}`,
      broker_name: 'Manual Entry',
      broker_email: 'ops@boxflowos.com',
      broker_phone: '405-555-9000',
      customer_name: 'New Customer',
      pickup_location: 'Oklahoma City, OK',
      dropoff_location: 'Dallas, TX',
      pickup_date: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      delivery_date: new Date(Date.now() + 16 * 60 * 60 * 1000).toISOString(),
      equipment_type: 'Dry Van',
      weight_lbs: 20000,
      miles: 210,
      rate: 1450,
      status: 'Unassigned' as LoadStatus,
      priority: 'Medium' as Priority,
      notes: 'Quick dispatch load',
    };

    if (!supabase || !dbReady) {
      const localLoad: Load = {
        id: crypto.randomUUID(),
        ...payload,
        assigned_driver_id: null,
        created_at: new Date().toISOString(),
      };
      const next = [localLoad, ...loads];
      setLoads(next);
      setSelectedLoad(localLoad);
      return;
    }

    try {
      const { error } = await supabase.from('loads').insert(payload);
      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Create load failed:', error);
      alert('Could not create quick load.');
    }
  }

  async function assignDriver(loadId: string, driverId: string) {
    setSaving(true);

    if (!supabase || !dbReady) {
      const chosen = drivers.find((d) => d.id === driverId) || null;

      const nextLoads = loads.map((load) =>
        load.id === loadId
          ? {
              ...load,
              assigned_driver_id: driverId,
              status: load.status === 'Unassigned' ? 'Assigned' : load.status,
              dispatch_drivers: chosen,
            }
          : load
      );

      const nextDrivers = drivers.map((driver) =>
        driver.id === driverId
          ? { ...driver, available: false, status: 'Assigned' as DriverStatus }
          : driver
      );

      setLoads(nextLoads);
      setDrivers(nextDrivers);
      setSelectedLoad(nextLoads.find((l) => l.id === loadId) || null);
      setSaving(false);
      return;
    }

    try {
      const { error: loadError } = await supabase
        .from('loads')
        .update({
          assigned_driver_id: driverId,
          status: 'Assigned',
        })
        .eq('id', loadId);

      if (loadError) throw loadError;

      const { error: driverError } = await supabase
        .from('dispatch_drivers')
        .update({
          available: false,
          status: 'Assigned',
        })
        .eq('id', driverId);

      if (driverError) throw driverError;

      await fetchData();
    } catch (error) {
      console.error('Assign driver failed:', error);
      alert('Driver assignment failed.');
    } finally {
      setSaving(false);
    }
  }

  async function updateStatus(loadId: string, status: LoadStatus) {
    setSaving(true);

    if (!supabase || !dbReady) {
      const next = loads.map((load) =>
        load.id === loadId ? { ...load, status } : load
      );
      setLoads(next);
      setSelectedLoad(next.find((l) => l.id === loadId) || null);
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('loads')
        .update({ status })
        .eq('id', loadId);

      if (error) throw error;
      await fetchData();
    } catch (error) {
      console.error('Status update failed:', error);
      alert('Load status update failed.');
    } finally {
      setSaving(false);
    }
  }

  async function aiAssign(load: Load) {
    const exactEquipment = drivers.filter(
      (driver) =>
        driver.available &&
        (driver.equipment_type || '').toLowerCase() ===
          (load.equipment_type || '').toLowerCase()
    );

    const anyAvailable = drivers.filter((driver) => driver.available);
    const pool = exactEquipment.length ? exactEquipment : anyAvailable;

    if (!pool.length) {
      alert('No available drivers found.');
      return;
    }

    await assignDriver(load.id, pool[0].id);
  }

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <div className="border-b border-white/10 bg-white/5 backdrop-blur">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-sky-300/80">
                BoxFlow OS / Phase 25
              </p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Dispatch Command Center
              </h1>
              <p className="mt-2 text-sm text-white/60">
                Manage DAT-style freight flow, driver assignment, and dispatch operations.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={createQuickLoad}
                className="rounded-xl border border-sky-400/30 bg-sky-500/15 px-4 py-2 text-sm font-medium text-sky-200 transition hover:bg-sky-500/25"
              >
                + Quick Load
              </button>
              <button
                onClick={fetchData}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
              >
                Refresh
              </button>
            </div>
          </div>

          {!dbReady && (
            <div className="mt-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-200">
              Demo mode is active because the dispatch tables or env vars are not fully connected yet.
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1800px] px-6 py-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
          <MetricCard title="Total Loads" value={String(loads.length)} />
          <MetricCard title="Active Loads" value={String(activeLoads)} />
          <MetricCard title="Delivered" value={String(deliveredLoads)} />
          <MetricCard title="Unassigned" value={String(unassignedLoads)} />
          <MetricCard title="Revenue" value={money(totalRevenue)} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Dispatch Board</h2>
                <p className="text-sm text-white/50">
                  Loads, routes, customers, brokers, and dispatch status.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search loads, route, customer, broker..."
                  className="w-full rounded-xl border border-white/10 bg-[#0c1227] px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/30 focus:border-sky-400/40 md:w-[300px]"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-white/10 bg-[#0c1227] px-4 py-2.5 text-sm text-white outline-none focus:border-sky-400/40"
                >
                  <option value="All">All Statuses</option>
                  <option value="Unassigned">Unassigned</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="At Pickup">At Pickup</option>
                  <option value="At Delivery">At Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10">
              <div className="hidden grid-cols-[1.2fr_1fr_1fr_0.75fr_0.75fr_0.75fr] gap-3 bg-white/5 px-4 py-3 text-xs uppercase tracking-[0.2em] text-white/40 md:grid">
                <div>Load</div>
                <div>Route</div>
                <div>Customer / Broker</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Rate</div>
              </div>

              {loading ? (
                <div className="px-4 py-12 text-center text-white/50">
                  Loading dispatch board...
                </div>
              ) : filteredLoads.length === 0 ? (
                <div className="px-4 py-12 text-center text-white/50">
                  No loads found.
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {filteredLoads.map((load) => {
                    const selected = selectedLoad?.id === load.id;

                    return (
                      <button
                        key={load.id}
                        onClick={() => setSelectedLoad(load)}
                        className={cn(
                          'grid w-full grid-cols-1 gap-3 px-4 py-4 text-left transition hover:bg-white/5 md:grid-cols-[1.2fr_1fr_1fr_0.75fr_0.75fr_0.75fr]',
                          selected && 'bg-sky-500/10'
                        )}
                      >
                        <div>
                          <div className="font-semibold">{load.load_number}</div>
                          <div className="mt-1 text-xs text-white/40">
                            {load.equipment_type || 'N/A'} • {load.miles || 0} mi
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-white">{load.pickup_location}</div>
                          <div className="text-xs text-white/40">
                            to {load.dropoff_location}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-white">
                            {load.customer_name || '—'}
                          </div>
                          <div className="text-xs text-white/40">
                            {load.broker_name || '—'}
                          </div>
                        </div>

                        <div>
                          <span
                            className={cn(
                              'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                              statusClass(load.status)
                            )}
                          >
                            {load.status}
                          </span>
                        </div>

                        <div>
                          <span
                            className={cn(
                              'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                              priorityClass(load.priority)
                            )}
                          >
                            {load.priority}
                          </span>
                        </div>

                        <div className="font-semibold">{money(load.rate)}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Load Detail</h2>
                <p className="text-sm text-white/50">
                  Assign a driver and move the load through dispatch status.
                </p>
              </div>

              {!selectedLoad ? (
                <div className="rounded-2xl border border-dashed border-white/10 px-4 py-12 text-center text-white/40">
                  Select a load from the dispatch board.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="rounded-2xl border border-white/10 bg-[#0c1227] p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-white/40">
                          Load Number
                        </p>
                        <h3 className="mt-1 text-2xl font-semibold">
                          {selectedLoad.load_number}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <span
                          className={cn(
                            'inline-flex rounded-full border px-3 py-1.5 text-xs font-medium',
                            statusClass(selectedLoad.status)
                          )}
                        >
                          {selectedLoad.status}
                        </span>
                        <span
                          className={cn(
                            'inline-flex rounded-full border px-3 py-1.5 text-xs font-medium',
                            priorityClass(selectedLoad.priority)
                          )}
                        >
                          {selectedLoad.priority}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Info label="Customer" value={selectedLoad.customer_name || '—'} />
                      <Info label="Broker" value={selectedLoad.broker_name || '—'} />
                      <Info label="Pickup" value={selectedLoad.pickup_location} />
                      <Info label="Delivery" value={selectedLoad.dropoff_location} />
                      <Info label="Pickup Time" value={shortDate(selectedLoad.pickup_date)} />
                      <Info label="Delivery Time" value={shortDate(selectedLoad.delivery_date)} />
                      <Info label="Equipment" value={selectedLoad.equipment_type || '—'} />
                      <Info label="Weight" value={`${selectedLoad.weight_lbs || 0} lbs`} />
                      <Info label="Miles" value={`${selectedLoad.miles || 0} mi`} />
                      <Info label="Rate" value={money(selectedLoad.rate)} />
                    </div>

                    <div className="mt-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                        Notes
                      </p>
                      <p className="mt-2 text-sm text-white/70">
                        {selectedLoad.notes || 'No notes added.'}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0c1227] p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h4 className="text-sm font-semibold">Assignment Control</h4>
                      <button
                        onClick={() => aiAssign(selectedLoad)}
                        disabled={saving}
                        className="rounded-xl border border-sky-400/30 bg-sky-500/15 px-3 py-2 text-xs font-medium text-sky-200 transition hover:bg-sky-500/25 disabled:opacity-50"
                      >
                        AI Assign Best Driver
                      </button>
                    </div>

                    <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-white/40">
                      Assign Driver
                    </label>

                    <select
                      value={selectedLoad.assigned_driver_id || ''}
                      onChange={(e) => {
                        if (!e.target.value) return;
                        assignDriver(selectedLoad.id, e.target.value);
                      }}
                      className="w-full rounded-xl border border-white/10 bg-[#09101f] px-4 py-3 text-sm text-white outline-none focus:border-sky-400/40"
                    >
                      <option value="">Select driver...</option>
                      {drivers.map((driver) => (
                        <option key={driver.id} value={driver.id}>
                          {driver.full_name} | {driver.truck_number || 'No Truck'} | {driver.equipment_type || 'N/A'} | {driver.status}
                        </option>
                      ))}
                    </select>

                    <div className="mt-3 rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-white/70">
                      <span className="font-medium text-white">Assigned Driver: </span>
                      {selectedLoad.dispatch_drivers?.full_name || 'Not assigned'}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-[#0c1227] p-4">
                    <h4 className="mb-3 text-sm font-semibold">Status Control</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Unassigned',
                        'Assigned',
                        'Dispatched',
                        'In Transit',
                        'At Pickup',
                        'At Delivery',
                        'Delivered',
                        'Cancelled',
                      ].map((status) => (
                        <button
                          key={status}
                          onClick={() => updateStatus(selectedLoad.id, status as LoadStatus)}
                          disabled={saving}
                          className={cn(
                            'rounded-xl border px-3 py-2 text-sm transition',
                            selectedLoad.status === status
                              ? 'border-sky-400/40 bg-sky-500/15 text-sky-200'
                              : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                          )}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30">
              <div className="mb-4">
                <h2 className="text-xl font-semibold">Driver Availability</h2>
                <p className="text-sm text-white/50">
                  Dispatch-ready drivers and truck units.
                </p>
              </div>

              <div className="space-y-3">
                {drivers.map((driver) => (
                  <div
                    key={driver.id}
                    className="rounded-2xl border border-white/10 bg-[#0c1227] p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold">{driver.full_name}</div>
                        <div className="mt-1 text-xs text-white/40">
                          {driver.truck_number || 'No Truck'} • {driver.equipment_type || 'N/A'}
                        </div>
                        <div className="mt-2 text-sm text-white/60">
                          {driver.current_location || 'Location unavailable'}
                        </div>
                      </div>

                      <span
                        className={cn(
                          'inline-flex rounded-full border px-2.5 py-1 text-xs font-medium',
                          statusClass(driver.status)
                        )}
                      >
                        {driver.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20">
      <p className="text-xs uppercase tracking-[0.25em] text-white/40">{title}</p>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-[0.2em] text-white/40">{label}</p>
      <p className="mt-1 text-sm text-white/80">{value}</p>
    </div>
  );
}