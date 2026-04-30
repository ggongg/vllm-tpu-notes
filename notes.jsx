import { useState } from "react";

const TPU_CHIPS = [
  {
    id: "v5e-1",
    name: "v5e-1",
    gen: "v5e",
    chips: 1,
    hbm_per_chip: 16,
    total_hbm: 16,
    price_on_demand: 1.20,
    price_1yr: 0.84,
    price_3yr: 0.54,
    topology: "single",
    available: true,
    notes: "Testing and small models only",
  },
  {
    id: "v5e-4",
    name: "v5e-4",
    gen: "v5e",
    chips: 4,
    hbm_per_chip: 16,
    total_hbm: 64,
    price_on_demand: 4.80,
    price_1yr: 3.36,
    price_3yr: 2.16,
    topology: "2x2",
    available: true,
    notes: "Good for 7B–13B models",
  },
  {
    id: "v5e-8",
    name: "v5e-8",
    gen: "v5e",
    chips: 8,
    hbm_per_chip: 16,
    total_hbm: 128,
    price_on_demand: 9.60,
    price_1yr: 6.72,
    price_3yr: 4.32,
    topology: "2x4",
    available: true,
    notes: "Optimized for single-host inference",
  },
  {
    id: "v6e-1",
    name: "v6e-1",
    gen: "v6e",
    chips: 1,
    hbm_per_chip: 32,
    total_hbm: 32,
    price_on_demand: 2.70,
    price_1yr: 1.89,
    price_3yr: 1.22,
    topology: "single",
    available: true,
    notes: "Testing only",
  },
  {
    id: "v6e-4",
    name: "v6e-4",
    gen: "v6e",
    chips: 4,
    hbm_per_chip: 32,
    total_hbm: 128,
    price_on_demand: 10.80,
    price_1yr: 7.56,
    price_3yr: 4.88,
    topology: "2x2",
    available: true,
    notes: "Strong for 7B–30B models",
  },
  {
    id: "v6e-8",
    name: "v6e-8",
    gen: "v6e",
    chips: 8,
    hbm_per_chip: 32,
    total_hbm: 256,
    price_on_demand: 21.60,
    price_1yr: 15.12,
    price_3yr: 9.76,
    topology: "2x4",
    available: true,
    notes: "Best single-host inference option today",
  },
  {
    id: "ironwood-4",
    name: "Ironwood ×4",
    gen: "ironwood",
    chips: 4,
    hbm_per_chip: 192,
    total_hbm: 768,
    price_on_demand: 48.00,
    price_1yr: 33.60,
    price_3yr: 21.60,
    topology: "4 chips",
    available: true,
    notes: "Large models, long context",
  },
  {
    id: "ironwood-8",
    name: "Ironwood ×8",
    gen: "ironwood",
    chips: 8,
    hbm_per_chip: 192,
    total_hbm: 1536,
    price_on_demand: 96.00,
    price_1yr: 67.20,
    price_3yr: 43.20,
    topology: "8 chips",
    available: true,
    notes: "405B+ models, massive KV caches",
  },
];

const MODELS = [
  {
    id: "gemma-2b",
    name: "Gemma 2B / 3B",
    params: 3,
    bf16_gb: 6,
    fp8_gb: 3,
    family: "gemma",
    hf_id: "google/gemma-2-2b-it",
    recommended_tp: 1,
    min_hbm: 6,
  },
  {
    id: "gemma-7b",
    name: "Gemma 7B / Llama 8B",
    params: 8,
    bf16_gb: 16,
    fp8_gb: 8,
    family: "gemma",
    hf_id: "google/gemma-7b-it",
    recommended_tp: 1,
    min_hbm: 16,
  },
  {
    id: "gemma-12b",
    name: "Gemma 12B / Mistral 12B",
    params: 12,
    bf16_gb: 24,
    fp8_gb: 12,
    family: "gemma",
    hf_id: "google/gemma-3-12b-it",
    recommended_tp: 2,
    min_hbm: 24,
  },
  {
    id: "llama-13b",
    name: "Llama 13B",
    params: 13,
    bf16_gb: 26,
    fp8_gb: 13,
    family: "llama",
    hf_id: "meta-llama/Llama-2-13b-hf",
    recommended_tp: 2,
    min_hbm: 26,
  },
  {
    id: "gemma-27b",
    name: "Gemma 27B / Gemma 4 27B",
    params: 27,
    bf16_gb: 54,
    fp8_gb: 27,
    family: "gemma",
    hf_id: "google/gemma-2-27b-it",
    recommended_tp: 4,
    min_hbm: 54,
  },
  {
    id: "llama-70b",
    name: "Llama 70B",
    params: 70,
    bf16_gb: 140,
    fp8_gb: 70,
    family: "llama",
    hf_id: "meta-llama/Llama-3.1-70B-Instruct",
    recommended_tp: 8,
    min_hbm: 140,
  },
  {
    id: "gemma4-31b",
    name: "Gemma 4 31B",
    params: 31,
    bf16_gb: 62,
    fp8_gb: 31,
    family: "gemma",
    hf_id: "google/gemma-4-31B-it",
    recommended_tp: 8,
    min_hbm: 62,
  },
  {
    id: "llama-405b",
    name: "Llama 405B",
    params: 405,
    bf16_gb: 810,
    fp8_gb: 405,
    family: "llama",
    hf_id: "meta-llama/Llama-3.1-405B-Instruct",
    recommended_tp: 8,
    min_hbm: 810,
  },
];

