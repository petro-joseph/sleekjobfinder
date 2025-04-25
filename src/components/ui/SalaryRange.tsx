import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SalaryRangeProps {
    form: any;
}

// Utility to format number with thousand separators
const formatNumber = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, '');
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const SalaryRange: React.FC<SalaryRangeProps> = ({ form }) => {
    const { control, setValue } = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="salaryMin"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minimum Salary</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                placeholder="e.g. 50,000"
                                {...field}
                                onChange={(e) => {
                                    const formatted = formatNumber(e.target.value);
                                    setValue('salaryMin', formatted, { shouldValidate: true });
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="currency"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="USD">USD</SelectItem>
                                <SelectItem value="EUR">EUR</SelectItem>
                                <SelectItem value="GBP">GBP</SelectItem>
                                <SelectItem value="CAD">CAD</SelectItem>
                                <SelectItem value="AUD">AUD</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};