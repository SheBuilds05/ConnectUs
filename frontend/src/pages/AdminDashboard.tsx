export default function Dashboard() {
  return (
    <div className="flex h-screen bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 bg-forest-dark text-white p-6">
        <h1 className="text-xl font-bold mb-10">Admin Portal</h1>
        <ul className="space-y-4">
          <li className="hover:text-sage-accent cursor-pointer">Track Runners</li>
          <li className="hover:text-sage-accent cursor-pointer">Bookings</li>
          <li className="hover:text-sage-accent cursor-pointer">Reviews</li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-bold text-forest-dark mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded shadow border-l-4 border-moss-primary">
            <h3 className="text-sage-accent">Active Runners</h3>
            <p className="text-2xl font-bold">12</p>
          </div>
          {/* Repeat for Bookings/Reviews */}
        </div>
      </main>
    </div>
  );
}
