import React, { useState } from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronsUpDown, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
    id?: string;
    value: string;
    label: string;
}

interface MultiSelectProps {
    form: any;
    name: string;
    label: string;
    options: Option[];
    placeholder: string;
    checkbox?: boolean;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ form, name, label, options, placeholder, checkbox }) => {
    const [open, setOpen] = useState(false);
    const { control, setValue, watch } = useFormContext();
    const selectedValues = watch(name) || [];

    const handleSelect = (value: string) => {
        const updatedValues = selectedValues.includes(value)
            ? selectedValues.filter((v: string) => v !== value)
            : [...selectedValues, value];
        setValue(name, updatedValues, { shouldValidate: true });
    };

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
                <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                        <div className="space-y-2">
                            {checkbox ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {options.map((option) => (
                                        <FormItem key={option.id || option.value} className="flex items-center space-x-2">
                                            <Checkbox
                                                checked={field.value.includes(option.id || option.value)}
                                                onCheckedChange={() => handleSelect(option.id || option.value)}
                                            />
                                            <span>{option.label}</span>
                                        </FormItem>
                                    ))}
                                </div>
                            ) : (
                                <>
                                    <Popover open={open} onOpenChange={setOpen}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className="w-full justify-between"
                                            >
                                                {selectedValues.length > 0
                                                    ? `${selectedValues.length} selected`
                                                    : placeholder}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-full p-0">
                                            <Command>
                                                <CommandInput placeholder={`Search ${label.toLowerCase()}...`} />
                                                <CommandList>
                                                    <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
                                                    <CommandGroup className="max-h-64 overflow-y-auto">
                                                        {options.map((option) => (
                                                            <CommandItem
                                                                key={option.value}
                                                                value={option.label}
                                                                onSelect={() => {
                                                                    handleSelect(option.value);
                                                                    setOpen(true);
                                                                }}
                                                            >
                                                                <Check
                                                                    className={cn(
                                                                        'mr-2 h-4 w-4',
                                                                        selectedValues.includes(option.value) ? 'opacity-100' : 'opacity-0'
                                                                    )}
                                                                />
                                                                {option.label}
                                                            </CommandItem>
                                                        ))}
                                                    </CommandGroup>
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedValues.map((value: string) => {
                                            const option = options.find(opt => opt.value === value);
                                            return (
                                                <Badge key={value} variant="secondary" className="px-3 py-1">
                                                    {option?.label}
                                                    <X
                                                        className="ml-1 h-3 w-3 cursor-pointer"
                                                        onClick={() => handleSelect(value)}
                                                    />
                                                </Badge>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                />
            </FormControl>
            <FormMessage />
        </FormItem>
    );
};