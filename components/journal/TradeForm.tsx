"use client";

import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { useApi } from "@/hooks/useApi";
import { FormField } from "@/components/journal/FormField";
import { InstrumentInput } from "@/components/journal/InstrumentInput";
import { TradingViewEmbed } from "@/components/journal/TradingViewEmbed";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  OPERATION_LABELS,
  RESULT_LABELS,
  type Operation,
  type Result,
  type Trade,
} from "@/utils/trades";
import { snapshotUrl } from "@/utils/tradingview";

type Values = {
  date: string;
  instrument: string;
  interval: string;
  operation: Operation | "";
  result: Result | "";
  result_percentage: string;
  result_amount: string;
  result_rr: string;
  link: string;
  description: string;
  error_desc: string;
};

export type Errors = Partial<Record<keyof Values, string>>;

const today = () => new Date().toISOString().slice(0, 10);

function toValues(trade?: Trade, defaultDate?: string): Values {
  return {
    date: trade?.date ?? defaultDate ?? today(),
    instrument: trade?.instrument ?? "",
    interval: trade?.interval ?? "",
    operation: trade?.operation ?? "",
    result: trade?.result ?? "",
    result_percentage: trade ? String(trade.result_percentage) : "",
    result_amount: trade ? String(trade.result_amount) : "",
    result_rr: trade ? String(trade.result_rr) : "",
    link: trade?.link ?? "",
    description: trade?.description ?? "",
    error_desc: trade?.error_desc ?? "",
  };
}

