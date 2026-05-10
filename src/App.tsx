import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { AnalysisPage } from './pages/AnalysisPage'
import { CouponPage } from './pages/CouponPage'
import { DashboardPage } from './pages/DashboardPage'
import { LandingPage } from './pages/LandingPage'
import { ImportPage } from './pages/ImportPage'
import { PipelinePage } from './pages/PipelinePage'
import { ReviewPage } from './pages/ReviewPage'

function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}

function AppShell() {
  const { pathname } = useLocation()

  return (
    <div className={`min-h-screen text-slate-900 ${pathname === '/' ? 'bg-white' : 'bg-[#0038FF]'}`}>
      {pathname !== '/' && <Navbar />}
      <div className={pathname === '/' ? '' : 'min-h-screen bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] pt-28 md:pt-32'}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/import" element={<ImportPage />} />
          <Route path="/pipeline" element={<PipelinePage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/coupon" element={<CouponPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
