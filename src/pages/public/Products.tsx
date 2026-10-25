import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  ShieldCheck,
  Layers,
  Headphones,
  Package,
  X,
} from "lucide-react";
import { useData } from "@/stores/useData";
import { ProductCard } from "@/components/public/ProductCard";
import { QuickAddModal } from "@/components/public/QuickAddModal";
import type { Product } from "@/types";
import {
  productColourIds,
  productInStock,
  productSizeIds,
} from "@/lib/catalogue";
import { cn } from "@/lib/utils";
import { SITE_IMAGES } from "@/data/images";

type SortKey = "default" | "name-asc" | "name-desc" | "newest" | "featured";

export function Products() {
  const { products, categories, colours, sizes } = useData();
  const [params, setParams] = useSearchParams();
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Show more states for filter groups
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllColours, setShowAllColours] = useState(false);
  const [showAllSizes, setShowAllSizes] = useState(false);

  // Accordion collapsed states
  const [catOpen, setCatOpen] = useState(true);
  const [colOpen, setColOpen] = useState(true);
  const [sizeOpen, setSizeOpen] = useState(true);
  const [availOpen, setAvailOpen] = useState(true);

  const q = params.get("q") ?? "";
  const activeCategories = (params.get("category") ?? "").split(",").filter(Boolean);
  const activeColours = (params.get("colour") ?? "").split(",").filter(Boolean);
  const activeSizes = (params.get("size") ?? "").split(",").filter(Boolean);
  const availability = params.get("stock") ?? "all";
  const sort = (params.get("sort") as SortKey) ?? "default";
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const perPage = 16;

  const update = (patch: Record<string, string | null>, resetPage = true) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === "") next.delete(k);
      else next.set(k, v);
    });
    if (resetPage) next.delete("page");
    setParams(next, { replace: true });
  };

  const toggleIn = (key: string, value: string, current: string[]) => {
    const set = new Set(current);
    set.has(value) ? set.delete(value) : set.add(value);
    const arr = [...set];
    update({ [key]: arr.length > 0 ? arr.join(",") : null });
  };

  const clearAll = () => {
    setParams(new URLSearchParams(), { replace: true });
  };

  const activeCategoryObjs = categories.filter((c) => activeCategories.includes(c.slug));

  // Filter products
  const filtered = useMemo(() => {
    let list = products.filter((p) => p.isActive);

    if (q.trim()) {
      const needle = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(needle) ||
          p.sku.toLowerCase().includes(needle) ||
          p.shortDescription.toLowerCase().includes(needle)
      );
    }
    if (activeCategoryObjs.length) {
      const ids = new Set(activeCategoryObjs.map((c) => c.id));
      list = list.filter((p) => ids.has(p.categoryId));
    }
    if (activeColours.length) {
      list = list.filter((p) => productColourIds(p).some((id) => activeColours.includes(id)));
    }
    if (activeSizes.length) {
      list = list.filter((p) => productSizeIds(p).some((id) => activeSizes.includes(id)));
    }
    if (availability === "in") list = list.filter(productInStock);
    if (availability === "out") list = list.filter((p) => !productInStock(p));

    switch (sort) {
      case "name-asc":
        list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        list = [...list].sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "newest":
        list = [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        break;
      case "featured":
        list = [...list].sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured));
        break;
      default:
        list = [...list].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return list;
  }, [products, q, activeCategoryObjs, activeColours, activeSizes, availability, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // Counts for filters
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.filter((p) => p.isActive).forEach((p) => {
      counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
    });
    return counts;
  }, [products]);

  const colourCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.filter((p) => p.isActive).forEach((p) => {
      productColourIds(p).forEach((cid) => {
        counts[cid] = (counts[cid] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  const sizeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.filter((p) => p.isActive).forEach((p) => {
      productSizeIds(p).forEach((sid) => {
        counts[sid] = (counts[sid] || 0) + 1;
      });
    });
    return counts;
  }, [products]);

  const inStockCount = useMemo(
    () => products.filter((p) => p.isActive && productInStock(p)).length,
    [products]
  );
  const outOfStockCount = useMemo(
    () => products.filter((p) => p.isActive && !productInStock(p)).length,
    [products]
  );

  const activeCategoriesList = categories.filter((c) => c.isActive);
  const visibleCategories = showAllCategories
    ? activeCategoriesList
    : activeCategoriesList.slice(0, 5);

  const activeColoursList = colours.filter((c) => c.isActive);
  const visibleColours = showAllColours ? activeColoursList : activeColoursList.slice(0, 6);

  const activeSizesList = sizes.filter((s) => s.isActive);
  const visibleSizes = showAllSizes ? activeSizesList : activeSizesList.slice(0, 5);

  const hasActiveFilters =
    activeCategories.length > 0 ||
    activeColours.length > 0 ||
    activeSizes.length > 0 ||
    availability !== "all" ||
    Boolean(q);

  // Filters Sidebar Component
  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#ece8df]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-[#1c1813]" />
          <h2 className="text-sm font-bold text-[#1c1813]">Filters</h2>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-[#8e5927] hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <button
          onClick={() => setCatOpen(!catOpen)}
          className="flex w-full items-center justify-between py-1 text-xs font-bold text-[#1c1813] tracking-wide"
        >
          <span>Category</span>
          {catOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#888]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#888]" />}
        </button>

        {catOpen && (
          <div className="mt-3 space-y-2.5">
            {visibleCategories.map((c) => {
              const checked = activeCategories.includes(c.slug);
              const count = categoryCounts[c.id] || 0;
              return (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center justify-between text-xs text-[#4a4238] hover:text-[#1c1813]"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleIn("category", c.slug, activeCategories)}
                      className="h-4 w-4 rounded border-[#cec6b8] text-[#8e5927] focus:ring-[#8e5927]"
                    />
                    <span className={cn(checked && "font-semibold text-[#1c1813]")}>
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8c8479]">({count})</span>
                </label>
              );
            })}

            {activeCategoriesList.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#8e5927] hover:underline"
              >
                {showAllCategories ? "Show Less" : "Show More"}
                {showAllCategories ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Colour Filter */}
      <div className="pt-2 border-t border-[#f0ede6]">
        <button
          onClick={() => setColOpen(!colOpen)}
          className="flex w-full items-center justify-between py-1 text-xs font-bold text-[#1c1813] tracking-wide"
        >
          <span>Colour</span>
          {colOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#888]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#888]" />}
        </button>

        {colOpen && (
          <div className="mt-3 space-y-2.5">
            {visibleColours.map((c) => {
              const checked = activeColours.includes(c.id);
              const count = colourCounts[c.id] || 0;
              return (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center justify-between text-xs text-[#4a4238] hover:text-[#1c1813]"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleIn("colour", c.id, activeColours)}
                      className="h-4 w-4 rounded border-[#cec6b8] text-[#8e5927] focus:ring-[#8e5927]"
                    />
                    <span
                      className="h-3 w-3 rounded-full border border-black/15 shrink-0"
                      style={{ backgroundColor: c.hexCode }}
                    />
                    <span className={cn(checked && "font-semibold text-[#1c1813]")}>
                      {c.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8c8479]">({count})</span>
                </label>
              );
            })}

            {activeColoursList.length > 6 && (
              <button
                type="button"
                onClick={() => setShowAllColours(!showAllColours)}
                className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#8e5927] hover:underline"
              >
                {showAllColours ? "Show Less" : "Show More"}
                {showAllColours ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="pt-2 border-t border-[#f0ede6]">
        <button
          onClick={() => setSizeOpen(!sizeOpen)}
          className="flex w-full items-center justify-between py-1 text-xs font-bold text-[#1c1813] tracking-wide"
        >
          <span>Size</span>
          {sizeOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#888]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#888]" />}
        </button>

        {sizeOpen && (
          <div className="mt-3 space-y-2.5">
            {visibleSizes.map((s) => {
              const checked = activeSizes.includes(s.id);
              const count = sizeCounts[s.id] || 0;
              return (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-center justify-between text-xs text-[#4a4238] hover:text-[#1c1813]"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleIn("size", s.id, activeSizes)}
                      className="h-4 w-4 rounded border-[#cec6b8] text-[#8e5927] focus:ring-[#8e5927]"
                    />
                    <span className={cn(checked && "font-semibold text-[#1c1813]")}>
                      {s.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8c8479]">({count})</span>
                </label>
              );
            })}

            {activeSizesList.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllSizes(!showAllSizes)}
                className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-[#8e5927] hover:underline"
              >
                {showAllSizes ? "Show Less" : "Show More"}
                {showAllSizes ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Availability Filter */}
      <div className="pt-2 border-t border-[#f0ede6]">
        <button
          onClick={() => setAvailOpen(!availOpen)}
          className="flex w-full items-center justify-between py-1 text-xs font-bold text-[#1c1813] tracking-wide"
        >
          <span>Availability</span>
          {availOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#888]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#888]" />}
        </button>

        {availOpen && (
          <div className="mt-3 space-y-2.5">
            <label className="flex cursor-pointer items-center justify-between text-xs text-[#4a4238] hover:text-[#1c1813]">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={availability === "in"}
                  onChange={() => update({ stock: availability === "in" ? null : "in" })}
                  className="h-4 w-4 rounded border-[#cec6b8] text-[#8e5927] focus:ring-[#8e5927]"
                />
                <span className={cn(availability === "in" && "font-semibold text-[#1c1813]")}>
                  In Stock
                </span>
              </div>
              <span className="text-[11px] text-[#8c8479]">({inStockCount})</span>
            </label>

            <label className="flex cursor-pointer items-center justify-between text-xs text-[#4a4238] hover:text-[#1c1813]">
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={availability === "out"}
                  onChange={() => update({ stock: availability === "out" ? null : "out" })}
                  className="h-4 w-4 rounded border-[#cec6b8] text-[#8e5927] focus:ring-[#8e5927]"
                />
                <span className={cn(availability === "out" && "font-semibold text-[#1c1813]")}>
                  Out of Stock
                </span>
              </div>
              <span className="text-[11px] text-[#8c8479]">({outOfStockCount})</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fcfaf7]">
      {/* ===================== BANNER / HERO ===================== */}
      <section className="relative overflow-hidden border-b border-[#ece7de] bg-[#faf7f2]">
        <div className="container-app py-8 sm:py-10">
          <div className="grid items-center gap-6 lg:grid-cols-12">
            {/* Left Banner Text */}
            <div className="lg:col-span-7">
              <h1 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-extrabold tracking-tight text-[#1c1813]">
                Our <span className="text-[#935a2b]">Products</span>
              </h1>
              <p className="mt-3 text-xs sm:text-sm text-[#5e554a] max-w-xl leading-relaxed">
                Explore a wide range of furniture hardware, recliner mechanisms, sofa legs, fittings,
                upholstery accessories, and essential materials for furniture manufacturing.
              </p>

              {/* Trust badges */}
              <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-[#524a40]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Layers className="h-4 w-4 text-[#8e5927]" />
                  <span>Wide Range</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-4 w-4 text-[#8e5927]" />
                  <span>Quality Focused</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <Headphones className="h-4 w-4 text-[#8e5927]" />
                  <span>Dedicated Support</span>
                </div>
              </div>
            </div>

            {/* Right Banner Visual Showcase */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <span className="font-script absolute right-4 top-2 z-10 text-3xl text-[#baa482] tracking-wide drop-shadow-sm pointer-events-none">
                Premium Furniture Solutions
              </span>
              <div className="h-44 w-full overflow-hidden rounded-2xl border border-[#e8e2d5] bg-white shadow-card flex items-center justify-center p-2">
                <img
                  src={SITE_IMAGES.hero}
                  alt="Premium hardware"
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MAIN CONTENT: SIDEBAR + GRID ===================== */}
      <div className="container-app py-8">
        <div className="flex gap-8">
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-[#ece8df] bg-white p-5 shadow-xs">
              <FilterPanel />
            </div>
          </aside>

          {/* Right Product Area */}
          <div className="min-w-0 flex-1">
            {/* Top Bar above Product Grid */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[#ece8df] pb-4">
              {/* Product Count & Mobile filter toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#ded8ce] bg-white px-3 py-1.5 text-xs font-semibold text-[#1c1813] lg:hidden hover:bg-[#faf7f2]"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Filters</span>
                </button>
                <h2 className="text-base font-extrabold text-[#1c1813]">
                  {filtered.length} Products
                </h2>
              </div>

              {/* Right Controls: Sort & Grid View Switcher */}
              <div className="flex items-center gap-3 ml-auto">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#736b61]">Sort by</span>
                  <select
                    value={sort}
                    onChange={(e) => update({ sort: e.target.value === "default" ? null : e.target.value })}
                    className="rounded-lg border border-[#ded8ce] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#1c1813] focus:border-[#8e5927] focus:outline-none cursor-pointer"
                  >
                    <option value="default">Default</option>
                    <option value="name-asc">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="newest">Newest</option>
                    <option value="featured">Featured</option>
                  </select>
                </div>

                {/* View switcher buttons */}
                <div className="flex items-center rounded-lg border border-[#ded8ce] bg-white p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md transition",
                      viewMode === "grid" ? "bg-[#8e5927] text-white" : "text-[#777] hover:bg-[#faf7f2]"
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md transition",
                      viewMode === "list" ? "bg-[#8e5927] text-white" : "text-[#777] hover:bg-[#faf7f2]"
                    )}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Empty state */}
            {pageItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-[#ece8df] bg-white py-16 text-center">
                <Package className="h-12 w-12 text-[#c4bbb0]" />
                <h3 className="mt-4 text-base font-bold text-[#1c1813]">No products found</h3>
                <p className="mt-1 text-xs text-[#686055]">Try adjusting your search or filters.</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="mt-4 rounded-lg bg-[#8e5927] px-4 py-2 text-xs font-semibold text-white shadow-sm"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* 4-column Product Grid */}
                <div
                  className={cn(
                    "grid gap-3 sm:gap-4",
                    viewMode === "grid"
                      ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                      : "grid-cols-1"
                  )}
                >
                  {pageItems.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      category={categories.find((c) => c.id === p.categoryId)}
                      colours={colours}
                      sizes={sizes}
                      onQuickAdd={setQuickAdd}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      disabled={safePage <= 1}
                      onClick={() => update({ page: String(safePage - 1) }, false)}
                      className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#ded8ce] bg-white px-2.5 sm:px-3 text-xs font-semibold text-[#1c1813] transition hover:bg-[#faf7f2] disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                      <button
                        key={n}
                        onClick={() => update({ page: String(n) }, false)}
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition",
                          n === safePage
                            ? "bg-[#8e5927] text-white"
                            : "border border-[#ded8ce] bg-white text-[#1c1813] hover:bg-[#faf7f2]"
                        )}
                      >
                        {n}
                      </button>
                    ))}
                    <button
                      disabled={safePage >= totalPages}
                      onClick={() => update({ page: String(safePage + 1) }, false)}
                      className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-[#ded8ce] bg-white px-2.5 sm:px-3 text-xs font-semibold text-[#1c1813] transition hover:bg-[#faf7f2] disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#ece8df] px-4 py-4">
              <h2 className="text-sm font-bold text-[#1c1813]">Filters</h2>
              <button
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted hover:bg-surface"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <FilterPanel />
            </div>
            <div className="border-t border-[#ece8df] p-4">
              <button
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-lg bg-[#8e5927] py-2.5 text-xs font-semibold text-white shadow-sm"
              >
                Show {filtered.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {quickAdd && <QuickAddModal product={quickAdd} onClose={() => setQuickAdd(null)} />}
    </div>
  );
}
