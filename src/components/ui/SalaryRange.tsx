import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface SalaryRangeProps {
    form: any;
}

export const SalaryRange: React.FC<SalaryRangeProps> = ({ form }) => {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={control}
                name="salaryMin"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Minimum Salary (USD)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min="0"
                                placeholder="e.g. 50000"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="salaryMax"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Maximum Salary (USD)</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min="0"
                                placeholder="e.g. 100000"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};