import React, { useState } from 'react';
import { X, Send, CheckCircle2, Info } from 'lucide-react';
import { ElevatorConfiguration, QuoteFormData } from '../../types/elevator';
import ascensorLogo from '../../assets/ascensor-logo.png';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ElevatorConfiguration;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [formData, setFormData] = useState<QuoteFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    projectCity: '',
    buildingType: 'commercial',
    estimatedTimeline: '3_6_months',
    notes: '',
    privacyConsent: false,
    marketingOptIn: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.firstName.trim()) errs.firstName = 'First name is required';
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email format';
    }
    if (!formData.projectCity.trim()) errs.projectCity = 'City / Location is required';
    if (!formData.privacyConsent) errs.privacyConsent = 'You must accept the terms';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
  };

  const handleResetModal = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-sm animate-fadeIn font-sans"
    >
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={handleResetModal}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          /* Submission Success State */
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-900 flex items-center justify-center mb-4 border border-stone-200">
              <CheckCircle2 className="w-7 h-7 stroke-[2]" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 tracking-tight font-sans">
              Quotation Request Registered
            </h3>
            <p className="text-sm font-barlow font-semibold text-stone-600 mt-1">
              Configuration Reference: {config.configId}
            </p>

            <div className="mt-4 p-4 rounded-xl bg-stone-50 border border-stone-200 text-left text-xs text-stone-600 space-y-2 max-w-md font-sans">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-stone-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <span className="font-semibold text-stone-900">Local Studio Session:</span> In accordance with client confidentiality and privacy protocols, your specifications have been securely recorded in local session state.
                </p>
              </div>
              <div className="border-t border-stone-200 pt-2 text-[11px] text-stone-600 font-barlow">
                <p><span className="font-medium text-stone-900">Project Lead:</span> {formData.firstName} {formData.lastName} ({formData.email})</p>
                <p><span className="font-medium text-stone-900">Location:</span> {formData.projectCity}</p>
                <p><span className="font-medium text-stone-900">Dimensions:</span> {config.dimensions.widthMm} × {config.dimensions.depthMm} mm ({config.dimensions.capacityKg} kg)</p>
              </div>
            </div>

            <button
              onClick={handleResetModal}
              className="mt-6 px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-sm transition active:scale-95 font-sans"
            >
              Return to Studio
            </button>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img src={ascensorLogo} alt="Ascensor" className="w-6 h-6 object-contain" />
                <span className="text-[11px] font-barlow font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200/80">
                  CONFIG REF: {config.configId}
                </span>
              </div>
              <h3 className="text-xl font-bold text-stone-900 tracking-tight font-sans">
                Request a Project Quotation & Drawing Pack
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed font-sans">
                Obtain certified shaft engineering drawings, fabrication lead times, and comprehensive commercial pricing for this cabin design.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* First Name */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="e.g. Elena"
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-stone-900 focus:outline-none focus:ring-1 ${
                    errors.firstName
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                />
                {errors.firstName && (
                  <p className="text-[10px] text-red-600 mt-0.5 font-sans">{errors.firstName}</p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="e.g. Vance"
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-stone-900 focus:outline-none focus:ring-1 ${
                    errors.lastName
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                />
                {errors.lastName && (
                  <p className="text-[10px] text-red-600 mt-0.5 font-sans">{errors.lastName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  Corporate / Contact Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="architect@studio.com"
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-stone-900 focus:outline-none focus:ring-1 ${
                    errors.email
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                />
                {errors.email && (
                  <p className="text-[10px] text-red-600 mt-0.5 font-sans">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  Phone (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  Architectural Practice / Developer
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Studio Architecture Ltd."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:border-stone-900"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  Project City / Location *
                </label>
                <input
                  type="text"
                  value={formData.projectCity}
                  onChange={(e) => setFormData({ ...formData, projectCity: e.target.value })}
                  placeholder="e.g. Zurich / London"
                  className={`w-full px-3 py-2 rounded-lg border text-xs text-stone-900 focus:outline-none focus:ring-1 ${
                    errors.projectCity
                      ? 'border-red-400 focus:ring-red-400'
                      : 'border-stone-300 focus:ring-stone-900 focus:border-stone-900'
                  }`}
                />
                {errors.projectCity && (
                  <p className="text-[10px] text-red-600 mt-0.5 font-sans">{errors.projectCity}</p>
                )}
              </div>
            </div>

            {/* Building Type & Timeline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  Building Typology
                </label>
                <select
                  value={formData.buildingType}
                  onChange={(e) => setFormData({ ...formData, buildingType: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                >
                  <option value="commercial">Commercial Office</option>
                  <option value="residential">Residential Apartment</option>
                  <option value="hospital">Hospital & Healthcare</option>
                  <option value="hotel">Hospitality & Hotel</option>
                  <option value="industrial">Industrial Logistics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                  Expected Timeline
                </label>
                <select
                  value={formData.estimatedTimeline}
                  onChange={(e) => setFormData({ ...formData, estimatedTimeline: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900 bg-white"
                >
                  <option value="immediate">Immediate (&lt; 3 Months)</option>
                  <option value="3_6_months">3 - 6 Months</option>
                  <option value="6_12_months">6 - 12 Months</option>
                  <option value="planning_only">Design / Tender Phase</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1 font-sans">
                Project Notes & Structural Shaft Parameters (Optional)
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Mention pit depth, machine room overhead, or specific local codes..."
                className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            {/* Privacy Checkbox */}
            <div className="space-y-2 pt-1 border-t border-stone-100">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacyConsent}
                  onChange={(e) => setFormData({ ...formData, privacyConsent: e.target.checked })}
                  className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <span className="text-[11px] text-stone-600 leading-snug font-sans">
                  I agree to have these design specifications processed for the generation of technical engineering proposals. *
                </span>
              </label>
              {errors.privacyConsent && (
                <p className="text-[10px] text-red-600 font-sans">{errors.privacyConsent}</p>
              )}

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.marketingOptIn}
                  onChange={(e) => setFormData({ ...formData, marketingOptIn: e.target.checked })}
                  className="mt-0.5 rounded border-stone-300 text-stone-900 focus:ring-stone-900"
                />
                <span className="text-[11px] text-stone-500 leading-snug font-sans">
                  Keep me updated with new architectural finishes, BIM Revit components, and sustainability certifications.
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleResetModal}
                className="px-4 py-2.5 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 transition font-sans"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-sm transition flex items-center gap-2 active:scale-95 font-sans"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Quotation Request</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