const GEN_COLORS = {
  v5e: { bg: "#EEF3FF", border: "#C3D2F5", text: "#2B4CBF", dot: "#4C6EF5" },
  v6e: { bg: "#E8FFF3", border: "#B2F2CC", text: "#155A2E", dot: "#2F9E44" },
  ironwood: { bg: "#FFF4E6", border: "#FECBA1", text: "#7C3800", dot: "#E8590C" },
};

const PRECISION_OVERHEAD = 1.25; // 25% overhead for KV cache + activations

function getCompatibleChips(model, precision) {
  const needed_gb = (precision === "bf16" ? model.bf16_gb : model.fp8_gb) * PRECISION_OVERHEAD;
  return TPU_CHIPS.filter((c) => c.total_hbm >= needed_gb);
}

function getTP(model, chip) {
  const needed = (model.bf16_gb * PRECISION_OVERHEAD);
  if (chip.total_hbm >= needed) {
    const tp = Math.max(1, Math.ceil(needed / chip.hbm_per_chip));
    const valid = [1, 2, 4, 8];
    return valid.find((v) => v >= tp) || chip.chips;
  }
  return null;
}

function FitBadge({ fits }) {
  if (!fits) return (
    <span style={{ fontSize: 11, fontWeight: 600, color: "#C92A2A", background: "#FFF5F5", border: "1px solid #FFC9C9", borderRadius: 4, padding: "2px 7px" }}>
      OOM
    </span>
  );
  return (
    <span style={{ fontSize: 11, fontWeight: 600, color: "#155A2E", background: "#E8FFF3", border: "1px solid #B2F2CC", borderRadius: 4, padding: "2px 7px" }}>
      Fits
    </span>
  );
}

function CostTag({ price }) {
  return (
    <span style={{ fontSize: 12, color: "#495057", fontFamily: "monospace" }}>
      ${price.toFixed(2)}/hr
    </span>
  );
}

