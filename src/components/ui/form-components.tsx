import * as React from "react";
import {
  UseFormReturn,
  FieldValues,
  useFieldArray,
  ArrayPath,
  Path,
} from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, X, Check, ChevronsUpDown, Loader2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn, SeparateAndCapitalize, UploadToCloudinary } from "@/lib/utils";
import PaymentButton from "../payment-button";
import { ScrollArea } from "./scroll-area";

export const FormStepper = ({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) => (
  <div className="mb-8">
    <div className="flex justify-between mb-2">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`w-full h-2 rounded ${
            i + 1 <= currentStep ? "bg-purple-500" : "bg-gray-200"
          }`}
        />
      ))}
    </div>
    <p className="text-sm text-gray-500">
      Step {currentStep} of {totalSteps}
    </p>
  </div>
);

export const FormLayout = <T extends FieldValues>({
  children,
  form,
  // onSubmit,
}: {
  children: React.ReactNode;
  form: UseFormReturn<T>;
  // onSubmit: (values: T) => void;
}) => (
  <Form {...form}>
    <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
      {children}
    </form>
  </Form>
);

export const FormActions = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onOpen,
  callbackFn,
  event,
  hasPayment = true,
}: {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  event?: {
    amount: string;
    name: string;
  };
  onOpen: (value: boolean) => void;
  callbackFn: (paymentId: string) => void;
  hasPayment?: boolean;
}) => (
  <div className="flex justify-between mt-8">
    {currentStep > 1 && (
      <Button type="button" variant="outline" onClick={onPrevious}>
        Previous
      </Button>
    )}
    {currentStep < totalSteps ? (
      <Button type="button" onClick={onNext}>
        Next
      </Button>
    ) : hasPayment ? (
      <PaymentButton
        amount={event?.amount!}
        onOpen={onOpen}
        callbackFn={callbackFn}
        eventName={event?.name!}
      />
    ) : (
      <Button type="button" onClick={() => callbackFn("")}>
        Submit Application
      </Button>
    )}
  </div>
);

export const ReviewSection = ({
  title,
  data,
  className,
}: {
  title: string;
  data: Record<string, any>;
  className?: string;
}) => (
  <Card className="mb-4">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <dl
        className={cn(
          "grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2",
          className
        )}
      >
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500 underline underline-offset-1 decoration-gray-400">{`${key}:`}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </CardContent>
  </Card>
);

