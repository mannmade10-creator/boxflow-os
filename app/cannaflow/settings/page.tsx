export default function CannaflowSettings() {
  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <section className="max-w-4xl mx-auto">
        <p className="text-emerald-400 font-semibold">Cannaflow OS</p>
        <h1 className="text-4xl font-bold mb-6">Settings</h1>

        <div className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <h2 className="text-xl font-bold">Business Profile</h2>
            <p className="text-zinc-400 mt-2">Dispensary name, license, address, and owner information.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <h2 className="text-xl font-bold">Metrc Integration</h2>
            <p className="text-zinc-400 mt-2">Connect API credentials when ready.</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5">
            <h2 className="text-xl font-bold">Team Access</h2>
            <p className="text-zinc-400 mt-2">Manage employees, roles, and permissions.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
