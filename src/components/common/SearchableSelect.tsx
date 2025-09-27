// ==================== src/components/common/SearchableSelect.tsx ====================
// 파일 위치: src/components/common/SearchableSelect.tsx
// 설명: 검색 가능한 셀렉트 컴포넌트
import React, { useState, useMemo } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface Option {
  value: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  onAdd?: () => void;
  addButtonText?: string;
}

export const SearchableSelect = React.memo<SearchableSelectProps>(
  ({
    options,
    value,
    onValueChange,
    placeholder = "선택하세요...",
    searchPlaceholder = "검색...",
    emptyText = "검색 결과가 없습니다.",
    className,
    disabled = false,
    onAdd,
    addButtonText = "새로 추가",
  }) => {
    const [open, setOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");

    const filteredOptions = useMemo(() => {
      if (!searchValue) return options;

      return options.filter(
        (option) =>
          option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
          option.value.toLowerCase().includes(searchValue.toLowerCase()) ||
          (option.sublabel &&
            option.sublabel.toLowerCase().includes(searchValue.toLowerCase()))
      );
    }, [options, searchValue]);

    const selectedOption = useMemo(() => {
      return options.find((option) => option.value === value);
    }, [options, value]);

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("w-full justify-between", className)}
            disabled={disabled}
          >
            {selectedOption ? (
              <div className="flex flex-col items-start">
                <span>{selectedOption.value}</span>
                {selectedOption.sublabel && (
                  <span className="text-sm text-muted-foreground">
                    {selectedOption.sublabel}
                  </span>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">{emptyText}</p>
                  {onAdd && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onAdd}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {addButtonText}
                    </Button>
                  )}
                </div>
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => {
                      onValueChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{option.value}</span>
                      <span className="text-sm text-muted-foreground">
                        {option.label}
                      </span>
                      {option.sublabel && (
                        <span className="text-xs text-muted-foreground">
                          {option.sublabel}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

SearchableSelect.displayName = "SearchableSelect";
