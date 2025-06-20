
import React from 'react';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RatingInputProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const RatingInput: React.FC<RatingInputProps> = ({ rating, onRatingChange }) => {
  const { t } = useLanguage();

  return (
    <div>
      <Label>{t('rating') || 'Rating'} *</Label>
      <div className="flex space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingInput;