export const TextInput = ({
  name,
  label,
  placeholder,
  description,
  type = "text",
  disabled = false,
}: {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
  type?: string;
  disabled?: boolean;
}) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input
            placeholder={placeholder}
            type={type}
            className="placeholder:max-sm:text-sm"
            disabled={disabled}
            {...field}
          />
        </FormControl>
        {description && (
          <FormDescription className="max-sm:text-sm">
            {description}
          </FormDescription>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const RadioInput = ({
  name,
  label,
  options,
  description,
}: {
  name: string;
  label: string;
  options: { value: any; label: string }[];
  description?: string;
}) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem className="space-y-3">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <RadioGroup
            onValueChange={field.onChange}
            defaultValue={field.value}
            className="flex flex-col space-y-1"
          >
            {options.map((option) => (
              <FormItem
                key={option.value}
                className="flex items-center space-x-3 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem value={option.value} />
                </FormControl>
                <FormLabel className="font-normal">{option.label}</FormLabel>
              </FormItem>
            ))}
          </RadioGroup>
        </FormControl>
        {description && (
          <FormDescription className="max-sm:text-sm">
            {description}
          </FormDescription>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const TextareaInput = ({
  name,
  label,
  placeholder,
  description,
}: {
  name: string;
  label: string;
  placeholder: string;
  description?: string;
}) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Textarea
            placeholder={placeholder}
            className="placeholder:max-sm:text-sm resize-vertical"
            {...field}
          />
        </FormControl>
        {description && (
          <FormDescription className="max-sm:text-sm">
            {description}
          </FormDescription>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const SelectInput = <T extends FieldValues>({
  name,
  label,
  options,
  description,
}: {
  name: Path<T>;
  label: string;
  options: { value: string; label: string }[];
  description?: string;
}) => (
  <FormField
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <FormControl>
            <SelectTrigger>
              <SelectValue
                className="max-sm:text-sm"
                placeholder={`Select ${label.toLowerCase()}`}
              />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && (
          <FormDescription className="max-sm:text-sm">
            {description}
          </FormDescription>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

export const MultiSelect = ({
  name,
  label,
  options,
  placeholder = "Select...",
  description,
  limit,
  selectAll = false,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  description?: string;
  limit?: number;
  selectAll?: boolean;
}) => {
  return (
    <FormField
      name={name}
      defaultValue={selectAll ? options.map((option) => option.value) : []}
      render={({ field }) => {
        const isLimitReached = limit ? field.value?.length >= limit : false;

        const handleSelectAll = () => {
          if (limit) {
            field.onChange(
              options.slice(0, limit).map((option) => option.value)
            );
          } else {
            field.onChange(options.map((option) => option.value));
          }
        };

        const handleClear = () => {
          field.onChange([]);
        };

        return (
          <FormItem className="flex flex-col">
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value?.length && "text-muted-foreground"
                    )}
                  >
                    {field.value?.length
                      ? `${field.value.length} selected`
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder={placeholder} />
                  <CommandEmpty>No item found.</CommandEmpty>
                  <CommandGroup>
                    <div className="flex justify-between p-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={isLimitReached}
                      >
                        Select All
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleClear}>
                        Clear
                      </Button>
                    </div>
                    <ScrollArea>
                      <CommandList className="max-h-60">
                        {options.map((option) => (
                          <CommandItem
                            key={option.value}
                            className="border-b"
                            onSelect={() => {
                              if (
                                !isLimitReached ||
                                field.value?.includes(option.value)
                              ) {
                                const newValue = field.value?.includes(
                                  option.value
                                )
                                  ? field.value.filter(
                                      (item: string) => item !== option.value
                                    )
                                  : [...(field.value || []), option.value];
                                field.onChange(newValue);
                              }
                            }}
                            disabled={
                              isLimitReached &&
                              !field.value?.includes(option.value)
                            }
                          >
                            <Check
                              className={cn(
                                "size-4",
                                field.value?.includes(option.value)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <span>{option.label}</span>
                          </CommandItem>
                        ))}
                      </CommandList>
                    </ScrollArea>
                  </CommandGroup>
                </Command>
                {isLimitReached && (
                  <p className="text-sm text-muted-foreground p-2 text-center">
                    Selection limit reached. No more selections allowed.
                  </p>
                )}
              </PopoverContent>
            </Popover>
            {description && (
              <FormDescription className="max-sm:text-sm">
                {description}
              </FormDescription>
            )}
            <FormMessage />
            {field.value?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((item: string) => (
                  <Badge key={item} variant="secondary">
                    {options.find((option) => option.value === item)?.label}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-2"
                      onClick={() => {
                        const newValue = field.value.filter(
                          (value: string) => value !== item
                        );
                        field.onChange(newValue);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export const FileInput = ({
  name,
  label,
  accept,
  description,
  onFileSelect,
}: {
  name: string;
  label: string;
  accept: string;
  description?: string;
  onFileSelect?: (file: File) => Promise<void>;
}) => {
  const [isUploading, setIsUploading] = React.useState<boolean>(false);

  return (
    <FormField
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                type="file"
                accept={accept}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file && onFileSelect) {
                    setIsUploading(true);
                    try {
                      await onFileSelect(file);
                    } finally {
                      setIsUploading(false);
                    }
                  }
                  // onChange(e);
                }}
                disabled={isUploading}
                {...field}
              />
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                  <Loader2 className="size-6 animate-spin" />
                </div>
              )}
            </div>
          </FormControl>
          {description && (
            <FormDescription className="max-sm:text-sm">
              {description}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export function MultiFileUpload({
  name,
  label,
  form,
}: {
  name: string;
  label: string;
  form: any;
}) {
  const [uploadedFiles, setUploadedFiles] = React.useState<string[]>([]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const { success, url } = await UploadToCloudinary(file);
        if (success && url) {
          setUploadedFiles((prev) => [...prev, url]);
          const currentValue = form.getValues(name) || [];
          form.setValue(name, [...currentValue, url]);
        }
      }
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    form.setValue(name, newFiles);
  };

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="space-y-4">
            <Input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
            />
            <div className="grid grid-cols-2 gap-4 mt-4">
              {uploadedFiles.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => removeFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DatePicker({
  className,
  onChange,
  name,
  label,
  placeholder,
}: {
  className?: string;
  onChange: (date: Date | undefined) => void;
  name: string;
  label: string;
  placeholder: string;
}) {
  const [date, setDate] = React.useState<Date>();
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedYear, setSelectedYear] = React.useState<number>();
  const [selectedMonth, setSelectedMonth] = React.useState<number>();

  const handleSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setSelectedYear(selectedDate.getFullYear());
      setSelectedMonth(selectedDate.getMonth());
    }
    onChange(selectedDate);
  };

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  React.useEffect(() => {
    if (date) {
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth());
    }
  }, [date]);

  return (
    <FormField
      name={name}
      render={() => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  className
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex items-center justify-between p-3">
                <Select
                  value={selectedYear?.toString()}
                  onValueChange={(value) => {
                    const year = parseInt(value);
                    setSelectedYear(year);
                    const newDate = new Date(date || new Date());
                    newDate.setFullYear(year);
                    handleSelect(newDate);
                  }}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select
                  value={months[selectedMonth || 0]}
                  onValueChange={(value) => {
                    const monthIndex = months.indexOf(value);
                    setSelectedMonth(monthIndex);
                    const newDate = new Date(date || new Date());
                    newDate.setMonth(monthIndex);
                    handleSelect(newDate);
                  }}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
                month={
                  date ||
                  new Date(
                    selectedYear || new Date().getFullYear(),
                    selectedMonth || 0
                  )
                }
                onMonthChange={(newMonth) => {
                  setSelectedMonth(newMonth.getMonth());
                  setSelectedYear(newMonth.getFullYear());
                }}
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export const MemberDetails = <T extends FieldValues>({
  prefix,
  label,
  description,
  canRemove = false,
  onRemove,
  schema,
}: {
  prefix: string;
  label: string;
  description?: string;
  canRemove?: boolean;
  onRemove?: () => void;
  schema: z.ZodObject<any>;
}) => {
  const shape = schema.shape;

  return (
    <Card className="mb-4">
      <CardHeader className="flex items-center flex-row pb-0">
        <CardTitle className="flex-1 mb-2">{label}</CardTitle>
        {canRemove && (
          <Button variant="destructive" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
        <CardDescription>
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(shape).map(([fieldName, fieldSchema]) => {
          const name = `${prefix}.${fieldName}` as Path<T>;

          fieldName = SeparateAndCapitalize(fieldName);

          if (fieldSchema instanceof z.ZodString) {
            if (fieldSchema.description === "file") {
              return (
                <FileInput
                  key={name}
                  name={name}
                  label={fieldName}
                  accept="*/*"
                />
              );
            } else if (fieldSchema.description === "textarea") {
              return (
                <TextareaInput
                  key={name}
                  name={name}
                  label={fieldName}
                  placeholder={`Enter ${fieldName.toLowerCase()}`}
                />
              );
            } else if (fieldName.toLowerCase().includes("proof")) {
              return (
                <TextInput
                  key={name}
                  name={name}
                  label={fieldName}
                  placeholder={`Enter ${fieldName.toLowerCase()}`}
                  description={fieldSchema.description}
                />
              );
            } else {
              return (
                <TextInput
                  key={name}
                  name={name}
                  label={fieldName}
                  placeholder={`Enter ${fieldName.toLowerCase()}`}
                />
              );
            }
          } else if (fieldSchema instanceof z.ZodEnum) {
            const options = fieldSchema._def.values.map((value: string) => ({
              value,
              label: value,
            }));
            if (options.length <= 3) {
              return (
                <RadioInput
                  key={name}
                  name={name}
                  label={fieldName}
                  options={options}
                />
              );
            } else {
              return (
                <SelectInput
                  key={name}
                  name={name}
                  label={fieldName}
                  options={options}
                />
              );
            }
          } else if (fieldSchema instanceof z.ZodNumber) {
            return (
              <TextInput
                key={name}
                name={name}
                label={fieldName}
                placeholder={`Enter ${fieldName.toLowerCase()}`}
                type="number"
              />
            );
          } else if (fieldSchema instanceof z.ZodArray) {
            const options = fieldSchema._def.type._def.values.map(
              (value: string) => ({
                value,
                label: value,
              })
            );
            return (
              <MultiSelect
                key={name}
                name={name}
                label={fieldName}
                options={options}
                placeholder={`Select ${fieldName.toLowerCase()}`}
              />
            );
          }
          return null;
        })}
      </CardContent>
    </Card>
  );
};

export const InfiniteMemberDetails = <T extends FieldValues>({
  name,
  label,
  description,
  schema,
  form,
}: {
  name: ArrayPath<T>;
  label: string;
  description?: string;
  schema: z.ZodObject<any>;
  form: UseFormReturn<T>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: name,
  });

  function appendMember() {
    append(
      Object.fromEntries(
        Object.keys(schema.shape).map((key) => [key, ""])
      ) as any
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{label}</h3>
        <Button type="button" onClick={appendMember}>
          Add Member
        </Button>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
      )}
      {fields.map((field, index) => (
        <MemberDetails
          key={field.id}
          prefix={`${name}.${index}`}
          label={`${label} ${index + 1}`}
          canRemove={index > 0}
          onRemove={() => remove(index)}
          schema={schema}
        />
      ))}
    </div>
  );
};
