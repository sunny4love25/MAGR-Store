import { Globe } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useCurrency, Currency } from '../contexts/CurrencyContext';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Select value={currency} onValueChange={(value) => setCurrency(value as Currency)}>
        <SelectTrigger className="w-[100px] border-none focus:ring-0 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USD">USD $</SelectItem>
          <SelectItem value="EUR">EUR €</SelectItem>
          <SelectItem value="GBP">GBP £</SelectItem>
          <SelectItem value="NGN">NGN ₦</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