export default function App() {
  const [selectedModel, setSelectedModel] = useState(MODELS[1]);
  const [precision, setPrecision] = useState("bf16");
  const [priceType, setPriceType] = useState("on_demand");
  const [view, setView] = useState("bymodel"); // bymodel | bychip

  const needed_gb = (precision === "bf16" ? selectedModel.bf16_gb : selectedModel.fp8_gb) * PRECISION_OVERHEAD;

  const priceKey = { on_demand: "price_on_demand", "1yr": "price_1yr", "3yr": "price_3yr" }[priceType];

  const chipRows = TPU_CHIPS.map((chip) => {
    const fits = chip.total_hbm >= needed_gb;
    const tp = fits ? getTP(selectedModel, chip) : null;
    const price = chip[priceKey];
    return { chip, fits, tp, price };
  });

  const vllmCommand = (() => {
    const compatible = chipRows.find((r) => r.fits && r.chip.gen !== "ironwood");
    if (!compatible) return null;
    const { chip, tp } = compatible;
    return `${selectedModel.hf_id} \
  --tensor-parallel-size ${tp} \
  --max-model-len 4096 \
  --dtype ${precision === "fp8" ? "fp8" : "bfloat16"} \
  --device tpu`;
  })();

  return (
    <div style={{ fontFamily: "'IBM Plex Mono', 'Courier New', monospace", maxWidth: 760, margin: "0 auto", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#868E96", marginBottom: 6 }}>
          #TPUSprint · vLLM Cheat Sheet
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: -0.5 }}>
          Model Size × TPU Chip
        </h1>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "var(--color-text-secondary)", fontFamily: "system-ui, sans-serif", lineHeight: 1.5 }}>
          Select a model and precision to see which chips fit, recommended tensor_parallel_size, and estimated hourly cost. Pricing from{" "}
          <a href="https://cloud.google.com/tpu/pricing" style={{ color: "var(--color-text-info)" }}>cloud.google.com/tpu/pricing</a>.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 20 }}>
        <div style={{ flex: "1 1 220px" }}>
          <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>
            Model
          </label>
          <select
            value={selectedModel.id}
            onChange={(e) => setSelectedModel(MODELS.find((m) => m.id === e.target.value))}
            style={{ width: "100%", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13 }}
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>{m.name} ({m.params}B)</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>
            Precision
          </label>
          <div style={{ display: "flex", gap: 6 }}>
            {["bf16", "fp8"].map((p) => (
              <button
                key={p}
                onClick={() => setPrecision(p)}
                style={{
                  padding: "6px 14px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace",
                  borderRadius: 4, cursor: "pointer", fontWeight: 600,
                  background: precision === p ? "var(--color-text-primary)" : "transparent",
                  color: precision === p ? "var(--color-background-primary)" : "var(--color-text-secondary)",
                  border: `1px solid ${precision === p ? "var(--color-text-primary)" : "var(--color-border-secondary)"}`,
                }}
              >
                {p.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", display: "block", marginBottom: 5 }}>
            Pricing
          </label>
          <div style={{ display: "flex", gap: 6 }}>
            {[["on_demand", "On-demand"], ["1yr", "1yr CUD"], ["3yr", "3yr CUD"]].map(([k, label]) => (
              <button
                key={k}
                onClick={() => setPriceType(k)}
                style={{
                  padding: "6px 10px", fontSize: 11, fontFamily: "'IBM Plex Mono', monospace",
                  borderRadius: 4, cursor: "pointer",
                  background: priceType === k ? "var(--color-text-primary)" : "transparent",
                  color: priceType === k ? "var(--color-background-primary)" : "var(--color-text-secondary)",
                  border: `1px solid ${priceType === k ? "var(--color-text-primary)" : "var(--color-border-secondary)"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Memory needed summary */}
      <div style={{ background: "var(--color-background-secondary)", border: "1px solid var(--color-border-tertiary)", borderRadius: 8, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 24, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Model</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>{selectedModel.name}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Weights ({precision.toUpperCase()})</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>{precision === "bf16" ? selectedModel.bf16_gb : selectedModel.fp8_gb} GB</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Est. total needed</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>{Math.ceil(needed_gb)} GB <span style={{ fontSize: 11, fontWeight: 400, color: "var(--color-text-tertiary)" }}>(+25% KV cache)</span></div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", letterSpacing: 1, textTransform: "uppercase", marginBottom: 2 }}>Recommended TP</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--color-text-primary)" }}>--tensor-parallel-size {selectedModel.recommended_tp}</div>
        </div>
      </div>

      {/* Chip grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 24 }}>
        {chipRows.map(({ chip, fits, tp, price }) => {
          const colors = GEN_COLORS[chip.gen];
          return (
            <div
              key={chip.id}
              style={{
                borderRadius: 8,
                border: `1px solid ${fits ? colors.border : "var(--color-border-tertiary)"}`,
                background: fits ? colors.bg : "var(--color-background-secondary)",
                padding: "12px 14px",
                opacity: fits ? 1 : 0.55,
                transition: "opacity 0.2s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: fits ? colors.text : "var(--color-text-tertiary)" }}>
                    {chip.gen}
                  </span>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "var(--color-text-primary)", lineHeight: 1.2 }}>
                    {chip.name}
                  </div>
                </div>
                <FitBadge fits={fits} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 0", marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>HBM total</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", textAlign: "right" }}>{chip.total_hbm} GB</div>
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Chips</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", textAlign: "right" }}>{chip.chips}</div>
                {fits && tp && (
                  <>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>tensor_parallel</div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: fits ? colors.text : "var(--color-text-primary)", textAlign: "right" }}>{tp}</div>
                  </>
                )}
                <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>Cost/hr</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--color-text-primary)", textAlign: "right" }}>${price.toFixed(2)}</div>
              </div>

              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "system-ui, sans-serif", lineHeight: 1.4, borderTop: "1px solid var(--color-border-tertiary)", paddingTop: 6 }}>
                {chip.notes}
              </div>
            </div>
          );
        })}
      </div>

      {/* vLLM command */}
      {vllmCommand && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 8 }}>
            Sample vLLM command (cheapest compatible chip)
          </div>
          <pre style={{
            background: "#0D1117",
            color: "#E6EDF3",
            borderRadius: 8,
            padding: "14px 16px",
            fontSize: 12,
            margin: 0,
            overflowX: "auto",
            lineHeight: 1.7,
            border: "1px solid #30363D",
          }}>
            <span style={{ color: "#79C0FF" }}>vllm</span>{" "}
            <span style={{ color: "#FFA657" }}>serve</span>{" "}
            {vllmCommand}
          </pre>
        </div>
      )}

      {/* Full matrix table */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "var(--color-text-secondary)", marginBottom: 10 }}>
          Full model × chip matrix
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border-secondary)" }}>
                <th style={{ textAlign: "left", padding: "6px 10px", color: "var(--color-text-secondary)", fontWeight: 500, whiteSpace: "nowrap" }}>Model</th>
                <th style={{ textAlign: "center", padding: "6px 6px", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>v5e-4<br /><span style={{ color: "var(--color-text-tertiary)" }}>64 GB</span></th>
                <th style={{ textAlign: "center", padding: "6px 6px", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>v5e-8<br /><span style={{ color: "var(--color-text-tertiary)" }}>128 GB</span></th>
                <th style={{ textAlign: "center", padding: "6px 6px", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>v6e-4<br /><span style={{ color: "var(--color-text-tertiary)" }}>128 GB</span></th>
                <th style={{ textAlign: "center", padding: "6px 6px", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>v6e-8<br /><span style={{ color: "var(--color-text-tertiary)" }}>256 GB</span></th>
                <th style={{ textAlign: "center", padding: "6px 6px", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>IW×4<br /><span style={{ color: "var(--color-text-tertiary)" }}>768 GB</span></th>
                <th style={{ textAlign: "center", padding: "6px 6px", color: "var(--color-text-secondary)", fontWeight: 500, fontSize: 11 }}>IW×8<br /><span style={{ color: "var(--color-text-tertiary)" }}>1536 GB</span></th>
              </tr>
            </thead>
            <tbody>
              {MODELS.map((model, i) => {
                const chips_to_show = ["v5e-4", "v5e-8", "v6e-4", "v6e-8", "ironwood-4", "ironwood-8"];
                return (
                  <tr
                    key={model.id}
                    style={{
                      borderBottom: "1px solid var(--color-border-tertiary)",
                      background: model.id === selectedModel.id ? "var(--color-background-secondary)" : "transparent",
                    }}
                    onClick={() => setSelectedModel(model)}
                    className="cursor-pointer"
                  >
                    <td style={{ padding: "7px 10px", whiteSpace: "nowrap", cursor: "pointer" }}>
                      <div style={{ fontWeight: model.id === selectedModel.id ? 700 : 400, color: "var(--color-text-primary)", fontSize: 12 }}>{model.name}</div>
                      <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{model.bf16_gb} GB BF16 / {model.fp8_gb} GB FP8</div>
                    </td>
                    {chips_to_show.map((cid) => {
                      const chip = TPU_CHIPS.find((c) => c.id === cid);
                      const needed = (precision === "bf16" ? model.bf16_gb : model.fp8_gb) * PRECISION_OVERHEAD;
                      const fits = chip.total_hbm >= needed;
                      const tp = fits ? getTP(model, chip) : null;
                      const colors = GEN_COLORS[chip.gen];
                      return (
                        <td key={cid} style={{ textAlign: "center", padding: "7px 4px" }}>
                          {fits ? (
                            <span style={{ display: "inline-block", fontSize: 11, fontWeight: 700, color: colors.text, background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 4, padding: "2px 6px", minWidth: 32 }}>
                              TP{tp}
                            </span>
                          ) : (
                            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 8, fontFamily: "system-ui, sans-serif" }}>
          TPn = recommended --tensor-parallel-size. Click any row to update the cards above. IW = Ironwood.
          Memory estimates include 25% overhead for KV cache and activations (current precision: {precision.toUpperCase()}).
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 12, borderTop: "1px solid var(--color-border-tertiary)" }}>
        {Object.entries(GEN_COLORS).map(([gen, c]) => (
          <div key={gen} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--color-text-secondary)", fontFamily: "system-ui, sans-serif" }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: c.dot, display: "inline-block" }} />
            {gen === "v5e" ? "TPU v5e ($1.20/chip/hr on-demand)" : gen === "v6e" ? "TPU v6e / Trillium ($2.70/chip/hr)" : "Ironwood v7 ($12.00/chip/hr)"}
          </div>
        ))}
        <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "system-ui, sans-serif", width: "100%", marginTop: 2 }}>
          Pricing: US region, on-demand. Source: cloud.google.com/tpu/pricing · Specs: docs.cloud.google.com/tpu
        </div>
      </div>
    </div>
  );
}
