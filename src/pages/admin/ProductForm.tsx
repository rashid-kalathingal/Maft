import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, Wand2, X, Upload, Star } from "lucide-react";
import { useData } from "@/stores/useData";
import { toast } from "@/stores/useToast";
import { Modal } from "@/components/ui/Modal";
import { Swatch } from "@/components/ui/Swatch";
import type { Colour, Product, ProductSpecification, ProductVariant } from "@/types";
import { slugify, uid, cn } from "@/lib/utils";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES, fileToResizedDataUrl } from "@/lib/imageUpload";

const MAX_IMAGES = 4;

interface VariantDraft {
  key: string;
  sizeId?: string;
  colourId?: string;
  sku: string;
  stock: number;
  isActive: boolean;
}

const comboKey = (sizeId?: string, colourId?: string) => `${sizeId ?? ""}|${colourId ?? ""}`;

function codeFromName(name: string): string {
  return name.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 3) || "VAR";
}

export function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, colours, sizes, saveProduct, saveColour } = useData();

  const existing = id ? products.find((p) => p.id === id) : undefined;
  const isEdit = !!existing;

  const [name, setName] = useState(existing?.name ?? "");
  const [sku, setSku] = useState(existing?.sku ?? "");
  const [categoryId, setCategoryId] = useState(existing?.categoryId ?? categories[0]?.id ?? "");
  const [shortDescription, setShort] = useState(existing?.shortDescription ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [packingInfo, setPacking] = useState(existing?.packingInfo ?? "");
  const [specs, setSpecs] = useState<ProductSpecification[]>(existing?.specifications ?? []);
  const [isActive, setActive] = useState(existing?.isActive ?? true);
  const [isFeatured, setFeatured] = useState(existing?.isFeatured ?? false);
  const [isNewArrival, setNew] = useState(existing?.isNewArrival ?? false);
  const [sortOrder, setSortOrder] = useState(existing?.sortOrder ?? products.length + 1);

  const [hasVariants, setHasVariants] = useState(existing ? existing.hasVariants || existing.variants.length > 0 : false);
  const [selColours, setSelColours] = useState<string[]>(
    existing ? [...new Set(existing.variants.map((v) => v.colourId).filter(Boolean) as string[])] : [],
  );
  const [selSizes, setSelSizes] = useState<string[]>(
    existing ? [...new Set(existing.variants.map((v) => v.sizeId).filter(Boolean) as string[])] : [],
  );
  const [singleStock, setSingleStock] = useState(existing && existing.variants.length === 0 ? existing.stockQuantity : 50);

  // Variant drafts, regenerated from selections while preserving manual edits.
  const [variantDrafts, setVariantDrafts] = useState<VariantDraft[]>(() =>
    (existing?.variants ?? []).map((v) => ({
      key: comboKey(v.sizeId, v.colourId),
      sizeId: v.sizeId,
      colourId: v.colourId,
      sku: v.sku,
      stock: v.stockQuantity,
      isActive: v.isActive,
    })),
  );

  const [imageUrls, setImageUrls] = useState<string[]>(existing?.imageUrls ?? []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [colourModal, setColourModal] = useState(false);
  const effectiveSku = sku.trim() || (existing?.sku ?? `MAFT-${Date.now().toString().slice(-6)}`);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_IMAGES - imageUrls.length;
    if (room <= 0) {
      toast.error(`You can upload up to ${MAX_IMAGES} images.`);
      return;
    }
    const chosen = Array.from(files).slice(0, room);
    setUploading(true);
    try {
      const added: string[] = [];
      for (const file of chosen) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image.`);
          continue;
        }
        if (file.size > MAX_IMAGE_BYTES) {
          toast.error(`${file.name} is too large (max 8MB).`);
          continue;
        }
        added.push(await fileToResizedDataUrl(file));
      }
      if (added.length) setImageUrls((prev) => [...prev, ...added].slice(0, MAX_IMAGES));
    } catch {
      toast.error("Could not process one of the images.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (i: number) => setImageUrls((prev) => prev.filter((_, j) => j !== i));
  const makePrimary = (i: number) =>
    setImageUrls((prev) => {
      if (i === 0) return prev;
      const next = [...prev];
      const [picked] = next.splice(i, 1);
      next.unshift(picked);
      return next;
    });

  const buildCombos = (): VariantDraft[] => {
    const cList = selColours.length ? selColours : [undefined];
    const sList = selSizes.length ? selSizes : [undefined];
    if (!selColours.length && !selSizes.length) return [];
    const existingByKey = new Map(variantDrafts.map((d) => [d.key, d]));
    const next: VariantDraft[] = [];
    for (const sizeId of sList) {
      for (const colourId of cList) {
        const key = comboKey(sizeId, colourId);
        const prev = existingByKey.get(key);
        if (prev) {
          next.push(prev);
        } else {
          const parts = [effectiveSku];
          const size = sizes.find((s) => s.id === sizeId);
          const colour = colours.find((c) => c.id === colourId);
          if (size) parts.push(size.label.replace(/[^a-z0-9]/gi, "").toUpperCase().slice(0, 5));
          if (colour) parts.push(codeFromName(colour.name));
          next.push({ key, sizeId, colourId, sku: parts.join("-"), stock: 50, isActive: true });
        }
      }
    }
    return next;
  };

  // Regenerate combos when selections change (and variants are enabled).
  useEffect(() => {
    if (!hasVariants) return;
    setVariantDrafts(buildCombos());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selColours, selSizes, hasVariants]);

  const availableSizes = useMemo(() => sizes.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder), [sizes]);
  const availableColours = useMemo(() => colours.filter((c) => c.isActive), [colours]);

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  const updateDraft = (key: string, patch: Partial<VariantDraft>) =>
    setVariantDrafts((d) => d.map((x) => (x.key === key ? { ...x, ...patch } : x)));
  const removeDraft = (key: string) => setVariantDrafts((d) => d.filter((x) => x.key !== key));

  const handleSave = (asDraft = false) => {
    if (!name.trim()) return toast.error("Product name is required.");
    if (!categoryId) return toast.error("Please choose a category.");

    const activeDrafts = hasVariants ? variantDrafts : [];

    // Validate unique SKUs within the product.
    const skuSet = new Set<string>();
    for (const d of activeDrafts) {
      if (skuSet.has(d.sku)) return toast.error(`Duplicate variant SKU: ${d.sku}`);
      skuSet.add(d.sku);
    }

    const finalSku = effectiveSku;
    const variants: ProductVariant[] = activeDrafts.map((d, i) => ({
      id: `${finalSku}-v${i + 1}`,
      productId: finalSku,
      sku: d.sku,
      sizeId: d.sizeId,
      colourId: d.colourId,
      stockQuantity: Math.max(0, d.stock),
      isActive: d.isActive,
    }));

    const now = new Date().toISOString();
    const product: Product = {
      id: existing?.id ?? finalSku,
      name: name.trim(),
      slug: existing?.slug ?? (slugify(name) || uid("product")),
      sku: finalSku,
      categoryId,
      shortDescription: shortDescription.trim() || `${name.trim()} from MAFT MARKETING.`,
      description: description.trim() || `${name.trim()} supplied by MAFT MARKETING, Manjeri.`,
      imageLabel: existing?.imageLabel ?? name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase(),
      hasVariants: variants.length > 1,
      variants,
      imageUrls: imageUrls.length ? imageUrls : undefined,
      specifications: specs.filter((s) => s.key.trim()),
      packingInfo: packingInfo.trim() || undefined,
      stockQuantity: variants.length === 0 ? Math.max(0, singleStock) : 0,
      isActive: asDraft ? false : isActive,
      isFeatured,
      isNewArrival,
      sortOrder,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    saveProduct(product);
    toast.success(isEdit ? "Product updated." : "Product created.");
    navigate("/admin/products");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <div className="flex items-center gap-3">
        <Link to="/admin/products" className="btn-ghost !px-2"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <h1 className="text-xl font-extrabold text-primary">{isEdit ? "Edit Product" : "Add Product"}</h1>
          <p className="text-sm text-muted">{isEdit ? existing?.sku : "Fill in the details and save."}</p>
        </div>
      </div>

      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product Name" required className="sm:col-span-2">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Cone/Kulfi Leg – Gold 6″" />
          </Field>
          <Field label="SKU / Product Code" hint="Auto-generated if left blank">
            <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} placeholder="MAFT-0001" disabled={isEdit} />
          </Field>
          <Field label="Category" required>
            <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Short Description" className="sm:col-span-2">
            <input className="input" value={shortDescription} onChange={(e) => setShort(e.target.value)} placeholder="One-line summary shown on cards" />
          </Field>
          <Field label="Detailed Description" className="sm:col-span-2">
            <textarea className="input min-h-24 resize-y" value={description} onChange={(e) => setDescription(e.target.value)} />
          </Field>
          <Field label="Packing Information" className="sm:col-span-2">
            <input className="input" value={packingInfo} onChange={(e) => setPacking(e.target.value)} placeholder="e.g. 60 PCS BOX" />
          </Field>
        </div>
      </Section>

      {/* Images */}
      <Section title={`Product Images (${imageUrls.length}/${MAX_IMAGES})`}>
        <div className="flex flex-wrap gap-3">
          {imageUrls.map((url, i) => (
            <div key={i} className="group relative h-28 w-28 overflow-hidden rounded-xl border border-line bg-surface">
              <img src={url} alt={`Product ${i + 1}`} className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 rounded-full bg-accent px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Primary
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/55 px-1.5 py-1 opacity-0 transition group-hover:opacity-100">
                {i !== 0 && (
                  <button type="button" onClick={() => makePrimary(i)} title="Make primary" className="text-white/90 hover:text-accent">
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button type="button" onClick={() => removeImage(i)} title="Remove" className="ml-auto text-white/90 hover:text-danger">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {imageUrls.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex h-28 w-28 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line text-muted transition hover:border-accent/50 hover:text-accent disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              <span className="text-xs font-semibold">{uploading ? "Uploading…" : "Upload"}</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES}
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <p className="mt-2 text-xs text-muted">
          Upload up to {MAX_IMAGES} photos (JPG, PNG or WebP). The first image is the primary — hover an
          image to make it primary or remove it. If no photos are uploaded, a category image is shown.
        </p>
      </Section>

      {/* Variants */}
      <Section
        title="Product Variations"
        action={
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-ink-soft">
            <input type="checkbox" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="h-4 w-4 rounded border-line text-accent" />
            This product has variants
          </label>
        }
      >
        {!hasVariants ? (
          <Field label="Stock Quantity">
            <input type="number" min={0} className="input w-40" value={singleStock} onChange={(e) => setSingleStock(parseInt(e.target.value, 10) || 0)} />
          </Field>
        ) : (
          <div className="space-y-5">
            {/* Sizes */}
            <div>
              <p className="label">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((s) => (
                  <button key={s.id} onClick={() => toggle(selSizes, s.id, setSelSizes)}
                    className={cn("rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                      selSizes.includes(s.id) ? "border-accent bg-accent/5 text-primary" : "border-line text-ink-soft hover:border-accent/50")}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colours */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="label !mb-0">Colours</p>
                <button onClick={() => setColourModal(true)} className="text-sm font-semibold text-accent hover:underline">
                  <Plus className="inline h-3.5 w-3.5" /> Add New Colour
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableColours.map((c) => (
                  <button key={c.id} onClick={() => toggle(selColours, c.id, setSelColours)}
                    className={cn("flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium transition",
                      selColours.includes(c.id) ? "border-accent bg-accent/5 text-primary" : "border-line text-ink-soft hover:border-accent/50")}>
                    <Swatch colour={c} size={15} /> {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Variant table */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="label !mb-0">Variant Combinations ({variantDrafts.length})</p>
                {(selColours.length > 0 || selSizes.length > 0) && (
                  <button onClick={() => setVariantDrafts(buildCombos())} className="text-sm font-semibold text-accent hover:underline">
                    <Wand2 className="inline h-3.5 w-3.5" /> Regenerate
                  </button>
                )}
              </div>
              {variantDrafts.length === 0 ? (
                <p className="rounded-lg border border-dashed border-line bg-surface px-4 py-6 text-center text-sm text-muted">
                  Select at least one size or colour to generate variants.
                </p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-line">
                  <table className="w-full text-sm">
                    <thead className="bg-surface text-left text-xs uppercase tracking-wide text-muted">
                      <tr>
                        <th className="px-3 py-2 font-semibold">Size</th>
                        <th className="px-3 py-2 font-semibold">Colour</th>
                        <th className="px-3 py-2 font-semibold">SKU</th>
                        <th className="px-3 py-2 font-semibold">Stock</th>
                        <th className="px-3 py-2 font-semibold">Active</th>
                        <th className="px-3 py-2"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {variantDrafts.map((d) => {
                        const size = sizes.find((s) => s.id === d.sizeId);
                        const colour = colours.find((c) => c.id === d.colourId);
                        return (
                          <tr key={d.key}>
                            <td className="px-3 py-2 text-ink-soft">{size?.label ?? "—"}</td>
                            <td className="px-3 py-2">
                              {colour ? <span className="inline-flex items-center gap-1.5"><Swatch colour={colour} size={13} /> {colour.name}</span> : "—"}
                            </td>
                            <td className="px-3 py-2">
                              <input className="input !py-1.5 text-xs" value={d.sku} onChange={(e) => updateDraft(d.key, { sku: e.target.value })} />
                            </td>
                            <td className="px-3 py-2">
                              <input type="number" min={0} className="input !w-20 !py-1.5 text-xs" value={d.stock} onChange={(e) => updateDraft(d.key, { stock: parseInt(e.target.value, 10) || 0 })} />
                            </td>
                            <td className="px-3 py-2">
                              <input type="checkbox" checked={d.isActive} onChange={(e) => updateDraft(d.key, { isActive: e.target.checked })} className="h-4 w-4 rounded border-line text-accent" />
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button onClick={() => removeDraft(d.key)} className="rounded p-1 text-muted hover:text-danger" title="Remove variant"><Trash2 className="h-4 w-4" /></button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-2 text-xs text-muted">Not every combination needs to exist — remove the ones you don't stock, or set them inactive.</p>
            </div>
          </div>
        )}
      </Section>

      {/* Specifications */}
      <Section title="Specifications">
        <div className="space-y-2">
          {specs.map((s, i) => (
            <div key={i} className="flex gap-2">
              <input className="input" placeholder="Key (e.g. Material)" value={s.key} onChange={(e) => setSpecs(specs.map((x, j) => j === i ? { ...x, key: e.target.value } : x))} />
              <input className="input" placeholder="Value (e.g. Metal)" value={s.value} onChange={(e) => setSpecs(specs.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
              <button onClick={() => setSpecs(specs.filter((_, j) => j !== i))} className="btn-outline !px-3" aria-label="Remove specification"><X className="h-4 w-4" /></button>
            </div>
          ))}
          <button onClick={() => setSpecs([...specs, { key: "", value: "" }])} className="btn-outline text-sm"><Plus className="h-4 w-4" /> Add Specification</button>
        </div>
      </Section>

      {/* Visibility */}
      <Section title="Visibility">
        <div className="grid gap-4 sm:grid-cols-2">
          <Toggle label="Active (visible on website)" checked={isActive} onChange={setActive} />
          <Toggle label="Featured Product" checked={isFeatured} onChange={setFeatured} />
          <Toggle label="New Arrival" checked={isNewArrival} onChange={setNew} />
          <Field label="Display Order">
            <input type="number" className="input w-28" value={sortOrder} onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)} />
          </Field>
        </div>
      </Section>

      {/* Actions */}
      <div className="sticky bottom-0 flex flex-wrap items-center gap-3 border-t border-line bg-surface/80 py-4 backdrop-blur">
        <button onClick={() => handleSave(false)} className="btn-primary"><Save className="h-4 w-4" /> {isEdit ? "Save Changes" : "Save Product"}</button>
        {!isEdit && <button onClick={() => handleSave(true)} className="btn-outline">Save as Draft</button>}
        <Link to="/admin/products" className="btn-ghost ml-auto">Cancel</Link>
      </div>

      {colourModal && (
        <AddColourModal
          onClose={() => setColourModal(false)}
          existing={colours}
          onSave={(c) => { saveColour(c); setSelColours((s) => [...s, c.id]); setColourModal(false); toast.success(`Colour "${c.name}" added.`); }}
        />
      )}
    </div>
  );
}

function AddColourModal({ onClose, onSave, existing }: { onClose: () => void; onSave: (c: Colour) => void; existing: Colour[] }) {
  const [cname, setCname] = useState("");
  const [hex, setHex] = useState("#b08d57");
  const [hex2, setHex2] = useState("");
  const [composite, setComposite] = useState(false);

  const save = () => {
    if (!cname.trim()) return toast.error("Colour name is required.");
    if (existing.some((c) => c.name.toLowerCase() === cname.trim().toLowerCase())) return toast.error("A colour with this name already exists.");
    onSave({ id: uid("col"), name: cname.trim(), hexCode: hex, secondaryHexCode: composite ? hex2 : undefined, isActive: true });
  };

  return (
    <Modal open onClose={onClose} title="Add New Colour" size="sm"
      footer={<div className="flex justify-end gap-3"><button onClick={onClose} className="btn-outline">Cancel</button><button onClick={save} className="btn-primary">Save Colour</button></div>}
    >
      <div className="space-y-4">
        <Field label="Colour Name" required><input className="input" value={cname} onChange={(e) => setCname(e.target.value)} placeholder="e.g. Antique Brass" /></Field>
        <div className="flex items-end gap-3">
          <Field label="Hex / Primary"><input type="color" className="h-10 w-16 cursor-pointer rounded border border-line" value={hex} onChange={(e) => setHex(e.target.value)} /></Field>
          <label className="mb-2 flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={composite} onChange={(e) => setComposite(e.target.checked)} className="h-4 w-4 rounded border-line text-accent" /> Two-tone finish
          </label>
          {composite && <Field label="Secondary"><input type="color" className="h-10 w-16 cursor-pointer rounded border border-line" value={hex2 || "#c9a227"} onChange={(e) => setHex2(e.target.value)} /></Field>}
        </div>
        <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
          <Swatch colour={{ id: "preview", name: cname, hexCode: hex, secondaryHexCode: composite ? hex2 || "#c9a227" : undefined, isActive: true }} size={32} />
          <span className="text-sm font-medium text-ink">{cname || "Preview"}</span>
        </div>
      </div>
    </Modal>
  );
}

function Section({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="card p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-bold text-primary">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, hint, className, children }: { label: string; required?: boolean; hint?: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={className}>
      <label className="label">{label} {required && <span className="text-danger">*</span>} {hint && <span className="font-normal text-muted">· {hint}</span>}</label>
      {children}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-soft">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-line text-accent" />
      {label}
    </label>
  );
}
