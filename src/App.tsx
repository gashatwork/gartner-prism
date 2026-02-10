import PrismChart from './components/PrismChart';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-light text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 tracking-tight">
          Gartner Use Case Prism
        </h1>
        <p className="text-slate-400 mt-2">Digital Implementation</p>
      </header>

      <main className="max-w-6xl mx-auto">
        <PrismChart />

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
            <h3 className="text-xl font-semibold mb-4 text-slate-200">Analysis</h3>
            <p className="text-slate-400">
              The chart above visualizes the priority needed for each use case based on Business Value vs Feasibility.
            </p>
          </div>
          {/* List could go here */}
        </div>
      </main>
    </div>
  );
}

export default App;
