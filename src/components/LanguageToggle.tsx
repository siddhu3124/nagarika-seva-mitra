
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger className="w-[100px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="telugu">తెలుగు</SelectItem>
        <SelectItem value="english">English</SelectItem>
        <SelectItem value="urdu">اردو</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default LanguageToggle;
