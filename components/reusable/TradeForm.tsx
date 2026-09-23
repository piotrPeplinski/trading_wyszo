"use client";

import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { FormField } from "@/components/reusable/FormField";
import { InstrumentInput } from "@/components/reusable/InstrumentInput";
import { TradeResultFields } from "@/components/reusable/TradeResultFields";
import { TradeSelectField } from "@/components/reusable/TradeSelectField";
import { TradingViewEmbed } from "@/components/reusable/TradingViewEmbed";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApi } from "@/hooks/useApi";
import {
  OPERATION_LABELS,
  RESULT_LABELS,
  TRADE_FIELD_ORDER,
} from "@/utils/trades/constants";
import type {
  Operation,
  Result,
  Trade,
  TradeFormErrors,
  TradeFormValues,
} from "@/utils/trades/types";
import {
  errorsFromResponse,
  toFormValues,
  toTradePayload,
  today,
  validateTrade,
} from "@/utils/trades/validation";
import { snapshotUrl } from "@/utils/tradingview";

type TradeFormProps = {
  trade?: Trade;
  defaultDate?: string;
  readOnly?: boolean;
  onSaved: () => void;
  onCancel: () => void;
};

export const TradeForm = ({
  trade,
  defaultDate,
  readOnly,
  onSaved,
  onCancel,
}: TradeFormProps) => {
  const api = useApi();
  const [values, setValues] = useState<TradeFormValues>(() =>
    toFormValues(trade, defaultDate)
  );
  const [errors, setErrors] = useState<TradeFormErrors>({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const set = (field: keyof TradeFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const focusFirstError = (found: TradeFormErrors) => {
    const first = TRADE_FIELD_ORDER.find((f) => found[f]);
    if (!first) return;
    formRef.current
      ?.querySelector<HTMLElement>(`[name="${first}"], #field-${first}`)
      ?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const found = validateTrade(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      focusFirstError(found);
      return; // no request goes out
    }

    const payload = toTradePayload(values);
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
  };

  const previewLink = values.link.trim();

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
        <TradeSelectField
          id="field-operation"
          label="Operacja"
          value={values.operation}
          options={OPERATION_LABELS}
          error={errors.operation}
          disabled={readOnly}
          onChange={(v) => set("operation", v as Operation)}
        />
        <TradeSelectField
          id="field-result"
          label="Rezultat"
          value={values.result}
          options={RESULT_LABELS}
          error={errors.result}
          disabled={readOnly}
          onChange={(v) => set("result", v as Result)}
        />
      </div>

      <TradeResultFields
        values={values}
        errors={errors}
        disabled={readOnly}
        onChange={set}
      />

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

      {previewLink && snapshotUrl(previewLink) && (
        <TradingViewEmbed link={previewLink} />
      )}

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
          <Button type="button" variant="secondary" onClick={onCancel} disabled={saving}>
            Anuluj
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Zapisywanie…" : "Zapisz"}
          </Button>
        </div>
      )}
    </form>
  );
};
