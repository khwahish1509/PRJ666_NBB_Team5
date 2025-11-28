import { useNavigate } from 'react-router-dom';
import { Stethoscope, MapPin, ArrowRight } from 'lucide-react';

interface ClinicianCardProps {
  title?: string;
  description?: string;
  variant?: 'default' | 'warning' | 'info';
}

export default function ClinicianCard({ 
  title = "Need Professional Consultation?",
  description = "Find qualified dermatologists near you for expert advice and treatment.",
  variant = 'default'
}: ClinicianCardProps) {
  const navigate = useNavigate();

  const variantStyles = {
    default: {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      border: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonBg: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
    },
    warning: {
      bg: 'bg-gradient-to-br from-orange-50 to-red-50',
      border: 'border-orange-200',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonBg: 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700'
    },
    info: {
      bg: 'bg-gradient-to-br from-purple-50 to-pink-50',
      border: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      buttonBg: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className={`${styles.bg} border-2 ${styles.border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <div className="flex items-start gap-4">
        <div className={`${styles.iconBg} p-4 rounded-xl flex-shrink-0`}>
          <Stethoscope className={`${styles.iconColor} w-8 h-8`} />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <button
            onClick={() => navigate('/clinicians')}
            className={`${styles.buttonBg} text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 group`}
          >
            <MapPin className="w-5 h-5" />
            <span>Find Dermatologists Near Me</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
