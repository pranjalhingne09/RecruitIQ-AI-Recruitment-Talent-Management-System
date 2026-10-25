import React from 'react';
import { Badge } from '../common/Badge';
import {
  Clock,
  Search,
  CheckCircle2,
  Calendar,
  Gift,
  Trophy,
  XCircle,
  Undo2,
} from 'lucide-react';

export const StatusBadge = ({ status, size = 'sm' }) => {
  const config = {
    APPLIED: {
      label: 'Applied',
      variant: 'primary',
      icon: Clock,
    },
    UNDER_REVIEW: {
      label: 'Under Review',
      variant: 'purple',
      icon: Search,
    },
    SHORTLISTED: {
      label: 'Shortlisted',
      variant: 'cyan',
      icon: CheckCircle2,
    },
    INTERVIEW_SCHEDULED: {
      label: 'Interviewing',
      variant: 'primary',
      icon: Calendar,
    },
    OFFERED: {
      label: 'Offer Extended',
      variant: 'warning',
      icon: Gift,
    },
    HIRED: {
      label: 'Hired',
      variant: 'success',
      icon: Trophy,
    },
    REJECTED: {
      label: 'Not Selected',
      variant: 'danger',
      icon: XCircle,
    },
    WITHDRAWN: {
      label: 'Withdrawn',
      variant: 'default',
      icon: Undo2,
    },
  };

  const item = config[status] || {
    label: status || 'Unknown',
    variant: 'default',
    icon: Clock,
  };

  return (
    <Badge variant={item.variant} size={size} icon={item.icon}>
      {item.label}
    </Badge>
  );
};