/** Pure — no state, no requests. Submit is blocked while this returns anything. */
export function validateTrade(v: Values): Errors {
  const errors: Errors = {};

  if (!v.date.trim()) {
    errors.date = "Data jest wymagana.";
  } else if (Number.isNaN(Date.parse(v.date))) {
    errors.date = "Nieprawidłowy format daty.";
  } else if (v.date > today()) {
    errors.date = "Data nie może być z przyszłości.";
  }

  const instrument = v.instrument.trim();
  if (!instrument) errors.instrument = "Instrument jest wymagany.";
  else if (instrument.length > 128)
    errors.instrument = "Instrument może mieć maksymalnie 128 znaków.";

  const interval = v.interval.trim();
  if (!interval) errors.interval = "Interwał jest wymagany.";
  else if (interval.length > 32)
    errors.interval = "Interwał może mieć maksymalnie 32 znaki.";

  if (!v.operation) errors.operation = "Wybierz operację.";
  if (!v.result) errors.result = "Wybierz rezultat.";

  const numeric = [
    ["result_percentage", "Wynik %"],
    ["result_amount", "Wynik $"],
    ["result_rr", "RR"],
  ] as const;

  for (const [field, label] of numeric) {
    const raw = v[field].trim();
    if (!raw) {
      errors[field] = `${label} jest wymagany.`;
    } else if (Number.isNaN(Number(raw))) {
      errors[field] = `${label} musi być liczbą.`;
    }
  }

  if (!errors.result_rr && Number(v.result_rr) < 0)
    errors.result_rr = "RR nie może być ujemne.";

  const link = v.link.trim();
  if (link && !/^https?:\/\//i.test(link))
    errors.link = "Link musi zaczynać się od http:// lub https://.";

  return errors;
}

/** FastAPI 422 bodies are [{loc:["body","field"], msg}] — never show that raw. */
function errorsFromResponse(error: unknown): Errors {
  if (!axios.isAxiosError(error)) return {};
  const detail = error.response?.data?.detail;
  if (!Array.isArray(detail)) return {};

  const mapped: Errors = {};
  for (const item of detail) {
    const field = Array.isArray(item?.loc)
      ? (item.loc[item.loc.length - 1] as keyof Values)
      : undefined;
    if (field && typeof item?.msg === "string" && !mapped[field]) {
      mapped[field] = item.msg;
    }
  }
  return mapped;
}

const FIELD_ORDER: (keyof Values)[] = [
  "date",
  "instrument",
  "interval",
  "operation",
  "result",
  "result_percentage",
  "result_amount",
  "result_rr",
  "link",
  "description",
  "error_desc",
];

type TradeFormProps = {
  trade?: Trade;
  defaultDate?: string;
  readOnly?: boolean;
  onSaved: () => void;
  onCancel: () => void;
};

export function TradeForm({
  trade,
  defaultDate,
  readOnly,
  onSaved,
  onCancel,
}: TradeFormProps) {
  const api = useApi();
  const [values, setValues] = useState<Values>(() =>
    toValues(trade, defaultDate)
  );
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = <K extends keyof Values>(field: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const focusFirstError = (found: Errors) => {
    const first = FIELD_ORDER.find((f) => found[f]);
    if (!first) return;
    formRef.current
      ?.querySelector<HTMLElement>(`[name="${first}"], #field-${first}`)
      ?.focus();
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    const found = validateTrade(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstError(found);
      return; // no request goes out
    }

    const payload = {
      date: values.date,
      instrument: values.instrument.trim(),
      interval: values.interval.trim(),
      operation: values.operation,
      result: values.result,
      result_percentage: Number(values.result_percentage),
      result_amount: Number(values.result_amount),
      result_rr: Number(values.result_rr),
      link: values.link.trim() || null,
      description: values.description.trim() || null,
      error_desc: values.error_desc.trim() || null,
    };

    setSaving(true);
    try {
      if (trade) {
        await api.patch(`/trades/${trade.id}`, payload);
        toast.success(`Zaktualizowano pozycję ${payload.instrument}.`);
      } else {
        await api.post("/trades", payload);
        toast.success(`Dodano pozycję ${payload.instrument}.`);
      }
      onSaved();
    } catch (error) {
      const mapped = errorsFromResponse(error);
      if (Object.keys(mapped).length > 0) {
        setErrors(mapped);
        focusFirstError(mapped);
      } else {
        setFormError("Nie udało się zapisać pozycji. Spróbuj ponownie.");
        toast.error("Nie udało się zapisać pozycji.");
      }
    } finally {
      setSaving(false);
    }
  }

  const previewLink = values.link.trim();
  const showPreview = previewLink && snapshotUrl(previewLink);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FormField label="Data" htmlFor="field-date" error={errors.date} required>
        <Input
          id="field-date"
          name="date"
          type="date"
          max={today()}
          disabled={readOnly}
          aria-invalid={errors.date ? true : undefined}
          value={values.date}
          onChange={(e) => set("date", e.target.value)}
        />
      </FormField>

      <FormField
        label="Instrument"
        htmlFor="field-instrument"
        error={errors.instrument}
        required
      >
        <InstrumentInput
          id="field-instrument"
          value={values.instrument}
          disabled={readOnly}
          error={errors.instrument}
          onChange={(v) => set("instrument", v)}
        />
      </FormField>

      <FormField
        label="Interwał"
        htmlFor="field-interval"
        error={errors.interval}
        required
      >
        <Input
          id="field-interval"
          name="interval"
          placeholder="M15, H1, H4…"
          disabled={readOnly}
          aria-invalid={errors.interval ? true : undefined}
          value={values.interval}
          onChange={(e) => set("interval", e.target.value)}
        />
      </FormField>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="Operacja"
          htmlFor="field-operation"
          error={errors.operation}
          required
        >
          <Select
            value={values.operation}
            disabled={readOnly}
            onValueChange={(v) => set("operation", v as Operation)}
          >
            <SelectTrigger id="field-operation" className="w-full">
              <SelectValue placeholder="Wybierz…" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(OPERATION_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField
          label="Rezultat"
          htmlFor="field-result"
          error={errors.result}
          required
        >
          <Select
            value={values.result}
            disabled={readOnly}
            onValueChange={(v) => set("result", v as Result)}
          >
            <SelectTrigger id="field-result" className="w-full">
              <SelectValue placeholder="Wybierz…" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RESULT_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {(
          [
            ["result_percentage", "Wynik %"],
            ["result_amount", "Wynik $"],
            ["result_rr", "RR"],
          ] as const
        ).map(([field, label]) => (
          <FormField
            key={field}
            label={label}
            htmlFor={`field-${field}`}
            error={errors[field]}
            required
          >
            <Input
              id={`field-${field}`}
              name={field}
              type="number"
              step="0.01"
              disabled={readOnly}
              aria-invalid={errors[field] ? true : undefined}
              value={values[field]}
              onChange={(e) => set(field, e.target.value)}
            />
          </FormField>
        ))}
      </div>

      <FormField
        label="Link"
        htmlFor="field-link"
        error={errors.link}
        hint="Wklej link do snapshotu TradingView (https://www.tradingview.com/x/...)"
      >
        <Input
          id="field-link"
          name="link"
          type="url"
          disabled={readOnly}
          aria-invalid={errors.link ? true : undefined}
          value={values.link}
          onChange={(e) => set("link", e.target.value)}
        />
      </FormField>

      {showPreview && <TradingViewEmbed link={previewLink} />}

      <FormField label="Opis" htmlFor="field-description">
        <Textarea
          id="field-description"
          name="description"
          rows={4}
          disabled={readOnly}
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </FormField>

      <div className="border-t border-border pt-5">
        <FormField
          label="Czy popełniłem błąd?"
          htmlFor="field-error_desc"
          hint="Najcenniejsze pole w dzienniku — opisz, co poszło nie tak."
        >
          <Textarea
            id="field-error_desc"
            name="error_desc"
            rows={3}
            disabled={readOnly}
            value={values.error_desc}
            onChange={(e) => set("error_desc", e.target.value)}
          />
        </FormField>
      </div>

      {formError && (
        <p role="alert" className="text-sm text-red">
          {formError}
        </p>
      )}

      {!readOnly && (
        <div className="flex justify-end gap-2 border-t border-border pt-5">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Anuluj
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Zapisywanie…" : "Zapisz"}
          </Button>
        </div>
      )}
    </form>
  );
}
