export default function LandingPage() {
  return (
    <div className="min-h-screen bg-canvas text-forest-dark">
      <nav className="p-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Logo</h1>
        <div className="space-x-4">
          <a href="/login" className="text-leaf-deep hover:underline">Login</a>
          <a href="/register" className="bg-moss-primary text-white px-4 py-2 rounded">Register</a>
        </div>
      </nav>
      <header className="text-center py-20">
        <h2 className="text-5xl font-bold mb-4">Efficient Delivery & Management</h2>
        <button className="bg-forest-dark text-white px-8 py-3 rounded-lg hover:bg-leaf-deep">Get Started</button>
      </header>
    </div>
  );
}
