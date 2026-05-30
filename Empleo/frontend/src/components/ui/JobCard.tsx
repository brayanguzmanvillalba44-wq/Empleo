// Tarjeta de vacante usada en el catálogo.
import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, Users, ArrowRight } from 'lucide-react';
import { Job } from '../../types';
import { jobTypeLabel, modalityLabel, formatSalary } from '../../lib/format';

export default function JobCard({ job }: { job: Job }) {
  return (
    <Link to={`/jobs/${job.id}`} className="block">
      <div className="card-hover group cursor-pointer">
        <div className="flex items-start gap-4">
          {/* Inicial del título como avatar */}
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
            <span className="text-primary-700 font-bold text-lg">
              {job.title?.charAt(0) || '?'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                  {job.title}
                </h3>
                {job.category && <p className="text-sm text-gray-500 mt-0.5">{job.category}</p>}
              </div>
              {job.status !== 'ACTIVE' && (
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                  Cerrada
                </span>
              )}
              <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-700 bg-primary-50 px-2.5 py-1 rounded-lg">
                <MapPin className="w-3 h-3" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-accent-700 bg-accent-50 px-2.5 py-1 rounded-lg">
                <DollarSign className="w-3 h-3" />
                {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                <Clock className="w-3 h-3" />
                {jobTypeLabel[job.type] || job.type}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-lg">
                {modalityLabel[job.modality] || job.modality}
              </span>
            </div>

            {job._count && (
              <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                <Users className="w-3.5 h-3.5" />
                <span>{job._count.applications} postulaciones</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
