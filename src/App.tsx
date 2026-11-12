import React, { useState, useEffect } from 'react';
import { ElevatorConfiguration } from './types/elevator';
import { INITIAL_CONFIGURATION } from './data/presets';
import { loadStoredConfiguration, saveStoredConfiguration, clearStoredConfiguration } from './utils/storage';
import { generateConfigurationPDF } from './utils/pdfGenerator';
import { Header } from './components/layout/Header';
import { StepNavigation } from './components/layout/StepNavigation';
import { ElevatorCanvas } from './components/viewer/ElevatorCanvas';
import { Step1Presets } from './components/steps/Step1Presets';
import { Step2Dimensions } from './components/steps/Step2Dimensions';
import { Step3Walls } from './components/steps/Step3Walls';
import { Step4FloorsCeiling } from './components/steps/Step4FloorsCeiling';
import { Step5Fittings } from './components/steps/Step5Fittings';
import { Step6Summary } from './components/steps/Step6Summary';
import { QuoteModal } from './components/quote/QuoteModal';

export function App() {
  const [config, setConfig] = useState<ElevatorConfiguration>(() => {
    const stored = loadStoredConfiguration();
    return {
      ...stored,
      doorsOpen: true,
    };
  });
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isQuoteOpen, setIsQuoteOpen] = useState<boolean>(false);

  // Auto-persist configuration changes
  useEffect(() => {
    saveStoredConfiguration(config);
  }, [config]);

  const handleUpdateConfig = (partial: Partial<ElevatorConfiguration>) => {
    setConfig((prev) => ({
      ...prev,
      ...partial,
      lastUpdated: new Date().toISOString(),
    }));
  };

  const handleReset = () => {
    clearStoredConfiguration();
    const fresh: ElevatorConfiguration = {
      ...INITIAL_CONFIGURATION,
      doorsOpen: true,
      configId: 'DYE-' + Math.floor(100000 + Math.random() * 900000),
      lastUpdated: new Date().toISOString(),
    };
    setConfig(fresh);
    setCurrentStep(1);
  };

  const handleDownloadPdf = () => {
    generateConfigurationPDF(config);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-stone-900 flex flex-col font-sans selection:bg-stone-900 selection:text-white">
      {/* Top Application Header */}
      <Header
        config={config}
        onReset={handleReset}
        onOpenQuote={() => setIsQuoteOpen(true)}
        onDownloadPdf={handleDownloadPdf}
      />

      {/* Step Navigation Bar */}
      <StepNavigation
        currentStep={currentStep}
        onSelectStep={(step) => setCurrentStep(step)}
      />

      {/* Main Studio Workspace Layout */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1740px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start h-full">
          {/* Left Column: Interactive 3D Real-time Canvas (7 cols on large screens) */}
          <div className="lg:col-span-7 xl:col-span-7 sticky top-28 h-[480px] sm:h-[580px] lg:h-[calc(100vh-140px)] w-full">
            <ElevatorCanvas
              config={config}
              onUpdateConfig={handleUpdateConfig}
            />
          </div>

          {/* Right Column: Step Customizer Wizard Panel (5 cols) */}
          <div className="lg:col-span-5 xl:col-span-5 bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-200/90 min-h-[520px] flex flex-col justify-between">
            <div>
              {currentStep === 1 && (
                <Step1Presets
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onNext={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 2 && (
                <Step2Dimensions
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onNext={() => setCurrentStep(3)}
                  onPrev={() => setCurrentStep(1)}
                />
              )}

              {currentStep === 3 && (
                <Step3Walls
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onNext={() => setCurrentStep(4)}
                  onPrev={() => setCurrentStep(2)}
                />
              )}

              {currentStep === 4 && (
                <Step4FloorsCeiling
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onNext={() => setCurrentStep(5)}
                  onPrev={() => setCurrentStep(3)}
                />
              )}

              {currentStep === 5 && (
                <Step5Fittings
                  config={config}
                  onUpdateConfig={handleUpdateConfig}
                  onNext={() => setCurrentStep(6)}
                  onPrev={() => setCurrentStep(4)}
                />
              )}

              {currentStep === 6 && (
                <Step6Summary
                  config={config}
                  onGoToStep={(s) => setCurrentStep(s)}
                  onDownloadPdf={handleDownloadPdf}
                  onOpenQuote={() => setIsQuoteOpen(true)}
                  onPrev={() => setCurrentStep(5)}
                />
              )}
            </div>

            {/* Bottom Status strip */}
            <div className="mt-8 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-barlow">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Auto-saved to local browser storage</span>
              </span>
              <span>Ascensor · Highest Quality Performance · Design Your Elevator</span>
            </div>
          </div>
        </div>
      </main>

      {/* Quote Request Modal Dialog */}
      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        config={config}
      />
    </div>
  );
}

export default App;
